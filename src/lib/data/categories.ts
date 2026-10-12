import type { Locale } from "@/i18n/routing";
import type { ProductCategory } from "./products";

/**
 * Category page slugs, in each locale's own language and transliterated, as
 * Google advises. A changed slug breaks shared links and restarts its ranking.
 * Kept apart from the product list, which the navbar must not pull into every
 * page's JavaScript.
 */
export const CATEGORY_SLUGS: Record<ProductCategory, Record<Locale, string>> = {
  "one-piece": { uk: "sutsilni-kupalnyky", en: "one-piece-swimsuits" },
  "two-piece": { uk: "rozdilni-kupalnyky", en: "bikinis" },
  dresses: { uk: "kurortni-sukni", en: "resort-dresses" },
};

export const CATEGORIES = Object.keys(CATEGORY_SLUGS) as ProductCategory[];

/** Locale-relative, e.g. "/catalog/kurortni-sukni". */
export function categoryPath(locale: string, category: ProductCategory): string {
  return `/catalog/${CATEGORY_SLUGS[category][locale as Locale]}`;
}

export function categoryFromSlug(locale: string, slug: string): ProductCategory | undefined {
  return CATEGORIES.find((c) => CATEGORY_SLUGS[c][locale as Locale] === slug);
}

/** The same page in locale `to`: a category slug is translated, other paths are shared. */
export function pathInLocale(pathname: string, from: string, to: string): string {
  const category = categoryFromSlug(from, pathname.replace(/^\/catalog\//, ""));
  return category ? categoryPath(to, category) : pathname;
}

/** The category's path in every locale, for hreflang and the sitemap. */
export function categoryPaths(category: ProductCategory): Record<Locale, string> {
  const slugs = CATEGORY_SLUGS[category];
  return Object.fromEntries(
    Object.entries(slugs).map(([locale, slug]) => [locale, `/catalog/${slug}`]),
  ) as Record<Locale, string>;
}
