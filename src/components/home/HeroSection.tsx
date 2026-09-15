"use client";

import { useTranslations } from "next-intl";
import { smoothScrollTo } from "@/lib/utils/smoothScroll";
import { useVideoAutoplay } from "@/hooks/useVideoAutoplay";

const HERO_ALT = "VELÉLS editorial hero — model in luxury swimwear";
const HERO_DESKTOP = "/hero/hero_desktop.webp";

export function HeroSection() {
  const t = useTranslations("hero");
  const { containerRef, videoRef, shouldRenderVideo, isPlaying } =
    useVideoAutoplay();

  return (
    <section className="w-full h-[90vh] min-h-[600px] relative overflow-hidden flex items-center justify-center bg-surface">
      {/* Darkens the desktop still so the white copy reads over it. Desktop only.
          On mobile it has nothing to darken until the video arrives, and tinting
          the bare white ground in the meantime made the hero step from white to
          grey to video. */}
      <div className="hidden md:block absolute inset-0 bg-black/20 z-10 pointer-events-none" />

      {/* Desktop still, as a background rather than an `<img>`. `hidden` does not
          stop an image fetch, so every phone downloaded this 101 KB and painted
          none of it. A background on a `display:none` element is never
          requested. `<picture>` cannot solve it now: with no mobile image to
          name, the `<img>` fallback fetches the desktop file anyway.

          The preload restores the priority the `<img>` had, since a background
          is only discovered once CSS is parsed. `media` keeps it off phones too,
          which is the same guard the deleted `<source media>` provided. */}
      <link
        rel="preload"
        as="image"
        href={HERO_DESKTOP}
        media="(min-width: 768px)"
        fetchPriority="high"
      />
      <div
        role="img"
        aria-label={HERO_ALT}
        style={{ backgroundImage: `url(${HERO_DESKTOP})` }}
        className="hidden md:block absolute inset-0 bg-cover bg-center animate-hero-zoom"
      />

      {/* The entire mobile hero. Mounts to be probed, and unmounts the moment
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
            /* Opacity, not `hidden`. Some browsers refuse autoplay to a
               display:none video. Flipped with no transition, because the fade is
               what the owner rejected, not the hiding. An element with no decoded
               frame paints black on some Android builds, which would flash before
               the first frame. */
            className={`absolute inset-0 w-full h-full object-cover pointer-events-none ${
              isPlaying ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* H.265 first. It is 3.3 MB against H.264's 4.7 at matched quality,
                and every iPhone since 2017 decodes it in hardware. The tag must be
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
          /* Heavier on mobile, where the overlay no longer darkens the video
             behind it. Desktop keeps 40%, since the overlay is still there. */
          className="inline-block bg-black/50 md:bg-black/40 text-on-primary text-label-sm px-4 py-2.5 opacity-0 animate-fade-in-up hover:scale-105 transition-all duration-300 cursor-pointer [animation-delay:950ms] rounded-3xl"
        >
          {t("cta")}
        </button>
      </div>
    </section>
  );
}
