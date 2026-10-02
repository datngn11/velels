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

## Where things stand, 2026-09-28

Reviewed twice, against the code, the built `out/` and the live site, not
against the boxes in lite. The second pass included an independent read of all
58 files in `src/`, and every finding below was re-checked by hand.

**Working.**

- Every page is a static file on a Cloudflare assets-only Worker. A push to
  `main` deploys it, and Workers Builds reported success on the PR #31 merge.
- `http` and `www` both reach the apex in one 301 with the query string kept.
- Canonicals, hreflang, the sitemap (44 URLs) and `robots.txt` are correct at the
  edge. The `robots.txt` served is ours, not Cloudflare's managed one, which
  closes the question left open in L3.
- Product JSON-LD says `MadeToOrder`. No stock or sold-out state exists anywhere
  in the UI.
- PR #30 (the SEO pass) and PR #31 (the new Linear photo) are live.
- Umami loads on every page.
- `/_next/static` is cached for a year, and a stray URL returns a real 404.
- `tsc` and `eslint` pass, and the two locale files are key-identical.
- The Direct handoff worked in the Instagram in-app browser on 2026-09-22.

**Open from lite.** Share previews were never checked in a real app. No
keyboard-only pass has been done. The dress size chart still has gaps. The size
guide has no height column. The weekly DM count and the story link tags are both
unticked. The image loader was never built.

**New findings.**

- **The Instagram bio link runs JavaScript before it redirects.** `/` is an
  empty page whose only content is a client-side redirect to `/uk`. Every
  visitor from the bio link downloads that page and its scripts before the real
  homepage starts loading.
- **Grid cards are invisible until JavaScript runs.** `.reveal-base` sets
  `opacity: 0` in CSS, so the product cards in the static HTML of the catalogue
  and the homepage cannot paint until hydration. If the script fails, they never
  appear.
- **Three statements on the live site are false** (C1). The privacy policy says
  button taps are recorded "without the contents of your order", but the event
  sends the product and the size. The FAQ tells customers to ask about
  «наявності». The homepage and the About page say garments are made in «невеликими
  партіями».
- **Two scripts ignore reduced motion**, which `CLAUDE.md` lists as one of the
  two rules most often broken (A1). Thumbnail taps in the gallery smooth-scroll,
  and so does opening a URL with a `#hash`.
- **The dress chart has gaps in all three measurements**, not only bust as lite
  records. Bust 85, 89 and 93, waist 65, 69 and 73, and hips 91, 95 and 99 fit
  no size.
- **The site states two different production times.** The PDP says 2–4 working
  days, while the Product JSON-LD says 3–5 calendar days.
- **Images are most of the page weight.** A visitor who scrolls the whole
  catalogue downloads 2.0 MB of full-size card photos. Gallery thumbnails are
  64 px boxes that each load the full photo, so opening a product downloads its
  whole gallery. The 101 photos come in 20 different sizes, and the recipe for
  converting them exists only in commit messages.
- **Every page carries all of its locale's text.** The full `uk.json` goes to
  the browser on every page, including all nine legal pages and the copy for
  all 11 products.
- **Pull requests get a review but no build.** CodeRabbit comments on every PR,
  but Workers Builds builds only `main`. Nothing builds a branch before its
  merge deploys it.
- **`npm audit` reports 10 advisories** (1 critical, 8 high). None apply to a
  static site with no server. See T2.
- **Live responses carry HSTS and `nosniff` only**, so any site can frame the
  pages.
- **A manual `npm run deploy` from a Mac publishes four `.DS_Store` files**,
  because nothing excludes them from `out/`.
- **The README is the stock `create-next-app` text.** It mentions GitHub Pages,
  Vercel and a removed `basePath` variable, and says nothing about how this site
  deploys. Two code comments still describe things that were removed (D3).
- **No tests exist in the repo.**
- **The domain renews on 2027-08-28**, confirmed by RDAP.

---

## N. Due now

Dated, or due because something shipped this week.

