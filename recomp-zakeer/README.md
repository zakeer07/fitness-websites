# 🔥 RECOMP — Body Recomposition Tracker

A clean, mobile-first web app for tracking your body recomp plan. Built as a single HTML file — zero build steps, zero dependencies, works offline after first load.

**Features:**
- ⚡ Dashboard with daily progress ring, protein bar, and meal schedule
- 🍽️ Browse 11 pre-loaded meal options by category
- 📈 30-day tracker with workout toggle, per-meal protein input, and auto-calculated totals
- 💡 10 key principles for body recomposition
- 🌙 Dark mode by default with a clean editorial aesthetic
- 💾 Saves everything to your browser locally — no accounts, no tracking
- 📱 Fully responsive — works on phone, tablet, and desktop

---

## 🚀 Deploy to GitHub Pages (Free) — 5 Minutes

### Step 1: Create a GitHub repository
1. Go to [github.com](https://github.com) and sign in (or create a free account)
2. Click the **+** in the top-right → **New repository**
3. Name it something like `recomp` or `meal-tracker`
4. Set it to **Public**
5. **Don't** initialize with a README (we already have one)
6. Click **Create repository**

### Step 2: Upload the files
**Option A — Drag & drop (easiest):**
1. On your new empty repo page, click **uploading an existing file**
2. Drag `index.html` and `README.md` into the browser window
3. Scroll down, click **Commit changes**

**Option B — Git command line:**
```bash
git clone https://github.com/YOUR_USERNAME/recomp.git
cd recomp
# Copy index.html and README.md into this folder
git add .
git commit -m "Initial commit"
git push
```

### Step 3: Enable GitHub Pages
1. In your repo, click **Settings** (top right of repo page)
2. In the left sidebar, click **Pages**
3. Under **Branch**, select `main` and `/ (root)`, click **Save**
4. Wait ~30 seconds, then refresh the page
5. You'll see: **"Your site is live at `https://YOUR_USERNAME.github.io/recomp/`"** 🎉

### Step 4: Open on your phone
- Visit the URL above on your phone
- In Safari: tap the **Share** icon → **Add to Home Screen**
- In Chrome: tap the **⋮** menu → **Install app** or **Add to Home Screen**
- Now it lives on your phone like a native app

---

## 🎨 Customization

All your data and config live inside `index.html`:

- **Meals:** Find the `MEALS` array near the bottom and edit/add/remove items
- **Today's plan:** Find `TODAY_PLAN` and adjust which meals show on the dashboard
- **Tips:** Find the `TIPS` array to update principles
- **Targets:** Find `getCalTarget()` to change workout day vs rest day calorie targets
- **Colors:** Edit the `:root` CSS variables at the top of the `<style>` block

After editing, commit the changes to GitHub and they'll auto-deploy in ~30 seconds.

---

## 📁 File Structure
```
recomp/
├── index.html       # The entire app (HTML + CSS + JS)
└── README.md        # This file
```

That's it. No `node_modules`, no `package.json`, no build pipeline.

---

## 🔒 Privacy

All your data is stored in your browser's `localStorage`. Nothing leaves your device. No tracking, no analytics, no servers, no accounts. If you clear your browser data, the app data clears too — so consider backing up the JSON periodically (open DevTools → Application → Local Storage → copy the `recomp-app-v1` value).

---

## 💪 Built for

5'10", 75kg body recomposition: 1900–2100 kcal on workout days, 1660 kcal on rest days, 110–125g protein daily, 4 weekly OrangeTheory workouts (2 Orange 60 + 2 Strength 50).

Customize for your own stats by editing the constants in `index.html`.
