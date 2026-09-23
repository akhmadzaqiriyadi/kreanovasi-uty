import type { EventItem } from "@/config/events";
import { EventsCatalogContent } from "./events-catalog-content";
import { EventsCatalogHero } from "./events-catalog-hero";

interface EventsCatalogPageProps {
  events: EventItem[];
  categories: string[];
}

export function EventsCatalogPage({
  events,
  categories,
}: EventsCatalogPageProps) {
  return (
    <div className="flex-1 flex flex-col w-full">
      <EventsCatalogHero />
      <main className="w-full py-12 sm:py-16 bg-gradient-to-b from-background via-slate-50/50 to-background dark:via-zinc-950/40 relative overflow-hidden">
        {/* Ambient background decoration */}
        <div
          className="absolute inset-0 pointer-events-none select-none"
          aria-hidden="true"
        >
          <div className="absolute top-1/4 left-0 w-80 h-80 rounded-full bg-primary/5 dark:bg-primary/10 blur-3xl" />
          <div className="absolute bottom-10 right-0 w-72 h-72 rounded-full bg-secondary/10 dark:bg-secondary/15 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
          <EventsCatalogContent events={events} categories={categories} />
        </div>
      </main>
    </div>
  );
}
