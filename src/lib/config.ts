/**
 * Global application configuration.
 * Using a centralized TS constant file is the best practice for public brand assets
 * (like social links) that remain consistent across environments.
 */

// Public origin of the site. Set NEXT_PUBLIC_SITE_URL per environment; the default
// is the production domain so a build without the variable still emits correct
// absolute URLs. Changing the domain is a one-line change here or in .env.
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://velels.com").replace(
  /\/+$/,
  "",
);

export const siteConfig = {
  url: siteUrl,
  /** Host without the protocol, for copy that reads as a signature ("via velels.com"). */
  host: siteUrl.replace(/^https?:\/\//, ""),
  social: {
    instagram: "https://www.instagram.com/velelswim",
    instagramDm: "https://ig.me/m/velelswim",
  },
};

/**
 * Absolute URL for `path`, for metadata and JSON-LD that cannot use relative values.
 * Everything else should stay relative and let `metadataBase` resolve it.
 *
 * For anything a search engine reads — canonicals, `og:url`, JSON-LD — use
 * `localeUrl()` instead. Routes are locale-prefixed, so an unprefixed path is a
 * URL that does not exist.
 */
export function absoluteUrl(path = "/"): string {
  if (path === "/" || path === "") return siteUrl;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Absolute URL for `path` within `locale`, e.g. localeUrl("uk", "/product/dimaya").
 *
 * `localePrefix` defaults to "always" in `src/i18n/routing.ts`, so *every* route
 * carries its locale — the export emits `/uk/product/dimaya` and
 * `/en/product/dimaya` and nothing at `/product/dimaya`. Omitting the segment
 * produces a 404, which is how every canonical and every `offers.url` on the site
 * came to point at a page that does not exist.
 */
export function localeUrl(locale: string, path = ""): string {
  const suffix = !path || path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}/${locale}${suffix}`;
}

/**
 * `alternates.languages` for a path that exists in both locales. `x-default` points
 * at Ukrainian: it is the default locale, and `/` is only a client-side redirect
 * stub, which is a poor thing to hand a crawler.
 */
export function localeAlternates(path = ""): Record<string, string> {
  const suffix = !path || path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return {
    uk: `/uk${suffix}`,
    en: `/en${suffix}`,
    "x-default": `/uk${suffix}`,
  };
}
