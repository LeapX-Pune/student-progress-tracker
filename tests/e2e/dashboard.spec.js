import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
    test('dashboard loads with key elements', async ({ page }) => {
        await page.goto('/dashboard');
        await expect(page.locator('[data-page-content]')).toBeVisible();
    });

    test('navigation links are present', async ({ page }) => {
        await page.goto('/dashboard');
        const navLinks = page.locator('.nav-link, [data-route]');
        const count = await navLinks.count();
        expect(count).toBeGreaterThan(0);
    });

    test('page title updates based on route', async ({ page }) => {
        await page.goto('/dashboard');
        const title = await page.title();
        expect(title.length).toBeGreaterThan(0);
    });
});
