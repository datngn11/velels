import { useTranslations } from "next-intl";
import { siteConfig } from "@/lib/config";
import { LocaleSwitcher } from "./LocaleSwitcher";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="w-full py-16 lg:py-24 bg-surface-container-lowest border-t border-outline-variant/30 mt-stack-md md:mt-stack-xl">
      <div className="flex flex-col items-center gap-8 px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto">
        
        {/* Logo */}
        <div className="text-label-lg tracking-[0.4em] text-primary">
          VELÉLS
        </div>

        <div className="flex items-center gap-8">
          <span className="text-label-sm text-secondary hover:text-primary transition-colors duration-300 cursor-pointer hover-underline-anim">
            {t("terms")}
          </span>
          <span className="text-label-sm text-secondary hover:text-primary transition-colors duration-300 cursor-pointer hover-underline-anim">
            {t("contact")}
          </span>
          <a
            href={siteConfig.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-label-sm text-secondary hover:text-primary transition-colors duration-300 hover-underline-anim"
          >
            {t("ig")}
          </a>
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
