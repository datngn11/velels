import { describe, expect, it } from "vitest";
import { CATEGORIES, categoryFromSlug, categoryPath, categoryPaths, pathInLocale } from "./categories";

describe("category slugs", () => {
  it("round-trip in both locales, with no two categories sharing a slug", () => {
    for (const locale of ["uk", "en"]) {
      const slugs = CATEGORIES.map((c) => categoryPath(locale, c).replace("/catalog/", ""));
      expect(new Set(slugs).size).toBe(CATEGORIES.length);
      for (const c of CATEGORIES) {
        expect(categoryFromSlug(locale, categoryPath(locale, c).replace("/catalog/", ""))).toBe(c);
      }
    }
  });

  it("reject a slug from the other locale", () => {
    expect(categoryFromSlug("en", "kurortni-sukni")).toBeUndefined();
  });

  it("translate a category path on a language switch and leave others alone", () => {
    expect(pathInLocale("/catalog/kurortni-sukni", "uk", "en")).toBe("/catalog/resort-dresses");
    expect(pathInLocale("/catalog/bikinis", "en", "uk")).toBe("/catalog/rozdilni-kupalnyky");
    expect(pathInLocale("/catalog", "uk", "en")).toBe("/catalog");
    expect(pathInLocale("/product/azure", "uk", "en")).toBe("/product/azure");
  });

  it("give each category's path in every locale, for hreflang", () => {
    expect(categoryPaths("dresses")).toEqual({
      uk: "/catalog/kurortni-sukni",
      en: "/catalog/resort-dresses",
    });
  });
});
