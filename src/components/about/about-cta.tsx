"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, CalendarCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { useEffect, useRef } from "react";
import { aboutConfig } from "@/config/about";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface AboutCtaProps {
  sectionRef?: React.Ref<HTMLElement>;
}

export function AboutCta({ sectionRef }: AboutCtaProps) {
  const { cta } = aboutConfig;
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!innerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        innerRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          clearProps: "opacity,transform",
          scrollTrigger: {
            trigger: innerRef.current,
            start: "top 88%",
            once: true,
          },
        },
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="cta-heading"
      className="w-full py-14 sm:py-18 lg:py-20 relative overflow-hidden"
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-[oklch(0.28_0.075_270)] dark:from-[oklch(0.14_0.04_266)] dark:via-[oklch(0.17_0.05_266)] dark:to-[oklch(0.11_0.03_270)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: "url('/images/texture-herobg.svg')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute top-0 right-1/4 w-80 h-80 rounded-full bg-secondary/15 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-1/4 w-60 h-60 rounded-full bg-primary-foreground/5 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10">
        <div ref={innerRef} className="text-center space-y-6 sm:space-y-8">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-secondary/20 border border-secondary/30 flex items-center justify-center backdrop-blur-sm">
              <Sparkles
                className="h-7 w-7 sm:h-8 sm:w-8 text-secondary"
                aria-hidden="true"
              />
            </div>
          </div>

          {/* Text */}
          <div className="space-y-3">
            <h2
              id="cta-heading"
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary-foreground tracking-tight leading-tight"
            >
              {cta.title}
            </h2>
            <p className="text-sm sm:text-base text-primary-foreground/75 leading-relaxed max-w-2xl mx-auto font-medium">
              {cta.description}
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-10 bg-secondary/40 rounded-full" />
            <div className="h-1.5 w-1.5 rounded-full bg-secondary/60" />
            <div className="h-px w-10 bg-secondary/40 rounded-full" />
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link
              href={cta.primaryAction.href}
              className="inline-flex items-center gap-2 px-6 py-3 sm:px-7 sm:py-3.5 rounded-xl bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 active:scale-[0.97] touch-manipulation"
            >
              <CalendarCheck className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
              <span>{cta.primaryAction.label}</span>
            </Link>

            <Link
              href={cta.secondaryAction.href}
              className="inline-flex items-center gap-2 px-6 py-3 sm:px-7 sm:py-3.5 rounded-xl border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-semibold text-sm sm:text-base transition-all duration-300 active:scale-[0.97] touch-manipulation"
            >
              <span>{cta.secondaryAction.label}</span>
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
