<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:project-rules -->

# Project Guidelines & Rules

This project is a luxury e-commerce site utilizing modern frontend architecture. All AI agents must strictly follow these rules:

1. **Tailwind CSS v4**:
   - This project uses Tailwind CSS v4 which is CSS-first.
   - We use the `@theme` directive in `src/app/globals.css`.
   - Tailwind scans only `src/` (`@import "tailwindcss" source("..")`), so a class name in the docs or the README emits no CSS. A class used outside `src/` will not exist.
   - **CRITICAL**: Do NOT attempt to create, modify, or use `tailwind.config.js` or `tailwind.config.ts`.

2. **Component Strategy (Radix UI)**:
   - We use **Radix UI primitives** (`@radix-ui/react-*`) directly for accessible interactive components.
   - **CRITICAL**: Do NOT run the standard Shadcn CLI (`npx shadcn-ui@latest init` or `add`). Do NOT create a `components.json`. The CLI conflicts with our Tailwind v4 setup. If a new primitive is needed, install the Radix package directly and style it using Tailwind v4 utility classes.

3. **Design Aesthetic**:
   - The design must be luxury, minimalist, and editorial fashion.
   - Avoid standard UI library looks; keep bundle sizes minimal and styles premium.

4. **Animations & Accessibility**:
   - Use GPU-accelerated keyframe animations. The ones defined in `globals.css` are `overlayShow`, `drawerShow` and `modalContentShow` (plus `fadeInUp`, `slideUp`, `heroZoom`, `grow-progress`). There is no `contentShow`.
   - All transitions and animations MUST respect `prefers-reduced-motion: reduce`.

5. **Typography & Styling (Semantic Extraction)**:
   - **CRITICAL**: Do NOT use arbitrary bracket values for text sizing or tracking (e.g., `text-[12px]`, `tracking-[0.15em]`).
   - Always use the semantic `@utility` classes defined in `globals.css`.
   - **Available Typography Utilities**: - `.text-display-lg`, `.text-display-md` (Hero/Section titles) - `.text-heading-lg`, `.text-heading-md` (Branding/Large headers) - `.text-body-lg`, `.text-body-md`, `.text-body-sm` (Paragraphs) - `.text-label-lg`, `.text-label-md`, `.text-label-sm`, `.text-label-xs` (Tags, uppercase labels) - `.text-nav-link`, `.text-nav-link-lg` (Navigation links)
   - All thirteen exist in `globals.css`. If a genuinely new size is needed, add an `@utility` rather than a bracket value.
   - **Known violations:** 23 bracket values survive across 6 files — `StatusPage.tsx` (11), `error.tsx` (4), `HeroSection.tsx` (4), `not-found.tsx` (2), `LocaleSwitcher.tsx` (1), `InstagramFeed.tsx` (1). Verified 2026-09-28. `CatalogClient.tsx` is clean. They are debt, not precedent. Do not copy them.
   <!-- END:project-rules -->

<!-- BEGIN:domain-rules -->

# Domain Language

`CONTEXT.md` in the repository root is the authoritative glossary. Read it before
naming a type, a route, a column, or a UI label. The following distinctions are
load-bearing and agents get them wrong by default:

- **Order Request ≠ Order.** The site form produces an _Order Request_ — an
  expression of interest carrying no payment method and no delivery branch. A
  _Consultant_ contacts the customer and turns it into an _Order_. **Nothing is
  produced before an Order exists.** Never model these as one entity, and never
  name the form's output "order".
- **Height, not ростовка.** The customer supplies her **height in centimetres**.
  Ростовка (155–165 / 165–170 / 171–175) is an internal manufacturing grading the
  seamstress derives from that height, and applies to one-pieces only. Never
  render a ростовка picker, and never show the word to a customer.
- **There is no stock.** Every garment is sewn after the Order. Do NOT add
  availability counts, "sold out" states, restock notifications, or low-stock
  urgency. Product JSON-LD must not claim availability the business cannot back.
- **Both order channels are equal.** The site form and Instagram Direct are both
  full purchase paths. Direct is not "just consultation". **Which one leads the PDP
  depends on the plan being executed.** The full plan makes the form primary and
  Direct a quiet secondary. The live site has no form at all, so Direct is the
  primary and only call to action. Keep it that way until a form ships, then demote
  Direct as Phase 5 of `docs/release-checklist.md` says. No order form exists
  anywhere in `src` today.

# Architecture & Migration State

The project is mid-migration, and there are now **two** possible destinations.
Check what has actually landed before assuming any state — `docs/post-launch-checklist.md`
tracks the live site, `docs/release-checklist.md` holds the full plan's phase order,
and a later phase must not be started before its dependency.

