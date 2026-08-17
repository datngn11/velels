"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { getAssetPath } from "@/lib/utils/assetPath";

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

      {/* Desktop Hero image */}
      <Image
        src={getAssetPath("/hero/hero_desktop.webp")}
        alt="VELÉLS editorial hero — model in luxury swimwear"
        fill
        className="hidden md:block object-cover animate-hero-zoom hero-parallax-img"
        priority
        sizes="100vw"
      />

      {/* Mobile Hero video */}
      <div className="block md:hidden absolute inset-0 w-full h-full overflow-hidden">
        <video
          src={getAssetPath("/hero/hero_mobile.mp4")}
          poster={getAssetPath("/hero/hero_mobile.webp")}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="w-full h-full object-cover max-w-full"
        />
      </div>

      {/* Content */}
      <div className="relative z-20 text-center px-margin-mobile md:px-margin-desktop flex flex-col items-center gap-stack-sm max-w-3xl">
        <div>
          <h1 className="text-display-lg text-on-primary opacity-0 animate-fade-in-up [animation-delay:200ms] tracking-[8px] md:tracking-[12px] max-w-full">
            {t("title")}
          </h1>
          <p className="text-[10px] text-on-primary/90 max-w-xl opacity-0 animate-fade-in-up [animation-delay:450ms] uppercase tracking-[4px]">
            {t("subtitle")}
          </p>
        </div>
        <p className="text-body-lg text-on-primary/90 max-w-xl mb-6 opacity-0 animate-fade-in-up [animation-delay:700ms]">
          {t("description")}
        </p>
        <button
          onClick={() => smoothScrollTo("collection")}
          className="inline-block bg-[rgb(10,10,10,0.37)] text-on-primary text-label-md px-6 py-4 opacity-0 animate-fade-in-up hover:scale-105 transition-all duration-300 cursor-pointer [animation-delay:950ms] rounded-3xl"
        >
          {t("cta")}
        </button>
      </div>
    </section>
  );
}
