import { useTranslations } from "next-intl";
import type { Product } from "@/lib/data/products";
import { formatPrice } from "@/lib/utils/formatPrice";
import { priceView } from "@/lib/utils/price";

interface PriceProps {
  product: Pick<Product, "price" | "salePrice">;
  /** Typography for the price itself — the three call sites use different sizes. */
  className?: string;
}

/**
 * Renders a price, struck-through original included when the product is on sale.
 *
 * Shared by the PDP, the homepage grid and the catalogue so a sale cannot appear in
 * one place and not another.
 *
 * Uses `<del>` and `<ins>`, which is the semantic markup for a replaced value: a
 * screen reader announces the old price as deleted rather than reading two prices
 * with no relationship between them. The visually hidden labels name which is which,
 * because strikethrough carries no meaning without sight of it.
 */
export function Price({ product, className }: PriceProps) {
  const t = useTranslations("productDetail");
  const { onSale, current, original } = priceView(product);

  if (!onSale || original === null) {
    return <span className={className}>{formatPrice(current)}</span>;
  }

  return (
    <span className={className}>
      <span className="sr-only">{t("regularPrice")}</span>
      <del className="text-secondary/70 me-2 no-underline line-through">
        {formatPrice(original)}
      </del>
      <span className="sr-only">{t("salePriceLabel")}</span>
      <ins className="text-primary no-underline">{formatPrice(current)}</ins>
    </span>
  );
}
