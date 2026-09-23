import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import type { EventItem } from "@/config/events";
import { cn } from "@/lib/utils";
import { EventCard } from "./event-card";

interface RelatedEventsProps {
  events: EventItem[];
}

export function RelatedEvents({ events }: RelatedEventsProps) {
  if (!events || events.length === 0) return null;

  return (
    <section
      aria-labelledby="related-events-heading"
      className="w-full py-12 sm:py-16 bg-muted/30 border-t border-border/60"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Rekomendasi Terkait
            </span>
            <h2
              id="related-events-heading"
              className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground"
            >
              Agenda Lainnya di UTY Creative Hub
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Jelajahi berbagai program pelatihan, pameran inovasi, dan klinik
              penalaran berikutnya.
            </p>
          </div>

          <Link
            href="/events"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "rounded-xl gap-2 font-medium text-xs h-9 shrink-0 self-start sm:self-auto",
            )}
          >
            <span>Lihat Semua Agenda</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
}
