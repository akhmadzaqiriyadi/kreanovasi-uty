"use client";

import gsap from "gsap";
import type React from "react";
import { useEffect, useRef } from "react";

interface HeroTickerProps {
  badgeRef?: React.Ref<HTMLElement>;
}

export function HeroTicker({ badgeRef }: HeroTickerProps) {
  const tickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!tickerRef.current) return;

    const tween = gsap.to(tickerRef.current, {
      xPercent: -50,
      repeat: -1,
      duration: 16,
      ease: "none",
    });

    return () => {
      tween.kill();
    };
  }, []);

  return (
    <aside
      ref={badgeRef}
      aria-label="Tagline UTY Creative Hub"
      className="inline-flex items-center px-3 py-1 sm:px-3.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] sm:text-xs font-semibold tracking-wide shadow-xs w-[200px] xs:w-[230px] sm:w-[260px] md:w-[280px] overflow-hidden select-none"
    >
      <div className="overflow-hidden whitespace-nowrap flex-1 h-4 sm:h-4.5 flex items-center relative [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div
          ref={tickerRef}
          className="flex items-center gap-4 sm:gap-5 whitespace-nowrap shrink-0 will-change-transform"
        >
          <div className="flex items-center gap-4 sm:gap-5 shrink-0 text-[11px] sm:text-xs font-medium text-primary">
            <span>Innovate. Collaborate. Create.</span>
            <span className="text-secondary font-bold">•</span>
            <span>Pusat Kreativitas & Inovasi UTY</span>
            <span className="text-secondary font-bold">•</span>
            <span>Empower Ideas</span>
            <span className="text-secondary font-bold">•</span>
            <span>FastLab & Incubation</span>
            <span className="text-secondary font-bold">•</span>
          </div>
          <div
            className="flex items-center gap-4 sm:gap-5 shrink-0 text-[11px] sm:text-xs font-medium text-primary"
            aria-hidden="true"
          >
            <span>Innovate. Collaborate. Create.</span>
            <span className="text-secondary font-bold">•</span>
            <span>Pusat Kreativitas & Inovasi UTY</span>
            <span className="text-secondary font-bold">•</span>
            <span>Empower Ideas</span>
            <span className="text-secondary font-bold">•</span>
            <span>FastLab & Incubation</span>
            <span className="text-secondary font-bold">•</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
