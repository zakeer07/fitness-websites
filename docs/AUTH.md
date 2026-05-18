# Accounts & login

## How it works

1. Open the **site home page** (not the app URL directly).
2. **Create account** or **Sign in** with email + password.
3. Pick **RECOMP** or **BLOOM** — themes only; **one account** holds your data. The sign-in screen explains the differences (breakfast row, IBS tab default, colors). Either is fine to start.
4. Set goals in **Profile** (name dropdown). Build **your own meal library** on the Meals tab (new accounts start empty).
5. Optional: **Import example meals** if you want a starter pack — nobody gets Zakeer’s or Aadila’s menu by default.

Sign up as yourself — there are no shared passwords.

## Storage modes

### Local accounts (default)

Works immediately with **no setup**. Accounts and data live in this browser (IndexedDB). Good for testing on one device; not synced to your phone until you add Supabase.

### Cloud sync (Supabase, optional)

1. Create a free project at [supabase.com](https://supabase.com).
2. Run `supabase/schema.sql` in **SQL Editor** (new projects).
3. **Existing projects:** also run `supabase/migrate-to-fitness.sql` so old `recomp-zakeer` / `recomp-aadila` rows merge into `fitness`.
4. Copy `shared/auth-config.example.js` → `shared/auth-config.js` and paste **Project URL** + **anon key**.
5. Redeploy or refresh — sign-in then syncs across devices.

**Privacy:** App data is cached in the browser per user (`fitness-app-v1-<userId>`). Logging out clears the shared unscoped cache so another account on the same device does not see the previous user’s data.

In Supabase **Authentication → Providers**, enable Email and (for quick testing) you may disable “Confirm email”.

## URLs

| Page       | Path                               |
| ---------- | ---------------------------------- |
| Sign in    | `/fitness-websites/`               |
| Zakeer app | `/fitness-websites/recomp-zakeer/` |
| Aadila app | `/fitness-websites/recomp-aadila/` |

Opening an app without signing in redirects to the home page.
