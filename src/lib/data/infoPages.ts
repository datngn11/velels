/** The `/info/*` pages. Each needs an `info.<slug>` entry in both locale files. */
export const INFO_SLUGS = [
  "delivery",
  "returns",
  "faq",
  "payment",
  "care",
  "about",
  "privacy",
  "terms",
  "contact",
] as const;

export type InfoSlug = (typeof INFO_SLUGS)[number];

export function isInfoSlug(slug: string): slug is InfoSlug {
  return (INFO_SLUGS as readonly string[]).includes(slug);
}
