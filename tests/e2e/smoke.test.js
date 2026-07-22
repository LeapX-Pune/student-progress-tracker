import { test, expect } from '@playwright/test';

test.describe('Project Setup Smoke', () => {
  test('dev server loads and returns HTML', async ({ page }) => {
    const response = await page.goto('/');
    expect(response.ok()).toBeTruthy();
    await expect(page.locator('body')).toBeVisible();
  });

  test('page has correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Student Progress Tracker/);
  });
});
