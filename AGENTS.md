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
   - **CRITICAL**: Do NOT attempt to create, modify, or use `tailwind.config.js` or `tailwind.config.ts`.

2. **Component Strategy (Radix UI)**:
   - We use **Radix UI primitives** (`@radix-ui/react-*`) directly for accessible interactive components.
   - **CRITICAL**: Do NOT run the standard Shadcn CLI (`npx shadcn-ui@latest init` or `add`). Do NOT create a `components.json`. The CLI conflicts with our Tailwind v4 setup. If a new primitive is needed, install the Radix package directly and style it using Tailwind v4 utility classes.

3. **Design Aesthetic**:
   - The design must be luxury, minimalist, and editorial fashion.
   - Avoid standard UI library looks; keep bundle sizes minimal and styles premium.

4. **Animations & Accessibility**:
   - Use GPU-accelerated keyframe animations (e.g., `overlayShow`, `contentShow` defined in `globals.css`).
   - All transitions and animations MUST respect `prefers-reduced-motion: reduce`.

5. **Typography & Styling (Semantic Extraction)**:
   - **CRITICAL**: Do NOT use arbitrary bracket values for text sizing or tracking (e.g., `text-[12px]`, `tracking-[0.15em]`).
   - Always use the semantic `@utility` classes defined in `globals.css`.
   - **Available Typography Utilities**:
     - `.text-display-lg`, `.text-display-md` (Hero/Section titles)
     - `.text-heading-lg`, `.text-heading-md` (Branding/Large headers)
     - `.text-body-lg`, `.text-body-md`, `.text-body-sm` (Paragraphs)
     - `.text-label-lg`, `.text-label-md`, `.text-label-sm`, `.text-label-xs` (Tags, uppercase labels)
     - `.text-nav-link`, `.text-nav-link-lg` (Navigation links)
<!-- END:project-rules -->

<!-- BEGIN:domain-rules -->
# Domain Language

`CONTEXT.md` in the repository root is the authoritative glossary. Read it before
naming a type, a route, a column, or a UI label. The following distinctions are
load-bearing and agents get them wrong by default:

- **Order Request ≠ Order.** The site form produces an *Order Request* — an
  expression of interest carrying no payment method and no delivery branch. A
  *Consultant* contacts the customer and turns it into an *Order*. **Nothing is
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
  full purchase paths. Direct is not "just consultation" — but on the PDP the form
  is the primary call to action and Direct is a quiet secondary.

# Architecture & Migration State

The project is mid-migration. Check which phase has landed before assuming either
state — `docs/release-checklist.md` holds the phase order, and a later phase must
not be started before its dependency.

- **From:** `output: "export"` → GitHub Pages under `basePath: "/velels"`, no
  middleware, `images.unoptimized: true`.
- **To:** Vercel, Postgres, Payload 3 on that same database, next-intl middleware
  enabled, image optimization on.
- While `basePath` exists, every public asset URL must go through
  `getAssetPath()`. That helper is deleted in Phase 1 — once the migration has
  landed, do not add new call sites.
- Product data currently lives in `src/lib/data/products.ts`, with per-product
  copy in the `products` namespace of `src/messages/{uk,en}.json`. **The two
  locale files must stay key-identical** (231 keys as of the last audit); adding a
  key to one and not the other breaks the build.
- Order Requests are business records. They go to Postgres *and* a Telegram
  notification — never only to a notification.

# Accessibility Beyond The CSS Rule

Rule 4 above covers CSS transitions. JavaScript is not exempt:

- Any script that starts motion — video playback, autoplay, scroll-driven
  animation — must check
  `window.matchMedia("(prefers-reduced-motion: reduce)").matches` and not start.
  Do not re-trigger playback on user gestures when that preference is set.
- Every interactive control needs a visible `:focus-visible` state.
- Anything that opens on hover must also open on focus and be operable by
  keyboard. Prefer a Radix primitive over a hand-rolled hover panel.

# Out Of Scope — Do Not Build

Each of these was considered and rejected for a stated reason. Do not add them,
and do not add scaffolding "in preparation" for them.

| Do not build | Why |
| --- | --- |
| Inventory / stock tracking | Made to order — nothing is ever out of stock |
| Cart / multi-item checkout | ~10 orders a month, one item each |
| Card payments, ПРРО receipts | Manual confirmation by design at this volume |
| Nova Poshta API / branch picker | The Consultant asks for the branch |
| Payment method choice in the form | Agreed in conversation, case by case |
| Made-to-measure flow, measurement collection as a purchase path | Happens only by arrangement in Direct |
| "Ready to ship" surfacing of Returns Stock | Incidental and unpredictable |
| Reviews / UGC / ratings | Dropped by the owner |
| Seasonal homepage variants | No seasonality — demand is flat year-round |
| Admin role permissions | Owner and developer both have full access by choice |

# Documentation Map

| File | What it holds |
| --- | --- |
| `CONTEXT.md` | Domain glossary. No implementation detail |
| `docs/release-checklist.md` | Ordered pre-launch execution plan, by phase |
| `docs/launch-plan.html` | Business decisions and rationale, in Russian, for the owner |
<!-- END:domain-rules -->
