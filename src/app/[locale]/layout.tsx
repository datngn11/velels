import type { ReactNode } from "react";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

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
    metadataBase: new URL("https://velels.com"),
    openGraph: {
      title: t("homeTitle"),
      description: t("homeDescription"),
      url: "https://velels.com",
      siteName: t("siteName"),
      locale: locale === "uk" ? "uk_UA" : "en_US",
      type: "website",
      images: [
        {
          url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAp4XkLdYE2wwmWSlIqGIEEPxHQxxetZ80Dm7DwmKO9Rg4-3G-qLchhosxt-6ZJg_K2-tpUnpe3OGaUD8pf4XUruHJtOQAR-lD0DeJu3CmNyI9cfQcysHOcJR7r9gbogbZxsF-Gn-WE1WDNR40UrnAIB0VoNBKsaiNIpZB6ZZtfYdse_7d8Htmw4_01s3QQLVi-c0yZ_GlZPTQT4ei9uw0wLQwAhOW5rLgh5YBl4EtPqsxR3OsHsGyz8UhTqQGXpDy2mSm-hIidEK0",
          width: 1200,
          height: 630,
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
      canonical: "https://velels.com",
      languages: {
        uk: "/",
        en: "/en",
      },
    },
    robots: { index: true, follow: true },
  };
}

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
