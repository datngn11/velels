import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { siteConfig, localeUrl, localeAlternates } from "@/lib/config";
import { RootRedirect } from "@/components/layout/RootRedirect";

/**
 * `/` — the bare domain, and therefore the Instagram bio link and the most-shared
 * URL on the site.
 *
 * It renders nothing and bounces to `/uk`, but it still has to carry full metadata.
 * Link-preview crawlers do not run JavaScript, so they never see the redirect: they
 * read this page's tags and stop. Without them, pasting velels.com into Telegram or
 * a DM produces an empty card — no title, no image — which is what it did before.
 *
 * The canonical points at the default locale so search engines credit the real
 * homepage rather than indexing this stub.
 */
export async function generateMetadata(): Promise<Metadata> {
  const locale = routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    title: t("homeTitle"),
    description: t("homeDescription"),
    metadataBase: new URL(siteConfig.url),
    openGraph: {
      title: t("homeTitle"),
      description: t("homeDescription"),
      url: localeUrl(locale),
      siteName: t("siteName"),
      locale: locale === "uk" ? "uk_UA" : "en_US",
      type: "website",
      images: [{ url: siteConfig.ogImage, alt: t("siteName") }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("homeTitle"),
      description: t("homeDescription"),
      images: [siteConfig.ogImage],
    },
    alternates: {
      canonical: localeUrl(locale),
      // Derived, not hand-written: adding a locale to routing.locales must not
      // leave the most-shared URL on the site advertising the old set.
      languages: localeAlternates(),
    },
  };
}

/**
 * Renders nothing on purpose. The value of this route is its metadata, above; the
 * redirect is a client component so this one can stay a server component.
 */
export default function RootPage() {
  return <RootRedirect />;
}
