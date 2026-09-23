"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import type { Product, ProductColor } from "@/lib/data/products";
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

  const activeImages = useMemo(() => {
    if (!product.images || product.images.length === 0) return [];
    const colorImages = product.images.filter((img) => img.color === selectedColor);
    return colorImages.length > 0 ? colorImages : product.images;
  }, [product.images, selectedColor]);

  return (
    <>
      <ImageCarousel
        key={selectedColor}
        images={activeImages}
        alts={activeImages.map((image, i) =>
          productImageAlt(tMeta, {
            name: tProducts(`${product.slug}.name`),
            category: product.category,
            color: image.color,
            shot: image.shot,
            // Within the colour the visitor is looking at, not the whole set.
            position: i + 1,
          }),
        )}
      />
      <ProductInfo
        product={product}
        selectedColor={selectedColor}
        onSelectColor={setSelectedColor}
      />
    </>
  );
}
