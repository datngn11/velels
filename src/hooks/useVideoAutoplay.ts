"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Lifecycle of the mobile hero video.
 *
 * - `deciding`: the gate below has not cleared. No element is mounted, no video
 *   is requested, and nothing is shown. Every visit starts here.
 * - `probing`: the element is mounted and one gesture-less `play()` is in
 *   flight. That attempt is the Low Power Mode test. iOS exposes no API for the
 *   setting, but WebKit refuses unprompted playback while it is on.
 * - `playing`: the browser fired a real `playing` event, so frames are advancing
 *   and the video is safe to show.
 * - `static`: this visit gets no video. The poster is the hero instead, and the
 *   video element is torn down, so WebKit has nothing left to paint a native
 *   play button on. Four things reach it. A refused `play()`, which is what Low
 *   Power Mode looks like from here. A decode error. A probe that produced no
 *   bytes. And a preference that rules motion out before the probe runs. A pause
 *   does not.
 */
type HeroVideoState = "deciding" | "probing" | "playing" | "static";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * How long to wait before asking whether the request is alive at all. One that
 * stalls after its headers settles neither `play()` nor `error`, so without a
 * deadline a hidden element keeps pulling the whole file down for the rest of
 * the visit. Only a request that has buffered nothing by now is treated as dead.
 */
const PROBE_TIMEOUT_MS = 12000;

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
    // either. This sets `static` instead of returning early, because `deciding`
    // also renders no video and only one of the two should show the poster.
    // Left in `deciding`, the poster would flash before every video.
    if (reducedMotion.matches || prefersLessData()) {
      // Neither preference can be read during render without a hydration
      // mismatch, since the server has no `window`. The cascade the rule guards
      // against is one extra render on mount, for the minority of visits that
      // get no video.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState("static");
      return;
    }

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
    let revealed = false;

    // Tearing the element down leaves the bare section behind, because the
    // poster it used to fall back to is gone. Only a decode error and a request
    // that produced nothing at all belong here.
    const giveUp = () => {
      if (active) setState("static");
    };

    // A slow connection is not a broken one. Give up at the deadline only if
    // nothing has arrived. If bytes are buffering the request is working and the
    // `playing` event will reveal it in its own time. Giving up on the clock
    // alone emptied the hero on exactly the connections that take longest.
    const probeTimer = window.setTimeout(() => {
      if (video.buffered.length > 0 || video.readyState >= 2) return;
      giveUp();
    }, PROBE_TIMEOUT_MS);

    const reveal = () => {
      window.clearTimeout(probeTimer);
      revealed = true;
      if (active) setState("playing");
    };

    // A pause we did not ask for is not a failure. iOS pauses inline video
    // whenever Safari is backgrounded, and treating that as terminal emptied the
    // hero on return from the home screen, because `static` is one-way.
    //
    // Nothing listens for `pause`. iOS never resumes on its own, so every signal
    // here is about the page coming back. `visibilitychange` alone was not
    // enough. iOS skips it when Safari returns from the app switcher, and the
    // page never left memory, so `pageshow` does not fire either. `focus` covers
    // that gap and `pageshow` still covers a real bfcache restore.
    //
    // A touch is the last resort, for the case where none of the three fire. It
    // only ever resumes a video that already played, so it cannot start one
    // under someone mid-scroll, which is what made the old gesture retry
    // unacceptable.
    const resume = () => {
      if (!active || !revealed) return;
      if (document.visibilityState !== "visible" || !video.paused) return;
      void video.play().catch(() => {});
    };

    video.addEventListener("playing", reveal);
    video.addEventListener("error", giveUp);
    document.addEventListener("visibilitychange", resume);
    document.addEventListener("touchstart", resume, { passive: true });
    window.addEventListener("pageshow", resume);
    window.addEventListener("focus", resume);

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
      document.removeEventListener("touchstart", resume);
      window.removeEventListener("pageshow", resume);
      window.removeEventListener("focus", resume);
    };
  }, [shouldRenderVideo]);

  return {
    containerRef,
    videoRef,
    shouldRenderVideo,
    isPlaying: state === "playing",
    /** The video will not play here. Show the still instead of an empty hero. */
    showPoster: state === "static",
  };
}
