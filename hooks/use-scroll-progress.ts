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
      
      // Prevent division by zero and ensure valid progress value
      let progress = 0;
      if (maxHeight > 0) {
        progress = Math.round((scrolled / maxHeight) * 100);
        progress = Math.min(progress, 100);
        progress = Math.max(progress, 0); // Ensure progress is not negative
      }
      
      setScrollProgress(progress);
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