import { siteConfig, localeUrl, absoluteUrl } from "@/lib/config";
import { routing } from "@/i18n/routing";

/**
 * Structured data builders. Two rules: every `url` goes through `localeUrl()`, and
 * nothing claims a capability the site lacks — no `SearchAction`, no availability
 * beyond `MadeToOrder`.
 */

const BCP47: Record<string, string> = { uk: "uk-UA", en: "en-US" };

/** Language tag for `locale`, falling back to the locale itself. */
export function languageTag(locale: string): string {
  return BCP47[locale] ?? locale;
}

/** The brand as an entity. Emitted once, on the homepage. */
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

/** The site as distinct from the brand. No `SearchAction` — there is no search. */
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
 * Use instead of `JSON.stringify` for anything going into a `<script>`: it does not
 * escape `<`, and these values come from owner-editable message files.
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
