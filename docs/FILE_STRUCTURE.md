# Student Progress Tracking SaaS - Detailed File Structure

## Project Root Structure

```
student-progress-tracker/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                 # GitHub Actions CI pipeline
│   │   ├── deploy-preview.yml     # Deploy preview on PR
│   │   └── deploy-production.yml  # Deploy to production on release
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   ├── feature_request.md
│   │   └── task_template.md
│   └── PULL_REQUEST_TEMPLATE.md
├── project-docs/                  # This documentation folder
│   ├── Student_Progress_Tracking_SaaS_Detailed_PRD.md
│   ├── FILE_STRUCTURE.md
│   ├── PROJECT_PARTS.md
│   ├── GIT_WORKFLOW.md
│   ├── MODULE_AUTHENTICATION.md
│   ├── MODULE_DASHBOARD.md
│   ├── MODULE_COURSE_PROGRESS.md
│   ├── MODULE_GRADE_CHARTS.md
│   ├── MODULE_API_INTEGRATION.md
│   ├── MODULE_DATA_PERSISTENCE.md
│   ├── MODULE_ERROR_HANDLING.md
│   ├── MODULE_RESPONSIVE_DESIGN.md
│   ├── MODULE_DEPLOYMENT.md
│   └── MODULE_TESTING_QA.md
├── public/
│   ├── index.html                 # Main HTML entry point
│   ├── favicon.ico
│   ├── manifest.json              # PWA manifest (future)
│   ├── robots.txt
│   └── assets/
│       ├── images/
│       │   ├── avatar-placeholder.svg
│       │   ├── course-placeholder.svg
│       │   └── logo.svg
│       └── fonts/
├── src/
│   ├── index.js                   # Application entry point
│   ├── app.js                     # App initialization, routing, global event bus
│   ├── styles/
│   │   ├── main.css               # Main stylesheet (Tailwind @import + custom)
│   │   ├── components.css         # Component-specific styles
│   │   ├── charts.css             # Chart.js customizations
│   │   ├── animations.css         # Keyframes, transitions
│   │   └── utilities.css          # Custom utility classes
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.js
│   │   │   ├── LoginForm.test.js
│   │   │   ├── AuthGuard.js
│   │   │   └── UserAvatar.js
│   │   ├── dashboard/
│   │   │   ├── DashboardLayout.js
│   │   │   ├── StudentProfileCard.js
│   │   │   ├── StudentProfileCard.test.js
│   │   │   ├── DashboardHeader.js
│   │   │   └── LoadingSkeleton.js
│   │   ├── courses/
│   │   │   ├── CourseCard.js
│   │   │   ├── CourseCard.test.js
│   │   │   ├── CourseGrid.js
│   │   │   ├── ProgressBar.js
│   │   │   ├── StatusBadge.js
│   │   │   └── ModuleProgress.js
│   │   ├── charts/
│   │   │   ├── ChartWrapper.js
│   │   │   ├── BarChart.js
│   │   │   ├── DoughnutChart.js
│   │   │   ├── LineChart.js
│   │   │   ├── ChartContainer.js
│   │   │   └── chartConfig.js
│   │   ├── ui/
│   │   │   ├── Button.js
│   │   │   ├── Input.js
│   │   │   ├── Modal.js
│   │   │   ├── Dropdown.js
│   │   │   ├── Toast.js
│   │   │   ├── Spinner.js
│   │   │   ├── Tooltip.js
│   │   │   └── Badge.js
│   │   └── layout/
│   │       ├── Header.js
│   │       ├── Footer.js
│   │       ├── Sidebar.js
│   │       └── Container.js
│   ├── pages/
│   │   ├── LoginPage.js
│   │   ├── LoginPage.test.js
│   │   ├── DashboardPage.js
│   │   ├── DashboardPage.test.js
│   │   └── NotFoundPage.js
│   ├── layouts/
│   │   ├── AuthLayout.js
│   │   ├── DashboardLayout.js
│   │   └── MainLayout.js
│   ├── services/
│   │   ├── api/
│   │   │   ├── client.js          # Axios/Fetch wrapper with interceptors
│   │   │   ├── endpoints.js       # API endpoint constants
│   │   │   ├── authApi.js         # Auth-related API calls
│   │   │   ├── studentApi.js      # Student data API calls
│   │   │   ├── courseApi.js       # Course data API calls
│   │   │   └── gradeApi.js        # Grade data API calls
│   │   ├── storage/
│   │   │   ├── StorageService.js  # localStorage/sessionStorage wrapper
│   │   │   ├── AuthStorage.js     # Auth-specific storage
│   │   │   └── PreferencesStorage.js
│   │   └── chart/
│   │       └── ChartService.js    # Chart.js instance management
│   ├── hooks/
│   │   ├── useAuth.js             # Authentication state hook
│   │   ├── useApi.js              # API data fetching hook
│   │   ├── useLocalStorage.js     # localStorage sync hook
│   │   ├── useIntersectionObserver.js
│   │   ├── useMediaQuery.js       # Responsive breakpoint hook
│   │   └── useDebounce.js
│   ├── context/
│   │   ├── AuthContext.js         # Global auth state (singleton)
│   │   ├── AppContext.js          # Global app state (singleton)
│   │   └── NotificationContext.js # Toast/global notifications
│   ├── utils/
│   │   ├── constants.js           # App constants, enums
│   │   ├── helpers.js             # General helper functions
│   │   ├── dateUtils.js           # Date formatting (date-fns wrapper)
│   │   ├── validation.js          # Form validation helpers
│   │   ├── chartUtils.js          # Chart data transformers
│   │   ├── domUtils.js            # DOM manipulation helpers
│   │   └── errorUtils.js          # Error formatting, logging
│   ├── router/
│   │   ├── router.js              # Hash-based router implementation
│   │   ├── routes.js              # Route definitions
│   │   ├── guards.js              # Route guards (auth, etc.)
│   │   └── router.test.js
│   └── mock/
│       ├── mockApi.js             # Mock API server (MSW or custom)
│       ├── mockData/
│       │   ├── students.json
│       │   ├── courses.json
│       │   ├── grades.json
│       │   └── progress.json
│       └── handlers.js            # Request handlers for mock
├── tests/
│   ├── unit/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── utils/
│   ├── integration/
│   │   ├── auth-flow.test.js
│   │   ├── dashboard-load.test.js
│   │   └── api-integration.test.js
│   ├── e2e/
│   │   ├── login.spec.js
│   │   ├── dashboard.spec.js
│   │   └── responsive.spec.js
│   ├── fixtures/
│   │   └── test-data.js
│   └── setup/
│       ├── jest.setup.js
│       └── playwright.config.js
├── scripts/
│   ├── dev.js                     # Development server script
│   ├── build.js                   # Production build script
│   ├── test.js                    # Test runner script
│   ├── lint.js                    # Linting script
│   └── deploy.js                  # Deployment script
├── .eslintrc.json
├── .prettierrc
├── .gitignore
├── .editorconfig
├── package.json
├── README.md
├── LICENSE
├── CHANGELOG.md
├── CONTRIBUTING.md
└── netlify.toml / vercel.json     # Deployment config
```

