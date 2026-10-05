import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Read by isNewRelease(); must be inlined so server and client agree.
const buildDate = new Date().toISOString().slice(0, 10);

const nextConfig: NextConfig = {
  output: "export",
  env: {
    NEXT_PUBLIC_BUILD_DATE: buildDate,
  },
  images: {
    unoptimized: true,
  },
};

export default withNextIntl(nextConfig);
