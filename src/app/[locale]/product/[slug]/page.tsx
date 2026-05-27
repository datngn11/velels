import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ImageCarousel } from "@/components/product/ImageCarousel";
import { ProductInfo } from "@/components/product/ProductInfo";
import { getProductBySlug, getAllProductSlugs } from "@/lib/data/products";

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
      url: `https://velels.com/${locale === "uk" ? "" : "en/"}product/${slug}`,
      siteName: "VELÉLS",
      locale: locale === "uk" ? "uk_UA" : "en_US",
      type: "website",
      images: [
        {
          url: product.images[0].src,
          width: 1200,
          height: 630,
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
      canonical: `https://velels.com/product/${slug}`,
      languages: {
        uk: `/product/${slug}`,
        en: `/en/product/${slug}`,
      },
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
      url: `https://velels.com/product/${slug}`,
      priceCurrency: product.currency,
      price: product.price.toString(),
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <Navbar />
      <main className="mt-[96px] flex-grow w-full max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-stack-md md:py-stack-lg flex flex-col md:flex-row gap-gutter md:gap-margin-desktop">
        <ImageCarousel images={product.images} />
        <ProductInfo product={product} />
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
