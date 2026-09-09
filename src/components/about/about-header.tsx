import type React from "react";

interface AboutHeaderProps {
  headerRef?: React.Ref<HTMLElement>;
}

export function AboutHeader({ headerRef }: AboutHeaderProps) {
  return (
    <header ref={headerRef} className="text-center space-y-3 max-w-3xl mx-auto">
      {/* Badge Tagline */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-wide shadow-xs select-none">
        <span
          className="h-2 w-2 rounded-full bg-secondary inline-block shrink-0"
          aria-hidden="true"
        />
        <span>Tentang Kami</span>
      </div>

      {/* Main Title */}
      <h2
        id="about-heading"
        className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight"
      >
        <span className="text-primary dark:text-blue-100">UTY</span>{" "}
        <span className="text-secondary">Creative Hub</span>
      </h2>

      {/* Subtitle */}
      <p className="text-xs xs:text-sm sm:text-base text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
        Pusat Pengembangan Kreativitas, Hilirisasi Inovasi, dan Ekosistem
        Kolaborasi Resmi Universitas Teknologi Yogyakarta
      </p>
    </header>
  );
}
