import type { NextConfig } from "next";

// Read by isNewRelease(); must be inlined so server and client agree.
const buildDate = new Date().toISOString().slice(0, 10);

const nextConfig: NextConfig = {
  output: "export",
  // What `next-intl/plugin` does for this config, without the plugin: its
  // module imports @swc/core, which fails to load on some Workers Builds
  // machines (ERR_SWC_NATIVE_CACHE: no folder there passes its permission
  // check). Revisit when next-intl loads @swc/core lazily (amannn/next-intl#2437).
  turbopack: {
    resolveAlias: { "next-intl/config": "./src/i18n/request.ts" },
  },
  env: {
    NEXT_PUBLIC_BUILD_DATE: buildDate,
  },
  // Cloudflare resizes photos on velels.com only, so branch previews and local
  // builds keep the originals. Quality 90 because the originals are already
  // compressed WebP. The widths cover a phone at DPR 3 (1200) and grid cards
  // (640, 828); about 900 unique transformations a month, of 5,000 free.
  images:
    process.env.WORKERS_CI_BRANCH === "main"
      ? {
          loader: "custom",
          loaderFile: "./src/lib/imageLoader.ts",
          qualities: [90],
          deviceSizes: [640, 828, 1200, 1600],
          imageSizes: [64, 128, 256, 384],
        }
      : { unoptimized: true },
};

export default nextConfig;
