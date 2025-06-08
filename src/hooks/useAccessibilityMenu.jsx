import { useState, useEffect } from 'react';

export default function useAccessibilityMenu() {
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

  return {
    fontSize,
    darkMode,
    increaseFont,
    decreaseFont,
    resetFont,
    toggleDarkMode,
  };
}