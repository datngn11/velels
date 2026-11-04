import { describe, expect, it } from "vitest";
import { categorySummary } from "./categorySummary";

describe("categorySummary", () => {
  it("takes the lowest price, sale included, and the full size span", () => {
    expect(
      categorySummary([
        { price: 3400, sizes: ["XS", "S", "M"] },
        { price: 3750, salePrice: 2900, sizes: ["XXS", "L"] },
      ]),
    ).toEqual({ from: 2900, sizes: "XXS–L" });
  });

  it("starts the span at XS when no Model has XXS", () => {
    expect(
      categorySummary([
        { price: 5900, sizes: ["XS", "S", "M", "L"] },
        { price: 6100, sizes: ["XS", "S", "M", "L"] },
      ]),
    ).toEqual({ from: 5900, sizes: "XS–L" });
  });

  it("is null when no Model lists a size", () => {
    expect(categorySummary([{ price: 3400, sizes: [] }])).toBeNull();
  });

  it("is null for an empty category", () => {
    expect(categorySummary([])).toBeNull();
  });
});
