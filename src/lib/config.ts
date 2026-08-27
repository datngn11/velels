/**
 * Global application configuration.
 * Using a centralized TS constant file is the best practice for public brand assets
 * (like social links) that remain consistent across environments.
 */

// Public origin of the site. Set NEXT_PUBLIC_SITE_URL per environment; the default
// is the production domain so a build without the variable still emits correct
// absolute URLs. Changing the domain is a one-line change here or in .env.
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://velels.com").replace(
  /\/+$/,
  "",
);

export const siteConfig = {
  url: siteUrl,
  /** Host without the protocol, for copy that reads as a signature ("via velels.com"). */
  host: siteUrl.replace(/^https?:\/\//, ""),
  social: {
    instagram: "https://www.instagram.com/velelswim",
    instagramDm: "https://ig.me/m/velelswim",
  },
};

/**
 * Absolute URL for `path`, for metadata and JSON-LD that cannot use relative values.
 * Everything else should stay relative and let `metadataBase` resolve it.
 */
export function absoluteUrl(path = "/"): string {
  if (path === "/" || path === "") return siteUrl;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
