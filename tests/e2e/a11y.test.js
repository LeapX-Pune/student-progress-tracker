import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
    test('login page has no critical a11y violations', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();

        expect(results.violations).toEqual([]);
    });

    test('app shell has no critical a11y violations after login', async ({ page }) => {
        // Mock auth state to bypass login
        await page.goto('/');
        await page.evaluate(() => {
            localStorage.setItem(
                'student_tracker_auth',
                JSON.stringify({
                    token: 'mock-jwt-token',
                    user: {
                        id: 'stu_001',
                        name: 'Alex Johnson',
                        email: 'student@demo.com',
                        role: 'student',
                    },
                })
            );
        });
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();

        expect(results.violations).toEqual([]);
    });

    test('navigation is keyboard accessible', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Tab through nav links
        const navLinks = page.locator('.nav-list a');
        const count = await navLinks.count();
        for (let i = 0; i < Math.min(count, 3); i++) {
            await page.keyboard.press('Tab');
            await expect(navLinks.nth(i)).toBeFocused();
        }
    });
});
