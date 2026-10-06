import { prefersReducedMotion } from "@/lib/utils/motion";

/**
 * Custom smooth scrolling utility with luxury expo easing.
 *
 * Stops short by the target's own `scroll-margin-top`, so a target sitting under
 * the fixed navbar declares its own clearance rather than this function knowing
 * the header's height.
 */
export const smoothScrollTo = (targetId: string, duration = 1400) => {
  const target = document.getElementById(targetId);
  if (!target) return;

  const html = document.documentElement;

  // What a native anchor jump would honour, so both paths land in one place.
  const scrollMargin =
    parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
  const targetPosition = Math.max(
    0,
    target.getBoundingClientRect().top + window.scrollY - scrollMargin
  );

  // A 1.4s eased scroll is motion this hook starts, so the preference governs it
  // — AGENTS.md rule 4 covers JavaScript. Arrive in one jump instead; the
  // destination is identical, only the travel is dropped.
  if (prefersReducedMotion()) {
    html.style.scrollBehavior = "auto";
    window.scrollTo(0, targetPosition);
    html.style.scrollBehavior = "";
    return;
  }

  const startPosition = window.scrollY;
  const distance = targetPosition - startPosition;
  let start: number | null = null;

  // Custom easing: easeInOutExpo for a luxury, dramatic feel
  const easing = (t: number) => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    if (t < 0.5) return Math.pow(2, 20 * t - 10) / 2;
    return (2 - Math.pow(2, -20 * t + 10)) / 2;
  };

  // Temporarily disable native smooth scrolling to prevent conflict jitter
  html.style.scrollBehavior = "auto";

  // The visitor's own scroll wins: any wheel, touch or key press ends the glide
  // where it is, instead of the animation dragging the page back.
  const listeners = new AbortController();
  for (const type of ["wheel", "touchstart", "keydown", "mousedown"] as const) {
    window.addEventListener(type, () => listeners.abort(), {
      passive: true,
      signal: listeners.signal,
    });
  }
  const finish = () => {
    listeners.abort();
    html.style.scrollBehavior = "";
  };

  const animation = (currentTime: number) => {
    if (listeners.signal.aborted) {
      finish();
      return;
    }
    if (start === null) start = currentTime;
    const timeElapsed = currentTime - start;
    const progress = Math.min(timeElapsed / duration, 1);

    window.scrollTo(0, startPosition + distance * easing(progress));

    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    } else {
      finish();
    }
  };

  requestAnimationFrame(animation);
};
