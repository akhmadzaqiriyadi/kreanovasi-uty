"use client";

import Image from "next/image";
import type React from "react";
import { useRef } from "react";
import { useHeroMorph } from "@/hooks/use-hero-morph";
import { cn } from "@/lib/utils";

interface HeroMorphIllustrationProps {
  imageRef?: React.Ref<HTMLDivElement>;
  className?: string;
  maxHeight?: string;
}

export function HeroMorphIllustration({
  imageRef,
  className,
  maxHeight = "max-h-[520px]",
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
      className={cn(
        "relative w-full max-w-[440px] lg:max-w-[480px] flex justify-center cursor-pointer group select-none",
        className,
      )}
    >
      {/* Soft Golden Accent Glow */}
      <div
        ref={glowRef}
        className="absolute inset-4 sm:inset-6 bg-secondary/20 dark:bg-secondary/25 rounded-3xl blur-2xl opacity-80 pointer-events-none transition-transform duration-700"
      />

      <div
        className={cn(
          "relative w-full rounded-2xl overflow-hidden p-1 z-10 flex items-center justify-center",
          maxHeight,
        )}
      >
        {/* Primary Entity Illustration */}
        <Image
          ref={primaryImageRef}
          src="/images/hero.webp"
          alt="UTY Creative Hub Innovation"
          width={1024}
          height={1536}
          className={cn(
            "w-full object-contain drop-shadow-xl will-change-[opacity,transform,filter]",
            maxHeight,
          )}
          priority
        />

        {/* Alternate Morph Entity Illustration */}
        <Image
          ref={altImageRef}
          src="/images/hero-alt-v2.webp"
          alt="UTY Creative Hub Innovation Alternate Entity"
          width={1024}
          height={1536}
          className={cn(
            "w-full object-contain drop-shadow-xl absolute inset-0 m-auto opacity-0 will-change-[opacity,transform,filter]",
            maxHeight,
          )}
          priority
        />
      </div>
    </div>
  );
}
