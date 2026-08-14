export const basePath =
  process.env.NEXT_PUBLIC_BASE_PATH ??
  process.env.BASE_PATH ??
  (process.env.NODE_ENV === "production" ? "/velels" : "");

/**
 * Returns the correct asset path prefixed with basePath when running in production/GitHub Pages.
 */
export function getAssetPath(path: string): string {
  if (!path) return path;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${cleanPath}`;
}
