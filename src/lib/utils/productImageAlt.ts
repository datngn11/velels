import type {
  ImageShot,
  ProductCategory,
  ProductColor,
} from "@/lib/data/products";

/** `meta` key holding the singular category noun. Feeds the title and the alt. */
export const CATEGORY_KEY: Record<ProductCategory, string> = {
  "one-piece": "categoryOnePiece",
  "two-piece": "categoryTwoPiece",
  dresses: "categoryDresses",
};

/**
 * Takes `category` as an ICU select value: Ukrainian adjectives agree with the
 * noun, «чорний купальник» but «чорна сукня».
 */
const COLOR_KEY: Record<ProductColor, string> = {
  black: "imageColorBlack",
  white: "imageColorWhite",
};

type MetaTranslator = (
  key: string,
  values?: Record<string, string | number>,
) => string;

/**
 * Alt for one product photo: model, colour and category, then what the shot
 * shows and its place in the gallery, where either applies.
 *
 * Pass `position` inside a gallery, where it is all that tells two editorial
 * shots apart. Omit it on a grid card, which shows one photo.
 */
export function productImageAlt(
  t: MetaTranslator,
  opts: {
    name: string;
    category: ProductCategory;
    color: ProductColor;
    shot?: ImageShot;
    position?: number;
  },
): string {
  const color = t(COLOR_KEY[opts.color], { category: opts.category });
  const parts = [`${opts.name}, ${color} ${t(CATEGORY_KEY[opts.category])}`];
  if (opts.shot) parts.push(t(`imageShot.${opts.shot}`));
  if (opts.position !== undefined) {
    parts.push(t("imagePosition", { n: opts.position }));
  }
  return parts.join(", ");
}
