import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

function getCriticalViolations(violations) {
    return violations.filter(v => v.impact === 'critical');
}

test.describe('Accessibility', () => {
    test('login page has no critical a11y violations', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();

        if (results.violations.length > 0) {
            console.log(
                'All violations:',
                results.violations.map(v => `${v.id} (${v.impact}): ${v.help}`)
            );
        }

        expect(getCriticalViolations(results.violations)).toEqual([]);
    });

    test('app shell has no critical a11y violations after login', async ({ page }) => {
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

        if (results.violations.length > 0) {
            console.log(
                'All violations:',
                results.violations.map(v => `${v.id} (${v.impact}): ${v.help}`)
            );
        }

        expect(getCriticalViolations(results.violations)).toEqual([]);
    });

    test('skip link is first tabbable and navigates to main content', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        await page.keyboard.press('Tab');
        await expect(page.locator('.skip-link')).toBeFocused();
        await page.keyboard.press('Enter');
        await expect(page).toHaveURL(/#main-content/);
    });
});
