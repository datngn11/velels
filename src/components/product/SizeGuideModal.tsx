"use client";

import { useTranslations } from "next-intl";
import * as Dialog from "@radix-ui/react-dialog";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  const t = useTranslations("productDetail");

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 animate-overlay-show" />

        {/* Modal Panel */}
        <Dialog.Content className="fixed top-1/2 left-1/2 bg-surface-container-lowest max-w-lg w-[calc(100%-40px)] md:w-full z-55 shadow-2xl animate-modal-show focus:outline-none p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8 border-b border-outline-variant/30 pb-4">
            <Dialog.Title className="font-sans text-[14px] leading-[20px] tracking-[0.2em] font-semibold uppercase text-primary">
              {t("sizeGuideTitle")}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                className="text-primary hover:opacity-50 transition-opacity cursor-pointer"
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
            </Dialog.Close>
          </div>

          <Dialog.Description className="sr-only">
            Size chart comparison table for S, M, and L sizes.
          </Dialog.Description>

          {/* Modal Content */}
          <div className="flex flex-col items-center justify-center py-6 text-center">
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
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
