# Release checklist

Ordered execution plan to public launch. Phases are dependency-ordered — each one
unblocks the next, so don't reorder them. Within a phase, items are independent
unless noted.

Context: [`launch-plan.html`](./launch-plan.html) (decisions, in Russian) ·
[`CONTEXT.md`](../CONTEXT.md) (domain glossary).

Effort: **S** ≈ under an hour · **M** ≈ half a day · **L** ≈ a day or more.

---

## Phase 0 — Today, on the current setup

Cheap things that are actively costing something while they wait.

- [ ] **S — `noindex` the GitHub Pages build.** It's indexable right now with a
      canonical pointing at a domain that isn't serving. Launching against your own
      duplicate is avoidable. Gate `robots` on an env flag so production later flips
      it back on.
      → `src/app/[locale]/layout.tsx`
- [ ] **S — Owner: provide ФОП details** (legal name, registration number, address)
      for the contact page.
- [ ] **S — Owner: decide the ростовка boundary rule.** 165 falls in two ranges,
      170–171 in none, nothing below 155 or above 175. The seamstress needs one
      unambiguous rule; the site just passes the height through.
- [ ] **S — Owner: create the Telegram bot and the channel** order requests will
      land in. A channel, not a personal chat — nothing gets lost and a second
      person can be added later.

---

## Phase 1 — Infrastructure

Nothing else can start until this lands. It removes four problems at once.

- [ ] **S — Provision Postgres.** Neon or Supabase, free tier. One database serves
      both Payload and order requests.
- [ ] **S — Create the Vercel project**, connect the repo, set env vars
      (`DATABASE_URL`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `INSTAGRAM_*`).
- [ ] **M — Drop static export.** Remove `output: "export"`, remove `basePath`,
      set `images.unoptimized: false`.
      → `next.config.ts`
- [ ] **M — Retire `getAssetPath()`.** Every call site loses the `/velels` prefix.
      This is what actually fixes the broken share previews.
      → `src/lib/utils/assetPath.ts` and all callers
- [ ] **M — Enable next-intl middleware.** Static export had none, so locale
      negotiation currently doesn't exist. Verify `/` resolves to `uk` without a
      redirect loop, and that `/en/...` still works. This is the highest-risk item
      in the phase — test both locales on every route type.
- [ ] **S — `noindex` all preview deployments** via `VERCEL_ENV !== "production"`.
      Preview URLs are public.
- [ ] **S — Point `velels.com` DNS at Vercel**, drive `metadataBase` from an env var
      instead of a hardcoded string.
- [ ] **S — Verify:** every route renders, images serve as optimized srcsets, the
      Instagram feed actually revalidates now that `revalidate` is no longer a no-op.

---

## Phase 2 — Correctness fixes

All cheap now that `basePath` is gone. These are defects, not improvements.

- [ ] **M — Self-referencing canonicals per locale**, plus `x-default` in the
      `hreflang` set. Right now every English page declares the Ukrainian one
      canonical, so the whole English site opts itself out of search.
      → `src/app/[locale]/layout.tsx`, `src/app/[locale]/product/[slug]/page.tsx`
- [ ] **S — Replace the homepage OG image.** It currently points at
      `lh3.googleusercontent.com/aida-public/…`, a temporary asset host that will
      rot. Use a real file in `public/`.
- [ ] **S — Favicon, `apple-icon`, web manifest.** There is no tab icon at all.
      → `src/app/icon.png`, `src/app/apple-icon.png`
- [ ] **S — `sitemap.ts` and `robots.ts`.** Both locales, all products, all info
      pages.
- [ ] **S — Fix the dress size chart.** Bust 82–84 then 86–88 leaves 85 in no size;
      88–90 has the same gap. Make the ranges contiguous.
      → `src/components/product/SizeGuideModal.tsx`
- [ ] **S — Stop preselecting size `M`.** Require an explicit choice, or a customer
      submits a request she never sized.
      → `src/components/product/ProductInfo.tsx`
- [ ] **S — Replace the hardcoded "New" badge** (`slug === "lendai"`) with a
      `releasedAt` date so the badge computes itself.
      → `src/components/catalog/CatalogClient.tsx`
- [ ] **S — Instagram feed resilience.** The long-lived token expires ~every 60
      days, silently. Log loudly on failure and fall back to a curated local set,
      not to rotting remote URLs.
      → `src/lib/instagram.ts`
- [ ] **S — Organization / WebSite JSON-LD** on the homepage; `BreadcrumbList` on
      product pages. Product JSON-LD already exists.

---

## Phase 3 — Data model

Everything the order form depends on. Land before Phase 5.

- [ ] **M — Add height to the product model.** `heights` on one-pieces only
      (155–165 / 165–170 / 171–175, internal — the seamstress derives it),
      `length: 131` on dresses. Two-pieces need neither.
      → `src/lib/data/products.ts`
- [ ] **M — Height input on the PDP.** A plain "your height, cm" number field, not
      a picker of ростовки. Required. The customer never sees the word ростовка.
