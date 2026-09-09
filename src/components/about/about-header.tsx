import type React from "react";

interface AboutHeaderProps {
  headerRef?: React.Ref<HTMLElement>;
}

export function AboutHeader({ headerRef }: AboutHeaderProps) {
  return (
    <header
      ref={headerRef}
      className="text-center max-w-2xl mx-auto flex flex-col items-center space-y-2 sm:space-y-2.5"
    >
      {/* Title & Compact Solid Gold Underline */}
      <div className="flex flex-col items-center">
        <h2
          id="about-heading"
          className="text-xl xs:text-2xl sm:text-3xl font-bold tracking-tight text-primary dark:text-foreground leading-tight"
        >
          About Us
        </h2>
        {/* Compact Solid Gold Underline */}
        <div
          className="w-10 sm:w-14 h-1 bg-secondary rounded-full mt-1.5 sm:mt-2 shadow-xs"
          aria-hidden="true"
        />
      </div>

      {/* Subtitle */}
      <p className="text-xs sm:text-sm text-muted-foreground font-medium max-w-lg mx-auto leading-relaxed">
        Pusat Pengembangan Kreativitas, Inovasi, dan Ekosistem Kolaborasi Resmi
        Universitas Teknologi Yogyakarta
      </p>
    </header>
  );
}
