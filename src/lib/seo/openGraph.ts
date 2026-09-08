import type { Metadata } from "next";
import { siteConfig, localeUrl, localeAlternates } from "@/lib/config";

const SITE_NAME = "VELÉLS";

/**
 * Builds `title`, `openGraph`, `twitter` and `alternates` for one page. Use it
 * rather than writing them inline — Next replaces the parent's `openGraph` and
 * `twitter` objects wholesale instead of merging, so a page that sets a title and
 * omits `images` ships a card with no picture.
 *
 * Pass `title` bare: the layout's template already appends " — VELÉLS".
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
