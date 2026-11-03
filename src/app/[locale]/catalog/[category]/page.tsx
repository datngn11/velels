import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Catalog } from "@/components/catalog/Catalog";
import { pageMetadata } from "@/lib/seo/openGraph";
import { breadcrumbJsonLd, collectionPageJsonLd, serialiseJsonLd } from "@/lib/seo/jsonLd";
import { absoluteUrl } from "@/lib/config";
import { products, type ProductCategory } from "@/lib/data/products";
import type { Locale } from "@/i18n/routing";
import {
  CATEGORIES,
  CATEGORY_LABEL_KEY,
  CATEGORY_SLUGS,
  categoryFromSlug,
  categoryPath,
  categoryPaths,
} from "@/lib/data/categories";

type Props = {
  params: Promise<{ locale: string; category: string }>;
};

/**
 * The category's photo: its first Model's cover, for the share card and Google.
 * None for an empty category, which falls back to the site's share image.
 */
function categoryImage(category: ProductCategory): string | undefined {
  const cover = products.find((p) => p.category === category)?.images[0];
  return cover && absoluteUrl(cover.src);
}

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
    image: categoryImage(category),
    imageAlt: t(`${category}.title`),
  });
}

export default async function CategoryPage({ params }: Props) {
  const { locale, category: slug } = await params;
  setRequestLocale(locale);

  const category = categoryFromSlug(locale, slug);
  if (!category) notFound();

  const t = await getTranslations({ locale, namespace: "categoryPages" });
  const tCatalog = await getTranslations({ locale, namespace: "catalog" });
  const tMeta = await getTranslations({ locale, namespace: "meta" });

  // Data only: the logo and the catalogue tabs already show the way back.
  const jsonLd = [
    collectionPageJsonLd(
      locale,
      categoryPath(locale, category),
      t(`${category}.title`),
      categoryImage(category),
    ),
    breadcrumbJsonLd(locale, [
      { name: tMeta("siteName"), path: "" },
      { name: tCatalog("title"), path: "/catalog" },
      { name: tCatalog(CATEGORY_LABEL_KEY[category]), path: categoryPath(locale, category) },
    ]),
  ];

  return (
    <>
      <Navbar />
      <main className="mt-16 md:mt-14 grow w-full">
        <Catalog category={category} />
      </main>
      <Footer />

      {jsonLd.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serialiseJsonLd(schema) }}
        />
      ))}
    </>
  );
}
