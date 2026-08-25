import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { siteConfig } from "@/lib/config";
import { getAssetPath } from "@/lib/utils/assetPath";

const instagramPosts = [
  {
    src: getAssetPath("/instagram/post_1.webp"),
    alt: "VELÉLS editorial swim look",
    href: "https://www.instagram.com/reel/DHTmsWRSp-5/",
  },
  {
    src: getAssetPath("/instagram/post_2.webp"),
    alt: "VELÉLS editorial collection detail",
    href: "https://www.instagram.com/p/DGxiw-LRcEj/",
  },
  {
    src: getAssetPath("/instagram/post_3.webp"),
    alt: "VELÉLS editorial swimwear campaign",
    href: "https://www.instagram.com/reel/DF5ao-NySgD/",
  },
];

export async function InstagramFeed() {
  const t = await getTranslations("instagram");

  return (
    <section className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-stack-xl">
      {/* Header */}
      <ScrollReveal animation="reveal-fade-up">
        <div className="text-center mb-stack-md">
          <h2 className="text-label-md tracking-[0.3em] font-semibold text-primary mb-2">
            {t("heading")}
          </h2>
        </div>
      </ScrollReveal>

      {/* Mobile Carousel / Desktop Grid */}
      <div className="flex overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-4 gap-4 pb-4 md:pb-0 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden -mx-margin-mobile px-margin-mobile md:mx-0 md:px-0">
        {instagramPosts.map((item, i) => {
          const delays = ["", "delay-100", "delay-200"] as const;

          return (
            <ScrollReveal
              key={i}
              animation="reveal-fade-in"
              delay={delays[i]}
              className="flex-none w-[75vw] sm:w-[45vw] md:w-auto snap-center"
            >
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full aspect-4/5 bg-surface-container-low hover-image-zoom relative overflow-hidden group"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="w-full h-full object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 duration-300">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-on-primary"
                  >
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                  </svg>
                </div>
              </a>
            </ScrollReveal>
          );
        })}

        {/* 4th Card: Follow Us CTA */}
        <ScrollReveal
          animation="reveal-fade-in"
          delay="delay-300"
          className="flex-none w-[75vw] sm:w-[45vw] md:w-auto snap-center"
        >
          <a
            href={siteConfig.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full aspect-4/5 bg-surface-variant relative flex items-center justify-center border border-outline-variant/50 hover:bg-surface-container-low transition-colors duration-300 cursor-pointer group text-center p-4"
          >
            <div>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="mx-auto mb-2 text-primary transition-transform group-hover:translate-x-1 duration-300"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              <p className="text-label-md text-primary">{t("follow")}</p>
            </div>
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
