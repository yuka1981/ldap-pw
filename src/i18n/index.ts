import en from './locales/en.yaml';
import zhTW from './locales/zh-TW.yaml';
import ja from './locales/ja.yaml';

export type Locale = 'en' | 'zh-TW' | 'ja';

export interface Translations {
  common: {
    changePassword: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    submit: string;
    cancel: string;
    back: string;
    loading: string;
    success: string;
    error: string;
  };
  home: {
    title: string;
    description: string;
    startButton: string;
    welcome: string;
  };
  changePassword: {
    title: string;
    description: string;
    accountLabel: string;
    currentPasswordLabel: string;
    newPasswordLabel: string;
    confirmPasswordLabel: string;
    passwordRequirements: string;
    requirement1: string;
    requirement2: string;
    requirement3: string;
    requirement4: string;
    requirement5: string;
    submitButton: string;
    successMessage: string;
    errorMessage: string;
    validation: {
      accountRequired: string;
      currentPasswordRequired: string;
      currentPasswordIncorrect: string;
      newPasswordRequired: string;
      newPasswordWeak: string;
      confirmPasswordRequired: string;
      passwordMismatch: string;
    };
  };
  language: {
    english: string;
    traditionalChinese: string;
    japanese: string;
  };
}

export const translations: Record<Locale, Translations> = {
  en,
  'zh-TW': zhTW,
  ja,
};

export const defaultLocale: Locale = 'en';

export const getTranslations = (
  locale: Locale = defaultLocale
): Translations => {
  return translations[locale] || translations[defaultLocale];
};
