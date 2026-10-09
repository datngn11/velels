# Post-launch checklist

The lite catalogue went public on 2026-09-22, when indexing was switched on. This
document is what comes after it: what is due now, what the owner has to decide,
what on the live site is wrong, and what is worth building next. It does not
replace [`release-checklist.md`](./release-checklist.md), which is still the
destination, or [`archive/release-checklist-lite.md`](./archive/release-checklist-lite.md), which
records how the launch was done. Items carried over from lite name their origin,
e.g. *(from L3)*.

This is the only task list being worked. Tick items here as they ship. How the
hosting and the Cloudflare dashboard are configured is in
[`cloudflare-setup.md`](./cloudflare-setup.md). Keep that page current when a
dashboard setting changes.

Effort: **S** ≈ under an hour · **M** ≈ half a day · **L** ≈ a day or more.
**Owner** marks a decision or a file only the owner can supply.

---

## Where things stand, 2026-10-08

Checked against the code, the live site and `npm audit`. The previous snapshot,
dated 2026-10-05, is in git history. Fixed since then: dead code and stale
comments (D2, D3), unit tests and a type check in the build (D6), the small
fixes (D4, most of D7, A3, G9), cards that waited for JavaScript (P2), the
full locale file on every page (P5), the Next upgrade (T2), and `.DS_Store`
deploys and framing (T3, T7).

**Working.**

- Every page is a static file on a Cloudflare assets-only Worker. Merging into
  `main` deploys it. Every pull request is built first, and a GitHub ruleset
  will not merge one whose Workers Builds check failed (T1).
- `http` and `www` reach the apex in one 301, and `/` reaches `/uk` in one 302,
  both with the query string kept.
- Canonicals, hreflang, the sitemap (44 URLs) and our own `robots.txt` are
  correct at the edge.
- Product JSON-LD says `MadeToOrder`. No stock or sold-out state exists anywhere
  in the UI.
- Umami loads on every page.
- `/_next/static` is cached for a year, and a stray URL returns a real 404.
- The Direct handoff worked in the Instagram in-app browser on 2026-09-22.

**Still open.**

- **The dress chart has gaps in all three measurements** (B1). Bust 85, 89 and
  93, waist 65, 69 and 73, and hips 91, 95 and 99 fit no size.
- **The site states two production times** (C2, B5). The PDP says 2–4 working
  days, the Product JSON-LD 3–5 calendar days.
- **Images are most of the page weight** (P1, P4). Scrolling the whole
  catalogue downloads 2.0 MB of full-size card photos, and gallery thumbnails
  load the full photo each. The 101 photos come in 20 sizes.
- **`npm audit` reports 8 high advisories**, all in build and local tooling:
  ESLint's glob matching and the `sharp` inside wrangler's local simulator.
  npm's suggested fix downgrades both by years. None reach the site (T2).
- **The README is the stock `create-next-app` text** (D1).
- **The domain renews on 2027-08-28**, confirmed by RDAP (T6).

---

## N. Due now

Dated, or due because something shipped this week.

- [ ] **(S) Re-scrape share previews and request reindexing.** *(from L3 and L8)*
      PR #30 changed every product title and alt on 2026-09-28, and C1 changed
      copy again on 2026-10-02. Paste a product link and the homepage into the apps people actually share links
      in: Telegram, Instagram DM, Viber and WhatsApp. Viber is on the list because
      so many Ukrainian customers use it. Product `og:image` files are WebP, so
      check that each app actually draws the image. Run the homepage and one
      product through Facebook's Sharing Debugger, which also refreshes
      Facebook's cache. In Search Console, request indexing for the 11 Ukrainian
      product URLs.
- [x] **(S) Redirect `/` at the edge.** *Done 2026-09-30.* A Cloudflare Redirect
      Rule sends `/` to `/uk` with a 302 before any page loads ("Root to /uk" in
      `cloudflare-setup.md`). `RootRedirect` stays as the fallback. For the
      numbers: in Umami data from before 2026-09-30, read `/` as bio arrivals
      and don't add it to `/uk`, which counted the same visits again. Since
      then, untagged `/uk` visits with no referrer are mostly the bio, though
      typed URLs and links pasted into DMs land there too.
