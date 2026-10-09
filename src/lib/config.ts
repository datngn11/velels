/** Public brand constants and URL helpers. */

// Set NEXT_PUBLIC_SITE_URL per environment; the default is production so a build
// without it still emits correct absolute URLs.
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://velels.com").replace(
  /\/+$/,
  "",
);

export const siteConfig = {
  url: siteUrl,
  email: "velelswim@gmail.com",
  social: {
    instagram: "https://www.instagram.com/velelswim",
    instagramDm: "https://ig.me/m/velelswim",
  },
  /** Share-preview image. Keep `ogImageWidth`/`Height` matching the actual file. */
  ogImage: `${siteUrl}/og/home.jpg`,
  ogImageWidth: 1431,
  ogImageHeight: 858,
};

/**
 * Absolute URL for `path`. For anything a crawler reads — canonicals, `og:url`,
 * JSON-LD — use `localeUrl()` instead; an unprefixed path is a 404.
 */
export function absoluteUrl(path = "/"): string {
  if (path === "/" || path === "") return siteUrl;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Absolute URL for `path` within `locale`. `localePrefix` is "always", so every
 * route carries its locale and there is nothing at `/product/dimaya`.
 */
export function localeUrl(locale: string, path = ""): string {
  const suffix = !path || path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}/${locale}${suffix}`;
}

/** A page's locale-relative path, or one per locale where the slug is translated. */
export type LocalePath = string | Record<"uk" | "en", string>;

/**
 * `alternates.languages` for a path that exists in both locales. `x-default` points
 * at Ukrainian: it is the default locale, and `/` is only a client-side redirect
 * stub, which is a poor thing to hand a crawler.
 */
export function localeAlternates(path: LocalePath = ""): Record<string, string> {
  const suffix = (p: string) => (!p || p === "/" ? "" : p.startsWith("/") ? p : `/${p}`);
  const uk = suffix(typeof path === "string" ? path : path.uk);
  const en = suffix(typeof path === "string" ? path : path.en);
  return {
    uk: `/uk${uk}`,
    en: `/en${en}`,
    "x-default": `/uk${uk}`,
  };
}
