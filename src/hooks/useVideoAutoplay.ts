"use client";

import { useEffect, useRef } from "react";

/**
 * Custom hook to manage reliable video autoplay across desktop, iOS Safari,
 * and low-power/battery-saver modes with gesture fallbacks.
 */
export function useVideoAutoplay() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Explicitly configure DOM properties before attempting playback (critical for WebKit)
    video.defaultMuted = true;
    video.muted = true;

    const playVideo = () => {
      if (video.paused) {
        video.play().catch(() => {});
      }
    };

    // Attempt playback immediately upon mount
    playVideo();

    // Fallback: resume on first user interaction if held by OS/battery saver
    const startPlaybackOnGesture = () => {
      playVideo();
    };

    window.addEventListener("touchstart", startPlaybackOnGesture, {
      once: true,
      passive: true,
    });
    window.addEventListener("pointerdown", startPlaybackOnGesture, {
      once: true,
      passive: true,
    });
    window.addEventListener("scroll", startPlaybackOnGesture, {
      once: true,
      passive: true,
    });

    return () => {
      window.removeEventListener("touchstart", startPlaybackOnGesture);
      window.removeEventListener("pointerdown", startPlaybackOnGesture);
      window.removeEventListener("scroll", startPlaybackOnGesture);
    };
  }, []);

  return videoRef;
}