---

## Detailed Directory Descriptions

### `/public`

#### `/public` - Static Assets

Serves files directly without processing. Contains the main `index.html` which
loads all CDN dependencies (Tailwind, Chart.js, Lucide) and the application
bundle.

#### `/src` - Application Source Code

Main source directory following feature-based organization.

##### `/src/components` - Reusable UI Components

Organized by feature domain:

- **`/auth`** - Authentication-related components (login form, guards, avatar)
- **`/dashboard`** - Dashboard-specific components (profile card, header,
  skeletons)
- **`/courses`** - Course display components (cards, grid, progress bars,
  badges)
- **`/charts`** - Chart.js wrapper components with configuration
- **`/ui`** - Generic reusable UI primitives (button, input, modal, toast)
- **`/layout`** - Layout components (header, footer, sidebar, container)

##### `/src/pages` - Page-Level Components

Top-level components that compose features into complete pages. Each page
handles its own data fetching and error states.

##### `/src/layouts` - Layout Wrappers

Wrapper components that provide consistent structure across page groups (auth
pages vs dashboard pages).

##### `/src/services` - Business Logic & External Communication

- **`/api`** - All API communication layer with retry, timeout, interceptors
- **`/storage`** - Abstraction over Web Storage API with fallbacks
- **`/chart`** - Chart.js lifecycle management (create, update, destroy)

##### `/src/hooks` - Custom React-like Hooks

Reusable stateful logic extracted into composable functions. Implemented using
vanilla JS with Proxy-based reactivity.

##### `/src/context` - Global State Management

Singleton context objects providing app-wide state (auth, notifications, app
config) without prop drilling.

##### `/src/utils` - Pure Utility Functions

Stateless helper functions organized by domain (dates, validation, charts, DOM,
errors).

##### `/src/router` - Client-Side Routing

Hash-based SPA router with route guards, lazy loading support, and navigation
guards.

##### `/src/mock` - Development Mock Backend

MSW (Mock Service Worker) or custom mock server for development without real
backend.

---

## File Naming Conventions

| Type       | Convention               | Example                                |
| ---------- | ------------------------ | -------------------------------------- |
| Components | PascalCase               | `CourseCard.js`, `LoginForm.js`        |
| Pages      | PascalCase + Page        | `DashboardPage.js`, `LoginPage.js`     |
| Hooks      | camelCase + use          | `useAuth.js`, `useApi.js`              |
| Services   | PascalCase + Service     | `StorageService.js`, `ChartService.js` |
| Utils      | camelCase + Utils        | `dateUtils.js`, `chartUtils.js`        |
| Context    | PascalCase + Context     | `AuthContext.js`                       |
| Constants  | UPPER_SNAKE_CASE         | `API_ENDPOINTS.js`, `STORAGE_KEYS.js`  |
| Tests      | `.test.js` or `.spec.js` | `CourseCard.test.js`, `login.spec.js`  |
| Styles     | kebab-case               | `main.css`, `components.css`           |

