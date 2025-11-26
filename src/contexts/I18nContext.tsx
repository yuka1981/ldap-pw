'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Locale, getTranslations, Translations, defaultLocale } from '@/i18n';

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
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [mounted, setMounted] = useState(false);

  // Handle client-side only localStorage access
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('locale') as Locale;
    const initialLocale = saved && ['en', 'zh-TW', 'ja'].includes(saved) ? saved : defaultLocale;
    setLocaleState(initialLocale);
    document.documentElement.lang = initialLocale;
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', newLocale);
      document.documentElement.lang = newLocale;
    }
  };

  useEffect(() => {
    if (mounted) {
      document.documentElement.lang = locale;
    }
  }, [locale, mounted]);

  const value: I18nContextType = {
    locale,
    setLocale,
    t: getTranslations(locale),
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

