"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import type { Product, Size } from "@/lib/data/products";
import { InstagramCheckout } from "./InstagramCheckout";
import { SizeGuideModal } from "./SizeGuideModal";

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const t = useTranslations("productDetail");
  const tProduct = useTranslations("products");
  const [selectedSize, setSelectedSize] = useState<Size>("M");
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const slug = product.slug;
  const productName = tProduct(`${slug}.name`);

  const handleSizeGuideOpen = useCallback(() => setSizeGuideOpen(true), []);
  const handleSizeGuideClose = useCallback(() => setSizeGuideOpen(false), []);

  return (
    <div className="w-full md:w-1/3 md:sticky md:top-32 h-max flex flex-col pt-stack-sm md:pt-0">
      {/* Product header */}
      <div className="border-b border-primary pb-8 mb-8">
        <h1 className="font-serif text-[32px] md:text-[48px] leading-[40px] md:leading-[56px] tracking-[0.05em] text-primary mb-4">
          {productName}
        </h1>
        <p className="font-sans text-[15px] leading-[24px] tracking-[0.01em] text-secondary">
          {tProduct(`${slug}.tagline`)}
        </p>
        {/* Price visible on mobile */}
        <p className="font-sans text-[18px] leading-[28px] text-secondary mt-2 md:hidden">
          ${product.price} {product.currency}
        </p>
      </div>

      {/* Size selector */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <span className="font-sans text-[12px] leading-[16px] tracking-[0.15em] font-medium uppercase text-primary">
            {t("size")}
          </span>
          <button
            onClick={handleSizeGuideOpen}
            className="font-sans text-[12px] leading-[16px] tracking-[0.15em] font-medium uppercase text-secondary underline hover:text-primary transition-colors"
          >
            {t("sizingGuide")}
          </button>
        </div>
        <div className="flex gap-4">
          {product.sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`w-12 h-12 border flex items-center justify-center font-sans text-[14px] leading-[20px] tracking-[0.2em] font-semibold uppercase transition-all ${
                selectedSize === size
                  ? "border-primary text-primary bg-primary/5"
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
      />

      {/* Details & Care accordions */}
      <div className="mt-8 pt-8 border-t border-outline-variant/30 flex flex-col gap-4">
        <details className="group cursor-pointer">
          <summary className="flex justify-between items-center font-sans text-[14px] leading-[20px] tracking-[0.2em] font-semibold uppercase text-primary">
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
          <div className="pt-4 pb-2 pl-4 border-l border-outline-variant/30 mt-2 font-sans text-[15px] leading-[24px] tracking-[0.01em] text-secondary">
            {tProduct(`${slug}.details`)}
          </div>
        </details>

        <details className="group cursor-pointer">
          <summary className="flex justify-between items-center font-sans text-[14px] leading-[20px] tracking-[0.2em] font-semibold uppercase text-primary">
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
          <div className="pt-4 pb-2 pl-4 border-l border-outline-variant/30 mt-2 font-sans text-[15px] leading-[24px] tracking-[0.01em] text-secondary">
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
