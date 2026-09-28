import { ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeroActionsProps {
  actionsRef?: React.Ref<HTMLElement>;
}

export function HeroActions({ actionsRef }: HeroActionsProps) {
  return (
    <nav
      ref={actionsRef}
      aria-label="Aksi Utama"
      className="flex flex-col gap-2.5 sm:gap-3 pt-1 sm:pt-2 max-w-md mx-auto lg:mx-0 w-full"
    >
      {/* Top Row: 2 side-by-side buttons */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full">
        <Link
          href="/booking#schedule-navigator"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "h-11 sm:h-12 text-xs sm:text-sm md:text-base border-2 border-primary/30 text-primary hover:bg-accent hover:border-secondary font-semibold rounded-xl transition-all active:scale-[0.97] touch-manipulation flex items-center justify-center text-center px-2 sm:px-4 truncate",
          )}
        >
          <span className="truncate">Cek Jadwal</span>
        </Link>

        <Link
          href="/booking/new"
          className={cn(
            buttonVariants({ size: "lg" }),
            "h-11 sm:h-12 text-xs sm:text-sm md:text-base bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold rounded-xl shadow-xs transition-all active:scale-[0.97] touch-manipulation flex items-center justify-center gap-1.5 sm:gap-2 text-center px-2 sm:px-4 truncate",
          )}
        >
          <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
          <span className="truncate">Book Now</span>
        </Link>
      </div>

      {/* Bottom Row: Prominent Jelajahi Program & Event Button */}
      <Link
        href="/events"
        className={cn(
          buttonVariants({ size: "lg" }),
          "h-11 sm:h-12 px-4 sm:px-7 text-xs sm:text-sm md:text-base bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-md transition-all active:scale-[0.98] touch-manipulation flex items-center justify-center gap-2 group w-full",
        )}
      >
        <span>Jelajahi Program & Event</span>
        <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </nav>
  );
}
