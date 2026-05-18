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

## Branch workflow (PR preview → production)

| When                                | What deploys                | URL                                              |
| ----------------------------------- | --------------------------- | ------------------------------------------------ |
| Open or update a **PR into `main`** | That PR’s branch → dev site | https://zakeer07.github.io/fitness-websites/dev/ |
| **Merge PR to `main`**              | Production                  | https://zakeer07.github.io/fitness-websites/     |

**Typical flow:**

```bash
git checkout main
git pull origin main
git checkout -b feature/my-change

# edit, commit
git push -u origin feature/my-change
```

Open a **pull request → `main`** on GitHub. Within ~1 minute:

- CI runs checks on the PR
- **Deploy dev (PR preview)** puts your branch on the dev site
- A comment on the PR links to the dev URL

When you **merge** the PR, production updates automatically.

You do not need a long-lived `dev` branch — your **feature branch + PR** is the dev preview.

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
