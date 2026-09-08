import type { Product } from "@/lib/data/products";

export const NEW_FOR_DAYS = 60;

const BUILD_DATE = process.env.NEXT_PUBLIC_BUILD_DATE ?? "";

/** Compares the build date, not `new Date()` — this renders client-side, so a live
 *  date would mismatch hydration. The marker clears on the next build. */
export function isNewRelease(product: Pick<Product, "releasedAt">): boolean {
  if (!product.releasedAt || !BUILD_DATE) return false;

  const released = Date.parse(product.releasedAt);
  const now = Date.parse(BUILD_DATE);
  if (Number.isNaN(released) || Number.isNaN(now)) return false;

  const days = (now - released) / 86_400_000;
  return days >= 0 && days < NEW_FOR_DAYS;
}
