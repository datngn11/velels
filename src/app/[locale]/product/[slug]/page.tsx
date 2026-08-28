import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductView } from "@/components/product/ProductView";
import { getProductBySlug, getAllProductSlugs } from "@/lib/data/products";
import { localeUrl, localeAlternates } from "@/lib/config";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const slugs = getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};

  const t = await getTranslations({ locale, namespace: "products" });
  const tMeta = await getTranslations({ locale, namespace: "meta" });
  const productKey = product.slug;
  const productName = t(`${productKey}.name`);
  const tagline = t(`${productKey}.tagline`);

  return {
    title: `${productName} ${tMeta("productTitleSuffix")}`,
    description: tagline,
    openGraph: {
      title: `${productName} — VELÉLS`,
      description: tagline,
      url: localeUrl(locale, `/product/${slug}`),
      siteName: "VELÉLS",
      locale: locale === "uk" ? "uk_UA" : "en_US",
      type: "website",
      images: [
        {
          // No width/height: the shoot is 2:3 portrait and the 88 product images
          // span 18 distinct sizes, so no declared pair could be true for all of
          // them. Crawlers read the real dimensions off the file. Declare them
          // again once the landscape 1200x630 cards land (lite L3).
          url: product.images[0].src,
          alt: `${productName} by VELÉLS`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${productName} — VELÉLS`,
      description: tagline,
      images: [product.images[0].src],
    },
    alternates: {
      canonical: localeUrl(locale, `/product/${slug}`),
      languages: localeAlternates(`/product/${slug}`),
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const product = getProductBySlug(slug);
  if (!product) notFound();

  const t = await getTranslations({ locale, namespace: "products" });
  const productKey = product.slug;
  const productName = t(`${productKey}.name`);

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productName,
    description: t(`${productKey}.tagline`),
    image: product.images.map((img) => img.src),
    brand: {
      "@type": "Brand",
      name: "VELÉLS",
    },
    offers: {
      "@type": "Offer",
      url: localeUrl(locale, `/product/${slug}`),
      priceCurrency: product.currency,
      price: product.price.toString(),
      // Nothing is stocked — every garment is sewn after the Order. InStock
      // claimed availability the business cannot back.
      availability: "https://schema.org/MadeToOrder",
    },
  };

  return (
    <>
      <Navbar />
      <main className="mt-[96px] flex-grow w-full max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-stack-md md:py-stack-lg flex flex-col md:flex-row gap-gutter md:gap-margin-desktop">
        <ProductView product={product} />
      </main>
      <Footer />

      {/* JSON-LD structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
