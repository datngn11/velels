"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { getAssetPath } from "@/lib/utils/assetPath";
import { smoothScrollTo } from "@/lib/utils/smoothScroll";
import { useVideoAutoplay } from "@/hooks/useVideoAutoplay";

export function HeroSection() {
  const t = useTranslations("hero");
  const videoRef = useVideoAutoplay();

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
        sizes="(min-width: 768px) 100vw, 1px"
      />

      {/* Mobile Hero video */}
      <div className="block md:hidden absolute inset-0 w-full h-full overflow-hidden">
        <video
          ref={videoRef}
          src={getAssetPath("/hero/hero_mobile.mp4")}
          poster={getAssetPath("/hero/hero_mobile_poster.webp")}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onLoadedData={(e) => {
            if (e.currentTarget.paused) {
              e.currentTarget.play().catch(() => {});
            }
          }}
          onCanPlay={(e) => {
            if (e.currentTarget.paused) {
              e.currentTarget.play().catch(() => {});
            }
          }}
          className="w-full h-full object-cover max-w-full pointer-events-none"
        >
          <source
            src={getAssetPath("/hero/hero_mobile.mp4")}
            type="video/mp4"
          />
        </video>
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
