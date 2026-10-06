"use client";

import {
  Calendar,
  CalendarOff,
  CheckCircle2,
  History,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { type EventItem, mapBackendEventToEventItem } from "@/config/events";
import { useEventsQuery } from "@/hooks/use-event-queries";
import { cn } from "@/lib/utils";
import { EventCard } from "./event-card";
import { EventsFilterBar } from "./events-filter-bar";

interface EventsCatalogContentProps {
  events?: EventItem[];
  categories?: string[];
}

export function EventsCatalogContent({
  events: initialEvents = [],
  categories: initialCategories = [],
}: EventsCatalogContentProps) {
  const [timelineTab, setTimelineTab] = useState<"upcoming" | "past" | "all">(
    "upcoming",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  // Fetch live events from backend
  const { data: apiData, isLoading } = useEventsQuery({
    upcoming: timelineTab === "upcoming" ? true : undefined,
    past: timelineTab === "past" ? true : undefined,
    limit: 50,
  });

  // Use live data if query has settled, else fall back to initialEvents on initial render
  const liveEvents: EventItem[] = apiData?.events
    ? apiData.events.map(mapBackendEventToEventItem)
    : initialEvents;

  // Extract dynamic categories from active event list
  const activeCategories = Array.from(
    new Set([...initialCategories, ...liveEvents.map((e) => e.category.name)]),
  );

  const filteredEvents = liveEvents.filter((event) => {
    // Search match
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      event.title.toLowerCase().includes(q) ||
      event.description.toLowerCase().includes(q) ||
      event.location.name.toLowerCase().includes(q) ||
      event.speakers?.some((s) => s.name.toLowerCase().includes(q));

    // Category match
    const matchesCategory =
      selectedCategory === "all" || event.category.name === selectedCategory;

    // Type match
    const matchesType =
      selectedType === "all" || event.location.type === selectedType;

    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Timeline Tabs: Akan Datang vs Telah Berlalu */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-muted/50 border border-border/50 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setTimelineTab("upcoming")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200",
              timelineTab === "upcoming"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Sparkles className="h-4 w-4" />
            <span>Akan Datang</span>
          </button>

          <button
            type="button"
            onClick={() => setTimelineTab("past")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200",
              timelineTab === "past"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <History className="h-4 w-4" />
            <span>Telah Berlalu</span>
          </button>

          <button
            type="button"
            onClick={() => setTimelineTab("all")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200",
              timelineTab === "all"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Calendar className="h-4 w-4" />
            <span>Semua Agenda</span>
          </button>
        </div>

        <div className="text-xs text-muted-foreground self-end sm:self-auto font-medium">
          Menampilkan{" "}
          <span className="font-bold text-foreground">
            {filteredEvents.length}
          </span>{" "}
          agenda
        </div>
      </div>

      {/* Search & Filter Controls */}
      <EventsFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        categories={activeCategories}
        totalResults={filteredEvents.length}
      />

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="flex items-center justify-center py-12 gap-3 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-sm font-medium">Memuat agenda terkini...</span>
        </div>
      )}

      {/* Grid of Events */}
      {!isLoading && filteredEvents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredEvents.length === 0 && (
        <div className="rounded-3xl border border-dashed border-border/80 bg-muted/20 p-8 sm:p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground">
            <CalendarOff className="h-7 w-7" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base sm:text-lg font-bold text-foreground">
              Tidak Ada Agenda
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {timelineTab === "upcoming"
                ? "Saat ini belum ada agenda mendatang yang sesuai filter. Pantau terus kanal resmi UTY Creative Hub!"
                : "Tidak ada agenda yang cocok dengan kriteria pencarian atau kategori yang dipilih."}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setSelectedType("all");
              setTimelineTab("all");
            }}
            className="rounded-xl text-xs font-semibold"
          >
            Reset Semua Filter
          </Button>
        </div>
      )}

      {/* Collaboration / Call for Proposal Section */}
      <section
        aria-labelledby="collab-proposal-heading"
        className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/80 text-primary-foreground p-8 sm:p-12 lg:p-14 text-center shadow-xl space-y-6 mt-12"
      >
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_60%)] pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-white backdrop-blur-md">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Kemitraan & Kolaborasi Acara</span>
          </div>

          <h2
            id="collab-proposal-heading"
            className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight"
          >
            Punya Ide Acara atau Ingin Menggelar Workshop di UCH?
          </h2>

          <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-xl mx-auto">
            UTY Creative Hub terbuka bagi komunitas mahasiswa, dosen, serta
            mitra industri teknologi yang ingin berkolaborasi menyelenggarakan
            agenda inovatif.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button
            asChild
            size="lg"
            className="rounded-xl bg-white text-primary hover:bg-white/90 font-bold shadow-md text-xs sm:text-sm h-11 px-6"
          >
            <a href="mailto:creativehub@uty.ac.id">Ajukan Proposal Acara</a>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-xl border-white/40 text-white hover:bg-white/10 font-semibold text-xs sm:text-sm h-11 px-6"
          >
            <a
              href="https://wa.me/6281234567890?text=Halo%20Admin%20UTY%20Creative%20Hub,%20saya%20ingin%20berdiskusi%20mengenai%20kolaborasi%20event"
              target="_blank"
              rel="noopener noreferrer"
            >
              Hubungi Pengelola Hub
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}
