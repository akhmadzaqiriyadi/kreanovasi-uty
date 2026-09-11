"use client";

import gsap from "gsap";
import { type RefObject, useCallback, useRef } from "react";

interface HeroMorphRefs {
  primaryImageRef: RefObject<HTMLImageElement | null>;
  altImageRef: RefObject<HTMLImageElement | null>;
  glowRef: RefObject<HTMLDivElement | null>;
}

/**
 * Custom hook for managing the artistic morph illustration cross-dissolve & glow
 * Supports mouse hover on desktop and touch gestures (touch & hold, swipe scrub, release) on mobile
 */
export function useHeroMorph({
  primaryImageRef,
  altImageRef,
  glowRef,
}: HeroMorphRefs) {
  const isTouchActive = useRef(false);
  const touchStartX = useRef(0);

  const morphTo = useCallback(
    (progress: number, duration = 0.5) => {
      const primary = primaryImageRef.current;
      const alt = altImageRef.current;
      const glow = glowRef.current;
      if (!primary || !alt) return;

      const pOpacity = 1 - progress;
      const pScale = 1 - progress * 0.03;
      const pBlur = progress * 4;

      const aOpacity = progress;
      const aScale = 1.04 - progress * 0.04;
      const aBlur = (1 - progress) * 4;

      gsap.to(primary, {
        opacity: pOpacity,
        scale: pScale,
        filter: `blur(${pBlur}px)`,
        duration,
        ease: "power2.out",
        overwrite: "auto",
      });

      gsap.to(alt, {
        opacity: aOpacity,
        scale: aScale,
        filter: `blur(${aBlur}px)`,
        duration,
        ease: "power2.out",
        overwrite: "auto",
      });

      if (glow) {
        gsap.to(glow, {
          scale: 1 + progress * 0.15,
          opacity: 0.8 + progress * 0.18,
          duration,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    },
    [primaryImageRef, altImageRef, glowRef],
  );

  // Desktop Hover Handlers
  const onMouseEnter = useCallback(() => {
    // Only trigger on devices with a real mouse/pointer
    if (
      typeof window !== "undefined" &&
      !window.matchMedia("(pointer: fine)").matches
    ) {
      return;
    }
    morphTo(1, 0.6);
  }, [morphTo]);

  const onMouseLeave = useCallback(() => {
    if (
      typeof window !== "undefined" &&
      !window.matchMedia("(pointer: fine)").matches
    ) {
      return;
    }
    morphTo(0, 0.6);
  }, [morphTo]);

  // Mobile Touch & Gesture Handlers
  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      isTouchActive.current = true;
      touchStartX.current = e.touches[0].clientX;
      // Immediate tactile morph on touch
      morphTo(1, 0.35);
    },
    [morphTo],
  );

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isTouchActive.current) return;
      const currentX = e.touches[0].clientX;
      const deltaX = currentX - touchStartX.current;
      // Allow finger gesture to scrub between characters (drag distance ~ 80px)
      const gestureProgress = Math.min(Math.max(1 + deltaX / 100, 0), 1);
      morphTo(gestureProgress, 0.1);
    },
    [morphTo],
  );

  const onTouchEnd = useCallback(() => {
    isTouchActive.current = false;
    // Smoothly revert back to primary entity on release so it never gets stuck
    morphTo(0, 0.5);
  }, [morphTo]);

  const onTouchCancel = useCallback(() => {
    isTouchActive.current = false;
    morphTo(0, 0.4);
  }, [morphTo]);

  return {
    onMouseEnter,
    onMouseLeave,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onTouchCancel,
  };
}
