"use client";

import { useTranslations } from "next-intl";
import { smoothScrollTo } from "@/lib/utils/smoothScroll";
import { useVideoAutoplay } from "@/hooks/useVideoAutoplay";

const HERO_ALT = "VELÉLS editorial hero — model in luxury swimwear";

export function HeroSection() {
  const t = useTranslations("hero");
  const { containerRef, videoRef, shouldRenderVideo } = useVideoAutoplay();

  return (
    <section className="w-full h-[90vh] min-h-[600px] relative overflow-hidden flex items-center justify-center bg-surface">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/20 z-10" />

      {/* Desktop still image. The mobile poster it used to share was removed — the
          phone hero is the video alone, with no still underneath it and nothing to
          cross-fade from. `media` is resolved before the fetch and a plain `<img>`
          emits no preload, so a phone never requests this file. `next/image` is not
          giving anything up here: `images.unoptimized` is already set. */}
      {/* `contents` keeps the wrapper out of the section's flex layout — the
          `<img>` inside it is absolutely positioned. */}
      <picture className="contents">
        <img
          src="/hero/hero_desktop.webp"
          alt={HERO_ALT}
          fetchPriority="high"
          decoding="async"
          className="hidden md:block absolute inset-0 w-full h-full object-cover animate-hero-zoom"
        />
      </picture>

      {/* Mobile Hero video — the whole mobile hero. It mounts to be probed and
          unmounts again the moment that falls through, which now leaves the bare
          black section behind it rather than a poster. */}
      <div
        ref={containerRef}
        className="block md:hidden absolute inset-0 w-full h-full overflow-hidden"
      >
        {shouldRenderVideo && (
          <video
            ref={videoRef}
            loop
            muted
            playsInline
            preload="none"
            disablePictureInPicture
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          >
            {/* H.265 first: at matched quality it is 3.3 MB against H.264's 4.7,
                and every iPhone since 2017 decodes it in hardware — which is most
                of this audience, arriving from Instagram. A browser that does not
                claim the type skips to the H.264 below, and if both fail the
                `error` listener in useVideoAutoplay tears the element down.
                The tag must be `hvc1`, not `hev1`, or Safari refuses it. */}
            <source
              src="/hero/hero_mobile.hevc.mp4"
              type='video/mp4; codecs="hvc1"'
            />
            <source src="/hero/hero_mobile.mp4" type="video/mp4" />
          </video>
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
          className="inline-block bg-[rgb(10,10,10,0.4)] text-on-primary text-label-sm px-4 py-2.5 opacity-0 animate-fade-in-up hover:scale-105 transition-all duration-300 cursor-pointer [animation-delay:950ms] rounded-3xl"
        >
          {t("cta")}
        </button>
      </div>
    </section>
  );
}