---

## Module Dependency Rules

```
┌─────────────────────────────────────────────────────────────┐
│                        src/index.js                          │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
       ┌────────────┐  ┌────────────┐  ┌────────────┐
       │   app.js   │  │  router/   │  │  context/  │
       └────────────┘  └────────────┘  └────────────┘
              │               │               │
              ▼               ▼               ▼
       ┌────────────┐  ┌────────────┐  ┌────────────┐
       │  pages/    │  │  guards/   │  │   hooks/   │
       └────────────┘  └────────────┘  └────────────┘
              │
              ▼
       ┌────────────┐
       │components/ │
       └────────────┘
              │
      ┌───────┼───────┐
      ▼       ▼       ▼
   ┌─────┐ ┌─────┐ ┌─────┐
   │ ui  │ │charts│ │auth │
   └─────┘ └─────┘ └─────┘
      │       │       │
      └───────┼───────┘
              ▼
       ┌────────────┐
       │ services/  │
       └────────────┘
              │
      ┌───────┼───────┐
      ▼       ▼       ▼
   ┌─────┐ ┌─────┐ ┌─────┐
   │ api │ │store│ │chart│
   └─────┘ └─────┘ └─────┘
      │       │       │
      └───────┼───────┘
              ▼
       ┌────────────┐
       │  utils/    │
       └────────────┘
```

**Rules:**

1. **Pages** can import from: `components/`, `hooks/`, `services/`, `context/`,
   `utils/`
2. **Components** can import from: `components/ui/`, `hooks/`, `services/`,
   `utils/`
3. **Hooks** can import from: `services/`, `utils/`, `context/`
4. **Services** can import from: `utils/` only
5. **Utils** cannot import from any other `src/` module
6. **Context** can import from: `services/`, `utils/`, `hooks/`

---

## Configuration Files

### `package.json` Key Scripts

```json
{
    "scripts": {
        "dev": "node scripts/dev.js",
        "build": "node scripts/build.js",
        "preview": "npx serve dist",
        "test": "node scripts/test.js",
        "test:watch": "node scripts/test.js --watch",
        "test:coverage": "node scripts/test.js --coverage",
        "test:e2e": "npx playwright test",
        "lint": "node scripts/lint.js",
        "lint:fix": "node scripts/lint.js --fix",
        "format": "npx prettier --write \"src/**/*.{js,css,html}\"",
        "deploy:preview": "node scripts/deploy.js preview",
        "deploy:prod": "node scripts/deploy.js production"
    }
}
```

### `.eslintrc.json` Key Rules

- `no-unused-vars`: error
- `prefer-const`: error
- `no-console`: warn (allow in dev)
- `max-len`: [error, 100]
- `complexity`: [warn, 10]

### `.prettierrc`

```json
{
    "semi": true,
    "singleQuote": true,
    "tabWidth": 2,
    "trailingComma": "es5",
    "printWidth": 100,
    "bracketSpacing": true
}
```

---

## Build Output Structure (`/dist`)

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   ├── vendor-[hash].js        # CDN libraries bundled for offline
│   └── images/
│       ├── logo-[hash].svg
│       └── avatar-placeholder-[hash].svg
├── manifest.json
└── sw.js                       # Service worker (future PWA)
```

---

## Environment Configuration

### `.env.example`

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3001/api
VITE_API_TIMEOUT=10000

# Auth Configuration
VITE_AUTH_TOKEN_KEY=student_tracker_auth
VITE_AUTH_REDIRECT_KEY=student_tracker_redirect

# Feature Flags
VITE_ENABLE_MOCK_API=true
VITE_ENABLE_PWA=false
VITE_ENABLE_ANALYTICS=false

# Deployment
VITE_APP_URL=https://student-tracker.example.com
```

### Environment-Specific Overrides

- `.env.development` - Local development
- `.env.preview` - Preview deployments
- `.env.production` - Production

---

## Git Ignore Patterns (`.gitignore`)

```gitignore
# Dependencies
node_modules/

# Build outputs
dist/
build/
*.local

# Environment files
.env
.env.local
.env.*.local

# IDE/Editor
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Testing
coverage/
.nyc_output/
playwright-report/
test-results/

# Cache
.eslintcache
.prettiercache
*.tsbuildinfo

# Misc
*.tgz
.cache/
```

---

## Import Path Aliases (for bundler config)

```javascript
// In build config (esbuild/vite/rollup)
{
  "alias": {
    "@": "/src",
    "@/components": "/src/components",
    "@/pages": "/src/pages",
    "@/hooks": "/src/hooks",
    "@/services": "/src/services",
    "@/utils": "/src/utils",
    "@/context": "/src/context",
    "@/router": "/src/router",
    "@/styles": "/src/styles",
    "@/assets": "/public/assets",
    "@/mocks": "/src/mock"
  }
}
```

---

## Documentation Maintenance

This file structure document should be updated when:

- New feature modules are added
- Directory structure changes significantly
- New configuration files are added
- Build/deployment process changes

**Last Updated:** 2024  
**Version:** 1.0  
**Maintainer:** Project Team
