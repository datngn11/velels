import { SIZES, type Product } from "@/lib/data/products";
import { priceView } from "./price";

/**
 * The lowest price and the size range a category's Models span, worked out
 * from the product data so the description cannot go stale. `null` for an
 * empty category.
 */
export function categorySummary(
  items: Pick<Product, "price" | "salePrice" | "sizes">[],
): { from: number; sizes: string } | null {
  if (items.length === 0) return null;
  const sizes = SIZES.filter((s) => items.some((p) => p.sizes.includes(s)));
  return {
    from: Math.min(...items.map((p) => priceView(p).current)),
    sizes: `${sizes[0]}–${sizes[sizes.length - 1]}`,
  };
}
