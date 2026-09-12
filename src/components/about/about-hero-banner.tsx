"use client";

import gsap from "gsap";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { useEffect, useRef } from "react";
import { aboutConfig } from "@/config/about";

interface AboutHeroBannerProps {
  bannerRef?: React.Ref<HTMLElement>;
}

export function AboutHeroBanner({ bannerRef }: AboutHeroBannerProps) {
  const { heroBanner } = aboutConfig;
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const breadcrumbRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (breadcrumbRef.current) {
        tl.fromTo(
          breadcrumbRef.current,
          { y: -10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, clearProps: "opacity,transform" },
        );
      }

      if (titleRef.current?.children) {
        tl.fromTo(
          Array.from(titleRef.current.children),
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.7,
            clearProps: "opacity,transform",
          },
          "-=0.3",
        );
      }

      if (descRef.current) {
        tl.fromTo(
          descRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, clearProps: "opacity,transform" },
          "-=0.3",
        );
      }
    }, contentRef);

    return () => ctx.revert();
  }, []);

  return (
    <header
      ref={bannerRef}
      aria-label="Tentang UTY Creative Hub"
      className="relative w-full pt-24 pb-14 sm:pt-28 sm:pb-16 md:pt-32 md:pb-20 overflow-hidden"
    >
      {/* Background layers */}
      <div
        className="absolute inset-0 pointer-events-none select-none"
        aria-hidden="true"
      >
        {/* Deep Navy Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-[oklch(0.28_0.075_270)] dark:from-[oklch(0.13_0.03_266)] dark:via-[oklch(0.16_0.045_266)] dark:to-[oklch(0.10_0.02_270)]" />

        {/* Texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "url('/images/texture-herobg.svg')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Gold glow blobs */}
        <div className="absolute top-0 left-1/4 w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-56 h-56 sm:w-80 sm:h-80 rounded-full bg-primary-foreground/5 blur-3xl" />
        <div className="absolute top-1/2 right-0 w-48 h-48 rounded-full bg-secondary/10 blur-2xl" />
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10"
      >
        {/* Breadcrumb */}
        <nav
          ref={breadcrumbRef}
          aria-label="Breadcrumb navigasi"
          className="flex items-center gap-1.5 text-xs text-primary-foreground/60 font-medium mb-6 sm:mb-8"
        >
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-primary-foreground/90 transition-colors"
          >
            <Home className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Beranda</span>
          </Link>
          <ChevronRight
            className="h-3.5 w-3.5 text-primary-foreground/40"
            aria-hidden="true"
          />
          <span className="text-primary-foreground/90">Tentang Kami</span>
        </nav>

        <div className="max-w-3xl mx-auto text-center space-y-5 sm:space-y-6">
          {/* Title */}
          <div ref={titleRef} className="space-y-1">
            <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary-foreground leading-tight tracking-tight">
              {heroBanner.title}
            </h1>
            <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
              <span className="text-secondary">{heroBanner.highlight}</span>
            </h1>
            <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary-foreground leading-tight tracking-tight">
              {heroBanner.subtitle}
            </h1>
          </div>

          {/* Description */}
          <p
            ref={descRef}
            className="text-sm sm:text-base lg:text-lg text-primary-foreground/75 leading-relaxed max-w-2xl mx-auto font-medium"
          >
            {heroBanner.description}
          </p>
        </div>
      </div>

      {/* Bottom wave */}
      <div
        className="absolute bottom-0 left-0 right-0 h-8 sm:h-12"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1440 48"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full h-full fill-background"
        >
          <path d="M0,48 C360,0 1080,0 1440,48 L1440,48 L0,48 Z" />
        </svg>
      </div>
    </header>
  );
}
