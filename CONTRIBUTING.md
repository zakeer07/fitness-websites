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

## Pull requests

1. Branch from `main`
2. Make changes
3. `make lint` passes locally
4. Open a PR — GitHub Actions runs the same checks

## Live site

Merging to `main` updates GitHub Pages (~30 seconds):

- https://zakeer07.github.io/fitness-websites/

## App structure

- `recomp-zakeer/` — Zakeer's RECOMP tracker
- `recomp-aadila/` — Aadila's BLOOM tracker
- Root `index.html` — landing page chooser

Each app is a single `index.html`; data lives in the browser (`localStorage`).
