import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Catalog } from "@/components/catalog/Catalog";
import { pageMetadata } from "@/lib/seo/openGraph";
import type { Locale } from "@/i18n/routing";
import {
  CATEGORIES,
  CATEGORY_SLUGS,
  categoryFromSlug,
  categoryPaths,
} from "@/lib/data/categories";

type Props = {
  params: Promise<{ locale: string; category: string }>;
};

/** One page per category, under its slug in this locale's language. */
export function generateStaticParams({ params }: { params: { locale: string } }) {
  return CATEGORIES.map((c) => ({
    category: CATEGORY_SLUGS[c][params.locale as Locale],
  }));
}

/**
 * Its own canonical, title and description, so the category can rank on its
 * own. hreflang pairs the two locales' slugs, which differ.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, category: slug } = await params;
  const category = categoryFromSlug(locale, slug);
  if (!category) return {};
  const t = await getTranslations({ locale, namespace: "categoryPages" });

  return pageMetadata({
    locale,
    path: categoryPaths(category),
    title: t(`${category}.title`),
    description: t(`${category}.description`),
  });
}

export default async function CategoryPage({ params }: Props) {
  const { locale, category: slug } = await params;
  setRequestLocale(locale);

  const category = categoryFromSlug(locale, slug);
  if (!category) notFound();

  return (
    <>
      <Navbar />
      <main className="mt-16 md:mt-14 grow w-full">
        <Catalog category={category} />
      </main>
      <Footer />
    </>
  );
}
