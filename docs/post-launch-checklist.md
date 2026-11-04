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

## Where things stand, 2026-11-03

Checked against the code, the live site, Search Console, Umami and `npm audit`.
The previous snapshot, dated 2026-10-08, is in git history. Done since then:
category pages (G3), screen-reader fixes (A2, A4, A5), preview links (G8), the
README (D1), fresh share previews (N), the first read of Umami and Search
Console (N), Next 16.4.3 (T8), a header landmark (A7), two-factor on
Instagram (B6) and domain auto-renew (T6). English is not a market (B8), and
«New» and «Swimwear» stay in English (B10). The production time stays 2–4
working days (B5, C2: the two figures already agreed). The uptime monitor (T5)
and the paste hint (G1) were declined, and the dress chart gaps (B1) skipped.
What was left of the 2026-10-29 code audit, once checked against the code, is
A8, A9, B12, D8, G11 and G12; the rest was already here or is under "Considered
and not recommended".

**Working.**

- Every page is a static file on a Cloudflare assets-only Worker. Merging into
  `main` deploys it. Every pull request is built first, and a GitHub ruleset
  will not merge one whose Workers Builds check failed (T1).
- `http` and `www` reach the apex in one 301, and `/` reaches `/uk` in one 302,
  both with the query string kept.
- Canonicals, hreflang, the sitemap (50 URLs) and our own `robots.txt` are
  correct at the edge. Google has indexed 37 of the 50, the English pages as
  pages of their own.
- Product JSON-LD says `MadeToOrder`. No stock or sold-out state exists anywhere
  in the UI.
- Umami loads on every page, and the order button's event records (tested
  2026-10-30).
- On real phones the main image appears in 0.8 s at the 75th percentile (Umami,
  2026-09-22 to 2026-10-30). Google's "good" is under 2.5 s.
- `/_next/static` is cached for a year, and a stray URL returns a real 404.
- The Direct handoff worked in the Instagram in-app browser on 2026-09-22.
- The production time agrees everywhere: 2–4 working days to sew, then
  dispatch, then 1–3 days with Nova Poshta (B5). The domain renews itself on
  2027-08-28 (T6).

**Still open.**

- **Nobody taps the order button.** Of 256 real visitors who opened a product
  page from 2026-09-22 to 2026-10-30, none tapped it. Customers write from the
  Instagram profile instead, so only the owner's weekly log (N) can count
  orders, and it has not started.
- **Google sends almost no one.** 3 clicks in five weeks, and the category
  pages sit around position 62. The plan is in [`seo-plan.md`](./seo-plan.md)
  (G10).
- **Images are most of the page weight** (P1, P4). Scrolling the whole
  catalogue downloads 2.0 MB of full-size card photos, and gallery thumbnails
  load the full photo each. The 101 photos come in 20 sizes.
- **`npm audit` flags 21 packages, 5 high**, all build and local tooling:
  ESLint and wrangler with its simulator. None reach the site. Next's critical
  advisories went with the 16.4.3 upgrade (T8).

---

## N. Due now

Dated, or due because something shipped this week.

- [x] **(S) Re-scrape share previews and request reindexing.** *(from L3 and L8)
      Done 2026-10-15.* PR #30 changed every product title and alt on
      2026-09-28, and C1 changed copy again on 2026-10-02. In Telegram and
      Instagram DM, the homepage and Lunar both show the current title and the
      WebP photo. Instagram shows no description, which is normal for it. One
      product stands for all 11, since every product page builds its preview the
      same way. Viber and WhatsApp were skipped: the owner says customers don't
      use them. The Sharing Debugger was skipped too, since Instagram already
      shows the fresh preview. In Search Console, indexing was requested on
      2026-10-12 and 13 for 16 Ukrainian pages: `/uk`, `/uk/catalog`, the 3
      category pages and the 11 products. The limit for velels.com was 12 a day.
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
      exchanges. Nobody taps the order button (see the first read below), so
      the prefilled «Вітаю!» message will not appear. Count every DM and order
      instead, and note when a customer mentions the site or sends a link or
      screenshot from it. Umami cannot see any of this.
