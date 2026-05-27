import { useTranslations } from "next-intl";
import Image from "next/image";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { siteConfig } from "@/lib/config";

const instagramImages = [
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBsOP8L0M-Qtx7ffizVGhV3DIoB0cDL5B6ezJZIGRJyQgFoyVcilumeWUAdkGxRpDfLrGmCdojxrc4WF_cOy6FICnKPo4FIWLsGXZozetNNsodFtq3gIwhJT0wc-t3jEQ9rnj5vTjOnJCMIBxisXswUVFpO1648ILnqGZHRBRsSKheJVkM395uoHVgwfgNgG36x12i8AEess9povejV2WVlPkOEtwvBEQOQujpyIbO6wMhIq2LNUFWK_Ukzz6KuzlO8-C7rteqNhxc",
    alt: "Instagram — detail of a minimalist swimsuit strap against sun-tanned skin",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDipGs8e8u1hHN6sfW_rG66y-k52npeavG77ddLeIsjrQivRnJ57b0zjpKB0gjXJLfn8P6NXzAbD1B93bU6rqqU-b0MYkr-riwkBjyl0axLPGIVI_297h7JACxgt5xtpAxsk7g_GuhAWxpEFXLOXiogVw-E_rupSFwuggCVnSU3wUxQG_h4-YMrCHWNl3yeCAzGx51kginBp4uy3ZFJz8lyYbPA5GjyaeFuSyMJTh6n9MfvGE7T1H31C3za_q0a8ed7XgTz39-tYPM",
    alt: "Instagram — serene beach landscape at midday without vibrant colors",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD7B_iUhBBN0Q-Ej444R5z8p58OGVaEEAxk0vHn8ERt_XnqTVIJ8zCLuqQ6pOq24I3WRQAVlsB5vZRUGPnG3Q3ymgpXxFrisYzpm2fELnnXIjZsxVenCn47_IsFz-aFBeh5hh2AM6ROQuMkrFg1xzF6QLHrPAXluR8VVe8Q2U22G1ApSM8Bc9iVgkAdMaKoQV1LCyW2DQDw4HfdeU6i-V5M71dkg5KzAXjgF5X03pNRe6ourWNwg35O7iHsTOuqmrdn1MXxJWyjajI",
    alt: "Instagram — model in structural black swimsuit against pale sky",
  },
];

export function InstagramFeed() {
  const t = useTranslations("instagram");

  return (
    <section className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-stack-xl">
      {/* Header */}
      <ScrollReveal animation="reveal-fade-up">
        <div className="text-center mb-stack-md">
          <h2 className="font-sans text-[12px] leading-[16px] tracking-[0.3em] font-semibold text-primary uppercase mb-2">
            {t("heading")}
          </h2>
        </div>
      </ScrollReveal>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {instagramImages.map((img, i) => {
          const delays = ["", "delay-100", "delay-200"] as const;

          return (
            <ScrollReveal key={i} animation="reveal-fade-in" delay={delays[i]}>
              <div className="aspect-[4/5] bg-surface-container-low hover-image-zoom relative overflow-hidden group">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="w-full h-full object-cover grayscale"
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
              </div>
            </ScrollReveal>
          );
        })}

        {/* 4th Card: Follow Us CTA */}
        <ScrollReveal animation="reveal-fade-in" delay="delay-300">
          <a
            href={siteConfig.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="aspect-[4/5] bg-surface-variant relative flex items-center justify-center border border-outline-variant/50 hover:bg-surface-container-low transition-colors duration-300 cursor-pointer group text-center p-4"
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
              <p className="font-sans text-[12px] leading-[16px] tracking-[0.15em] uppercase text-primary font-medium">
                {t("follow")}
              </p>
            </div>
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
