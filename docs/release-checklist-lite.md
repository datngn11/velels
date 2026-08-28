# Release checklist — lite (catalogue launch)

A cut-down path to a public site, for shipping now rather than shipping complete.
The full plan is [`release-checklist.md`](./release-checklist.md) and it stays the
destination. This document is the subset that must be true before the site can be
public at all.

**What "lite" means here.** The site becomes a catalogue with one purchase path,
Instagram Direct. No order form, no database, no Payload, no Telegram bot. That is
not a downgrade of the business model. `CONTEXT.md` already treats Direct as a full
Order Channel, and the legal copy in `info/payment` and `info/terms` already says
orders are placed in Direct. Lite ships the site the copy already describes.

**What that changes.** Direct stops being one of two channels and becomes the only
one. Everything that funnels a visitor into it, and everything she needs to decide
before she opens Instagram, moves up in priority. Everything that exists to capture
her details on-site moves out of scope.

Effort: **S** ≈ under an hour · **M** ≈ half a day · **L** ≈ a day or more.

Ordering is dependency-first. L1 unblocks most of L3.

---

## L0 — Owner, before anything ships

- [ ] **S — Owner: ФОП details, and which address may be published.** ПІБ,
      registration details, РНОКПП, and the address to use. Goes in `info/terms`, not
      `info/contact`. See L6 for the placement and the competitor evidence. If the
      registered address is her apartment, ask before publishing it.

      **Narrowed 2026-08-27.** There is no shop and no rented atelier, and the
      seamstress works from home. Her address will not be published, which is also
      the correct reading of the law: Article 7 asks for the *seller's* address,
      and the seamstress is a contractor, not a party to the contract with the
      customer. Three options remain, all waiting on the owner: her own registered
      ФОП address, a paid virtual address in Kyiv at roughly 500 to 1500 UAH a
      month, or city plus email with a known shortfall against Article 7.
- [x] **S — Confirm the domain name.** Decided 2026-08-27: `velels.com`. The
      brand mark is VELÉLS and the catalogue already carries dresses, so `swim` in
      the permanent address names a category the brand has outgrown.
      `velelswim.com` was the alternative, matching the Instagram handle, the DM
      link and the `velelswim@gmail.com` address; it is not being bought, so it
      stays available to anyone. Still to register, see L1. The site URL comes from
      `NEXT_PUBLIC_SITE_URL`, so a later change is one line.

- [ ] **S — Owner: the sale.** A sale is running as of 2026-08-28 and the site knows
      nothing about it. Which Models, at what price, and when does it end? Needed
      before the L4 sale item can be built. Ask in the same message as the ФОП
      details above — each round trip costs days.
- [ ] **S — Owner: the dress size chart.** Bust runs 82–84, 86–88, 90–92, 94–98, so
      85, 89 and 93 cm fit no size. The swimwear chart is fine — it overlaps at the
      boundaries rather than gapping. Closing the gap is a manufacturing decision,
      not a developer's guess, and in lite the size she reads is the size she puts in
      the Direct message. See L4.

Deferred from Phase 0: the ростовка boundary rule and the Telegram bot. Neither is
reachable from a site that collects no height and sends no notifications.

---

## L1 — Infrastructure (Cloudflare)

Replaces Phase 1 of the full checklist. Same goal, different platform, no database.
Step-by-step operational detail lives in [`cloudflare-setup.md`](./cloudflare-setup.md).

- [ ] **S — Register the domain** at Cloudflare Registrar. `.com` at wholesale,
      about $10.44/year, same price on renewal. Requires Cloudflare nameservers,
      which is what the rest of this phase assumes anyway.
- [ ] **S — Create a Cloudflare Worker with static assets**, connected to the repo.
      Not Pages. Workers reached parity for static assets, SSR and custom domains
      in March 2026 and is the recommended path for new projects. Keep
      `output: "export"`, so every page is a prebuilt file served as a static asset
      and no Worker code runs on a page view.

      Set `not_found_handling = "404-page"` in the Worker's `[assets]` block. The
      default, `none`, serves a bare Cloudflare error page. Do **not** use
      `single-page-application`: it returns HTTP 200 for every unmatched path, which
      hands the index an unlimited supply of duplicate homepages and quietly undoes
      the canonical work in L3. Note that `out/404.html` is emitted but is Next's
      unstyled built-in page, not the `StatusPage` 404 — see L3.
