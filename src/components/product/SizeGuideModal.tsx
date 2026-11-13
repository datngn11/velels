"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import * as Dialog from "@radix-ui/react-dialog";
import type { ProductCategory } from "@/lib/data/products";
import {
  dressesSizeChart,
  SizeChartTable,
  swimwearSizeChart,
} from "./SizeChart";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: ProductCategory;
}

export function SizeGuideModal({ isOpen, onClose, category }: SizeGuideModalProps) {
  const t = useTranslations("productDetail");
  const defaultTab = category === "dresses" ? "dresses" : "swimwear";
  const [selectedTab, setSelectedTab] = useState<"swimwear" | "dresses" | null>(
    null
  );

  const activeTab = selectedTab ?? defaultTab;

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedTab(null);
      onClose();
    }
  };

  const currentChart =
    activeTab === "dresses" ? dressesSizeChart : swimwearSizeChart;

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 animate-overlay-show backdrop-blur-[2px]" />

        {/* Modal Panel */}
        <Dialog.Content className="fixed top-1/2 left-1/2 bg-surface-container-lowest max-w-lg w-[calc(100%-32px)] md:w-full z-55 shadow-2xl animate-modal-show focus:outline-none p-6 md:p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 border-b border-outline-variant/30 pb-4">
            <div>
              <Dialog.Title className="text-label-lg text-primary uppercase font-semibold tracking-wider">
                {t("sizeGuideTitle")}
              </Dialog.Title>
              <p className="text-body-sm text-secondary mt-1">
                {t("sizeGuideSubtitle")}
              </p>
            </div>
            <Dialog.Close asChild>
              <button
                className="text-primary hover:opacity-50 transition-opacity cursor-pointer p-1"
                aria-label={t("close")}
              >
                <svg
                  width="22"
                  height="22"
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
            {t("sizeGuideTitle")}
          </Dialog.Description>

          {/* Category Tabs */}
          <div className="flex gap-6 border-b border-outline-variant/20 mb-6">
            <button
              onClick={() => setSelectedTab("swimwear")}
              aria-pressed={activeTab === "swimwear"}
              className={`pb-2.5 text-label-md transition-all cursor-pointer ${
                activeTab === "swimwear"
                  ? "text-primary border-b-2 border-primary font-medium"
                  : "text-secondary hover:text-primary border-b-2 border-transparent"
              }`}
            >
              {t("swimwearCategory")}
            </button>
            <button
              onClick={() => setSelectedTab("dresses")}
              aria-pressed={activeTab === "dresses"}
              className={`pb-2.5 text-label-md transition-all cursor-pointer ${
                activeTab === "dresses"
                  ? "text-primary border-b-2 border-primary font-medium"
                  : "text-secondary hover:text-primary border-b-2 border-transparent"
              }`}
            >
              {t("dressesCategory")}
            </button>
          </div>

          {/* Sizing Table */}
          <SizeChartTable
            rows={currentChart}
            labels={{
              size: t("size"),
              bust: t("bust"),
              waist: t("waist"),
              hips: t("hips"),
            }}
          />

          {/* Sizing Advice */}
          <p className="text-body-sm text-secondary/80 mt-6 pt-4 border-t border-outline-variant/20 text-center leading-relaxed">
            {t("sizeGuideHelp")}
          </p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
