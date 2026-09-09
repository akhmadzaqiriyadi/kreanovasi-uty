import { ArrowRight, Compass, Lightbulb, Users } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { buttonVariants } from "@/components/ui/button";
import { type AboutFocusArea, aboutConfig } from "@/config/about";
import { cn } from "@/lib/utils";

interface AboutStoryProps {
  storyRef?: React.Ref<HTMLElement>;
}

const focusIcons: Record<
  AboutFocusArea["iconName"],
  React.ComponentType<{
    className?: string;
    "aria-hidden"?: boolean | "true" | "false";
  }>
> = {
  lightbulb: Lightbulb,
  compass: Compass,
  users: Users,
};

export function AboutStory({ storyRef }: AboutStoryProps) {
  const { narrative, actions, focusAreas } = aboutConfig;

  return (
    <article
      ref={storyRef}
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
    >
      {/* Left Column: Official Welcome & Narrative */}
      <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left">
        <div className="space-y-3 sm:space-y-4 text-foreground/85 dark:text-foreground/85">
          <p className="text-sm xs:text-base sm:text-lg font-medium leading-relaxed sm:leading-relaxed">
            Selamat datang di{" "}
            <strong className="text-primary dark:text-blue-200 font-bold">
              UTY Creative Hub
            </strong>
            , pusat kreativitas dan inovasi resmi Universitas Teknologi
            Yogyakarta! Kami adalah wadah yang dirancang khusus untuk mahasiswa
            dan komunitas UTY dalam mengembangkan ide-ide brilian di bidang{" "}
            <span className="text-primary dark:text-blue-100 font-semibold">
              kreativitas
            </span>
            , <span className="text-secondary font-semibold">inovasi</span>, dan{" "}
            <span className="text-primary dark:text-blue-100 font-semibold">
              teknologi
            </span>
            .
          </p>

          <p className="text-sm xs:text-base sm:text-lg font-medium leading-relaxed sm:leading-relaxed text-muted-foreground">
            {narrative.description}
          </p>
        </div>

        {/* CTA Actions */}
        <nav
          aria-label="Aksi Tentang Kami"
          className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2"
        >
          {actions.map((action) => {
            const isPrimary = action.variant === "primary";
            return (
              <Link
                key={action.href}
                href={action.href}
                className={cn(
                  buttonVariants({
                    variant: isPrimary ? "default" : "outline",
                    size: "default",
                  }),
                  isPrimary
                    ? "h-11 px-5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-2"
                    : "h-11 px-5 border-2 border-primary/30 text-primary hover:bg-accent font-semibold rounded-xl transition-colors",
                )}
              >
                <span>{action.label}</span>
                {isPrimary && (
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Right Column: Key Focus Card Matrix */}
      <aside
        aria-label="Fokus Utama UTY Creative Hub"
        className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5"
      >
        {focusAreas.map((focus, index) => {
          const Icon = focusIcons[focus.iconName];
          const isSecondary = focus.colorScheme === "secondary";
          const isFullWidthOnSm = index === focusAreas.length - 1;

          return (
            <div
              key={focus.id}
              className={cn(
                "p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-border/80 shadow-xs space-y-2 transition-colors",
                isSecondary
                  ? "hover:border-secondary/60"
                  : "hover:border-primary/40",
                isFullWidthOnSm ? "sm:col-span-2 lg:col-span-1" : "",
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "h-9 w-9 rounded-xl flex items-center justify-center shrink-0",
                    isSecondary
                      ? "bg-secondary/15 text-secondary-foreground"
                      : "bg-primary/10 text-primary",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5",
                      isSecondary ? "text-secondary" : "",
                    )}
                    aria-hidden="true"
                  />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-primary">
                  {focus.title}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {focus.description}
              </p>
            </div>
          );
        })}
      </aside>
    </article>
  );
}
