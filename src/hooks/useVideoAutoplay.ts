"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Lifecycle of the mobile hero video.
 *
 * - `deciding` — the gate below has not cleared. No element is mounted and not a
 *   byte of video is requested. Also where a suppressed visit simply stays: it
 *   renders identically to `static`, so there is nothing to transition to.
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
 * How long to wait for the first frame before giving up. A request that stalls
 * after its headers settles neither `play()` nor `error`, so without a deadline
 * a hidden element would keep pulling the whole file down for the rest of the
 * visit. Generous enough not to punish a slow-but-working start; short enough
 * that a loop which would only begin seconds in loses to the poster it covers.
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
 * Decides whether the mobile hero shows moving video or a static poster, and
 * reports which. Autoplay is attempted exactly once and never retried — see
 * the probe below for why.
 */
export function useVideoAutoplay() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<HeroVideoState>("deciding");
  const shouldRenderVideo = state === "probing" || state === "playing";

  // Does this visitor get motion at all, and is the hero on screen yet? Both
  // are settled in one place, in that order, so a suppressed visit cannot be
  // overtaken by an observer callback that was already queued.
  useEffect(() => {
    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);

    // Never start motion the visitor asked not to see — AGENTS.md rule 4 covers
    // JavaScript, not just CSS — and never spend a metered connection on
    // decoration. Bailing out leaves the hook in `deciding`, which renders
    // exactly what `static` would: the poster, alone. Nothing to tear down and
    // no state to set, so a suppressed visit costs no extra render at all.
    if (reducedMotion.matches || prefersLessData()) return;

    // Deferring the request until the hero is on screen lets the poster take
    // first paint instead of racing the video for bandwidth.
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect();
        setState("probing");
      }
    });

    // One-way: turning the preference back off does not resurrect the video.
    const handlePreferenceChange = (event: MediaQueryListEvent) => {
      if (!event.matches) return;
      observer.disconnect();
      videoRef.current?.pause();
      setState("static");
    };

    reducedMotion.addEventListener("change", handlePreferenceChange);
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      reducedMotion.removeEventListener("change", handlePreferenceChange);
      observer.disconnect();
    };
  }, []);

  // The probe. Ask for playback once, with no user gesture, and let the platform
  // answer. A refusal is final: a gesture is the one thing iOS *will* accept in
  // Low Power Mode, so retrying on touch or scroll is what made the video ambush
  // people mid-scroll. Keyed on the boolean rather than the state, so it runs
  // once per mounted element instead of again on the reveal.
  useEffect(() => {
    if (!shouldRenderVideo) return;

    const video = videoRef.current;
    if (!video) return;

    let active = true;

    // Anything that is not "frames are advancing" resolves to the poster: a
    // decode error, a stalled request, or a pause we did not ask for. That last
    // one covers Low Power Mode engaging after `play()` already resolved, and
    // iOS pausing inline video on backgrounding or an incoming call — a hero
    // frozen mid-loop reads as broken, where the poster reads as deliberate.
    const fallBackToPoster = () => {
      if (active) setState("static");
    };

    const probeTimer = window.setTimeout(fallBackToPoster, PROBE_TIMEOUT_MS);

    const reveal = () => {
      window.clearTimeout(probeTimer);
      if (active) setState("playing");
    };

    video.addEventListener("playing", reveal);
    video.addEventListener("pause", fallBackToPoster);
    video.addEventListener("error", fallBackToPoster);

    // WebKit honours these as element properties, not only as attributes.
    video.defaultMuted = true;
    video.muted = true;
    video.play().catch(fallBackToPoster);

    return () => {
      active = false;
      window.clearTimeout(probeTimer);
      video.removeEventListener("playing", reveal);
      video.removeEventListener("pause", fallBackToPoster);
      video.removeEventListener("error", fallBackToPoster);
    };
  }, [shouldRenderVideo]);

  return {
    containerRef,
    videoRef,
    shouldRenderVideo,
    isPlaying: state === "playing",
  };
}
