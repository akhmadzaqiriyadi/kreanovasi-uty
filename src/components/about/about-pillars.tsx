import { Cpu, Palette, Rocket } from "lucide-react";
import type React from "react";
import { type AboutPillar, aboutConfig } from "@/config/about";
import { cn } from "@/lib/utils";

interface AboutPillarsProps {
  pillarsRef?: React.Ref<HTMLElement>;
}

const pillarIcons: Record<
  AboutPillar["iconName"],
  React.ComponentType<{
    className?: string;
    "aria-hidden"?: boolean | "true" | "false";
  }>
> = {
  palette: Palette,
  rocket: Rocket,
  cpu: Cpu,
};

export function AboutPillars({ pillarsRef }: AboutPillarsProps) {
  const { title, subtitle, pillars } = aboutConfig.pillarsSection;

  return (
    <section
      ref={pillarsRef}
      aria-label="Pilar Utama UTY Creative Hub"
      className="space-y-6 sm:space-y-8 pt-4 sm:pt-6"
    >
      <div className="text-center space-y-1.5 max-w-xl mx-auto">
        <h3 className="text-xl sm:text-2xl font-bold text-primary tracking-tight">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {pillars.map((pillar) => {
          const IconComponent = pillarIcons[pillar.iconName];
          return (
            <article
              key={pillar.id}
              className={cn(
                "p-5 sm:p-6 rounded-2xl bg-white dark:bg-zinc-900 border shadow-xs transition-all duration-300 hover:shadow-md flex flex-col justify-between space-y-4",
                pillar.accentColor,
              )}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className={cn(
                      "h-11 w-11 rounded-xl flex items-center justify-center",
                      pillar.badgeColor,
                    )}
                  >
                    <IconComponent className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <span className="text-[11px] font-semibold text-muted-foreground/80 tracking-wide uppercase">
                    {pillar.subtitle}
                  </span>
                </div>

                <h4 className="text-lg font-bold text-foreground tracking-tight">
                  {pillar.title}
                </h4>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
