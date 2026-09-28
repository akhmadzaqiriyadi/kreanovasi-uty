"use client";

import {
  ArrowRight,
  CheckCircle,
  Clock,
  Filter,
  MapPin,
  Sparkles,
  Users,
  Wrench,
} from "lucide-react";
import Image from "next/image";
import type React from "react";
import { useState } from "react";
import { useRooms } from "@/context/rooms-context";
import { getSafeImageUrl } from "@/lib/image-utils";
import { cn } from "@/lib/utils";

interface BookingRoomCardsProps {
  onSelectRoom: (roomId: string) => void;
  sectionRef?: React.Ref<HTMLElement>;
}

export function BookingRoomCards({
  onSelectRoom,
  sectionRef,
}: BookingRoomCardsProps) {
  const { rooms, availableRooms } = useRooms();
  const [filterMode, setFilterMode] = useState<"available" | "all">(
    "available",
  );

  const displayedRooms = filterMode === "available" ? availableRooms : rooms;

  return (
    <section
      id="rooms-catalog"
      ref={sectionRef}
      aria-labelledby="rooms-heading"
      className="w-full py-12 sm:py-16 scroll-mt-24 sm:scroll-mt-28 bg-background"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl space-y-8 sm:space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2
            id="rooms-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary dark:text-foreground tracking-tight"
          >
            Katalog Fasilitas Ruangan
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
            Setiap ruangan dirancang khusus untuk mendukung produktivitas,
            riset, dan kreativitas seluruh mahasiswa serta civitas UTY.
          </p>

          {/* Availability Filter Tabs */}
          <div className="inline-flex max-w-full flex-wrap sm:flex-nowrap justify-center p-1 sm:p-1.5 rounded-2xl bg-slate-100 dark:bg-zinc-800/80 border border-border/60 shadow-xs gap-1">
            <button
              type="button"
              onClick={() => setFilterMode("available")}
              className={cn(
                "flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer",
                filterMode === "available"
                  ? "bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <CheckCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Hanya Tersedia ({availableRooms.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setFilterMode("all")}
              className={cn(
                "flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer",
                filterMode === "all"
                  ? "bg-white dark:bg-zinc-900 text-primary dark:text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Filter className="w-3.5 h-3.5 shrink-0" />
              <span>Semua Ruangan ({rooms.length})</span>
            </button>
          </div>
        </div>

        {/* Empty State */}
        {displayedRooms.length === 0 ? (
          <div className="p-8 sm:p-12 text-center rounded-3xl bg-slate-50 dark:bg-zinc-900/50 border border-border/70 max-w-lg mx-auto space-y-3">
            <Sparkles className="w-8 h-8 text-amber-500 mx-auto" />
            <h3 className="text-base font-bold text-foreground">
              Tidak Ada Ruangan Tersedia Langsung
            </h3>
            <p className="text-xs text-muted-foreground">
              Semua ruangan saat ini sedang digunakan atau dalam pemeliharaan.
              Anda dapat beralih ke tab &ldquo;Semua Ruangan&rdquo; untuk
              melihat fasilitas atau memilih tanggal lain.
            </p>
            <button
              type="button"
              onClick={() => setFilterMode("all")}
              className="mt-2 text-xs font-bold text-primary underline underline-offset-4 cursor-pointer"
            >
              Lihat Seluruh Ruangan ({rooms.length})
            </button>
          </div>
        ) : (
          /* Room Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {displayedRooms.map((room, index) => {
              const isAvailable = room.status.state === "available";
              const isMaintenance = room.status.state === "maintenance";
              const isThirdOfThree = index === 2 && displayedRooms.length === 3;

              return (
                <div
                  key={room.id}
                  className={cn(
                    "group relative rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 border border-border/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between",
                    isAvailable
                      ? "hover:-translate-y-1.5 cursor-pointer"
                      : "opacity-90",
                    isThirdOfThree &&
                      "md:max-lg:col-span-2 md:max-lg:max-w-md md:max-lg:mx-auto md:max-lg:w-full",
                  )}
                >
                  <div>
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4 z-20">
                      {isAvailable ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/95 text-white shadow-md backdrop-blur-xs">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Tersedia
                        </span>
                      ) : isMaintenance ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-zinc-700/95 text-white shadow-md backdrop-blur-xs">
                          <Wrench className="w-3.5 h-3.5" />
                          {room.status.label}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/95 text-white shadow-md backdrop-blur-xs">
                          <Clock className="w-3.5 h-3.5" />
                          {room.status.label}
                        </span>
                      )}
                    </div>

                    {/* Room Image Container */}
                    <div className="relative h-60 w-full overflow-hidden bg-slate-200 dark:bg-zinc-800">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
                      <Image
                        src={getSafeImageUrl(room.coverImage)}
                        alt={room.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className={cn(
                          "object-cover transition-transform duration-700",
                          isAvailable
                            ? "group-hover:scale-110"
                            : "grayscale-[0.3]",
                        )}
                      />

                      {/* Room Name Overlay */}
                      <div className="absolute bottom-4 left-4 right-4 z-20">
                        <span className="text-xs font-semibold text-secondary uppercase tracking-wider block mb-1">
                          {room.type}
                        </span>
                        <h3 className="text-xl font-bold text-white leading-snug drop-shadow-xs">
                          {room.name}
                        </h3>
                      </div>
                    </div>

                    {/* Body Content */}
                    <div className="p-5 sm:p-6 space-y-5">
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3">
                        {room.description}
                      </p>

                      {/* Specs / Details */}
                      <div className="space-y-3 pt-2 border-t border-border/60">
                        {/* Capacity */}
                        <div className="flex items-center text-xs sm:text-sm text-foreground/80">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center mr-3 shrink-0">
                            <Users className="w-4 h-4 text-primary dark:text-blue-300" />
                          </div>
                          <div>
                            <span className="font-semibold block">
                              Kapasitas
                            </span>
                            <span className="text-muted-foreground">
                              {room.capacity}
                            </span>
                          </div>
                        </div>

                        {/* Location */}
                        <div className="flex items-center text-xs sm:text-sm text-foreground/80">
                          <div className="w-8 h-8 rounded-lg bg-secondary/15 flex items-center justify-center mr-3 shrink-0">
                            <MapPin className="w-4 h-4 text-amber-600 dark:text-secondary" />
                          </div>
                          <div>
                            <span className="font-semibold block">Lokasi</span>
                            <span className="text-muted-foreground">
                              {room.location}
                            </span>
                          </div>
                        </div>

                        {/* Facilities Badges */}
                        <div className="pt-2">
                          <span className="text-xs font-semibold text-foreground/70 block mb-2">
                            Fasilitas:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {room.facilities.map((fac, idx) => (
                              <span
                                key={idx}
                                className="inline-block px-2.5 py-1 text-[11px] font-medium rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-border/50"
                              >
                                {fac}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Action Button */}
                  <div className="p-5 sm:p-6 pt-0">
                    <button
                      type="button"
                      onClick={() => onSelectRoom(room.id)}
                      className={cn(
                        "w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold shadow-md hover:shadow-lg active:scale-[0.98] transition-all cursor-pointer",
                        isAvailable
                          ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                          : "bg-slate-200 dark:bg-zinc-800 hover:bg-slate-300 dark:hover:bg-zinc-700 text-foreground",
                      )}
                    >
                      <span>
                        {isAvailable
                          ? "Pesan Ruangan Ini"
                          : "Jadwalkan Ruangan"}
                      </span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
