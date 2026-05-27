import { useTranslations } from "next-intl";
import Image from "next/image";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { siteConfig } from "@/lib/config";

const instagramImages = [
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAXeeBbjzJXs3NjrB6mNoROWCwiESW-xuMORS7RSAT0MTjaA_b86H7ShlFRuT0e_YFYiAIV0u3Isl67UikdGRo02Owp6-BHpVK62CkyF-9mEKJQBoIEkdZiLRhF_g6siLzM8yR9KRDK8M0PlHnMEFInI0p76Ijxyw-GhfMb6zd7Vi00TjavEhxdhWS5e-cOlDMIWevOC-O2178-h89GBPEhIwE_pRruRPjxjqM0Wz7VNMjoZZHAS0GXp6MFXzjaLZEZdOxtSRuqiu4",
    alt: "Instagram — minimalist beach scene with geometric shadows",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDPPQj-BpahrDNUD6-io6kzWJcCALPVlaKXCRABddjpW_bnlxqvZZYkxXu6BEyyb8IWtdLTmRSj3BlJr-Aujgj77aXPHM5aB7J_glUny4mnBjYaVjVRFzKCeh6Xpe3ySQJLuemjFyEnEDWJoY5tyfs307OU2Yd1n2cjGAis8Q78R5ZltAL4TL8uz2XNRi7w0gHOh6lZoxqhEcsfShAaLRK_wDH9kp1SaAOFVl1tvbkkPictoTY6kqj5WYxDeQ8mDqOU1EyOqKhua4Q",
    alt: "Instagram — black swimsuit fabric detail against sun-kissed skin",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBKsqZfz7pBTMMrTK7Ex6mrNuh5Be5YYdF4FJuMhHtUiAjIVkkYBk9ILHOGGB4Ma78Lf1a03zh48MSq4ejnPwAuVyFBM4ieCmfKduruAp5U2OF6UBMZh52ZmMpHu-FwGJgBMQdTa0A9SlhA5d3JkBnn9jtsXtLgXIcUBh56t9sRN6FJmpNpmaERvSreuS6qNcW7va7pG9shIqvTQ8i6oTuZ7h8qlX7LCM8wCLAnmLVTnurljPLs9g26KQNmym9LXIBiIoz13WZdsYU",
    alt: "Instagram — vast ocean horizon with minimal composition",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-Cq4ynIFwUn5w4PuUQgMEJI2if4jn80-l2wi9OqMvDzuHwNkiXtys0sYWIxnGhL_6kntDYTqeRDeecsBwgLbiKNL-5XuBpSa14R23KlZKQzaOuQJ19XphgZ05nIcsRCHxeXC-WeDeSp5CtmfO-3vHwFduZ5wxMNM8lZy-s1gX5-j3TsRnZ17mrLCLkP7jcncPLXVJFFSDsOOtKn52qYCo4GK6QcYqHMHaafJUIeHP_gsxDUOoCzoslu6T7SytWlQXOO0gKT2WPSQ",
    alt: "Instagram — model silhouette in one-piece against hazy sky",
  },
];

export function InstagramFeed() {
  const t = useTranslations("instagram");

  return (
    <section className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-stack-xl">
      {/* Header */}
      <ScrollReveal animation="reveal-fade-up">
        <div className="text-center mb-stack-lg">
          <h2 className="font-sans text-[14px] leading-[20px] tracking-[0.3em] font-semibold text-primary uppercase mb-2">
            {t("heading")}
          </h2>
          <a
            href={siteConfig.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-[13px] leading-[16px] tracking-[0.1em] text-secondary hover:text-primary transition-colors hover-underline-anim"
          >
            {t("follow")}
          </a>
        </div>
      </ScrollReveal>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-4">
        {instagramImages.map((img, i) => {
          const delays = ["", "delay-100", "delay-200", "delay-300"] as const;

          return (
            <ScrollReveal key={i} animation="reveal-fade-in" delay={delays[i]}>
              <div className="aspect-square bg-surface-container-low hover-image-zoom relative">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="w-full h-full object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