- [ ] **(S) Keyboard-only pass.** *(from L8)* The whole site, Tab and Enter only.
      Pay extra attention to the catalogue dropdown, the mobile drawer (A3) and
      the size-guide dialog.
- [ ] **(S) Owner: start the weekly log.** *(from L7)* One row per week with DMs
      that came from the site, orders confirmed, parcels not collected, and size
      exchanges. Site DMs are easy to recognise: the prefilled message opens with
      «Вітаю!» and names model, colour and size. Customers who type their own
      message will be missed, so the count is a floor. Umami shows how many people
      tap the button, but only this log shows how many actually write and how many
      buy.
- [ ] **(S) Owner: tag the story links `?ref=story`.** *(from L3)* Leave the bio
      link bare. Without the tag, story and bio traffic look identical in Umami.
- [ ] **(S) First read of the numbers, around 2026-10-06.** Two weeks of Umami
      plus the weekly log. Each number below settles a decision further down this
      document:
      - Product page views and `ig_dm_click` per product decide what to
        photograph next.
      - `ig_dm_click` with `size=none`: a high share means people want to ask
        before choosing a size, and the DM is doing that job.
      - `size_guide_open` per product page view decides how urgent B1 and B2 are.
      - Country and `/en` share decide B8.
      - The `?ref=story` share says whether stories or the bio bring people in.
- [ ] **(S) Search Console, first look.** How many of the 44 URLs are indexed,
      whether Google accepted the English pages or folded them into the Ukrainian
      ones, and any "Google chose a different canonical" entries.

---

## C. Copy and data that are wrong on the live site

Text changes in both locale files. Each one is small, and each is live now.

- [x] **(S) C1. Three false statements.** *Shipped 2026-10-02 in PR #36, wording
      approved by the owner.* The privacy policy says the Direct tap carries the
      model and size, and is dated 2 October. The FAQ no longer asks customers to
      confirm availability. Both brand paragraphs say «шиється на замовлення»
      instead of «невеликими партіями».
- [ ] **(S) C2. Production time in the JSON-LD.** `jsonLd.ts` declares handling
      time as 3–5 `DAY`. The PDP says «Виготовлення 2–4 робочі дні», and the
      launch plan says 4 working days. Once B5 settles one figure, the JSON-LD
      should state it in working days.
- [x] **(S) C3. Smaller copy errors.** *Shipped 2026-10-02 in PR #36.* The
      English Ezra no longer says "unlined", «Бестселери» is spelt right, the
      Instagram heading names `@velelswim`, the terms describe the COD
      prepayment, and the PDP and FAQ allow an exchange for another size or
      Model. The English catalogue says "Bikinis", like the nav, as the owner
      chose; the Ukrainian «суцільні» and «роздільні» were already right. The
      remaining owner question moved to B10.
- [ ] **(S) C4. Owner: Glacier's two bottoms.** Its description offers «2
      варіанти низу на вибір». Nothing on the page selects one, and the
      prefilled message does not carry the choice. If the Consultant always asks,
      leave it. If customers forget to say, one line in the message fixes it.

---

## B. Business decisions (owner)

No code, but several of them hold up work in other groups.

- [ ] **(S) B1. Owner: close the dress size chart gaps.** *(from L0 and L4)* Each
      dress size is a 2 cm band with a 1 cm hole before the next. Bust 85, 89 and
      93, waist 65, 69 and 73, and hips 91, 95 and 99 fit no size. Lite records
      only the bust. The size a customer reads is the size she puts in the DM.
      While you're at it, confirm two swimwear values: L hips are 95–100, a 5 cm
      band where every other size has 4, and dress L bust is 94–98 where the
      other sizes span 2 cm. Either could be a typo. Changing the chart takes
      five minutes once the numbers are settled.
- [ ] **(S) B2. Owner: height ranges per size.** *(from L0)* The direct
      competitor's size guide has a height column and ours does not.
- [ ] **(M) B3. Owner: model height and size on every photo.** The full plan
      calls this the strongest fit evidence available. It costs nothing if it is
      written down at the next shoot, and it is expensive to reconstruct
      afterwards. Ask the model's height and the size she wore in each look
      before the shoot starts. On the site it becomes one line per colourway (G4).
