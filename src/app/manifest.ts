import type { MetadataRoute } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

/**
 * Emitted as `out/manifest.webmanifest`. Required under `output: "export"` for the
 * same reason as sitemap.ts and robots.ts — see the note in robots.ts.
 */
export const dynamic = "force-static";

/**
 * What a phone reads when someone saves the site to their home screen. Sits outside
 * the `[locale]` tree, so it can only describe one language: the default locale.
 */
export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const t = await getTranslations({
    locale: routing.defaultLocale,
    namespace: "meta",
  });

  return {
    name: t("homeTitle"),
    short_name: t("siteName"),
    description: t("homeDescription"),
    start_url: `/${routing.defaultLocale}`,
    // Not "standalone": this is a catalogue, and its primary call to action hands
    // the visitor to Instagram. Stripping the browser chrome from a site that
    // deliberately sends people elsewhere makes leaving harder, not easier.
    display: "minimal-ui",
    background_color: "#ffffff",
    theme_color: "#000000",
    // These are Android's, and separate on purpose: the tab and iOS icons come
    // from src/app/{favicon.ico,icon.png,apple-icon.png} via Next's file
    // convention, which a manifest does not replace. Kept in public/ so they stay
    // out of <head> — nothing should download a 512px icon to draw a tab.
    // Not "maskable": the mark spans 89% of the width, well outside Android's 80%
    // safe circle, so declaring it would let the adaptive mask clip the letters.
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
