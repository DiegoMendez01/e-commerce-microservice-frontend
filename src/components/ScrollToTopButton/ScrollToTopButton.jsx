import React from 'react';
import './ScrollToTopButton.css';
import useScrollToTopVisibility from '../../hooks/useScrollToTopVisibility';

export default function ScrollToTopButton() {
  const isVisible = useScrollToTopVisibility();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="scroll-to-top"
      aria-label="Volver al inicio"
      title="Volver al inicio"
    >
      ↑
    </button>
  );
}