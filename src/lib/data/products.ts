export type Size = "XXS" | "XS" | "S" | "M" | "L";
export type ProductSlug = "azure" | "linear" | "glacier" | "dimaya" | "lendai" | "lauri" | "ezra" | "naevi" | "laydee" | "lunar" | "noblesse";
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
        src: "/products/azure.png",
        alt: "Azure black one-piece swimsuit with architectural cutouts",
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
        src: "/products/dimaya.png",
        alt: "Dimaya black one-piece swimsuit - editorial shot",
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
        src: "/products/lendai.png",
        alt: "Lendai white asymmetric swimsuit - front view",
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
        src: "/products/lauri.png",
        alt: "Lauri black two-piece swimsuit - editorial shot",
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
        src: "/products/ezra.png",
        alt: "Ezra black one-piece swimsuit - editorial shot",
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
        src: "/products/naevi.png",
        alt: "Naevi white two-piece swimsuit - editorial shot",
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
        src: "/products/linear.png",
        alt: "Linear black one-piece swimsuit with architectural cutouts",
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
        src: "/products/glacier.png",
        alt: "Glacier white two-piece bikini with molded cup top",
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
        src: "/products/laydee.png",
        alt: "Laydee black full-coverage one-piece swimsuit - editorial shot",
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
        src: "/products/lunar.png",
        alt: "Lunar black Chantilly lace dress with mandarin collar - editorial shot",
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
        src: "/products/noblesse.png",
        alt: "Noblesse black Chantilly lace resort dress - editorial shot",
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
