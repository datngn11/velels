import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { products } from "@/lib/data/products";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function ProductGrid() {
  const t = useTranslations("products");

  return (
    <section
      className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-stack-xl"
      id="collection"
    >
      {/* Section header */}
      <ScrollReveal animation="reveal-fade-up">
        <div className="flex justify-between items-end mb-stack-lg border-b border-outline-variant/30 pb-4">
          <h2 className="font-serif text-[32px] md:text-[48px] leading-[40px] md:leading-[56px] tracking-[0.05em] text-primary">
            {t("sectionTitle")}
          </h2>
          <span className="font-sans text-[13px] leading-[16px] tracking-[0.2em] uppercase text-secondary hover:text-primary transition-colors pb-1 border-b border-transparent hover-underline-anim cursor-pointer">
            {t("viewAll")}
          </span>
        </div>
      </ScrollReveal>

      {/* Product grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-8 md:gap-gutter">
        {products.slice(0, 3).map((product, index) => {
          const slug = product.slug;
          const delayClass =
            index === 0 ? "" : index === 1 ? "delay-200" : "delay-400";
          return (
            <ScrollReveal
              key={product.id}
              animation="reveal-fade-up"
              delay={delayClass}
              className={index === 2 ? "col-span-2 md:col-span-1" : ""}
            >
              <Link
                href={`/product/${product.slug}`}
                className={`group block ${index === 1 ? "md:mt-16" : ""}`}
              >
                <div className="w-full aspect-4-5 bg-surface-container-low mb-4 relative hover-image-zoom">
                  <Image
                    src={product.images[0].src}
                    alt={product.images[0].alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-sans text-[14px] leading-[20px] tracking-[0.2em] font-semibold text-primary uppercase mb-1">
                      {t(`${slug}.name`)}
                    </h3>
                    <p className="font-sans text-[15px] leading-[24px] tracking-[0.01em] text-secondary">
                      {t(`${slug}.colorName`)}
                    </p>
                  </div>
                  <span className="font-sans text-[15px] leading-[24px] tracking-[0.01em] text-primary">
                    ${product.price}
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
