import type React from "react";

interface HeroHighlightsProps {
  highlightsRef?: React.Ref<HTMLDivElement>;
}

export function HeroHighlights({ highlightsRef }: HeroHighlightsProps) {
  return (
    <div
      ref={highlightsRef}
      className="pt-6 border-t border-border/50 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-center lg:text-left"
    >
      <div>
        <div className="text-xl sm:text-2xl font-bold text-primary">100+</div>
        <div className="text-xs text-muted-foreground font-medium">
          Ide & Inovasi
        </div>
      </div>
      <div>
        <div className="text-xl sm:text-2xl font-bold text-primary">4 Lab</div>
        <div className="text-xs text-muted-foreground font-medium">
          Ruang Kreatif
        </div>
      </div>
      <div>
        <div className="flex items-center justify-center lg:justify-start gap-1.5 text-xl sm:text-2xl font-bold text-primary">
          <span className="h-2.5 w-2.5 rounded-full bg-secondary inline-block shrink-0 shadow-xs" />
          <span>Active</span>
        </div>
        <div className="text-xs text-muted-foreground font-medium">
          Komunitas UTY
        </div>
      </div>
    </div>
  );
}
