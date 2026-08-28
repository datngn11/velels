import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getAllProductSlugs } from "@/lib/data/products";
import { localeUrl } from "@/lib/config";
import { shouldAllowIndexing } from "@/lib/seo/indexing";

/**
 * Static sitemap, emitted as `out/sitemap.xml` by `output: "export"`.
 *
 * Every path is locale-prefixed, matching `localePrefix: "always"`. Each entry
 * carries `alternates.languages` so the two locales are declared as translations of
 * one another rather than as competing pages.
 *
 * Returns nothing when indexing is off, so a preview build cannot publish a sitemap
 * inviting crawlers to pages whose own meta tags say `noindex`.
 */

// Kept in step with INFO_SLUGS in src/app/[locale]/info/[slug]/page.tsx.
const INFO_SLUGS = [
  "delivery",
  "returns",
  "faq",
  "payment",
  "care",
  "about",
  "privacy",
  "terms",
  "contact",
] as const;

// Required under `output: "export"` — see the note in robots.ts.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!shouldAllowIndexing()) return [];

  const productSlugs = getAllProductSlugs();

  // Ordered by how much each page is worth to a catalogue arriving from Instagram:
  // products first, then the ways in, then the legal and support pages.
  const paths: Array<{ path: string; priority: number }> = [
    { path: "", priority: 1 },
    { path: "/catalog", priority: 0.9 },
    ...productSlugs.map((slug) => ({ path: `/product/${slug}`, priority: 0.8 })),
    ...INFO_SLUGS.map((slug) => ({ path: `/info/${slug}`, priority: 0.4 })),
  ];

  return routing.locales.flatMap((locale) =>
    paths.map(({ path, priority }) => ({
      url: localeUrl(locale, path),
      changeFrequency: "monthly" as const,
      priority,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((alt) => [alt, localeUrl(alt, path)]),
        ),
      },
    })),
  );
}
