"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { routing } from "@/i18n/routing";

/**
 * Sends `/` to the default locale. Kept separate so `src/app/page.tsx` can stay a
 * server component and carry the OG tags — `/` is the Instagram bio link.
 */
export function RootRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Carry the query and hash across. `/` is the Instagram bio link, so this is
    // where `?ref=ig` and any utm_* parameters arrive — dropping them here would
    // silently defeat the attribution item in lite L3.
    const { search, hash } = window.location;
    router.replace(`/${routing.defaultLocale}${search}${hash}`);
  }, [router]);

  return null;
}
