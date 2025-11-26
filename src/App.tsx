import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { I18nProvider } from './contexts/I18nContext';
import { LanguageSelector } from './components/LanguageSelector/LanguageSelector';
import { Home } from './components/Home/Home';
import { ChangePassword } from './components/ChangePassword/ChangePassword';
import './styles/global.css';

function App() {
  return (
    <I18nProvider>
      <BrowserRouter>
        <LanguageSelector />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/change-password" element={<ChangePassword />} />
        </Routes>
      </BrowserRouter>
    </I18nProvider>
  );
}

export default App;

