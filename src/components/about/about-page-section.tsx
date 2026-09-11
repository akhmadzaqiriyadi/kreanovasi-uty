"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { AboutCta } from "./about-cta";
import { AboutHeroBanner } from "./about-hero-banner";
import { AboutPillars } from "./about-pillars";
import { AboutStats } from "./about-stats";
import { AboutStory } from "./about-story";
import { AboutTeam } from "./about-team";
import { AboutVideo } from "./about-video";
import { AboutVisionMission } from "./about-vision-mission";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function AboutPageSection() {
  const bannerRef = useRef<HTMLElement>(null);
  const visionRef = useRef<HTMLElement>(null);
  const storyRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLElement>(null);
  const teamRef = useRef<HTMLElement>(null);
  const pillarsRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Animate sections on scroll (except banner which has its own animation)
      const sections = [
        visionRef.current,
        storyRef.current,
        statsRef.current,
        videoRef.current,
        teamRef.current,
        pillarsRef.current,
      ].filter(Boolean) as HTMLElement[];

      for (const section of sections) {
        gsap.fromTo(
          section,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
            clearProps: "opacity,transform",
            scrollTrigger: {
              trigger: section,
              start: "top 88%",
              once: true,
            },
          },
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <main aria-label="Halaman Tentang UTY Creative Hub">
      {/* 1. Hero Banner */}
      <AboutHeroBanner bannerRef={bannerRef} />

      {/* 2. Vision & Mission */}
      <AboutVisionMission sectionRef={visionRef} />

      {/* 3. Story & Focus Areas */}
      <section className="w-full py-12 sm:py-16 lg:py-20 bg-slate-50/70 dark:bg-zinc-950/70 border-t border-border/50 relative overflow-hidden">
        {/* Ambient decoration */}
        <div
          className="absolute inset-0 pointer-events-none select-none"
          aria-hidden="true"
        >
          <div className="absolute top-1/2 left-0 w-72 h-72 rounded-full bg-primary/5 dark:bg-primary/10 blur-3xl" />
          <div className="absolute bottom-10 right-0 w-72 h-72 rounded-full bg-secondary/10 dark:bg-secondary/15 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
          <AboutStory storyRef={storyRef} />
        </div>
      </section>

      {/* 4. Stats */}
      <AboutStats sectionRef={statsRef} />

      {/* 5. Video */}
      <section className="w-full py-12 sm:py-16 bg-background border-t border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <AboutVideo videoRef={videoRef} />
        </div>
      </section>

      {/* 6. Team */}
      <AboutTeam sectionRef={teamRef} />

      {/* 7. Pillars */}
      <section className="w-full py-12 sm:py-16 lg:py-20 bg-slate-50/70 dark:bg-zinc-950/70 border-t border-border/50 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          <div className="absolute bottom-0 left-1/3 w-72 h-72 rounded-full bg-secondary/10 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
          <AboutPillars pillarsRef={pillarsRef} />
        </div>
      </section>

      {/* 8. CTA */}
      <AboutCta sectionRef={ctaRef} />
    </main>
  );
}
