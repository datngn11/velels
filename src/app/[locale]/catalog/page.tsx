import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CatalogClient } from "@/components/catalog/CatalogClient";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/openGraph";

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * Goes through `pageMetadata()` so the page keeps its own canonical rather than
 * inheriting the homepage's, and keeps the share image rather than dropping it —
 * Next replaces the parent `openGraph` wholesale instead of merging into it.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "catalog" });

  return pageMetadata({
    locale,
    path: "/catalog",
    title: t("title"),
    description: t("metaDescription"),
  });
}

export default async function CatalogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Navbar />
      <main className="mt-16 md:mt-14 grow w-full">
        <CatalogClient />
      </main>
      <Footer />
    </>
  );
}
