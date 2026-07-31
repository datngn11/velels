import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const INFO_SLUGS = [
  "delivery",
  "returns",
  "faq",
  "payment",
  "care",
  "about",
  "privacy",
  "terms",
  "contact",
] as const;

type InfoSlug = (typeof INFO_SLUGS)[number];

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return INFO_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!INFO_SLUGS.includes(slug as InfoSlug)) return {};

  const t = await getTranslations({ locale, namespace: "info" });

  const title = t(`${slug}.title`);
  const description = t(`${slug}.metaDescription`);

  return {
    title,
    description,
    openGraph: {
      title: `${title} — VELÉLS`,
      description,
      url: `https://velels.com/${locale === "uk" ? "" : "en/"}info/${slug}`,
      siteName: "VELÉLS",
      locale: locale === "uk" ? "uk_UA" : "en_US",
      type: "website",
    },
    alternates: {
      canonical: `https://velels.com/info/${slug}`,
      languages: {
        uk: `/info/${slug}`,
        en: `/en/info/${slug}`,
      },
    },
  };
}

export default async function InfoPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  if (!INFO_SLUGS.includes(slug as InfoSlug)) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "info" });
  const title = t(`${slug}.title`);

  // Read raw messages to access content arrays
  const { getMessages } = await import("next-intl/server");
  const messages = (await getMessages({ locale })) as Record<
    string,
    Record<string, { title: string; content: Array<Record<string, string>> }>
  >;
  const pageData = messages.info[slug];
  const content = pageData?.content ?? [];

  const isFaq = slug === "faq";

  return (
    <>
      <Navbar />
      <main className="mt-24 grow w-full max-w-200 mx-auto px-margin-mobile md:px-margin-desktop py-stack-md md:py-stack-lg">
        {/* Page Title */}
        <h1 className="text-display-md text-primary mb-8 md:mb-10">{title}</h1>

        {/* Content Sections */}
        <div className="flex flex-col gap-5 md:gap-6">
          {content.map((section: Record<string, string>, index: number) => (
            <section key={index} className="flex flex-col gap-3">
              {isFaq ? (
                <>
                  <h2 className="text-label-lg text-primary">
                    {section.question}
                  </h2>
                  <p className="text-body-md text-secondary leading-relaxed">
                    {section.answer}
                  </p>
                </>
              ) : (
                <>
                  {section.heading && (
                    <h2 className="text-label-lg text-primary">
                      {section.heading}
                    </h2>
                  )}
                  <p className="text-body-md text-secondary leading-relaxed">
                    {section.body}
                  </p>
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
