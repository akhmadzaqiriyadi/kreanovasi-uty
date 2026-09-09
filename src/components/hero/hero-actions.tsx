import { ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeroActionsProps {
  actionsRef?: React.Ref<HTMLDivElement>;
}

export function HeroActions({ actionsRef }: HeroActionsProps) {
  return (
    <div
      ref={actionsRef}
      className="flex flex-col gap-3 pt-2 max-w-md mx-auto lg:mx-0"
    >
      {/* Top Row: 2 side-by-side buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/schedule"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "h-12 border-2 border-primary/30 text-primary hover:bg-accent hover:border-secondary font-semibold rounded-xl transition-colors flex items-center justify-center text-center",
          )}
        >
          <span>Cek Jadwal</span>
        </Link>

        <Link
          href="/booking"
          className={cn(
            buttonVariants({ size: "lg" }),
            "h-12 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 text-center",
          )}
        >
          <Calendar className="h-4 w-4" />
          <span>Book Now</span>
        </Link>
      </div>

      {/* Bottom Row: Prominent Jelajahi Program Button */}
      <Link
        href="/programs"
        className={cn(
          buttonVariants({ size: "lg" }),
          "h-12 px-7 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 group w-full",
        )}
      >
        <span>Jelajahi Program</span>
        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}
