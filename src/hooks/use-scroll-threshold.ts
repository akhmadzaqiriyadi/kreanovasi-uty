"use client";

import { useEffect, useState } from "react";

/**
 * High performance, 120fps rAF-throttled scroll threshold detector
 * @param threshold Scroll Y threshold in pixels (default: 25)
 */
export function useScrollThreshold(threshold = 25): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > threshold);
          ticking = false;
        });
        ticking = true;
      }
    };

    // Initialize state on mount
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [threshold]);

  return scrolled;
}
