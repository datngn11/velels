"use client";

import { Fragment } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

type Locale = (typeof routing.locales)[number];

/**
 * Each language named in itself, never translated. Someone who cannot read the
 * locale she landed on still has to be able to find her own.
 */
const LOCALE_LABELS: Record<Locale, string> = {
  uk: "Українська",
  en: "English",
};

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex items-center gap-4">
      {routing.locales.map((code, index) => (
        <Fragment key={code}>
          {index > 0 && (
            <span className="text-outline-variant/30 text-label-xs">|</span>
          )}
          <button
            onClick={() => router.replace(pathname, { locale: code })}
            aria-current={locale === code ? "true" : undefined}
            className={`text-label-sm tracking-[0.1em] transition-all duration-300 pb-1 ${
              locale === code
                ? "text-primary border-b border-primary"
                : "text-secondary hover:text-primary hover-underline-anim"
            }`}
          >
            {LOCALE_LABELS[code]}
          </button>
        </Fragment>
      ))}
    </div>
  );
}
