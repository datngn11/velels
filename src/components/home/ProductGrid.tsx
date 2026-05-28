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
        <div className="flex justify-between items-end mb-stack-lg border-b border-primary pb-4">
          <h2 className="text-display-md text-primary">
            {t("sectionTitle")}
          </h2>
          <span className="text-nav-link text-secondary hover:text-primary transition-colors pb-1 border-b border-transparent hover-underline-anim cursor-pointer">
            {t("viewAll")}
          </span>
        </div>
      </ScrollReveal>

      {/* Product grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-gutter gap-y-stack-sm md:gap-y-stack-md">
        {products.slice(0, 4).map((product, index) => {
          const slug = product.slug;
          const delays = ["", "delay-100", "delay-200", "delay-300"] as const;
          const delayClass = delays[index] || "";
          
          const grayscaleClass =
            product.slug === "dimaya" || product.slug === "lauri"
              ? "grayscale"
              : product.slug === "lendai"
              ? "grayscale-[50%]"
              : "grayscale-[80%]";

          return (
            <ScrollReveal
              key={product.id}
              animation="reveal-fade-up"
              delay={delayClass}
            >
              <Link
                href={`/product/${product.slug}`}
                className={`group block ${(index === 1 || index === 3) ? "md:mt-12" : ""}`}
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
                    className={`object-cover ${grayscaleClass}`}
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <div className="flex flex-col gap-1 text-left">
                  <h3 className="text-nav-link font-semibold text-primary">
                    {t(`${slug}.name`)}
                  </h3>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-body-md text-secondary">
                      {t(`${slug}.colorName`)}
                    </p>
                    <span className="text-body-md text-primary font-medium">
                      ${product.price}
                    </span>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
