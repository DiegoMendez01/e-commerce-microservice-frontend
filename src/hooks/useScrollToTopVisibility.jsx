import { useState, useEffect } from 'react';

export default function useScrollToTopVisibility(threshold = 300) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsVisible(window.pageYOffset > threshold);
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return isVisible;
}