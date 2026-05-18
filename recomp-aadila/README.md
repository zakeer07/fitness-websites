# 🌸 BLOOM — Toned & Strong Tracker

A mobile-first, IBS-friendly fitness tracker built specifically for Aadila's strength + shape goals.

**Features:**

- 🌸 **Dashboard** — Calorie progress ring, protein bar, gut status indicator
- 🍽️ **Meals** — 14 IBS-friendly meal options across 5 categories (Breakfast / Lunch / Snack / Peri-WO / Dinner)
- 🌿 **IBS Guide** — Complete safe foods + triggers reference with flare day adjustments
- 📈 **Tracker** — 30-day rolling log with breakfast column, workout toggle, status badges
- 💡 **Tips** — 10 principles for strength + shape

**Goal targets:** 1700–1900 kcal, 90–105g protein, 4 weekly workouts (2 Orange 60 + 2 Strength 50)

---

## 🚀 Deploy to GitHub Pages — Same as Zakeer's

Follow the deployment instructions in the parent fitness-apps folder. Just upload `index.html` and `README.md` to a new GitHub repo, enable Pages, and you're live.

Suggested repo name: `bloom-tracker` or `aadila-fitness`

---

## 🎨 Customization

All data lives inside `index.html`:

- **MEALS** array — add/edit/remove meal options
- **TODAY_PLAN** — adjust today's default meal slots
- **TIPS** — update principles
- **SAFE_FOODS** & **AVOID_FOODS** — customize IBS guide
- **getCalTarget()** — change workout/rest day calorie targets
- Colors in `:root` CSS variables (deep plum + rose theme)

---

## 🔒 Privacy

All data saved locally in browser. Storage key is `bloom-app-v1` so it lives separately from Zakeer's app (`recomp-app-v1`) — even if you open both on the same browser, they won't mix data.
