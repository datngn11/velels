# Release checklist

Ordered execution plan to public launch. Phases are dependency-ordered — each one
unblocks the next, so don't reorder them. Within a phase, items are independent
unless noted.

Context: [`launch-plan.html`](./launch-plan.html) (decisions, in Russian) ·
[`CONTEXT.md`](../CONTEXT.md) (domain glossary).

**Dormant until the order form starts.** The site launched on 2026-09-22 as a
catalogue, by the cut-down plan now archived in
[`archive/release-checklist-lite.md`](./archive/release-checklist-lite.md). What
remains here is mostly the form and the platform it needs. Nobody works from
this document until post-launch B4's trigger fires. The live task list is
[`post-launch-checklist.md`](./post-launch-checklist.md), so don't tick items
here as work happens there.

Items that lite already did were ticked once, on 2026-09-29, each with the lite
item that did it, so nobody does them twice. When the form starts, settle
post-launch G6 first. Now that Cloudflare is live, G6 asks whether the form
belongs on a Worker rather than on Vercel. Revise this plan to match the answer
before starting Phase 1.

Effort: **S** ≈ under an hour · **M** ≈ half a day · **L** ≈ a day or more.

---

## Phase 0 — Today, on the current setup

Cheap things that are actively costing something while they wait.

- [x] **S — `noindex` the GitHub Pages build.** Indexing is now opt-in:
      `NEXT_PUBLIC_ALLOW_INDEXING="true"` is the only thing that emits
      `index, follow`, so an unset flag — a fresh clone, a machine without
      `.env`, a CI runner — fails toward `noindex` rather than toward an indexed
      duplicate. Phase 1 sets it on Vercel production only. The gate lives in the
      **root** layout, not the locale one: `/` is a client-side redirect to `/uk`
      outside the `[locale]` tree, so a locale-only gate would have left the one
      URL GitHub Pages actually serves at `/velels/` indexable. Every route
      inherits from the root, so there is a single call site. Verified across all
      47 exported pages in both flag states. `robots.txt` stays a Phase 2 item —
      a `Disallow` would block the recrawl that drops the existing entries.
      → `src/lib/seo/indexing.ts`, `src/app/layout.tsx`
      *GitHub Pages was retired in `009d2e5`. The flag has been on for the
      Cloudflare production build since 2026-09-22 (lite L8).*
- [x] **S — Owner: provide ФОП details** (legal name, registration number, address)
      for the contact page.
      *Done under lite L0 and L6, 2026-09-10. They went in `info/terms`, not the
      contact page, and the owner chose to publish no address.*
- [ ] **S — Owner: decide the ростовка boundary rule.** 165 falls in two ranges,
      170–171 in none, nothing below 155 or above 175. The seamstress needs one
      unambiguous rule; the site just passes the height through.
- [ ] **S — Owner: create the Telegram bot and the channel** order requests will
      land in. A channel, not a personal chat — nothing gets lost and a second
      person can be added later.

---

## Phase 1 — Infrastructure

Nothing else can start until this lands. It removes four problems at once.
Lite has already removed two of them without it, the `/velels` path and the
frozen Instagram feed. Image optimization and a server for the form are left.

- [ ] **S — Provision Postgres.** Neon or Supabase, free tier. One database serves
      both Payload and order requests.
