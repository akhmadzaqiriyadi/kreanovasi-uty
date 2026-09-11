import type React from "react";
import { eventsConfig } from "@/config/events";
import { EventCard } from "./event-card";

interface EventsGridProps {
  gridRef?: React.Ref<HTMLDivElement>;
}

export function EventsGrid({ gridRef }: EventsGridProps) {
  const { events } = eventsConfig;

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8"
    >
      {events.map((event, index) => {
        const isThirdOnTablet = index === 2;
        return (
          <EventCard
            key={event.id}
            event={event}
            className={
              isThirdOnTablet
                ? "md:col-span-2 md:w-[calc(50%-0.75rem)] lg:w-full md:mx-auto lg:col-span-1"
                : ""
            }
          />
        );
      })}
    </div>
  );
}
