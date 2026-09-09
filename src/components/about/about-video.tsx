"use client";

import { Maximize2, Pause, Play, Volume2, VolumeX } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface AboutVideoProps {
  videoRef?: React.Ref<HTMLElement>;
}

export function AboutVideo({ videoRef }: AboutVideoProps) {
  const internalVideoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const video = internalVideoRef.current;
    if (!video) return;

    // Ensure muted is set explicitly on the DOM element for mobile autoplay compliance
    video.muted = true;
    video.playsInline = true;

    const startAutoplay = () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setHasLoaded(true);
          })
          .catch(() => {
            setIsPlaying(false);
          });
      }
    };

    startAutoplay();

    // IntersectionObserver to ensure playback starts smoothly when in viewport
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            video
              .play()
              .then(() => setIsPlaying(true))
              .catch(() => {});
          } else {
            video.pause();
            setIsPlaying(false);
          }
        }
      },
      { threshold: 0.25 },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const togglePlay = () => {
    const video = internalVideoRef.current;
    if (!video) return;

    if (video.paused) {
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = internalVideoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const toggleFullscreen = () => {
    const video = internalVideoRef.current;
    if (!video) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else if (video.requestFullscreen) {
      video.requestFullscreen();
    }
  };

  return (
    <figure
      ref={videoRef}
      aria-label="Video Profil Resmi UTY Creative Hub"
      className="w-full max-w-4xl mx-auto m-0 space-y-3"
    >
      <div
        ref={containerRef}
        className="relative w-full aspect-video rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-primary/20 dark:border-primary/40 bg-black shadow-2xl group select-none cursor-pointer"
        onClick={togglePlay}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            togglePlay();
          }
        }}
        tabIndex={0}
        role="button"
        aria-label={isPlaying ? "Jeda video" : "Putar video"}
      >
        {/* Native HTML5 Video with Guaranteed Autoplay */}
        <video
          ref={internalVideoRef}
          src="/videos/uch-profile.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onLoadedData={() => setHasLoaded(true)}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-700 pointer-events-none",
            hasLoaded ? "opacity-100" : "opacity-0",
          )}
        >
          Browser Anda tidak mendukung tag video.
        </video>

        {/* Video Overlay Control Bar */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-end justify-between p-4 sm:p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-2 pointer-events-auto">
            {/* Play/Pause Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              aria-label={isPlaying ? "Jeda video" : "Putar video"}
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-white/90 dark:bg-zinc-900/90 hover:bg-white text-primary flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer backdrop-blur-sm"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4 fill-current" />
              ) : (
                <Play className="h-4 w-4 fill-current ml-0.5" />
              )}
            </button>

            {/* Mute/Unmute Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleMute();
              }}
              aria-label={isMuted ? "Aktifkan suara" : "Matikan suara"}
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-white/90 dark:bg-zinc-900/90 hover:bg-white text-primary flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer backdrop-blur-sm"
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            {/* Fullscreen Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleFullscreen();
              }}
              aria-label="Layar penuh"
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-white/90 dark:bg-zinc-900/90 hover:bg-white text-primary flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer backdrop-blur-sm"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <figcaption className="text-center text-xs sm:text-sm text-muted-foreground font-medium">
        Video Dokumentasi & Profil Kegiatan Inovasi UTY Creative Hub
      </figcaption>
    </figure>
  );
}
