import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";
import { shouldAllowIndexing } from "@/lib/seo/indexing";

/**
 * Emitted as `out/robots.txt` by `output: "export"`.
 *
 * Fails closed for the same reason the `noindex` meta tag does: a build without
 * NEXT_PUBLIC_ALLOW_INDEXING is a preview, and a preview must not invite crawlers.
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
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