- [ ] **S — Dress length on the PDP.** 131 cm is fixed, so the same dress reads
      floor-length on 157 cm and midi on 175 cm. State it.
- [ ] **S — Explain sizing in the size guide.** Two sentences on how height is used,
      since no other swimwear site asks for it.
- [ ] **M — Sale price.** `salePrice` + active flag on the model; struck-through
      original beside the new price in catalog and PDP. Without this the form quotes
      the wrong total on the days that matter most.
- [ ] **S — Add height to the Direct order message.** The DM path stays a full
      purchase channel, so it needs the same completeness.
      → `src/components/product/InstagramCheckout.tsx`

---

## Phase 4 — Payload CMS

- [ ] **L — Install Payload 3** on the Phase 1 Postgres, inside the Next app.
- [ ] **M — `Products` collection** with localized `uk`/`en` fields (name, tagline,
      details, care), colours, sizes, heights, price, salePrice, releasedAt, images.
- [ ] **M — Migrate the 11 products** out of `products.ts` and the `products`
      namespace of the message files. Verify nothing lost — 93 images with
      hand-written alt text.
- [ ] **M — `OrderRequests` collection** with the statuses agreed in Phase 5.
- [ ] **S — Admin UI locale** set to Russian or Ukrainian.
- [ ] **S — Media uploads** wired so images stop living in `public/`.
- [ ] Info pages (`/info/*`) stay in the message files. Out of scope — don't move
      them "while we're here".

---

## Phase 5 — Order requests

The core of the release.

- [ ] **M — Server route: `POST /api/order-request`.** Validate, write an
      `OrderRequest` row, push a formatted message to the Telegram channel. Bot
      token stays server-side.
- [ ] **S — Spam protection.** A public endpoint that messages your phone will get
      abused: honeypot field plus per-IP rate limiting. Do not skip this.
- [ ] **M — Form UI.** Auto-filled: model, colour, size. Required: full name,
      height, phone, contact channel **and the handle in it**. Optional: bust /
      waist / hips behind a "know your measurements?" disclosure, email with a
      separate unchecked consent box, comment.
- [ ] **S — Phone validation** for Ukrainian numbers, so you can actually reach her.
- [ ] **S — Handle field is required with the channel.** "Telegram" without a
      username is unusable — lookup by phone number often fails on privacy settings.
- [ ] **S — Success screen.** Request number plus the real promise: "напишем вам в
      Telegram в течение дня, отвечаем с 7:00 до 22:00".
- [ ] **S — Demote the Direct button** to a quiet secondary under the primary
      "Замовити": *"або напишіть нам в Instagram — допоможемо з розміром"*.
- [ ] **S — Request statuses in Payload:** new → contacted → confirmed → in
      production → shipped → lapsed.

---

## Phase 6 — Measurement and audience

- [ ] **S — Cookie-less analytics.** Plausible or self-hosted Umami. No consent
      banner, small script, survives the Instagram in-app browser.
- [ ] **S — Custom events:** `pdp_view`, `size_guide_open`, `order_form_start`,
      `order_form_submit`, `ig_dm_click`. Without these you learn nothing from the
      first weeks, which is your only clean signal.
- [ ] **S — Footer email signup.** One field, framed as new models and sales first.
      MailerLite free tier, double opt-in, their unsubscribe handling.
- [ ] **S — `?ref=ig` tagging** on the Instagram bio and story links. Referrer data
      from Instagram is unreliable.

---

## Phase 7 — Accessibility and performance

- [ ] **S — `:focus-visible` styles.** There are none in 436 lines of
      `globals.css`, on a site built entirely from custom buttons.
- [ ] **M — Keyboard-accessible catalogue dropdown.** Currently mouse-hover only,
      so three category links are unreachable without a mouse. The mobile drawer is
      fine — Radix handles it.
      → `src/components/layout/Navbar.tsx`
- [x] **M — Hero video loading.** `preload="none"`, IntersectionObserver instead
      of on mount, and no request at all when `prefers-reduced-motion` is set or
      `navigator.connection.saveData` is true. The 7.9 MB file stays, per decision.
      The mobile poster is now a real `next/image` base layer rather than the
      video's `poster` attribute. The `<video>` mounts only in order to be
      probed — it is fully transparent until a `playing` event, and unmounts the
      moment the probe fails — so **iOS Low Power Mode ends up on the static
      poster with no video element left in the tree**. There is no API for that
      setting; the single gesture-less `play()` is the detection, and a refusal
      is final for the page view. `pause`, `error` and a 5 s deadline all resolve
      to the poster too, so a stall cannot leave the file downloading unseen.
      → `src/components/home/HeroSection.tsx`, `src/hooks/useVideoAutoplay.ts`
- [x] **S — Stop fighting reduced-motion.** The `touchstart` / `pointerdown` /
      `scroll` retries are gone. They were also what made the video ambush people
      mid-scroll in Low Power Mode: a gesture is the one thing iOS *will* accept
      there, so the "fallback" defeated the OS setting it claimed to respect.
