// Fails when the locale files under src/messages are not key-identical.
// next-intl renders a missing key as its path and the build still succeeds,
// so nothing else catches a key added to one language only. Array items are
// compared by index, so an info page with a section missing also fails.

import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const dir = path.join(import.meta.dirname, "..", "src", "messages");

function shape(value, prefix, out) {
  const kind = Array.isArray(value) ? "array" : value === null ? "null" : typeof value;
  if (prefix) out.set(prefix, kind);
  if (kind === "array" || kind === "object") {
    for (const [key, child] of Object.entries(value)) {
      shape(child, prefix ? `${prefix}.${key}` : key, out);
    }
  }
  return out;
}

const files = readdirSync(dir).filter((f) => f.endsWith(".json")).sort();
const shapes = files.map((f) => shape(JSON.parse(readFileSync(path.join(dir, f), "utf8")), "", new Map()));
const [refFile, ...others] = files;
const [ref, ...rest] = shapes;

let problems = 0;
rest.forEach((other, i) => {
  const file = others[i];
  for (const [key, kind] of ref) {
    if (!other.has(key)) {
      console.error(`${key}: in ${refFile}, missing from ${file}`);
      problems++;
    } else if (other.get(key) !== kind) {
      console.error(`${key}: ${kind} in ${refFile}, ${other.get(key)} in ${file}`);
      problems++;
    }
  }
  for (const key of other.keys()) {
    if (!ref.has(key)) {
      console.error(`${key}: in ${file}, missing from ${refFile}`);
      problems++;
    }
  }
});

if (files.length < 2) {
  console.error(`Expected at least two locale files in ${dir}, found ${files.length}`);
  process.exit(1);
}
if (problems > 0) {
  console.error(`\n${problems} locale key mismatch(es) across ${files.join(", ")}`);
  process.exit(1);
}

const leaves = [...ref.values()].filter((k) => k !== "object" && k !== "array").length;
console.log(`${files.join(", ")} are key-identical: ${leaves} leaf keys, ${ref.size} in all`);
