import { ArrowRight, Calendar, Clock, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { EventItem } from "@/config/events";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: EventItem;
  className?: string;
}

export function EventCard({ event, className }: EventCardProps) {
  const isSecondary = event.category.variant === "secondary";
  const isClosingSoon = event.quota?.status === "closing-soon";

  return (
    <article
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl bg-white dark:bg-zinc-900/90 border border-border/80 shadow-xs hover:shadow-xl dark:shadow-none hover:border-primary/40 dark:hover:border-primary/60 transition-all duration-300 active:scale-[0.99] touch-manipulation",
        className,
      )}
    >
      <div className="space-y-4">
        {/* Cover Image & Date Badge Container */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
          <Image
            src={event.coverImage}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 will-change-transform group-hover:scale-105"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

          {/* Floating Category Tag */}
          <div className="absolute top-3.5 left-3.5 z-10">
            <span
              className={cn(
                "inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shadow-md backdrop-blur-md transition-colors",
                isSecondary
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-primary text-primary-foreground",
              )}
            >
              {event.category.name}
            </span>
          </div>

          {/* Prominent Calendar Date Badge (Top Right) */}
          <div className="absolute top-3.5 right-3.5 z-10 flex flex-col items-center justify-center h-13 w-13 rounded-xl bg-white/95 dark:bg-zinc-900/95 text-primary dark:text-blue-200 shadow-lg backdrop-blur-md border border-white/40 dark:border-zinc-700/60">
            <span className="text-base font-extrabold leading-none tracking-tight">
              {event.date.day}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-0.5">
              {event.date.month}
            </span>
          </div>

          {/* Status Badge on bottom-left of image */}
          <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between z-10">
            {event.quota && (
              <span
                className={cn(
                  "px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide shadow-md backdrop-blur-md",
                  isClosingSoon
                    ? "bg-amber-500 text-white"
                    : "bg-emerald-600 text-white",
                )}
              >
                {event.quota.statusLabel}
              </span>
            )}
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/90 drop-shadow-md">
              {event.location.type} Event
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 pt-0 space-y-3">
          <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary dark:group-hover:text-blue-300 transition-colors line-clamp-2 tracking-tight leading-snug">
            <Link
              href={`/events/${event.slug}`}
              className="focus-visible:outline-hidden focus-visible:underline"
            >
              <span className="absolute inset-0 z-0" aria-hidden="true" />
              {event.title}
            </Link>
          </h3>

          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3 leading-relaxed">
            {event.description}
          </p>

          {/* Event Meta: Date, Time & Location */}
          <div className="space-y-1.5 pt-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar
                className="h-3.5 w-3.5 text-primary dark:text-blue-300 shrink-0"
                aria-hidden="true"
              />
              <span className="truncate">{event.date.fullText}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock
                className="h-3.5 w-3.5 text-primary dark:text-blue-300 shrink-0"
                aria-hidden="true"
              />
              <span className="truncate">{event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin
                className="h-3.5 w-3.5 text-primary dark:text-blue-300 shrink-0"
                aria-hidden="true"
              />
              <span className="truncate">{event.location.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer: Action */}
      <div className="px-5 sm:px-6 py-4 border-t border-border/60 flex items-center justify-between gap-3 z-10 mt-2">
        <span className="text-xs font-semibold text-muted-foreground">
          {event.quota
            ? `${event.quota.filled}/${event.quota.total} Peserta`
            : "Terbuka untuk Umum"}
        </span>

        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-primary/10 dark:bg-primary/25 text-primary dark:text-blue-200 group-hover:bg-primary group-hover:text-primary-foreground dark:group-hover:bg-primary dark:group-hover:text-primary-foreground transition-all duration-300 shrink-0 shadow-xs">
          <span>Detail Agenda</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </article>
  );
}
