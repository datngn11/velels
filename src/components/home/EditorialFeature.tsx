import { useTranslations } from "next-intl";
import Image from "next/image";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function EditorialFeature() {
  const t = useTranslations("editorial");

  return (
    <section className="w-full bg-surface-container-low py-12 md:py-stack-xl">
      <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-stack-lg items-center">
        {/* Left Column: Image with mixed-blend title */}
        <ScrollReveal animation="reveal-fade-in" className="w-full">
          <div className="aspect-[3/4] w-full overflow-hidden relative bg-surface-container hover-image-zoom">
            <Image
              alt="Editorial Swimwear Focus"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQ9o0cTt8K6FqlDkXDI_ji-NSgT2bDeOl2mvOukQHh-hhJ7RoAubfal5-tI2erJMIW-bHrMHJcque1e7msi131VwkmkVhMW8_b9oJ3g89_Ksax4g2YlDiq5kMwLu1-4gc5FjwLbDisYeGiZzGcYUN4-BUZHrZQu0uGNqGuBccVxFHpzl_uFnEHCIeeydrcNebbmt4Y68PrSqlDkPKL_VaFCcHDfSgqUDZPSsJ_GzBtCQ5EB21zO1m0pENFCkf8wFLJfY_14yOLhE4"
              fill
              className="object-cover grayscale"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div
              className="absolute bottom-4 left-4 md:bottom-12 md:left-12 text-display-lg text-on-primary mix-blend-difference text-left"
              dangerouslySetInnerHTML={{ __html: t("title") }}
            />
          </div>
        </ScrollReveal>

        {/* Right Column: Narrative content */}
        <ScrollReveal animation="reveal-fade-up" delay="delay-200" className="flex flex-col justify-center max-w-lg pt-4 md:pt-0">
          <p className="text-body-lg text-primary mb-6 md:mb-8 leading-relaxed">
            {t("body")}
          </p>
          <span className="inline-flex items-center gap-3 border-b border-primary pb-2 text-label-md text-primary hover:opacity-70 transition-opacity w-fit cursor-pointer hover-underline-anim">
            {t("cta")}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="font-light inline-block"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        </ScrollReveal>
      </div>
    </section>
  );
}
