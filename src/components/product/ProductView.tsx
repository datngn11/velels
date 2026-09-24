"use client";

import { useState, useMemo } from "react";
import type { Product, ProductColor } from "@/lib/data/products";
import { ImageCarousel } from "./ImageCarousel";
import { ProductInfo } from "./ProductInfo";

interface ProductViewProps {
  product: Product;
}

export function ProductView({ product }: ProductViewProps) {
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
      <ImageCarousel key={selectedColor} images={activeImages} />
      <ProductInfo
        product={product}
        selectedColor={selectedColor}
        onSelectColor={setSelectedColor}
      />
    </>
  );
}
