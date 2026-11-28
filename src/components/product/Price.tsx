import { useTranslations } from "next-intl";
import type { Product } from "@/lib/data/products";
import { formatPrice } from "@/lib/utils/formatPrice";
import { priceView } from "@/lib/utils/price";

interface PriceProps {
  product: Pick<Product, "price" | "salePrice">;
  /** Typography for the price itself — the three call sites use different sizes. */
  className?: string;
  /** Show the rounded percentage reduction beside the price (used on the PDP). */
  showDiscount?: boolean;
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
export function Price({
  product,
  className,
  showDiscount = false,
}: PriceProps) {
  const t = useTranslations("productDetail");
  const { onSale, current, original, discountPercent } = priceView(product);

  if (!onSale || original === null) {
    return (
      <span className={`inline-block tracking-normal ${className ?? ""}`}>
        {formatPrice(current)}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-baseline gap-1.5 tracking-normal ${className ?? ""}`}
    >
      <span className="sr-only">{t("salePriceLabel")}</span>
      <ins className="text-primary font-medium no-underline">
        {formatPrice(current)}
      </ins>
      <span className="sr-only">{t("regularPrice")}</span>
      <del className="text-body-sm text-secondary font-normal line-through decoration-secondary/60">
        {formatPrice(original)}
      </del>
      {showDiscount && discountPercent !== null && (
        <span className="text-sale-badge bg-error text-on-error px-1.5 py-0.5 rounded-[10px] self-center ms-0.5">
          -{discountPercent}%
        </span>
      )}
    </span>
  );
}
