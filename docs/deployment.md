# Deployment Guide

## Overview

This project is deployed to **GitHub Pages** via GitHub Actions. The CI/CD
pipeline automatically builds and deploys on every push to `develop`
(production) and on every pull request (preview).

## Environments

| Environment    | Trigger                     | URL                                                                   |
| -------------- | --------------------------- | --------------------------------------------------------------------- |
| **Preview**    | Pull Request opened/updated | `https://leapx-pune.github.io/student-progress-tracker/pr-preview/N/` |
| **Production** | Push to `develop`           | `https://leapx-pune.github.io/student-progress-tracker/`              |

## Workflows

### CI (`ci.yml`)

Triggers on push/PR to `main` and `develop`. Runs in parallel:

1. **Lint & Format** — ESLint, Prettier with auto-fix on PRs
2. **Type Check** — `tsc --noEmit` (JSDoc annotations)
3. **Unit Tests** — `vitest run --coverage` (threshold: 70% lines)
4. **Production Build** — esbuild bundle (blocked by lint + typecheck + test)
5. **E2E Tests** — Playwright against production build
6. **Bundle Size** — validates `main.js` < 500KB
7. **Security Audit** — `npm audit` (non-blocking)

### Deploy Preview (`deploy-preview.yml`)

Triggers on PR open/sync/reopen (non-draft). Builds with `--env staging` and
pushes to the `gh-pages` branch under `pr-preview/{number}/`.

### Deploy Production (`deploy-prod.yml`)

Triggers on push to `develop`. Builds with `--env production` and pushes to the
`gh-pages` branch root.

### Cleanup Preview (`deploy-preview-cleanup.yml`)

Triggers on PR close. Removes the corresponding `pr-preview/{number}/` directory
from `gh-pages` branch.

## Build

The production build uses **esbuild** directly (`scripts/build.js`):

```bash
npm run build                    # production (default)
node scripts/build.js --env staging   # staging/preview
node scripts/build.js --env production
```

### CLI flags

| Flag     | Values                                 | Default      |
| -------- | -------------------------------------- | ------------ |
| `--base` | Path prefix for assets                 | `/`          |
| `--env`  | `development`, `staging`, `production` | `production` |

### Environment Variables (Build-time)

| Variable                        | Purpose                          |
| ------------------------------- | -------------------------------- |
| `VITE_API_BASE_URL`             | API base URL for all requests    |
| `VITE_ENABLE_MOCK_API`          | Enable mock API interceptors     |
| `VITE_API_MOCK_ENABLED`         | Same (dual compat)               |
| `VITE_APP_ENV`                  | `development/staging/production` |
| `VITE_ENABLE_ANALYTICS`         | Analytics feature flag           |
| `VITE_API_TIMEOUT`              | API request timeout (ms)         |
| `VITE_AUTH_TOKEN_KEY`           | localStorage key for auth        |
| `VITE_AUTH_REMEMBER_DAYS`       | Session persistence duration     |
| `VITE_AUTH_REDIRECT_KEY`        | Post-login redirect key          |
| `VITE_CACHE_TTL_SECONDS`        | API response cache TTL           |
| `VITE_CHART_ANIMATION_DURATION` | Chart.js animation duration      |
| `VITE_CHART_RESPONSIVE`         | Chart auto-resize                |
| `VITE_SESSION_TIMEOUT_MINUTES`  | Inactivity timeout               |
| `VITE_ENABLE_PWA`               | PWA feature flag                 |
| `VITE_ENABLE_NOTIFICATIONS`     | Notification feature flag        |

## SPA Routing

GitHub Pages does not support SPA fallback natively. This project handles it
with two mechanisms:

1. **`404.html`** — GitHub Pages serves this file for any 404. The page
   redirects to `index.html` via `<meta http-equiv="refresh">`.
2. **`_redirects`** — Netlify-compatible format for static hosts that support it
   (Netlify, some CI previews).

Additionally, `.nojekyll` is written at build time to disable Jekyll processing
on GitHub Pages.

## Monitoring & Observability

| Area            | Tool          | Status     |
| --------------- | ------------- | ---------- |
| Uptime          | GitHub Pages  | Built-in   |
| JS Errors       | Sentry        | Not set up |
| Core Web Vitals | Lighthouse CI | Not set up |
| API Latency     | Custom timing | Not set up |

## Manual Deployment

To deploy manually from your local machine:

```bash
npm run build
npx serve dist -p 4173
# Open http://localhost:4173 to verify

# Then push dist to gh-pages manually (not recommended — use the workflow):
# npx gh-pages -d dist
```
