import React from 'react';
import './ScrollToTopButton.css';
import useScrollToTopVisibility from '../../hooks/useScrollToTopVisibility';
import { useLanguage } from '../../hooks/useLanguage';
import Translations from '../../Translations/Translations';

export default function ScrollToTopButton() {
  const isVisible = useScrollToTopVisibility();
  const { language } = useLanguage();
  const t = Translations[language];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isVisible) return null;

  return (
    <nav aria-label={t.scrollToTopLabel} className="scroll-to-top" role="region">
      <button
        onClick={scrollToTop}
        aria-label={t.scrollToTop}
        title={t.scrollToTop}
      >
        <i className="fa-solid fa-arrow-up" aria-hidden="true"></i>
      </button>
    </nav>
  );
}