- [x] **M — Remove `basePath` and retire `getAssetPath()`.** Every call site loses
      the `/velels` prefix. This is what actually fixes the broken share previews,
      and share previews are the entire distribution channel for a catalogue whose
      traffic arrives from Instagram links.
      → Done 2026-08-27. `assetPath.ts` deleted, `basePath` gone from
      `next.config.ts`, five callers unwrapped. Confirmed in the build output: the
      OG image is now `/products/...` rather than `/velels/products/...`.
- [x] **S — Drive the site URL from an env var.** `metadataBase`, the OG `url`, all
      canonicals and the `orderMessage` signature currently hardcode
      `https://velels.com`. One variable, six call sites.
      → Done 2026-08-27. `NEXT_PUBLIC_SITE_URL` reads into `src/lib/config.ts`,
      which exports `siteConfig.url`, `siteConfig.host` and `absoluteUrl()`. The
      `orderMessage` signature now takes a `{site}` placeholder. Documented in
      `.env.example`. Confirmed by building against the other domain: every
      canonical, OG url, image url and JSON-LD offer url followed.
- [ ] *Optional, **S**:* **move `hero_mobile.mp4` to R2.** R2's free tier is 10 GB
      with no egress charge, and a custom domain on the bucket is required — the
      `r2.dev` subdomain is rate-limited and documented as development-only.
      **Corrected 2026-08-28:** this was previously listed as compliance-driven, on
      the grounds that Cloudflare's terms name R2 as the only compliant way to serve
      video. That is out of date — Section 2.8 was removed from the Self-Serve
      Subscription Agreement in May 2023, and the current Service-Specific Terms put
      no file-type restriction on the Developer Platform. The file is 7.5 MB, under
      the 25 MiB per-asset limit, so Workers can serve it directly. Re-encoding
      below is the item that actually matters; this one is now a judgement call.
- [ ] **S — Re-encode the hero video to about 1.5 MB.** *Do this before deciding
      about R2 above; at 1.5 MB the move is largely moot.* Cap at 720×1280, drop the
      muted audio track, 6 to 8 second loop, add a WebM source. Listed as optional
      in the full checklist. It is not optional when the audience is on Ukrainian
      mobile data arriving from an Instagram link.
- [ ] **M — Cloudflare image transformations via a custom `next/image` loader.**
      Point the loader at `/cdn-cgi/image/`. The free plan allows 5,000 unique
      transformations a month, where unique means one option-combination per source
      image per month. 93 images at four widths is roughly 370, so about 7% of the
      allowance. The catalogue currently ships 18 MB of WebP with no `srcset` at
      all, and the product carousels are the heaviest thing a visitor loads.
      *If time runs out, the minimum acceptable version is the hero `<picture>` fix
      in L5 alone, leaving `unoptimized: true` in place.*
- [ ] **S — Add `www.velels.com` as well as the apex.** Workers Custom Domains
      match the exact hostname, so `velels.com` does not catch `www.velels.com`. A
      redirect rule from `www` to the apex is better than two Custom Domains,
      because it keeps one canonical hostname.
      *Put the apex in `wrangler.jsonc` rather than clicking it in the dashboard, so
      it reapplies on every deploy:* `"routes": [{ "pattern": "velels.com",
      "custom_domain": true }]`. Note this is the `custom_domain` form, not the
      `route` + `zone_name` form in the docs' example — that one routes a script at
      a URL pattern, which is not what a whole-site static deploy wants. The `www`
      redirect rule stays a dashboard job either way.
- [ ] **S — Keep preview and `workers.dev` URLs out of the index.** The existing
      `NEXT_PUBLIC_ALLOW_INDEXING` gate already fails closed. Set it only on the
      production build.
      **Better than `noindex`: set `"workers_dev": false` in `wrangler.jsonc` once the
      custom domain resolves.** That removes the `velels.workers.dev` hostname
      altogether — no page to crawl beats a page asking not to be crawled, and it
      also removes a duplicate-content source whose canonicals point at the real
      domain. It has to stay enabled until then, because it is the only URL the
      first deploy can be smoke-tested on.
- [ ] *Optional, **S**:* replace the client-side `/` to `/uk` redirect with a Worker
      redirect on that one path. Only `/` would invoke Worker code, which is
      thousands of requests a month against a free ceiling of 100,000 a day.

Not needed in lite: Postgres, the Vercel project, next-intl middleware. A static
export has no middleware, and locale-prefixed routes work without it.

