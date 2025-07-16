"use client";

import { useState, useEffect } from "react";

interface UseScrollProgressProps {
  threshold?: number;
}

export function useScrollProgress({ threshold = 300 }: UseScrollProgressProps = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrolled = document.documentElement.scrollTop;
      const maxHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = Math.round((scrolled / maxHeight) * 100);
      
      setScrollProgress(Math.min(progress, 100));
      setIsVisible(scrolled > threshold);
    };

    // Throttle scroll event for better performance
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateScrollProgress();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Initial check
    updateScrollProgress();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return {
    isVisible,
    scrollProgress,
    scrollToTop,
  };
} 