- [ ] **(S) B4. Owner: agree what triggers the order form.** Lite deferred the
      form "until Direct volume makes the manual path hurt". That is a feeling,
      and it will arrive late. Pick a number instead, for example 20 orders a
      month for two months running, or DMs going unanswered past a day. The form
      is about a week of work (full plan phases 3 and 5), so the trigger has to
      fire well before the pain does.
- [ ] **(S) B5. Owner: one production time, and when it changes.** The PDP says
      2–4 working days, the JSON-LD 3–5 days, and the launch plan 4 working
      days (C2). Pick one. The launch plan says the promise holds while no more
      than three garments are in work. Decide the queue length at which the
      promise changes, and what it changes to. The site line is one key per
      locale (`productDetail.productionTime`). The 30-orders-a-month threshold
      for finding a workshop belongs in the same conversation.
- [ ] **(S) B6. Owner: protect the Instagram account.** It is the only order
      channel and holds every customer conversation. If the account is lost or
      hacked, sales stop. Two-factor authentication is the minimum. The email list
      in G2 is the only fallback the site can offer, and I would build it sooner
      than the full plan does, because the reason for it doesn't depend on
      traffic.
- [ ] **(S) B7. Owner: track uncollected parcels monthly.** At 1–2 in 10 parcels
      this is the biggest recurring loss: the 500 UAH prepayment covers shipping
      and materials, not the seamstress's work. The launch plan leaves this to the
      Consultant, not to a rule on the site, and this item doesn't change that. It
      asks one thing: does the rate go up now that cold visitors from search
      arrive alongside followers? The weekly log in N answers it.
- [ ] **(S) B8. Owner: decide whether English is a market.** After a month of
      country data. If `/en` is under roughly 5% of visits, stop spending on it:
      the approximate currency, the English 404 copy and the Ukrainian wording on
      international orders can all wait. If it is higher, those three become real
      items.
- [ ] **(S) B9. Owner: two dashboard jobs, or the files.** *(from L3)* Turn on
      Image Transformations for the `velels.com` zone. Until then
      `/cdn-cgi/image/` returns 404, which blocks P1 and G4. Separately,
      re-export the homepage share image at 1200×630 from the source file.
- [ ] **(S) B10. Owner: «New» and «Swimwear» on the Ukrainian site.** *(from
      C3)* Keep them in English, or translate them? Lite L4 records the badge as
      translated, but `uk.json` says «New».

---

## A. Accessibility

- [x] **(S) A1. Reduced motion in two scripts.** *Shipped 2026-10-02 in PR #36.*
      `scrollBehavior()` in `src/lib/utils/motion.ts` hands the gallery, the
      `#hash` scroll on load and same-page anchor clicks back to the CSS
      reduced-motion reset. In headless Chrome, under reduced motion, a far
      thumbnail tap and a `#collection` click now arrive in one frame; the old
      code passed through 57 and 25 positions.
- [ ] **(S) A2. Selected state is visual only.** No `aria-pressed` or
      `aria-current` on the size and colour buttons, the catalogue filters, the
      size-guide tabs or the gallery thumbnails. A screen-reader user can't tell
      which size she has chosen before she opens Instagram.
- [x] **(S) A3. Mobile drawer.** *Done 2026-10-06, found again by CodeRabbit on
      PR #40.* The collapsed catalogue list is now `inert`, so Tab skips its
      links, and the toggle carries `aria-expanded`. Checked in headless Chrome:
      collapsed, Tab goes from the toggle straight to «Про бренд»; open, it
      walks «Усі» and the three categories.
- [ ] **(S) A4. Ukrainian labels for four controls.** "Open menu", "Close menu",
      "Close" and `Size ${size}` are hardcoded English on the Ukrainian site
      (`Navbar.tsx`, `SizeGuideModal.tsx`, `ProductInfo.tsx`). Each needs a key in
      both locale files.
- [ ] **(S) A5. The toast is silent.** `Toast.tsx` has no `role="status"`, so the
      "copied" confirmation is never announced. Adding the role is not enough on
      its own: the component returns `null` while hidden, and a live region that
      appears together with its text is often not read out. Keep the region
      mounted and change only its text. See G1 for the larger problem with that
      confirmation.
