import { test, expect } from '@playwright/test';

const MOBILE_BREAKPOINT = 960;

async function ensureNavVisible(page) {
    const vw = page.viewportSize()?.width ?? 0;
    if (vw <= MOBILE_BREAKPOINT) {
        const drawerBtn = page.locator('[data-drawer-open]');
        if (await drawerBtn.isVisible()) {
            await drawerBtn.click();
            await page.waitForSelector('.app-shell.is-drawer-open');
        }
    }
}

test.describe('Navigation', () => {
    test('sidebar nav links are visible', async ({ page }) => {
        await page.goto('/');
        await ensureNavVisible(page);
        const navLinks = page.locator('.nav-link');
        await expect(navLinks.first()).toBeVisible();
    });

    test('clicking nav link updates active state', async ({ page }) => {
        await page.goto('/');
        await ensureNavVisible(page);
        const coursesLink = page.locator('[data-route="courses"]');
        await coursesLink.click();
        await expect(coursesLink).toHaveClass(/is-active/);
    });

    test('breadcrumb updates on route change', async ({ page }) => {
        await page.goto('/');
        await ensureNavVisible(page);
        const studentsLink = page.locator('[data-route="students"]');
        await studentsLink.click();
        await expect(page.locator('[data-breadcrumb-label]')).toHaveText('Students');
    });

    test('document title updates on navigation', async ({ page }) => {
        await page.goto('/');
        await ensureNavVisible(page);
        const gradesLink = page.locator('[data-route="grades"]');
        await gradesLink.click();
        await expect(page).toHaveTitle(/Grades/);
    });
});

test.describe('Page Content', () => {
    test('page content area exists', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('[data-page-content]')).toBeVisible();
    });

    test('route placeholder renders for each route', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('.route-placeholder')).toBeVisible();
    });
});
