"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Link } from "@/i18n/navigation";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: Props) {
  const t = useTranslations("error");

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Runtime error caught by boundary:", error);
  }, [error]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow flex flex-col items-center justify-center text-center px-margin-mobile md:px-margin-desktop py-stack-xl mt-[80px]">
        <h1 className="font-serif text-[48px] md:text-[80px] leading-none tracking-[-0.02em] text-primary mb-6 animate-fade-in-up">
          {t("title")}
        </h1>
        <p className="font-sans text-[14px] md:text-[16px] text-secondary max-w-[480px] mb-12 leading-relaxed animate-fade-in-up delay-100">
          {t("subtitle")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-200">
          <button
            onClick={() => reset()}
            className="inline-block bg-primary text-on-primary font-sans text-[12px] leading-[16px] tracking-[0.15em] font-medium uppercase px-8 py-4 hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            {t("retry")}
          </button>
          <Link
            href="/"
            className="inline-block border border-outline text-primary font-sans text-[12px] leading-[16px] tracking-[0.15em] font-medium uppercase px-8 py-4 hover:scale-105 transition-all duration-300"
          >
            {t("cta")}
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
