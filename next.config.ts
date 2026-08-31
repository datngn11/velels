import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/**
 * The build's calendar date in Kyiv, inlined into both bundles so server and client
 * agree on whether a sale has lapsed. See `src/lib/utils/price.ts`.
 */
const buildDate = new Date().toLocaleDateString("en-CA", {
  timeZone: "Europe/Kyiv",
});

const nextConfig: NextConfig = {
  output: "export",
  env: {
    NEXT_PUBLIC_BUILD_DATE: buildDate,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/aida-public/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/aida/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
