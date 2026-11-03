import { siteConfig, localeUrl, absoluteUrl, type LocalePath } from "@/lib/config";
import type { ProductCategory } from "@/lib/data/products";

/**
 * Structured data builders. Two rules: every `url` goes through `localeUrl()`, and
 * nothing claims a capability the site lacks — no `SearchAction`, no availability
 * beyond `MadeToOrder`.
 */

/**
 * The domain root. Google's site name wants `url` at "the domain or subdomain
 * level root URI". `/` itself is a 302 to `/uk`, so Google reads this data on
 * the redirect target.
 */
const SITE_ROOT = `${siteConfig.url}/`;

/** The brand as an entity. Emitted on both homepages, identically. */
export function organizationJsonLd(name: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url: SITE_ROOT,
    logo: absoluteUrl("/logo_black.png"),
    email: siteConfig.email,
    sameAs: [siteConfig.social.instagram],
  };
}

/**
 * The site as distinct from the brand. No `SearchAction` — there is no search.
 * Identical on both homepages, as Google asks of duplicate home pages, so no
 * `inLanguage`: one url cannot be both uk-UA and en-US.
 */
export function webSiteJsonLd(name: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    // The spelling people type, without the accent.
    alternateName: "Velels",
    url: SITE_ROOT,
    publisher: { "@type": "Organization", name },
  };
}

/**
 * A category page and its photo, so Google has an image for the result. No list
 * of products: `Product` entries without offers would put an error on every
 * category page in the Product snippets report.
 */
export function collectionPageJsonLd(
  locale: string,
  path: LocalePath,
  name: string,
  image?: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    url: localeUrl(locale, path),
    ...(image && { primaryImageOfPage: { "@type": "ImageObject", url: image } }),
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