- [ ] **(S) A6. Owner: a pause control on the hero video.** It loops with no way
      to stop it. That fails WCAG 2.2.2 for visitors who have not set reduced
      motion. A small pause button in a corner is the usual answer, and the owner
      should see it before it ships.

---

## T. Tech: keep what is live safe

Cheap, and each one protects something already in production.

- [x] **(S) T1. A build on every pull request.** *Done 2026-10-02, PRs #33 and
      #34, in Workers Builds because the account's GitHub Actions are locked.*
      `npm run build` runs lint, the type check, the locale check, the unit
      tests, `next build` and the Umami check, on every branch and on `main`. A GitHub ruleset on `main` requires
      that check, requires a PR and has no bypass; a PR with a failing build was
      shown to be blocked. A one-sided locale key does not fail `next build` by
      itself, since next-intl ships the key path as text, so
      `npm run check:locales` is what catches it. Settings are in
      `cloudflare-setup.md`.
- [x] **(S) T2. Upgrade Next to 16.3.x and bump the rest.** *Done 2026-10-08.*
      Next 16.2.6 → 16.3.8, and everything else to its latest within its major
      version (next-intl 4.14.9, Tailwind 4.3.3, Radix dialog 1.2.0, wrangler
      4.148.0). 16.4.0 was two days old with no patches, so it waits for next
      quarter. `npm audit` went from 16 (1 critical) to 8 high, all tooling.
      Against the previous build: every page's markup is identical except that
      the closed menu button no longer carries `aria-controls` (Radix now adds it
      when the menu opens), screenshots of six pages at two widths match to the
      pixel, and in-page navigation, tabs and the language switch behave the
      same. Each page loads 47 KB less JavaScript (about 264 KB → 217 KB gzipped).
      Repeat each quarter: read `node_modules/next/dist/docs/` for the new
      version first, per `AGENTS.md`. Six runtime dependencies don't justify a
      bot opening PRs.
- [x] **(S) T3. Keep `.DS_Store` out of deploys.** *Done 2026-10-08.*
      `public/.assetsignore` lists `.DS_Store`; the build copies it into `out/`,
      where Wrangler reads it with gitignore rules. Applied to the built `out/`,
      those rules skip all four `.DS_Store` files and still upload all 101
      product photos. Only a manual `npm run deploy` from a Mac was affected;
      Workers Builds builds from git, which never had them.
- [ ] **(S) T5. Uptime monitor** on `velels.com/uk` and one product URL, on a free
      tier. A static Worker rarely goes down, but a bad deploy or a DNS mistake
      would otherwise surface only when a customer says so.
- [ ] **(S) T6. Confirm domain auto-renew.** RDAP shows expiry on 2027-08-28.
      Check in Cloudflare Registrar that auto-renew is on and the card on file
      will still be valid then.
- [x] **(S) T7. Stop other sites framing ours.** *Done 2026-10-08.*
      `public/_headers` sends `Content-Security-Policy: frame-ancestors 'none'`
      and `X-Frame-Options: DENY` on every path. A full CSP is not worth it
      here: the inline `lang` script and the JSON-LD would need hashes, and the
      site takes no input.

---

## P. Tech: page weight and the photo pipeline

This is where the biggest measurable win is. Images are nearly all of what a
visitor downloads.

- [ ] **(M) P1. Cloudflare image loader for `next/image`.** *(from L1)* Blocked on
      B9. It gives the biggest saving on the site:
      - The catalogue's 2.0 MB of cards drops to roughly a quarter. A phone card
        needs about 570 px at DPR 3, not 1167 px.
      - Thumbnails drop from full photos to a few KB each, so a product page
        stops downloading its whole gallery on open.

      Five thousand unique transformations a month are free, and 101 photos at
      four widths plus a thumbnail come to about 500. Once `srcset` is live, the
      `InstagramFeed` `sizes` fix in full-plan Phase 7 starts to matter, and AVIF
      becomes possible.
