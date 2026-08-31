import type { Metadata } from "next";
import Link from "next/link";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { StatusPage } from "@/components/layout/StatusPage";

/**
 * The 404 for paths that never matched a locale — this is what `output: "export"`
 * writes to `out/404.html`, and therefore what Cloudflare serves for every stray
 * URL under `not_found_handling: "404-page"`. Without it the export emits Next's
 * unstyled built-in "This page could not be found." instead.
 *
 * **This is the only 404 the deployed site has.** A static export emits one
 * `out/404.html` and no per-locale variant, so Cloudflare serves this file for
 * `/en/mistyped` as well as `/mistyped` — meaning an English visitor arriving from
 * a bad link gets a Ukrainian page. `[locale]/not-found.tsx` only ever renders for
 * a not-found triggered during client-side navigation, never on a direct hit.
 * Fixing that properly needs the locale read from the path at runtime; it is
 * tracked in lite L3.
 *
 * Two things this file has to do that the locale version gets for free:
 *
 * - `setRequestLocale`, or `getTranslations` falls back to `headers()` and a static
 *   export cannot render it at all.
 * - its own `NextIntlClientProvider`. Only `[locale]/layout.tsx` mounts one, and
 *   `StatusPage` pulls in `Navbar` and `Footer`, which are client components calling
 *   `useTranslations`. Without a provider here the page throws at prerender.
 */
/**
 * Without this the emitted `out/404.html` has no `<title>` at all and the browser
 * tab shows the raw URL. `noindex` is already inherited from the root layout.
 */
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations({
    locale: routing.defaultLocale,
    namespace: "notFound",
  });
  return { title: `${t("title")} — VELÉLS` };
}

export default async function RootNotFound() {
  const locale = routing.defaultLocale;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "notFound" });
  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <StatusPage
        code="404"
        title={t("title")}
        subtitle={t("subtitle")}
        actions={
          <Link
            href={`/${locale}`}
            className="inline-block bg-primary text-on-primary text-label-md px-8 py-4 animate-fade-in-up delay-300 hover:scale-105 transition-all duration-300"
          >
            {t("cta")}
          </Link>
        }
      />
    </NextIntlClientProvider>
  );
}
