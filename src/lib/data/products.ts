export type Size = "XXS" | "XS" | "S" | "M" | "L";
export type ProductSlug =
  | "azure"
  | "linear"
  | "glacier"
  | "dimaya"
  | "lendai"
  | "lauri"
  | "ezra"
  | "naevi"
  | "laydee"
  | "lunar"
  | "noblesse";
export type ProductCategory = "one-piece" | "two-piece" | "dresses";
export type ProductColor = "black" | "white";

/**
 * What a photo shows, where that is worth naming in its alt text. Tag by
 * looking at the photo: the English alts these replaced often named the wrong
 * side of the body.
 */
export type ImageShot =
  | "front"
  | "back"
  | "side"
  | "sideBack"
  | "openBack"
  | "cutout"
  | "chain"
  | "top"
  | "bottom"
  | "lace"
  | "collar"
  | "slit";

export interface ProductImage {
  src: string;
  color: ProductColor;
  /** Omit for an editorial shot. The alt is composed from this. */
  shot?: ImageShot;
}

export interface Product {
  id: string;
  slug: ProductSlug;
  category: ProductCategory;
  price: number;
  currency: string;
  sizes: Size[];
  colors: ProductColor[];
  images: ProductImage[];
  /** The day this Model entered the catalogue, `YYYY-MM-DD`. */
  releasedAt?: string;
  /** Reduced price while a sale runs. Ignored unless below `price`. */
  salePrice?: number;
}

