import { test, expect } from '@playwright/test';

test.describe('Change Password Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/change-password');
  });

  test('should display change password form with all fields', async ({ page }) => {
    // Check form title
    await expect(page.getByRole('heading', { name: /Change Your Password/i })).toBeVisible();

    // Check all input fields
    await expect(page.getByLabel(/^Account \/ Username$/i)).toBeVisible();
    await expect(page.getByLabel(/^Current Password$/i)).toBeVisible();
    await expect(page.getByLabel(/^New Password$/i)).toBeVisible();
    await expect(page.getByLabel(/^Confirm New Password$/i)).toBeVisible();

    // Check password requirements section
    await expect(page.getByText(/Password Requirements/i)).toBeVisible();

    // Check buttons
    await expect(page.getByRole('button', { name: /Cancel/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Change Password/i })).toBeVisible();
  });

  test('should show validation errors when form is submitted empty', async ({ page }) => {
    // Submit form without filling any fields
    await page.getByRole('button', { name: /Change Password/i }).click();

    // Check for validation errors
    await expect(page.getByText(/Please enter your account or username/i)).toBeVisible();
    await expect(page.getByText(/Please enter your current password/i)).toBeVisible();
    await expect(page.getByText(/Please enter a new password/i)).toBeVisible();
    await expect(page.getByText(/Please confirm your new password/i)).toBeVisible();
  });

  test('should show error when passwords do not match', async ({ page }) => {
    // Fill in form
    await page.getByLabel(/^Account \/ Username$/i).fill('testuser');
    await page.getByLabel(/^Current Password$/i).fill('OldPass123!');
    await page.getByLabel(/^New Password$/i).fill('NewPass123!');
    await page.getByLabel(/^Confirm New Password$/i).fill('Different123!');

    // Submit form
    await page.getByRole('button', { name: /Change Password/i }).click();

    // Check for password mismatch error
    await expect(page.getByText(/do not match/i)).toBeVisible();
  });

  test('should show error for weak password', async ({ page }) => {
    // Fill in form with weak password
    await page.getByLabel(/^Account \/ Username$/i).fill('testuser');
    await page.getByLabel(/^Current Password$/i).fill('OldPass123!');
    await page.getByLabel(/^New Password$/i).fill('weak');
    await page.getByLabel(/^Confirm New Password$/i).fill('weak');

    // Submit form
    await page.getByRole('button', { name: /Change Password/i }).click();

    // Check for weak password error
    await expect(page.getByText(/does not meet requirements/i)).toBeVisible();
  });

  test('should navigate back to home when back button is clicked', async ({ page }) => {
    // Click back button
    await page.getByRole('button', { name: /Back/i }).click();

    // Should navigate to home page
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: /LDAP Password Change Portal/i })).toBeVisible();
  });

  test('should navigate back to home when cancel button is clicked', async ({ page }) => {
    // Click cancel button
    await page.getByRole('button', { name: /Cancel/i }).click();

    // Should navigate to home page
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: /LDAP Password Change Portal/i })).toBeVisible();
  });

  test('should display password requirements', async ({ page }) => {
    // Check all password requirements are displayed
    await expect(page.getByText(/At least 8 characters long/i)).toBeVisible();
    await expect(page.getByText(/Contains at least one uppercase letter/i)).toBeVisible();
    await expect(page.getByText(/Contains at least one lowercase letter/i)).toBeVisible();
    await expect(page.getByText(/Contains at least one number/i)).toBeVisible();
    await expect(page.getByText(/Contains at least one special character/i)).toBeVisible();
  });
});

