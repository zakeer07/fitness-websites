# Fitness App — Family Edition

One app, two themes. Sign in and pick **RECOMP** (red/teal) or **BLOOM** (pink/purple) in your profile — same account, same data, just different colors and defaults.

```
fitness-apps/
├── index.html          ← Sign-in page (start here)
├── recomp-zakeer/      ← The app (both RECOMP and BLOOM themes)
│   └── index.html
├── recomp-aadila/      ← Redirects to recomp-zakeer/
└── shared/             ← Auth, meal library, UI utilities
```

---

## How to View Locally

1. Open the `fitness-apps` folder
2. Double-click `index.html` — sign in or create an account
3. You'll land in the app automatically

**Pro tip:** Drag `index.html` into Chrome or Firefox (Safari can have issues with local file storage).

### Live Server (recommended for development)

Install **VS Code** and the **"Live Server"** extension, then:

1. Open the folder in VS Code
2. Right-click `index.html` → "Open with Live Server"
3. App opens at `http://localhost:5500` with auto-refresh on edits

---

## Live sites (auto-deploy)

| Environment     | When                  | URL                                              |
| --------------- | --------------------- | ------------------------------------------------ |
| **Production**  | Merge to `main`       | https://zakeer07.github.io/fitness-websites/     |
| **Dev preview** | Open a PR into `main` | https://zakeer07.github.io/fitness-websites/dev/ |

**App URL:** https://zakeer07.github.io/fitness-websites/recomp-zakeer/

Branch off `main`, open a PR — the dev site shows your PR branch. Merge for production. See [CONTRIBUTING.md](CONTRIBUTING.md).

---

## How to Use as an App on Your Phone

Open the live URL on your phone:

- **iPhone (Safari):** Tap Share → "Add to Home Screen"
- **Android (Chrome):** Tap ⋮ menu → "Install app" or "Add to Home Screen"

---

## Where Your Data Is Stored

Tracking data is saved in your browser's **localStorage** under key `fitness-app-v1`, scoped per user account. If cloud sync (Supabase) is configured, data follows you across devices automatically.

**Important:** Data is tied to the URL — `file://`, `localhost`, and `github.io` each have separate storage. Use the deployed GitHub Pages version for consistent data across sessions.

---

## Themes

Switch theme anytime in **Profile → Theme**:

- **RECOMP** — red/teal, workout schedule Mon/Wed/Fri/Sun, IBS guide off by default
- **BLOOM** — pink/purple, workout schedule Mon/Tue/Thu/Fri, IBS guide on by default

Both themes share the same account, data, and features.

---

## Customizing

Open `recomp-zakeer/index.html` in any text editor. Key arrays near the bottom:

- **MEALS** — add/remove meal options
- **SAFE_FOODS** / **AVOID_FOODS** — IBS guide food lists
- **TIPS** — daily principles

---

## Troubleshooting

**"The app looks broken / fonts don't load"**
You need an internet connection on first load (pulls Google Fonts). Works offline after that.

**"My data disappeared!"**
You probably cleared browser data or switched browsers/devices. localStorage is per-browser. Use the deployed GitHub Pages version for reliable storage.

**"Charts aren't showing"**
Make sure JavaScript is enabled in your browser.

---

## Development (pre-commit)

This repo uses [pre-commit](https://pre-commit.com/) so formatting and basic checks run before each commit.

```bash
make setup    # once: install hooks
make lint     # run all checks manually
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for details. Pull requests run the same checks in GitHub Actions.
