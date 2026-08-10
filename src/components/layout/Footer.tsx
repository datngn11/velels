import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { Link } from "@/i18n/navigation";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="w-full py-16 lg:py-24 bg-surface-container-lowest border-t border-outline-variant/30 mt-stack-md md:mt-stack-lg">
      <div className="flex flex-col items-center gap-12 md:gap-16 px-margin-mobile md:px-margin-desktop max-w-container mx-auto">
        {/* 2-Column Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 w-full max-w-140">
          {/* Customer Care */}
          <div className="flex flex-col gap-3 items-center md:items-start">
            <h3 className="text-label-lg text-primary uppercase font-semibold">
              {t("customerCare")}
            </h3>
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
            <h3 className="text-label-lg text-primary uppercase font-semibold">
              {t("about")}
            </h3>
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
          </div>
        </div>

        {/* Utilities */}
        <div className="flex flex-col items-center gap-6 pt-4">
          <LocaleSwitcher />
          <div className="text-label-xs text-secondary/70">
            {t("copyright")}
          </div>
        </div>
      </div>
    </footer>
  );
}
