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
  color?: ProductColor;
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
        src: getAssetPath("/products/azure/black_1.webp"),
        alt: "Azure black one-piece swimsuit - front view",
        color: "black",
      },
      {
        src: getAssetPath("/products/azure/black_2.webp"),
        alt: "Azure black one-piece swimsuit - side silhouette",
        color: "black",
      },
      {
        src: getAssetPath("/products/azure/black_3.webp"),
        alt: "Azure black one-piece swimsuit - back detail",
        color: "black",
      },
      {
        src: getAssetPath("/products/azure/black_4.webp"),
        alt: "Azure black one-piece swimsuit - fabric close-up",
        color: "black",
      },
      {
        src: getAssetPath("/products/azure/black_5.webp"),
        alt: "Azure black one-piece swimsuit - editorial portrait",
        color: "black",
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
        src: getAssetPath("/products/dimaya/black_1.webp"),
        alt: "Dimaya black one-piece swimsuit - seated lounge shot with cutout detail",
        color: "black",
      },
      {
        src: getAssetPath("/products/dimaya/black_2.webp"),
        alt: "Dimaya black one-piece swimsuit - standing editorial look",
        color: "black",
      },
      {
        src: getAssetPath("/products/dimaya/black_3.webp"),
        alt: "Dimaya black one-piece swimsuit - side and back profile view",
        color: "black",
      },
      {
        src: getAssetPath("/products/dimaya/black_4.webp"),
        alt: "Dimaya black one-piece swimsuit - sunbed editorial pose",
        color: "black",
      },
      {
        src: getAssetPath("/products/dimaya/white_1.webp"),
        alt: "Dimaya white one-piece swimsuit - palm fronds portrait",
        color: "white",
      },
      {
        src: getAssetPath("/products/dimaya/white_2.webp"),
        alt: "Dimaya white one-piece swimsuit - shoreline walking shot",
        color: "white",
      },
      {
        src: getAssetPath("/products/dimaya/white_3.webp"),
        alt: "Dimaya white one-piece swimsuit - full length back cut on beach",
        color: "white",
      },
      {
        src: getAssetPath("/products/dimaya/white_4.webp"),
        alt: "Dimaya white one-piece swimsuit - sunset beach portrait",
        color: "white",
      },
      {
        src: getAssetPath("/products/dimaya/white_5.webp"),
        alt: "Dimaya white one-piece swimsuit - golden hour editorial pose",
        color: "white",
      },
      {
        src: getAssetPath("/products/dimaya/white_6.webp"),
        alt: "Dimaya white one-piece swimsuit - side profile on coast",
        color: "white",
      },
      {
        src: getAssetPath("/products/dimaya/white_7.webp"),
        alt: "Dimaya white one-piece swimsuit - front perspective against sunset",
        color: "white",
      },
      {
        src: getAssetPath("/products/dimaya/white_8.webp"),
        alt: "Dimaya white one-piece swimsuit - ocean water background shot",
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
    colors: ["black", "white"],
    images: [
      {
        src: getAssetPath("/products/lendai/black_1.webp"),
        alt: "Lendai black one-piece swimsuit - editorial portrait on beach lounger",
        color: "black",
      },
      {
        src: getAssetPath("/products/lendai/black_2.webp"),
        alt: "Lendai black one-piece swimsuit - beach atmosphere shot",
        color: "black",
      },
      {
        src: getAssetPath("/products/lendai/black_3.webp"),
        alt: "Lendai black one-piece swimsuit - chain centerpiece and neckline detail",
        color: "black",
      },
      {
        src: getAssetPath("/products/lendai/black_4.webp"),
        alt: "Lendai black one-piece swimsuit - side and back profile with cap",
        color: "black",
      },
      {
        src: getAssetPath("/products/lendai/black_5.webp"),
        alt: "Lendai black one-piece swimsuit - full standing back view along shoreline",
        color: "black",
      },
      {
        src: getAssetPath("/products/lendai/white_1.webp"),
        alt: "Lendai white one-piece swimsuit - cliffside portrait",
        color: "white",
      },
      {
        src: getAssetPath("/products/lendai/white_2.webp"),
        alt: "Lendai white one-piece swimsuit - side view by the sea",
        color: "white",
      },
      {
        src: getAssetPath("/products/lendai/white_3.webp"),
        alt: "Lendai white one-piece swimsuit - back cut and rocky cliff view",
        color: "white",
      },
      {
        src: getAssetPath("/products/lendai/white_4.webp"),
        alt: "Lendai white one-piece swimsuit - editorial styling amongst pine trees",
        color: "white",
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
        src: getAssetPath("/products/lauri/black_1.webp"),
        alt: "Lauri black two-piece swimsuit - editorial shot",
        color: "black",
      },
      {
        src: getAssetPath("/products/lauri/black_2.webp"),
        alt: "Lauri black two-piece swimsuit - top detail",
        color: "black",
      },
      {
        src: getAssetPath("/products/lauri/black_3.webp"),
        alt: "Lauri black two-piece swimsuit - side silhouette",
        color: "black",
      },
      {
        src: getAssetPath("/products/lauri/black_4.webp"),
        alt: "Lauri black two-piece swimsuit - fit detail",
        color: "black",
      },
      {
        src: getAssetPath("/products/lauri/black_5.webp"),
        alt: "Lauri black two-piece swimsuit - back view",
        color: "black",
      },
      {
        src: getAssetPath("/products/lauri/black_6.webp"),
        alt: "Lauri black two-piece swimsuit - styling shot",
        color: "black",
      },
      {
        src: getAssetPath("/products/lauri/white_1.webp"),
        alt: "Lauri white two-piece swimsuit - editorial shot",
        color: "white",
      },
      {
        src: getAssetPath("/products/lauri/white_2.webp"),
        alt: "Lauri white two-piece swimsuit - top detail",
        color: "white",
      },
      {
        src: getAssetPath("/products/lauri/white_3.webp"),
        alt: "Lauri white two-piece swimsuit - bottom detail",
        color: "white",
      },
      {
        src: getAssetPath("/products/lauri/white_4.webp"),
        alt: "Lauri white two-piece swimsuit - side silhouette",
        color: "white",
      },
      {
        src: getAssetPath("/products/lauri/white_5.webp"),
        alt: "Lauri white two-piece swimsuit - back view",
        color: "white",
      },
      {
        src: getAssetPath("/products/lauri/white_6.webp"),
        alt: "Lauri white two-piece swimsuit - alternate angle view",
        color: "white",
      },
      {
        src: getAssetPath("/products/lauri/white_7.webp"),
        alt: "Lauri white two-piece swimsuit - styling detail",
        color: "white",
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
        src: getAssetPath("/products/ezra/black_1.webp"),
        alt: "Ezra black one-piece swimsuit with white piping - front view by sea wall",
        color: "black",
      },
      {
        src: getAssetPath("/products/ezra/black_2.webp"),
        alt: "Ezra black one-piece swimsuit with white piping - side and back profile",
        color: "black",
      },
      {
        src: getAssetPath("/products/ezra/black_3.webp"),
        alt: "Ezra black one-piece swimsuit with white piping - neckline detail shot",
        color: "black",
      },
      {
        src: getAssetPath("/products/ezra/black_4.webp"),
        alt: "Ezra black one-piece swimsuit with white piping - reclining editorial pose",
        color: "black",
      },
      {
        src: getAssetPath("/products/ezra/black_5.webp"),
        alt: "Ezra black one-piece swimsuit with white piping - seated sea wall portrait",
        color: "black",
      },
      {
        src: getAssetPath("/products/ezra/white_1.webp"),
        alt: "Ezra white one-piece swimsuit - front water view",
        color: "white",
      },
      {
        src: getAssetPath("/products/ezra/white_2.webp"),
        alt: "Ezra white one-piece swimsuit - side water view",
        color: "white",
      },
      {
        src: getAssetPath("/products/ezra/white_3.webp"),
        alt: "Ezra white one-piece swimsuit - back cut",
        color: "white",
      },
      {
        src: getAssetPath("/products/ezra/white_4.webp"),
        alt: "Ezra white one-piece swimsuit - texture detail",
        color: "white",
      },
      {
        src: getAssetPath("/products/ezra/white_5.webp"),
        alt: "Ezra white one-piece swimsuit - shoreline pose",
        color: "white",
      },
      {
        src: getAssetPath("/products/ezra/white_6.webp"),
        alt: "Ezra white one-piece swimsuit - editorial crop",
        color: "white",
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
        src: getAssetPath("/products/naevi/black_1.webp"),
        alt: "Naevi black two-piece swimsuit - editorial portrait on black sand beach",
        color: "black",
      },
      {
        src: getAssetPath("/products/naevi/black_2.webp"),
        alt: "Naevi black two-piece swimsuit - editorial styling shot",
        color: "black",
      },
      {
        src: getAssetPath("/products/naevi/black_3.webp"),
        alt: "Naevi black two-piece swimsuit - fit and neckline detail",
        color: "black",
      },
      {
        src: getAssetPath("/products/naevi/black_4.webp"),
        alt: "Naevi black two-piece swimsuit - rock silhouette pose",
        color: "black",
      },
      {
        src: getAssetPath("/products/naevi/black_5.webp"),
        alt: "Naevi black two-piece swimsuit - dynamic cliffside shot",
        color: "black",
      },
      {
        src: getAssetPath("/products/naevi/black_6.webp"),
        alt: "Naevi black two-piece swimsuit - back view walking along shoreline",
        color: "black",
      },
      {
        src: getAssetPath("/products/naevi/white_1.webp"),
        alt: "Naevi white two-piece swimsuit - front view",
        color: "white",
      },
      {
        src: getAssetPath("/products/naevi/white_2.webp"),
        alt: "Naevi white two-piece swimsuit - side view",
        color: "white",
      },
      {
        src: getAssetPath("/products/naevi/white_3.webp"),
        alt: "Naevi white two-piece swimsuit - back view",
        color: "white",
      },
      {
        src: getAssetPath("/products/naevi/white_4.webp"),
        alt: "Naevi white two-piece swimsuit - detail shot",
        color: "white",
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
        src: getAssetPath("/products/linear/black_1.webp"),
        alt: "Linear one-piece swimsuit - architectural cutouts front view",
        color: "black",
      },
      {
        src: getAssetPath("/products/linear/black_2.webp"),
        alt: "Linear one-piece swimsuit - side view",
        color: "black",
      },
      {
        src: getAssetPath("/products/linear/black_3.webp"),
        alt: "Linear one-piece swimsuit - back cutout",
        color: "black",
      },
      {
        src: getAssetPath("/products/linear/black_4.webp"),
        alt: "Linear one-piece swimsuit - detail close-up",
        color: "black",
      },
      {
        src: getAssetPath("/products/linear/black_5.webp"),
        alt: "Linear one-piece swimsuit - editorial portrait",
        color: "black",
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
        src: getAssetPath("/products/glacier/white_1.webp"),
        alt: "Glacier white two-piece bikini - front view",
        color: "white",
      },
      {
        src: getAssetPath("/products/glacier/white_2.webp"),
        alt: "Glacier white two-piece bikini - molded cup detail",
        color: "white",
      },
      {
        src: getAssetPath("/products/glacier/white_3.webp"),
        alt: "Glacier white two-piece bikini - back view",
        color: "white",
      },
      {
        src: getAssetPath("/products/glacier/white_4.webp"),
        alt: "Glacier white two-piece bikini - drape detail",
        color: "white",
      },
      {
        src: getAssetPath("/products/glacier/white_5.webp"),
        alt: "Glacier white two-piece bikini - side silhouette",
        color: "white",
      },
      {
        src: getAssetPath("/products/glacier/white_6.webp"),
        alt: "Glacier white two-piece bikini - editorial shot",
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
    colors: ["black", "white"],
    images: [
      {
        src: getAssetPath("/products/laydee/black_1.webp"),
        alt: "Laydee black one-piece swimsuit - editorial sunset front view",
        color: "black",
      },
      {
        src: getAssetPath("/products/laydee/black_2.webp"),
        alt: "Laydee black one-piece swimsuit - sunset portrait crop",
        color: "black",
      },
      {
        src: getAssetPath("/products/laydee/black_3.webp"),
        alt: "Laydee black one-piece swimsuit - side and back silhouette",
        color: "black",
      },
      {
        src: getAssetPath("/products/laydee/black_4.webp"),
        alt: "Laydee black one-piece swimsuit - full length beach shot",
        color: "black",
      },
      {
        src: getAssetPath("/products/laydee/white_1.webp"),
        alt: "Laydee white one-piece swimsuit - neckline chain detail",
        color: "white",
      },
      {
        src: getAssetPath("/products/laydee/white_2.webp"),
        alt: "Laydee white one-piece swimsuit - front view",
        color: "white",
      },
      {
        src: getAssetPath("/products/laydee/white_3.webp"),
        alt: "Laydee white one-piece swimsuit - back view",
        color: "white",
      },
      {
        src: getAssetPath("/products/laydee/white_4.webp"),
        alt: "Laydee white one-piece swimsuit - side view",
        color: "white",
      },
      {
        src: getAssetPath("/products/laydee/white_5.webp"),
        alt: "Laydee white one-piece swimsuit - styling shot",
        color: "white",
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
    images: [
      {
        src: getAssetPath("/products/lunar/black_1.webp"),
        alt: "Lunar black Chantilly lace dress - editorial shot",
        color: "black",
      },
      {
        src: getAssetPath("/products/lunar/black_2.webp"),
        alt: "Lunar black Chantilly lace dress - mandarin collar detail",
        color: "black",
      },
      {
        src: getAssetPath("/products/lunar/black_3.webp"),
        alt: "Lunar black Chantilly lace dress - slit detail",
        color: "black",
      },
      {
        src: getAssetPath("/products/lunar/black_4.webp"),
        alt: "Lunar black Chantilly lace dress - lace pattern close-up",
        color: "black",
      },
      {
        src: getAssetPath("/products/lunar/white_1.webp"),
        alt: "Lunar white Chantilly lace dress - full length evening portrait",
        color: "white",
      },
      {
        src: getAssetPath("/products/lunar/white_2.webp"),
        alt: "Lunar white Chantilly lace dress - mandarin collar and button detail",
        color: "white",
      },
      {
        src: getAssetPath("/products/lunar/white_3.webp"),
        alt: "Lunar white Chantilly lace dress - reclining editorial pose",
        color: "white",
      },
      {
        src: getAssetPath("/products/lunar/white_4.webp"),
        alt: "Lunar white Chantilly lace dress - lace pattern and high slit detail",
        color: "white",
      },
    ],
  },
  {
    id: "10",
    slug: "noblesse",
    category: "dresses",
    price: 6000,
    currency: "UAH",
    sizes: ["XS", "S", "M", "L"],
    colors: ["black"],
    images: [
      {
        src: getAssetPath("/products/noblesse/black_1.webp"),
        alt: "Noblesse Chantilly lace resort dress - full length view",
        color: "black",
      },
      {
        src: getAssetPath("/products/noblesse/black_2.webp"),
        alt: "Noblesse Chantilly lace resort dress - sheer fabric close-up",
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
