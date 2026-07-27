import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
    test('login page loads with form elements', async ({ page }) => {
        await page.goto('/login');
        await expect(page.locator('#login-email')).toBeVisible();
        await expect(page.locator('#login-password')).toBeVisible();
        await expect(page.locator('#login-submit')).toBeVisible();
    });

    test('shows error for invalid credentials', async ({ page }) => {
        await page.goto('/login');
        await page.fill('#login-email', 'wrong@demo.com');
        await page.fill('#login-password', 'wrong');
        await page.click('#login-submit');
        await expect(page.locator('[role="alert"]')).toBeVisible();
    });

    test('redirects to dashboard on successful login', async ({ page }) => {
        await page.goto('/login');
        await page.fill('#login-email', 'student@demo.com');
        await page.fill('#login-password', 'demo123');
        await page.click('#login-submit');
        await expect(page).toHaveURL(/dashboard/);
    });
});
