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

  // Update error messages when locale changes
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      // Re-validate form to update error messages with new locale
      const newErrors: Record<string, string> = {};

      // Update account error if it exists
      if (errors.account) {
        if (!formData.account) {
          newErrors.account = t.changePassword.validation.accountRequired;
        }
      }

      // Update current password error if it exists
      if (errors.currentPassword) {
        if (!formData.currentPassword) {
          newErrors.currentPassword =
            t.changePassword.validation.currentPasswordRequired;
        } else {
          // If password is incorrect (from API error)
          newErrors.currentPassword =
            t.changePassword.validation.currentPasswordIncorrect;
        }
      }

      // Update new password error if it exists
      if (errors.newPassword) {
        if (!formData.newPassword) {
          newErrors.newPassword =
            t.changePassword.validation.newPasswordRequired;
        } else if (!validatePassword(formData.newPassword)) {
          newErrors.newPassword = t.changePassword.validation.newPasswordWeak;
        }
      }

      // Update confirm password error if it exists
      if (errors.confirmPassword) {
        if (!formData.confirmPassword) {
          newErrors.confirmPassword =
            t.changePassword.validation.confirmPasswordRequired;
        } else if (formData.newPassword !== formData.confirmPassword) {
          newErrors.confirmPassword =
            t.changePassword.validation.passwordMismatch;
        }
      }

      // Update errors with new locale messages
      setErrors(newErrors);
    }

    // Update submit error message if it exists
    if (submitError) {
      setSubmitError(t.changePassword.errorMessage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (submitError) {
      setSubmitError('');
    }
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
      // TODO: 串接 LDAP API - 呼叫密碼修改服務
      // 此處呼叫 changePassword 函數，該函數需要實作實際的 LDAP API 串接
      // 當 LDAP API 實作完成後，此處的錯誤處理邏輯可能需要根據實際 API 回應進行調整
      await changePassword(
        formData.account,
        formData.currentPassword,
        formData.newPassword
      );
      // TODO: 優化成功處理流程
      // 目前使用 alert 顯示成功訊息，建議改為更友善的 UI 提示（例如：Toast 通知）
      // Success - could navigate to success page or show success message
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
              <li>{t.changePassword.requirement1}</li>
              <li>{t.changePassword.requirement2}</li>
              <li>{t.changePassword.requirement3}</li>
              <li>{t.changePassword.requirement4}</li>
              <li>{t.changePassword.requirement5}</li>
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
              disabled={isSubmitting}
            >
              {isSubmitting ? t.common.loading : t.changePassword.submitButton}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
