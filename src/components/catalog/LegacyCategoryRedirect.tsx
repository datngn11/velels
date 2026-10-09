"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { CATEGORIES, categoryPath } from "@/lib/data/categories";
import type { ProductCategory } from "@/lib/data/products";

/**
 * Links to `/catalog?category=…`, from before the category pages, are still
 * shared. Sends them on, keeping any other parameter such as `ref`.
 */
export function LegacyCategoryRedirect() {
  const locale = useLocale();
  const { replace } = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const legacy = params.get("category") as ProductCategory | null;
    if (!legacy || !CATEGORIES.includes(legacy)) return;
    params.delete("category");
    const rest = params.toString();
    replace(categoryPath(locale, legacy) + (rest ? `?${rest}` : ""));
  }, [locale, replace]);

  return null;
}
