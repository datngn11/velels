import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { StatusPage } from "@/components/layout/StatusPage";

export default function NotFoundPage() {
  const t = useTranslations("notFound");

  return (
    <StatusPage
      code="404"
      title={t("title")}
      subtitle={t("subtitle")}
      actions={
        <Link
          href="/"
          className="inline-block bg-primary text-on-primary font-sans text-[12px] leading-4 tracking-[0.15em] font-medium uppercase px-8 py-4 animate-fade-in-up delay-300 hover:scale-105 transition-all duration-300"
        >
          {t("cta")}
        </Link>
      }
    />
  );
}
