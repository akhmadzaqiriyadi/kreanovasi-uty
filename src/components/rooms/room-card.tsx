import { ArrowRight, MapPin, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { RoomItem } from "@/config/rooms";
import { cn } from "@/lib/utils";

interface RoomCardProps {
  room: RoomItem;
  className?: string;
}

export function RoomCard({ room, className }: RoomCardProps) {
  const isAvailable = room.status.state === "available";
  const isInUse = room.status.state === "in-use";

  return (
    <article
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl bg-white dark:bg-zinc-900/90 border border-border/80 shadow-xs hover:shadow-xl dark:shadow-none hover:border-primary/40 dark:hover:border-primary/60 transition-all duration-300 active:scale-[0.99] touch-manipulation",
        className,
      )}
    >
      <div className="space-y-4">
        {/* Cover Image & Live Status Container */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
          <Image
            src={room.coverImage}
            alt={room.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 will-change-transform group-hover:scale-105"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/25 pointer-events-none" />

          {/* Floating Live Status Indicator (Top Left) */}
          <div className="absolute top-3.5 left-3.5 z-10">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-lg backdrop-blur-md",
                isAvailable
                  ? "bg-emerald-600 text-white"
                  : isInUse
                    ? "bg-rose-600 text-white"
                    : "bg-amber-500 text-white",
              )}
            >
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  isAvailable
                    ? "bg-white animate-pulse"
                    : isInUse
                      ? "bg-white"
                      : "bg-white animate-pulse",
                )}
                aria-hidden="true"
              />
              <span>{room.status.label}</span>
            </span>
          </div>

          {/* Location & Time Status Pill on bottom of image */}
          <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-[11px] font-semibold text-white/95 drop-shadow-sm">
            <div className="flex items-center gap-1.5">
              <MapPin
                className="h-3.5 w-3.5 text-secondary"
                aria-hidden="true"
              />
              <span>{room.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users
                className="h-3.5 w-3.5 text-secondary"
                aria-hidden="true"
              />
              <span>{room.capacity}</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 pt-0 space-y-2.5">
          {/* Room Type Pill */}
          <div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 dark:bg-primary/25 text-primary dark:text-blue-200 border border-primary/20 dark:border-primary/40">
              {room.type}
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary dark:group-hover:text-blue-300 transition-colors line-clamp-2 tracking-tight leading-snug">
            <Link
              href={`/booking?room=${room.id}`}
              className="focus-visible:outline-hidden focus-visible:underline"
            >
              <span className="absolute inset-0 z-0" aria-hidden="true" />
              {room.name}
            </Link>
          </h3>

          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3 leading-relaxed">
            {room.description}
          </p>

          {/* Mini Facilities Badges */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {room.facilities.map((facility) => (
              <span
                key={facility}
                className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-muted text-foreground/80 dark:bg-zinc-800/80 dark:text-zinc-300 border border-border/50"
              >
                {facility}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Footer: Realtime Status & Booking Action */}
      <div className="px-5 sm:px-6 py-4 border-t border-border/60 flex items-center justify-between gap-3 z-10 mt-2">
        <div className="min-w-0 truncate">
          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
            Jadwal Saat Ini
          </p>
          <p className="text-xs font-semibold text-foreground truncate mt-0.5">
            {room.status.timeSlotInfo}
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-primary/10 dark:bg-primary/25 text-primary dark:text-blue-200 group-hover:bg-primary group-hover:text-primary-foreground dark:group-hover:bg-primary dark:group-hover:text-primary-foreground transition-all duration-300 shrink-0 shadow-xs">
          <span>Booking</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </article>
  );
}
