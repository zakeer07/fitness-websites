# Contributing

Thanks for helping improve the fitness trackers. This repo is static HTML (no build step), with quality checks via [pre-commit](https://pre-commit.com/).

## One-time setup

**Requirements:** Python 3.10+, Node.js 18+, and Git.

```bash
# From the repo root
make setup
```

Or manually:

```bash
pip install -r requirements-dev.txt
npm install
pre-commit install
```

After that, every `git commit` runs checks automatically. Fix issues, stage the fixes, and commit again.

## Run checks without committing

```bash
make lint
# or
pre-commit run --all-files
```

## What runs on each commit

| Check                     | Purpose                               |
| ------------------------- | ------------------------------------- |
| Trailing whitespace / EOF | Clean diffs                           |
| YAML / JSON syntax        | Valid config files                    |
| Large files               | Block accidental big binaries         |
| Private keys              | Prevent credential leaks              |
| Prettier                  | Consistent HTML & Markdown formatting |
| Codespell                 | Typos in Markdown (HTML skipped)      |

## Branch workflow (dev → production)

| Branch | When            | Live URL                                         |
| ------ | --------------- | ------------------------------------------------ |
| `dev`  | Push to `dev`   | https://zakeer07.github.io/fitness-websites/dev/ |
| `main` | Merge to `main` | https://zakeer07.github.io/fitness-websites/     |

**Typical flow:**

```bash
git checkout dev
# make changes, commit
git push origin dev
# → dev site updates in ~1 minute

git checkout main
git merge dev
git push origin main
# → production site updates in ~1 minute
```

Feature branches: open a PR into `dev` (or `main`). CI runs on every PR.

## Pull requests

1. Branch from `dev` (for features) or `main` (for hotfixes)
2. Make changes
3. `make lint` passes locally
4. Open a PR — GitHub Actions runs checks
5. Merge to `dev` to preview on the dev site
6. Merge `dev` → `main` when ready for production

## GitHub Pages setup (one time)

In the repo on GitHub: **Settings → Pages**

1. **Source:** Deploy from a branch
2. **Branch:** `gh-pages` / `/ (root)`
3. Save

Deployments are pushed to the `gh-pages` branch by GitHub Actions (`deploy-dev.yml` and `deploy-production.yml`). You do not need to push to `gh-pages` yourself.

## Live sites

- **Production:** https://zakeer07.github.io/fitness-websites/
- **Dev:** https://zakeer07.github.io/fitness-websites/dev/

## App structure

- `recomp-zakeer/` — Zakeer's RECOMP tracker
- `recomp-aadila/` — Aadila's BLOOM tracker
- Root `index.html` — landing page chooser

Each app is a single `index.html`; data lives in the browser (`localStorage`).
