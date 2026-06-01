"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";

const smoothScrollTo = (targetId: string) => {
  const target = document.getElementById(targetId);
  if (!target) return;

  const targetPosition = target.getBoundingClientRect().top + window.scrollY;
  const startPosition = window.scrollY;
  const distance = targetPosition - startPosition;
  const duration = 1400;
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

export function HeroSection() {
  const t = useTranslations("hero");

  return (
    <section className="w-full h-[90vh] min-h-[600px] relative overflow-hidden flex items-center justify-center">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/20 z-10" />

      {/* Hero image */}
      <Image
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAp4XkLdYE2wwmWSlIqGIEEPxHQxxetZ80Dm7DwmKO9Rg4-3G-qLchhosxt-6ZJg_K2-tpUnpe3OGaUD8pf4XUruHJtOQAR-lD0DeJu3CmNyI9cfQcysHOcJR7r9gbogbZxsF-Gn-WE1WDNR40UrnAIB0VoNBKsaiNIpZB6ZZtfYdse_7d8Htmw4_01s3QQLVi-c0yZ_GlZPTQT4ei9uw0wLQwAhOW5rLgh5YBl4EtPqsxR3OsHsGyz8UhTqQGXpDy2mSm-hIidEK0"
        alt="VELÉLS editorial hero — model in luxury swimwear on sun-drenched beach"
        fill
        className="object-cover animate-hero-zoom hero-parallax-img"
        priority
        sizes="100vw"
      />

      {/* Content */}
      <div className="relative z-20 text-center px-margin-mobile md:px-margin-desktop flex flex-col items-center gap-stack-sm max-w-3xl">
        <h1 className="text-display-lg text-on-primary animate-fade-in-up">
          {t("title")}
        </h1>
        <p className="text-body-lg text-on-primary/90 max-w-xl mb-6 opacity-0 animate-fade-in-up [animation-delay:100ms]">
          {t("subtitle")}
        </p>
        <button
          onClick={() => smoothScrollTo("collection")}
          className="inline-block bg-primary text-on-primary text-label-md px-8 py-4 opacity-0 animate-fade-in-up hover:scale-105 transition-all duration-300 cursor-pointer [animation-delay:100ms]"
        >
          {t("cta")}
        </button>
      </div>
    </section>
  );
}
