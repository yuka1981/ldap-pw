import { describe, it, expect, vi } from 'vitest';
import { changePassword } from './passwordService';

describe('passwordService', () => {
  it('should successfully change password with valid inputs', async () => {
    const result = await changePassword('testuser', 'OldPass123!', 'NewPass123!');
    expect(result.success).toBe(true);
    expect(result.message).toBe('Password changed successfully');
  });

  it('should throw error when account is missing', async () => {
    await expect(changePassword('', 'OldPass123!', 'NewPass123!')).rejects.toThrow();
  });

  it('should throw error when current password is missing', async () => {
    await expect(changePassword('testuser', '', 'NewPass123!')).rejects.toThrow();
  });

  it('should throw error when new password is missing', async () => {
    await expect(changePassword('testuser', 'OldPass123!', '')).rejects.toThrow();
  });
});

