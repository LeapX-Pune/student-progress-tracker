# Todo List — `feat/project-setup-and-tooling`

## Branch Summary

Project setup, tooling, and CI/CD configuration for the Student Progress
Tracker.

**Commits:** 13 | **Files changed:** 33 | **Base:** `develop`

---

## Completed Tasks

### Commit 01 — npm init + build tooling

- [x] Update `package.json` with scripts, devDependencies, engines, browserslist
- [x] Create `.nvmrc` pinned to Node 20

### Commit 02 — ESLint + Prettier config

- [x] Create `eslint.config.js` (flat config, import-x, jsdoc, promise plugins)
- [x] Create `.prettierrc` (singleQuote, trailingComma, printWidth 100)
- [x] Create `.prettierignore`

### Commit 03 — Husky + lint-staged + commitlint

- [x] Create `lint-staged.config.js`
- [x] Create `commitlint.config.js`
- [x] Create `.husky/pre-commit` (runs lint-staged)
- [x] Create `.husky/commit-msg` (runs commitlint)

### Commit 04 — Environment configuration

- [x] Create `.env.example` (VITE_ variables, API config, feature flags)
- [x] Create `src/config/env.js` (getEnv helper, validated ENV export)

### Commit 05 — JSON Server mock API

- [x] Create `mock-api/db.json` (students, courses, quizScores,
      gradeDistribution, weeklyProgress)
- [x] Create `mock-api/routes.json` (/api/* route mappings)
- [x] Fix: Downgrade json-server to v0.17.4 (v1.0 removed --routes flag)

### Commit 06 — Vitest unit testing setup

- [x] Verify existing vitest setup (tests/setup.test.js — 3 tests passing)
- [x] Create `tests/verify.test.js` (3 placeholder tests)
- [x] Fix: Add `exclude: ['tests/e2e/**']` to vitest.config.js (Playwright
      conflict)

### Commit 07 — Playwright E2E testing setup

- [x] Create `tests/e2e/smoke.test.js` (dev server load + title check)
- [x] Verify playwright.config.js exists

### Commit 08 — Dev and production build scripts

- [x] Create `scripts/dev.js` (esbuild watch + JSON Server)
- [x] Create `scripts/build.js` (production bundle to dist/)
- [x] Fix: Add Node.js globals to ESLint config for scripts/

### Commit 09 — GitHub Actions CI/CD pipeline

- [x] Create `.github/workflows/ci.yml` (lint, test, build, E2E jobs)
- [x] Create `.github/CODEOWNERS` (review assignments)
- [x] Create `.github/dependabot.yml` (weekly dependency updates)
- [x] Create `.github/ISSUE_TEMPLATE/task.md`

### Additional fixes

- [x] Install `@eslint/js` (peer dependency for ESLint 10)
- [x] Relax commitlint rules (disable subject-case, scope-enum)
- [x] Add ESLint globals for scripts/ directory

---

## Files Created/Modified

| File                             | Action   | Commit |
| -------------------------------- | -------- | ------ |
| `package.json`                   | Modified | 01     |
| `.nvmrc`                         | Created  | 01     |
| `eslint.config.js`               | Created  | 02     |
| `.prettierrc`                    | Created  | 02     |
| `.prettierignore`                | Created  | 02     |
| `lint-staged.config.js`          | Created  | 03     |
| `commitlint.config.js`           | Created  | 03     |
| `.husky/pre-commit`              | Created  | 03     |
| `.husky/commit-msg`              | Created  | 03     |
| `.env.example`                   | Created  | 04     |
| `src/config/env.js`              | Created  | 04     |
| `mock-api/db.json`               | Created  | 05     |
| `mock-api/routes.json`           | Created  | 05     |
| `tests/verify.test.js`           | Created  | 06     |
| `vitest.config.js`               | Modified | 06     |
| `tests/e2e/smoke.test.js`        | Created  | 07     |
| `scripts/dev.js`                 | Created  | 08     |
| `scripts/build.js`               | Created  | 08     |
| `.github/workflows/ci.yml`       | Created  | 09     |
| `.github/CODEOWNERS`             | Created  | 09     |
| `.github/dependabot.yml`         | Created  | 09     |
| `.github/ISSUE_TEMPLATE/task.md` | Created  | 09     |
| `.editorconfig`                  | Created  | —      |
| `.vscode/settings.json`          | Created  | —      |
| `.vscode/extensions.json`        | Created  | —      |
| `src/main.js`                    | Created  | —      |
| `public/index.html`              | Moved    | —      |

---

## Test Results

| Check                  | Status |
| ---------------------- | ------ |
| `npm run lint`         | Pass   |
| `npm run format:check` | Pass   |
| `npm test` (6 tests)   | Pass   |
| `npx eslint scripts/`  | Pass   |
| `npm run build`        | Pass   |
| Mock API routes        | Pass   |

---

## Known Limitations

- `src/main.js` is a placeholder — real app entry point not yet implemented
- `scripts/dev.js` doesn't start a static file server (use
  `npx serve public -p 3000` separately)
- E2E tests require dev server running in a separate terminal
- CODEOWNERS team names need to be updated to match actual GitHub org
- No deploy workflows yet (Part 12)
