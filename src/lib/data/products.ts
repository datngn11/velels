import { getAssetPath } from "@/lib/utils/assetPath";

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

export interface ProductImage {
  src: string;
  alt: string;
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
}

export const products: Product[] = [
  {
    id: "0",
    slug: "azure",
    category: "one-piece",
    price: 3750,
    currency: "UAH",
    sizes: ["XXS", "XS", "S", "M", "L"],
    colors: ["black"],
    images: [
      {
        src: getAssetPath("/products/azure/1.webp"),
        alt: "Azure black one-piece swimsuit - front view",
      },
      {
        src: getAssetPath("/products/azure/2.webp"),
        alt: "Azure black one-piece swimsuit - side silhouette",
      },
      {
        src: getAssetPath("/products/azure/3.webp"),
        alt: "Azure black one-piece swimsuit - back detail",
      },
      {
        src: getAssetPath("/products/azure/4.webp"),
        alt: "Azure black one-piece swimsuit - fabric close-up",
      },
      {
        src: getAssetPath("/products/azure/5.webp"),
        alt: "Azure black one-piece swimsuit - editorial portrait",
      },
    ],
  },
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
        src: getAssetPath("/products/dimaya/1.webp"),
        alt: "Dimaya one-piece swimsuit - front view",
      },
      {
        src: getAssetPath("/products/dimaya/2.webp"),
        alt: "Dimaya one-piece swimsuit - side view",
      },
      {
        src: getAssetPath("/products/dimaya/3.webp"),
        alt: "Dimaya one-piece swimsuit - back view",
      },
      {
        src: getAssetPath("/products/dimaya/4.webp"),
        alt: "Dimaya one-piece swimsuit - detail shot",
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
    colors: ["black", "white"],
    images: [
      {
        src: getAssetPath("/products/lendai/1.webp"),
        alt: "Lendai asymmetric swimsuit - front view",
      },
      {
        src: getAssetPath("/products/lendai/2.webp"),
        alt: "Lendai asymmetric swimsuit - angle view",
      },
      {
        src: getAssetPath("/products/lendai/3.webp"),
        alt: "Lendai asymmetric swimsuit - back view",
      },
      {
        src: getAssetPath("/products/lendai/4.webp"),
        alt: "Lendai asymmetric swimsuit - styling detail",
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
    colors: ["black", "white"],
    images: [
      {
        src: getAssetPath("/products/lauri/1.webp"),
        alt: "Lauri two-piece swimsuit - editorial shot",
      },
      {
        src: getAssetPath("/products/lauri/2.webp"),
        alt: "Lauri two-piece swimsuit - top detail",
      },
      {
        src: getAssetPath("/products/lauri/3.webp"),
        alt: "Lauri two-piece swimsuit - bottom detail",
      },
      {
        src: getAssetPath("/products/lauri/4.webp"),
        alt: "Lauri two-piece swimsuit - side silhouette",
      },
      {
        src: getAssetPath("/products/lauri/5.webp"),
        alt: "Lauri two-piece swimsuit - back view",
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
    colors: ["black", "white"],
    images: [
      {
        src: getAssetPath("/products/ezra/1.webp"),
        alt: "Ezra one-piece swimsuit - front view",
      },
      {
        src: getAssetPath("/products/ezra/2.webp"),
        alt: "Ezra one-piece swimsuit - side view",
      },
      {
        src: getAssetPath("/products/ezra/3.webp"),
        alt: "Ezra one-piece swimsuit - back cut",
      },
      {
        src: getAssetPath("/products/ezra/4.webp"),
        alt: "Ezra one-piece swimsuit - texture detail",
      },
      {
        src: getAssetPath("/products/ezra/5.webp"),
        alt: "Ezra one-piece swimsuit - alternate colorway",
      },
      {
        src: getAssetPath("/products/ezra/6.webp"),
        alt: "Ezra one-piece swimsuit - editorial crop",
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
        src: getAssetPath("/products/naevi/1.webp"),
        alt: "Naevi two-piece swimsuit - front view",
      },
      {
        src: getAssetPath("/products/naevi/2.webp"),
        alt: "Naevi two-piece swimsuit - side view",
      },
      {
        src: getAssetPath("/products/naevi/3.webp"),
        alt: "Naevi two-piece swimsuit - back view",
      },
      {
        src: getAssetPath("/products/naevi/4.webp"),
        alt: "Naevi two-piece swimsuit - detail shot",
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
    images: [
      {
        src: getAssetPath("/products/linear/1.webp"),
        alt: "Linear one-piece swimsuit - architectural cutouts front view",
      },
      {
        src: getAssetPath("/products/linear/2.webp"),
        alt: "Linear one-piece swimsuit - side view",
      },
      {
        src: getAssetPath("/products/linear/3.webp"),
        alt: "Linear one-piece swimsuit - back cutout",
      },
      {
        src: getAssetPath("/products/linear/4.webp"),
        alt: "Linear one-piece swimsuit - detail close-up",
      },
      {
        src: getAssetPath("/products/linear/5.webp"),
        alt: "Linear one-piece swimsuit - editorial portrait",
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
    images: [
      {
        src: getAssetPath("/products/glacier/1.webp"),
        alt: "Glacier white two-piece bikini - front view",
      },
      {
        src: getAssetPath("/products/glacier/2.webp"),
        alt: "Glacier white two-piece bikini - molded cup detail",
      },
      {
        src: getAssetPath("/products/glacier/3.webp"),
        alt: "Glacier white two-piece bikini - back view",
      },
      {
        src: getAssetPath("/products/glacier/4.webp"),
        alt: "Glacier white two-piece bikini - drape detail",
      },
      {
        src: getAssetPath("/products/glacier/5.webp"),
        alt: "Glacier white two-piece bikini - side silhouette",
      },
      {
        src: getAssetPath("/products/glacier/6.webp"),
        alt: "Glacier white two-piece bikini - editorial shot",
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
    colors: ["black", "white"],
    images: [
      {
        src: getAssetPath("/products/laydee/1.webp"),
        alt: "Laydee one-piece swimsuit - full coverage front view",
      },
      {
        src: getAssetPath("/products/laydee/2.webp"),
        alt: "Laydee one-piece swimsuit - neckline chain detail",
      },
      {
        src: getAssetPath("/products/laydee/3.webp"),
        alt: "Laydee one-piece swimsuit - back view",
      },
      {
        src: getAssetPath("/products/laydee/4.webp"),
        alt: "Laydee one-piece swimsuit - side view",
      },
      {
        src: getAssetPath("/products/laydee/5.webp"),
        alt: "Laydee one-piece swimsuit - styling shot",
      },
    ],
  },
  {
    id: "9",
    slug: "lunar",
    category: "dresses",
    price: 5900,
    currency: "UAH",
    sizes: ["XXS", "XS", "S", "M", "L"],
    colors: ["black", "white"],
    images: [
      {
        src: getAssetPath("/products/lunar/1.webp"),
        alt: "Lunar Chantilly lace dress - editorial shot",
      },
      {
        src: getAssetPath("/products/lunar/2.webp"),
        alt: "Lunar Chantilly lace dress - mandarin collar detail",
      },
      {
        src: getAssetPath("/products/lunar/3.webp"),
        alt: "Lunar Chantilly lace dress - slit detail",
      },
      {
        src: getAssetPath("/products/lunar/4.webp"),
        alt: "Lunar Chantilly lace dress - lace pattern close-up",
      },
    ],
  },
  {
    id: "10",
    slug: "noblesse",
    category: "dresses",
    price: 6000,
    currency: "UAH",
    sizes: ["XXS", "XS", "S", "M", "L"],
    colors: ["black"],
    images: [
      {
        src: getAssetPath("/products/noblesse/1.webp"),
        alt: "Noblesse Chantilly lace resort dress - full length view",
      },
      {
        src: getAssetPath("/products/noblesse/2.webp"),
        alt: "Noblesse Chantilly lace resort dress - sheer fabric close-up",
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
