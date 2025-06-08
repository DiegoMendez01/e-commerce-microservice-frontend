import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import './LanguageSelector.css';

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  const handleChange = (e) => {
    setLanguage(e.target.value);
  };

  return (
    <div className="language-selector">
      <label htmlFor="language-select" className="sr-only">Seleccionar idioma</label>
      <select
        id="language-select"
        value={language}
        onChange={handleChange}
      >
        <option value="es">ES</option>
        <option value="en">EN</option>
      </select>
    </div>
  );
}