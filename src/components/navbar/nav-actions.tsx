import { Calendar } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavActionsProps {
  ref?: React.Ref<HTMLDivElement>;
}

export function NavActions({ ref }: NavActionsProps) {
  return (
    <div ref={ref} className="hidden md:flex items-center gap-2 lg:gap-2.5">
      <ThemeToggle className="h-9 w-9 rounded-full" />

      {/* Cek Jadwal Button */}
      <Link
        href="/schedule"
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "border-primary/40 text-primary hover:bg-primary/10 font-semibold rounded-full whitespace-nowrap transition-all duration-300 h-9 px-4 text-xs sm:text-sm",
        )}
      >
        Cek Jadwal
      </Link>

      {/* Book Now Button */}
      <Link
        href="/booking"
        className={cn(
          buttonVariants({ size: "sm" }),
          "bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-xs rounded-full whitespace-nowrap transition-all duration-300 flex items-center gap-1.5 h-9 px-4 text-xs sm:text-sm",
        )}
      >
        <Calendar className="h-4 w-4" />
        <span>Book Now</span>
      </Link>
    </div>
  );
}
