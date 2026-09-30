@AGENTS.md

`AGENTS.md` holds the project rules: Tailwind v4 setup, Radix usage, design
aesthetic, typography utilities, domain language, migration state, and an
explicit list of things not to build.

Read these before changing anything:

- **`CONTEXT.md`** — the domain glossary, and the authority on naming. The
  distinction between an *Order Request* (what the site form produces) and an
  *Order* (what a Consultant confirms) is load-bearing: nothing is produced
  before an Order exists. The form itself does not exist in `src` yet, so the
  vocabulary runs ahead of the code.
- **`docs/post-launch-checklist.md`** — the only live task list: what is due,
  what waits on the owner, and what to build next. Work from this one.

Read these when the task touches them:

- **`docs/release-checklist.md`** — the full plan: order form, Vercel, Postgres,
  Payload. Dormant until post-launch B4's trigger fires, so don't tick it as work
  happens. When the form starts, settle post-launch G6 (which platform) and
  revise the plan first. Phases are dependency-ordered. It also records what was
  deliberately left out.
- **`docs/cloudflare-setup.md`** — how hosting and deploy are configured,
  including the dashboard settings the code can't show. Update it when a
  setting changes.
- **`docs/archive/release-checklist-lite.md`** — the frozen record of the
  catalogue launch (2026-09-22): Cloudflare, Instagram Direct as the only order
  channel, no form, no database. Read it for why something is the way it is.
  Don't update it.
- **`docs/launch-plan.html`** — the business reasoning behind those decisions,
  written in Russian for the site owner. Frozen at 2026-08-19, with a dated note
  of what changed since.

Two rules that are violated most often, so they are worth repeating here:

1. There is no stock — every garment is sewn after the order. Never add
   availability counts, sold-out states, or restock logic.
2. `prefers-reduced-motion` applies to JavaScript as well as CSS. Any script
   that starts motion must check it first.
