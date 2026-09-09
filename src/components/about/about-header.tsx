import type React from "react";

interface AboutHeaderProps {
  headerRef?: React.Ref<HTMLElement>;
}

export function AboutHeader({ headerRef }: AboutHeaderProps) {
  return (
    <header
      ref={headerRef}
      className="text-center max-w-3xl mx-auto flex flex-col items-center space-y-4"
    >
      {/* Title & Signature Solid Gold Underline (Image 2 Style) */}
      <div className="flex flex-col items-center">
        <h2
          id="about-heading"
          className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-primary dark:text-foreground leading-none"
        >
          About Us
        </h2>
        {/* Solid Gold Horizontal Accent Underline */}
        <div
          className="w-20 sm:w-28 h-1.5 sm:h-2 bg-secondary rounded-full mt-3 sm:mt-4 shadow-xs"
          aria-hidden="true"
        />
      </div>

      {/* Subtitle */}
      <p className="text-xs xs:text-sm sm:text-base text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed pt-1">
        Pusat Pengembangan Kreativitas, Hilirisasi Inovasi, dan Ekosistem
        Kolaborasi Resmi Universitas Teknologi Yogyakarta
      </p>
    </header>
  );
}
