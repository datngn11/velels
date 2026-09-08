import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductView } from "@/components/product/ProductView";
import { getProductBySlug, getAllProductSlugs } from "@/lib/data/products";
import { localeUrl, absoluteUrl } from "@/lib/config";
import { pageMetadata } from "@/lib/seo/openGraph";
import { breadcrumbJsonLd, serialiseJsonLd } from "@/lib/seo/jsonLd";
import { Breadcrumbs, type Crumb } from "@/components/layout/Breadcrumbs";
import { priceView } from "@/lib/utils/price";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const slugs = getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

/**
 * Overrides the share image with the product's own first photo, and returns empty
 * metadata for an unknown slug so the page can call `notFound()`.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};

  const t = await getTranslations({ locale, namespace: "products" });
  const productKey = product.slug;
  const productName = t(`${productKey}.name`);
  const tagline = t(`${productKey}.tagline`);

  // No image width/height anywhere here: the shoot is 2:3 portrait and the 88
  // product images span 18 distinct sizes, so no declared pair could be true for
  // all of them. Crawlers read the real dimensions off the file. Declare them again
  // once the landscape 1200x630 cards land (lite L3).
  return pageMetadata({
    locale,
    path: `/product/${slug}`,
    title: productName,
    description: tagline,
    image: absoluteUrl(product.images[0].src),
    imageAlt: `${productName} by VELÉLS`,
  });
}

export default async function ProductPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const product = getProductBySlug(slug);
  if (!product) notFound();

  const t = await getTranslations({ locale, namespace: "products" });
  const productKey = product.slug;
  const productName = t(`${productKey}.name`);

  const price = priceView(product);

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productName,
    description: t(`${productKey}.tagline`),
    // Absolute: a bare path in JSON-LD is not resolvable, so these images were
    // invisible to Google despite being listed.
    image: product.images.map((img) => absoluteUrl(img.src)),
    brand: {
      "@type": "Brand",
      name: "VELÉLS",
    },
    offers: {
      "@type": "Offer",
      url: localeUrl(locale, `/product/${slug}`),
      priceCurrency: product.currency,
      // The price on the page, not the list price — otherwise a sale is advertised
      // to visitors and hidden from Google, or the reverse.
      price: price.current.toString(),
      // Nothing is stocked — every garment is sewn after the Order. InStock
      // claimed availability the business cannot back.
      availability: "https://schema.org/MadeToOrder",
    },
  };

  const tCatalog = await getTranslations({ locale, namespace: "catalog" });
  const tMeta = await getTranslations({ locale, namespace: "meta" });
  const tDetail = await getTranslations({ locale, namespace: "productDetail" });

  // One array feeds both the visible trail and the structured data, so they cannot
  // drift apart — Google expects the markup to reflect what a visitor can see.
  const crumbs: Crumb[] = [
    { name: tMeta("siteName"), path: "" },
    { name: tCatalog("title"), path: "/catalog" },
    { name: productName, path: `/product/${slug}` },
  ];

  const breadcrumbs = breadcrumbJsonLd(locale, crumbs);

  return (
    <>
      <Navbar />
      <div className="mt-20 w-full max-w-container mx-auto px-margin-mobile md:px-margin-desktop">
        <Breadcrumbs items={crumbs} label={tDetail("breadcrumbLabel")} />
      </div>
      <main className="flex-grow w-full max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop pt-stack-sm pb-stack-md md:pb-stack-lg flex flex-col md:flex-row gap-gutter md:gap-margin-desktop">
        <ProductView product={product} />
      </main>
      <Footer />

      {/* JSON-LD structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serialiseJsonLd(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serialiseJsonLd(breadcrumbs) }}
      />
    </>
  );
}
