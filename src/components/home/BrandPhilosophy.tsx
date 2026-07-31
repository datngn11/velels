import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Link } from "@/i18n/navigation";

export function BrandPhilosophy() {
  const t = useTranslations("philosophy");

  return (
    <section className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-stack-xl flex flex-col items-center justify-center text-center">
      <ScrollReveal animation="reveal-fade-up">
        {/* Top decorative line */}
        <div className="w-px h-[80px] bg-outline-variant mb-stack-md mx-auto" />

        <h2 className="text-display-md text-primary mb-stack-sm max-w-2xl">
          {t("title")}
        </h2>

        <p className="text-body-lg text-secondary max-w-xl mx-auto mb-stack-md">
          {t("body")}
        </p>

        <Link
          href="/info/about"
          className="inline-block border border-primary text-primary text-label-md px-8 py-4 hover:bg-primary hover:text-on-primary hover:scale-105 transition-all duration-300 cursor-pointer"
        >
          {t("cta")}
        </Link>

        {/* Bottom decorative line */}
        <div className="w-px h-[80px] bg-outline-variant mt-stack-md mx-auto" />
      </ScrollReveal>
    </section>
  );
}
