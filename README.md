# Student Progress Tracker

A clean, responsive, and professional student progress tracking SaaS platform
built entirely with vanilla web technologies. This application allows students
to log in, view enrolled courses, monitor progress, track grades, and visually
analyze learning performance through interactive dashboards.

---

## 📋 Table of Contents

- [Objective & Scope](#-objective--scope)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Project Architecture & Directory Structure](#-project-architecture--directory-structure)
- [Functional Requirements](#-functional-requirements)
- [How to Run](#-how-to-run)
- [👥 Team & Roles](#-team--roles)

---

## 🎯 Objective & Scope

The goal of this project is to build a modern, responsive, and
performance-optimized student tracking interface. It simulates a
production-grade SaaS product by showcasing real-world frontend concepts
including state management, API integration, and interactive
visualizations—without relying on heavy frameworks or build tools.

### In Scope

- **Authentication**: Credentials validation, session persistence, and route
  protection.
- **Student Dashboard**: A central hub presenting student profile statistics and
  summary metrics.
- **Course Cards**: Individual course components displaying progress bars and
  completion statuses.
- **Interactive Charts**: Visual representations of quiz scores, weekly
  progress, and performance.
- **API Integration & Persistence**: Mock API calling with local storage state
  management.
- **Responsive Layouts**: Design optimized for mobile, tablet, laptop, and
  desktop viewports.

### Out of Scope

- Real payment gateway integrations.
- Multi-role administrative panels.
- Production server/database backend development.
- Real-time chat messaging.
- Video streaming or hosting.

---

## ✨ Key Features

### 🔐 1. Authentication & Session Persistence

- Secure mock authentication system (JWT-based mock structure).
- Automatic route protection (redirecting unauthenticated users to the Login
  view).
- Persistent session state surviving page reloads (via
  `LocalStorage`/`SessionStorage`).

### 📊 2. Student Dashboard & Analytics

- **Overview Metrics**: Completion percentage, current course counts, and user
  info.
- **Grade Visualizations**: Line, Bar, and Doughnut charts built with vanilla
  libraries showing quiz/assignment performance.
- **Interactive Elements**: Dynamic sorting or filtering of courses and metrics.

### 🗂️ 3. Course Progress tracking

- Detailed cards including course title, instructor, thumbnail, modules list,
  and badge state.
- Progress bars updating dynamically based on course module completion.

### 🌐 4. Mock API & Error States

- Seamless mock data integration representing `Students`, `Courses`, and
  `Grades`.
- Comprehensive error-handling fallback UI (e.g., "Unable to load dashboard
  data", "Network failure").

---

## 🛠️ Technology Stack

| Category       | Technology                  | Purpose                                  |
| -------------- | --------------------------- | ---------------------------------------- |
| **Language**   | Vanilla JavaScript (ES2022) | No framework overhead, max portability   |
| **Styling**    | Tailwind CSS (CDN)          | Utility-first, responsive by default     |
| **Charts**     | Chart.js                    | Lightweight, accessible, responsive      |
| **Icons**      | Lucide (CDN)                | Consistent icon system                   |
| **Routing**    | Custom hash router          | Zero-dep, works on static hosting        |
| **Build**      | esbuild                     | Fast bundler, minification, tree-shaking |
| **Testing**    | Vitest + Playwright         | Unit + E2E testing                       |
| **CI/CD**      | GitHub Actions              | Lint → Test → Build → Deploy             |
| **Deployment** | GitHub Pages                | Free static hosting, SPA fallback        |

---

## 📂 Project Architecture & Directory Structure

```text
student-progress-tracker/
├── .github/
│   └── workflows/            # CI/CD pipelines
├── public/                   # Static assets, HTML entry points
│   ├── index.html
│   ├── 404.html              # SPA fallback
│   └── dashboard.html
├── src/                      # Application source code
│   ├── main.js               # Bootstrap & app init
│   ├── router.js             # Hash-based SPA routing
│   ├── pages/                # Page-level components
│   ├── components/           # Reusable UI components
│   ├── services/             # API, Auth, Storage, Mock
│   ├── hooks/                # Custom hooks (useApi, useAuth, etc.)
│   ├── context/              # Global state (Auth, App)
│   ├── config/               # Environment & app config
│   ├── utils/                # Helpers, date, DOM utilities
│   └── styles/               # CSS stylesheets
├── scripts/                  # Build & dev tooling
│   ├── build.js              # esbuild production build
│   └── dev.js                # Dev server
├── tests/                    # Test suites
├── docs/                     # Project documentation
├── package.json
├── .github/                  # CI/CD workflows
└── README.md
```

---

## ⚙️ How to Run

### Development

```bash
# Install dependencies
npm ci

# Start dev server (with mock API)
npm run dev
```

### Production Build

```bash
npm run build
npx serve dist -p 4173
```

### Deployment

The project is deployed to **GitHub Pages** via GitHub Actions:

| Environment | Trigger             | URL                                                                  |
| ----------- | ------------------- | -------------------------------------------------------------------- |
| Preview     | Pull Request opened | `https://leapx-pune.github.io/student-progress-tracker/pr-preview/N` |
| Production  | Push to `main`      | `https://leapx-pune.github.io/student-progress-tracker/`             |

---

## 📚 Development Reference

For detailed implementation guidance, refer to the committed docs in
[`docs/`](./docs):

| Path                                                                                                           | Description                                                               |
| -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| [`docs/PROJECT_DIVISION.md`](./docs/PROJECT_DIVISION.md)                                                       | Module breakdown, dependency graph, team assignments, acceptance criteria |
| [`docs/PROJECT_DIVISION_OVERVIEW.md`](./docs/PROJECT_DIVISION_OVERVIEW.md)                                     | High-level overview of all 12 project parts                               |
| [`docs/FILE_STRUCTURE.md`](./docs/FILE_STRUCTURE.md)                                                           | Complete file tree and folder conventions                                 |
| [`docs/Student_Progress_Tracking_SaaS_Detailed_PRD.md`](./docs/Student_Progress_Tracking_SaaS_Detailed_PRD.md) | Full PRD with functional and non-functional requirements                  |
| [`docs/api/endpoints.md`](./docs/api/endpoints.md)                                                             | API endpoint reference                                                    |
| [`docs/api/auth.md`](./docs/api/auth.md)                                                                       | Authentication flow documentation                                         |
| [`docs/api/data-models.md`](./docs/api/data-models.md)                                                         | Data model definitions                                                    |
| [`docs/architecture/overview.md`](./docs/architecture/overview.md)                                             | System architecture overview                                              |
| [`docs/architecture/adr/`](./docs/architecture/adr)                                                            | Architecture Decision Records                                             |
| [`docs/guides/getting-started.md`](./docs/guides/getting-started.md)                                           | Developer onboarding guide                                                |
| [`docs/guides/testing.md`](./docs/guides/testing.md)                                                           | Testing strategies and configuration                                      |
| [`docs/deployment/vercel.md`](./docs/deployment/vercel.md)                                                     | Vercel deployment guide                                                   |
| [`docs/references/design-tokens.md`](./docs/references/design-tokens.md)                                       | Colors, typography, spacing tokens                                        |

---

## 👥 Team & Roles

| Name                | Role                   | Core Responsibilities                                                |
| :------------------ | :--------------------- | :------------------------------------------------------------------- |
| **Devansh Mittal**  | **Tech Lead**          | Project architecture, code reviews, and technical direction.         |
| **Kshitij Das**     | **DevOps**             | CI/CD alignment, hosting setup, git workflows, and deployment.       |
| **Sankalp Tiwari**  | **Auth Engineer**      | Authentication flow, route protection, and session security.         |
| **SAI SHENDGE**     | **UI Engineer**        | Responsive layout design, layout framework, typography, and styling. |
| **Mohhamed Rehan**  | **Dashboard Engineer** | Dashboard overview page, profile integration, and summary views.     |
| **Sauryaman Bisen** | **Dashboard Engineer** | Course progress cards, list rendering, and interactive badges.       |
| **Sumit Tiwari**    | **Dashboard Engineer** | Grade visualizations, chart rendering, and performance grids.        |
| **Khushi Shah**     | **Dashboard Engineer** | Course progress cards, list rendering, and interactive badges.       |
| **ADITYA VAWHAL**   | **State Engineer**     | Global/local application state management and theme switching.       |
| **Ankit Bhalke**    | **UX Engineer**        | Wireframes, accessibility compliance, and interaction workflows.     |
| **PULAK SAHA**      | **API Engineer**       | Mock database definition, API fetch modules, and error-handling.     |
