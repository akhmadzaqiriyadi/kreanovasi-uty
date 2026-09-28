"use client";

import { CheckCircle2, Sparkles } from "lucide-react";
import type React from "react";
import { useRooms } from "@/context/rooms-context";
import { RoomCard } from "./room-card";

interface RoomsGridProps {
  gridRef?: React.Ref<HTMLDivElement>;
  onlyAvailable?: boolean;
}

export function RoomsGrid({ gridRef, onlyAvailable = true }: RoomsGridProps) {
  const { rooms, availableRooms } = useRooms();

  // Filter available rooms if onlyAvailable is true, otherwise all
  const displayedRooms = onlyAvailable ? availableRooms : rooms;

  if (displayedRooms.length === 0) {
    return (
      <div
        ref={gridRef}
        className="w-full p-8 sm:p-12 rounded-3xl bg-slate-50/80 dark:bg-zinc-900/60 border border-border/70 text-center space-y-4"
      >
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="space-y-1 max-w-md mx-auto">
          <h3 className="text-base sm:text-lg font-bold text-foreground">
            Semua Ruangan Sedang Digunakan
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Saat ini tidak ada ruangan yang berstatus tersedia langsung. Anda
            dapat mengecek jadwal mendatang atau melakukan reservasi untuk hari
            lain.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {onlyAvailable && (
        <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
          <div className="inline-flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Menampilkan {displayedRooms.length} Ruangan Tersedia</span>
          </div>
          <span className="text-[11px] hidden sm:inline">
            Status diperbarui langsung oleh pengelola
          </span>
        </div>
      )}

      <div
        ref={gridRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8"
      >
        {displayedRooms.map((room, index) => {
          const isThirdOnTablet =
            index === 2 && displayedRooms.length % 2 !== 0;
          return (
            <RoomCard
              key={room.id}
              room={room}
              className={
                isThirdOnTablet
                  ? "md:col-span-2 md:w-[calc(50%-0.75rem)] lg:w-full md:mx-auto lg:col-span-1"
                  : ""
              }
            />
          );
        })}
      </div>
    </div>
  );
}
