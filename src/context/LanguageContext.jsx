import React, { createContext, useContext, useEffect, useState } from 'react';
import { t } from '../translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem('tentflow-language') === 'hi' ? 'hi' : 'en';
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('tentflow-language', lang);
    } catch {
      // Language still works for this session when storage is unavailable.
    }
    document.documentElement.lang = lang;
  }, [lang]);
  
  // Retrieve dictionary based on active language, falling back to English
  const strings = t[lang] || t.en;

  const toggleLanguage = () => {
    setLang(prev => (prev === 'en' ? 'hi' : 'en'));
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, strings }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
