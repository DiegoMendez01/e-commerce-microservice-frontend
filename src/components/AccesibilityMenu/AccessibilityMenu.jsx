import React, { useState, useEffect } from 'react';
import './AccessibilityMenu.css';

export default function AccessibilityMenu() {
  const getInitialFontSize = () => {
    const saved = localStorage.getItem('fontSize');
    return saved ? parseInt(saved, 10) : 16;
  };

  const getInitialDarkMode = () => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  const [fontSize, setFontSize] = useState(getInitialFontSize);
  const [darkMode, setDarkMode] = useState(getInitialDarkMode);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const increaseFont = () => setFontSize((size) => Math.min(size + 2, 24));
  const decreaseFont = () => setFontSize((size) => Math.max(size - 2, 12));
  const resetFont = () => setFontSize(16);
  const toggleDarkMode = () => setDarkMode((mode) => !mode);

  return (
    <nav aria-label="Menú de accesibilidad" className="accessibility-menu" role="region">
      <button onClick={increaseFont} aria-label="Aumentar tamaño de fuente" title="Aumentar tamaño de fuente">
        <i className="fa-solid fa-plus" aria-hidden="true"></i>
      </button>

      <button onClick={resetFont} aria-label="Restablecer tamaño de fuente" title="Restablecer tamaño de fuente">
        <i className="fa-solid fa-font" aria-hidden="true"></i>
      </button>

      <button onClick={decreaseFont} aria-label="Disminuir tamaño de fuente" title="Disminuir tamaño de fuente">
        <i className="fa-solid fa-minus" aria-hidden="true"></i>
      </button>

      <button
        onClick={toggleDarkMode}
        aria-pressed={darkMode}
        aria-label={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
        title={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      >
        {darkMode ? (
          <i className="fa-solid fa-sun" aria-hidden="true"></i>
        ) : (
          <i className="fa-solid fa-moon" aria-hidden="true"></i>
        )}
      </button>
    </nav>
  );
}