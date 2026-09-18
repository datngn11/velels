"use client";

import { useTranslations } from "next-intl";
import { smoothScrollTo } from "@/lib/utils/smoothScroll";
import { useVideoAutoplay } from "@/hooks/useVideoAutoplay";

const HERO_ALT = "VELÉLS editorial hero — model in luxury swimwear";
const HERO_DESKTOP = "/hero/hero_desktop.webp";
const HERO_POSTER = "/hero/hero_mobile_poster.webp";

export function HeroSection() {
  const t = useTranslations("hero");
  const { containerRef, videoRef, shouldRenderVideo, isPlaying, showPoster } =
    useVideoAutoplay();

  return (
    <section className="w-full h-[90vh] min-h-[600px] relative overflow-hidden flex items-center justify-center bg-surface">
      {/* Darkens whatever sits behind the white copy. Desktop always has the
          still under it. Mobile gets it only once the video or the poster is up.
          What matters is that this keys on media being on screen, not on the
          video element mounting. Keyed to the mount, it greyed the bare section
          for as long as the video took to load, so the hero stepped from white
          to grey to video. */}
      <div
        className={`absolute inset-0 bg-black/20 z-10 pointer-events-none md:block ${
          isPlaying || showPoster ? "block" : "hidden"
        }`}
      />

      {/* Desktop still, as a background rather than an `<img>`. `hidden` does not
          stop an image fetch, so an `<img>` made every phone download 101 KB it
          never painted. A background on a `display:none` element is never
          requested. The preload restores the priority the `<img>` had, since a
          background is only found once CSS is parsed, and `media` keeps it off
          phones too. */}
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

      {/* The whole mobile hero. The video when it plays, the poster when it
          cannot, never both. Nothing is rendered under a video that is about to
          arrive, so a working visit goes from the bare section straight to
          moving footage with no still in between.

          The poster appears only once the hook has settled on no video at all.
          That covers Low Power Mode, Save-Data, reduced motion, a decode error,
          and a request that produced nothing. In each of those the alternative
          is an empty hero. The file is the video's own first frame, so the two
          are the same picture. */}
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
               display:none video. It flips with no transition, because an
               element with no decoded frame paints black on some Android
               builds. */
            className={`absolute inset-0 w-full h-full object-cover pointer-events-none ${
              isPlaying ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* H.265 first. It is 3.3 MB against H.264's 4.7 at matched quality,
                and every iPhone since 2017 decodes it in hardware. The tag must
                be `hvc1`, not `hev1`, or Safari refuses it. */}
            <source
              src="/hero/hero_mobile.hevc.mp4"
              type='video/mp4; codecs="hvc1"'
            />
            <source src="/hero/hero_mobile.mp4" type="video/mp4" />
          </video>
        )}

        {showPoster && (
          <div
            role="img"
            aria-label={HERO_ALT}
            style={{ backgroundImage: `url(${HERO_POSTER})` }}
            className="absolute inset-0 bg-cover bg-center"
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
          /* Heavier on mobile, where nothing darkens what is behind it until
             there is media to darken. */
          className="inline-block bg-black/60 md:bg-black/40 text-on-primary text-label-sm px-4 py-2.5 opacity-0 animate-fade-in-up hover:scale-105 transition-all duration-300 cursor-pointer [animation-delay:950ms] rounded-3xl"
        >
          {t("cta")}
        </button>
      </div>
    </section>
  );
}
