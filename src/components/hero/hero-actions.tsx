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
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 w-full">
        <Link
          href="/schedule"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "h-11 sm:h-12 text-xs xs:text-sm sm:text-base border-2 border-primary/30 text-primary hover:bg-accent hover:border-secondary font-semibold rounded-xl transition-colors flex items-center justify-center text-center px-2 sm:px-4",
          )}
        >
          <span>Cek Jadwal</span>
        </Link>

        <Link
          href="/booking"
          className={cn(
            buttonVariants({ size: "lg" }),
            "h-11 sm:h-12 text-xs xs:text-sm sm:text-base bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 sm:gap-2 text-center px-2 sm:px-4",
          )}
        >
          <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
          <span>Book Now</span>
        </Link>
      </div>

      {/* Bottom Row: Prominent Jelajahi Program Button */}
      <Link
        href="/programs"
        className={cn(
          buttonVariants({ size: "lg" }),
          "h-11 sm:h-12 px-4 sm:px-7 text-xs xs:text-sm sm:text-base bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 group w-full",
        )}
      >
        <span>Jelajahi Program</span>
        <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </nav>
  );
}