- **Today:** `output: "export"`, `images.unoptimized: true`, no middleware.
- **Merging into `main` deploys.** Cloudflare's Git integration builds and ships
  every commit on `main`. It is configured in the Cloudflare dashboard, so **no
  code in this repository records it** (`docs/cloudflare-setup.md` writes the
  settings down). A GitHub ruleset refuses direct pushes to `main`: every change
  goes through a PR whose Workers Builds check must pass. Branch builds run and
  deploy nothing. `npm run build` runs lint, the locale check, the unit tests,
  `next build` and the Umami check, so a failing check stops a `main` deploy.
  Unit tests are Vitest (`npm test`), in `src/**/*.test.ts` next to the code
  they cover. There are no `.github/workflows`: the account's Actions are
  locked. Never tell the user a pushed change is not live. `npm run deploy`
  (`npm run build && wrangler deploy`) is the manual path to the same place;
  `wrangler.jsonc` serves `./out` as an assets-only Worker.
  GitHub Pages was retired in `009d2e5` — the `gh-pages` script is gone.
- **`basePath` and `getAssetPath()` are gone.** Removed 2026-08-27 along with
  `src/lib/utils/assetPath.ts`; the site is served from a domain root. Public asset
  URLs are plain root-relative paths now. Do not reintroduce either, and do not
  write `/velels` into a URL.
- **The site origin is an environment variable.** `NEXT_PUBLIC_SITE_URL` feeds
  `src/lib/config.ts`, which exports `siteConfig.url` and `absoluteUrl()`. Never hardcode the domain in metadata, canonicals, JSON-LD or
  copy. The confirmed domain is `velels.com`.
- **Lite has landed, and is what is deployed:** Cloudflare Workers with static
  assets, keeping `output: "export"`. No database, no Payload, no middleware, no
  order form.
- **Destination — full:** Vercel, Postgres, Payload 3 on that same database,
  next-intl middleware enabled, image optimization on.
- Product data lives in `src/lib/data/products.ts` (11 products), with per-product
  copy in the `products` namespace of `src/messages/{uk,en}.json`. **The two locale
  files must stay key-identical** — 279 leaf keys across 12 top-level namespaces,
  373 counting intermediate objects, verified 2026-10-05. Adding a key to one and
  not the other does **not** break the build: next-intl renders the key path on
  the page and `next build` succeeds. `npm run check:locales` catches it, and
  `npm run build` runs it first. A key may be absent from a product in both files
  at once — `fabric`, `hardware` and `length` are read through `tProduct.has()` and
  only some Models carry them. That is parity, not a gap.
- Order Requests are business records. In the full plan they go to Postgres _and_ a
  Telegram notification — never only to a notification. Neither exists yet, and
  lite ships without both.

# Accessibility Beyond The CSS Rule

Rule 4 above covers CSS transitions. JavaScript is not exempt:

- Any script that starts motion — video playback, autoplay, scroll-driven
  animation — must check
  `window.matchMedia("(prefers-reduced-motion: reduce)").matches` and not start.
  Do not re-trigger playback on user gestures when that preference is set.
  Use `prefersReducedMotion()` from `src/lib/utils/motion.ts` rather than
  repeating the query.
- Never pass `behavior: "smooth"` to `scrollTo` or `scrollIntoView`. A behaviour
  set from JavaScript overrides the CSS reduced-motion reset. Pass
  `scrollBehavior()` from the same file.
- Every interactive control needs a visible `:focus-visible` state. `globals.css`
  carries a global ring and a dialog rule, added in `9f68de3`.
  Match them rather than adding per-component focus styles.
- Anything that opens on hover must also open on focus and be operable by
  keyboard. Prefer a Radix primitive over a hand-rolled hover panel.

# Out Of Scope — Do Not Build

Each of these was considered and rejected for a stated reason. Do not add them,
and do not add scaffolding "in preparation" for them.

| Do not build                                                    | Why                                                 |
| --------------------------------------------------------------- | --------------------------------------------------- |
| Inventory / stock tracking                                      | Made to order — nothing is ever out of stock        |
| Cart / multi-item checkout                                      | ~10 orders a month, one item each                   |
| Card payments, ПРРО receipts                                    | Manual confirmation by design at this volume        |
| Nova Poshta API / branch picker                                 | The Consultant asks for the branch                  |
| Payment method choice in the form                               | Agreed in conversation, case by case                |
| Made-to-measure flow, measurement collection as a purchase path | Happens only by arrangement in Direct               |
| "Ready to ship" surfacing of Returns Stock                      | Incidental and unpredictable                        |
| Reviews / UGC / ratings                                         | Dropped by the owner                                |
| Seasonal homepage variants                                      | No seasonality — demand is flat year-round          |
| Admin role permissions                                          | Owner and developer both have full access by choice |

# Documentation Map

| File                        | What it holds                                               |
| --------------------------- | ----------------------------------------------------------- |
| `CONTEXT.md`                | Domain glossary. No implementation detail                   |
| `docs/post-launch-checklist.md` | **The live task list.** Due now, owner decisions, tech, growth |
| `docs/cloudflare-setup.md`  | How hosting and deploy are configured, dashboard settings included. Kept current |
| `docs/release-checklist.md` | The full plan, by phase: order form, Vercel, Payload. Dormant until post-launch B4 |
| `docs/archive/release-checklist-lite.md` | How the catalogue launch was done, and why. Frozen 2026-09-29 |
| `docs/launch-plan.html`     | Business decisions and rationale, in Russian, for the owner. Frozen at 2026-08-19 with a dated note |

<!-- END:domain-rules -->
