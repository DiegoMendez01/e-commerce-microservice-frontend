import React from 'react';
import './AccessibilityMenu.css';
import useAccessibilityMenu from '../../hooks/useAccessibilityMenu';
import { useLanguage } from '../../hooks/useLanguage';
import Translations from '../../Translations/Translations';

export default function AccessibilityMenu() {
  const {
    darkMode,
    increaseFont,
    decreaseFont,
    resetFont,
    toggleDarkMode,
  } = useAccessibilityMenu();

  const { language } = useLanguage();
  const t = Translations[language];

  return (
    <nav aria-label={t.accessibilityMenuLabel} className="accessibility-menu" role="region">
      <button
        onClick={increaseFont}
        aria-label={t.increaseFont}
        title={t.increaseFont}
      >
        <i className="fa-solid fa-plus" aria-hidden="true"></i>
      </button>

      <button
        onClick={resetFont}
        aria-label={t.resetFont}
        title={t.resetFont}
      >
        <i className="fa-solid fa-font" aria-hidden="true"></i>
      </button>

      <button
        onClick={decreaseFont}
        aria-label={t.decreaseFont}
        title={t.decreaseFont}
      >
        <i className="fa-solid fa-minus" aria-hidden="true"></i>
      </button>

      <button
        onClick={toggleDarkMode}
        aria-pressed={darkMode}
        aria-label={darkMode ? t.toggleDarkModeOff : t.toggleDarkModeOn}
        title={darkMode ? t.toggleDarkModeOff : t.toggleDarkModeOn}
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