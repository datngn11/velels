import { setRequestLocale } from "next-intl/server";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { ProductGrid } from "@/components/home/ProductGrid";
import { EditorialFeature } from "@/components/home/EditorialFeature";
import { BrandPhilosophy } from "@/components/home/BrandPhilosophy";
import { InstagramFeed } from "@/components/home/InstagramFeed";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Navbar />
      <main className="mt-[80px]">
        <HeroSection />
        <ProductGrid />
        <EditorialFeature />
        <BrandPhilosophy />
        <InstagramFeed />
      </main>
      <Footer />
    </>
  );
}
