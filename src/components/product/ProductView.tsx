"use client";

import { useState, useMemo, useRef } from "react";
import { useTranslations } from "next-intl";
import type { Product, ProductColor } from "@/lib/data/products";
import { scrollBehavior } from "@/lib/utils/motion";
import { productImageAlt } from "@/lib/utils/productImageAlt";
import { ImageCarousel } from "./ImageCarousel";
import { ProductInfo } from "./ProductInfo";

interface ProductViewProps {
  product: Product;
}

export function ProductView({ product }: ProductViewProps) {
  const tMeta = useTranslations("meta");
  const tProducts = useTranslations("products");
  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    product.colors && product.colors.length > 0 ? product.colors[0] : "black"
  );

  // One gallery per colour, all in the static HTML, the inactive ones hidden.
  // Crawlers never tap the swatch, so rendering only the selected colour kept
  // the second colourway, and its alts, out of search.
  const galleries = useMemo(() => {
    const colors: ProductColor[] =
      product.colors.length > 0 ? product.colors : ["black"];
    return colors.map((color) => {
      const images = product.images.filter((img) => img.color === color);
      return { color, images: images.length > 0 ? images : product.images };
    });
  }, [product.colors, product.images]);
  const name = tProducts(`${product.slug}.name`);
  const galleryRef = useRef<HTMLDivElement>(null);

  // On a phone the photos sit above the swatches, so a new colour would change
  // off screen. Bring the gallery back into view, but only when its top is
  // hidden. Every gallery fills the same slot, so the one being replaced marks
  // where the new one appears.
  const selectColor = (color: ProductColor) => {
    const gallery = galleryRef.current;
    setSelectedColor(color);
    if (color === selectedColor || !gallery) return;
    if (window.matchMedia("(min-width: 48rem)").matches) return;
    const clearance = parseFloat(getComputedStyle(gallery).scrollMarginTop) || 0;
    if (gallery.getBoundingClientRect().top >= clearance) return;
    gallery.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
  };

  return (
    <>
      {galleries.map(({ color, images }) => {
        const shown = color === selectedColor;
        return (
          <ImageCarousel
            // Remounts the gallery being shown, so it opens on its first photo
            // as it did when only one gallery was rendered.
            key={`${color}-${shown}`}
            ref={shown ? galleryRef : undefined}
            hidden={!shown}
            images={images}
            alts={images.map((image, i) =>
              productImageAlt(tMeta, {
                name,
                category: product.category,
                color: image.color,
                shot: image.shot,
                // Within this colour's gallery, not the whole set.
                position: i + 1,
              }),
            )}
          />
        );
      })}
      <ProductInfo
        product={product}
        selectedColor={selectedColor}
        onSelectColor={selectColor}
      />
    </>
  );
}
