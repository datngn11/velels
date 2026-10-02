// Fails a Workers Builds build when any page in out/ lacks the Umami script.
// The id is a build variable, and a value in the wrong dashboard box builds
// fine and ships without analytics. Matches a real <script> element, since a
// preload link alone loads nothing. Skipped outside Workers Builds, and on
// branch builds, which get no build variables. Strict on main.

import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

if (!process.env.WORKERS_CI) {
  console.log("Umami check skipped: not a Workers Builds build");
  process.exit(0);
}

if (!process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && process.env.WORKERS_CI_BRANCH !== "main") {
  console.log(`Umami check skipped: branch ${process.env.WORKERS_CI_BRANCH} has no build variables`);
  process.exit(0);
}

if (!process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID) {
  console.error("NEXT_PUBLIC_UMAMI_WEBSITE_ID is not set. Add it in Settings → Builds → Variables and secrets.");
  process.exit(1);
}

const out = path.join(import.meta.dirname, "..", "out");
const pages = readdirSync(out, { recursive: true }).filter((f) => f.endsWith(".html"));
const tag = /<script[^>]+cloud\.umami\.is/;
const missing = pages.filter((f) => !tag.test(readFileSync(path.join(out, f), "utf8")));

if (pages.length === 0 || missing.length > 0) {
  for (const f of missing) console.error(`No Umami script: out/${f}`);
  console.error(`${pages.length - missing.length} of ${pages.length} HTML files load Umami`);
  process.exit(1);
}

console.log(`${pages.length} of ${pages.length} HTML files load Umami`);
