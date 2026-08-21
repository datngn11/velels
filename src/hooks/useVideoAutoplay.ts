"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Lifecycle of the mobile hero video.
 *
 * - `deciding` — the preference and viewport gates have not both cleared. No
 *   element is mounted and not a byte of video is requested.
 * - `probing`  — the element is mounted and one gesture-less `play()` is in
 *   flight. That attempt *is* the Low Power Mode test: iOS exposes no API for
 *   the setting, but WebKit refuses unprompted playback while it is on.
 * - `playing`  — the browser fired a real `playing` event, so the frames are
 *   genuinely advancing and the video is safe to reveal.
 * - `static`   — motion is unavailable or unwanted. The poster is the whole
 *   treatment and the video element is torn down, so WebKit has nothing left
 *   to paint a native play button on.
 */
type HeroVideoState = "deciding" | "probing" | "playing" | "static";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * How long to wait for the first frame before giving up on the video. A request
 * that stalls after its headers settles neither `play()` nor `error`, so without
 * a deadline a hidden element would keep pulling the whole 7.9 MB down for the
 * rest of the visit. Generous enough not to punish a slow-but-working start;
 * short enough that a loop which would only begin seconds in loses to the
 * poster it is covering, which is the better hero anyway.
 */
const PROBE_TIMEOUT_MS = 5000;

/** Safari ships no NetworkInformation, so this only ever answers on Android. */
function prefersLessData(): boolean {
  const { connection } = navigator as Navigator & {
    connection?: { saveData?: boolean };
  };
  return connection?.saveData === true;
}

/**
 * Reasons never to fetch or start the video. Checked before every transition
 * rather than once on mount, so the outcome does not depend on the order the
 * gates below happen to settle in.
 */
function motionSuppressed(): boolean {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches || prefersLessData();
}

/**
 * Decides whether the mobile hero shows moving video or a static poster, and
 * reports which. Autoplay is attempted exactly once and never retried — see
 * the probe gate below for why.
 */
export function useVideoAutoplay() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<HeroVideoState>("deciding");

  // Gate 1 — preference. Never start motion the visitor asked not to see
  // (AGENTS.md rule 4 covers JavaScript, not just CSS), and never spend a
  // metered connection on decoration. This gate is one-way: switching the
  // preference back off does not resurrect the video, it takes a reload.
  useEffect(() => {
    const query = window.matchMedia(REDUCED_MOTION_QUERY);

    const suppress = () => {
      videoRef.current?.pause();
      setState("static");
    };

    if (motionSuppressed()) {
      suppress();
      return;
    }

    const handlePreferenceChange = (event: MediaQueryListEvent) => {
      if (event.matches) suppress();
    };

    query.addEventListener("change", handlePreferenceChange);
    return () => query.removeEventListener("change", handlePreferenceChange);
  }, []);

  // Gate 2 — viewport. Deferring the request until the hero is on screen lets
  // the poster take first paint instead of racing the video for bandwidth.
  useEffect(() => {
    if (state !== "deciding" || motionSuppressed()) return;

    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect();
        setState("probing");
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [state]);

  // Gate 3 — the probe. Ask for playback once, with no user gesture, and let
  // the platform answer. A refusal is final: a gesture is the one thing iOS
  // *will* accept in Low Power Mode, so retrying on touch or scroll is what
  // made the video ambush people mid-scroll.
  useEffect(() => {
    if (state !== "probing" && state !== "playing") return;

    const video = videoRef.current;
    if (!video) return;

    let active = true;
    let probeTimer: number | undefined;

    const reveal = () => {
      if (active) setState("playing");
    };

    // Anything that is not "frames are advancing" resolves to the poster: a
    // decode error, a stalled request, or a pause we did not ask for. That last
    // one covers Low Power Mode engaging after `play()` already resolved, and
    // iOS pausing inline video on backgrounding or an incoming call — a hero
    // frozen mid-loop reads as broken, where the poster reads as deliberate.
    const fallBackToPoster = () => {
      if (active) setState("static");
    };

    video.addEventListener("playing", reveal);
    video.addEventListener("pause", fallBackToPoster);
    video.addEventListener("error", fallBackToPoster);

    if (state === "probing") {
      // WebKit honours these as element properties, not only as attributes.
      video.defaultMuted = true;
      video.muted = true;
      video.play().catch(fallBackToPoster);
      probeTimer = window.setTimeout(fallBackToPoster, PROBE_TIMEOUT_MS);
    }

    return () => {
      active = false;
      window.clearTimeout(probeTimer);
      video.removeEventListener("playing", reveal);
      video.removeEventListener("pause", fallBackToPoster);
      video.removeEventListener("error", fallBackToPoster);
    };
  }, [state]);

  return {
    containerRef,
    videoRef,
    shouldRenderVideo: state === "probing" || state === "playing",
    isPlaying: state === "playing",
  };
}