- [ ] **(S) Owner: tag the story links `?ref=story`.** *(from L3)* Leave the bio
      link bare. Without the tag, story and bio traffic look identical in Umami.
      No tagged visit had arrived by 2026-10-30.
- [x] **(S) First read of the numbers.** *Done 2026-10-30, from the Umami
      export for 2026-09-22 to 2026-10-30, without Vietnam (the developer).*
      511 visitors, 546 visits and 1,649 page views; 94% of page views on
      phones, 64% inside Instagram's own browser. The weekly log has not
      started, so orders are unknown. Each number and what it settles:
      - Product page visitors: Lunar 110, Dimaya 49, Azure 43, Lendai 40,
        Noblesse 31, Linear 30, then 16 or fewer. Lunar draws twice any other
        Model; the two-pieces Lauri, Naevi and Glacier draw the least.
      - `ig_dm_click`: none from customers, though the event works. The
        `size=none` question cannot be answered.
      - `size_guide_open`: 29 opens from 256 product-page visitors, 10 of them
        on the dresses. B1 matters.
      - `/en` is 4% of page views. Ukraine is 72% of visitors, the US 11%. That
        is under B8's 5% line.
      - `?ref=story`: never seen. The bio link brought 61% of visits, other
        Instagram and Facebook links 16%, Google 3 visits.
- [x] **(S) Search Console, first look.** *Done 2026-10-30.* 37 of the 50 URLs
      are indexed. Google kept the English pages as pages of their own and
      reports no "chose a different canonical" entries. The 6 "Excluded by
      noindex" pages are an old copy from before indexing was switched on;
      validation was started. 7 pages are discovered but not yet fetched: six
      English (`/en/catalog/one-piece-swimsuits`, `/en/info/about`,
      `/en/info/contact`, and Glacier, Lauri and Laydee) and `/uk/info/privacy`.
      Requesting them by hand is optional, since English is 4% of visits. What
      to do about the low positions is in [`seo-plan.md`](./seo-plan.md).

---

## C. Copy and data that are wrong on the live site

Text changes in both locale files. Each one is small, and each is live now.

- [x] **(S) C1. Three false statements.** *Shipped 2026-10-02 in PR #36, wording
      approved by the owner.* The privacy policy says the Direct tap carries the
      model and size, and is dated 2 October. The FAQ no longer asks customers to
      confirm availability. Both brand paragraphs say «шиється на замовлення»
      instead of «невеликими партіями».
- [x] **(S) C2. Production time in the JSON-LD.** *Closed 2026-11-03 with B5:
      nothing was wrong.* Handling is 3–5 `DAY`: 2–4 to sew, plus the dispatch
      day the PDP promises. Transit is Nova Poshta's 1–3, in a field of its own.
      Google reads both as business days, Monday to Saturday unless
      `businessDays` says otherwise, so no extra property is needed.
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
- [ ] **(S) C5. Owner: the exchange line on dress pages, and five wordings.**
      *(from the 2026-11-03 SEO audit)* Every product page says «Одноразовий
      обмін розміру або моделі протягом 14 днів» (`productDetail.exchangeNote`).
      That is the swimwear rule. Dresses are ordinary clothing: the returns page
      and their Product data allow an exchange or a return within 14 days. A
      dress line such as «Обмін або повернення протягом 14 днів» fixes it. Five
      wordings in `uk.json` for the owner to confirm:
      - «вигодно» → «вигідно» (Dimaya).
      - «3-ма способами» → «трьома способами» (Lendai).
      - «візуально струнить» reads oddly (Lendai).
      - «Як бачено на @velelswim» copies the English "As seen on" (the Instagram
        block on the home page).
      - The footer says «FAQ», while the page is «Часті запитання».

---

## B. Business decisions (owner)

No code, but several of them hold up work in other groups.

