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

  it("is null for an empty category", () => {
    expect(categorySummary([])).toBeNull();
  });
});
