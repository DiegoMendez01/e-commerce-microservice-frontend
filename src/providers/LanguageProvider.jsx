import { useState } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('es');

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}