---

## L2 — The one path that has to work

In lite this is the whole conversion funnel. It gets more scrutiny than it does in
the full plan, not less.

- [ ] **M — Fix the Direct handoff for in-app browsers.** `InstagramCheckout`
      currently awaits `navigator.clipboard.writeText()` and then calls
      `window.open()` inside a `setTimeout(…, 300)`. Both the await and the timeout
      break the user-activation chain, which is what iOS Safari and the Instagram
      in-app browser require before allowing a new window. The likely outcome on
      the exact platform most visitors use is a copied message and no Instagram.
      Open the DM synchronously in the click handler, or make it a plain anchor so
      no popup heuristic applies, and treat the clipboard copy as the part that is
      allowed to fail.
      → `src/components/product/InstagramCheckout.tsx`
      **Verify on a real phone before believing it is fixed.**
- [ ] **S — Stop preselecting size `M`.** `useState<Size>("M")` means a customer who
      never chose a size sends a Direct message stating one. Harmless when a
      Consultant also sees a form; actively misleading when the message is the whole
      Order Request.
      → `src/components/product/ProductInfo.tsx`
- [ ] **S — Add a height line to the copied message.** The Consultant asks for height
      in every conversation. A blank `Мій зріст: ___ см` in the prefilled text costs
      nothing, collects nothing, and removes one round trip. This is not a form and
      must not grow into one.
      → `src/messages/{uk,en}.json` `productDetail.orderMessage`
- [ ] **S — Make the button the primary and only call to action.** In the full plan
      Direct is demoted to a quiet secondary under "Замовити". That instruction is
      inverted here, and should be re-inverted when the form lands.
- [ ] **S — Say what happens next.** The button hands the visitor to another app with
      no confirmation. Set the same expectation the form's success screen would have:
      answering hours, 7:00 to 22:00.

---

## L3 — Discovery and metadata

A catalogue that cannot be found or cannot be shared has no function. Depends on L1.

- [ ] **M — Self-referencing canonicals per locale, plus `x-default`.** **Three**
      defects, not two — verified against the built output 2026-08-28.
      1. Every English page declares the Ukrainian URL canonical, so the English
         site opts itself out of search. `out/en/product/dimaya.html` says
         `canonical: https://velels.com/product/dimaya`.
      2. The layout-level `alternates.canonical` is the bare origin, so both
         homepages point at `/` rather than at themselves.
      3. **The canonical target does not exist.** `absoluteUrl("/product/" + slug)`
         yields `https://velels.com/product/dimaya`, but the export emits only
         `/uk/product/dimaya` and `/en/product/dimaya`. There is no locale-less
         route — confirmed, `out/product/` is not a directory. So *every* product
         and info page currently declares a canonical pointing at a 404, which is
         worse than the English-only problem: it means both locales disown
         themselves, not just one. The identical bug in `offers.url` is noted below.
      There is also no `x-default`.
      → `src/app/[locale]/layout.tsx`, `src/app/[locale]/product/[slug]/page.tsx`,
      `src/app/[locale]/info/[slug]/page.tsx`
- [ ] **S — Replace the homepage OG image.** It points at
      `lh3.googleusercontent.com/aida-public/…`, a temporary host that will rot.

      Spec for the replacement:
      - **exactly 1200×630 px** — so the declared dimensions stop being a lie
      - **JPG or PNG, not WebP** — WebP support in preview crawlers is still patchy
      - **under 500 KB** — crawlers time out
      - drop it in `public/og/`, reference it as `/og/home.jpg`; `metadataBase`
        already resolves that to the absolute URL the OG spec requires
      - keep the wordmark clear of the edges: apps crop a few percent and render it
        around 500px wide

      Change the tag and the declared dimensions in the same commit as the file
      landing — the current URL still resolves, so wiring the code first would
      break previews sooner rather than later.
      → `src/app/[locale]/layout.tsx`
- [ ] **S — Stop declaring portrait product photos as 1200×630.**
      `generateMetadata` hardcodes `width: 1200, height: 630` on the first product
      image, but every product photo is 2:3 portrait — `dimaya/black_1.webp` is
      1167×1750, and the whole shoot is that shape. Crawlers re-crop from the real
      file, so the false numbers mostly cost a mis-laid-out first paint, but it is a
      lie in the markup and the fix is one line. Declare the actual dimensions, or
      drop the fields and let the crawler read them.
      → `src/app/[locale]/product/[slug]/page.tsx`
