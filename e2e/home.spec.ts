import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should display home page with title and description', async ({ page }) => {
    await page.goto('/');

    // Check title
    await expect(page.getByRole('heading', { name: /LDAP Password Change Portal/i })).toBeVisible();

    // Check description
    await expect(page.getByText(/Change your LDAP password securely/i)).toBeVisible();

    // Check welcome message
    await expect(page.getByText(/Welcome/i)).toBeVisible();

    // Check change password button
    await expect(page.getByRole('button', { name: /Change My Password/i })).toBeVisible();
  });

  test('should navigate to change password page when button is clicked', async ({ page }) => {
    await page.goto('/');

    // Click the change password button
    await page.getByRole('button', { name: /Change My Password/i }).click();

    // Should navigate to change password page
    await expect(page).toHaveURL('/change-password');
    await expect(page.getByRole('heading', { name: /Change Your Password/i })).toBeVisible();
  });

  test('should display language selector', async ({ page }) => {
    await page.goto('/');

    // Check language selector is visible
    const languageSelector = page.locator('select').first();
    await expect(languageSelector).toBeVisible();
  });
});

