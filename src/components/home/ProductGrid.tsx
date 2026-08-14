import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { products } from "@/lib/data/products";
import { formatPrice } from "@/lib/utils/formatPrice";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function ProductGrid() {
  const t = useTranslations("products");

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
            className="text-label-md text-secondary hover:text-primary transition-colors whitespace-nowrap flex-shrink-0 cursor-pointer hover-underline-anim"
          >
            {t("viewAll")}
          </Link>
        </div>
      </ScrollReveal>

      {/* Product grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-gutter gap-y-stack-sm md:gap-y-stack-md">
        {products.slice(0, 4).map((product, index) => {
          const slug = product.slug;
          const delays = ["", "delay-100", "delay-200", "delay-300"] as const;
          const delayClass = delays[index] || "";

          return (
            <ScrollReveal
              key={product.id}
              animation="reveal-fade-up"
              delay={delayClass}
            >
              <Link
                href={`/product/${product.slug}`}
                className={`group block ${index === 1 || index === 3 ? "md:mt-12" : ""}`}
              >
                <div className="w-full aspect-4-5 bg-surface-container-low mb-4 relative hover-image-zoom">
                  {product.slug === "lendai" && (
                    <span className="absolute top-4 left-4 text-[10px] uppercase tracking-widest font-medium bg-surface-container-lowest/80 px-3 py-1.5 z-10 backdrop-blur-sm text-primary">
                      New
                    </span>
                  )}
                  <Image
                    src={product.images[0].src}
                    alt={product.images[0].alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <div className="flex justify-between items-baseline px-1 gap-2">
                  <h3 className="text-body-md text-primary font-medium">
                    {t(`${slug}.name`)}
                  </h3>
                  <span className="text-body-md text-secondary whitespace-nowrap">
                    {formatPrice(product.price)}
                  </span>
                </div>
              </Link>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
