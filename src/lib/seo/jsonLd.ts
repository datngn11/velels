import { siteConfig, localeUrl, absoluteUrl } from "@/lib/config";
import { routing } from "@/i18n/routing";
import type { ProductCategory } from "@/lib/data/products";

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
    email: siteConfig.email,
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

/**
 * Return policy for an Offer. The two categories differ in law, not in
 * generosity, so they cannot share one policy.
 *
 * Swimwear is underwear under Cabinet Resolution 172 of 19 March 1994 and
 * cannot be returned at all. The one-time size exchange the brand offers
 * anyway is goodwill, not a return, and there is no schema for it — modelling
 * it as a return window would tell Google customers have a right they do not.
 *
 * Dresses are ordinary apparel: 14 days under the consumer protection law,
 * with the buyer paying the shipping, which is what the returns page says.
 */
export function returnPolicyJsonLd(category: ProductCategory) {
  if (category !== "dresses") {
    return {
      "@type": "MerchantReturnPolicy",
      applicableCountry: "UA",
      returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
    };
  }

  return {
    "@type": "MerchantReturnPolicy",
    applicableCountry: "UA",
    returnPolicyCategory:
      "https://schema.org/MerchantReturnFiniteReturnWindow",
    merchantReturnDays: 14,
    returnMethod: "https://schema.org/ReturnByMail",
    returnFees: "https://schema.org/ReturnFeesCustomerResponsibleForShipping",
  };
}

/**
 * Shipping for an Offer, Ukraine only.
 *
 * Handling is 3 to 5 working days: 2 to 4 to sew it, then dispatch the next
 * working day. Transit is Nova Poshta's own 1 to 3.
 *
 * No `shippingRate`, deliberately. Nova Poshta charges by weight and branch and
 * the customer pays the carrier, so there is no figure to state. A zero would
 * read as free shipping. Google may keep asking for the rate; an honest gap is
 * better than an invented number, which is the same reason `availability` stays
 * `MadeToOrder`.
 *
 * International is omitted for the same reason: the delivery page says it is
 * quoted per destination.
 */
export function shippingDetailsJsonLd() {
  return {
    "@type": "OfferShippingDetails",
    shippingDestination: {
      "@type": "DefinedRegion",
      addressCountry: "UA",
    },
    deliveryTime: {
      "@type": "ShippingDeliveryTime",
      handlingTime: {
        "@type": "QuantitativeValue",
        minValue: 3,
        maxValue: 5,
        unitCode: "DAY",
      },
      transitTime: {
        "@type": "QuantitativeValue",
        minValue: 1,
        maxValue: 3,
        unitCode: "DAY",
      },
    },
  };
}
