import { setRequestLocale, getTranslations } from "next-intl/server";
import {
  organizationJsonLd,
  webSiteJsonLd,
  serialiseJsonLd,
} from "@/lib/seo/jsonLd";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { ProductGrid } from "@/components/home/ProductGrid";
import { EditorialFeature } from "@/components/home/EditorialFeature";
import { InstagramFeed } from "@/components/home/InstagramFeed";

type Props = {
  params: Promise<{ locale: string }>;
};

/**
 * Also the one place Organization and WebSite structured data is emitted. Repeating
 * it on every page would add bytes without adding information, and would risk
 * describing the brand more than once.
 */
export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tMeta = await getTranslations({ locale, namespace: "meta" });
  const siteName = tMeta("siteName");

  // Both emitted only here: the brand and the site are described once, not on
  // every page.
  const jsonLd = [
    organizationJsonLd(siteName),
    webSiteJsonLd(locale, siteName),
  ];

  return (
    <>
      <Navbar />
      <main className="mt-16 md:mt-14">
        <HeroSection />
        <ProductGrid />
        <EditorialFeature />
        <InstagramFeed />
      </main>
      <Footer />

      {jsonLd.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serialiseJsonLd(schema) }}
        />
      ))}
    </>
  );
}
