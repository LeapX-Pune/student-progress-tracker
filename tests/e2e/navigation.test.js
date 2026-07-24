import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
    test('sidebar nav links are visible', async ({ page }) => {
        await page.goto('/');
        const navLinks = page.locator('.nav-link');
        await expect(navLinks.first()).toBeVisible();
    });

    test('clicking nav link updates active state', async ({ page }) => {
        await page.goto('/');
        const coursesLink = page.locator('[data-route="courses"]');
        await coursesLink.click();
        await expect(coursesLink).toHaveClass(/is-active/);
    });

    test('breadcrumb updates on route change', async ({ page }) => {
        await page.goto('/');
        const studentsLink = page.locator('[data-route="students"]');
        await studentsLink.click();
        await expect(page.locator('[data-breadcrumb-label]')).toHaveText('Students');
    });

    test('document title updates on navigation', async ({ page }) => {
        await page.goto('/');
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
