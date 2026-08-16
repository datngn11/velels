"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import * as Dialog from "@radix-ui/react-dialog";
import type { ProductCategory } from "@/lib/data/products";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: ProductCategory;
}

interface SizeRow {
  size: string;
  bust: string;
  waist: string;
  hips: string;
}

const swimwearSizeChart: SizeRow[] = [
  { size: "XXS", bust: "74–78", waist: "54–58", hips: "79–83" },
  { size: "XS", bust: "78–82", waist: "58–62", hips: "83–87" },
  { size: "S", bust: "82–86", waist: "62–66", hips: "87–91" },
  { size: "M", bust: "86–90", waist: "66–70", hips: "91–95" },
  { size: "L", bust: "90–94", waist: "70–74", hips: "95–100" },
];

const dressesSizeChart: SizeRow[] = [
  { size: "XS", bust: "82–84", waist: "62–64", hips: "88–90" },
  { size: "S", bust: "86–88", waist: "66–68", hips: "92–94" },
  { size: "M", bust: "90–92", waist: "70–72", hips: "96–98" },
  { size: "L", bust: "94–98", waist: "74–76", hips: "100–102" },
];

export function SizeGuideModal({
  isOpen,
  onClose,
  category = "one-piece",
}: SizeGuideModalProps) {
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
                aria-label="Close"
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
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-body-sm">
              <thead>
                <tr className="border-b border-primary/20 text-primary">
                  <th className="py-3.5 px-3 font-semibold uppercase tracking-wider text-xs">
                    {t("size")}
                  </th>
                  <th className="py-3.5 px-3 font-semibold uppercase tracking-wider text-xs text-center">
                    {t("bust")}
                  </th>
                  <th className="py-3.5 px-3 font-semibold uppercase tracking-wider text-xs text-center">
                    {t("waist")}
                  </th>
                  <th className="py-3.5 px-3 font-semibold uppercase tracking-wider text-xs text-center">
                    {t("hips")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/15 text-secondary">
                {currentChart.map((row) => (
                  <tr
                    key={row.size}
                    className="hover:bg-surface-container-low/50 transition-colors"
                  >
                    <td className="py-3.5 px-3 font-medium text-primary">
                      {row.size}
                    </td>
                    <td className="py-3.5 px-3 text-center tabular-nums">
                      {row.bust}
                    </td>
                    <td className="py-3.5 px-3 text-center tabular-nums">
                      {row.waist}
                    </td>
                    <td className="py-3.5 px-3 text-center tabular-nums">
                      {row.hips}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Sizing Advice */}
          <p className="text-body-sm text-secondary/80 mt-6 pt-4 border-t border-outline-variant/20 text-center leading-relaxed">
            {t("sizeGuideHelp")}
          </p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
