import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests/e2e',
    timeout: 30000,
    expect: { timeout: 5000 },
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    use: {
        baseURL: 'http://localhost:4173',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
    },
    webServer: {
        command: 'npx serve dist -p 4173',
        port: 4173,
        reuseExistingServer: !process.env.CI,
        cwd: '.',
    },
    projects: [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
        // Firefox and Mobile Chrome are available but disabled for CI speed
        // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
        // { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    ],
});
