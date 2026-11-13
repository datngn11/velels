import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { pageMetadata } from "@/lib/seo/openGraph";
import { linkifyContacts } from "@/lib/utils/linkifyContacts";
import { INFO_SLUGS, isInfoSlug } from "@/lib/data/infoPages";
import {
  dressesSizeChart,
  SizeChartTable,
  swimwearSizeChart,
} from "@/components/product/SizeChart";

/** One entry in `info.<slug>.content`. FAQ entries use `question`/`answer`. */
interface InfoSection {
  heading?: string;
  body?: string;
  list?: string[];
  bodyAfter?: string;
  question?: string;
  answer?: string;
  sizeChart?: boolean;
}

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return INFO_SLUGS.map((slug) => ({ slug }));
}

/**
 * Returns empty metadata for a slug outside `INFO_SLUGS`, letting the page itself
 * call `notFound()` rather than describing a page that does not exist.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!isInfoSlug(slug)) return {};

  const t = await getTranslations({ locale, namespace: "info" });

  const title = t(`${slug}.title`);
  const description = t(`${slug}.metaDescription`);

  return pageMetadata({
    locale,
    path: `/info/${slug}`,
    title,
    description,
  });
}

/**
 * Reads the body with `t.raw`: it is an array of sections of varying shape, and
 * the other translation helpers return strings, not structures.
 */
export default async function InfoPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  if (!isInfoSlug(slug)) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "info" });
  const title = t(`${slug}.title`);
  const content = t.raw(`${slug}.content`) as InfoSection[];

  const isFaq = slug === "faq";
  const tSize = await getTranslations({ locale, namespace: "productDetail" });
  const sizeLabels = {
    size: tSize("size"),
    bust: tSize("bust"),
    waist: tSize("waist"),
    hips: tSize("hips"),
  };

  return (
    <>
      <Navbar />
      <main className="mt-24 grow w-full max-w-200 mx-auto px-margin-mobile md:px-margin-desktop py-stack-md md:py-stack-lg">
        {/* Page Title */}
        <h1 className="text-display-md text-primary mb-8 md:mb-10">{title}</h1>

        {/* Content Sections */}
        <div className="flex flex-col gap-5 md:gap-6">
          {content.map((section, index) => (
            <section key={index} className="flex flex-col gap-3">
              {isFaq ? (
                <>
                  <h2 className="text-label-lg text-primary">
                    {section.question}
                  </h2>
                  <p className="text-body-md text-secondary leading-relaxed">
                    {linkifyContacts(section.answer ?? "")}
                  </p>
                  {/* In the HTML, unlike the product page's dialog, so crawlers see it. */}
                  {section.sizeChart && (
                    <div className="flex flex-col gap-4 mt-2">
                      <p className="text-body-sm text-secondary">
                        {tSize("sizeGuideSubtitle")}
                      </p>
                      <h3 className="text-label-md text-primary">
                        {tSize("swimwearCategory")}
                      </h3>
                      <SizeChartTable rows={swimwearSizeChart} labels={sizeLabels} />
                      <h3 className="text-label-md text-primary mt-2">
                        {tSize("dressesCategory")}
                      </h3>
                      <SizeChartTable rows={dressesSizeChart} labels={sizeLabels} />
                    </div>
                  )}
                </>
              ) : (
                <>
                  {section.heading && (
                    <h2 className="text-label-lg text-primary">
                      {section.heading}
                    </h2>
                  )}
                  {section.body && (
                    <p className="text-body-md text-secondary leading-relaxed">
                      {linkifyContacts(section.body)}
                    </p>
                  )}
                  {section.list && (
                    <ul className="list-disc list-inside flex flex-col gap-1.5 text-body-md text-secondary leading-relaxed">
                      {section.list.map((item, i) => (
                        <li key={i}>{linkifyContacts(item)}</li>
                      ))}
                    </ul>
                  )}
                  {section.bodyAfter && (
                    <p className="text-body-md text-secondary leading-relaxed">
                      {linkifyContacts(section.bodyAfter)}
                    </p>
                  )}
                </>
              )}
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
