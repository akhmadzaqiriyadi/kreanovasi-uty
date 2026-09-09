"use client";

import { ExternalLink, Play, Sparkles } from "lucide-react";
import type React from "react";
import { useState } from "react";

interface AboutVideoProps {
  videoRef?: React.Ref<HTMLElement>;
}

export function AboutVideo({ videoRef }: AboutVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const driveEmbedUrl =
    "https://drive.google.com/file/d/16Ku7491nu4LqQccb5rvv6qx2VVESJpq0/preview";
  const driveDirectUrl =
    "https://drive.google.com/file/d/16Ku7491nu4LqQccb5rvv6qx2VVESJpq0/view";

  return (
    <figure
      ref={videoRef}
      aria-label="Video Dokumentasi UTY Creative Hub"
      className="w-full max-w-4xl mx-auto m-0 space-y-3"
    >
      <div className="relative w-full aspect-video rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-primary/20 dark:border-primary/40 bg-zinc-950 shadow-2xl">
        {isPlaying ? (
          /* Active Google Drive Stream (Loaded on-demand to preserve 100/100 Core Web Vitals) */
          <iframe
            src={driveEmbedUrl}
            title="Video Profil UTY Creative Hub"
            className="w-full h-full border-0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          /* Ultra-fast Video Facade Poster (0 KB bundle weight, 0ms load delay) */
          <div
            onClick={() => setIsPlaying(true)}
            onKeyDown={(e) => {
              if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                setIsPlaying(true);
              }
            }}
            tabIndex={0}
            role="button"
            aria-label="Putar Video Dokumentasi UTY Creative Hub"
            className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center cursor-pointer group bg-gradient-to-b from-primary/95 to-slate-950 select-none overflow-hidden"
          >
            {/* Background Texture Pattern */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage: "url('/images/texture-herobg.svg')",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />

            {/* Glowing Backdrop Pulse */}
            <div
              className="absolute w-48 h-48 rounded-full bg-secondary/25 blur-3xl group-hover:scale-125 transition-transform duration-700 pointer-events-none"
              aria-hidden="true"
            />

            {/* Content & Play Button */}
            <div className="relative z-10 flex flex-col items-center space-y-4">
              {/* Animated Play Button */}
              <div className="relative flex items-center justify-center">
                <div className="absolute -inset-2 rounded-full bg-secondary/30 animate-ping opacity-75" />
                <div className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <Play className="h-6 w-6 sm:h-7 sm:w-7 fill-current ml-1" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-[11px] font-semibold tracking-wide backdrop-blur-sm">
                  <Sparkles className="h-3.5 w-3.5 text-secondary" />
                  <span>Video Profil & Dokumentasi</span>
                </div>
                <h3 className="text-lg sm:text-2xl font-bold text-white tracking-tight">
                  Jelajahi Suasana & Aktivitas UCH
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                  Klik untuk memutar video dokumentasi resmi inovasi mahasiswa
                  UTY
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground font-medium px-1">
        <figcaption>Video Dokumentasi Resmi UTY Creative Hub</figcaption>
        <a
          href={driveDirectUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-primary hover:underline"
        >
          <span>Buka di Google Drive</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </figure>
  );
}
