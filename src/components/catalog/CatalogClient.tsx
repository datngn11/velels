"use client";

import { Suspense, useTransition } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { products, ProductCategory } from "@/lib/data/products";
import { formatPrice } from "@/lib/utils/formatPrice";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

type FilterTab = "all" | ProductCategory;

const CatalogContent = () => {
  const t = useTranslations("catalog");
  const tProducts = useTranslations("products");
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

  const validFilters: FilterTab[] = [
    "all",
    "one-piece",
    "two-piece",
    "dresses",
  ];
  const categoryParam = searchParams.get("category") as FilterTab | null;
  const activeFilter: FilterTab =
    categoryParam && validFilters.includes(categoryParam)
      ? categoryParam
      : "all";

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
                  onClick={() => setFilter(tab.id)}
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
            const slug = product.slug;
            const delays = ["", "delay-100", "delay-200", "delay-300"] as const;
            const delayClass = delays[index % 4] || "";

            const grayscaleClass =
              product.slug === "dimaya" || product.slug === "lauri"
                ? "grayscale"
                : product.slug === "lendai"
                  ? "grayscale-[50%]"
                  : "grayscale-[80%]";

            // Editorial staggered offset for mobile (even index items slightly shifted down on mobile)
            const staggeredClass = index % 2 === 1 ? "mt-6 md:mt-0" : "";

            return (
              <ScrollReveal
                key={product.id}
                animation="reveal-fade-up"
                delay={delayClass}
                className={staggeredClass}
              >
                <Link
                  href={`/product/${product.slug}`}
                  className="group flex flex-col gap-3 cursor-pointer"
                >
                  <div className="aspect-4-5 w-full bg-surface-container-low relative overflow-hidden hover-image-zoom">
                    {product.slug === "lendai" && (
                      <span className="absolute top-3 left-3 text-[9px] md:text-[10px] uppercase tracking-widest font-medium bg-surface-container-lowest/80 px-2.5 py-1 z-10 backdrop-blur-sm text-primary">
                        New
                      </span>
                    )}
                    <Image
                      src={product.images[0].src}
                      alt={product.images[0].alt}
                      fill
                      className={`object-cover ${grayscaleClass} transition-transform duration-700 ease-in-out group-hover:scale-105`}
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  </div>
                  <div className="flex justify-between items-baseline px-1 gap-2">
                    <h3 className="text-body-md text-primary tracking-wide font-medium">
                      {tProducts(`${slug}.name`)}
                    </h3>
                    <span className="text-body-md text-secondary whitespace-nowrap">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                </Link>
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
};

export function CatalogClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-100 flex items-center justify-center text-secondary">
          ...
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}
