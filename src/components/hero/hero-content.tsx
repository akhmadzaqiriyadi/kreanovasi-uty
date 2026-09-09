import type React from "react";

interface HeroTitleProps {
  titleRef?: React.Ref<HTMLDivElement>;
}

export function HeroTitle({ titleRef }: HeroTitleProps) {
  return (
    <div ref={titleRef} className="space-y-0.5 sm:space-y-1">
      <div className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-primary leading-none">
        UCH
      </div>
      <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.18] sm:leading-[1.15]">
        <span className="text-primary dark:text-blue-100">UTY</span>{" "}
        <span className="text-secondary">Creative Hub</span>
      </h1>
    </div>
  );
}

interface HeroDescriptionProps {
  descRef?: React.Ref<HTMLParagraphElement>;
}

export function HeroDescription({ descRef }: HeroDescriptionProps) {
  return (
    <p
      ref={descRef}
      className="text-xs xs:text-sm sm:text-base md:text-lg font-medium text-foreground/80 dark:text-foreground/80 max-w-2xl mx-auto lg:mx-0 leading-relaxed sm:leading-relaxed"
    >
      Pusat kreativitas dan inovasi resmi Universitas Teknologi Yogyakarta.
      Wadah bagi mahasiswa dan komunitas untuk mengembangkan ide-ide brilian di
      bidang kreativitas, inovasi, dan teknologi.
    </p>
  );
}

interface HeroContentProps {
  titleRef?: React.Ref<HTMLDivElement>;
  descRef?: React.Ref<HTMLParagraphElement>;
}

export function HeroContent({ titleRef, descRef }: HeroContentProps) {
  return (
    <>
      <HeroTitle titleRef={titleRef} />
      <HeroDescription descRef={descRef} />
    </>
  );
}
