# Accounts & login

## How it works

1. Open the **site home page** (not the app URL directly).
2. **Create account** or **Sign in** with email + password.
3. Pick **RECOMP** or **BLOOM** — each person can use either tracker.
4. Set goals in **Profile** (name dropdown). Tracker and meals save to **your account**.

Pre-made accounts: sign up as yourself (e.g. `zakeer@…`, `aadila@…`) — there are no shared passwords.

## Storage modes

### Local accounts (default)

Works immediately with **no setup**. Accounts and data live in this browser (IndexedDB). Good for testing on one device; not synced to your phone until you add Supabase.

### Cloud sync (Supabase, optional)

1. Create a free project at [supabase.com](https://supabase.com).
2. Run `supabase/schema.sql` in **SQL Editor**.
3. Copy `shared/auth-config.example.js` → `shared/auth-config.js` and paste **Project URL** + **anon key**.
4. Redeploy or refresh — sign-in then syncs across devices.

In Supabase **Authentication → Providers**, enable Email and (for quick testing) you may disable “Confirm email”.

## URLs

| Page       | Path                               |
| ---------- | ---------------------------------- |
| Sign in    | `/fitness-websites/`               |
| Zakeer app | `/fitness-websites/recomp-zakeer/` |
| Aadila app | `/fitness-websites/recomp-aadila/` |

Opening an app without signing in redirects to the home page.
