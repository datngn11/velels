"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (newLocale: "uk" | "en") => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex items-center gap-1 font-sans text-[12px] tracking-[0.15em] uppercase">
      <button
        onClick={() => switchLocale("uk")}
        className={`transition-colors duration-200 px-1 ${
          locale === "uk"
            ? "text-primary font-medium"
            : "text-secondary hover:text-primary"
        }`}
        aria-label="Українська"
      >
        UK
      </button>
      <span className="text-outline-variant">|</span>
      <button
        onClick={() => switchLocale("en")}
        className={`transition-colors duration-200 px-1 ${
          locale === "en"
            ? "text-primary font-medium"
            : "text-secondary hover:text-primary"
        }`}
        aria-label="English"
      >
        EN
      </button>
    </div>
  );
}
