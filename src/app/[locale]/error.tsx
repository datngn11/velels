"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { StatusPage } from "@/components/layout/StatusPage";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: Props) {
  const t = useTranslations("error");

  useEffect(() => {
    console.error("Runtime error caught by boundary:", error);
  }, [error]);

  return (
    <StatusPage
      title={t("title")}
      subtitle={t("subtitle")}
      actions={
        <>
          <button
            onClick={() => reset()}
            className="inline-block bg-primary text-on-primary text-label-md px-8 py-4 hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            {t("retry")}
          </button>
          <Link
            href="/"
            className="inline-block border border-outline text-primary text-label-md px-8 py-4 hover:scale-105 transition-all duration-300"
          >
            {t("cta")}
          </Link>
        </>
      }
    />
  );
}
