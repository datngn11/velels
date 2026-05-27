"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  const t = useTranslations("productDetail");
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
      document.body.style.overflow = "hidden";
    } else {
      dialog.close();
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => onClose();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      className="backdrop:bg-black/50 bg-surface-container-lowest p-0 max-w-lg w-[calc(100%-40px)] md:w-full"
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
    >
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b border-outline-variant/30 pb-4">
          <h2 className="font-sans text-[14px] leading-[20px] tracking-[0.2em] font-semibold uppercase text-primary">
            {t("sizeGuideTitle")}
          </h2>
          <button
            onClick={onClose}
            className="text-primary hover:opacity-50 transition-opacity"
            aria-label="Close"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Placeholder content — user will provide size guide image */}
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-full aspect-[4/3] bg-surface-container-low flex items-center justify-center mb-6">
            <p className="font-sans text-[15px] leading-[24px] text-secondary">
              {t("sizeGuideComingSoon")}
            </p>
          </div>

          {/* Fallback text-based size chart */}
          <table className="w-full text-left font-sans text-[13px] leading-[20px] text-secondary">
            <thead>
              <tr className="border-b border-outline-variant/30">
                <th className="py-3 font-semibold text-primary uppercase tracking-[0.1em] text-[12px]">
                  {t("size")}
                </th>
                <th className="py-3 font-semibold text-primary uppercase tracking-[0.1em] text-[12px]">
                  EU
                </th>
                <th className="py-3 font-semibold text-primary uppercase tracking-[0.1em] text-[12px]">
                  US
                </th>
                <th className="py-3 font-semibold text-primary uppercase tracking-[0.1em] text-[12px]">
                  UK
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-outline-variant/15">
                <td className="py-3">S</td>
                <td className="py-3">36</td>
                <td className="py-3">4</td>
                <td className="py-3">8</td>
              </tr>
              <tr className="border-b border-outline-variant/15">
                <td className="py-3">M</td>
                <td className="py-3">38</td>
                <td className="py-3">6</td>
                <td className="py-3">10</td>
              </tr>
              <tr>
                <td className="py-3">L</td>
                <td className="py-3">40</td>
                <td className="py-3">8</td>
                <td className="py-3">12</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </dialog>
  );
}
