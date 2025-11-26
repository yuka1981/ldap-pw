import { describe, it, expect } from 'vitest';
import { validatePassword } from './passwordValidation';

describe('validatePassword', () => {
  it('should return false for passwords shorter than 8 characters', () => {
    expect(validatePassword('Short1!')).toBe(false);
    expect(validatePassword('Pass1!')).toBe(false);
  });

  it('should return false for passwords without uppercase letter', () => {
    expect(validatePassword('lowercase123!')).toBe(false);
  });

  it('should return false for passwords without lowercase letter', () => {
    expect(validatePassword('UPPERCASE123!')).toBe(false);
  });

  it('should return false for passwords without number', () => {
    expect(validatePassword('NoNumber!@#')).toBe(false);
  });

  it('should return false for passwords without special character', () => {
    expect(validatePassword('NoSpecial123')).toBe(false);
  });

  it('should return true for valid passwords', () => {
    expect(validatePassword('ValidPass123!')).toBe(true);
    expect(validatePassword('MyP@ssw0rd')).toBe(true);
    expect(validatePassword('Test1234#')).toBe(true);
  });

  it('should return false for empty password', () => {
    expect(validatePassword('')).toBe(false);
  });
});

