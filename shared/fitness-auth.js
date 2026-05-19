/**
 * Fitness Apps — auth + per-user app state (Supabase or local IndexedDB).
 */
(function (global) {
  const SESSION_KEY = "fitness-auth-session";
  const DB_NAME = "fitness-auth-v1";
  const DB_VERSION = 1;

  let supabaseClient = null;
  let config = null;

  function getConfig() {
    if (config !== null) return config;
    config = global.FITNESS_AUTH_CONFIG || null;
    if (
      config &&
      config.supabaseUrl &&
      config.supabaseAnonKey &&
      !config.supabaseUrl.includes("YOUR_PROJECT")
    ) {
      return config;
    }
    return null;
  }

  function isCloudEnabled() {
    return !!getConfig() && !!supabaseClient;
  }

  function getSession() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function setSession(session) {
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else localStorage.removeItem(SESSION_KEY);
  }

  function loginUrl() {
    const path = location.pathname;
    if (path.includes("/recomp-zakeer")) return "../";
    if (path.includes("/recomp-aadila")) return "../";
    if (path.includes("/dev/")) return "../../";
    return "./";
  }

  function resolveLoginUrl(explicit) {
    if (explicit) return explicit;
    const base = loginUrl();
    const appMatch = location.pathname.match(/recomp-(zakeer|aadila)/);
    if (appMatch) {
      const sep = base.includes("?") ? "&" : "?";
      return base + sep + "next=recomp-" + appMatch[1];
    }
    return base;
  }

  function appHref(appSlug) {
    const path = location.pathname;
    if (path.includes("/dev/")) return "../" + appSlug + "/";
    return appSlug + "/";
  }

  async function initSupabase() {
    const cfg = getConfig();
    if (!cfg || !global.supabase) return null;
    if (!supabaseClient) {
      supabaseClient = global.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);
    }
    return supabaseClient;
  }

  function openDb() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onerror = () => reject(req.error);
      req.onsuccess = () => resolve(req.result);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains("users")) {
          const users = db.createObjectStore("users", { keyPath: "id" });
          users.createIndex("email", "email", { unique: true });
        }
        if (!db.objectStoreNames.contains("app_states")) {
          db.createObjectStore("app_states", { keyPath: ["userId", "appId"] });
        }
      };
    });
  }

  async function hashPassword(password, saltB64) {
    const enc = new TextEncoder();
    const salt = Uint8Array.from(atob(saltB64), (c) => c.charCodeAt(0));
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      enc.encode(password),
      "PBKDF2",
      false,
      ["deriveBits"]
    );
    const bits = await crypto.subtle.deriveBits(
      { name: "PBKDF2", salt, iterations: 120000, hash: "SHA-256" },
      keyMaterial,
      256
    );
    return btoa(String.fromCharCode(...new Uint8Array(bits)));
  }

  function randomSalt() {
    const arr = new Uint8Array(16);
    crypto.getRandomValues(arr);
    return btoa(String.fromCharCode(...arr));
  }

  function uid() {
    return crypto.randomUUID();
  }

  const LEGACY_CLOUD_APP_IDS = ["recomp-zakeer", "recomp-aadila"];

  function scopedStorageKey(baseKey) {
    const session = getSession();
    if (session?.userId) return baseKey + "-" + session.userId;
    return baseKey;
  }

  function absorbGlobalStorageCache(baseKey) {
    const session = getSession();
    if (!session?.userId) return;
    const scopedKey = scopedStorageKey(baseKey);
    const global = localStorage.getItem(baseKey);
    if (global && !localStorage.getItem(scopedKey)) {
      localStorage.setItem(scopedKey, global);
    }
    localStorage.removeItem(baseKey);
  }

  async function localSignUp(email, password, displayName) {
    const db = await openDb();
    const normalized = email.trim().toLowerCase();
    const existing = await new Promise((resolve, reject) => {
      const tx = db.transaction("users", "readonly");
      const idx = tx.objectStore("users").index("email");
      const r = idx.get(normalized);
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error);
    });
    if (existing) throw new Error("An account with this email already exists.");

    const salt = randomSalt();
    const hash = await hashPassword(password, salt);
    const user = {
      id: uid(),
      email: normalized,
      displayName: (displayName || normalized.split("@")[0]).trim(),
      salt,
      hash,
      createdAt: Date.now(),
    };
    await new Promise((resolve, reject) => {
      const tx = db.transaction("users", "readwrite");
      tx.objectStore("users").add(user);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    return { userId: user.id, email: user.email, displayName: user.displayName };
  }

  async function localSignIn(email, password) {
    const db = await openDb();
    const normalized = email.trim().toLowerCase();
    const user = await new Promise((resolve, reject) => {
      const tx = db.transaction("users", "readonly");
      const r = tx.objectStore("users").index("email").get(normalized);
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error);
    });
    if (!user) throw new Error("No account found for this email.");
    const hash = await hashPassword(password, user.salt);
    if (hash !== user.hash) throw new Error("Incorrect password.");
    return { userId: user.id, email: user.email, displayName: user.displayName };
  }

  async function localLoadAppState(userId, appId) {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("app_states", "readonly");
      const r = tx.objectStore("app_states").get([userId, appId]);
      r.onsuccess = () => resolve(r.result ? r.result.state : null);
      r.onerror = () => reject(r.error);
    });
  }

  async function localSaveAppState(userId, appId, state) {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("app_states", "readwrite");
      tx.objectStore("app_states").put({
        userId,
        appId,
        state,
        updatedAt: Date.now(),
      });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async function signUp(email, password, displayName) {
    const sb = await initSupabase();
    if (sb) {
      const { data, error } = await sb.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { display_name: displayName || email.split("@")[0] } },
      });
      if (error) throw error;
      if (!data.session) {
        throw new Error("Check your email to confirm your account, then sign in.");
      }
      const u = data.user;
      const session = {
        userId: u.id,
        email: u.email,
        displayName: u.user_metadata?.display_name || displayName || "Athlete",
        mode: "supabase",
      };
      setSession(session);
      return session;
    }
    const local = await localSignUp(email, password, displayName);
    const session = { ...local, mode: "local" };
    setSession(session);
    return session;
  }

  async function signIn(email, password) {
    const sb = await initSupabase();
    if (sb) {
      const { data, error } = await sb.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
      const u = data.user;
      const session = {
        userId: u.id,
        email: u.email,
        displayName: u.user_metadata?.display_name || u.email?.split("@")[0] || "Athlete",
        mode: "supabase",
      };
      setSession(session);
      return session;
    }
    const local = await localSignIn(email, password);
    const session = { ...local, mode: "local" };
    setSession(session);
    return session;
  }

  async function setNewPassword(password) {
    const sb = await initSupabase();
    if (!sb) throw new Error("Password update requires a Supabase account.");
    const { error } = await sb.auth.updateUser({ password });
    if (error) throw error;
  }

  async function resetPassword(email) {
    const sb = await initSupabase();
    if (!sb) throw new Error("Password reset requires a Supabase account. Local accounts cannot reset passwords.");
    const redirectTo = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, "/");
    const { error } = await sb.auth.resetPasswordForEmail(email.trim(), { redirectTo });
    if (error) throw error;
  }

  async function signOut() {
    const sb = await initSupabase();
    if (sb) await sb.auth.signOut();
    localStorage.removeItem("fitness-app-v1");
    setSession(null);
  }

  async function restoreSupabaseSession() {
    const sb = await initSupabase();
    if (!sb) return null;
    const { data } = await sb.auth.getSession();
    if (!data.session?.user) return null;
    const u = data.session.user;
    const session = {
      userId: u.id,
      email: u.email,
      displayName: u.user_metadata?.display_name || u.email?.split("@")[0] || "Athlete",
      mode: "supabase",
    };
    setSession(session);
    return session;
  }

  async function loadAppStateOnce(appId) {
    const session = getSession();
    if (!session) return null;

    if (session.mode === "supabase" && supabaseClient) {
      const { data, error } = await supabaseClient
        .from("app_state")
        .select("state")
        .eq("app_id", appId)
        .maybeSingle();
      if (error) throw error;
      return data?.state ?? null;
    }
    return localLoadAppState(session.userId, appId);
  }

  async function loadAppState(appId) {
    let state = await loadAppStateOnce(appId);
    if (state || appId !== "fitness") return state;

    for (const legacyId of LEGACY_CLOUD_APP_IDS) {
      const legacy = await loadAppStateOnce(legacyId);
      if (legacy && typeof legacy === "object") {
        try {
          await saveAppState("fitness", legacy);
        } catch (e) {
          console.warn("Cloud migrate to fitness app_id failed:", e);
        }
        return legacy;
      }
    }
    return null;
  }

  async function saveAppState(appId, state) {
    const session = getSession();
    if (!session) return;

    if (session.mode === "supabase" && supabaseClient) {
      const { error } = await supabaseClient.from("app_state").upsert(
        {
          user_id: session.userId,
          app_id: appId,
          state,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,app_id" }
      );
      if (error) throw error;
      return;
    }
    await localSaveAppState(session.userId, appId, state);
  }

  async function requireAuth(options) {
    const { appId, loginHref } = options || {};
    await initSupabase();
    if (!getSession()) await restoreSupabaseSession();
    if (!getSession()) {
      const target = resolveLoginUrl(loginHref);
      const sep = target.includes("?") ? "&" : "?";
      location.href = target + (appId ? sep + "next=" + encodeURIComponent(appId) : "");
      return false;
    }
    return true;
  }

  async function hydrateStateFromCloud(appId, localStorageKey, defaultState) {
    absorbGlobalStorageCache(localStorageKey);
    const key = scopedStorageKey(localStorageKey);

    try {
      const cloud = await loadAppState(appId);
      if (cloud && typeof cloud === "object") {
        localStorage.setItem(key, JSON.stringify(cloud));
        return cloud;
      }
    } catch (e) {
      console.warn("Cloud sync load failed:", e);
    }

    const local = localStorage.getItem(key);
    return local ? JSON.parse(local) : { ...defaultState };
  }

  function scheduleCloudSave(appId, state, localStorageKey) {
    absorbGlobalStorageCache(localStorageKey);
    const key = scopedStorageKey(localStorageKey);
    localStorage.setItem(key, JSON.stringify(state));
    if (!getSession()) return;
    clearTimeout(scheduleCloudSave._timer);
    scheduleCloudSave._timer = setTimeout(async () => {
      try {
        await saveAppState(appId, state);
      } catch (e) {
        console.warn("Cloud sync save failed:", e);
      }
    }, 400);
  }

  global.FitnessAuth = {
    getConfig,
    isCloudEnabled,
    getSession,
    setSession,
    scopedStorageKey,
    loginUrl,
    resolveLoginUrl,
    appHref,
    initSupabase,
    signUp,
    signIn,
    setNewPassword,
    resetPassword,
    signOut,
    restoreSupabaseSession,
    loadAppState,
    saveAppState,
    requireAuth,
    hydrateStateFromCloud,
    scheduleCloudSave,
  };
})(window);
