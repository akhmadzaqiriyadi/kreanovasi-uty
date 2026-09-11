"use client";

import {
  Loader2,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Volume1,
  Volume2,
  VolumeX,
} from "lucide-react";
import type React from "react";
import { aboutConfig } from "@/config/about";
import { useVideoPlayer } from "@/hooks/use-video-player";
import { cn } from "@/lib/utils";

interface AboutVideoProps {
  videoRef?: React.Ref<HTMLElement>;
}

function formatVideoTime(timeInSeconds: number): string {
  if (Number.isNaN(timeInSeconds)) return "0:00";
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

export function AboutVideo({ videoRef }: AboutVideoProps) {
  const { src, caption, defaultVolume } = aboutConfig.video;

  const {
    videoRef: internalVideoRef,
    containerRef,
    isPlaying,
    isMuted,
    volume,
    currentTime,
    duration,
    isFullscreen,
    showControls,
    isBuffering,
    togglePlay,
    toggleMute,
    handleVolumeChange,
    seek,
    toggleFullscreen,
    handleMouseMove,
    setShowControls,
    onTimeUpdate,
    onLoadedMetadata,
    onLoadedData,
    onWaiting,
    onPlaying,
    onCanPlay,
    onPause,
  } = useVideoPlayer({ initialVolume: defaultVolume, autoPlay: true });

  return (
    <figure
      ref={videoRef}
      aria-label={caption}
      className="w-full max-w-4xl mx-auto m-0 space-y-3"
    >
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setShowControls(false)}
        className="relative w-full aspect-video rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-primary/20 dark:border-primary/40 bg-zinc-950 shadow-2xl group select-none"
      >
        {/* Native HTML5 Video with Mobile-Compliant Muted Autoplay */}
        <video
          ref={internalVideoRef}
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={onLoadedMetadata}
          onLoadedData={onLoadedData}
          onWaiting={onWaiting}
          onPlaying={onPlaying}
          onCanPlay={onCanPlay}
          onPause={onPause}
          onClick={togglePlay}
          className="w-full h-full object-cover cursor-pointer"
        >
          Browser Anda tidak mendukung tag video.
        </video>

        {/* Buffering Indicator */}
        {isBuffering && (
          <div
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none z-20"
          >
            <Loader2 className="h-10 w-10 text-secondary animate-spin" />
          </div>
        )}

        {/* Large Play Button Overlay if Paused */}
        {!isPlaying && !isBuffering && (
          <button
            type="button"
            onClick={togglePlay}
            aria-label="Putar video"
            className="absolute inset-0 m-auto h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-primary/90 text-primary-foreground hover:bg-primary flex items-center justify-center shadow-2xl z-20 hover:scale-110 active:scale-95 transition-all cursor-pointer"
          >
            <Play className="h-8 w-8 sm:h-10 sm:w-10 ml-1 fill-current" />
          </button>
        )}

        {/* Clean Floating Unmute Button */}
        {isMuted && isPlaying && (
          <button
            type="button"
            onClick={toggleMute}
            aria-label="Aktifkan suara video"
            className="absolute top-4 left-4 z-20 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-xs font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          >
            <VolumeX className="h-4 w-4" />
            <span>Aktifkan Suara</span>
          </button>
        )}

        {/* Video Control Bar Overlay */}
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3 sm:p-5 transition-opacity duration-300 flex flex-col gap-2 sm:gap-3 z-30",
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
              onChange={(e) => seek(Number.parseFloat(e.target.value))}
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
                  aria-label={isMuted ? "Aktifkan suara" : "Bisukan suara"}
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
                <div className="flex items-center w-16 sm:w-20">
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={isMuted ? 0 : volume}
                    onChange={(e) =>
                      handleVolumeChange(Number.parseFloat(e.target.value))
                    }
                    aria-label="Volume suara"
                    className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-secondary"
                  />
                </div>
              </div>

              {/* Time Display */}
              <div className="text-[11px] sm:text-xs font-mono text-slate-300 pl-1 select-none">
                <span>{formatVideoTime(currentTime)}</span>
                <span className="text-slate-500 mx-1">/</span>
                <span>{formatVideoTime(duration)}</span>
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

      {caption && (
        <figcaption className="text-xs text-muted-foreground font-medium px-1 text-center sm:text-left">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
