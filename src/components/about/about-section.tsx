"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { AboutHeader } from "./about-header";
import { AboutPillars } from "./about-pillars";
import { AboutStory } from "./about-story";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const storyRef = useRef<HTMLElement>(null);
  const pillarsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { y: 25, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power3.out",
            clearProps: "opacity,transform",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 85%",
            },
          },
        );
      }

      if (storyRef.current) {
        gsap.fromTo(
          storyRef.current,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
            clearProps: "opacity,transform",
            scrollTrigger: {
              trigger: storyRef.current,
              start: "top 85%",
            },
          },
        );
      }

      if (pillarsRef.current) {
        gsap.fromTo(
          pillarsRef.current,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
            clearProps: "opacity,transform",
            scrollTrigger: {
              trigger: pillarsRef.current,
              start: "top 85%",
            },
          },
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      aria-labelledby="about-heading"
      className="w-full py-16 sm:py-20 lg:py-24 bg-slate-50/70 dark:bg-zinc-950/70 border-t border-border/50 relative overflow-hidden"
    >
      {/* Ambient background decoration */}
      <div
        className="absolute inset-0 pointer-events-none select-none z-0"
        aria-hidden="true"
      >
        <div className="absolute top-1/2 left-0 w-80 h-80 rounded-full bg-primary/5 dark:bg-primary/10 blur-3xl" />
        <div className="absolute bottom-10 right-0 w-80 h-80 rounded-full bg-secondary/10 dark:bg-secondary/15 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10 space-y-12 sm:space-y-16">
        <AboutHeader headerRef={headerRef} />
        <AboutStory storyRef={storyRef} />
        <AboutPillars pillarsRef={pillarsRef} />
      </div>
    </section>
  );
}
