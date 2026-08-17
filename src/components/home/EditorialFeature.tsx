import { useTranslations } from "next-intl";
import Image from "next/image";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Link } from "@/i18n/navigation";
import { getAssetPath } from "@/lib/utils/assetPath";

export function EditorialFeature() {
  const t = useTranslations("editorial");

  return (
    <section className="w-full bg-surface-container-low py-12 md:py-stack-xl">
      <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-stack-lg items-center">
        {/* Left Column: Editorial Photo */}
        <ScrollReveal animation="reveal-fade-in" className="w-full">
          <div className="aspect-3/4 w-full overflow-hidden relative bg-surface-container hover-image-zoom">
            <Image
              src={getAssetPath("/about/about.webp")}
              alt="VELÉLS Editorial Focus"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </ScrollReveal>

        {/* Right Column: Narrative content */}
        <ScrollReveal
          animation="reveal-fade-up"
          delay="delay-200"
          className="flex flex-col justify-center max-w-lg pt-4 md:pt-0"
        >
          <p className="text-body-lg text-primary mb-6 md:mb-8 leading-relaxed">
            {t("body")}
          </p>
          <Link
            href="/info/about"
            className="inline-flex items-center gap-3 border-b border-primary pb-2 text-label-md text-primary hover:opacity-70 transition-opacity w-fit cursor-pointer hover-underline-anim"
          >
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
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
