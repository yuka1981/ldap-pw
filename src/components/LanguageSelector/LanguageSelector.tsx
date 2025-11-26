'use client';

import React from 'react';
import { useI18n } from '@/contexts/I18nContext';
import { Locale } from '@/i18n';
import './LanguageSelector.css';

export const LanguageSelector: React.FC = () => {
  const { locale, setLocale, t } = useI18n();

  const languages: { code: Locale; label: string }[] = [
    { code: 'en', label: t.language.english },
    { code: 'zh-TW', label: t.language.traditionalChinese },
    { code: 'ja', label: t.language.japanese },
  ];

  return (
    <div className="language-selector">
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        className="language-select"
        aria-label="Select language"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
};