- [ ] *Conditional on L1, **M**:* **landscape 1200×630 share cards.** The real defect
      under the item above: a 2:3 photo in a `summary_large_image` card is
      centre-cropped by the platform, so what renders in Telegram is a horizontal
      slice from the middle of a 1750px-tall image — fabric, no face, no hemline, no
      wordmark. On a catalogue whose entire distribution is links pasted out of
      Instagram, the crop is the advert. `/cdn-cgi/image/width=1200,height=630,fit=cover`
      can generate them, but this is not free work: OG metadata does not pass through
      `next/image`, so the L1 loader gives nothing here and the URL is hand-written,
      and someone has to choose the crop for all 11 products — top-biased gives a
      face, centred gives the garment. Cannot be verified until the domain is behind
      Cloudflare. Judge the result in L8's share-preview pass.
- [ ] **S — Favicon, `apple-icon`, web manifest.** There is no tab icon at all.
      → `src/app/icon.png`, `src/app/apple-icon.png`
- [ ] **S — `sitemap.ts` and `robots.ts`.** Both locales, all 11 products, all nine
      info pages. Both emit static files under `output: "export"`.
- [ ] **S — Fix the Product JSON-LD.** Two problems. `availability` is
      `https://schema.org/InStock`, which claims stock the business does not have and
      contradicts the rule in `AGENTS.md`. Use `https://schema.org/MadeToOrder`. And
      `offers.url` omits the locale segment, so it points at a URL that does not
      exist.
      → `src/app/[locale]/product/[slug]/page.tsx`
- [ ] **S — Organization and WebSite JSON-LD** on the homepage, `BreadcrumbList` on
      product pages.
- [ ] **S — `?ref=ig` on the Instagram bio and story links.** Referrer data from
      Instagram is unreliable, and in lite the bio link is the main entrance.
- [ ] *Optional, **S**:* **a branded page for stray URLs.** With
      `not_found_handling = "404-page"` set in L1, an unmatched path serves
      `out/404.html`, which is Next's built-in "This page could not be found." in
      English on white — no navbar, no locale, none of the site. The designed 404
      (`StatusPage`, via `src/app/[locale]/not-found.tsx`) only renders for paths
      inside the `[locale]` segment, because there is no root `src/app/not-found.tsx`.
      Adding one would fix it. Whether eleven products draw enough stray traffic to
      be worth a page is a judgement call; the status code is correct either way.

---

## L4 — Product information

With no form and no Consultant in the loop until Direct opens, the page has to
answer on its own.

- [ ] **S — Fix the dress size chart.** Bust 82–84 then 86–88 leaves 85 in no size,
      and 88–90 repeats the gap. Make the ranges contiguous. Wrong sizing data is
      worse in lite, because the size she reads is the size she puts in the message.
      → `src/components/product/SizeGuideModal.tsx`
- [ ] **S — State the dress length.** 131 cm is fixed rather than height-scaled, so
      the same dress is floor-length on 157 cm and midi on 175 cm.
- [ ] **S — Replace the `isNew` boolean with a `releasedAt` date**, so the badge
      expires on its own instead of being a claim someone has to remember to remove.
      The hardcoded `slug === "lendai"` check is already gone; `products.ts` carries
      `isNew?: boolean` and `CatalogClient.tsx` reads it. Only the manual flag remains.
      → `src/lib/data/products.ts`, `src/components/catalog/CatalogClient.tsx`
- [ ] **S — Make the exchange promise loud**, on the product page rather than only in
      the footer. It is requested about once a month, costs almost nothing, and is
      the direct answer to "I cannot try it on". In lite it also has to work harder,
      because there is no form to capture a hesitant visitor.
- [ ] **M — Objection accordions on the PDP:** production time, exchange, payment
      terms. The copy already exists in `/info/*`. This is the highest-value item in
      the document that is not strictly blocking, and I would ship it if there is any
      slack at all.

