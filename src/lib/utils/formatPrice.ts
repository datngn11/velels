/**
 * Formats a price in UAH with the ₴ symbol.
 * Example: 3750 → "3 750 ₴"
 */
export function formatPrice(price: number): string {
  return `${price.toLocaleString("uk-UA")} ₴`;
}
