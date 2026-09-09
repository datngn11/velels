import type { ReactNode } from "react";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { siteConfig, localeUrl, localeAlternates } from "@/lib/config";
import { notFound } from "next/navigation";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * Site-wide defaults. Two things here are inherited in ways that surprise people:
 *
 * - `title.template` appends " — VELÉLS", so pages must pass a bare title or the
 *   suffix lands twice.
 * - `alternates.canonical` is this locale's homepage. Any page that does not set
 *   its own canonical therefore declares itself to be the homepage, which is what
 *   the catalogue did until `pageMetadata()` was introduced.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    title: {
      default: t("homeTitle"),
      template: `%s ${t("productTitleSuffix")}`,
    },
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
          alt: "VELÉLS — Premium Minimalist Swimwear",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("homeTitle"),
      description: t("homeDescription"),
    },
    alternates: {
      // Self-referencing: the uk homepage is /uk, not the bare origin. Inheriting
      // subpages override this with their own path.
      canonical: localeUrl(locale),
      languages: localeAlternates(),
    },
  };
}

/**
 * The locale gate. Rejects an unrecognised segment with `notFound()`, and is the
 * only place a `NextIntlClientProvider` is mounted — which is why anything rendering
 * `Navbar` or `Footer` from outside this tree has to supply its own.
 */
export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "uk" | "en")) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
