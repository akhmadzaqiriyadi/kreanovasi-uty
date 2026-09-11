"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Award, Building, Calendar, Users } from "lucide-react";
import type React from "react";
import { useEffect, useRef } from "react";
import { type AboutStat, aboutConfig } from "@/config/about";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface AboutStatsProps {
  sectionRef?: React.Ref<HTMLElement>;
}

const statIcons: Record<
  AboutStat["iconName"],
  React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>
> = {
  users: Users,
  calendar: Calendar,
  building: Building,
  award: Award,
};

function StatCard({ stat, index }: { stat: AboutStat; index: number }) {
  const numberRef = useRef<HTMLSpanElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const Icon = statIcons[stat.iconName];
  const isGold = index % 2 === 1;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!numberRef.current) return;

    const counter = { val: 0 };
    const ctx = gsap.context(() => {
      gsap.to(counter, {
        val: stat.value,
        duration: 1.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 85%",
          once: true,
        },
        onUpdate() {
          if (numberRef.current) {
            numberRef.current.textContent = Math.round(counter.val).toString();
          }
        },
      });
    });

    return () => ctx.revert();
  }, [stat.value]);

  return (
    <div
      ref={cardRef}
      className="relative group p-6 sm:p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-border/70 shadow-xs hover:shadow-lg transition-all duration-300 active:scale-[0.99] touch-manipulation text-center overflow-hidden"
    >
      {/* Subtle background gradient on hover */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
          isGold
            ? "bg-gradient-to-br from-secondary/5 to-transparent"
            : "bg-gradient-to-br from-primary/5 to-transparent"
        }`}
        aria-hidden="true"
      />

      {/* Icon */}
      <div
        className={`mx-auto mb-4 h-12 w-12 rounded-2xl flex items-center justify-center ${
          isGold
            ? "bg-secondary/15 text-amber-600 dark:bg-secondary/20 dark:text-secondary"
            : "bg-primary/10 text-primary dark:bg-primary/25 dark:text-blue-300"
        }`}
        aria-hidden="true"
      >
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>

      {/* Number */}
      <div
        className={`text-4xl sm:text-5xl font-extrabold tracking-tight mb-1 ${
          isGold
            ? "text-secondary dark:text-secondary"
            : "text-primary dark:text-blue-300"
        }`}
        aria-live="polite"
      >
        <span ref={numberRef}>0</span>
        <span>{stat.suffix}</span>
      </div>

      {/* Label */}
      <p className="text-sm sm:text-base font-semibold text-muted-foreground">
        {stat.label}
      </p>

      {/* Bottom accent line */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-0.5 ${
          isGold
            ? "bg-gradient-to-r from-transparent via-secondary/50 to-transparent"
            : "bg-gradient-to-r from-transparent via-primary/30 to-transparent"
        }`}
        aria-hidden="true"
      />
    </div>
  );
}

export function AboutStats({ sectionRef }: AboutStatsProps) {
  const { stats } = aboutConfig;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="stats-heading"
      className="w-full py-12 sm:py-16 bg-slate-50/70 dark:bg-zinc-950/70 border-y border-border/50"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-8 sm:mb-10">
          <h2
            id="stats-heading"
            className="text-xl sm:text-2xl font-extrabold text-primary dark:text-foreground tracking-tight"
          >
            UCH dalam Angka
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 font-medium">
            Dampak nyata yang kami bangun bersama komunitas
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {stats.map((stat, index) => (
            <StatCard key={stat.id} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
