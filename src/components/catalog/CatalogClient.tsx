"use client";

import { useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import {
  products,
  CATEGORIES,
  categoryPath,
  type ProductCategory,
} from "@/lib/data/products";
import { ProductCard } from "@/components/product/ProductCard";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

type FilterTab = "all" | ProductCategory;

/**
 * The collection page: heading, category tabs, product grid. Without a
 * `category` it is the whole catalogue at `/catalog`; each category has its own
 * prerendered page, and the tabs are links between them.
 */
export function CatalogClient({ category }: { category?: ProductCategory }) {
  const t = useTranslations("catalog");
  const locale = useLocale();
  const { replace } = useRouter();
  const activeFilter: FilterTab = category ?? "all";

  // Links to `/catalog?category=…`, from before the category pages, are still
  // shared. Send them on, keeping any other parameter such as `ref`.
  useEffect(() => {
    if (category) return;
    const params = new URLSearchParams(window.location.search);
    const legacy = params.get("category") as ProductCategory | null;
    if (!legacy || !CATEGORIES.includes(legacy)) return;
    params.delete("category");
    const rest = params.toString();
    replace(categoryPath(locale, legacy) + (rest ? `?${rest}` : ""));
  }, [category, locale, replace]);

  const filteredProducts =
    activeFilter === "all"
      ? products
      : products.filter((p) => p.category === activeFilter);

  const filterTabs: { id: FilterTab; label: string; href: string }[] = [
    { id: "all", label: t("all"), href: "/catalog" },
    { id: "one-piece", label: t("onePiece"), href: categoryPath(locale, "one-piece") },
    { id: "two-piece", label: t("twoPiece"), href: categoryPath(locale, "two-piece") },
    { id: "dresses", label: t("dresses"), href: categoryPath(locale, "dresses") },
  ];

  return (
    <div className="max-w-container mx-auto px-margin-mobile md:px-margin-desktop pt-6 md:pt-stack-md pb-stack-lg">
      {/* Header Section */}
      <section className="mb-8 md:mb-stack-lg flex flex-col items-center text-center">
        <h1 className="font-serif text-3xl md:text-5xl text-primary text-center mb-6 md:mb-8 tracking-tight">
          {category
            ? filterTabs.find((tab) => tab.id === category)?.label
            : t("title")}
        </h1>

        {/* Filters (Mobile horizontal scroll with no-scrollbar) */}
        <div className="w-full overflow-x-auto no-scrollbar py-2 border-b border-outline-variant/30">
          <div className="flex gap-6 min-w-max px-2 justify-center">
            {filterTabs.map((tab) => {
              const isActive = activeFilter === tab.id;
              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  scroll={false}
                  aria-current={isActive ? "page" : undefined}
                  className={`text-label-sm uppercase tracking-widest transition-all duration-300 cursor-pointer pb-1 ${
                    isActive
                      ? "text-primary font-semibold border-b border-primary"
                      : "text-secondary hover:text-primary"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mobile-First Product Grid: 2 columns on mobile, 3 on tablet, 4 on desktop */}
      {filteredProducts.length > 0 ? (
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-gutter gap-y-stack-md md:gap-y-stack-lg">
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
                  as="h2"
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
