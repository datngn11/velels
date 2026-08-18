/**
 * Custom smooth scrolling utility with luxury expo easing.
 */
export const smoothScrollTo = (targetId: string, duration = 1400) => {
  const target = document.getElementById(targetId);
  if (!target) return;

  const targetPosition = target.getBoundingClientRect().top + window.scrollY;
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
  const html = document.documentElement;
  html.style.scrollBehavior = "auto";

  const animation = (currentTime: number) => {
    if (start === null) start = currentTime;
    const timeElapsed = currentTime - start;
    const progress = Math.min(timeElapsed / duration, 1);

    window.scrollTo(0, startPosition + distance * easing(progress));

    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    } else {
      // Restore native scrolling once animation is complete
      html.style.scrollBehavior = "";
    }
  };

  requestAnimationFrame(animation);
};
