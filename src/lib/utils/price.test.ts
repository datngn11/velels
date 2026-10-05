import { describe, expect, it } from "vitest";
import { priceView } from "./price";

describe("priceView", () => {
  it("shows the list price when there is no sale", () => {
    expect(priceView({ price: 2400 })).toEqual({
      onSale: false,
      current: 2400,
      original: null,
    });
  });

  it("charges the sale price and strikes through the list price", () => {
    expect(priceView({ price: 2400, salePrice: 1900 })).toEqual({
      onSale: true,
      current: 1900,
      original: 2400,
    });
  });

  it("ignores a sale price equal to the list price", () => {
    expect(priceView({ price: 2400, salePrice: 2400 })).toEqual({
      onSale: false,
      current: 2400,
      original: null,
    });
  });

  it("ignores a sale price above the list price", () => {
    expect(priceView({ price: 2400, salePrice: 2600 })).toEqual({
      onSale: false,
      current: 2400,
      original: null,
    });
  });
});
