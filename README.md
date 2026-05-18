# 🏋️ Fitness Apps — Family Edition

Two self-contained fitness tracking websites, organized in separate folders:

```
fitness-apps/
├── recomp-zakeer/    🔥 Zakeer's plan (RECOMP)
│   ├── index.html
│   ├── README.md
│   └── .nojekyll
│
└── recomp-aadila/    🌸 Aadila's plan (BLOOM)
    ├── index.html
    ├── README.md
    └── .nojekyll
```

Each app is **completely self-contained** — one HTML file with everything: design, code, data, and storage. No installation, no build tools, no servers. Just open and use.

---

## 🖥️ How to View Locally (Easiest Method)

1. **Unzip this folder** to anywhere on your computer (Documents is great)
2. Open the `fitness-apps` folder
3. Go into either `recomp-zakeer` or `recomp-aadila`
4. **Double-click `index.html`** — it opens in your browser
5. Use the app — everything works including localStorage saving

**Pro tip:** For best results, drag `index.html` into Chrome or Firefox (instead of opening in Safari).

### Want it to behave exactly like the deployed version?

Install **VS Code** (free) and the **"Live Server"** extension. Then:
1. Open the folder in VS Code
2. Right-click `index.html` → "Open with Live Server"
3. App opens at `http://localhost:5500` with auto-refresh on edits

---

## 🌐 How to Deploy to GitHub Pages (Free Hosting)

Each app deploys separately to its own URL. Here's how:

### For RECOMP (Zakeer's app):
1. Sign in to [github.com](https://github.com)
2. Create a new public repo called `recomp` (or `zakeer-fitness`)
3. Click **"uploading an existing file"**
4. Drag everything from the `recomp-zakeer` folder (including the hidden `.nojekyll`)
5. Commit changes
6. Go to **Settings → Pages**, select `main` branch, save
7. Your app goes live at `https://YOUR_USERNAME.github.io/recomp/`

### For BLOOM (Aadila's app):
Same steps, but create a separate repo called `bloom` (or `aadila-fitness`). It gets its own URL.

---

## 📱 How to Use as an App on Your Phone

After deploying, open the live URL on your phone:
- **iPhone (Safari):** Tap Share → "Add to Home Screen"
- **Android (Chrome):** Tap ⋮ menu → "Install app" or "Add to Home Screen"

Now it lives on your home screen and opens like a native app.

---

## 💾 Where Your Data Is Stored

All your tracking data (meals eaten, protein logged, workout days) is saved in your browser's **localStorage**:

- **RECOMP** uses storage key `recomp-app-v1`
- **BLOOM** uses storage key `bloom-app-v1`

They're completely separate, so both can run on the same browser without conflicts.

**Important:** The data is tied to the URL. So data saved locally (`file://`) is separate from data saved on `localhost` is separate from data on `github.io`. We recommend using the deployed GitHub Pages version on your phone so the data is consistent across sessions.

---

## 🎨 Customizing

Open `index.html` in any text editor (or VS Code). Find these arrays near the bottom of the file to customize:
- **MEALS** — add/remove meal options
- **TODAY_PLAN** — change which meals appear on the dashboard
- **TIPS** — update principles
- For Aadila: **SAFE_FOODS** and **AVOID_FOODS** for the IBS guide

Re-upload to GitHub after editing and changes go live in ~30 seconds.

---

## 🆘 Troubleshooting

**"The app looks broken / fonts don't load"**
You need an internet connection on first load (it pulls Google Fonts). After that it works offline.

**"My data disappeared!"**
You probably cleared browser data, or switched browsers/devices. localStorage is per-browser. Use the deployed GitHub Pages version for the most reliable storage.

**"Charts aren't showing"**
Make sure JavaScript is enabled in your browser.

---

Built with care for the fitness journey. 💪🌸
