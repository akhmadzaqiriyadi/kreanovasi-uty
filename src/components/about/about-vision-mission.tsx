"use client";

import { Globe, Shield, Target, Zap } from "lucide-react";
import type React from "react";
import { type AboutMission, aboutConfig } from "@/config/about";
import { cn } from "@/lib/utils";

interface AboutVisionMissionProps {
  sectionRef?: React.Ref<HTMLElement>;
}

const missionIcons: Record<
  AboutMission["iconName"],
  React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>
> = {
  target: Target,
  zap: Zap,
  globe: Globe,
  shield: Shield,
};

const missionAccents = [
  "bg-primary/8 border-primary/20 dark:bg-primary/15 dark:border-primary/30",
  "bg-secondary/10 border-secondary/25 dark:bg-secondary/15 dark:border-secondary/30",
  "bg-primary/8 border-primary/20 dark:bg-primary/15 dark:border-primary/30",
  "bg-secondary/10 border-secondary/25 dark:bg-secondary/15 dark:border-secondary/30",
];

const missionIconAccents = [
  "bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-300",
  "bg-secondary/15 text-amber-600 dark:bg-secondary/20 dark:text-secondary",
  "bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-300",
  "bg-secondary/15 text-amber-600 dark:bg-secondary/20 dark:text-secondary",
];

export function AboutVisionMission({ sectionRef }: AboutVisionMissionProps) {
  const { vision, missions } = aboutConfig;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="vision-mission-heading"
      className="w-full py-12 sm:py-16 lg:py-20 bg-background"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl space-y-10 sm:space-y-14">
        {/* Vision */}
        <div className="relative">
          <div className="max-w-4xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden">
              {/* Gold accent top bar */}
              <div className="h-1 bg-gradient-to-r from-secondary via-secondary/70 to-transparent" />

              <div className="p-7 sm:p-10 lg:p-12 bg-gradient-to-br from-primary/5 via-background to-secondary/5 dark:from-primary/10 dark:via-zinc-900/80 dark:to-secondary/10 border border-border/60 rounded-b-3xl space-y-4">
                {/* Section label */}
                <div className="flex items-center gap-2.5">
                  <div className="h-0.5 w-8 bg-secondary rounded-full" />
                  <span className="text-xs font-bold text-secondary tracking-widest uppercase">
                    Visi
                  </span>
                </div>

                <h2
                  id="vision-mission-heading"
                  className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-primary dark:text-foreground leading-snug tracking-tight max-w-3xl"
                >
                  "{vision.statement}"
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Grid */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2.5">
              <div className="h-0.5 w-8 bg-secondary rounded-full" />
              <span className="text-xs font-bold text-secondary tracking-widest uppercase">
                Misi
              </span>
              <div className="h-0.5 w-8 bg-secondary rounded-full" />
            </div>
            <p className="text-sm text-muted-foreground font-medium max-w-xl mx-auto">
              Langkah-langkah konkret menuju visi UTY Creative Hub
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {missions.map((mission, index) => {
              const Icon = missionIcons[mission.iconName];
              return (
                <article
                  key={mission.id}
                  className={cn(
                    "p-5 sm:p-6 rounded-2xl border transition-all duration-300 hover:shadow-md active:scale-[0.99] touch-manipulation",
                    missionAccents[index % missionAccents.length],
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
                        missionIconAccents[index % missionIconAccents.length],
                      )}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div className="space-y-1.5 min-w-0">
                      <h3 className="text-sm sm:text-base font-bold text-foreground leading-snug">
                        {mission.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {mission.description}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
