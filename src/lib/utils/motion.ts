export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function prefersReducedMotion(): boolean {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

/**
 * For `scrollTo` and `scrollIntoView`. A `behavior` passed from JavaScript
 * overrides the CSS reduced-motion reset, so it has to check for itself.
 */
export function scrollBehavior(): ScrollBehavior {
  return prefersReducedMotion() ? "auto" : "smooth";
}