- [ ] **S — Both hero images download *and* preload on every device.**
      `images.unoptimized: true` means `next/image` emits no `srcset`, so `sizes`
      is inert: the `hidden md:block` / `block md:hidden` pair fetches ~170 KB of
      hero on both breakpoints, and each eager `<Image>` adds its own
      `<link rel="preload">`, so two viewport-dependent LCP candidates compete in
      the `<head>`. `loading="eager"` emits that link on its own — verified
      against the export, so swapping off the deprecated `priority` does not
      avoid it. The fix is art direction: one `<picture>` with `media`-scoped
      `<source>`s replacing both `<Image>`s, which removes the double download
      and the double preload together. `next/image` buys nothing here while
      `unoptimized` is set.

      Not a regression from the hero video work, which cut far more than it
      added: the old markup rendered the `<video preload="auto">` into the static
      HTML on *every* device, hidden only by CSS, so desktop was buffering the
      7.9 MB file as well. It now never mounts outside mobile.
      → `src/components/home/HeroSection.tsx`
- [ ] **S — Lighthouse pass on mobile**, throttled. Record the numbers so later
      regressions are visible.
- [ ] *Optional, ~15 min:* re-encode `hero_mobile.mp4` to ~1.5 MB — cap at
      720×1280, strip the (muted) audio track, 6–8 s loop, add a WebM source. No
      visible change.

---

## Phase 8 — Content and legal

- [ ] **M — Objection accordions on the PDP:** production time, exchange promise,
      payment terms. The copy already exists in `/info/*` — it's just in the footer
      where nobody reads it before deciding. For made-to-order this is the entire
      objection set.
- [ ] **S — Make the exchange promise loud.** It's requested about once a month, so
      it costs almost nothing and directly answers "I can't try it on".
- [ ] **S — ФОП details on `/info/contact`.** An Instagram handle and a gmail
      address is not trader identity.
- [ ] **S — Update the privacy policy** for analytics, the email list, and how long
      order request data is kept.
- [ ] **S — International wording.** Say plainly that international orders are
      quoted individually — full prepayment, shipping paid in advance.
- [ ] **S — Approximate currency on the `en` locale.** A customer in London
      currently sees `3 750 ₴` with no conversion.
      → `src/lib/utils/formatPrice.ts`

---

## Phase 9 — Pre-launch verification

Do all of it before flipping `noindex`.

- [ ] **M — End-to-end order request on a real phone**, inside the Instagram
      in-app browser, on mobile data. That's where most of your traffic arrives and
      where forms break.
- [ ] **S — Telegram notification arrives** with every field readable, and the row
      is in the database.
- [ ] **S — Both locales**, every route: home, catalog, filtered catalog, product,
      all nine info pages, 404, error page.
- [ ] **S — Share previews for real.** Post a product link into Telegram and
      Instagram and check the image renders. Run the homepage through Facebook's
      sharing debugger.
- [ ] **S — Keyboard-only pass** of the whole site, then a screen-reader pass of
      the order form.
- [ ] **S — Confirm database access and a backup path.** Order requests are now
      business records.
- [ ] **S — Flip `robots` to index**, submit the sitemap in Search Console, verify
      the property.

---

## Phase 10 — First two weeks after launch

- [ ] **S — Stale request reminders.** No response after 24 h → repeat the Telegram
      notification. At ten orders a month, losing one hurts.
- [ ] **M — Workload counter** in the admin: requests and orders in progress now,
      orders this month. The 30-orders threshold needs to be visible *before* it's
      crossed, since that's when the owner goes looking for a small production
      workshop.
- [ ] **M — Model height and size worn on every image.** The strongest fit evidence
      there is, and it needs a photo session decision from the owner.
- [ ] **S — Read the analytics.** Specifically: how many reach a PDP, how many start
      the form, where they abandon.
- [ ] **Later — promo codes**, once the email list has real people. Sooner is
      pointless: there's nothing to measure.

---

## Explicitly not doing

Decided against, with reasons. Listed so they don't creep back in.

| Not doing | Why |
| --- | --- |
| Inventory / stock tracking | Made to order. Nothing is ever out of stock |
| Cart / multi-item checkout | ~10 orders a month, one item each |
| Card payments, ПРРО receipts | Manual confirmation first; automation brings acquiring, fiscal receipts and refund flows for no gain at this volume |
| Nova Poshta API and branch picker | The consultant asks. This alone saves weeks |
| Payment method choice in the form | Agreed in conversation, case by case — a radio button can't do that |
| Made-to-measure on the site | Happens by arrangement in Direct; the site collects no measurements as a product path |
| "Ready to ship" from returns stock | Incidental and unpredictable — not worth a mechanism |
| Reviews / UGC | Dropped by the owner for now |
| Seasonal homepage variants | No seasonality — orders are flat year-round |
| Role permissions in the admin | Developer and owner both have full access by choice |
