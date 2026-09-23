import { Calendar, ChevronRight, Clock, Home, MapPin } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { EventItem } from "@/config/events";
import { cn } from "@/lib/utils";

interface EventDetailHeaderProps {
  event: EventItem;
}

export function EventDetailHeader({ event }: EventDetailHeaderProps) {
  const isSecondary = event.category.variant === "secondary";
  const isClosingSoon = event.quota?.status === "closing-soon";
  const isFull = event.quota?.status === "full";

  return (
    <header
      aria-label={`Header agenda ${event.title}`}
      className="relative w-full pt-24 pb-12 sm:pt-28 sm:pb-16 md:pt-32 md:pb-18 overflow-hidden"
    >
      {/* Background layers matching booking & hub brand theme */}
      <div
        className="absolute inset-0 pointer-events-none select-none"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-[oklch(0.28_0.075_270)] dark:from-[oklch(0.13_0.03_266)] dark:via-[oklch(0.16_0.045_266)] dark:to-[oklch(0.10_0.02_270)]" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "url('/images/texture-herobg.svg')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute top-0 left-1/4 w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-56 h-56 sm:w-80 sm:h-80 rounded-full bg-primary-foreground/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb navigasi"
          className="flex flex-wrap items-center gap-1.5 text-xs text-primary-foreground/60 font-medium mb-6"
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
          <Link
            href="/events"
            className="hover:text-primary-foreground/90 transition-colors"
          >
            Agenda & Events
          </Link>
          <ChevronRight
            className="h-3.5 w-3.5 text-primary-foreground/40"
            aria-hidden="true"
          />
          <span className="text-primary-foreground/90 font-semibold line-clamp-1 max-w-[200px] sm:max-w-md">
            {event.title}
          </span>
        </nav>

        {/* Badges & Meta strip */}
        <div className="space-y-4 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant={isSecondary ? "secondary" : "default"}
              className="px-3 py-1 text-xs font-semibold rounded-md shadow-xs"
            >
              {event.category.name}
            </Badge>

            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-white/10 text-primary-foreground backdrop-blur-xs border border-white/15 uppercase tracking-wide">
              {event.location.type} Event
            </span>

            {event.quota && (
              <span
                className={cn(
                  "inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold shadow-xs",
                  isFull
                    ? "bg-destructive/80 text-destructive-foreground"
                    : isClosingSoon
                      ? "bg-amber-500 text-white"
                      : "bg-emerald-600 text-white",
                )}
              >
                {event.quota.statusLabel}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-primary-foreground tracking-tight leading-tight">
            {event.title}
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-primary-foreground/80 leading-relaxed max-w-3xl font-normal">
            {event.description}
          </p>

          {/* Quick Schedule Strip */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 pt-3 text-xs sm:text-sm text-primary-foreground/85 border-t border-white/15">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-secondary shrink-0" />
              <span className="font-semibold text-primary-foreground">
                {event.date.fullText}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-secondary shrink-0" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-secondary shrink-0" />
              <span>{event.location.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Wave */}
      <div
        className="absolute bottom-0 left-0 right-0 h-6 sm:h-8"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1440 32"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full h-full fill-background"
        >
          <path d="M0,32 C480,0 960,0 1440,32 L1440,32 L0,32 Z" />
        </svg>
      </div>
    </header>
  );
}
