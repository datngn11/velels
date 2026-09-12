"use client";

import { useTranslations } from "next-intl";
import { smoothScrollTo } from "@/lib/utils/smoothScroll";
import { useVideoAutoplay } from "@/hooks/useVideoAutoplay";

const HERO_ALT = "VELÉLS editorial hero — model in luxury swimwear";

export function HeroSection() {
  const t = useTranslations("hero");
  const { containerRef, videoRef, shouldRenderVideo, isPlaying } =
    useVideoAutoplay();

  return (
    <section className="w-full h-[90vh] min-h-[600px] relative overflow-hidden flex items-center justify-center">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/20 z-10" />

      {/* One element for both viewports. Two `<Image>`s hidden by CSS each emitted
          a high-priority head preload, so every device fetched both files — 101 KB
          of it unused on a phone. `media` is resolved before the fetch, and a plain
          `<img>` emits no preload at all. `next/image` is not giving anything up
          here: `images.unoptimized` is already set. */}
      <picture>
        <source media="(min-width: 768px)" srcSet="/hero/hero_desktop.webp" />
        <img
          src="/hero/hero_mobile_poster.webp"
          alt={HERO_ALT}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover animate-hero-zoom hero-parallax-img"
        />
      </picture>

      {/* Mobile Hero video — plays over the poster above. It mounts only to be
          probed, stays fully transparent until it is genuinely playing, and
          unmounts again the moment that falls through. */}
      <div
        ref={containerRef}
        className="block md:hidden absolute inset-0 w-full h-full overflow-hidden"
      >
        {shouldRenderVideo && (
          <video
            ref={videoRef}
            src={"/hero/hero_mobile.mp4"}
            loop
            muted
            playsInline
            preload="none"
            disablePictureInPicture
            aria-hidden="true"
            className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-700 ${
              isPlaying ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
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
        <p className="text-body-lg text-on-primary/90 max-w-xl px-4 md:px-8 mb-6 opacity-0 animate-fade-in-up [animation-delay:700ms]">
          {t("description")}
        </p>
        <button
          onClick={() => smoothScrollTo("collection")}
          className="inline-block bg-[rgb(10,10,10,0.37)] text-on-primary text-label-sm px-4 py-2.5 opacity-0 animate-fade-in-up hover:scale-105 transition-all duration-300 cursor-pointer [animation-delay:950ms] rounded-3xl"
        >
          {t("cta")}
        </button>
      </div>
    </section>
  );
}
