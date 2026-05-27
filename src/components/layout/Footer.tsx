import { useTranslations } from "next-intl";
import { siteConfig } from "@/lib/config";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="w-full py-stack-lg bg-surface-container-lowest border-t border-outline-variant/30 mt-stack-xl">
      <div className="flex flex-col items-center gap-stack-sm px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto">
        <div className="font-sans text-[14px] leading-[20px] tracking-[0.4em] uppercase text-primary font-semibold mb-4">
          VELÉLS
        </div>
        <div className="flex items-center gap-6 mb-4">
          <span className="font-sans text-[12px] leading-[16px] tracking-[0.15em] uppercase text-secondary-fixed-dim hover:text-primary transition-colors cursor-pointer">
            {t("terms")}
          </span>
          <span className="font-sans text-[12px] leading-[16px] tracking-[0.15em] uppercase text-secondary-fixed-dim hover:text-primary transition-colors cursor-pointer">
            {t("contact")}
          </span>
          <a
            href={siteConfig.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-[12px] leading-[16px] tracking-[0.15em] uppercase text-secondary-fixed-dim hover:text-primary transition-colors"
          >
            {t("ig")}
          </a>
        </div>
        <div className="font-sans text-[12px] leading-[16px] tracking-[0.15em] uppercase text-secondary-fixed-dim">
          {t("copyright")}
        </div>
      </div>
    </footer>
  );
}