- [ ] **(S) Re-scrape share previews and request reindexing.** *(from L3 and L8)*
      PR #30 changed every product title and alt, and it went live today. Paste
      a product link and the homepage into the apps people actually share links
      in: Telegram, Instagram DM, Viber and WhatsApp. Viber is on the list because
      so many Ukrainian customers use it. Product `og:image` files are WebP, so
      check that each app actually draws the image. Run the homepage and one
      product through Facebook's Sharing Debugger, which also refreshes
      Facebook's cache. In Search Console, request indexing for the 11 Ukrainian
      product URLs.
- [ ] **(S) Rebuild on or after 2026-10-11, or the "New" badges never clear.**
      Five products (Linear, Azure, Glacier, Lunar, Noblesse) show the badge,
      confirmed on the live catalogue. `isNewRelease()` compares `releasedAt`
      with the *build* date, so the badges clear only on a build dated
      2026-10-11 or later. Any push after that date clears them, and so does
      "Retry build" in the Cloudflare dashboard. T4 removes the need to remember.
- [x] **(S) Redirect `/` at the edge.** The bio link is the bare domain (L3), and
      today it reaches the homepage only after a client-side redirect. Add a
      Cloudflare Redirect Rule next to the existing `www` rule: the exact path
      `/`, sent to `/uk` with a 302, query string preserved. A 302 rather than a
      301, because browsers cache a 301 indefinitely and the locale choice may
      change. No code change, and no Worker script. It replaces the optional
      Worker redirect item in L1. Keep `RootRedirect` as the fallback.

      It also fixes the Umami counts. Before the rule, every bio visit was
      counted twice, once on `/` and again on `/uk` after the client-side
      redirect (27 and 25 visitors on 2026-09-29). The edge now answers `/`
      before any page or script loads, so Umami never records it. The bio link
      stays `velels.com`. Untagged `/uk` visits with no referrer are then mostly
      the bio, not only the bio: typed URLs and links pasted into DMs land there
      too, which L3 accepted at this volume. Search visits carry a referrer, so
      they separate out.
      In Umami data from before 2026-09-30, read `/` as bio arrivals and don't
      add it to `/uk`.

      *Done 2026-09-30.* "Root to /uk" in `cloudflare-setup.md`. Checked at the
      edge: `/` and `http://velels.com/` 302 to `https://velels.com/uk` in one
      hop, `/?ref=story&utm_source=ig` keeps its query, and `/uk`, a product
      page, `robots.txt` and a stray URL answer as before. `www.velels.com/`
      takes two hops, 301 then 302, which is not worth a third rule.
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

- [x] **(S) C1. Three false statements.** Fix these first. The first is in a legal
      document, and the other two contradict the business model.
      - The privacy policy's analytics section (`info.privacy`, `uk.json` line
        381) says the Direct button tap is recorded «без вмісту вашого
        замовлення». The `ig_dm_click` event sends the product and the size.
        Say so. The same sentence calls the button «Замовити в Instagram», but
        its label is «Замовити через Instagram».
      - The FAQ answer on buying separates says «Для уточнення наявності
        зверніться до нас» ("confirm availability"). Nothing is ever out of stock.
      - The homepage editorial and the About page both say each piece is made
        «невеликими партіями» ("small batches"). Every garment is sewn after
        its Order.

      *Done 2026-10-01, in both locales.* The privacy policy now names what each
      event carries (the model and size, or the model) and says the service
      never receives the Instagram message. Its "last updated" date moved to
      2 October, the day the owner approved the wording. The FAQ says to write
      in Direct to order only the top or only the bottom. Both brand paragraphs
      say «шиється на замовлення».
- [ ] **(S) C2. Production time in the JSON-LD.** `jsonLd.ts` declares handling
      time as 3–5 `DAY`. The PDP says «Виготовлення 2–4 робочі дні», and the
      launch plan says 4 working days. Once B5 settles one figure, the JSON-LD
      should state it in working days.