export const products: Product[] = [
  {
    id: "1",
    slug: "dimaya",
    category: "one-piece",
    price: 3400,
    currency: "UAH",
    sizes: ["XXS", "XS", "S", "M", "L"],
    colors: ["black", "white"],
    images: [
      {
        src: "/products/dimaya/black_1.webp",
        shot: "cutout",
        color: "black",
      },
      {
        src: "/products/dimaya/black_2.webp",
        color: "black",
      },
      {
        src: "/products/dimaya/black_3.webp",
        shot: "sideBack",
        color: "black",
      },
      {
        src: "/products/dimaya/black_4.webp",
        color: "black",
      },
      {
        src: "/products/dimaya/white_1.webp",
        color: "white",
      },
      {
        src: "/products/dimaya/white_2.webp",
        color: "white",
      },
      {
        src: "/products/dimaya/white_3.webp",
        shot: "front",
        color: "white",
      },
      {
        src: "/products/dimaya/white_4.webp",
        color: "white",
      },
      {
        src: "/products/dimaya/white_5.webp",
        color: "white",
      },
      {
        src: "/products/dimaya/white_6.webp",
        shot: "openBack",
        color: "white",
      },
    ],
  },
  {
    id: "2",
    slug: "lendai",
    category: "one-piece",
    price: 3400,
    currency: "UAH",
    sizes: ["XXS", "XS", "S", "M", "L"],
    colors: ["white", "black"],
    images: [
      {
        src: "/products/lendai/white_1.webp",
        shot: "chain",
        color: "white",
      },
      {
        src: "/products/lendai/white_2.webp",
        color: "white",
      },
      {
        src: "/products/lendai/white_3.webp",
        shot: "side",
        color: "white",
      },
      {
        src: "/products/lendai/white_4.webp",
        shot: "openBack",
        color: "white",
      },
      {
        src: "/products/lendai/white_5.webp",
        color: "white",
      },
      {
        src: "/products/lendai/white_6.webp",
        color: "white",
      },
      {
        src: "/products/lendai/white_7.webp",
        shot: "openBack",
        color: "white",
      },
      {
        src: "/products/lendai/black_1.webp",
        color: "black",
      },
      {
        src: "/products/lendai/black_2.webp",
        color: "black",
      },
      {
        src: "/products/lendai/black_3.webp",
        shot: "chain",
        color: "black",
      },
      {
        src: "/products/lendai/black_4.webp",
        shot: "sideBack",
        color: "black",
      },
      {
        src: "/products/lendai/black_5.webp",
        shot: "back",
        color: "black",
      },
    ],
  },
  {
    id: "5",
    slug: "linear",
    category: "one-piece",
    price: 3750,
    currency: "UAH",
    sizes: ["XXS", "XS", "S", "M", "L"],
    colors: ["black"],
    releasedAt: "2026-08-12",
    images: [
      {
        src: "/products/linear/black_1.webp",
        shot: "cutout",
        color: "black",
      },
      {
        src: "/products/linear/black_2.webp",
        shot: "front",
        color: "black",
      },
      {
        src: "/products/linear/black_3.webp",
        shot: "cutout",
        color: "black",
      },
      {
        src: "/products/linear/black_4.webp",
        shot: "front",
        color: "black",
      },
      {
        src: "/products/linear/black_5.webp",
        color: "black",
      },
    ],
  },
  {
    id: "0",
    slug: "azure",
    category: "one-piece",
    price: 3750,
    currency: "UAH",
    sizes: ["XXS", "XS", "S", "M", "L"],
    colors: ["black"],
    releasedAt: "2026-08-12",
    images: [
      {
        src: "/products/azure/black_1.webp",
        shot: "cutout",
        color: "black",
      },
      {
        src: "/products/azure/black_2.webp",
        shot: "cutout",
        color: "black",
      },
      {
        src: "/products/azure/black_3.webp",
        color: "black",
      },
      {
        src: "/products/azure/black_4.webp",
        shot: "openBack",
        color: "black",
      },
      {
        src: "/products/azure/black_5.webp",
        shot: "front",
        color: "black",
      },
      {
        src: "/products/azure/black_6.webp",
        shot: "openBack",
        color: "black",
      },
      {
        src: "/products/azure/black_7.webp",
        shot: "openBack",
        color: "black",
      },
      {
        src: "/products/azure/black_8.webp",
        shot: "front",
        color: "black",
      },
      {
        src: "/products/azure/black_9.webp",
        shot: "cutout",
        color: "black",
      },
    ],
  },
  {
    id: "3",
    slug: "lauri",
    category: "two-piece",
    price: 2900,
    currency: "UAH",
    sizes: ["XXS", "XS", "S", "M", "L"],
    colors: ["white", "black"],
    images: [
      {
        src: "/products/lauri/white_1.webp",
        color: "white",
      },
      {
        src: "/products/lauri/white_2.webp",
        shot: "front",
        color: "white",
      },
      {
        src: "/products/lauri/white_3.webp",
        shot: "top",
        color: "white",
      },
      {
        src: "/products/lauri/white_4.webp",
        color: "white",
      },
      {
        src: "/products/lauri/white_5.webp",
        shot: "front",
        color: "white",
      },
      {
        src: "/products/lauri/white_6.webp",
        shot: "bottom",
        color: "white",
      },
      {
        src: "/products/lauri/white_7.webp",
        shot: "back",
        color: "white",
      },
      {
        src: "/products/lauri/black_1.webp",
        color: "black",
      },
      {
        src: "/products/lauri/black_2.webp",
        shot: "back",
        color: "black",
      },
      {
        src: "/products/lauri/black_3.webp",
        color: "black",
      },
      {
        src: "/products/lauri/black_4.webp",
        shot: "front",
        color: "black",
      },
      {
        src: "/products/lauri/black_5.webp",
        shot: "front",
        color: "black",
      },
      {
        src: "/products/lauri/black_6.webp",
        color: "black",
      },
    ],
  },
  {
    id: "4",
    slug: "ezra",
    category: "one-piece",
    price: 3350,
    currency: "UAH",
    sizes: ["XXS", "XS", "S", "M", "L"],
    colors: ["white", "black"],
    images: [
      {
        src: "/products/ezra/white_1.webp",
        shot: "front",
        color: "white",
      },
      {
        src: "/products/ezra/white_2.webp",
        shot: "sideBack",
        color: "white",
      },
      {
        src: "/products/ezra/white_3.webp",
        shot: "side",
        color: "white",
      },
      {
        src: "/products/ezra/white_4.webp",
        shot: "back",
        color: "white",
      },
      {
        src: "/products/ezra/white_5.webp",
        shot: "openBack",
        color: "white",
      },
      {
        src: "/products/ezra/white_6.webp",
        color: "white",
      },
      {
        src: "/products/ezra/black_1.webp",
        shot: "front",
        color: "black",
      },
      {
        src: "/products/ezra/black_2.webp",
        shot: "sideBack",
        color: "black",
      },
      {
        src: "/products/ezra/black_3.webp",
        color: "black",
      },
      {
        src: "/products/ezra/black_4.webp",
        color: "black",
      },
      {
        src: "/products/ezra/black_5.webp",
        color: "black",
      },
    ],
  },
  {
    id: "7",
    slug: "naevi",
    category: "two-piece",
    price: 2700,
    currency: "UAH",
    sizes: ["XXS", "XS", "S", "M", "L"],
    colors: ["black", "white"],
    images: [
      {
        src: "/products/naevi/black_1.webp",
        color: "black",
      },
      {
        src: "/products/naevi/black_2.webp",
        color: "black",
      },
      {
        src: "/products/naevi/black_3.webp",
        shot: "top",
        color: "black",
      },
      {
        src: "/products/naevi/black_4.webp",
        color: "black",
      },
      {
        src: "/products/naevi/black_5.webp",
        color: "black",
      },
      {
        src: "/products/naevi/black_6.webp",
        shot: "back",
        color: "black",
      },
      {
        src: "/products/naevi/white_1.webp",
        shot: "front",
        color: "white",
      },
      {
        src: "/products/naevi/white_2.webp",
        color: "white",
      },
      {
        src: "/products/naevi/white_3.webp",
        shot: "front",
        color: "white",
      },
      {
        src: "/products/naevi/white_4.webp",
        shot: "front",
        color: "white",
      },
    ],
  },
  {
    id: "6",
    slug: "glacier",
    category: "two-piece",
    price: 3100,
    currency: "UAH",
    sizes: ["XXS", "XS", "S", "M", "L"],
    colors: ["white"],
    releasedAt: "2026-08-12",
    images: [
      {
        src: "/products/glacier/white_1.webp",
        shot: "front",
        color: "white",
      },
      {
        src: "/products/glacier/white_2.webp",
        shot: "front",
        color: "white",
      },
      {
        src: "/products/glacier/white_3.webp",
        color: "white",
      },
      {
        src: "/products/glacier/white_4.webp",
        shot: "back",
        color: "white",
      },
      {
        src: "/products/glacier/white_5.webp",
        shot: "front",
        color: "white",
      },
      {
        src: "/products/glacier/white_6.webp",
        shot: "top",
        color: "white",
      },
    ],
  },
  {
    id: "8",
    slug: "laydee",
    category: "one-piece",
    price: 3350,
    currency: "UAH",
    sizes: ["XXS", "XS", "S", "M", "L"],
    colors: ["white", "black"],
    images: [
      {
        src: "/products/laydee/white_1.webp",
        color: "white",
      },
      {
        src: "/products/laydee/white_2.webp",
        shot: "chain",
        color: "white",
      },
      {
        src: "/products/laydee/white_3.webp",
        color: "white",
      },
      {
        src: "/products/laydee/white_4.webp",
        shot: "front",
        color: "white",
      },
      {
        src: "/products/laydee/white_5.webp",
        color: "white",
      },
      {
        src: "/products/laydee/black_1.webp",
        shot: "front",
        color: "black",
      },
      {
        src: "/products/laydee/black_2.webp",
        color: "black",
      },
      {
        src: "/products/laydee/black_3.webp",
        shot: "side",
        color: "black",
      },
      {
        src: "/products/laydee/black_4.webp",
        color: "black",
      },
    ],
  },
  {
    id: "9",
    slug: "lunar",
    category: "dresses",
    price: 5900,
    currency: "UAH",
    sizes: ["XS", "S", "M", "L"],
    colors: ["black", "white"],
    releasedAt: "2026-08-12",
    images: [
      {
        src: "/products/lunar/black_1.webp",
        color: "black",
      },
      {
        src: "/products/lunar/black_2.webp",
        color: "black",
      },
      {
        src: "/products/lunar/black_3.webp",
        shot: "slit",
        color: "black",
      },
      {
        src: "/products/lunar/black_4.webp",
        shot: "lace",
        color: "black",
      },
      {
        src: "/products/lunar/white_1.webp",
        color: "white",
      },
      {
        src: "/products/lunar/white_2.webp",
        shot: "collar",
        color: "white",
      },
      {
        src: "/products/lunar/white_3.webp",
        color: "white",
      },
      {
        src: "/products/lunar/white_4.webp",
        color: "white",
      },
    ],
  },
  {
    id: "10",
    slug: "noblesse",
    category: "dresses",
    price: 6100,
    currency: "UAH",
    sizes: ["XS", "S", "M", "L"],
    colors: ["black"],
    releasedAt: "2026-08-12",
    images: [
      {
        src: "/products/noblesse/black_1.webp",
        color: "black",
      },
      {
        src: "/products/noblesse/black_2.webp",
        color: "black",
      },
      {
        src: "/products/noblesse/black_3.webp",
        shot: "openBack",
        color: "black",
      },
      {
        src: "/products/noblesse/black_4.webp",
        color: "black",
      },
      {
        src: "/products/noblesse/black_5.webp",
        shot: "front",
        color: "black",
      },
      {
        src: "/products/noblesse/black_6.webp",
        shot: "openBack",
        color: "black",
      },
      {
        src: "/products/noblesse/black_7.webp",
        shot: "openBack",
        color: "black",
      },
      {
        src: "/products/noblesse/black_8.webp",
        color: "black",
      },
    ],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getAllProductSlugs(): string[] {
  return products.map((p) => p.slug);
}