- [ ] **M — Sale price. No longer conditional: a sale is running as of 2026-08-28.**
      `products.ts` carries a single `price` and there is no sale field anywhere, so
      the catalogue currently shows the pre-sale price with no indication a sale
      exists. `CONTEXT.md` already defines the term: a reduced price that belongs to
      the Model, applies to everyone, has an active period, and is shown beside the
      original struck through.

      Five parts, and the third is the one that costs money if skipped:

      1. **Data.** `salePrice?: number` on `Product`, plus the active period. Ask the
         owner which Models are on sale, at what price, and the end date (L0).
      2. **Display.** Struck-through original beside the sale price at all three
         call sites — `ProductInfo.tsx` (PDP), `CatalogClient.tsx`, and
         `ProductGrid.tsx` (homepage). Plus a sale badge, which needs a key in both
         locale files.
      3. **The Direct message must carry the sale price.** `orderMessage` is built
         from product data; if it sends the original while the page shows the sale
         price, she messages one number and the Consultant quotes another. Same
         defect class as the preselected size `M`, and the same reason it matters
         more in lite: the message *is* the Order Request.
      4. **JSON-LD.** `offers.price` is `product.price.toString()` today. On sale
         that publishes a stale price to Google.
      5. **No urgency theatre.** No countdown, no "only today". The out-of-scope
         table bans low-stock urgency and a timer is the same species. Show the
         reduction, do not pressure.

      **A static export cannot expire its own sale.** Under `output: "export"` the
      end date is evaluated at build time, so the sale ends when someone rebuilds,
      not when the date passes. Either accept that and rebuild deliberately, or add
      a Cloudflare Cron Trigger to rebuild daily. Do not evaluate it client-side —
      that trades a stale price for a hydration mismatch. Same shape as the
      `isNew` → `releasedAt` item above, and worth solving once for both.

---

## L5 — Accessibility and weight

- [ ] **S — `:focus-visible` styles.** There are zero occurrences in `globals.css`,
      on a site built entirely from custom buttons. Every interactive control on the
      site is currently invisible to a keyboard user.
- [ ] **M — Keyboard-accessible catalogue dropdown.** `Navbar` opens it on
      `onMouseEnter` / `onMouseLeave` only, so three category links are unreachable
      without a mouse on a site whose only job is browsing categories. Use a Radix
      primitive rather than adding focus handlers to the hover panel. The mobile
      drawer is already fine.
      → `src/components/layout/Navbar.tsx`
- [ ] **S — One `<picture>` for the hero instead of two `<Image>` elements.** The
      `hidden md:block` / `block md:hidden` pair downloads both images on every
      device and emits two competing `<link rel="preload">` tags for two
      viewport-dependent LCP candidates. Art direction with `media`-scoped `<source>`
      elements removes the double download and the double preload together.
      → `src/components/home/HeroSection.tsx`
- [ ] **S — Throttled mobile Lighthouse pass.** Record the numbers so later
      regressions are visible against something.

---

## L6 — Legal and copy

- [ ] **S — Trader identity, in `info/terms`, not `info/contact`.** Article 7 of the
      Law on Electronic Commerce (675-VIII) requires direct, simple, stable access to
      the ФОП's ПІБ, registration address, РНОКПП, email and site address. It does
      not require prominence, and no Ukrainian shop puts it on the contacts page.
      Checked: Anabel Arto keeps it in the last section of `/terms-of-use` under
      "АДРЕСА ТА РЕКВІЗИТИ ПРОДАВЦЯ"; `bobrand.fashion` and `book24.ua` use the same
      placement in their оферта. `info/terms` is already the offer document here in
      everything but name, so a final section is the whole change.

      The direct competitor does exactly this. ROÁR (`roar-cruise.com.ua`) publishes
      full details on `/policies/terms-of-service`, a page that declares itself a
      публічна оферта in its opening line. They are not in a "Реквізити" block at the
      bottom but in **clause 1.1, inside the definition of `Продавець`**: full name,
      ЄДР record number and date, tax number, and address. Nothing on their contact
      page or homepage. Note that the page never uses the strings `ФОП` or `РНОКПП`,
      so searching for either finds nothing; it spells both out as "фізична
      особа-підприємець" and "реєстраційний номер облікової картки платника податків".

      **Copy their wording for the address: "місце здійснення діяльності", not "місце
      реєстрації".** Place of business rather than registered address is what lets
      them publish an office (`оф. 4`) instead of an apartment. That is a phrasing
      choice, not a registration change, and it likely resolves the address question
      below without involving an accountant.

      Putting the identity in the seller's definition rather than a trailing block is
      also the better pattern. A contract has to name its parties anyway, so it reads
      as part of the document. Anabel Arto and `bobrand.fashion` use the bottom-block
      style; both satisfy the law.

      The tier is not unanimous. SWIM BY DI (`swimbydi.com`) publishes no legal
      identity and has no terms, оферта or privacy policy linked at all, on a site
      selling worldwide. WIM (`wimbrand.com.ua`) and O(FOURFOUR) (`ofourfour.com`)
      also publish nothing. Enforcement here is complaint-driven, so the real risk of
      following them is low. Follow ROÁR regardless: the brands that skip it also
      have stale or incomplete footers, which reads as neglect rather than a decision.

      **Still ask the owner which address to use.** Framing it as місце здійснення
      діяльності means it can be the atelier or a studio rather than her home, but she
      has to name one, and if the only real answer is her apartment she should get to
      decide rather than have it published on her behalf.
      → `src/messages/{uk,en}.json` `info.terms`
