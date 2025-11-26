import { test, expect } from '@playwright/test';

test.describe('Language Switching', () => {
  test('should switch to Traditional Chinese', async ({ page }) => {
    await page.goto('/');

    // Select Traditional Chinese
    const languageSelector = page.locator('select').first();
    await languageSelector.selectOption('zh-TW');

    // Check that text changes to Chinese
    await expect(page.getByRole('heading', { name: /LDAP 密碼修改入口/i })).toBeVisible();
    await expect(page.getByText(/安全地修改您的 LDAP 密碼/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /修改我的密碼/i })).toBeVisible();
  });

  test('should switch to Japanese', async ({ page }) => {
    await page.goto('/');

    // Select Japanese
    const languageSelector = page.locator('select').first();
    await languageSelector.selectOption('ja');

    // Check that text changes to Japanese
    await expect(page.getByRole('heading', { name: /LDAP パスワード変更ポータル/i })).toBeVisible();
    await expect(page.getByText(/LDAP パスワードを安全に変更/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /パスワードを変更/i })).toBeVisible();
  });

  test('should switch back to English', async ({ page }) => {
    await page.goto('/');

    // First switch to Chinese
    const languageSelector = page.locator('select').first();
    await languageSelector.selectOption('zh-TW');
    await expect(page.getByRole('heading', { name: /LDAP 密碼修改入口/i })).toBeVisible();

    // Switch back to English
    await languageSelector.selectOption('en');

    // Check that text changes back to English
    await expect(page.getByRole('heading', { name: /LDAP Password Change Portal/i })).toBeVisible();
    await expect(page.getByText(/Change your LDAP password securely/i)).toBeVisible();
  });

  test('should update validation messages when language changes', async ({ page }) => {
    await page.goto('/change-password');

    // Submit form to show validation errors in English
    await page.getByRole('button', { name: /Change Password/i }).click();
    await expect(page.getByText(/Please enter your account or username/i)).toBeVisible();

    // Switch to Traditional Chinese
    const languageSelector = page.locator('select').first();
    await languageSelector.selectOption('zh-TW');

    // Check that validation messages are updated to Chinese
    await expect(page.getByText(/請輸入帳號或使用者名稱/i)).toBeVisible();
  });

  test('should persist language selection', async ({ page }) => {
    await page.goto('/');

    // Select Traditional Chinese
    const languageSelector = page.locator('select').first();
    await languageSelector.selectOption('zh-TW');
    await expect(page.getByRole('heading', { name: /LDAP 密碼修改入口/i })).toBeVisible();

    // Navigate to another page
    await page.getByRole('button', { name: /修改我的密碼/i }).click();

    // Language should still be Chinese
    await expect(page.getByRole('heading', { name: /修改您的密碼/i })).toBeVisible();

    // Navigate back
    await page.getByRole('button', { name: /返回/i }).click();

    // Language should still be Chinese
    await expect(page.getByRole('heading', { name: /LDAP 密碼修改入口/i })).toBeVisible();
  });
});

