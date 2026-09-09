"use client";

import gsap from "gsap";
import { type RefObject, useCallback } from "react";

interface HeroMorphRefs {
  primaryImageRef: RefObject<HTMLImageElement | null>;
  altImageRef: RefObject<HTMLImageElement | null>;
  glowRef: RefObject<HTMLDivElement | null>;
}

/**
 * Custom hook for managing the artistic morph illustration cross-dissolve & glow on hover
 */
export function useHeroMorph({
  primaryImageRef,
  altImageRef,
  glowRef,
}: HeroMorphRefs) {
  const onMouseEnter = useCallback(() => {
    if (!primaryImageRef.current || !altImageRef.current) return;

    // Cross-fade out primary with gentle artistic dissolve & brush scale
    gsap.to(primaryImageRef.current, {
      opacity: 0,
      scale: 0.97,
      filter: "blur(4px)",
      duration: 0.65,
      ease: "power2.inOut",
      overwrite: "auto",
    });

    // Cross-fade in alternate entity illustration with reveal
    gsap.fromTo(
      altImageRef.current,
      { opacity: 0, scale: 1.04, filter: "blur(5px)" },
      {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.65,
        ease: "power2.inOut",
        overwrite: "auto",
      },
    );

    if (glowRef.current) {
      gsap.to(glowRef.current, {
        scale: 1.15,
        opacity: 0.95,
        duration: 0.65,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  }, [primaryImageRef, altImageRef, glowRef]);

  const onMouseLeave = useCallback(() => {
    if (!primaryImageRef.current || !altImageRef.current) return;

    // Revert back to primary character smoothly
    gsap.to(primaryImageRef.current, {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      duration: 0.65,
      ease: "power2.inOut",
      overwrite: "auto",
    });

    gsap.to(altImageRef.current, {
      opacity: 0,
      scale: 1.04,
      filter: "blur(5px)",
      duration: 0.65,
      ease: "power2.inOut",
      overwrite: "auto",
    });

    if (glowRef.current) {
      gsap.to(glowRef.current, {
        scale: 1,
        opacity: 0.8,
        duration: 0.65,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  }, [primaryImageRef, altImageRef, glowRef]);

  return { onMouseEnter, onMouseLeave };
}
