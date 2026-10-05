import { createTranslator } from "next-intl";
import { describe, expect, it } from "vitest";
import en from "@/messages/en.json";
import uk from "@/messages/uk.json";
import { productImageAlt } from "./productImageAlt";

type T = Parameters<typeof productImageAlt>[0];

// The real messages, so the Ukrainian colour agreement is tested as shipped.
// The cast is needed because this translator only knows the keys in the JSON,
// while `productImageAlt` accepts any string, as production's does.
const tUk = createTranslator({ locale: "uk", messages: uk, namespace: "meta" }) as T;
const tEn = createTranslator({ locale: "en", messages: en, namespace: "meta" }) as T;

describe("productImageAlt", () => {
  it("names the model, colour and category on a grid card", () => {
    expect(productImageAlt(tUk, { name: "Azure", category: "one-piece", color: "black" })).toBe(
      "Azure, чорний суцільний купальник",
    );
    expect(productImageAlt(tEn, { name: "Azure", category: "one-piece", color: "black" })).toBe(
      "Azure, black one-piece swimsuit",
    );
  });

  it("makes the Ukrainian colour agree with a feminine noun", () => {
    expect(productImageAlt(tUk, { name: "Lunar", category: "dresses", color: "white" })).toBe(
      "Lunar, біла курортна сукня",
    );
  });

  it("adds the shot and the gallery position when given", () => {
    expect(
      productImageAlt(tUk, {
        name: "Glacier",
        category: "two-piece",
        color: "white",
        shot: "back",
        position: 3,
      }),
    ).toBe("Glacier, білий роздільний купальник, вигляд ззаду, фото 3");
    expect(
      productImageAlt(tEn, {
        name: "Glacier",
        category: "two-piece",
        color: "white",
        shot: "back",
        position: 3,
      }),
    ).toBe("Glacier, white two-piece swimsuit, back view, photo 3");
  });
});
