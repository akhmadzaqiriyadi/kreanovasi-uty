import type React from "react";

interface HeroContentProps {
  titleRef?: React.Ref<HTMLDivElement>;
  descRef?: React.Ref<HTMLParagraphElement>;
}

export function HeroContent({ titleRef, descRef }: HeroContentProps) {
  return (
    <>
      {/* Display Title */}
      <div ref={titleRef} className="space-y-1">
        <div className="text-5xl sm:text-7xl font-black tracking-tight text-primary leading-none">
          UCH
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
          <span className="text-primary dark:text-blue-100">UTY</span>{" "}
          <span className="text-secondary">Creative Hub</span>
        </h1>
      </div>

      {/* Description */}
      <p
        ref={descRef}
        className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed"
      >
        Pusat kreativitas dan inovasi resmi Universitas Teknologi Yogyakarta.
        Wadah bagi mahasiswa dan komunitas untuk mengembangkan ide-ide brilian
        di bidang kreativitas, inovasi, dan teknologi.
      </p>
    </>
  );
}
