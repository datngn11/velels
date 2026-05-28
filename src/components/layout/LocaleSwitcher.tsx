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
    <div className="flex items-center gap-4">
      <button
        onClick={() => switchLocale("uk")}
        className={`text-label-sm tracking-[0.1em] transition-all duration-300 pb-1 ${
          locale === "uk"
            ? "text-primary border-b border-primary"
            : "text-secondary hover:text-primary hover-underline-anim"
        }`}
        aria-label="Switch to Ukrainian"
      >
        Українська
      </button>
      <span className="text-outline-variant/30 text-label-xs">|</span>

      <button
        onClick={() => switchLocale("en")}
        className={`text-label-sm tracking-[0.1em] transition-all duration-300 pb-1 ${
          locale === "en"
            ? "text-primary border-b border-primary"
            : "text-secondary hover:text-primary hover-underline-anim"
        }`}
        aria-label="Switch to English"
      >
        English
      </button>
    </div>
  );
}
