import type { Metadata } from "next";
import Link from "next/link";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { StatusPage } from "@/components/layout/StatusPage";

/**
 * Becomes `out/404.html`, the only 404 the deployed site has — Cloudflare serves it
 * for `/en/mistyped` too, so it is always default-locale. Tracked in lite L3.
 */

/** Without this `out/404.html` has no `<title>` and the tab shows the raw URL. */
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations({
    locale: routing.defaultLocale,
    namespace: "notFound",
  });
  return { title: `${t("title")} — VELÉLS` };
}

/**
 * Needs `setRequestLocale` (or `getTranslations` reaches for `headers()`, which a
 * static export cannot do) and its own provider, since `StatusPage` pulls in
 * `Navbar`/`Footer` and only `[locale]/layout.tsx` mounts one.
 */
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
