"use client";

import { useEffect, useRef, useState } from "react";

export function GlobalLoadingBar() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const activeRequestsRef = useRef(0);
  const intervalIdRef = useRef<Timer | null>(null);

  useEffect(() => {
    const handleStart = () => {
      activeRequestsRef.current += 1;

      if (activeRequestsRef.current === 1) {
        setVisible(true);
        setProgress(10);

        // Clear any previous interval just in case
        if (intervalIdRef.current) {
          clearInterval(intervalIdRef.current);
        }

        // Gradually increment progress simulating network load
        intervalIdRef.current = setInterval(() => {
          setProgress((prev) => {
            if (prev < 50) return prev + Math.floor(Math.random() * 8) + 4;
            if (prev < 80) return prev + Math.floor(Math.random() * 4) + 1;
            if (prev < 95) return prev + 1;
            return prev;
          });
        }, 200);
      }
    };

    const handleEnd = () => {
      activeRequestsRef.current = Math.max(0, activeRequestsRef.current - 1);

      if (activeRequestsRef.current === 0) {
        if (intervalIdRef.current) {
          clearInterval(intervalIdRef.current);
          intervalIdRef.current = null;
        }

        setProgress(100);

        // Wait for slide animation to complete before fading out
        setTimeout(() => {
          if (activeRequestsRef.current === 0) {
            setVisible(false);
            // Reset progress after fade out transition completes
            setTimeout(() => {
              setProgress(0);
            }, 300);
          }
        }, 300);
      }
    };

    window.addEventListener("api-request-start", handleStart);
    window.addEventListener("api-request-end", handleEnd);

    return () => {
      window.removeEventListener("api-request-start", handleStart);
      window.removeEventListener("api-request-end", handleEnd);
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[9999] pointer-events-none transition-opacity duration-300 ease-in-out ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className="h-[3px] bg-gradient-to-r from-primary via-purple-500 to-pink-500 shadow-[0_1px_10px_oklch(0.585_0.233_277.117_/_0.5)] transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
