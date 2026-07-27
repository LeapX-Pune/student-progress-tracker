import { test, expect } from '@playwright/test';

test.describe('Responsive Design', () => {
    const breakpoints = [
        { name: 'mobile', width: 375, height: 667 },
        { name: 'tablet', width: 768, height: 1024 },
        { name: 'desktop', width: 1280, height: 800 },
    ];

    for (const bp of breakpoints) {
        test(`login form is usable at ${bp.name} (${bp.width}px)`, async ({ browser }) => {
            const context = await browser.newContext({
                viewport: { width: bp.width, height: bp.height },
            });
            const page = await context.newPage();
            await page.goto('/login');
            await expect(page.locator('#login-email')).toBeVisible();
            await expect(page.locator('#login-password')).toBeVisible();
            await expect(page.locator('#login-submit')).toBeVisible();
            await page.fill('#login-email', 'student@demo.com');
            await page.fill('#login-password', 'demo123');
            await page.click('#login-submit');
            await expect(page).toHaveURL(/dashboard/);
            await context.close();
        });

        test(`navigation is accessible at ${bp.name} (${bp.width}px)`, async ({ browser }) => {
            const context = await browser.newContext({
                viewport: { width: bp.width, height: bp.height },
            });
            const page = await context.newPage();
            await page.goto('/dashboard');
            const navLinks = page.locator('.nav-link, [data-route]');
            const count = await navLinks.count();
            expect(count).toBeGreaterThan(0);
            await context.close();
        });

        test(`page content does not overflow at ${bp.name} (${bp.width}px)`, async ({
            browser,
        }) => {
            const context = await browser.newContext({
                viewport: { width: bp.width, height: bp.height },
            });
            const page = await context.newPage();
            await page.goto('/dashboard');
            const overflowWidth = await page.evaluate(() => {
                return document.documentElement.scrollWidth > document.documentElement.clientWidth;
            });
            expect(overflowWidth).toBe(false);
            await context.close();
        });
    }

    test('meta viewport tag is present', async ({ page }) => {
        await page.goto('/login');
        const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
        expect(viewport).toBeTruthy();
    });
});
