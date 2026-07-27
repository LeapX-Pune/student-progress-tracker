export const visualTestConfig = {
    viewports: [
        { width: 375, height: 667, label: 'mobile' },
        { width: 768, height: 1024, label: 'tablet' },
        { width: 1280, height: 800, label: 'desktop' },
    ],
    routes: [
        { path: '/login', label: 'Login Page' },
        { path: '/dashboard', label: 'Dashboard' },
        { path: '/courses', label: 'Courses' },
        { path: '/grades', label: 'Grades' },
    ],
    threshold: 0.01,
    tolerances: {
        antiAliasing: true,
        colors: { threshold: 0.1 },
    },
    baselineDir: './tests/visual/baselines',
    diffDir: './tests/visual/diffs',
    reportDir: './tests/visual/reports',
};
