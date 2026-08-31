import { siteConfig, localeUrl, absoluteUrl } from "@/lib/config";
import { routing } from "@/i18n/routing";

/**
 * Builders for the structured data the site publishes.
 *
 * Two rules apply to everything here. Every `url` goes through `localeUrl()`,
 * because routes are locale-prefixed and an unprefixed URL is a 404. And nothing
 * claims a capability the site does not have — no `SearchAction`, because there is
 * no site search, and no `availability` beyond `MadeToOrder`, because nothing is
 * stocked.
 */

const BCP47: Record<string, string> = { uk: "uk-UA", en: "en-US" };

/** Language tag for `locale`, falling back to the locale itself. */
export function languageTag(locale: string): string {
  return BCP47[locale] ?? locale;
}

/**
 * The brand as an entity. Emitted once, on the homepage — repeating it on every
 * page adds bytes without adding information.
 */
export function organizationJsonLd(name: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    // The default-locale homepage, not the current one. This markup renders on
    // both homepages, and a per-locale url would describe two organisations
    // instead of one.
    url: localeUrl(routing.defaultLocale),
    logo: absoluteUrl("/logo_black.png"),
    sameAs: [siteConfig.social.instagram],
  };
}

/**
 * The site as a thing distinct from the brand. No `potentialAction`: a
 * `SearchAction` here would advertise a search endpoint that does not exist.
 */
export function webSiteJsonLd(locale: string, name: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    // Per-locale, matching this page's canonical. Unlike Organization — one brand,
    // one url — a fixed url here combined with a per-locale `inLanguage` would
    // assert that a single resource is both uk-UA and en-US.
    url: localeUrl(locale),
    inLanguage: languageTag(locale),
    publisher: { "@type": "Organization", name },
  };
}

/**
 * Serialises a schema for embedding in a <script> tag.
 *
 * `JSON.stringify` does not escape `<`, so a string containing `</script` would
 * close the element early and dump the rest as markup. Every value here comes from
 * `src/messages/*.json` or `products.ts`, both owner-editable, so this is a real
 * path rather than a theoretical one.
 */
export function serialiseJsonLd(schema: unknown): string {
  return JSON.stringify(schema).replace(/</g, "\\u003c");
}

/**
 * Breadcrumb trail. `crumbs` is ordered root-first; each path is locale-relative,
 * so pass "" for the homepage.
 */
export function breadcrumbJsonLd(
  locale: string,
  crumbs: Array<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: localeUrl(locale, crumb.path),
    })),
  };
}
