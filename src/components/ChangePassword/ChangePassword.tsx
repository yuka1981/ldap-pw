'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/contexts/I18nContext';
import { changePassword } from '@/services/passwordService';
import { validatePassword } from '@/utils/passwordValidation';
import './ChangePassword.css';

export const ChangePassword: React.FC = () => {
  const router = useRouter();
  const { t, locale } = useI18n();

  const [formData, setFormData] = useState({
    account: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // 當語系變更時更新錯誤訊息
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      // 重新驗證表單以使用新語系更新錯誤訊息
      const newErrors: Record<string, string> = {};

      // 更新帳號錯誤（如果存在）
      if (errors.account) {
        if (!formData.account) {
          newErrors.account = t.changePassword.validation.accountRequired;
        }
      }

      // 更新目前密碼錯誤（如果存在）
      if (errors.currentPassword) {
        if (!formData.currentPassword) {
          newErrors.currentPassword =
            t.changePassword.validation.currentPasswordRequired;
        } else {
          // 如果密碼不正確（來自 API 錯誤）
          newErrors.currentPassword =
            t.changePassword.validation.currentPasswordIncorrect;
        }
      }

      // 更新新密碼錯誤（如果存在）
      if (errors.newPassword) {
        if (!formData.newPassword) {
          newErrors.newPassword =
            t.changePassword.validation.newPasswordRequired;
        } else if (!validatePassword(formData.newPassword)) {
          newErrors.newPassword = t.changePassword.validation.newPasswordWeak;
        }
      }

      // 更新確認密碼錯誤（如果存在）
      if (errors.confirmPassword) {
        if (!formData.confirmPassword) {
          newErrors.confirmPassword =
            t.changePassword.validation.confirmPasswordRequired;
        } else if (formData.newPassword !== formData.confirmPassword) {
          newErrors.confirmPassword =
            t.changePassword.validation.passwordMismatch;
        }
      }

      // 使用新語系訊息更新錯誤
      setErrors(newErrors);
    }

    // 更新提交錯誤訊息（如果存在）
    if (submitError) {
      setSubmitError(t.changePassword.errorMessage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);

    // 當使用者開始輸入時清除提交錯誤
    if (submitError) {
      setSubmitError('');
    }

    // 即時驗證
    const newErrors: Record<string, string> = { ...errors };

    // 驗證帳號
    if (name === 'account') {
      if (!value) {
        newErrors.account = t.changePassword.validation.accountRequired;
      } else {
        delete newErrors.account;
      }
    }

    // 驗證目前密碼
    if (name === 'currentPassword') {
      if (!value) {
        newErrors.currentPassword =
          t.changePassword.validation.currentPasswordRequired;
      } else {
        // 如果之前是因為密碼錯誤而顯示的錯誤，清除它
        delete newErrors.currentPassword;
      }
    }

    // 驗證新密碼（即時檢查規則）
    if (name === 'newPassword') {
      if (!value) {
        newErrors.newPassword = t.changePassword.validation.newPasswordRequired;
      } else if (!validatePassword(value)) {
        newErrors.newPassword = t.changePassword.validation.newPasswordWeak;
      } else {
        delete newErrors.newPassword;
      }

      // 如果確認密碼已經有值，需要重新驗證是否匹配
      if (updatedFormData.confirmPassword) {
        if (value !== updatedFormData.confirmPassword) {
          newErrors.confirmPassword =
            t.changePassword.validation.passwordMismatch;
        } else {
          delete newErrors.confirmPassword;
        }
      }
    }

    // 驗證確認密碼
    if (name === 'confirmPassword') {
      if (!value) {
        newErrors.confirmPassword =
          t.changePassword.validation.confirmPasswordRequired;
      } else if (
        updatedFormData.newPassword &&
        value !== updatedFormData.newPassword
      ) {
        newErrors.confirmPassword =
          t.changePassword.validation.passwordMismatch;
      } else {
        delete newErrors.confirmPassword;
      }
    }

    setErrors(newErrors);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.account) {
      newErrors.account = t.changePassword.validation.accountRequired;
    }

    if (!formData.currentPassword) {
      newErrors.currentPassword =
        t.changePassword.validation.currentPasswordRequired;
    }

    if (!formData.newPassword) {
      newErrors.newPassword = t.changePassword.validation.newPasswordRequired;
    } else if (!validatePassword(formData.newPassword)) {
      newErrors.newPassword = t.changePassword.validation.newPasswordWeak;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword =
        t.changePassword.validation.confirmPasswordRequired;
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = t.changePassword.validation.passwordMismatch;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // 呼叫密碼修改服務
      await changePassword(
        formData.account,
        formData.currentPassword,
        formData.newPassword
      );
      // 成功 - 顯示成功訊息並導回首頁
      // TODO: 優化成功處理流程
      // 目前使用 alert 顯示成功訊息，建議改為更友善的 UI 提示（例如：Toast 通知）
      alert(t.changePassword.successMessage);
      router.push('/');
    } catch (error: any) {
      // 處理 LDAP API 錯誤回應
      // ldapts 套件會拋出包含錯誤碼和訊息的錯誤
      const errorMessage = error?.message || '';

      // LDAP 錯誤碼 49: 認證失敗（目前密碼不正確）
      if (
        error?.code === 49 ||
        errorMessage.includes('current password') ||
        errorMessage.includes('incorrect') ||
        errorMessage.includes('Invalid Credentials')
      ) {
        setErrors((prev) => ({
          ...prev,
          currentPassword: t.changePassword.validation.currentPasswordIncorrect,
        }));
      }
      // LDAP 錯誤碼 53: 密碼策略違規（新密碼不符合策略要求）
      else if (
        error?.code === 53 ||
        errorMessage.includes('Password does not meet policy') ||
        errorMessage.includes('password policy')
      ) {
        setErrors((prev) => ({
          ...prev,
          newPassword: t.changePassword.validation.newPasswordWeak,
        }));
      }
      // LDAP 錯誤碼 19: 約束違規（例如：不能與舊密碼相同）
      else if (
        error?.code === 19 ||
        errorMessage.includes('constraint') ||
        errorMessage.includes('same as old password')
      ) {
        setErrors((prev) => ({
          ...prev,
          newPassword: t.changePassword.validation.newPasswordWeak,
        }));
      }
      // 其他錯誤（連線錯誤、伺服器錯誤等）
      else {
        setSubmitError(t.changePassword.errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.push('/');
  };

  // 檢查密碼要求是否滿足
  const checkPasswordRequirement = (requirement: number): boolean => {
    const password = formData.newPassword;
    if (!password) return false;

    switch (requirement) {
      case 1: // 至少 8 個字元
        return password.length >= 8;
      case 2: // 至少包含一個大寫字母
        return /[A-Z]/.test(password);
      case 3: // 至少包含一個小寫字母
        return /[a-z]/.test(password);
      case 4: // 至少包含一個數字
        return /[0-9]/.test(password);
      case 5: // 至少包含一個特殊字元
        return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
      default:
        return false;
    }
  };

  // 檢查所有密碼要求是否都滿足
  const areAllRequirementsMet = (): boolean => {
    return (
      checkPasswordRequirement(1) &&
      checkPasswordRequirement(2) &&
      checkPasswordRequirement(3) &&
      checkPasswordRequirement(4) &&
      checkPasswordRequirement(5)
    );
  };

  return (
    <div className="change-password-container">
      <div className="change-password-card">
        <button
          className="back-button"
          onClick={handleBack}
          aria-label={t.common.back}
        >
          ← {t.common.back}
        </button>

        <div className="change-password-header">
          <h1 className="change-password-title">{t.changePassword.title}</h1>
          <p className="change-password-description">
            {t.changePassword.description}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="change-password-form">
          <div className="form-group">
            <label htmlFor="account" className="form-label">
              {t.changePassword.accountLabel}
            </label>
            <input
              type="text"
              id="account"
              name="account"
              value={formData.account}
              onChange={handleChange}
              className={`form-input ${errors.account ? 'error' : ''}`}
              aria-invalid={!!errors.account}
              aria-describedby={errors.account ? 'account-error' : undefined}
              autoComplete="username"
            />
            {errors.account && (
              <span id="account-error" className="error-message" role="alert">
                {errors.account}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="currentPassword" className="form-label">
              {t.changePassword.currentPasswordLabel}
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className={`form-input ${errors.currentPassword ? 'error' : ''}`}
              aria-invalid={!!errors.currentPassword}
              aria-describedby={
                errors.currentPassword ? 'currentPassword-error' : undefined
              }
            />
            {errors.currentPassword && (
              <span
                id="currentPassword-error"
                className="error-message"
                role="alert"
              >
                {errors.currentPassword}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="newPassword" className="form-label">
              {t.changePassword.newPasswordLabel}
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className={`form-input ${errors.newPassword ? 'error' : ''}`}
              aria-invalid={!!errors.newPassword}
              aria-describedby={
                errors.newPassword ? 'newPassword-error' : undefined
              }
            />
            {errors.newPassword && (
              <span
                id="newPassword-error"
                className="error-message"
                role="alert"
              >
                {errors.newPassword}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              {t.changePassword.confirmPasswordLabel}
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
              aria-invalid={!!errors.confirmPassword}
              aria-describedby={
                errors.confirmPassword ? 'confirmPassword-error' : undefined
              }
            />
            {errors.confirmPassword && (
              <span
                id="confirmPassword-error"
                className="error-message"
                role="alert"
              >
                {errors.confirmPassword}
              </span>
            )}
          </div>

          <div className="password-requirements">
            <h3 className="requirements-title">
              {t.changePassword.passwordRequirements}
            </h3>
            <ul className="requirements-list">
              <li
                className={checkPasswordRequirement(1) ? 'requirement-met' : ''}
              >
                <span
                  className={`requirement-icon ${
                    checkPasswordRequirement(1)
                      ? 'requirement-checkmark'
                      : 'requirement-unmet'
                  }`}
                >
                  {checkPasswordRequirement(1) ? '✓' : '✕'}
                </span>
                {t.changePassword.requirement1}
              </li>
              <li
                className={checkPasswordRequirement(2) ? 'requirement-met' : ''}
              >
                <span
                  className={`requirement-icon ${
                    checkPasswordRequirement(2)
                      ? 'requirement-checkmark'
                      : 'requirement-unmet'
                  }`}
                >
                  {checkPasswordRequirement(2) ? '✓' : '✕'}
                </span>
                {t.changePassword.requirement2}
              </li>
              <li
                className={checkPasswordRequirement(3) ? 'requirement-met' : ''}
              >
                <span
                  className={`requirement-icon ${
                    checkPasswordRequirement(3)
                      ? 'requirement-checkmark'
                      : 'requirement-unmet'
                  }`}
                >
                  {checkPasswordRequirement(3) ? '✓' : '✕'}
                </span>
                {t.changePassword.requirement3}
              </li>
              <li
                className={checkPasswordRequirement(4) ? 'requirement-met' : ''}
              >
                <span
                  className={`requirement-icon ${
                    checkPasswordRequirement(4)
                      ? 'requirement-checkmark'
                      : 'requirement-unmet'
                  }`}
                >
                  {checkPasswordRequirement(4) ? '✓' : '✕'}
                </span>
                {t.changePassword.requirement4}
              </li>
              <li
                className={checkPasswordRequirement(5) ? 'requirement-met' : ''}
              >
                <span
                  className={`requirement-icon ${
                    checkPasswordRequirement(5)
                      ? 'requirement-checkmark'
                      : 'requirement-unmet'
                  }`}
                >
                  {checkPasswordRequirement(5) ? '✓' : '✕'}
                </span>
                {t.changePassword.requirement5}
              </li>
            </ul>
          </div>

          {submitError && (
            <div className="submit-error" role="alert">
              {submitError}
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              onClick={handleBack}
              className="button button-secondary"
              disabled={isSubmitting}
            >
              {t.common.cancel}
            </button>
            <button
              type="submit"
              className="button button-primary"
              disabled={isSubmitting || !areAllRequirementsMet()}
            >
              {isSubmitting ? t.common.loading : t.changePassword.submitButton}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
