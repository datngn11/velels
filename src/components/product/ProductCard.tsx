import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Product } from "@/lib/data/products";
import { Price } from "@/components/product/Price";
import { isNewRelease } from "@/lib/utils/newness";

interface ProductCardProps {
  product: Product;
  /** `next/image` sizes — the homepage and catalogue grids have different columns. */
  sizes: string;
  /** Extra classes on the link, for grid-specific layout like the staggered offset. */
  className?: string;
}

/**
 * One product in a grid: photo, optional new marker, name, price. Shared by the
 * homepage and the catalogue.
 *
 * The badge is filled black with a white keyline so it reads over both colourways:
 * `glacier` is white-only, `lunar` ships both, and no flat fill survives both.
 *
 * Hover zoom comes from `.hover-image-zoom` in `globals.css`, which already respects
 * `prefers-reduced-motion` — do not add an inline transform.
 */
export function ProductCard({ product, sizes, className = "" }: ProductCardProps) {
  const t = useTranslations("products");

  return (
    <Link
      href={`/product/${product.slug}`}
      className={`group flex flex-col gap-3 cursor-pointer ${className}`}
    >
      <div className="w-full aspect-4-5 bg-surface-container-low relative hover-image-zoom">
        {isNewRelease(product) && (
          <span className="absolute top-3 left-3 md:top-4 md:left-4 z-10 text-label-xs bg-primary text-on-primary border border-on-primary px-2.5 py-1">
            {t("newBadge")}
          </span>
        )}
        <Image
          src={product.images[0].src}
          alt={product.images[0].alt}
          fill
          className="object-cover"
          sizes={sizes}
        />
      </div>
      <div className="flex justify-between items-baseline px-1 gap-2">
        <h3 className="text-body-md text-primary tracking-wide font-medium">
          {t(`${product.slug}.name`)}
        </h3>
        <Price
          product={product}
          className="text-body-md text-secondary whitespace-nowrap"
        />
      </div>
    </Link>
  );
}
