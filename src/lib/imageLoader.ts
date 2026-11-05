/**
 * Cloudflare Image Transformations for `next/image`, on `main` builds only
 * (next.config.ts): the resizer exists on the velels.com zone, not on branch
 * previews. `scale-down` never enlarges, `format=auto` picks AVIF or WebP per
 * browser, and `onerror=redirect` falls back to the original photo if a
 * transformation fails, for example past the free monthly limit.
 */
export default function cloudflareLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  const options = [
    `width=${width}`,
    `quality=${quality ?? 90}`,
    "fit=scale-down",
    "format=auto",
    "onerror=redirect",
  ];
  return `/cdn-cgi/image/${options.join(",")}${src}`;
}
