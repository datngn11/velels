import type { Product } from "@/lib/data/products";

export interface PriceView {
  /** True only when a sale price is set, below `price`, and not past its end date. */
  onSale: boolean;
  /** The price to show and charge. */
  current: number;
  /** The struck-through original, present only when `onSale`. */
  original: number | null;
  /** `saleEndsAt` when on sale, for JSON-LD `priceValidUntil`. */
  validUntil: string | null;
}

/**
 * The timezone whose calendar decides when a sale day starts and ends.
 *
 * `saleEndsAt` is a bare `YYYY-MM-DD` with no offset, so something has to define
 * which midnight it means. The business, its customers and its seamstress are all in
 * Ukraine, so the storefront calendar is Kyiv's — not the server's, and not UTC,
 * which would keep a sale alive for three hours after Kyiv midnight.
 */
const STOREFRONT_TIMEZONE = "Europe/Kyiv";

/** Today's date in the storefront calendar, as `YYYY-MM-DD`. */
export function storefrontDate(at: Date = new Date()): string {
  // en-CA formats as YYYY-MM-DD, which sorts and compares as a string.
  return at.toLocaleDateString("en-CA", { timeZone: STOREFRONT_TIMEZONE });
}

/**
 * The date the build was produced, in the storefront calendar.
 *
 * `next.config.ts` computes this once and Next inlines it into both the server and
 * client bundles, so every caller compares against the same day. That is what makes
 * the sale state a property of the build rather than of whoever is looking and when.
 *
 * The fallback only applies outside a Next build — a unit test, say — where there is
 * no inlined value to read.
 */
const BUILD_DATE = process.env.NEXT_PUBLIC_BUILD_DATE || storefrontDate();

/**
 * Resolves what a product actually costs.
 *
 * One place decides this so the page, the catalogue cards and the structured data
 * can never disagree — a visitor seeing one number while Google is told another is
 * the failure worth designing against.
 *
 * **`today` defaults to the build date, not the current date, and that is
 * load-bearing.** `<Price>` renders inside client components, so a `new Date()`
 * default would be evaluated again in the browser: for every day between
 * `saleEndsAt` and the next rebuild, the prerendered HTML would show the sale,
 * hydration would silently remove it, and the JSON-LD — computed at build — would
 * still advertise the reduced price. Pinning to the build date makes the whole page
 * agree with itself and with the structured data.
 *
 * The consequence, and it is deliberate: **a sale ends on the next build, not on the
 * day itself.** Either rebuild when a sale lapses or add a Cloudflare Cron Trigger.
 */
export function priceView(
  product: Pick<Product, "price" | "salePrice" | "saleEndsAt">,
  today: string = BUILD_DATE,
): PriceView {
  const { price, salePrice, saleEndsAt } = product;

  const hasReduction = typeof salePrice === "number" && salePrice < price;
  // Inclusive: an end date of "2026-08-31" covers all of that day.
  const notLapsed = !saleEndsAt || saleEndsAt >= today;

  const onSale = hasReduction && notLapsed;

  return {
    onSale,
    current: onSale ? salePrice! : price,
    original: onSale ? price : null,
    validUntil: onSale ? saleEndsAt ?? null : null,
  };
}