- [ ] **M — Rewrite the privacy policy to match reality.** It currently states the
      site collects name, phone, email, delivery address and order history, shares
      data with delivery services and payment processors, and uses cookies. In lite
      the site collects none of that and has no cookies. A policy describing
      collection that does not happen is wrong in a way that is easy to fix now and
      awkward to explain later. Rewrite it around what is actually true, and add
      analytics if L7 ships it.
      → `src/messages/{uk,en}.json` `info.privacy`
- [ ] **S — Read `info/payment` and `info/terms` against the lite site.** Both
      already say orders are placed in Direct, which is why lite is coherent at all.
      Confirm nothing elsewhere promises a site checkout.
- [ ] **S — International wording.** State plainly that international orders are
      quoted individually, with full prepayment and shipping paid in advance.
- [ ] *Optional, **S**:* approximate currency on the `en` locale. A visitor in London
      sees `3 750 ₴` with no conversion.

---

## L7 — Measurement

Small, and the only reason it is here is that the first two weeks are the only clean
signal you will ever get about a cold catalogue.

- [ ] **S — Cloudflare Web Analytics.** Free, cookieless, no consent banner, already
      on the platform, one snippet. Gives page views and referrers.
- [ ] Custom events are deferred. The one that matters, `ig_dm_click`, needs a tool
      Cloudflare Web Analytics does not provide. Revisit with the form.

---

## L8 — Pre-launch verification

Do all of it before flipping indexing on.

- [ ] **M — The Direct handoff on a real phone**, inside the Instagram in-app
      browser, on mobile data, both iOS and Android if possible. This is the single
      highest-risk item in lite and the one most likely to be silently broken.
- [ ] **S — Both locales, every route:** home, catalog, filtered catalog, all 11
      products, all nine info pages, 404, error page.
- [ ] **S — Share previews for real.** Post a product link into Telegram and
      Instagram and look at what renders. Run the homepage through Facebook's sharing
      debugger.
- [ ] **S — Keyboard-only pass** of the whole site, with attention to the catalogue
      dropdown.
- [ ] **S — Confirm the locale files are still key-identical.** 150 leaf keys across
      12 namespaces, verified 2026-08-28 (the "231" in earlier drafts was wrong). Several items above touch `uk.json` and `en.json`, and a key added
      to one and not the other breaks the build.
- [ ] **S — Flip indexing on**, submit the sitemap in Search Console, verify the
      property.

---

## Deferred, not cancelled

These stay in [`release-checklist.md`](./release-checklist.md) and are the reason it
still exists. Nothing here is abandoned.

| Deferred | Comes back when |
| --- | --- |
| Order form, `POST /api/order-request` | Direct volume makes the manual path hurt. Fits in a free Cloudflare Worker plus D1 when it does |
| Postgres or D1, order request rows | With the form |
| Telegram bot and channel | With the form |
| Payload CMS | The owner needs to edit products without a developer. Needs Workers Paid at $5/month, since Payload exceeds the free plan's 3 MiB bundle limit |
| Height in the product model, height input, ростовка rule | With the form. The blank height line in L2 is a placeholder, not a step toward this |
| Custom analytics events, email signup, promo codes | After the first weeks of real traffic |
| Stale request reminders, workload counter, request statuses | These describe managing Order Requests. There are none yet |
| Model height and size worn on every image | Needs a photo session decision |

## Still not doing

Everything in the "Explicitly not doing" table of the full checklist applies
unchanged. Lite removes a channel; it does not reopen any of those decisions. In
particular there is still no stock, no cart, no branch picker, and no measurement
collection.
