import { useEffect, useState } from 'react';

export default function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains('dark-mode')
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark-mode'));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return isDarkMode;
}