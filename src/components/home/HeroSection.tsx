"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { getAssetPath } from "@/lib/utils/assetPath";
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

      {/* Desktop Hero image. `loading="eager"` + `fetchPriority` rather than the
          deprecated `priority`, per the Next 16 image docs. Note this does NOT
          drop the head preload — measured: eager emits one regardless — so this
          and the mobile poster still preload as competing LCP candidates. Only
          art direction fixes that; see the `<picture>` item in
          `docs/release-checklist.md`. */}
      <Image
        src={getAssetPath("/hero/hero_desktop.webp")}
        alt={HERO_ALT}
        fill
        className="hidden md:block object-cover animate-hero-zoom hero-parallax-img"
        loading="eager"
        fetchPriority="high"
        sizes="(min-width: 768px) 100vw, 1px"
      />

      {/* Mobile Hero — the poster is the base layer, and the whole treatment
          whenever the platform will not autoplay (Low Power Mode, reduced
          motion, Data Saver). The video mounts only to be probed, stays fully
          transparent until it is genuinely playing, and unmounts again the
          moment that falls through. */}
      <div
        ref={containerRef}
        className="block md:hidden absolute inset-0 w-full h-full overflow-hidden"
      >
        <Image
          src={getAssetPath("/hero/hero_mobile_poster.webp")}
          alt={HERO_ALT}
          fill
          className="object-cover"
          loading="eager"
          fetchPriority="high"
          sizes="(max-width: 767px) 100vw, 1px"
        />

        {shouldRenderVideo && (
          <video
            ref={videoRef}
            src={getAssetPath("/hero/hero_mobile.mp4")}
            loop
            muted
            playsInline
            preload="none"
            controls={false}
            disablePictureInPicture
            aria-hidden="true"
            tabIndex={-1}
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
