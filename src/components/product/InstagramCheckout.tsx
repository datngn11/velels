"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import type { Size, ProductColor } from "@/lib/data/products";
import { Toast } from "@/components/ui/Toast";
import { siteConfig } from "@/lib/config";

interface InstagramCheckoutProps {
  productName: string;
  /** Slug, not the translated name — the event has to read the same in both locales. */
  productSlug: string;
  /** `null` until she picks one — the message then carries a blank, not a guess. */
  selectedSize: Size | null;
  selectedColor?: ProductColor;
}

/** Stands in for a size she never chose, so the Consultant knows to ask. */
const SIZE_PLACEHOLDER = "___";

/**
 * Hands the visitor to Instagram Direct with the order details on her clipboard.
 *
 * This is a plain anchor, not a button calling `window.open()`. iOS Safari and the
 * Instagram in-app browser — where nearly all of this traffic arrives — only allow
 * a new window while the user activation from the tap is still live, and both an
 * `await` and a `setTimeout` end it. A native anchor navigation is never subject to
 * that heuristic. The clipboard write is therefore fire-and-forget: it may fail,
 * and the handoff still happens.
 */
export function InstagramCheckout({
  productName,
  productSlug,
  selectedSize,
  selectedColor = "black",
}: InstagramCheckoutProps) {
  const t = useTranslations("productDetail");
  const [showToast, setShowToast] = useState(false);

  const copyMessage = useCallback(() => {
    const colorLabel =
      selectedColor === "black" ? t("colorBlack") : t("colorWhite");

    const message = t("orderMessage", {
      product: productName,
      color: colorLabel,
      size: selectedSize ?? SIZE_PLACEHOLDER,
      site: siteConfig.host,
    });

    // Everything below runs synchronously inside the click handler so it cannot
    // interrupt the anchor's own navigation. Nothing here is awaited.
    try {
      const written = navigator.clipboard?.writeText(message);
      if (written) {
        written.then(
          () => setShowToast(true),
          () => {},
        );
        return;
      }

      // No async clipboard (insecure context, older in-app webview): the legacy
      // path is synchronous, which is exactly what is wanted here.
      const textarea = document.createElement("textarea");
      textarea.value = message;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setShowToast(true);
    } catch {
      // The copy is the part that is allowed to fail. The handoff is not.
    }
  }, [productName, selectedSize, selectedColor, t]);

  return (
    <>
      <a
        href={siteConfig.social.instagramDm}
        target="_blank"
        rel="noopener noreferrer"
        onClick={copyMessage}
        className="w-full bg-primary text-on-primary text-label-md py-4 hover:bg-on-surface-variant transition-colors flex items-center justify-center gap-2"
        id="order-via-instagram-btn"
        data-umami-event="ig_dm_click"
        data-umami-event-product={productSlug}
        data-umami-event-size={selectedSize ?? "none"}
      >
        {t("orderViaInstagram")}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </a>

      <Toast
        message={t("copiedToClipboard")}
        visible={showToast}
        onDismiss={() => setShowToast(false)}
      />
    </>
  );
}
