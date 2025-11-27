/**
 * 驗證密碼強度是否符合要求：
 * - 至少 8 個字元
 * - 至少包含一個大寫字母
 * - 至少包含一個小寫字母
 * - 至少包含一個數字
 * - 至少包含一個特殊字元
 */
export const validatePassword = (password: string): boolean => {
  if (password.length < 8) {
    return false;
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
};

