'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/contexts/I18nContext';
import './Home.css';

export const Home: React.FC = () => {
  const router = useRouter();
  const { t } = useI18n();

  const handleStart = () => {
    router.push('/change-password');
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="home-header">
          <h1 className="home-title">{t.home.title}</h1>
          <p className="home-description">{t.home.description}</p>
        </div>

        <div className="home-actions">
          <button className="home-button" onClick={handleStart}>
            {t.home.startButton}
          </button>
        </div>

        <div className="home-welcome">
          <p>{t.home.welcome}</p>
        </div>
      </div>
    </div>
  );
};

