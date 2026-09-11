"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { buttonVariants } from "@/components/ui/button";
import { eventsConfig } from "@/config/events";
import { cn } from "@/lib/utils";
import { EventsGrid } from "./events-grid";
import { EventsHeader } from "./events-header";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function EventsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const { cta } = eventsConfig;

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

      if (gridRef.current?.children) {
        gsap.fromTo(
          Array.from(gridRef.current.children),
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.12,
            duration: 0.7,
            ease: "power3.out",
            clearProps: "opacity,transform",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 85%",
            },
          },
        );
      }

      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power3.out",
            clearProps: "opacity,transform",
            scrollTrigger: {
              trigger: ctaRef.current,
              start: "top 90%",
            },
          },
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="events"
      ref={sectionRef}
      aria-labelledby="events-heading"
      className="w-full py-12 sm:py-16 lg:py-20 bg-slate-50/70 dark:bg-zinc-950/70 relative overflow-hidden border-t border-border/50"
    >
      {/* Subtle Background Glows */}
      <div
        className="absolute inset-0 pointer-events-none select-none z-0"
        aria-hidden="true"
      >
        <div className="absolute top-1/4 left-0 w-80 h-80 rounded-full bg-primary/5 dark:bg-primary/10 blur-3xl" />
        <div className="absolute bottom-10 right-0 w-72 h-72 rounded-full bg-secondary/10 dark:bg-secondary/15 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10 space-y-10 sm:space-y-12">
        {/* Header */}
        <EventsHeader headerRef={headerRef} />

        {/* 3 Events Grid */}
        <EventsGrid gridRef={gridRef} />

        {/* Section Bottom CTA */}
        <div ref={ctaRef} className="flex justify-center pt-2 sm:pt-4">
          <Link
            href={cta.href}
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-11 sm:h-12 px-6 sm:px-8 border-2 border-primary/30 dark:border-primary/50 text-primary dark:text-blue-200 hover:bg-accent hover:border-secondary font-semibold rounded-xl transition-all active:scale-[0.98] touch-manipulation flex items-center gap-2 group",
            )}
          >
            <span>{cta.label}</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
