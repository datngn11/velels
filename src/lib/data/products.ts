export type Size = "S" | "M" | "L";
export type ProductSlug = "dimaya" | "lendai" | "lauri" | "ezra";

export interface ProductImage {
  src: string;
  alt: string;
}

export interface Product {
  id: string;
  slug: ProductSlug;
  price: number;
  currency: string;
  sizes: Size[];
  images: ProductImage[];
}

export const products: Product[] = [
  {
    id: "1",
    slug: "dimaya",
    price: 240,
    currency: "USD",
    sizes: ["S", "M", "L"],
    images: [
      {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD1MQbMFPDt00NDztHZ9WzxEayyH1ZS8TuCA7Ad5dWQa1tzxWZ4zdSWriF8M1v98K7zRIGgRGmEPo6lbMPKfClr1_WSq9_rsLgkPdbEzqGbKt8RsT1gXqvK8sYnjO463AQ3_M4fwV16mx3pCtUd3zCwkkwVe7f1ivTlhLU_PywSYRxUFP2oSqL66Z81U1RnbHljnGzjr35UTEdUsSw3F2EoXqCtvJUSo7RJviPSC7SX_vhk4hXfuI4OnGKFlJggATh6Z-YUHG94kbg",
        alt: "Dimaya black one-piece swimsuit - front view",
      },
      {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBH4bW_5hCokJblTQmoCtHc3GMmouhKV-vk0XS-yfmGkr57IIMGipHn6OhyiCvtxFjvmWtBlEKpsWk0SLjGTZewzPtu9oBlWszpadjdysijws4IIMgL5qDagsiefN55k326AE1RqWmeFsYDvunZIyw9nxEQGOKQO8MHScNcKUNqqO764zIqRgNeuv4VOqqMf2nMCJDLb72eW9JPXzgHEU-Ah4qwGs27ibYjG4gQ3fmFBbE1I19E8QgL4Yt0uNTpttSvr1vMOq7F9aU",
        alt: "Dimaya black one-piece swimsuit - detail view",
      },
      {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDu7tX5frIu2d_IB8AtQ1Oo00pXGK25gmE7DQkpZVC48GAa1KiiJvfHHivx11EYmphNS3YAAEpebpRhXlusLfMevX_ajY5Dq1UPSJfcbYG0t0XoPYGGoRHNZWHqUJUtDgBb-uR1DSn4n8rFlUbS95ZP3L5gWxdco6vtfklpBfuZtY4sadVj6I7tX23Qexu3_qE16Xj2Qkkh14cWW7zE3wJu4A6d_Qy6Me3vDeeUb9EuuaRXM-4Kn-y88DH0aBdQ7bwz1izEWM0P11c",
        alt: "Dimaya black one-piece swimsuit - editorial shot",
      },
      {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBsJVHGlK-7qMlQsZLWaYLnoAP7_spjRdiu1tLrchxHVZsESVsKtnZv-RuoXuZmkDmrYDE4ef7IUyoOt40a5oZ8wpuhVbeLmjXk8L5ov7w-0lwRneDGVnre4-ziwC9UFbZZSql_DpyKIuulAYluUE0j8kkfUkOn5LVPVKQl86CaNmpdbxPoulz6biDw9KgRNQV7hjTNbwOYYaj96CCjX2d_wH5Pjf7DFBgPCmfW_YUukiV59iKy3Noe2kR2ZoYGtkLeKIaCDGuRTYo",
        alt: "Dimaya black one-piece swimsuit - texture detail",
      },
    ],
  },
  {
    id: "2",
    slug: "lendai",
    price: 260,
    currency: "USD",
    sizes: ["S", "M", "L"],
    images: [
      {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCSlj59WX-piKLDb30zULsQjKmLqzROd7obtPZ_CbfYywgYUZx8gTlHjUQwX6WrHQF3gLtyNenvuT1stVsuJH0cJpCeqPGpj8mS60whum9aRW7q2lgG75lOHLQXNEd5V9MCKg9_hVfUPA5Rdf7CXwI12o3EegSFA-upDv5HW_ioChjudpL73YAgM1DTIfWACMbyT4ARQH21WXh5mDhNUiv9aoam2kwGewLjI-0qwxFsEaUtPjT6x94QW2-koz5fNzd6Xeaz8jRAEfU",
        alt: "Lendai white asymmetric swimsuit - front view",
      },
      {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCSlj59WX-piKLDb30zULsQjKmLqzROd7obtPZ_CbfYywgYUZx8gTlHjUQwX6WrHQF3gLtyNenvuT1stVsuJH0cJpCeqPGpj8mS60whum9aRW7q2lgG75lOHLQXNEd5V9MCKg9_hVfUPA5Rdf7CXwI12o3EegSFA-upDv5HW_ioChjudpL73YAgM1DTIfWACMbyT4ARQH21WXh5mDhNUiv9aoam2kwGewLjI-0qwxFsEaUtPjT6x94QW2-koz5fNzd6Xeaz8jRAEfU",
        alt: "Lendai white asymmetric swimsuit - detail",
      },
    ],
  },
  {
    id: "3",
    slug: "lauri",
    price: 220,
    currency: "USD",
    sizes: ["S", "M", "L"],
    images: [
      {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCLkcYPVk_cfsyW7yrtBFQMVgWxny8vjF1aQZoeTppi3ppzZYtfsoRcEMjMaz2OlAJnM-b5irl-9lU_2OhPA3R84pTPrOXNqjfs7J-oVY8zka-bNOTjwKSGnoPtBQkoABkTsYXugzUYE7BndTvLT9RB24m20ATJ5f0Y0yJYwyxRCIfQ2QNf8Gq8l8FLoB-5_gZ0i_gTA-a-P-IpWpsh3UL0ULM2HDHznDzBxFlAPOhHLnffUEhnYfITcaXTRT-vCbdTuNc3fUMUX0g",
        alt: "Lauri black two-piece swimsuit - front view",
      },
      {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCLkcYPVk_cfsyW7yrtBFQMVgWxny8vjF1aQZoeTppi3ppzZYtfsoRcEMjMaz2OlAJnM-b5irl-9lU_2OhPA3R84pTPrOXNqjfs7J-oVY8zka-bNOTjwKSGnoPtBQkoABkTsYXugzUYE7BndTvLT9RB24m20ATJ5f0Y0yJYwyxRCIfQ2QNf8Gq8l8FLoB-5_gZ0i_gTA-a-P-IpWpsh3UL0ULM2HDHznDzBxFlAPOhHLnffUEhnYfITcaXTRT-vCbdTuNc3fUMUX0g",
        alt: "Lauri black two-piece swimsuit - detail",
      },
    ],
  },
  {
    id: "4",
    slug: "ezra",
    price: 180,
    currency: "USD",
    sizes: ["S", "M", "L"],
    images: [
      {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDNmdAEB6boCUr6Kce1mMYWeyRMDmZPClxUDhdZlJPsXysU9hU-VjRGMddvkfflndHm-gXBvAe0bDQw9dDpJkds0t3YGXTZnsXgFVn9VTZU4AKyjJ3hv9VD3w0kc_wjblZgCMRqB9oi14A_eklmwCHZ7jDv9Rh010obDibRDDd3di1cIfh5r25Rx55jyNGGQa7loU9ctkzIZkZCCc5Wp_EnbyELjhyZVFwXPJ2eq9FgYHBGrA6pjFbHp2-nQRQGRdWeBLzo8rLOWtI",
        alt: "Ezra black one-piece swimsuit - front view",
      },
      {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuC6rOKpmetgc027txAkZi_eBOaEiJFoT279-iobM6TRmZcuzRUSnGcC8tJmqgqw9O-FenaeMgGcwO8AjCBDVnQCCJUvH0nVYGf1JRQpKkN3GkbEXUWe4D_qBoi5YiobS75NzUT_54155lbdT_o-A7xElWV1yQklDWMQFgwamBbsSACCygw_JzoJeOPEnsp-uiekzgbt2eqwFgxKgE4_ZKW4XnXCCMA7BGc7GgK3Efkko5w241hFV_Zoeq7dpEYQKOh26GY7NNpWA8Y",
        alt: "Ezra black one-piece swimsuit - texture detail",
      },
      {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQdh5pCqSVYdx1Ddz3JYaZ58LBrM1D2GD_jTpLLpSIJv0G6ILQiBqDXM9cY_ZjoKb4WHMNVtVv5YCUmxo-bFpeE1030DXYf0qKpOp2g2StnxTBS37m9J55OIXCEl8SIxNYSmnFV9IBE0nI5Z006HoG-5iyNbXKSHEt7YVn4tye46LzEveshJ9qPf5k9pQ04-TY9iR7c5ckgnT7eIiDSWHsYH7w4QLdPQ8hVX1wcH4m44Kfzc3u-CiIpjUuFKZMOiej4z69eb3VRWQ",
        alt: "Ezra black one-piece swimsuit - side view",
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
