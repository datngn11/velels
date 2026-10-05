/**
 * Indexing is opt-in. Only an explicit NEXT_PUBLIC_ALLOW_INDEXING="true"
 * permits crawling. Workers Builds sets it for `main` only; branch builds and
 * local builds don't get it, so they stay noindex.
 */
export function shouldAllowIndexing(): boolean {
  return process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
}
