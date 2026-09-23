"use client";

import { useTranslations } from "next-intl";
import { smoothScrollTo } from "@/lib/utils/smoothScroll";
import { useVideoAutoplay } from "@/hooks/useVideoAutoplay";

const HERO_DESKTOP = "/hero/hero_desktop.webp";
const HERO_POSTER = "/hero/hero_mobile_poster.webp";

export function HeroSection() {
  const t = useTranslations("hero");
  const { containerRef, videoRef, shouldRenderVideo, isPlaying } =
    useVideoAutoplay();

  return (
    <section className="w-full h-[90vh] min-h-[600px] relative overflow-hidden flex items-center justify-center bg-surface">
      {/* Darkens the still so the white copy reads over it. Unconditional,
          because a still is now always behind it on both viewports. It was once
          tied to the video mounting, which greyed a bare white section for as
          long as the video took to load. */}
      <div className="absolute inset-0 bg-black/20 z-10 pointer-events-none" />

      {/* One still for both viewports. `media` is resolved before the fetch, so
          a phone takes the 46 KB poster and a desktop the 101 KB landscape, never
          both. `contents` keeps the wrapper out of the section's flex layout.

          On mobile this is also the video's first frame, so when playback starts
          the picture does not change, it begins to move. That is what makes it
          safe to show before the video: there is no transition to see. */}
      <picture className="contents">
        <source media="(min-width: 768px)" srcSet={HERO_DESKTOP} />
        <img
          src={HERO_POSTER}
          // One alt for two photos: <picture> swaps the file by viewport but
          // keeps one <img>, so the text has to be true of both.
          alt={t("imageAlt")}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover animate-hero-zoom"
        />
      </picture>

      {/* Mobile video, which paints over the still above once it is playing.
          It stays hidden until then, and unmounts if playback is refused, so
          Low Power Mode, Save-Data, reduced motion and a decode error all leave
          the still standing on its own. None of them download a byte of video:
          `preload="none"` means nothing loads until `play()`, and `play()` is
          what those cases refuse. */}
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
