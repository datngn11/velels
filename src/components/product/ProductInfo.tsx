"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import type { Product, Size, ProductColor } from "@/lib/data/products";
import { Price } from "./Price";
import { InstagramCheckout } from "./InstagramCheckout";
import { SizeGuideModal } from "./SizeGuideModal";
import { ProductAccordion } from "./ProductAccordion";

interface ProductInfoProps {
  product: Product;
  selectedColor: ProductColor;
  onSelectColor: (color: ProductColor) => void;
}

export function ProductInfo({
  product,
  selectedColor,
  onSelectColor,
}: ProductInfoProps) {
  const t = useTranslations("productDetail");
  const tProduct = useTranslations("products");
  // No default: a size she never chose must not travel in the Direct message.
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
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
        <Price
          product={product}
          className="text-body-lg text-secondary mt-3 font-medium block"
        />
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
                  onClick={() => onSelectColor(color)}
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

      {/* The three doubts a visitor has while deciding — when it arrives, what if
          it does not fit, how soon does anyone reply. Visible rather than collapsed:
          an accordion is where information goes to be ignored, and these are the
          answers most likely to close the sale. */}
      <ul className="mt-5 pt-5 border-t border-outline-variant/30 flex flex-col gap-2 text-body-sm text-secondary">
        <li>{t("productionTime")}</li>
        <li>{t("exchangeNote")}</li>
        <li>{t("responseTime")}</li>
      </ul>

      {/* Reference material, safe to collapse */}
      <div className="mt-8 pt-8 border-t border-outline-variant/30 flex flex-col gap-4">
        <ProductAccordion title={t("details")}>
          {tProduct(`${slug}.details`)}
        </ProductAccordion>

        <ProductAccordion title={t("care")}>
          {tProduct(`${slug}.care`)}
        </ProductAccordion>

        {/* Payment and delivery are one question to a customer — how does this
            reach me and what do I pay when — so they are one row, not two. */}
        <ProductAccordion title={t("paymentDelivery")}>
          <ul className="flex flex-col gap-3">
            {(t.raw("paymentDeliveryPoints") as string[]).map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </ProductAccordion>
      </div>

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={sizeGuideOpen}
        onClose={handleSizeGuideClose}
        category={product.category}
      />
    </div>
  );
}
