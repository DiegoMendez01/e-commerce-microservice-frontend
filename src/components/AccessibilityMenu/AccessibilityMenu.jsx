import React from 'react';
import './AccessibilityMenu.css';
import useAccessibilityMenu from '../../hooks/useAccessibilityMenu';

export default function AccessibilityMenu() {
  const {
    darkMode,
    increaseFont,
    decreaseFont,
    resetFont,
    toggleDarkMode,
  } = useAccessibilityMenu();

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