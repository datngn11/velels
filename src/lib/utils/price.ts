import type { Product } from "@/lib/data/products";

export interface PriceView {
  /** True when a sale price is set and below the list price. */
  onSale: boolean;
  /** The price to show and charge. */
  current: number;
  /** The struck-through original, present only when `onSale`. */
  original: number | null;
}

/**
 * Resolves what a product actually costs.
 *
 * One place decides this so the page, the catalogue cards and the structured data
 * can never disagree — a visitor seeing one number while Google is told another is
 * the failure worth designing against.
 *
 * **There is no end date, deliberately.** A sale runs until `salePrice` is removed.
 * An earlier version carried a `saleEndsAt` and compared it against a build-time
 * date in the Kyiv calendar, which needed a timezone, a build-date constant inlined
 * into both bundles so client and server agreed, and locale-independent date
 * formatting so the comparison held on a small-icu runtime. Around ninety lines of
 * machinery — for a feature that is forty.
 *
 * None of it bought anything. `output: "export"` has no server, so a date cannot
 * expire a sale on its own: the price only changes on the next build. If a person
 * has to act either way, deleting `salePrice` is exactly as much work as editing a
 * date. `CONTEXT.md` is right that a Sale Price has an active period — that is true
 * of the business, and the business is where it is tracked.
 */
export function priceView(
  product: Pick<Product, "price" | "salePrice">,
): PriceView {
  const onSale =
    typeof product.salePrice === "number" && product.salePrice < product.price;

  return {
    onSale,
    current: onSale ? product.salePrice! : product.price,
    original: onSale ? product.price : null,
  };
}
