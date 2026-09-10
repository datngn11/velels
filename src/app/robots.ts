import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";
import { shouldAllowIndexing } from "@/lib/seo/indexing";

/**
 * Emitted as `out/robots.txt` by `output: "export"`.
 *
 * A build without NEXT_PUBLIC_ALLOW_INDEXING withholds the sitemap rather than
 * blocking crawlers — see the comment in the branch below.
 *
 * Note that Cloudflare serves its own managed `robots.txt` (the Content Signals
 * Policy) when the origin emits none. Once this file ships, confirm at the edge
 * that ours is what actually gets served.
 */
// sitemap.ts and robots.ts compile to route handlers, and `output: "export"` will
// not build one without an explicit static opt-in. Both read process.env, so
// without this the build fails rather than inlining the value at build time.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  if (!shouldAllowIndexing()) {
    // Allow crawling even here. `Disallow: /` stops a crawler reading the `noindex`
    // meta tag, and Google's own docs say the tag only works on a page it can fetch
    // — so blocking is weaker protection, not stronger. It also kills share
    // previews: Telegram's crawler honours robots.txt. The sitemap is withheld
    // instead, so nothing invites indexing.
    return { rules: [{ userAgent: "*", allow: "/" }] };
  }

  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