- [ ] **S — Create the Vercel project**, connect the repo, set env vars
      (`DATABASE_URL`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`).
- [ ] **M — Drop static export.** Remove `output: "export"`, remove `basePath`,
      set `images.unoptimized: false`.
      → `next.config.ts`
      *`basePath` is already gone (lite L1).*
- [x] **M — Retire `getAssetPath()`.** Every call site loses the `/velels` prefix.
      This is what actually fixes the broken share previews.
      → `src/lib/utils/assetPath.ts` and all callers
      *Done under lite L1, 2026-08-27. The file is deleted.*
- [ ] **M — Enable next-intl middleware.** Static export had none, so locale
      negotiation currently doesn't exist. Verify `/` resolves to `uk` without a
      redirect loop, and that `/en/...` still works. This is the highest-risk item
      in the phase — test both locales on every route type.
- [ ] **S — `noindex` all preview deployments** via `VERCEL_ENV !== "production"`.
      Preview URLs are public.
- [ ] **S — Point `velels.com` DNS at Vercel**, drive `metadataBase` from an env var
      instead of a hardcoded string.
      *The env var half is done under lite L1 (`NEXT_PUBLIC_SITE_URL`,
      2026-08-27). The domain is registered at Cloudflare Registrar, which
      requires Cloudflare nameservers, so the DNS half becomes a record in the
      Cloudflare zone that points at Vercel.*
- [ ] **S — Verify:** every route renders and images serve as optimized srcsets.

---

## Phase 2 — Correctness fixes

All cheap now that `basePath` is gone. These are defects, not improvements.

- [x] **M — Self-referencing canonicals per locale**, plus `x-default` in the
      `hreflang` set. Right now every English page declares the Ukrainian one
      canonical, so the whole English site opts itself out of search.
      → `src/app/[locale]/layout.tsx`, `src/app/[locale]/product/[slug]/page.tsx`
      *Done under lite L3, 2026-08-29.*
- [x] **S — Replace the homepage OG image.** It currently points at
      `lh3.googleusercontent.com/aida-public/…`, a temporary asset host that will
      rot. Use a real file in `public/`.
      *Done under lite L3. The file is `public/og/home.jpg`.*
- [x] **S — Favicon, `apple-icon`, web manifest.** There is no tab icon at all.
      → `src/app/icon.png`, `src/app/apple-icon.png`
      *Done under lite L3, 2026-09-14.*
- [x] **S — `sitemap.ts` and `robots.ts`.** Both locales, all products, all info
      pages.
      *Done under lite L3, 2026-08-29.*
- [ ] **S — Fix the dress size chart.** Bust 82–84 then 86–88 leaves 85 in no size;
      88–90 has the same gap. Make the ranges contiguous.
      → `src/components/product/SizeGuideModal.tsx`
      *Still open and waiting on the owner (post-launch B1). Waist and hips have
      the same gaps as bust.*
- [x] **S — Stop preselecting size `M`.** Require an explicit choice, or a customer
      submits a request she never sized.
      → `src/components/product/ProductInfo.tsx`
      *Done under lite L2.*
- [x] **S — Replace the hardcoded "New" badge** (`slug === "lendai"`) with a
      `releasedAt` date so the badge computes itself.
      → `src/components/catalog/CatalogClient.tsx`
      *Done under lite L4, 2026-09-08. It compares the build date, so a badge
      clears only when a build runs (post-launch T4).*
- [x] **S — Organization / WebSite JSON-LD** on the homepage; `BreadcrumbList` on
      product pages. Product JSON-LD already exists.
      *Done under lite L3, 2026-08-29, with a visible breadcrumb added on
      2026-09-08.*

---

## Phase 3 — Data model

Everything the order form depends on. Land before Phase 5.

- [ ] **M — Add height to the product model.** `heights` on one-pieces only
      (155–165 / 165–170 / 171–175, internal — the seamstress derives it),
      `length: 131` on dresses. Two-pieces need neither.
      → `src/lib/data/products.ts`
- [ ] **M — Height input on the PDP.** A plain "your height, cm" number field, not
      a picker of ростовки. Required. The customer never sees the word ростовка.
- [x] **S — Dress length on the PDP.** 131 cm is fixed, so the same dress reads
      floor-length on 157 cm and midi on 175 cm. State it.
      *Done under lite L4, 2026-09-15, for Lunar only. Noblesse carries no
      length, by the owner's decision.*
- [ ] **S — Explain sizing in the size guide.** Two sentences on how height is used,
      since no other swimwear site asks for it.
- [x] **M — Sale price.** `salePrice` + active flag on the model; struck-through
      original beside the new price in catalog and PDP. Without this the form quotes
      the wrong total on the days that matter most.
      *Done under lite L4, 2026-08-31. There is no active flag or end date:
      `8bd0e61` removed `saleEndsAt`, so setting or deleting `salePrice` turns a
      sale on or off.*
- [ ] ~~**S — Add height to the Direct order message.**~~ The DM path stays a full
      purchase channel, so it needs the same completeness.
      → `src/components/product/InstagramCheckout.tsx`
      *Dropped 2026-09-21 at the owner's request (lite L2). The Consultant asks
      for height in the conversation, and the blank line only made the message
      read like a form.*

---

## Phase 4 — Payload CMS

- [ ] **L — Install Payload 3** on the Phase 1 Postgres, inside the Next app.
- [ ] **M — `Products` collection** with localized `uk`/`en` fields (name, tagline,
      details, care), colours, sizes, heights, price, salePrice, releasedAt, images.
- [ ] **M — Migrate the 11 products** out of `products.ts` and the `products`
      namespace of the message files. Verify nothing lost — 101 images, each
      with a colour and, where one applies, a `shot` tag. Alt text is composed
      from those by `productImageAlt`, so migrate the tag, not an alt string.
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

- [x] **S — Cookie-less analytics.** Plausible or self-hosted Umami. No consent
      banner, small script, survives the Instagram in-app browser.
      *Done under lite L7, 2026-09-11, on Umami Cloud's free tier.*
- [ ] **S — Custom events:** `pdp_view`, `size_guide_open`, `order_form_start`,
      `order_form_submit`, `ig_dm_click`. Without these you learn nothing from the
      first weeks, which is your only clean signal.
      *`ig_dm_click` and `size_guide_open` shipped under lite L7, and Umami's page
      views cover `pdp_view`. The two form events wait for the form.*
- [ ] **S — Footer email signup.** One field, framed as new models and sales first.
      MailerLite free tier, double opt-in, their unsubscribe handling.
      *Post-launch G2 argues for doing this before the form.*
- [ ] **S — ~~`?ref=ig` tagging~~ `?ref=story` on the story links, with the bio
      left bare.** Referrer data from Instagram is unreliable.
      *Changed under lite L3. Nearly all traffic comes from Instagram, so
      `?ref=ig` would separate nothing. Still an owner task (post-launch N).*

---

## Phase 7 — Accessibility and performance

- [x] **S — `:focus-visible` styles.** There are none in 436 lines of
      `globals.css`, on a site built entirely from custom buttons.
      *Done under lite L5, 2026-09-08.*
- [x] **M — Keyboard-accessible catalogue dropdown.** Currently mouse-hover only,
      so three category links are unreachable without a mouse. The mobile drawer is
      fine — Radix handles it.
      → `src/components/layout/Navbar.tsx`
      *Done under lite L5, 2026-09-08, with Radix Navigation Menu. The mobile
      drawer turned out not to be fine either (post-launch A3).*
- [x] **M — Hero video loading.** `preload="none"`, IntersectionObserver instead
      of on mount, and no request at all when `prefers-reduced-motion` is set or
      `navigator.connection.saveData` is true. The 7.9 MB file stays, per decision.
      *That decision changed. Lite L1 re-encoded the video on 2026-09-15 to
      2.07 MB, with a 3.24 MB H.264 fallback.*
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
- [x] **S — Both hero images download *and* preload on every device.**
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

      **Done 2026-09-21 in `4c85e23`**, exactly as prescribed: one `<picture>`
      with a `media`-scoped `<source>` for the desktop landscape and the mobile
      poster as the `<img>` fallback. A phone now fetches 46 KB and a desktop
      101 KB, never both. It also fixed the homepage LCP, which had reached 12.0s
      on real throttling because nothing large was in the mobile HTML and the
      video was the first big element to paint. 2.9s after.

- [ ] **S — `InstagramFeed` declares the wrong `sizes`, which only bites once
      `images.unoptimized` is off.** The element is `w-[75vw]` below the `sm`
      breakpoint, but `sizes` says `50vw`. Under-declaring by 1.5x means the
      browser picks a candidate for a 200px slot and paints it in a 300px one, so
      the strip goes soft on phones the moment `next/image` starts emitting a
      `srcset`. Today it is inert and the attribute is not even rendered.

      Only this component is wrong. `ProductGrid` (2 then 4 columns),
      `CatalogClient` (2, 3, 4), `EditorialFeature` (1 then 2) and
      `ImageCarousel` all declare widths matching their grids. Audited
      2026-09-21.

      `75vw` below `sm`, `45vw` to `md`, then a quarter of the 1440px container:
      `(max-width: 639px) 75vw, (max-width: 767px) 45vw, 320px`.
      → `src/components/home/InstagramFeed.tsx`
- [x] **S — Lighthouse pass on mobile**, throttled. Record the numbers so later
      regressions are visible.
      *Done under lite L5. The baseline is dated 2026-09-16, and post-launch P7
      re-runs it.*
- [x] *Optional, ~15 min:* re-encode `hero_mobile.mp4` to ~1.5 MB — cap at
      720×1280, strip the (muted) audio track, 6–8 s loop, add a WebM source. No
      visible change.
      *Done differently under lite L1, 2026-09-15. It is 1080 px wide from the
      master, H.265 at 2.07 MB with an H.264 fallback, and has no WebM source.
      L1 has the measurements behind each choice.*

---

## Phase 8 — Content and legal

- [x] **M — Objection accordions on the PDP:** production time, exchange promise,
      payment terms. The copy already exists in `/info/*` — it's just in the footer
      where nobody reads it before deciding. For made-to-order this is the entire
      objection set.
      *Done under lite L4, 2026-08-31, as three visible lines under the button
      and one "Оплата і доставка" row rather than three accordions.*
- [x] **S — Make the exchange promise loud.** It's requested about once a month, so
      it costs almost nothing and directly answers "I can't try it on".
      *Done under lite L4, 2026-08-31.*
- [x] **S — ФОП details on `/info/contact`.** An Instagram handle and a gmail
      address is not trader identity.
      *Done under lite L6, 2026-09-10, in `info/terms` rather than the contact
      page, which is where Ukrainian shops put it. No address is published.*
- [ ] **S — Update the privacy policy** for analytics, the email list, and how long
      order request data is kept.
      *Rewritten under lite L6 on 2026-09-10, analytics included. The email list
      and Order Request retention wait for those features. Post-launch C1 lists
      one sentence in it that is now false.*
- [x] **S — International wording.** Say plainly that international orders are
      quoted individually — full prepayment, shipping paid in advance.
      *Done under lite L6, 2026-09-21. The English says all three. The owner
      reverted the matching Ukrainian, which leaves out "quoted individually".*
- [ ] **S — Approximate currency on the `en` locale.** A customer in London
      currently sees `3 750 ₴` with no conversion.
      → `src/lib/utils/formatPrice.ts`
      *Waits on post-launch B8, which decides whether English is a market.*

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
      *Done once for lite on 2026-09-22 (L8). Repeat it after the Phase 1
      migration.*
- [ ] **S — Share previews for real.** Post a product link into Telegram and
      Instagram and check the image renders. Run the homepage through Facebook's
      sharing debugger.
      *Not yet done for lite either (post-launch N).*
- [ ] **S — Keyboard-only pass** of the whole site, then a screen-reader pass of
      the order form.
      *The site-wide pass is post-launch N. The form pass waits for the form.*
- [ ] **S — Confirm database access and a backup path.** Order requests are now
      business records.
- [x] **S — Flip `robots` to index**, submit the sitemap in Search Console, verify
      the property.
      *Done under lite L8, 2026-09-22. On Vercel, set
      `NEXT_PUBLIC_ALLOW_INDEXING` on the production environment again.*

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
      *Tracked for lite as post-launch B3 and G5.*
- [ ] **S — Read the analytics.** Specifically: how many reach a PDP, how many start
      the form, where they abandon.
      *The lite version of this read is due around 2026-10-06 (post-launch N).*
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
| Instagram Graph API feed | Built, then removed. The long-lived token expires ~every 60 days and fails silently, and the CDN URLs it returns rot. The homepage strip is now three curated local images in `src/components/home/InstagramFeed.tsx`, each linking to its post — swapped by hand when the owner wants different ones |
