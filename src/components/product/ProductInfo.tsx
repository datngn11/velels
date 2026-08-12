"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import type { Product, Size, ProductColor } from "@/lib/data/products";
import { formatPrice } from "@/lib/utils/formatPrice";
import { InstagramCheckout } from "./InstagramCheckout";
import { SizeGuideModal } from "./SizeGuideModal";

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const t = useTranslations("productDetail");
  const tProduct = useTranslations("products");
  const [selectedSize, setSelectedSize] = useState<Size>("M");
  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    product.colors && product.colors.length > 0 ? product.colors[0] : "black"
  );
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const slug = product.slug;
  const productName = tProduct(`${slug}.name`);

  const handleSizeGuideOpen = useCallback(() => setSizeGuideOpen(true), []);
  const handleSizeGuideClose = useCallback(() => setSizeGuideOpen(false), []);

  return (
    <div className="w-full md:w-1/3 md:sticky md:top-32 h-max flex flex-col pt-stack-sm md:pt-0">
      {/* Product header */}
      <div className="border-b border-primary pb-8 mb-8">
        <h1 className="text-display-md text-primary mb-4">
          {productName}
        </h1>
        <p className="text-body-md text-secondary">
          {tProduct(`${slug}.tagline`)}
        </p>
        {/* Price */}
        <p className="text-body-lg text-secondary mt-3 font-medium">
          {formatPrice(product.price)}
        </p>
      </div>

      {/* Color selector */}
      {product.colors && product.colors.length > 0 && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-label-md text-primary">
              {t("color")}:{" "}
              <span className="font-normal text-secondary">
                {t(selectedColor === "black" ? "colorBlack" : "colorWhite")}
              </span>
            </span>
          </div>
          <div className="flex gap-3">
            {product.colors.map((color) => {
              const isSelected = selectedColor === color;
              const bgColorClass = color === "black" ? "bg-black" : "bg-white";
              const colorLabel = t(
                color === "black" ? "colorBlack" : "colorWhite"
              );

              return (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-9 h-9 border transition-all cursor-pointer ${bgColorClass} ${
                    isSelected
                      ? "border-primary ring-1 ring-primary ring-offset-2"
                      : "border-outline-variant/60 hover:border-primary"
                  }`}
                  aria-label={colorLabel}
                  title={colorLabel}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Size selector */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <span className="text-label-md text-primary">
            {t("size")}
          </span>
          <button
            onClick={handleSizeGuideOpen}
            className="text-label-md text-secondary underline hover:text-primary transition-colors"
          >
            {t("sizingGuide")}
          </button>
        </div>
        <div className="flex flex-wrap gap-3">
          {product.sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`min-w-11 h-11 px-3 border flex items-center justify-center text-label-md transition-all cursor-pointer ${
                selectedSize === size
                  ? "border-primary text-primary bg-primary/5 font-semibold"
                  : "border-outline-variant text-secondary hover:border-primary hover:text-primary"
              }`}
              aria-label={`Size ${size}`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* CTA */}
      <InstagramCheckout
        productName={productName}
        selectedSize={selectedSize}
        selectedColor={selectedColor}
      />

      {/* Details & Care accordions */}
      <div className="mt-8 pt-8 border-t border-outline-variant/30 flex flex-col gap-4">
        <details className="group cursor-pointer">
          <summary className="flex justify-between items-center text-label-lg text-primary">
            {t("details")}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="group-open:rotate-180 transition-transform duration-300"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </summary>
          <div className="pt-4 pb-2 pl-4 border-l border-outline-variant/30 mt-2 text-body-md text-secondary">
            {tProduct(`${slug}.details`)}
          </div>
        </details>

        <details className="group cursor-pointer">
          <summary className="flex justify-between items-center text-label-lg text-primary">
            {t("care")}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="group-open:rotate-180 transition-transform duration-300"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </summary>
          <div className="pt-4 pb-2 pl-4 border-l border-outline-variant/30 mt-2 text-body-md text-secondary">
            {tProduct(`${slug}.care`)}
          </div>
        </details>
      </div>

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={sizeGuideOpen}
        onClose={handleSizeGuideClose}
      />
    </div>
  );
}
