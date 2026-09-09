import type React from "react";

interface HeroHighlightsProps {
  highlightsRef?: React.Ref<HTMLDivElement>;
}

export function HeroHighlights({ highlightsRef }: HeroHighlightsProps) {
  return (
    <div
      ref={highlightsRef}
      className="pt-4 sm:pt-6 border-t border-border/50 grid grid-cols-3 gap-2 xs:gap-3 sm:gap-4 md:gap-6 max-w-lg mx-auto lg:mx-0 text-center lg:text-left"
    >
      <div>
        <div className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-primary tracking-tight">
          100+
        </div>
        <div className="text-[10px] xs:text-xs sm:text-sm text-muted-foreground font-medium">
          Ide & Inovasi
        </div>
      </div>
      <div>
        <div className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-primary tracking-tight">
          4 Lab
        </div>
        <div className="text-[10px] xs:text-xs sm:text-sm text-muted-foreground font-medium">
          Ruang Kreatif
        </div>
      </div>
      <div>
        <div className="flex items-center justify-center lg:justify-start gap-1 sm:gap-1.5 text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-primary tracking-tight">
          <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-secondary inline-block shrink-0 shadow-xs" />
          <span>Active</span>
        </div>
        <div className="text-[10px] xs:text-xs sm:text-sm text-muted-foreground font-medium">
          Komunitas UTY
        </div>
      </div>
    </div>
  );
}
