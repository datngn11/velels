@AGENTS.md

`AGENTS.md` holds the project rules: Tailwind v4 setup, Radix usage, design
aesthetic, typography utilities, domain language, migration state, and an
explicit list of things not to build.

Read these before changing anything:

- **`CONTEXT.md`** — the domain glossary, and the authority on naming. The
  distinction between an *Order Request* (what the site form produces) and an
  *Order* (what a Consultant confirms) is load-bearing: nothing is produced
  before an Order exists.
- **`docs/release-checklist.md`** — the ordered pre-launch plan. Phases are
  dependency-ordered; do not start a later phase before its dependency has
  landed. It also records what was deliberately left out.
- **`docs/launch-plan.html`** — the business reasoning behind those decisions,
  written in Russian for the site owner.

Two rules that are violated most often, so they are worth repeating here:

1. There is no stock — every garment is sewn after the order. Never add
   availability counts, sold-out states, or restock logic.
2. `prefers-reduced-motion` applies to JavaScript as well as CSS. Any script
   that starts motion must check it first.
