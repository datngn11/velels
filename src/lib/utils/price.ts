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
 * Resolves what a product actually costs. The page, the catalogue cards and the
 * structured data all read this, so they cannot show different numbers.
 *
 * No end date by design: a sale runs until `salePrice` is removed. A static export
 * has no server to expire one, so a date would need a rebuild to take effect — and
 * if someone has to act anyway, deleting the price is the same work.
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