- [ ] **(S) C3. Smaller copy errors.** *All but the owner question done
      2026-10-01, in both locales where both had the error. The FAQ's exchange
      answer had the same size-only wording as the PDP and changed with it.*
      - `en` Ezra is "Unpadded and unlined… with an additional lining". The
        Ukrainian says unpadded and lined, so "unlined" is wrong.
      - The `en` nav says "Bikinis" and the catalogue says "Two-Pieces". Pick one.
        *Owner, 2026-10-02:* «суцільні» and «роздільні» in Ukrainian, which both
        already said, and "One-Pieces" and "Bikinis" in English. The catalogue
        filter and its meta description now say "Bikinis" too.
      - «Бестселлери» is misspelt; it should be «Бестселери».
      - The Instagram strip heading says «@VELÉLS», but the handle is
        `@velelswim`.
      - The terms say orders «підтверджуються після отримання оплати». A COD
        order is confirmed on the 500 UAH prepayment, not on full payment.
      - The PDP promises a size exchange, while the returns page allows size *or
        Model*. The PDP line can say both.
      - **Owner:** keep «New» and «Swimwear» in English on the Ukrainian site, or
        translate them? Lite L4 records the badge as translated, but `uk.json`
        now says «New».
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
      `/cdn-cgi/image/` returns 404, which blocks P1 and G3. Separately,
      re-export the homepage share image at 1200×630 from the source file.

---

## A. Accessibility

- [x] **(S) A1. Reduced motion in two scripts.** `ImageCarousel.tsx` calls
      `scrollTo({ behavior: "smooth" })` on every thumbnail tap. A behaviour
      passed from JavaScript overrides the CSS reset, so a visitor with reduced
      motion set watches the gallery slide through every photo in between.
      `SmoothScrollHandler.tsx` smooth-scrolls to a URL `#hash` on load, with the
      same gap. Both need the `matchMedia` check that `smoothScroll.ts` and
      `useVideoAutoplay` already do.

      *Done 2026-10-01.* `scrollBehavior()` in `src/lib/utils/motion.ts` returns
      `"auto"` under reduced motion, which hands the decision back to the CSS
      reset. It covers a third call nobody had listed: `SmoothScrollHandler`
      also smooth-scrolled on every same-page anchor click. `smoothScroll.ts`
      and `useVideoAutoplay` now share the same query.
      Tested 2026-10-02 in headless Chrome, sampling the scroll position every
      frame after a tap on Azure's ninth thumbnail and after a `#collection`
      anchor click. With reduced motion emulated, both arrive in one frame. On
      the old code they passed through 57 and 25 positions on the way, and
      without the preference both still glide.
- [ ] **(S) A2. Selected state is visual only.** No `aria-pressed` or
      `aria-current` on the size and colour buttons, the catalogue filters, the
      size-guide tabs or the gallery thumbnails. A screen-reader user can't tell
      which size she has chosen before she opens Instagram.
- [ ] **(S) A3. Mobile drawer.** When the catalogue section is collapsed, its links
      are hidden with `max-h-0 opacity-0`, and neither removes them from the tab
      order. That is the same defect L5 fixed in the desktop dropdown. The toggle
      also has no `aria-expanded`.
- [ ] **(S) A4. Ukrainian labels for four controls.** "Open menu", "Close menu",
      "Close" and `Size ${size}` are hardcoded English on the Ukrainian site
      (`Navbar.tsx`, `SizeGuideModal.tsx`, `ProductInfo.tsx`). Each needs a key in
      both locale files.
- [ ] **(S) A5. The toast is silent.** `Toast.tsx` has no `role="status"`, so the
      "copied" confirmation is never announced. See G1 for the larger problem
      with that confirmation.
- [ ] **(S) A6. Owner: a pause control on the hero video.** It loops with no way
      to stop it. That fails WCAG 2.2.2 for visitors who have not set reduced
      motion. A small pause button in a corner is the usual answer, and the owner
      should see it before it ships.

---

## T. Tech: keep what is live safe

Cheap, and each one protects something already in production.