- [ ] **(S) B1. Owner: close the dress size chart gaps.** *Skipped by the owner
      2026-11-03.* *(from L0 and L4)* Each
      dress size is a 2 cm band with a 1 cm hole before the next. Bust 85, 89 and
      93, waist 65, 69 and 73, and hips 91, 95 and 99 fit no size. Lite records
      only the bust. The size a customer reads is the size she puts in the DM.
      While you're at it, confirm two swimwear values: L hips are 95–100, a 5 cm
      band where every other size has 4, and dress L bust is 94–98 where the
      other sizes span 2 cm. Either could be a typo. Changing the chart takes
      five minutes once the numbers are settled. Lunar is the most visited
      Model, and 10 of the 29 size-guide opens to 2026-10-30 were on dresses.
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
- [x] **(S) B5. One production time, and when it changes.** *Settled
      2026-11-03: the site keeps 2–4 working days. Don't reopen it unless the
      owner's figures change.* The two "different" figures were one: the JSON-LD
      handling time of 3–5 days is the PDP's 2–4 days of sewing plus the
      dispatch the next working day. Delivery, 1–3 days, is stated separately in
      both. The owner's figures are sewing 2–3 working days and Nova Poshta 1–3,
      usually 2 and 1, both depending on the situation in Ukraine. The owner
      chose to keep 2–4 as a buffer day rather than promise 2–3. No queue rule
      goes on the site: at about 10 orders a month the queue is a garment or two,
      and every order is agreed in Direct before the prepayment, so a longer wait
      is said in that conversation. The launch plan's "4 working days", its
      three-garment limit and the 30-orders-a-month workshop threshold are
      frozen at 2026-08-19 and stay as written.
- [x] **(S) B6. Owner: protect the Instagram account.** *Done 2026-11-03:
      two-factor authentication is on.* It is the only order
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
- [x] **(S) B8. Owner: decide whether English is a market.** *Decided
      2026-11-03: not a market. `/en` stays live and key-identical, with no new
      work on it.* After a month of
      country data. If `/en` is under roughly 5% of visits, stop spending on it:
      the approximate currency, the English 404 copy and the Ukrainian wording on
      international orders can all wait. If it is higher, those three become real
      items. *2026-10-30:* `/en` was 4% of page views over five weeks, so the
      numbers say stop. The owner confirms.
- [ ] **(S) B9. Owner: two dashboard jobs, or the files.** *(from L3)*
      *2026-11-04: Image Transformations is on (P1). The logo is now served at
      128 to 384 px through it, by screen density (3.5 KB at 256 px instead of 50 KB), so the smaller logo file
      is no longer needed for speed; an SVG would still be sharper.* Turn on
      Image Transformations for the `velels.com` zone. Until then
      `/cdn-cgi/image/` returns 404, which blocks P1 and G4. Separately,
      re-export the homepage share image at 1200×630 from the source file.
      And a smaller logo: `public/logo_black.png` is 1326×499 (50 KB) for a
      128×48 slot on every page. An SVG, or a PNG about 384 px wide
      (`seo-plan.md` item 12).
- [x] **(S) B10. Owner: «New» and «Swimwear» on the Ukrainian site.** *Decided
      2026-11-03: both stay in English.* «New» is the product badge and
      «Swimwear» the line under VELÉLS on the home hero (`hero.subtitle`); the
      owner reads both as part of the brand. *(from C3)* Lite L4 records the
      badge as translated; `uk.json` saying «New» is the intended state.
- [ ] **(S) B11. Owner: approve the category intro sentences.** Three drafts,
      one per category page, are in `seo-plan.md` item 7. They give Google a
      sentence to quote under the category result. *2026-11-04: built with
      the wording chosen by the developer (`seo-plan.md` Phase 2); the owner
      can still change it in `categoryPages.*.intro` before or after merge.*
