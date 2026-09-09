"use client";

import {
  ExternalLink,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Volume1,
  Volume2,
  VolumeX,
} from "lucide-react";
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
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.2); // Default 20% volume
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const hideControlsTimer = useRef<NodeJS.Timeout | null>(null);

  // Initialize playback with default 20% volume
  useEffect(() => {
    const video = internalVideoRef.current;
    if (!video) return;

    video.volume = 0.2;
    setVolume(0.2);

    const tryPlayWithSound = async () => {
      try {
        video.muted = false;
        video.volume = 0.2;
        await video.play();
        setIsPlaying(true);
        setIsMuted(false);
        setHasLoaded(true);
      } catch {
        // Fallback to muted autoplay if browser blocks sound autoplay
        video.muted = true;
        setIsMuted(true);
        video
          .play()
          .then(() => {
            setIsPlaying(true);
            setHasLoaded(true);
          })
          .catch(() => {
            setIsPlaying(false);
          });
      }
    };

    tryPlayWithSound();

    // IntersectionObserver to auto-play when in viewport and pause when scrolled away
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
      { threshold: 0.3 },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Update time and duration
  const handleTimeUpdate = () => {
    const video = internalVideoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime);
  };

  const handleLoadedMetadata = () => {
    const video = internalVideoRef.current;
    if (!video) return;
    setDuration(video.duration);
    setHasLoaded(true);
  };

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

  // Handle Volume Change with Slider
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number.parseFloat(e.target.value);
    const video = internalVideoRef.current;
    if (!video) return;

    setVolume(newVolume);
    video.volume = newVolume;

    if (newVolume === 0) {
      video.muted = true;
      setIsMuted(true);
    } else {
      video.muted = false;
      setIsMuted(false);
    }
  };

  // Toggle Mute button
  const toggleMute = () => {
    const video = internalVideoRef.current;
    if (!video) return;

    if (isMuted || volume === 0) {
      const restoreVol = volume > 0 ? volume : 0.2;
      video.muted = false;
      video.volume = restoreVol;
      setVolume(restoreVol);
      setIsMuted(false);
    } else {
      video.muted = true;
      setIsMuted(true);
    }
  };

  // Handle Seek / Scrubber
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = Number.parseFloat(e.target.value);
    const video = internalVideoRef.current;
    if (!video) return;

    video.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container
        .requestFullscreen?.()
        .then(() => setIsFullscreen(true))
        .catch(() => {});
    } else {
      document
        .exitFullscreen?.()
        .then(() => setIsFullscreen(false))
        .catch(() => {});
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (hideControlsTimer.current) {
      clearTimeout(hideControlsTimer.current);
    }
    hideControlsTimer.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  const formatTime = (timeInSeconds: number) => {
    if (Number.isNaN(timeInSeconds)) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <figure
      ref={videoRef}
      aria-label="Video Dokumentasi UTY Creative Hub"
      className="w-full max-w-4xl mx-auto m-0 space-y-3"
    >
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setShowControls(false)}
        className="relative w-full aspect-video rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-primary/20 dark:border-primary/40 bg-zinc-950 shadow-2xl group select-none"
      >
        {/* Native HTML5 Video */}
        <video
          ref={internalVideoRef}
          src="/videos/uch-profile.mp4"
          autoPlay
          loop
          playsInline
          preload="auto"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onClick={togglePlay}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-700 cursor-pointer",
            hasLoaded ? "opacity-100" : "opacity-0",
          )}
        >
          Browser Anda tidak mendukung tag video.
        </video>

        {/* Floating Unmute Notice if Autoplayed Muted */}
        {isMuted && isPlaying && (
          <button
            type="button"
            onClick={toggleMute}
            className="absolute top-4 left-4 z-20 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-bold shadow-lg hover:scale-105 transition-transform cursor-pointer animate-pulse"
          >
            <VolumeX className="h-4 w-4" />
            <span>Nyalakan Suara (20%)</span>
          </button>
        )}

        {/* Video Control Bar Overlay */}
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3 sm:p-5 transition-opacity duration-300 flex flex-col gap-2 sm:gap-3",
            showControls || !isPlaying
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none",
          )}
        >
          {/* Progress Bar / Scrubber */}
          <div className="relative w-full flex items-center group/progress cursor-pointer">
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              aria-label="Progress Video"
              className="w-full h-1.5 bg-white/30 rounded-lg appearance-none cursor-pointer accent-secondary hover:h-2 transition-all"
            />
          </div>

          {/* Controls Bottom Row */}
          <div className="flex items-center justify-between gap-2 text-white">
            {/* Left: Play/Pause, Volume Slider & Time */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Play/Pause Button */}
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? "Jeda" : "Putar"}
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4 fill-current" />
                ) : (
                  <Play className="h-4 w-4 fill-current ml-0.5" />
                )}
              </button>

              {/* Volume Adjuster with Slider */}
              <div className="flex items-center gap-1.5 group/volume">
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={isMuted ? "Aktifkan suara" : "Matikan suara"}
                  className="h-8 w-8 rounded-full hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="h-4 w-4 text-red-400" />
                  ) : volume < 0.5 ? (
                    <Volume1 className="h-4 w-4 text-secondary" />
                  ) : (
                    <Volume2 className="h-4 w-4 text-secondary" />
                  )}
                </button>

                {/* Interactive Volume Slider */}
                <div className="flex items-center gap-1.5 w-16 sm:w-24">
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    aria-label="Pengaturan Volume"
                    className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-secondary"
                  />
                  <span className="text-[10px] font-mono text-slate-300 w-6 text-right select-none">
                    {isMuted ? "0%" : `${Math.round(volume * 100)}%`}
                  </span>
                </div>
              </div>

              {/* Time Display */}
              <div className="text-[11px] sm:text-xs font-mono text-slate-300 pl-1 select-none">
                <span>{formatTime(currentTime)}</span>
                <span className="text-slate-500 mx-1">/</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Right: Fullscreen Toggle */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleFullscreen}
                aria-label={isFullscreen ? "Keluar layar penuh" : "Layar penuh"}
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground font-medium px-1">
        <figcaption>
          Video Dokumentasi & Profil Kegiatan UTY Creative Hub
        </figcaption>
        <a
          href="https://drive.google.com/file/d/16Ku7491nu4LqQccb5rvv6qx2VVESJpq0/view"
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