- [x] **(S) T1. A build on every pull request.** Merging into `main` deploys.
      CodeRabbit reviews each PR, but nothing builds one: the commit checks on
      PR #31 show only CodeRabbit, and Workers Builds appears only on the merge
      commit. This week's merge conflict was caught only because a build was run
      by hand. The cheapest fix is the Workers Builds setting that builds
      non-production branches, if the account offers it. Otherwise add a GitHub
      Action, the repo's first, running lint, `tsc --noEmit` and `next build`.
      The build also fails on a locale key present in one language file and
      missing from the other. Add the L8 Umami grep as a last step.

      *Built 2026-10-01 in Workers Builds, not GitHub Actions.* A GitHub Action
      was written first, but the account's Actions are locked by a stale
      billing flag (balance $0.00). `npm run build` now runs lint, the locale
      check, `next build` and the Umami check, and branch builds are on with
      `npx wrangler versions upload` as the version command
      (`cloudflare-setup.md`, "Workers Builds"). This is stronger than the
      Action would have been: the same checks stop a broken `main` from
      deploying, and the Umami check sees the real id. Branch builds get no
      build variables, so in practice that one check runs on `main` only.

      One correction to the above: a one-sided locale key does **not** fail
      `next build`. With `nav.catalogue` deleted from `en.json`, it exited 0,
      logged `MISSING_MESSAGE` 88 times and shipped the raw key path in
      `out/en.html`. `npm run check:locales` is what catches it. There is no
      separate `tsc` step, because `next build` type-checks.

      *Done 2026-10-02.* PR #33 went green on Workers Builds, and its merge
      deployed with all four checks passing. A GitHub ruleset on `main` now
      requires "Workers Builds: velels", requires a PR, and has no bypass, so a
      direct push to `main` is refused (`cloudflare-setup.md`, "On GitHub").
- [ ] **(S) T2. Upgrade Next to 16.3.x and bump the rest.** None of the 10 audit
      findings reach the live site: it is static files, with no server, no Server
      Actions, no middleware and no image optimiser running. They start to matter
      the day any server code ships, whether that is the form Worker or Vercel.
      Upgrading is cheapest now, while checking it means building and diffing
      `out/` against the current build. Read `node_modules/next/dist/docs/` for
      the new version first, per `AGENTS.md`. Repeat each quarter. Six runtime
      dependencies don't justify a bot opening PRs.
- [ ] **(S) T3. Keep `.DS_Store` out of deploys.** Add `public/.assetsignore`
      containing `.DS_Store`. The build copies it into `out/`, and Wrangler reads
      it from there. Today `out/` holds four of them, and a manual
      `npm run deploy` from a Mac publishes them. Workers Builds runs on Linux
      and is unaffected.
- [ ] **(S) T4. Scheduled rebuild.** A daily build, so a `releasedAt` badge
      clears on its date without anyone pushing. That is the only date-driven
      behaviour left: a sale is switched on and off by editing `salePrice`,
      since `saleEndsAt` was removed in `8bd0e61`. Use a Workers Builds trigger if
      the API offers one. Otherwise run a GitHub Actions cron that builds and
      runs `wrangler deploy` with a scoped API token.
- [ ] **(S) T5. Uptime monitor** on `velels.com/uk` and one product URL, on a free
      tier. A static Worker rarely goes down, but a bad deploy or a DNS mistake
      would otherwise surface only when a customer says so.
- [ ] **(S) T6. Confirm domain auto-renew.** RDAP shows expiry on 2027-08-28.
      Check in Cloudflare Registrar that auto-renew is on and the card on file
      will still be valid then.
- [ ] **(S) T7. Stop other sites framing ours.** Add
      `Content-Security-Policy: frame-ancestors 'none'` and
      `X-Frame-Options: DENY` for `/*` in `public/_headers`. A full CSP is not
      worth it here: the inline `lang` script and the JSON-LD would need hashes,
      and the site takes no input.

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
- [ ] **(S) P2. Cards visible without JavaScript.** Hide `.reveal-base` only
      once a script has run. The root layout already has an inline script that
      sets `lang` before paint. Have it add a `js` class to `<html>` as well, and
      scope the `opacity: 0` rule to `.js .reveal-base`. Cards then paint from
      the static HTML, and a failed script leaves them visible rather than blank.
      Re-measure the catalogue LCP afterwards: cards painting before hydration
      should move it.
- [ ] **(S) P3. A script for product photos.** Put the recipe used for Azure
      (`37887f7`) and Linear (`3f34a26`) into `scripts/`, so the next photo takes
      one command. The recipe:
      - Apply the EXIF rotation and convert to sRGB.
      - Crop to 4:5 and resize to 1167×1459.
      - Encode WebP at quality 86 with effort 6.
      - Print the file size, and the SSIM against the source as displayed.

      The crop offset stays a human decision, so the script takes it as an
      argument and writes a preview to look at. `sharp` is already in
      `node_modules` through Next.
