"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";

export function HeroSection() {
  const t = useTranslations("hero");

  return (
    <section className="w-full h-[85vh] md:h-[90vh] min-h-[600px] relative overflow-hidden flex items-center justify-center">
      {/* Editorial subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent z-10" />

      {/* Hero image */}
      <Image
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCppzZuA1MLqHIxvQr280wkEvwlIenlxKEtn1T5qFyxrJbXw6cvfiiy1tF_dS6_2AKj_8o-1aCkT5ceisb8VsJsjUwYaaeASR0rb7Glfp511DNgfTWaOHqnu3ddShvkugL9fHfSQakAN4k7IVIh0xvtYB7zNMIFmp-hpcsaNP7ggTcENl3ShtCgxE2jUa_DTWAWB86s7kKsj5nRT05b0K0SIqjgZlekVcdOL2PMsKNX_vwXUqm7LwkqpYkCe_MIQeNxgJS6x820elw"
        alt="VELÉLS editorial hero — model in luxury swimwear on sun-drenched beach"
        fill
        className="object-cover object-center grayscale-[20%] animate-hero-zoom hero-parallax-img"
        priority
        sizes="100vw"
      />

      {/* Content positioned towards the bottom as in new designs */}
      <div className="relative z-20 text-center px-margin-mobile md:px-margin-desktop flex flex-col items-center justify-end h-full pb-stack-xl max-w-3xl">
        <h1 className="font-serif text-[40px] md:text-[80px] leading-[48px] md:leading-[90px] tracking-[-0.02em] text-on-primary animate-fade-in-up mb-stack-sm">
          {t("title")}
        </h1>
        <p className="font-sans text-[18px] leading-[28px] text-on-primary/90 max-w-xl mb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          {t("subtitle")}
        </p>
        <button
          onClick={() => document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" })}
          className="inline-block bg-on-primary text-primary font-sans text-[12px] leading-[16px] tracking-[0.15em] font-medium uppercase px-10 py-5 opacity-0 animate-fade-in-up hover:opacity-90 transition-opacity rounded-none cursor-pointer" style={{ animationDelay: '400ms' }}
        >
          {t("cta")}
        </button>
      </div>
    </section>
  );
}
