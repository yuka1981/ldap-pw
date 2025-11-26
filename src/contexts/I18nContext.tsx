import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Locale, getTranslations, Translations, defaultLocale } from '../i18n';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
};

interface I18nProviderProps {
  children: ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const saved = localStorage.getItem('locale') as Locale;
    const initialLocale = saved && ['en', 'zh-TW', 'ja'].includes(saved) ? saved : defaultLocale;
    // Set HTML lang attribute immediately on initialization
    document.documentElement.lang = initialLocale;
    return initialLocale;
  });

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
    document.documentElement.lang = newLocale;
  };

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value: I18nContextType = {
    locale,
    setLocale,
    t: getTranslations(locale),
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

