import { test, expect } from '@playwright/test';

test.describe('Application Shell', () => {
    test('dev server loads and returns HTML', async ({ page }) => {
        const response = await page.goto('/');
        expect(response.ok()).toBeTruthy();
        await expect(page.locator('body')).toBeVisible();
    });

    test('page has correct title after JS loads', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle(/Overview.*The Reality/);
    });

    test('brand name is visible in sidebar', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('.brand-name')).toHaveText('The Reality');
    });

    test('sidebar contains navigation links', async ({ page }) => {
        await page.goto('/');
        const navLinks = page.locator('.nav-list a');
        await expect(navLinks).toHaveText([
            'Overview',
            'Students',
            'Courses',
            'Grades',
            'Analytics',
            'Attendance',
            'Settings',
        ]);
    });

    test('breadcrumb shows Overview by default', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('[data-breadcrumb-label]')).toHaveText('Overview');
    });

    test('global search input is present', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('#global-search')).toHaveAttribute('placeholder', /Search/);
        await expect(page.locator('#global-search')).toBeAttached();
    });

    test('profile section displays user name', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('.profile-name')).toHaveText('Sai Shendge');
        await expect(page.locator('.profile-role')).toHaveText('Administrator');
    });

    test('route placeholder renders for default route', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('.route-placeholder')).toBeVisible();
        await expect(page.locator('.route-placeholder h2')).toHaveText('Overview');
    });

    test('navigating to a different route updates breadcrumb and content', async ({ page }) => {
        await page.goto('/');
        await page.evaluate(() => {
            window.location.hash = '#/courses';
        });
        await expect(page.locator('[data-breadcrumb-label]')).toHaveText('Courses');
        await expect(page.locator('.route-placeholder h2')).toHaveText('Courses');
        await expect(page).toHaveTitle(/Courses.*The Reality/);
    });
});
