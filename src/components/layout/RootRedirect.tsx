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
    // Carry the query and hash across, so a tagged link to `/` keeps its tag.
    // A Cloudflare Redirect Rule answers `/` first (docs/cloudflare-setup.md),
    // so this only runs if that rule is removed.
    const { search, hash } = window.location;
    router.replace(`/${routing.defaultLocale}${search}${hash}`);
  }, [router]);

  return null;
}
