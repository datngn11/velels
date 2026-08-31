"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { routing } from "@/i18n/routing";

/**
 * Sends a visitor landing on `/` to the default locale.
 *
 * Split out of `src/app/page.tsx` so that page can stay a server component and
 * export metadata. `/` is the address in the Instagram bio, so it is the single
 * most-shared URL on the site — and a client component cannot carry the OG tags a
 * link preview needs.
 *
 * A static export has no server, so the redirect itself has to happen in the
 * browser. Crawlers never run it; they read the metadata and follow the canonical
 * instead. Replacing this with a real edge redirect is the optional L1 item.
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
