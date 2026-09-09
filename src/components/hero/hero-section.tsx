"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";
import { HeroActions } from "./hero-actions";
import { HeroContent } from "./hero-content";
import { HeroHighlights } from "./hero-highlights";
import { HeroMorphIllustration } from "./hero-morph-illustration";
import { HeroTicker } from "./hero-ticker";

export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const highlightsRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (badgeRef.current) {
        tl.fromTo(
          badgeRef.current,
          { y: -15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, clearProps: "opacity,transform" },
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
          "-=0.4",
        );
      }

      if (descRef.current) {
        tl.fromTo(
          descRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, clearProps: "opacity,transform" },
          "-=0.4",
        );
      }

      if (actionsRef.current?.children) {
        tl.fromTo(
          Array.from(actionsRef.current.children),
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.6,
            clearProps: "opacity,transform",
          },
          "-=0.4",
        );
      }

      if (highlightsRef.current?.children) {
        tl.fromTo(
          Array.from(highlightsRef.current.children),
          { y: 15, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.5,
            clearProps: "opacity,transform",
          },
          "-=0.3",
        );
      }

      if (imageRef.current) {
        tl.fromTo(
          imageRef.current,
          { scale: 0.95, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            clearProps: "opacity,transform,scale",
          },
          "-=0.7",
        );

        // Subtle continuous floating effect for hero illustration
        gsap.to(imageRef.current, {
          y: -8,
          duration: 3.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 1,
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full flex items-center pt-28 pb-12 lg:pt-36 lg:pb-16 overflow-hidden"
    >
      {/* Background Texture & Ambient Lights */}
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        <div
          className="absolute inset-0 opacity-20 dark:opacity-25 dark:invert"
          style={{
            backgroundImage: "url('/images/texture-herobg.svg')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-primary/10 dark:bg-primary/15 blur-3xl" />
        <div className="absolute top-1/3 right-0 w-96 h-96 rounded-full bg-secondary/15 dark:bg-secondary/20 blur-3xl" />
      </div>

      {/* Main Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            <HeroTicker badgeRef={badgeRef} />
            <HeroContent titleRef={titleRef} descRef={descRef} />
            <HeroActions actionsRef={actionsRef} />
            <HeroHighlights highlightsRef={highlightsRef} />
          </div>

          {/* Right Column: Interactive Morphing Hero Illustration */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
            <HeroMorphIllustration imageRef={imageRef} />
          </div>
        </div>
      </div>
    </section>
  );
}