- [ ] **(M) P4. Owner: re-encode the set from originals, all at 4:5.** *(from
      L5)* Seventeen photos are over-encoded, and the set comes in 20 sizes.
      Linear now has one 4:5 photo and four 2:3 ones. The Azure re-encode from the
      owner's HEIC files produced smaller files *and* higher SSIM than the shipped
      WebP. The reason is that the carousel shows a 4:5 box with `object-cover`,
      so about 17% of every 2:3 frame is never seen. Once P3 exists this is mostly
      waiting for the originals. Do it one product at a time, checking each crop
      by eye.
- [ ] **(S) P5. Send each page only the text it uses.** `[locale]/layout.tsx`
      hands the whole locale file to `NextIntlClientProvider`. As a result, every
      product page carries the privacy policy and the copy for all 11 products,
      both in its HTML and in its React payload. Pass only the namespaces that
      client components read. Small next to the images, but each page pays it
      again.
- [ ] **(S) P6. Longer caching for product photos, after P3.** Today `/products/*`
      revalidates on every view (`max-age=0`), on purpose, because a replaced
      photo keeps its filename. If P3 puts a short content hash in the filename,
      photos can be cached for a year like `/_next/static`. The cost is updating
      `products.ts` whenever a file changes, and P3 can print the new line.
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
      photo swaps and copy fixes, P3 plus the PR flow may be enough for a long
      time. If prices and new Models change monthly, the CMS earns its $5 a month
      (Workers Paid, for the bundle size). Decide from the count.
- [ ] **(M) G8. Preview links the owner can open.** *(from the lite deferred
      table)* The owner can't see a branch before it is merged. Since
      `workers_dev: false`, version preview URLs return 404 as well. A second
      Worker with `"routes": []` would give each PR a link to send to the owner,
      and a `noindex` build keeps it out of search.

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
- [ ] **(S) D2. Dead code.**
      - Unused message keys: `products.*.colorName` (all 11),
        `productDetail.saleBadge`, `nav.story`, `nav.ig`, `footer.ig`,
        `footer.legal` and `editorial.title`. Remove each from both locale
        files together.
      - `siteConfig.host`, which nothing reads.
      - Unused CSS classes: `.animate-slide-down`, `.aspect-9-16`, `.delay-400`,
        `.delay-500`.
      - The `lh3.googleusercontent.com` `remotePatterns` in `next.config.ts`.
      - `bg-surface-variant` in `InstagramFeed.tsx`, which is not a theme token
        and emits no CSS.
- [ ] **(S) D3. Stale statements in comments.** The two in lite L4 and L6 and
      the `?ref=ig` one in `RootRedirect` were fixed on 2026-09-29.
      - `.env.example` describes the "via host" signature, removed on
        2026-09-21.
      - `indexing.ts` still talks about GitHub Pages and Vercel.
- [ ] **(S) D4. 23 bracket text values in 6 files.** Move them to `@utility`
      classes. `StatusPage.tsx` holds 11 of them.
- [ ] **(S) D5. Tracked leftovers.** `.gemini/pdf_content.txt` sits in a public
      repo and is not served. It is the owner's original brand copy, extracted
      from a PDF and garbled by the extraction. Keep it on purpose or delete it.
      `stitch-assets/` and `active_skills_guide.md` were removed on 2026-09-29.
      Nothing referenced either one.
- [ ] **(S) D6. A few unit tests with `node:test`, no new dependency.** For the
      logic that fails silently: `priceView()`, `isNewRelease()`,
      `productImageAlt()` and `localeUrl()`. Run them in T1.
- [ ] **(S) D7. Small fixes.**
      - `error.tsx` renders no `<h1>`.
      - `smoothScroll.ts` cannot be interrupted by the user's own scroll, and
        it lands 100 px away from where a native `#collection` jump does.
      - The mobile drawer has no link to the whole catalogue.
      - English copy on the 404, only if B8 says English is a market.
        *(from L3)*

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
