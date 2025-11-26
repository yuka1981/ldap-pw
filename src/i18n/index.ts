import enYaml from './locales/en.yaml?raw';
import zhTWYaml from './locales/zh-TW.yaml?raw';
import jaYaml from './locales/ja.yaml?raw';
import yaml from 'js-yaml';

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

// 解析 YAML 檔案
const parseYaml = (yamlContent: string): Translations => {
  return yaml.load(yamlContent) as Translations;
};

export const translations: Record<Locale, Translations> = {
  en: parseYaml(enYaml),
  'zh-TW': parseYaml(zhTWYaml),
  ja: parseYaml(jaYaml),
};

export const defaultLocale: Locale = 'en';

export const getTranslations = (
  locale: Locale = defaultLocale
): Translations => {
  return translations[locale] || translations[defaultLocale];
};
