"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseVideoPlayerOptions {
  initialVolume?: number;
  autoPlay?: boolean;
}

export function useVideoPlayer(options: UseVideoPlayerOptions = {}) {
  const { initialVolume = 0.2, autoPlay = true } = options;

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(initialVolume);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);

  const hideControlsTimer = useRef<NodeJS.Timeout | null>(null);

  // Initialize playback with standard mobile-safe muted autoplay
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = initialVolume;
    video.muted = true;
    setIsMuted(true);

    if (autoPlay) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setHasLoaded(true);
            setIsBuffering(false);
          })
          .catch(() => {
            // Autoplay blocked by device policy (e.g. low power mode)
            setIsPlaying(false);
            setIsBuffering(false);
          });
      }
    }

    // Scroll viewport intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (video.paused) {
              video
                .play()
                .then(() => setIsPlaying(true))
                .catch(() => {});
            }
          } else {
            if (!video.paused) {
              video.pause();
              setIsPlaying(false);
            }
          }
        }
      },
      { threshold: 0.2 },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
      if (hideControlsTimer.current) {
        clearTimeout(hideControlsTimer.current);
      }
    };
  }, [initialVolume, autoPlay]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
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
  }, []);

  const handleVolumeChange = useCallback((newVolume: number) => {
    const video = videoRef.current;
    if (!video) return;

    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
    video.volume = clampedVolume;

    if (clampedVolume === 0) {
      video.muted = true;
      setIsMuted(true);
    } else {
      video.muted = false;
      setIsMuted(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted || volume === 0) {
      const restoreVol = volume > 0 ? volume : initialVolume;
      video.muted = false;
      video.volume = restoreVol;
      setVolume(restoreVol);
      setIsMuted(false);
    } else {
      video.muted = true;
      setIsMuted(true);
    }
  }, [isMuted, volume, initialVolume]);

  const seek = useCallback((time: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = time;
    setCurrentTime(time);
  }, []);

  const toggleFullscreen = useCallback(() => {
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
  }, []);

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    if (hideControlsTimer.current) {
      clearTimeout(hideControlsTimer.current);
    }
    hideControlsTimer.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  }, [isPlaying]);

  return {
    videoRef,
    containerRef,
    isPlaying,
    isMuted,
    volume,
    currentTime,
    duration,
    isFullscreen,
    showControls,
    hasLoaded,
    isBuffering,
    togglePlay,
    toggleMute,
    handleVolumeChange,
    seek,
    toggleFullscreen,
    handleMouseMove,
    setShowControls,
    onTimeUpdate: () => {
      if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
    },
    onLoadedMetadata: () => {
      if (videoRef.current) {
        setDuration(videoRef.current.duration);
        setHasLoaded(true);
        setIsBuffering(false);
      }
    },
    onLoadedData: () => {
      setHasLoaded(true);
      setIsBuffering(false);
    },
    onCanPlay: () => {
      setHasLoaded(true);
      setIsBuffering(false);
    },
    onWaiting: () => {
      setIsBuffering(true);
    },
    onPlaying: () => {
      setIsPlaying(true);
      setHasLoaded(true);
      setIsBuffering(false);
    },
    onPause: () => {
      setIsPlaying(false);
    },
  };
}
