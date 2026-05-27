import { useTranslations } from "next-intl";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Link } from "@/i18n/navigation";

export default function NotFoundPage() {
  const t = useTranslations("notFound");

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow flex flex-col items-center justify-center text-center px-margin-mobile md:px-margin-desktop py-stack-xl mt-[80px]">
        <h1 className="font-serif text-[72px] md:text-[120px] leading-none tracking-[-0.04em] text-primary mb-6 animate-fade-in-up">
          404
        </h1>
        <h2 className="font-serif text-[20px] md:text-[28px] tracking-[0.1em] uppercase text-primary mb-4 animate-fade-in-up delay-100">
          {t("title")}
        </h2>
        <p className="font-sans text-[14px] md:text-[16px] text-secondary max-w-[480px] mb-12 leading-relaxed animate-fade-in-up delay-200">
          {t("subtitle")}
        </p>
        <Link
          href="/"
          className="inline-block bg-primary text-on-primary font-sans text-[12px] leading-[16px] tracking-[0.15em] font-medium uppercase px-8 py-4 animate-fade-in-up delay-300 hover:scale-105 transition-all duration-300"
        >
          {t("cta")}
        </Link>
      </main>
      <Footer />
    </div>
  );
}
