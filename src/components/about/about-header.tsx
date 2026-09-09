import type React from "react";

interface AboutHeaderProps {
  headerRef?: React.Ref<HTMLElement>;
}

export function AboutHeader({ headerRef }: AboutHeaderProps) {
  return (
    <header
      ref={headerRef}
      className="text-center max-w-2xl mx-auto flex flex-col items-center space-y-3"
    >
      {/* Title & Signature Solid Gold Underline (Balanced Medium Size) */}
      <div className="flex flex-col items-center">
        <h2
          id="about-heading"
          className="text-2xl xs:text-3xl sm:text-4xl font-extrabold tracking-tight text-primary dark:text-foreground leading-tight"
        >
          About Us
        </h2>
        {/* Balanced Solid Gold Underline */}
        <div
          className="w-14 sm:w-20 h-1.5 bg-secondary rounded-full mt-2 sm:mt-2.5 shadow-xs"
          aria-hidden="true"
        />
      </div>

      {/* Subtitle */}
      <p className="text-xs xs:text-sm sm:text-base text-muted-foreground font-medium max-w-lg mx-auto leading-relaxed">
        Pusat Pengembangan Kreativitas, Inovasi, dan Ekosistem Kolaborasi Resmi
        Universitas Teknologi Yogyakarta
      </p>
    </header>
  );
}
