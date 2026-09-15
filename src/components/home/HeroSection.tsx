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
    <section className="w-full h-[90vh] min-h-[600px] relative overflow-hidden flex items-center justify-center bg-surface">
      {/* Darkens the desktop still so the white copy reads over it. Desktop only:
          on mobile it has nothing to darken until the video arrives, and tinting
          the bare white ground in the meantime is what made the hero step white,
          grey, video. */}
      <div className="hidden md:block absolute inset-0 bg-black/20 z-10 pointer-events-none" />

      {/* Desktop still. NOTE: `hidden` does not stop the fetch — a phone
          downloads this 101 KB and paints none of it. The `<source media>` that
          used to prevent that went with the mobile poster, and `<picture>` cannot
          express "no image here" without one. `contents` keeps the wrapper out of
          the section's flex layout. */}
      <picture className="contents">
        <img
          src="/hero/hero_desktop.webp"
          alt={HERO_ALT}
          fetchPriority="high"
          decoding="async"
          className="hidden md:block absolute inset-0 w-full h-full object-cover animate-hero-zoom"
        />
      </picture>

      {/* The entire mobile hero. Mounts to be probed and unmounts the moment
          that falls through, leaving the bare white section. */}
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
            /* Opacity, not `hidden`: a display:none video is refused autoplay by
               some browsers. Flipped with no transition — the fade is what the
               owner rejected, not the hiding. An element with no decoded frame
               paints black on some Android builds, which would flash before the
               first frame. */
            className={`absolute inset-0 w-full h-full object-cover pointer-events-none ${
              isPlaying ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* H.265 first: 3.3 MB against H.264's 4.7 at matched quality, and
                every iPhone since 2017 decodes it in hardware. The tag must be
                `hvc1`, not `hev1`, or Safari refuses it. */}
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