- [ ] **(S) B12. Owner: say on one-piece pages that the fit follows her height.**
      The seamstress cuts every one-piece's torso to the customer's Height
      (`CONTEXT.md`), and no page says so. For a tall or petite customer that is
      the main doubt about buying a one-piece online. One line in the PDP
      bullets, for one-pieces only, for example «Суцільний купальник шиємо з
      урахуванням вашого зросту». It must not name ростовка or its ranges. If
      the line asks her to give her height, the prefilled message needs a place
      for it too.

---

## A. Accessibility

- [x] **(S) A1. Reduced motion in two scripts.** *Shipped 2026-10-02 in PR #36.*
      `scrollBehavior()` in `src/lib/utils/motion.ts` hands the gallery, the
      `#hash` scroll on load and same-page anchor clicks back to the CSS
      reduced-motion reset. In headless Chrome, under reduced motion, a far
      thumbnail tap and a `#collection` click now arrive in one frame; the old
      code passed through 57 and 25 positions.
- [x] **(S) A2. Selected state is visual only.** *Done 2026-10-16.* The size
      and colour buttons and the size-guide tabs carry `aria-pressed`, and the
      gallery thumbnails `aria-current`, so a screen reader says which size she
      has chosen before she opens Instagram. The catalogue filters already had
      `aria-current="page"` from G3. Checked in Chrome's accessibility tree at
      phone width: the state follows each tap, a swipe of the gallery moves the
      current thumbnail, and the page looks the same. VoiceOver and TalkBack
      still need a real phone.
- [x] **(S) A3. Mobile drawer.** *Done 2026-10-06, found again by CodeRabbit on
      PR #40.* The collapsed catalogue list is now `inert`, so Tab skips its
      links, and the toggle carries `aria-expanded`. Checked in headless Chrome:
      collapsed, Tab goes from the toggle straight to «Про бренд»; open, it
      walks «Усі» and the three categories.
- [x] **(S) A4. Ukrainian labels for four controls.** *Done 2026-10-13.* The
      menu button, the drawer's title and close button, the size guide's close
      button and the size buttons now read «Відкрити меню», «Меню», «Закрити
      меню», «Закрити» and «Розмір S» on the Ukrainian site. The size buttons
      reuse `productDetail.size`; the others are new keys in `nav` and
      `productDetail`. The drawer's English description, "Mobile navigation
      links", only repeated its title and is gone. Checked in Chrome's
      accessibility tree at phone width in both locales; the pages look the same,
      pixel for pixel.
- [x] **(S) A5. The toast is silent.** *Done 2026-10-12.* `Toast.tsx` now keeps
      an empty `role="status"` region mounted from page load and puts the
      "copied" text into it, so screen readers announce it. In headless Chrome
      the accessibility tree shows the region as polite and atomic before the
      tap; the same node takes the text, then empties after 3 s. The toast
      looks the same, pixel for pixel.
- [x] **(S) A7. The site header is a `<nav>`.** *Done 2026-11-02.*
      `Navbar.tsx` wrapped the logo, the links and the menu button in
      `<nav id="top-nav">`, so no page had a `<header>` landmark, and on desktop
      Radix's menu inside it was labelled "Main" in English on the Ukrainian
      site too. The outer element is now `<header id="top-nav">`, and the menu
      reads `nav.mainNav`: «Основна» and "Main". In Chrome's accessibility tree
      the page now starts with a banner at phone and desktop width, and the
      desktop menu is named «Основна» on `/uk`. Screenshots of eight pages at
      both widths match the build before, pixel for pixel with photos hidden.
- [ ] **(S) A8. Small tap targets on phones.** The menu button, the Instagram
      icon and the drawer's close button in `Navbar.tsx` are 24×24 px with no
      padding, and the colour swatches in `ProductInfo.tsx` are 36×36 px
      (`w-9 h-9`), while the size buttons beside them are 44×44 px. 24 px passes
      WCAG 2.2 AA, but 94% of page views are on phones. Padding with an equal
      negative margin (`p-2.5 -m-2.5`) enlarges the icons' tap area without
      moving them. Larger swatches change the look, so compare screenshots first.
