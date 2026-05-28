"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import type { Size } from "@/lib/data/products";
import { Toast } from "@/components/ui/Toast";
import { siteConfig } from "@/lib/config";

interface InstagramCheckoutProps {
  productName: string;
  selectedSize: Size;
}

export function InstagramCheckout({
  productName,
  selectedSize,
}: InstagramCheckoutProps) {
  const t = useTranslations("productDetail");
  const [showToast, setShowToast] = useState(false);

  const handleOrder = useCallback(async () => {
    const message = t("orderMessage", {
      product: productName,
      size: selectedSize,
    });

    try {
      await navigator.clipboard.writeText(message);
      setShowToast(true);

      // Open Instagram DM after a short delay
      setTimeout(() => {
        window.open(siteConfig.social.instagramDm, "_blank");
      }, 300);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = message;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);

      setShowToast(true);
      setTimeout(() => {
        window.open(siteConfig.social.instagramDm, "_blank");
      }, 300);
    }
  }, [productName, selectedSize, t]);

  return (
    <>
      <button
        onClick={handleOrder}
        className="w-full bg-primary text-on-primary text-label-md py-4 hover:bg-on-surface-variant transition-colors flex items-center justify-center gap-2"
        id="order-via-instagram-btn"
      >
        {t("orderViaInstagram")}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>

      <Toast
        message={t("copiedToClipboard")}
        visible={showToast}
        onDismiss={() => setShowToast(false)}
      />
    </>
  );
}
