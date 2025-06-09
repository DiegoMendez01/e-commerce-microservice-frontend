import { useState, useEffect } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState('es');

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage) {
      setLanguageState(storedLanguage);
    }
  }, []);

  const setLanguage = (lang) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}