import { useLocale, useTranslations } from "next-intl";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { Link } from "@/i18n/navigation";
import { CATEGORIES, CATEGORY_LABEL_KEY, categoryPath } from "@/lib/data/categories";

const LINK =
  "text-label-sm text-secondary hover:text-primary transition-colors duration-300 hover-underline-anim normal-case";

/** The two info columns: a `footer` heading key, then `[info slug, footer label key]`. */
const COLUMNS = [
  {
    heading: "customerCare",
    links: [
      ["payment", "payment"],
      ["delivery", "delivery"],
      ["returns", "returns"],
      ["care", "productCare"],
      ["faq", "faq"],
    ],
  },
  {
    heading: "about",
    links: [
      ["about", "aboutUs"],
      ["contact", "contact"],
      ["privacy", "privacyPolicy"],
      ["terms", "terms"],
    ],
  },
] as const;

export function Footer() {
  const t = useTranslations("footer");
  const tCatalog = useTranslations("catalog");
  const locale = useLocale();

  return (
    <footer className="w-full py-16 lg:py-24 bg-surface-container-lowest border-t border-outline-variant/30 mt-stack-md md:mt-stack-lg">
      <div className="flex flex-col items-center gap-12 md:gap-16 px-margin-mobile md:px-margin-desktop max-w-container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-20 w-full max-w-200">
          {/* Every page links to every category in its HTML. The navbar's
              links render only once its menu opens, so this is the path
              Google follows. */}
          <div className="flex flex-col gap-3 items-center md:items-start">
            <h2 className="text-label-lg text-primary uppercase font-semibold">
              {tCatalog("title")}
            </h2>
            <Link href="/catalog" className={LINK}>
              {tCatalog("all")}
            </Link>
            {CATEGORIES.map((category) => (
              <Link key={category} href={categoryPath(locale, category)} className={LINK}>
                {tCatalog(CATEGORY_LABEL_KEY[category])}
              </Link>
            ))}
          </div>

          {COLUMNS.map(({ heading, links }) => (
            <div key={heading} className="flex flex-col gap-3 items-center md:items-start">
              <h2 className="text-label-lg text-primary uppercase font-semibold">
                {t(heading)}
              </h2>
              {links.map(([slug, label]) => (
                <Link key={slug} href={`/info/${slug}`} className={LINK}>
                  {t(label)}
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* Utilities */}
        <div className="flex flex-col items-center gap-6 pt-4">
          <LocaleSwitcher />
          <div className="text-label-xs text-secondary">
            {t("copyright")}
          </div>
        </div>
      </div>
    </footer>
  );
}
