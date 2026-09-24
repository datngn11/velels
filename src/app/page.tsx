import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { siteConfig, localeUrl, localeAlternates } from "@/lib/config";
import { RootRedirect } from "@/components/layout/RootRedirect";

/**
 * `/` is the Instagram bio link, so it needs full metadata even though it only
 * redirects: preview crawlers do not run JavaScript and never follow it. Canonical
 * points at the default locale so the real homepage gets the credit.
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
      images: [
        {
          url: siteConfig.ogImage,
          width: siteConfig.ogImageWidth,
          height: siteConfig.ogImageHeight,
          alt: t("siteName"),
        },
      ],
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

/** Renders nothing on purpose — the value of this route is its metadata, above. */
export default function RootPage() {
  return <RootRedirect />;
}
