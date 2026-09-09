import type React from "react";

interface AboutVideoProps {
  videoRef?: React.Ref<HTMLElement>;
}

export function AboutVideo({ videoRef }: AboutVideoProps) {
  return (
    <figure
      ref={videoRef}
      aria-label="Video Profil Resmi UTY Creative Hub"
      className="w-full max-w-4xl mx-auto m-0 space-y-3"
    >
      <div className="relative w-full aspect-video rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-primary/20 dark:border-primary/40 bg-black shadow-xl">
        <iframe
          src="https://drive.google.com/file/d/16Ku7491nu4LqQccb5rvv6qx2VVESJpq0/preview"
          title="Video Profil UTY Creative Hub"
          className="absolute inset-0 w-full h-full border-0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
      <figcaption className="text-center text-xs sm:text-sm text-muted-foreground font-medium">
        Video Dokumentasi & Profil Kegiatan Inovasi UTY Creative Hub
      </figcaption>
    </figure>
  );
}