- [ ] **(S) A9. The size guide cannot scroll.** Its `Dialog.Content` in
      `SizeGuideModal.tsx` is centred with no maximum height and no overflow,
      so on a short screen (a phone held sideways, or Instagram's browser with
      its toolbar) the bottom of the guide is cut off and cannot be reached.
      `max-h-[85dvh] overflow-y-auto` fixes it. Check on a real phone held
      sideways.

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
- [x] **(S) T6. Confirm domain auto-renew.** *Done 2026-11-03.* Auto-renew is
      on in Cloudflare Registrar. RDAP shows expiry on 2027-08-28; the card on
      file has to be valid then.
- [x] **(S) T7. Stop other sites framing ours.** *Done 2026-10-08.*
      `public/_headers` sends `Content-Security-Policy: frame-ancestors 'none'`
      and `X-Frame-Options: DENY` on every path. A full CSP is not worth it
      here: the inline `lang` script and the JSON-LD would need hashes, and the
      site takes no input.
- [x] **(S) T8. Next 16.4.3.** *Done 2026-11-02.* `npm audit` rated Next
      16.3.8 critical, for the image optimisation API, Server Actions and
      `use cache`. The site uses none of them, being a static export with
      unoptimised images, so nothing reached visitors. Next and
      `eslint-config-next` 16.3.8 → 16.4.3, the current release, ten days old.
      The bundled docs show no change that touches a static export. Against
      the 16.3.8 build: all 53 pages carry the same markup and text, the
      sitemap, `robots.txt` and manifest are identical, and total JavaScript is
      the same 225 KB gzipped. What differs is shorter font class names, one
      script file fewer per page and a small inline list of script files.
      Screenshots of eight pages at phone width match pixel for pixel with
      photos hidden, the same fonts load, and a size tap, the size guide, the
      catalogue tabs and the menu work with no console errors. `npm audit`:
      22 packages (1 critical) → 21 (none critical), all tooling.

---

## P. Tech: page weight and the photo pipeline

This is where the biggest measurable win is. Images are nearly all of what a
visitor downloads.

- [x] **(M) P1. Cloudflare image loader for `next/image`.** *Built 2026-11-04;
      live with the merge.* `src/lib/imageLoader.ts`, on `main` builds only:
      width from `srcset`, quality 90, `fit=scale-down` (never enlarges),
      `format=auto` and `onerror=redirect`. Checked against velels.com: all 106
      photos transform; at 640 px they average 42 dB PSNR against the original
      scaled to the same size (worst photo 39 dB, indistinguishable side by
      side), and at 1200 px 90 of 106 come back untouched. On a phone at DPR 3
      the catalogue's photos drop from 2,058 KB to 1,012 KB and Lunar's page
      from 564 KB to 462 KB, with no broken image. *(from L1)* Was blocked on
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

- [ ] **(M) G2. Email signup in the footer.** *(from full plan Phase 6)* One
      field, double opt-in, on MailerLite's free tier. Their hosted form posts
      straight to MailerLite, so it works on a static export with no server. This
      is the fallback channel B6 asks for. Update the privacy policy in the same
      change: it currently says the site collects nothing, and after this that is
      false.
- [x] **(M) G3. Category pages as real routes.** *Done 2026-10-09.* Each
      category is a prerendered page under a slug in its locale's language,
      transliterated, as Google advises: `/uk/catalog/sutsilni-kupalnyky`,
      `rozdilni-kupalnyky` and `kurortni-sukni`, `/en/catalog/one-piece-swimsuits`,
      `bikinis` and `resort-dresses` (`src/lib/data/categories.ts`). Each
      has its own title, description, canonical and `<h1>`, carries only its
      own products in the static HTML, and pairs with the other locale's slug
      in hreflang and the sitemap (now 50 URLs). The catalogue tabs and the
      Navbar are plain links between the pages. The language switch translates
      the slug. Old `?category=` links are sent on after the page loads,
      keeping parameters such as `ref`. After the deploy, request indexing for
      the three Ukrainian category pages in Search Console.
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
- [x] **(S) G8. Preview links the owner can open.** *(from the lite deferred
      table) Done 2026-10-13; the first link came with PR #50.*
      `preview_urls: true` in `wrangler.jsonc` gives every branch build a link,
      posted on its PR as `<branch>-velels.datngn11.workers.dev`, plus one per
      commit. No second Worker was needed. Cloudflare also sends
      `X-Robots-Tag: noindex` on these hosts.
      Branch builds get no build variables, so those pages say `noindex`, keep
      their canonical on `velels.com` and load no analytics. To see a branch the
      way customers do, send its link to yourself in an Instagram DM and open it
      there, in Instagram's own browser.
