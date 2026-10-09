import { routing, type Locale } from "@/i18n/routing";

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

/** A page's locale-relative path, or one per locale where the slug is translated. */
export type LocalePath = string | Record<Locale, string>;

/** `path` within `locale`, e.g. "/uk/catalog". */
function localePath(locale: string, path: LocalePath = ""): string {
  const p = typeof path === "string" ? path : path[locale as Locale];
  return `/${locale}${!p || p === "/" ? "" : p.startsWith("/") ? p : `/${p}`}`;
}

/**
 * Absolute URL for `path` within `locale`. `localePrefix` is "always", so every
 * route carries its locale and there is nothing at `/product/dimaya`.
 */
export function localeUrl(locale: string, path: LocalePath = ""): string {
  return `${siteUrl}${localePath(locale, path)}`;
}

/**
 * `alternates.languages` for a path that exists in every locale. `x-default` points
 * at the default locale: `/` is only a client-side redirect stub, which is a poor
 * thing to hand a crawler.
 */
export function localeAlternates(path: LocalePath = ""): Record<string, string> {
  return {
    ...Object.fromEntries(routing.locales.map((l) => [l, localePath(l, path)])),
    "x-default": localePath(routing.defaultLocale, path),
  };
}
