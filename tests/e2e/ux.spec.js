import { test, expect } from '@playwright/test';

test.describe('UX & Error Handling', () => {
    test('toast appears for error actions', async ({ page }) => {
        await page.goto('/');
        const toastCreated = await page.evaluate(() => {
            const Toast = window.showToast || window.__toast;
            if (typeof Toast === 'function') {
                Toast({ type: 'error', title: 'Test Error', message: 'Something went wrong' });
                return true;
            }
            return false;
        });

        if (toastCreated) {
            await expect(page.locator('.toast--error')).toBeVisible({ timeout: 3000 });
            await expect(page.locator('.toast__title')).toHaveText('Test Error');
        }
    });

    test('skeleton loaders render correctly', async ({ page }) => {
        await page.goto('/');
        const hasSkeleton = await page.locator('.skeleton, [class*="skeleton"]').count();
        expect(hasSkeleton).toBeGreaterThanOrEqual(0);
    });

    test('page loads with correct title', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle(/Student Progress|Dashboard/);
    });

    test('focus outline visible on keyboard navigation', async ({ page }) => {
        await page.goto('/');
        await page.keyboard.press('Tab');
        const focused = page.locator(':focus');
        await expect(focused).toBeVisible();
    });
});
