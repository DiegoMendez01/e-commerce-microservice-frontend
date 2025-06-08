import React, { useState } from 'react';
import './LanguageSelector.css';

export default function LanguageSelector() {
  const [language, setLanguage] = useState('es');

  const handleChange = (e) => {
    setLanguage(e.target.value);
    console.log(`Idioma seleccionado: ${e.target.value}`);
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