- [x] **(S) P2. Cards visible without JavaScript.** *Done 2026-10-06.* Every
      `.reveal-base` section is visible in the static HTML. After hydration,
      `ScrollReveal` hides only a section that starts below the screen
      (`is-pending`), out of sight, and fades it in on arrival with the same
      stagger. The `js`-class idea above would only have helped when scripts
      fail: with them working, cards still waited for hydration.
      Catalogue on a throttled phone (Lighthouse's 150 ms, 1.6 Mbps, 4× CPU),
      median of three: first card visible 12.9 s → 2.2 s, LCP 4.05 s → 2.43 s.
      With every script removed, no section stays hidden. What was on screen
      at load, and cards a category switch brings in, now appear without the
      fade.
- [ ] **(M) P4. Owner: re-encode the set from originals, all at 4:5.** *(from
      L5)* Seventeen photos are over-encoded, and the set comes in 20 sizes.
      Linear now has one 4:5 photo and four 2:3 ones. The Azure re-encode from the
      owner's HEIC files produced smaller files *and* higher SSIM than the shipped
      WebP. The reason is that the carousel shows a 4:5 box with `object-cover`,
      so about 17% of every 2:3 frame is never seen. Do it one product at a time,
      checking each crop by eye. Once P1 ships, each file is the master that
      Cloudflare resizes and re-encodes, so it should be high quality rather than
      small. Preparing one takes any photo app:
      - Crop to 4:5 where it looks right. That choice stays human.
      - Export about 1600–2000 px wide, sRGB, at high quality. HEIC needs
        converting first; macOS `sips` reads the owner's files where `sharp`
        could not.
- [x] **(S) P5. Send each page only the text it uses.** *Done 2026-10-08.*
      `clientMessages()` in `src/i18n/clientMessages.ts` passes only the seven
      namespaces client components read; the legal pages, footer and editorial
      copy now reach the browser only as rendered HTML. Per page, gzipped: HTML
      22.7 KB → 13.0 KB on average, and the `catalog.txt` a category switch
      downloads 15 KB → 7 KB. All 47 pages render the same markup as before.
      Not done: trimming `products` to the one product a page shows. The
      catalogue cards need all 11 names, so it would take nested providers for
      about 2 KB more.
- [ ] **(S) P6. Longer caching for product photos.** Today `/products/*`
      revalidates on every view (`max-age=0`), on purpose, because a replaced
      photo keeps its filename. If a replaced photo always gets a new filename,
      photos can be cached for a year like `/_next/static`. The cost is a rule
      someone has to remember, and updating `products.ts` with each new name.
      Decide after P1, once it is clear how Cloudflare caches the resized
      copies.
- [ ] **(S) P7. Lighthouse again**, once P1 and P2 ship, against the 2026-09-16
      baseline in L5. Use `--throttling-method=devtools`. After a month, compare
      with Umami's field Core Web Vitals, which count for more than a lab run.

---

## G. Growth: conversion, search and the next features

- [ ] **(S) G1. Tell the visitor to paste.** Direct is the only purchase path.
      The DM link cannot carry text, so the button copies the message for the
      visitor to paste. Nothing on the page says so. The only confirmation is a
      toast on the tab she has just left. If the clipboard write fails, the
      failure is swallowed silently and the legacy fallback is never tried. Add
      one visible line by the button, for example «Ми скопіюємо повідомлення,
      вставте його в чат». Fall back to the legacy copy when the async write
      rejects.
- [ ] **(M) G2. Email signup in the footer.** *(from full plan Phase 6)* One
      field, double opt-in, on MailerLite's free tier. Their hosted form posts
      straight to MailerLite, so it works on a static export with no server. This
      is the fallback channel B6 asks for. Update the privacy policy in the same
      change: it currently says the site collects nothing, and after this that is
      false.
- [ ] **(M) G3. Category pages as real routes.** Today
      `/uk/catalog?category=dresses` declares `/uk/catalog` as its canonical,
      which is correct for a filter. It also means no page can rank for
      «суцільні купальники» or «курортні сукні». L4 named `/catalog/[category]` as
      the better option for search and chose the smaller fix for launch.
      Prerender one page per category, each with its own title and description,
      and point the Navbar at them. Keep old `?category=` links working, since
      they are already shared. This also fixes `LocaleSwitcher` dropping the
      category when switching language.
- [ ] **(M) G4. Landscape share cards per product.** *(from L3)* Blocked on B9, or
      the owner supplies 11 files. A portrait photo in a 1.91:1 card is cut to a
      strip across the middle of the garment. Someone has to choose the crop for
      each product.
- [ ] **(S) G5. Model height and size on the PDP**, once B3 supplies the data. One
      line under the photos, per colourway.
- [ ] **(L) G6. The order form, when B4's trigger fires.** Settle the platform
      first. The full plan says Vercel, Postgres and Payload. The lite plan's
      deferred table says a free Worker plus D1 is enough. Those are different
      projects, and the Vercel choice was made before Cloudflare was in place and
      working. My recommendation is to stay on Cloudflare: the form needs one
      Worker route and one D1 table. Payload is a separate decision (G7), and it
      shouldn't pull hosting along with it.
- [ ] **(S) G7. Count how often the owner asks for content changes.** Payload is
      in the plan so the owner can edit without a developer. If most requests are
      photo swaps and copy fixes, the PR flow may be enough for a long
      time. If prices and new Models change monthly, the CMS earns its $5 a month
      (Workers Paid, for the bundle size). Decide from the count.
- [ ] **(M) G8. Preview links the owner can open.** *(from the lite deferred
      table)* The owner can't see a branch before it is merged. Since
      `workers_dev: false`, version preview URLs return 404 as well. A second
      Worker with `"routes": []` would give each PR a link to send to the owner,
      and a `noindex` build keeps it out of search.
- [x] **(S) G9. Show the new colour on a phone.** *Done 2026-10-06.* On a phone
      the gallery sits above the swatches, so a colour change happened off
      screen. A swatch tap now brings the gallery up under the navbar, but only
      when its top is hidden; never on desktop, and in one jump under reduced
      motion. Focus stays on the swatch. The swatches then sit 53–117 px below
      the fold on 360–430 px phones; showing the whole photo was preferred over
      keeping them in view.

---

## D. Code and docs debt, low priority

- [ ] **(S) D1. Rewrite the README.** Replace the `create-next-app` text with what
      someone new needs:
      - how to run the site locally
      - that a push to `main` deploys
      - the three build variables (`NEXT_PUBLIC_SITE_URL`,
        `NEXT_PUBLIC_ALLOW_INDEXING`, `NEXT_PUBLIC_UMAMI_WEBSITE_ID`), and that
        they are set in Workers Builds
      - where the originals for photos and video live, outside the repo
      - a pointer to `AGENTS.md` and `docs/`

      This matters more than its size suggests. Today one developer knows how
      the site ships.
- [x] **(S) D2. Dead code.** *Done 2026-10-05.* Removed the 17 unused message
      keys from both locales (now 279 leaf keys, counts updated in
      `AGENTS.md`), `siteConfig.host`, the `lh3.googleusercontent.com`
      `remotePatterns`, the no-op `bg-surface-variant`, and the unused CSS
      `.animate-slide-down`, `.aspect-9-16`, `.delay-400` and `.delay-500`.
      Two follow-ons: `@keyframes slideDown` went with `.animate-slide-down`,
      and `ScrollReveal`'s `delay` type no longer offers the two removed
      delays. `text-heading-lg` is unused too but stays, as part of the type
      scale in `AGENTS.md`. Tailwind now scans only `src/`: it had been
      turning words in `docs/` and `AGENTS.md` into 30 rules of CSS, such as
      `.container`, `.blur` and the two removed delays (2.4 KB on every page).
      Full-page screenshots of six pages at desktop and phone width match
      `main` pixel for pixel with the photos hidden; the photos themselves
      vary between two runs of `main` too.
- [x] **(S) D3. Stale statements in comments.** *Done 2026-10-05.*
      `.env.example` no longer mentions the "via host" signature, `indexing.ts`
      describes Workers Builds instead of GitHub Pages and Vercel, and the
      error-reporting comment in `error.tsx` is gone.
- [x] **(S) D4. 23 bracket text values in 6 files.** *Done 2026-10-06.* The
      three buttons on the 404 and error pages matched `text-label-md` exactly.
      The other ten elements got eight one-off `@utility` classes with the
      same values. Computed font, size, line height, letter spacing, weight and
      case match `main` for every one at desktop and phone width, error page
      included, and five pages are pixel-identical to `main` with photos
      hidden. The "Known violations" line in `AGENTS.md` is gone.
- [x] **(S) D5. Tracked leftovers.** *Done 2026-10-05.* `.gemini/pdf_content.txt`
      is deleted: the owner's original brand copy, garbled by a PDF extraction
      for the info pages in `2becd87`, read by nothing, and still in git history.
      `stitch-assets/` and `active_skills_guide.md` were removed on 2026-09-29.
- [x] **(S) D6. A few unit tests.** *Done 2026-10-05, with Vitest rather than
      `node:test`.* Vitest is what the Next.js docs use and needs no homemade
      resolver for `@/` imports; it is one dev dependency and never reaches the
      site. It required `@types/node` ^22, which also matches the Node 22 the
      site runs on. 20 tests cover `priceView()`, `isNewRelease()` (including
      the day-60 boundary), `productImageAlt()` against the real `uk` and `en`
      messages, `absoluteUrl()`, `localeUrl()` and `localeAlternates()`.
      `npm run build` runs them before `next build`. Each test was shown to
      fail when its function was broken on purpose; the first pass found that
      `absoluteUrl()` and the hreflang links needed tests of their own.
      Vitest strips types without checking them, and `next build` type-checks
      only the site's code, so a type error in a test passed every check.
      `npm run typecheck` (`tsc --noEmit`, about 2 s) now runs after lint and
      covers every `.ts` file.
- [ ] **(S) D7. Small fixes.** *All but the last done 2026-10-06, each checked
      in headless Chrome against the built site.*
      - ~~`error.tsx` renders no `<h1>`.~~ `StatusPage` makes the title the
        `<h1>` when there is no status code; the 404 keeps "404" as its `<h1>`.
      - ~~`smoothScroll.ts` cannot be interrupted by the user's own scroll.~~
        A wheel, touch, key or mouse press now ends the glide where it is.
      - ~~The hero button and a native `#collection` jump stop 100 px
        apart.~~ `scroll-padding-top: 100px` is gone from `globals.css`.
        `#collection` was the only `#hash` target, and it carries its own
        `scroll-mt`, so both now stop with the grid right under the navbar
        at desktop and phone width.
      - ~~The mobile drawer has no link to the whole catalogue.~~ «Усі» /
        "All", the catalogue filter's own label, now heads the drawer's
        catalogue list. The desktop dropdown is unchanged.
      - English copy on the 404, only if B8 says English is a market.
        *(from L3)* There is one static `404.html` for every unknown path,
        `/en` included, so English means a bilingual page or a script that
        swaps the text on `/en` paths.

---

## Considered and not recommended

On top of the "Explicitly not doing" table in the full checklist, which stands
unchanged.

| Not doing | Why |
| --- | --- |
| A/B testing | At about 10 orders a month no test would ever reach significance. Decide from the counts and the owner's judgement |
| Client-side error reporting (Sentry etc.) | The site is static, and the one path that matters, the Direct handoff, was tested by hand. G1 covers its silent failure. Revisit when the form lands |
| A full Content-Security-Policy | Hashing the inline scripts costs more than it protects on a site that takes no input. T7 covers framing |
| Dependabot or Renovate | Six runtime dependencies, and every merge deploys. A quarterly manual bump (T2) is less noise |
| Google Merchant Center | Merchant listings need a purchase on the page (L3). Revisit with the form |
| A Worker script for the `/` redirect | A dashboard Redirect Rule does the same job with no code (N) |
| A photo script (was P3) | Once P1 ships, Cloudflare picks the width, quality and format per request, which was most of the script's job. What is left per photo, a 4:5 crop and a high-quality export, is a few clicks in any photo app (P4). Write it if photo changes become frequent |
| A scheduled rebuild (was T4) | Its only job was clearing the "New" badges, and the owner chose on 2026-10-02 to let them clear with the next merge. A badge shows until the first build on or after `releasedAt` + 60 days, and the build date is UTC, so on that day it takes a build after 03:00 Kyiv time. The five August badges clear with the first merge after that point on 2026-10-11 |
