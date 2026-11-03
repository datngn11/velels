import { useLocale, useTranslations } from "next-intl";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { Link } from "@/i18n/navigation";
import { CATEGORIES, CATEGORY_LABEL_KEY, categoryPath } from "@/lib/data/categories";

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
            <Link
              href="/catalog"
              className="text-label-sm text-secondary hover:text-primary transition-colors duration-300 hover-underline-anim normal-case"
            >
              {tCatalog("all")}
            </Link>
            {CATEGORIES.map((category) => (
              <Link
                key={category}
                href={categoryPath(locale, category)}
                className="text-label-sm text-secondary hover:text-primary transition-colors duration-300 hover-underline-anim normal-case"
              >
                {tCatalog(CATEGORY_LABEL_KEY[category])}
              </Link>
            ))}
          </div>

          {/* Customer Care */}
          <div className="flex flex-col gap-3 items-center md:items-start">
            <h2 className="text-label-lg text-primary uppercase font-semibold">
              {t("customerCare")}
            </h2>
            <Link
              href="/info/payment"
              className="text-label-sm text-secondary hover:text-primary transition-colors duration-300 hover-underline-anim normal-case"
            >
              {t("payment")}
            </Link>
            <Link
              href="/info/delivery"
              className="text-label-sm text-secondary hover:text-primary transition-colors duration-300 hover-underline-anim normal-case"
            >
              {t("delivery")}
            </Link>
            <Link
              href="/info/returns"
              className="text-label-sm text-secondary hover:text-primary transition-colors duration-300 hover-underline-anim normal-case"
            >
              {t("returns")}
            </Link>
            <Link
              href="/info/care"
              className="text-label-sm text-secondary hover:text-primary transition-colors duration-300 hover-underline-anim normal-case"
            >
              {t("productCare")}
            </Link>
            <Link
              href="/info/faq"
              className="text-label-sm text-secondary hover:text-primary transition-colors duration-300 hover-underline-anim normal-case"
            >
              {t("faq")}
            </Link>
          </div>

          {/* Information */}
          <div className="flex flex-col gap-3 items-center md:items-start">
            <h2 className="text-label-lg text-primary uppercase font-semibold">
              {t("about")}
            </h2>
            <Link
              href="/info/about"
              className="text-label-sm text-secondary hover:text-primary transition-colors duration-300 hover-underline-anim normal-case"
            >
              {t("aboutUs")}
            </Link>
            <Link
              href="/info/contact"
              className="text-label-sm text-secondary hover:text-primary transition-colors duration-300 hover-underline-anim normal-case"
            >
              {t("contact")}
            </Link>
            <Link
              href="/info/privacy"
              className="text-label-sm text-secondary hover:text-primary transition-colors duration-300 hover-underline-anim normal-case"
            >
              {t("privacyPolicy")}
            </Link>
            <Link
              href="/info/terms"
              className="text-label-sm text-secondary hover:text-primary transition-colors duration-300 hover-underline-anim normal-case"
            >
              {t("terms")}
            </Link>
          </div>
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