- [x] **(S) G9. Show the new colour on a phone.** *Done 2026-10-06.* On a phone
      the gallery sits above the swatches, so a colour change happened off
      screen. A swatch tap now brings the gallery up under the navbar, but only
      when its top is hidden; never on desktop, and in one jump under reduced
      motion. Focus stays on the swatch. The swatches then sit 53–117 px below
      the fold on 360–430 px phones; showing the whole photo was preferred over
      keeping them in view.
- [x] **(L) G10. SEO plan, Phase 1.** *Done 2026-11-03.* Six code changes from
      [`seo-plan.md`](./seo-plan.md), none needing the owner: category links in
      the footer, product breadcrumbs through the category, a photo for each
      category page, the site-name data, the category's full name as its
      heading, and dropping the unused fonts. Phase 2 waits on B11. Checked in
      the build: all 50 pages link to the category pages; both homepages carry
      the same `WebSite` and `Organization` data with `url`
      `https://velels.com/` and `alternateName` "Velels"; each category page
      has its first Model's cover as share image and `CollectionPage`, plus a
      breadcrumb; product breadcrumbs read «VELÉLS / Сукні / Lunar» on the page
      and in the data. Font files preloaded per page went from 6 (162 KB) to 3
      (90 KB), and the first two catalogue photos load at once. On a phone the
      footer adds a «Колекція» column (172 px), and the dresses heading takes
      two balanced lines. At 768 px the footer has two columns, at 1024 px three.
      Above the footer the eight pages screenshot match the build before, except
      the breadcrumb and the category heading. Size tap, size guide, catalogue
      tabs and the menu still work, with no console errors. Check in Search
      Console from the end of November (`seo-plan.md` section 6).
- [ ] **(S) G11. Count taps on the Instagram links.** Customers write from
      the Instagram profile rather than the order button (N), but nothing
      counts the way there: the navbar's Instagram icon and the three posts in
      `InstagramFeed.tsx` carry no Umami event. One event, such as
      `ig_profile_click` with the place it was tapped, shows how many visitors
      leave the site for the profile.
- [ ] **(S) G12. Owner: show on catalogue cards that a second colour exists.**
      7 of the 11 Models come in black and white, and a card shows only its
      first photo. Lendai, Lauri, Ezra and Laydee open on white, so someone
      looking for black swimwear can't tell they come in black too. Two small
      dots by the price would show it. It is a design change, so the owner
      approves it.

---

## D. Code and docs debt, low priority

