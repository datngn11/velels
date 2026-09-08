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
    // No `icons` yet — the brand mark has to come from the owner, not be derived
    // from the wordmark. When the files land, add them as src/app/icon.png (256x256)
    // and src/app/apple-icon.png (180x180, opaque — iOS fills transparency with
    // black), and list them here. See lite L3.
  };
}
