import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getProductBySlug, Product, ProductSlug } from "@/lib/data/products";
import { ProductCard } from "@/components/product/ProductCard";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const BESTSELLER_SLUGS: ProductSlug[] = [
  "lendai",
  "dimaya",
  "linear",
  "lauri",
];

export function ProductGrid() {
  const t = useTranslations("products");
  const bestsellerProducts = BESTSELLER_SLUGS.map((slug) =>
    getProductBySlug(slug)
  ).filter((p): p is Product => Boolean(p));

  return (
    <section
      className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-stack-xl"
      id="collection"
    >
      {/* Section header */}
      <ScrollReveal animation="reveal-fade-up">
        <div className="flex justify-between items-end gap-4 mb-8 md:mb-stack-lg border-b border-primary pb-2">
          <h2 className="text-label-md text-primary">{t("sectionTitle")}</h2>
          <Link
            href="/catalog"
            className="text-label-md text-secondary hover:text-primary transition-colors whitespace-nowrap shrink-0 cursor-pointer hover-underline-anim"
          >
            {t("viewAll")}
          </Link>
        </div>
      </ScrollReveal>

      {/* Product grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-gutter gap-y-stack-sm md:gap-y-stack-md">
        {bestsellerProducts.map((product, index) => {
          const delays = ["", "delay-100", "delay-200", "delay-300"] as const;
          const delayClass = delays[index] || "";

          return (
            <ScrollReveal
              key={product.id}
              animation="reveal-fade-up"
              delay={delayClass}
            >
              <ProductCard
                product={product}
                sizes="(max-width: 768px) 50vw, 25vw"
                className={index === 1 || index === 3 ? "md:mt-12" : ""}
              />
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
