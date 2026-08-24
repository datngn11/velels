/**
 * Indexing is opt-in. Only an explicit NEXT_PUBLIC_ALLOW_INDEXING="true"
 * permits crawling, so the GitHub Pages build — and any clone or CI runner
 * without the flag — stays noindex by default. Phase 1 sets the flag on
 * Vercel production only; preview deployments inherit the safe default.
 */
export function shouldAllowIndexing(): boolean {
  return process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
}
