import type { Metadata } from "next";
import { siteConfig, localeUrl, localeAlternates } from "@/lib/config";

const SITE_NAME = "VELÉLS";

/**
 * Builds the `title`, `openGraph`, `twitter` and `alternates` blocks for one page.
 *
 * Exists because two traps in Next's metadata handling had both been walked into:
 *
 * 1. **Merging is shallow.** A page that declares any `openGraph` field replaces the
 *    parent's entire `openGraph` object rather than merging into it. A page that
 *    sets a title but forgets `images` therefore ships a share card with no picture.
 *    The same applies to `twitter`, so a page that sets `openGraph` but not
 *    `twitter` advertises the layout's title on Twitter and its own everywhere
 *    else. Both were live on the catalogue and the nine info pages.
 *
 * 2. **The title template already appends the suffix.** `[locale]/layout.tsx` sets
 *    `template: "%s — VELÉLS"`, so a page passing "Dimaya — VELÉLS" rendered
 *    `<title>Dimaya — VELÉLS — VELÉLS</title>`. Pass `title` bare; this helper adds
 *    the suffix to the OG and Twitter titles, which do not go through the template,
 *    and leaves the page title for Next to complete.
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  image,
  imageAlt,
}: {
  locale: string;
  /** Locale-relative, e.g. "/catalog". Pass "" for a homepage. */
  path: string;
  /** Bare, with no " — VELÉLS" suffix. */
  title: string;
  description: string;
  /** Defaults to the site-wide share image. */
  image?: string;
  imageAlt?: string;
}): Metadata {
  const url = localeUrl(locale, path);
  const socialTitle = `${title} — ${SITE_NAME}`;

  return {
    title,
    description,
    openGraph: {
      title: socialTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: locale === "uk" ? "uk_UA" : "en_US",
      type: "website",
      images: [{ url: image ?? siteConfig.ogImage, alt: imageAlt ?? socialTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [image ?? siteConfig.ogImage],
    },
    alternates: {
      canonical: url,
      languages: localeAlternates(path),
    },
  };
}
