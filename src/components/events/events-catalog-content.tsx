"use client";

import { CalendarOff, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { EventItem } from "@/config/events";
import { EventCard } from "./event-card";
import { EventsFilterBar } from "./events-filter-bar";

interface EventsCatalogContentProps {
  events: EventItem[];
  categories: string[];
}

export function EventsCatalogContent({
  events,
  categories,
}: EventsCatalogContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  const filteredEvents = events.filter((event) => {
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
    <div className="space-y-10 sm:space-y-12">
      {/* Search & Filter Controls */}
      <EventsFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        categories={categories}
        totalResults={events.length}
      />

      {/* Grid of Events */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border/80 bg-muted/20 p-8 sm:p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <CalendarOff className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-foreground">
              Tidak Ada Agenda yang Sesuai
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Coba sesuaikan kata kunci pencarian atau ubah filter format dan
              kategori agenda.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setSelectedType("all");
            }}
            className="rounded-lg text-xs"
          >
            Tampilkan Semua Agenda
          </Button>
        </div>
      )}

      {/* Collaboration / Call for Proposal Section matching Booking CTA style */}
      <section
        aria-labelledby="collab-proposal-heading"
        className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-[oklch(0.28_0.075_270)] text-primary-foreground p-8 sm:p-12 lg:p-14 text-center shadow-xl space-y-6"
      >
        <div
          className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-secondary/20 blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-primary-foreground/10 blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="max-w-2xl mx-auto space-y-4 relative z-10">
          <span className="text-xs font-bold uppercase tracking-wider text-secondary">
            Kolaborasi & Inisiasi Agenda
          </span>
          <h2
            id="collab-proposal-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight"
          >
            Ingin Mengadakan Workshop atau Kolaborasi di UTY Creative Hub?
          </h2>
          <p className="text-sm sm:text-base text-primary-foreground/80 leading-relaxed font-medium">
            Himpunan mahasiswa, unit kegiatan riset, dan mitra industri dapat
            mengajukan pemanfaatan ruang lab prototyping, think-tank space,
            serta fasilitas publikasi bersama tim pengelola UCH.
          </p>
        </div>

        <div className="pt-2 relative z-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="mailto:creativehub@uty.ac.id"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold text-sm shadow-md transition-all active:scale-[0.98]"
          >
            <Mail className="w-4 h-4" />
            <span>Kirim Proposal Acara</span>
          </Link>
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-primary-foreground font-semibold text-sm backdrop-blur-xs border border-white/20 transition-all active:scale-[0.98]"
          >
            <Phone className="w-4 h-4" />
            <span>Reservasi Ruangan Lab</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
