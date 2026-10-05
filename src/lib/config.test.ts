import { afterEach, describe, expect, it, vi } from "vitest";

// config.ts reads NEXT_PUBLIC_SITE_URL once, at import, so each case sets it
// and imports a fresh copy.
async function loadConfig(siteUrl?: string) {
  vi.resetModules();
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", siteUrl);
  return import("./config");
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("absoluteUrl", () => {
  it("returns the bare origin for the root", async () => {
    const { absoluteUrl } = await loadConfig();
    expect(absoluteUrl()).toBe("https://velels.com");
    expect(absoluteUrl("/")).toBe("https://velels.com");
  });

  it("joins a photo path to the origin, with or without a leading slash", async () => {
    const { absoluteUrl } = await loadConfig();
    expect(absoluteUrl("/products/azure/1.webp")).toBe("https://velels.com/products/azure/1.webp");
    expect(absoluteUrl("logo_black.png")).toBe("https://velels.com/logo_black.png");
  });
});

describe("localeUrl", () => {
  it("prefixes every path with its locale", async () => {
    const { localeUrl } = await loadConfig();
    expect(localeUrl("uk")).toBe("https://velels.com/uk");
    expect(localeUrl("uk", "/")).toBe("https://velels.com/uk");
    expect(localeUrl("en", "/catalog")).toBe("https://velels.com/en/catalog");
    expect(localeUrl("uk", "product/azure")).toBe("https://velels.com/uk/product/azure");
  });

  it("falls back to velels.com when the variable is unset", async () => {
    const { siteConfig } = await loadConfig(undefined);
    expect(siteConfig.url).toBe("https://velels.com");
  });

  it("gives hreflang paths for both locales, with Ukrainian as x-default", async () => {
    const { localeAlternates } = await loadConfig();
    expect(localeAlternates()).toEqual({ uk: "/uk", en: "/en", "x-default": "/uk" });
    expect(localeAlternates("product/azure")).toEqual({
      uk: "/uk/product/azure",
      en: "/en/product/azure",
      "x-default": "/uk/product/azure",
    });
  });

  it("takes the origin from NEXT_PUBLIC_SITE_URL and drops trailing slashes", async () => {
    const { localeUrl } = await loadConfig("https://staging.example.com//");
    expect(localeUrl("en", "/catalog")).toBe("https://staging.example.com/en/catalog");
  });
});