- [x] **(S) D1. Rewrite the README.** *Done 2026-10-19.* Replace the
      `create-next-app` text with what someone new needs:
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
- [ ] **(S) D8. Small fixes from the 2026-10-29 audit.** Each one was checked
      against the code on 2026-11-03.
      - **The copy can fail without a sound.** In `InstagramCheckout.tsx`, if
        `navigator.clipboard.writeText` exists but rejects, the rejection
        handler is empty: nothing is copied, no toast shows, and the
        `execCommand` fallback below it never runs. Running the fallback in the
        rejection handler may be too late, since the tap's activation is gone
        and the page is in the background by then. Running `execCommand` first,
        synchronously, and using `writeText` only when it returns false avoids
        that. Test in Instagram's browser on a real phone. Low priority while
        nobody taps the button (N).
      - **`SmoothScrollHandler` has little left to do.** No link in `src` has a
        `#` in it, and the hero button calls `smoothScrollTo()` directly. What
        remains is a re-scroll 150 ms after load when the URL carries a hash.
        Check that `/uk#collection` still lands under the navbar without it,
        then delete it and its mount in `src/app/layout.tsx`.
      - **Hero height.** `HeroSection.tsx` uses `h-[90vh]`. In iOS Safari and
        Instagram's browser `vh` is the height with the toolbars hidden, so
        the hero is taller than the screen on first load. `svh` uses the
        height with the toolbars shown. Check on a real phone.
      - **`InfoPage` types.** `info/[slug]/page.tsx` imports `getMessages`
        dynamically and casts `section.list as unknown as string[]`. A typed
        section interface removes both.
      - **`INFO_SLUGS` exists twice**, in the info page and in `sitemap.ts`,
        kept in step by a comment. Move it to `src/lib/data`: a `page.tsx` may
        only export the names Next allows.
      - **Size guide type.** Its four `<th>` and its title carry `uppercase
        tracking-wider text-xs` and similar raw classes where `AGENTS.md` asks
        for the label utilities. The catalogue heading is part of G10.

---

## Considered and not recommended

On top of the "Explicitly not doing" table in the full checklist, which stands
unchanged.

| Not doing | Why |
| --- | --- |
| A/B testing | At about 10 orders a month no test would ever reach significance. Decide from the counts and the owner's judgement |
| Client-side error reporting (Sentry etc.) | The site is static, and the one path that matters, the Direct handoff, was tested by hand. Revisit when the form lands |
| A "paste the message" line by the order button (was G1) | Declined 2026-10-12. Umami later showed that no customer taps the button (N), so the line would reach almost no one |
| An uptime monitor (was T5) | Declined 2026-11-02. A static Worker has no server to fail, and every deploy passes the build check first (T1). Revisit if the site is ever down without anyone noticing |
| A full Content-Security-Policy | Hashing the inline scripts costs more than it protects on a site that takes no input. T7 covers framing |
| Dependabot or Renovate | Six runtime dependencies, and every merge deploys. A quarterly manual bump (T2) is less noise |
| Google Merchant Center | Merchant listings need a purchase on the page (L3). Revisit with the form |
| A Worker script for the `/` redirect | A dashboard Redirect Rule does the same job with no code (N) |
| A photo script (was P3) | Once P1 ships, Cloudflare picks the width, quality and format per request, which was most of the script's job. What is left per photo, a 4:5 crop and a high-quality export, is a few clicks in any photo app (P4). Write it if photo changes become frequent |
| A pause button on the hero video (was A6) | By the letter the phone hero fails WCAG 2.2.2, Level A: it starts on its own, loops, and sits under the title. Decided 2026-10-19 to leave it. No law reaches a shop this size: Ukraine's bill 14278 is still a draft and leaves out small businesses, and the EU act exempts microenterprises. It has no effect on search, and a visitor with Reduce Motion on already gets the still photo. Of 10 big brands checked that day at phone size, 4 had no pause button, Burberry and Rolex among them. Revisit if the law changes |
| Stop remounting the gallery on a colour tap (2026-10-29 audit) | The key `${color}-${shown}` is deliberate: it opens the new colour on its first photo, as the comment in `ProductView.tsx` says. Nobody can see the cost |
| The colour in the URL, `?color=white` (2026-10-29 audit) | Nobody shares links to one colourway, and the order message already names the colour |
| A product link in the order message (2026-10-29 audit) | The message already names the Model, colour and size |
| `size_select` and `color_select` events (2026-10-29 audit) | Nobody taps the order button (N), so these would measure the steps before a step nobody takes. G11 counts the path customers do take |
| A scheduled rebuild (was T4) | Its only job was clearing the "New" badges, and the owner chose on 2026-10-02 to let them clear with the next merge. A badge shows until the first build on or after `releasedAt` + 60 days, and the build date is UTC, so on that day it takes a build after 03:00 Kyiv time. The five August badges clear with the first merge after that point on 2026-10-11 |
