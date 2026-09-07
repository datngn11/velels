"use client";

import { Suspense, useTransition } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { products, ProductCategory } from "@/lib/data/products";
import { ProductCard } from "@/components/product/ProductCard";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

type FilterTab = "all" | ProductCategory;

const VALID_FILTERS: FilterTab[] = ["all", "one-piece", "two-piece", "dresses"];

interface CatalogGridProps {
  activeFilter: FilterTab;
  /** Absent while prerendering, where there is nothing to click yet. */
  onFilter?: (filter: FilterTab) => void;
  isPending?: boolean;
}

/**
 * The collection page itself: heading, filter tabs, product grid.
 *
 * Deliberately knows nothing about the URL. That is what lets it render during
 * prerender as well as after hydration — see the note on `CatalogClient`.
 */
function CatalogGrid({ activeFilter, onFilter, isPending }: CatalogGridProps) {
  const t = useTranslations("catalog");

  const filteredProducts =
    activeFilter === "all"
      ? products
      : products.filter((p) => p.category === activeFilter);

  const filterTabs: { id: FilterTab; label: string }[] = [
    { id: "all", label: t("all") },
    { id: "one-piece", label: t("onePiece") },
    { id: "two-piece", label: t("twoPiece") },
    { id: "dresses", label: t("dresses") },
  ];

  return (
    <div className="max-w-container mx-auto px-margin-mobile md:px-margin-desktop pt-6 md:pt-stack-md pb-stack-lg">
      {/* Header Section */}
      <section className="mb-8 md:mb-stack-lg flex flex-col items-center text-center">
        <h1 className="font-serif text-3xl md:text-5xl text-primary text-center mb-6 md:mb-8 tracking-tight">
          {t("title")}
        </h1>

        {/* Filters (Mobile horizontal scroll with no-scrollbar) */}
        <div className="w-full overflow-x-auto no-scrollbar py-2 border-b border-outline-variant/30">
          <div className="flex gap-6 min-w-max px-2 justify-center">
            {filterTabs.map((tab) => {
              const isActive = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={onFilter ? () => onFilter(tab.id) : undefined}
                  className={`text-label-sm uppercase tracking-widest transition-all duration-300 cursor-pointer pb-1 ${
                    isActive
                      ? "text-primary font-semibold border-b border-primary"
                      : "text-secondary hover:text-primary"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mobile-First Product Grid: 2 columns on mobile, 3 on tablet, 4 on desktop */}
      {filteredProducts.length > 0 ? (
        <section
          className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-gutter gap-y-stack-md md:gap-y-stack-lg transition-opacity duration-300 ${
            isPending ? "opacity-40 pointer-events-none" : ""
          }`}
        >
          {filteredProducts.map((product, index) => {
            const delays = ["", "delay-100", "delay-200", "delay-300"] as const;
            const delayClass = delays[index % 4] || "";

            return (
              <ScrollReveal
                key={product.id}
                animation="reveal-fade-up"
                delay={delayClass}
              >
                <ProductCard
                  product={product}
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </ScrollReveal>
            );
          })}
        </section>
      ) : (
        <div className="text-center py-stack-lg text-secondary text-body-md">
          {t("noProducts")}
        </div>
      )}
    </div>
  );
}

/** Reads the category from the URL and keeps it there as the tabs change. */
function CatalogContent() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const setFilter = (filter: FilterTab) => {
    const params = new URLSearchParams(searchParams.toString());
    if (filter === "all") {
      params.delete("category");
    } else {
      params.set("category", filter);
    }
    const query = params.toString();
    startTransition(() => {
      replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    });
  };

  const categoryParam = searchParams.get("category") as FilterTab | null;
  const activeFilter: FilterTab =
    categoryParam && VALID_FILTERS.includes(categoryParam)
      ? categoryParam
      : "all";

  return (
    <CatalogGrid
      activeFilter={activeFilter}
      onFilter={setFilter}
      isPending={isPending}
    />
  );
}

/**
 * `useSearchParams()` cannot be prerendered under `output: "export"`, so React emits
 * the Suspense fallback at build time and the real component only after hydration.
 *
 * The fallback must therefore be the full grid, not a placeholder — otherwise the
 * collection page ships to crawlers with no products in it. Keep it that way.
 */
export function CatalogClient() {
  return (
    <Suspense fallback={<CatalogGrid activeFilter="all" />}>
      <CatalogContent />
    </Suspense>
  );
}
