# Testing Guide

## Test Stack

- **Unit tests**: Vitest with jsdom environment
- **DOM testing**: @testing-library/dom
- **E2E tests**: Playwright
- **API mocking**: MSW (Mock Service Worker)
- **Accessibility**: axe-core

## Running Tests

```bash
npm test              # All unit tests
npm run test:watch    # Watch mode
npm run test:coverage # With coverage report
npm run test:e2e      # Playwright E2E tests
```

## Writing Tests

Place tests next to source files as `*.test.js` or in `tests/`:

- `src/**/*.test.js` — Unit tests for modules
- `tests/components/*.test.js` — Component tests
- `tests/e2e/*.spec.js` — E2E test suites
- `tests/setup/` — Test helpers and mocks

## Coverage Targets

- Unit/integration: >80% lines, branches, functions
- Component tests covering all UI states
