import type React from "react";

interface HeroHighlightsProps {
  highlightsRef?: React.Ref<HTMLDListElement>;
}

export function HeroHighlights({ highlightsRef }: HeroHighlightsProps) {
  return (
    <dl
      ref={highlightsRef}
      aria-label="Statistik dan Pencapaian UTY Creative Hub"
      className="pt-4 sm:pt-6 border-t border-border/50 grid grid-cols-3 gap-2 xs:gap-3 sm:gap-4 md:gap-6 max-w-lg mx-auto lg:mx-0 text-center lg:text-left"
    >
      <div className="flex flex-col">
        <dd className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-primary tracking-tight order-1">
          100+
        </dd>
        <dt className="text-[10px] xs:text-xs sm:text-sm text-muted-foreground font-medium order-2">
          Ide & Inovasi
        </dt>
      </div>
      <div className="flex flex-col">
        <dd className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-primary tracking-tight order-1">
          4 Lab
        </dd>
        <dt className="text-[10px] xs:text-xs sm:text-sm text-muted-foreground font-medium order-2">
          Ruang Kreatif
        </dt>
      </div>
      <div className="flex flex-col">
        <dd className="flex items-center justify-center lg:justify-start gap-1 sm:gap-1.5 text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-primary tracking-tight order-1">
          <span
            className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-secondary inline-block shrink-0 shadow-xs"
            aria-hidden="true"
          />
          <span>Active</span>
        </dd>
        <dt className="text-[10px] xs:text-xs sm:text-sm text-muted-foreground font-medium order-2">
          Komunitas UTY
        </dt>
      </div>
    </dl>
  );
}
