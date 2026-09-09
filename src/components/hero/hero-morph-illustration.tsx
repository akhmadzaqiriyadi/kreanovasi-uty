"use client";

import Image from "next/image";
import type React from "react";
import { useRef } from "react";
import { useHeroMorph } from "@/hooks/use-hero-morph";

interface HeroMorphIllustrationProps {
  imageRef?: React.Ref<HTMLDivElement>;
}

export function HeroMorphIllustration({
  imageRef,
}: HeroMorphIllustrationProps) {
  const primaryImageRef = useRef<HTMLImageElement>(null);
  const altImageRef = useRef<HTMLImageElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const { onMouseEnter, onMouseLeave } = useHeroMorph({
    primaryImageRef,
    altImageRef,
    glowRef,
  });

  return (
    <div
      ref={imageRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="relative w-full max-w-[440px] lg:max-w-[480px] flex justify-center cursor-pointer group select-none"
    >
      {/* Soft Golden Accent Glow */}
      <div
        ref={glowRef}
        className="absolute inset-6 bg-secondary/20 dark:bg-secondary/25 rounded-3xl blur-2xl opacity-80 pointer-events-none transition-transform duration-700"
      />

      <div className="relative w-full max-h-[520px] rounded-2xl overflow-hidden p-1 z-10 flex items-center justify-center">
        {/* Primary Entity Illustration */}
        <Image
          ref={primaryImageRef}
          src="/images/hero.webp"
          alt="UTY Creative Hub Innovation"
          width={1024}
          height={1536}
          className="w-full max-h-[520px] object-contain drop-shadow-xl will-change-[opacity,transform,filter]"
          priority
        />

        {/* Alternate Morph Entity Illustration */}
        <Image
          ref={altImageRef}
          src="/images/hero-alt-v2.webp"
          alt="UTY Creative Hub Innovation Alternate Entity"
          width={1024}
          height={1536}
          className="w-full max-h-[520px] object-contain drop-shadow-xl absolute inset-0 m-auto opacity-0 will-change-[opacity,transform,filter]"
          priority
        />
      </div>
    </div>
  );
}
