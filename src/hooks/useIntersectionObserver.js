// hooks/useIntersectionObserver.js
import { useState, useEffect } from 'react';

export const useIntersectionObserver = (ref) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const currentRef = ref.current;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          // Optionally, you can disconnect the observer here if you want the animation to trigger only once
          observer.disconnect();
        }
      });
    }, { threshold: 0.25 });

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [ref, isVisible]);

  return isVisible;
};
