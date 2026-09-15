"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Lifecycle of the mobile hero video.
 *
 * - `deciding`: the gate below has not cleared. No element is mounted and no
 *   video is requested. A suppressed visit stays here, rendering what `static`
 *   renders, so there is nothing to transition to.
 * - `probing`: the element is mounted and one gesture-less `play()` is in
 *   flight. That attempt is the Low Power Mode test. iOS exposes no API for the
 *   setting, but WebKit refuses unprompted playback while it is on.
 * - `playing`: the browser fired a real `playing` event, so frames are advancing
 *   and the video is safe to show.
 * - `static`: motion is unavailable or unwanted. The video element is torn down,
 *   so WebKit has nothing left to paint a native play button on. Only a decode
 *   error or a probe that never produced a frame reaches this. A pause does not.
 */
type HeroVideoState = "deciding" | "probing" | "playing" | "static";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * How long to wait for the first frame before giving up. A request that stalls
 * after its headers settles neither `play()` nor `error`, so without a deadline
 * a hidden element would keep pulling the whole file down for the rest of the
 * visit. Long enough not to punish a slow start, short enough that a loop
 * beginning seconds in is not worth the data it costs.
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
 * Decides whether the mobile hero plays video, and reports the result. Autoplay
 * is attempted once and never retried. The probe below says why.
 */
export function useVideoAutoplay() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<HeroVideoState>("deciding");
  const shouldRenderVideo = state === "probing" || state === "playing";

  // Does this visitor get motion at all, and is the hero on screen yet? Both
  // questions are settled here, in that order, so a queued observer callback
  // cannot overtake a suppressed visit.
  useEffect(() => {
    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);

    // Never start motion the visitor asked not to see. AGENTS.md rule 4 covers
    // JavaScript, not only CSS. Never spend a metered connection on decoration
    // either. Bailing out leaves the hook in `deciding`, which renders what
    // `static` renders. Nothing to tear down and no state to set, so a
    // suppressed visit costs no extra render.
    if (reducedMotion.matches || prefersLessData()) return;

    // Wait until the hero is on screen before asking for the video, so it does
    // not compete for bandwidth during first paint.
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect();
        setState("probing");
      }
    });

    // One-way. Turning the preference back off does not resurrect the video.
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
  // answer. A refusal is final. A gesture is the one thing iOS will accept in Low
  // Power Mode, so retrying on touch or scroll made the video ambush people
  // mid-scroll. Keyed on the boolean rather than the state, so it runs once per
  // mounted element instead of again on the reveal.
  useEffect(() => {
    if (!shouldRenderVideo) return;

    const video = videoRef.current;
    if (!video) return;

    let active = true;

    // Tearing the element down leaves the bare section behind, because the
    // poster it used to fall back to is gone. Only two cases have nothing to
    // show and belong here. A decode error, and a probe that never produced a
    // frame.
    const giveUp = () => {
      if (active) setState("static");
    };

    const probeTimer = window.setTimeout(giveUp, PROBE_TIMEOUT_MS);

    const reveal = () => {
      window.clearTimeout(probeTimer);
      if (active) setState("playing");
    };

    // A pause we did not ask for is not a failure. iOS pauses inline video
    // whenever Safari is backgrounded. Treating that as terminal emptied the
    // hero on return from the home screen, because `static` is one-way and only
    // a reload came back from it.
    //
    // Nothing listens for `pause` now. iOS never resumes on its own, so the page
    // coming back is the only signal worth having. Resuming from the pause event
    // instead risks a pause, play, pause loop when the platform re-pauses each
    // time. `pageshow` covers a bfcache restore, which can skip
    // visibilitychange. If the resume is refused, the last frame stays up.
    const resume = () => {
      if (!active || document.visibilityState !== "visible") return;
      if (!video.paused) return;
      void video.play().catch(() => {});
    };

    video.addEventListener("playing", reveal);
    video.addEventListener("error", giveUp);
    document.addEventListener("visibilitychange", resume);
    window.addEventListener("pageshow", resume);

    // WebKit honours these as element properties, not only as attributes.
    video.defaultMuted = true;
    video.muted = true;
    video.play().catch(giveUp);

    return () => {
      active = false;
      window.clearTimeout(probeTimer);
      video.removeEventListener("playing", reveal);
      video.removeEventListener("error", giveUp);
      document.removeEventListener("visibilitychange", resume);
      window.removeEventListener("pageshow", resume);
    };
  }, [shouldRenderVideo]);

  return {
    containerRef,
    videoRef,
    shouldRenderVideo,
    isPlaying: state === "playing",
  };
}
