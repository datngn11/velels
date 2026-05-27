import { useTranslations } from "next-intl";
import Image from "next/image";

export function HeroSection() {
  const t = useTranslations("hero");

  return (
    <section className="w-full h-[90vh] min-h-[600px] relative overflow-hidden flex items-center justify-center">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/20 z-10" />

      {/* Hero image */}
      <Image
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAp4XkLdYE2wwmWSlIqGIEEPxHQxxetZ80Dm7DwmKO9Rg4-3G-qLchhosxt-6ZJg_K2-tpUnpe3OGaUD8pf4XUruHJtOQAR-lD0DeJu3CmNyI9cfQcysHOcJR7r9gbogbZxsF-Gn-WE1WDNR40UrnAIB0VoNBKsaiNIpZB6ZZtfYdse_7d8Htmw4_01s3QQLVi-c0yZ_GlZPTQT4ei9uw0wLQwAhOW5rLgh5YBl4EtPqsxR3OsHsGyz8UhTqQGXpDy2mSm-hIidEK0"
        alt="VELÉLS editorial hero — model in luxury swimwear on sun-drenched beach"
        fill
        className="object-cover animate-hero-zoom hero-parallax-img"
        priority
        sizes="100vw"
      />

      {/* Content */}
      <div className="relative z-20 text-center px-margin-mobile md:px-margin-desktop flex flex-col items-center gap-stack-sm max-w-3xl">
        <h1 className="font-serif text-[40px] md:text-[80px] leading-[48px] md:leading-[90px] tracking-[-0.02em] text-on-primary animate-fade-in-up">
          {t("title")}
        </h1>
        <p className="font-sans text-[18px] leading-[28px] text-on-primary/90 max-w-xl mb-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          {t("subtitle")}
        </p>
        <a
          href="#collection"
          className="inline-block bg-primary text-on-primary font-sans text-[12px] leading-[16px] tracking-[0.15em] font-medium uppercase px-8 py-4 opacity-0 animate-fade-in-up hover:scale-105 transition-all duration-300" style={{ animationDelay: '400ms' }}
        >
          {t("cta")}
        </a>
      </div>
    </section>
  );
}
