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

- [ ] **S — Owner: is another sale coming, and the missing product facts.** The
      2026-08-28 sale has ended and the mechanism is built and idle (L4), so this is
      no longer blocking — but three product facts still are:
      - which Models go on sale next, at what price
      - the **height ranges per size**, for the size-guide column the direct
        competitor has and this site does not
      - **fabric composition** per product, e.g. "nylon 80%, spandex 20%"

      Plus the ФОП details and the size-chart gaps above. Five things, one message —
      each round trip costs days, and this is the longest pole in the plan.
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

- [x] **S — Register the domain** at Cloudflare Registrar. `.com` at wholesale,
      about $10.44/year, same price on renewal. Requires Cloudflare nameservers,
      which is what the rest of this phase assumes anyway.
- [x] **S — Create a Cloudflare Worker with static assets**, connected to the repo.
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
      -> Done 2026-08-29. `wrangler.jsonc` written and validated, deployed to
      `velels.datngn11.workers.dev` (588 files). Verified at the edge: every route
      200, stray URLs a real 404, trailing slash 307, video and RSC payloads serve.
      Custom domain and `workers_dev: false` still to do.
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

      **If a second Worker is ever added here, its environment needs
      `"routes": []`.** `routes` is inheritable, so a named environment without that
      line inherits this custom domain and its deploy reassigns `velels.com` away
      from production. Wrangler warns — *"Deploying this environment will reassign
      these custom domains away from the top-level Worker"* — in output nobody reads
      twice. Confirmed with a dry-run on 2026-09-09.
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

- [x] **M — Fix the Direct handoff for in-app browsers.** `InstagramCheckout`
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
      -> Done 2026-08-29. Rewritten as a plain anchor, so no popup heuristic applies and
      it works before hydration — confirmed in the prerendered HTML, and
      `window.open` no longer appears in any chunk. The clipboard write is
      fire-and-forget. **Still unverified on a real phone.**
- [x] **S — Stop preselecting size `M`.** `useState<Size>("M")` means a customer who
      never chose a size sends a Direct message stating one. Harmless when a
      Consultant also sees a form; actively misleading when the message is the whole
      Order Request.
      → `src/components/product/ProductInfo.tsx`
- [x] **S — Add a height line to the copied message.** The Consultant asks for height
      in every conversation. A blank `Мій зріст: ___ см` in the prefilled text costs
      nothing, collects nothing, and removes one round trip. This is not a form and
      must not grow into one.
      → `src/messages/{uk,en}.json` `productDetail.orderMessage`
- [x] **S — Make the button the primary and only call to action.** In the full plan
      Direct is demoted to a quiet secondary under "Замовити". That instruction is
      inverted here, and should be re-inverted when the form lands.
- [x] **S — Say what happens next.** The button hands the visitor to another app with
      no confirmation. Set the same expectation the form's success screen would have:
      answering hours, 7:00 to 22:00.

---

## L3 — Discovery and metadata

A catalogue that cannot be found or cannot be shared has no function. Depends on L1.

- [x] **M — Self-referencing canonicals per locale, plus `x-default`.** **Three**
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
      -> Done 2026-08-29. Two helpers in `config.ts`, `localeUrl()` and
      `localeAlternates()`, now make the locale segment hard to omit. Canonicals
      self-reference per locale, `x-default` points at Ukrainian, and `og:url` and
      `offers.url` carry the locale. Verified in the built HTML for both locales.
      → `src/app/[locale]/layout.tsx`, `src/app/[locale]/product/[slug]/page.tsx`,
      `src/app/[locale]/info/[slug]/page.tsx`
- [x] **S — Replace the homepage OG image.** The Google `aida-public` host is gone.
      The owner's file is at `public/og/home.jpg`, referenced through
      `siteConfig.ogImage`, and the declared dimensions come from
      `siteConfig.ogImageWidth`/`Height` so they cannot drift from the file again.
- [ ] **S — Owner: re-export that OG image.** It works, and it is not right. Two
      things, both needing the source file rather than a crop of the JPEG:

      - **1200×630, not 1431×858.** The file is 5:3 where the share card is 1.91:1,
        so previews centre-crop about 6% off the top and bottom. The wordmark sits
        centred and survives; the model's feet get clipped. Cosmetic, not broken.
      - **sRGB, not Display P3.** The export carries a P3 profile, and preview
        crawlers and in-app browsers routinely ignore embedded profiles — the same
        image then renders oversaturated, with the sky shifted. This one is worth
        more than the crop.

      Under 500 KB and JPG both already hold: 220 KB, JPEG, not WebP.
- [x] **S — Stop declaring portrait product photos as 1200×630.**
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
- [ ] **S — Favicon and `apple-icon`. Blocked: needs a brand mark from the owner.**
      There is no tab icon at all. `logo_black.png` is a 1326x499 wordmark and is
      illegible at 32px, so a favicon needs a square mark — a monogram or a symbol —
      and that is the owner's decision, not something to crop out of the wordmark.

      Spec, so the file is right first time:
      - `src/app/icon.png` at 256x256, PNG. Transparency is fine.
      - `src/app/apple-icon.png` at 180x180, PNG, **opaque** — iOS fills
        transparency with black.
      - `src/app/` rather than `public/`: Next's file metadata convention emits the
        `<link rel="icon">` tags automatically, with a content hash.
      - then add both to the `icons` array in `src/app/manifest.ts`.

      Ask alongside the L0 questions. Note the wordmark still reads SWIMWEAR, the
      same problem that ruled out `velelswim.com`.
- [x] **S — Web manifest.**
      -> Done 2026-08-29. `manifest.ts` at `display: "minimal-ui"` rather than
      `standalone`: this is a catalogue whose main call to action hands the visitor
      to Instagram, and stripping browser chrome from a site that deliberately sends
      people elsewhere makes leaving harder. Icons array is empty pending the item
      above.
- [x] **S — `sitemap.ts` and `robots.ts`.** Both locales, all 11 products, all nine
      info pages. Both emit static files under `output: "export"`.

      **Cloudflare already serves a `robots.txt` we did not write.** Found on the
      first deploy 2026-08-28: `/robots.txt` returns 200 with Cloudflare's managed
      "Content Signals Policy" (the `search` / `ai-input` / `ai-train` preamble),
      while `/sitemap.xml` correctly 404s. So when `robots.ts` lands, confirm our
      file actually wins at the edge rather than assuming it does — and decide
      whether to keep the content-signals block, which is a reasonable thing to want
      on a catalogue of original photography. It is managed in the zone settings,
      not in the repo.
      -> Done 2026-08-29. Both shipped, 44 sitemap URLs with hreflang alternates, both
      failing closed on the indexing gate — verified in both states. Both need
      `export const dynamic = "force-static"` or the export build fails outright.
      **Not yet confirmed at the edge that ours beats Cloudflare's managed file.**
- [x] **S — Fix the Product JSON-LD.** Two problems. `availability` is
      `https://schema.org/InStock`, which claims stock the business does not have and
      contradicts the rule in `AGENTS.md`. Use `https://schema.org/MadeToOrder`. And
      `offers.url` omits the locale segment, so it points at a URL that does not
      exist.
      → `src/app/[locale]/product/[slug]/page.tsx`
- [x] **S — Organization and WebSite JSON-LD** on the homepage, `BreadcrumbList` on
      product pages.
      -> Done 2026-08-29. In `src/lib/seo/jsonLd.ts`. Organization and WebSite are emitted
      once on the homepage rather than site-wide. No `SearchAction`: there is no
      site search, and advertising one would claim something the site cannot honour.
- [ ] **S — `<html>` carries no `lang` attribute.** Confirmed in the build: both
      `out/uk.html` and `out/en.html` open `<html class="..." data-scroll-behavior>`
      with no language declared. This undercuts the rest of L3 — the site tells
      crawlers which page is which language via canonicals and `hreflang`, while the
      document itself declares none — and a screen reader gets no signal to switch
      to a Ukrainian voice for Cyrillic copy.

      Not a quick fix: the root `layout.tsx` owns the `<html>` element and sits
      outside `[locale]`, so it cannot know the locale. Needs `<html>` moved into
      `[locale]/layout.tsx`, with `/` and the 404 given their own. Do it
      deliberately rather than squeezing it into another change.
- [ ] **S — The deployed 404 is always Ukrainian.** A static export emits one
      `out/404.html` and no per-locale variant, so Cloudflare's
      `not_found_handling` serves the Ukrainian page for `/en/mistyped` too. An
      English visitor arriving from a bad Instagram link gets a page she cannot
      read. Worse, the `LocaleSwitcher` in the navbar on that page calls
      `router.replace(pathname, { locale: "en" })`, which sends her to
      `/en/<the stray path>` — a second 404.

      `src/app/[locale]/not-found.tsx` only ever renders for a not-found triggered
      during client-side navigation, never on a direct hit. Fixing this means
      reading the locale from the path at runtime in the root 404.
      → `src/app/not-found.tsx`, `src/components/layout/LocaleSwitcher.tsx`
- [x] **S — A visible breadcrumb on the PDP, or drop the `BreadcrumbList`.** The
      markup shipped 2026-08-29 with nothing on the page corresponding to it.
      Google's guidance is that structured data should represent visible content, so
      an invisible trail is at best ignored. A breadcrumb is also genuinely useful on
      a PDP reached cold from an Instagram link, where the visitor has no idea what
      else the catalogue holds — which argues for adding the trail rather than
      deleting the markup.
      -> Done 2026-09-08. One `crumbs` array feeds both the visible trail and
      `breadcrumbJsonLd()`, so they cannot drift. `nav` landmark with an accessible
      name, ordered list, separators `aria-hidden`, last crumb unlinked with
      `aria-current="page"`.

      Found while building it: **`max-w-container` generated no CSS at all.** The
      token was `--spacing-container-max`, so Tailwind emitted `max-w-container-max`
      — a utility nothing used — while `Navbar`, `Footer`, `CatalogClient` and the
      new breadcrumb all wrote `max-w-container`, which silently did nothing. On a
      1920px viewport the breadcrumb sat 240px left of the product. Renamed the token
      to `--spacing-container`, which repairs all four, and folded four hardcoded
      `max-w-[1440px]` values into it. **Tailwind emits nothing for an unknown
      utility rather than erroring, so this class of bug is invisible until someone
      measures.**
- [ ] **S — Distinguish the Instagram entry points with `?ref=`.** Referrer data
      from Instagram is unreliable and the bio link is the main entrance, so the entry
      point has to be marked in the URL: `?ref=bio` on the bio link, `?ref=story` on
      story stickers. No code — the parameter is unused by the site and only has to
      survive into the analytics.

      This depends on the tool logging query strings. Umami does by default, which is
      one of the two reasons L7 chose it; Cloudflare Web Analytics does not, and with
      that tool this item would have to become "use a different path per entry point"
      instead. Do not set `data-exclude-search` on the tracker.
- [x] *Optional, **S**:* **a branded page for stray URLs.** With
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
- [x] **S — Replace the `isNew` boolean with a `releasedAt` date**, so the badge
      expires on its own instead of being a claim someone has to remember to remove.
      Five of eleven products carry `isNew: true` today and nothing will ever clear
      them.
      → `src/lib/data/products.ts`

      **Partly addressed 2026-09-08.** The badge itself is fixed: it now has one
      definition in `ProductCard`, is translated (it rendered the English word "New"
      on the Ukrainian site), and uses `text-label-xs` rather than bracket values.
      What remains is only the data question — the flag is still manual.

      Note the same caveat the sale price ran into: a static export cannot expire
      anything by itself, so a `releasedAt` window only takes effect on the next
      build. That is weaker than it sounds here, though — unlike a sale, nobody is
      watching for the badge to lapse, so a date that self-clears on the next
      deploy is still better than a boolean nobody will ever revisit.
      -> Done 2026-09-08. `releasedAt` replaces the boolean; `isNewRelease()` in
      `src/lib/utils/newness.ts` derives the badge from a 60-day window. The dates
      are not invented — git records all five flagged products entering
      `products.ts` on 2026-08-12, so they expire on 2026-10-11 with no action.

      Needed the build date pinned and inlined, because `ProductCard` renders inside
      a client component on the catalogue and a live `new Date()` would disagree with
      the prerendered HTML across a day boundary. Three lines, unlike the version
      removed from the sale price: a 60-day window does not care about timezones, so
      no `Intl` or calendar handling. The distinction is that a sale needs a human to
      set the price correctly anyway, whereas nobody watches a badge — self-expiry is
      the whole feature here.

      Window boundaries unit-tested: day 27 and day 59 true, day 60 false, future
      date false, missing `releasedAt` or missing build env false.
- [x] **S — Make the exchange promise loud**, on the product page rather than only in
      the footer. It is requested about once a month, costs almost nothing, and is
      the direct answer to "I cannot try it on". In lite it also has to work harder,
      because there is no form to capture a hesitant visitor.
      -> Done 2026-08-31, as one of the visible lines under the call to action rather
      than a section of its own.
- [x] **M — Objection accordions on the PDP:** production time, exchange, payment
      terms. The copy already exists in `/info/*`. This is the highest-value item in
      the document that is not strictly blocking, and I would ship it if there is any
      slack at all.
      -> Done 2026-08-31, **not as three accordions.** Five collapsed rows would have
      meant nothing was emphasised, and the two answers most likely to close a sale
      would have been the two nobody taps. Split by length instead:

      *Visible under the CTA,* three quiet lines in `text-body-sm text-secondary` —
      production time, the one-time size exchange, and the Direct answering hours.
      These are the doubts a visitor has while deciding, so they are not behind a tap.

      *Collapsed,* three rows: the existing Деталі and Догляд, plus one new
      "Оплата і доставка". Payment and delivery are one question to a customer — how
      does this reach me and what do I pay when — so they are one row, not two, and
      the conditional COD detail is reference material read after deciding.

      `ProductAccordion` was extracted rather than copying the chevron markup a third
      time; it stays `<details>`/`<summary>`, which is keyboard operable with no
      JavaScript. Note its `summary` still has no `:focus-visible` style — that is
      L5, not a gap introduced here.
      → `src/components/product/ProductInfo.tsx`,
      `src/components/product/ProductAccordion.tsx`

- [x] **M — Sale price mechanism.** *A sale was running as of 2026-08-28 and has since ended, so no product carries sale data. The mechanism is built and idle.*
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
      -> Done 2026-08-31. `salePrice` and `saleEndsAt` on `Product`; one resolver,
      `priceView()` in `src/lib/utils/price.ts`, so the page, the cards and the
      structured data cannot disagree; a shared `<Price>` component using `<del>`
      and `<ins>` with visually hidden labels, because strikethrough carries no
      meaning to a screen reader. JSON-LD publishes the sale price and
      `priceValidUntil`. Turning a sale on is two lines in `products.ts`.
      Verified with temporary data before reverting it: an active sale renders both
      prices and the reduced JSON-LD price; a lapsed `saleEndsAt` renders the regular
      price only, with no sale markup and no `priceValidUntil`.
      **Correction to part 3 above:** the Direct message carries no price at all —
      it is product, colour, size and height. Whether it *should* name the price so
      a Consultant replying after a sale ends knows which number she saw is a real
      question, and still open.

- [x] **L — The catalogue page renders no product content.** Found 2026-08-31 while
      testing the sale display on cards. `out/uk/catalog.html` contains no product
      names, no prices and not one `₴` — `<main>` is empty. `CatalogClient` calls
      `useSearchParams()` for the category filter, which cannot be prerendered under
      `output: "export"`, so the entire grid is client-only.

      This is worse than it sounds. The collection page is the main category landing
      page, the one the sitemap and every Navbar link point at, and it is blank to a
      crawler — which undoes much of L3, since the canonicals now point search
      engines at an empty page. On Ukrainian mobile data nothing appears until the
      JavaScript has downloaded and hydrated.

      Two ways out: server-render the full grid and filter on the client, or move
      category from a query parameter to a route segment (`/catalog/[category]`),
      which prerenders per category but changes the URLs the Navbar uses. The first
      is smaller; the second is better for search.
      → `src/components/catalog/CatalogClient.tsx`
      -> Done 2026-09-08, the first way. `CatalogGrid` was split out so it knows
      nothing about the URL, and the Suspense fallback is now that grid unfiltered
      rather than a placeholder. Prerender emits all eleven products; hydration
      swaps in the same grid narrowed by the query parameter. URLs unchanged, so the
      `?category=` links in the Navbar still work, and a visitor without JavaScript
      sees the whole collection. Verified: `<main>` went from the three characters
      "..." to 11 names, 11 prices and 11 links in both locales.

---

## L5 — Accessibility and weight

- [x] **S — `:focus-visible` styles.** There are zero occurrences in `globals.css`,
      on a site built entirely from custom buttons. Every interactive control on the
      site is currently invisible to a keyboard user.
      -> Done 2026-09-08. One rule covering all 40 controls. Two-tone: the offset
      puts a black ring 2px out and a 6px shadow spread puts white on both sides, so
      it reads on the black CTA, on pale surfaces and over photography. The spread
      must exceed offset plus width or the outline hides the halo.
- [x] **M — Keyboard-accessible catalogue dropdown.** `Navbar` opens it on
      `onMouseEnter` / `onMouseLeave` only, so three category links are unreachable
      without a mouse on a site whose only job is browsing categories. Use a Radix
      primitive rather than adding focus handlers to the hover panel. The mobile
      drawer is already fine.
      → `src/components/layout/Navbar.tsx`
      -> Done 2026-09-08 with `@radix-ui/react-navigation-menu`. **The worse half was
      undocumented:** the closed panel was hidden with `opacity` and
      `pointer-events`, neither of which removes an element from the tab order, so a
      keyboard user tabbed into three invisible links. Radix unmounts it instead.
      `asChild` keeps the trigger an anchor so "Каталог" still navigates; `Root` is
      controlled so the panel can open from the link's `onFocus`, since Radix opens
      on hover and click only and a click on an anchor navigates.
      Keyboard navigation confirmed working in a browser 2026-09-08.
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
      awkward to explain later. Rewrite it around what is actually true.

      **Include the analytics from L7.** "We collect nothing" stops being true the
      moment the snippet ships. Describe the processing; do not characterise it.

      What to state, because it is checkable: the tool is Umami Cloud, operated by a
      third party outside Ukraine; each page view sends the path and its query string,
      the referrer, the page title, screen size and language, and the request itself
      yields country, device type, browser and OS; a visitor identifier is derived
      server-side rather than assigned in the browser. Umami's documentation says the
      IP address is used to derive that identifier and is not stored — attribute that
      to them rather than asserting it, since it cannot be verified from outside.
      Verified here in the tracker source on 2026-09-09, and safe to state plainly:
      it sets **no cookies**, and writes nothing to `localStorage` or
      `sessionStorage` — the only storage access is a read of one opt-out key.

      **Do not write, in either locale:**
      - *"this is not personal data."* A visitor identifier derived from IP address
        and user agent is at least pseudonymous, and whether it counts as personal
        data is a contested legal question rather than a fact about the code.
      - *"no consent is needed"* or *"no cookie banner is required."* Also a legal
        conclusion, and not a safe one to reach unaided: ePrivacy Article 5(3) covers
        *accessing* information on a visitor's device as well as storing it, and the
        tracker does read that one key. The site also sells to the EU, so Ukrainian
        law is not the only law in play.
      - anything that cannot be pointed at in the tracker source or Umami's own docs.

      Note too that there is **no user-facing opt-out** — disabling the tracker means
      setting a `localStorage` key by hand — which is itself relevant to whichever
      legal basis the owner's adviser settles on.

      **This needs the same treatment as the ФОП address above: a qualified opinion,
      not a developer's reading.** Ship the factual description; leave the legal
      characterisation to review.
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

**Umami Cloud, not Cloudflare Web Analytics.** Both are free and both are one
snippet, but Cloudflare's cannot answer either question this launch actually has. Its
FAQ: *"Currently, Cloudflare Web Analytics do not log query strings to avoid
collecting potentially sensitive data"*, and on custom events, *"Not yet, but we may
add support for this in the future."* No query strings kills the `?ref=` marker in
L3; no events means nothing can see the Direct button being tapped, which is the
only conversion this site has. Umami's free tier does both. Everything below was
verified against the docs and the tracker source on 2026-09-09.

- [ ] **S — Sign up for Umami Cloud and add `velels.com`.** The Hobby plan is free
      indefinitely: 100 000 events a month, 3 websites, **6 months of retention**.
      One page view is one event, so 100 000 is not a ceiling worth thinking about
      here. Retention is the real limit — month-to-month comparison works, this July
      against next July does not. It does not bite in lite: demand is flat
      year-round, which is why seasonal variants are out of scope at all.

      The dashboard issues a website id. It goes in `NEXT_PUBLIC_UMAMI_WEBSITE_ID`
      as a **build** variable — `.env` locally, and Cloudflare's *Build* settings for
      the deploy — plus a commented line in `.env.example`. Never in the source.

      **Not the Worker's runtime variables or secrets.** Those are a different box in
      the same dashboard, and nothing here would ever read them: `wrangler.jsonc` has
      no `main`, so there is no Worker script at request time. `NEXT_PUBLIC_*` is
      inlined into the HTML by `next build` and nowhere else, so an id set in the
      runtime box is an id that does not exist — `process.env` is `undefined` during
      the build and the snippet is simply left out of every page. It fails silently,
      with no error and no analytics. `NEXT_PUBLIC_SITE_URL` is set the same way, for
      the same reason (`docs/cloudflare-setup.md` Step 4).
- [x] **S — Add the snippet to `src/app/layout.tsx`**, the root layout, not
      `[locale]/layout.tsx`. The root is the only place that also covers `/` and the
      404 page. **Done — it renders only once the id exists, so nothing happens until
      the item above is.**

      ```tsx
      <script
        async
        src="https://cloud.umami.is/script.js"
        data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
        data-performance="true"
      />
      ```

      Render nothing when the id is absent, so local and preview builds send no data.
      `data-performance="true"` collects Core Web Vitals from real visitors — field
      data from Ukrainian mobile connections, better evidence than the synthetic
      Lighthouse run in L5. Leave `data-exclude-search` unset; L3 needs the query
      string.

      **`async`, not `defer`.** React's script docs allow rendering a `<script>`
      anywhere in the tree only when it is async — *"The `async` prop must be true to
      allow scripts to be safely moved"* — and say of `defer`: *"Not compatible with
      streaming server-rendered components. Use the `async` prop instead."* Static
      export does not stream, so `defer` would work today; it would stop being safe
      the moment this moves to the Vercel destination in `AGENTS.md`. With `async`,
      React hoists the tag into `<head>` and de-duplicates it by `src`.

      **A plain tag, deliberately, not `next/script`.** Next's own guide names
      analytics a good candidate for `afterInteractive`, so this is a deviation with
      a reason, not a correction: `afterInteractive` is *"injected into the HTML
      client-side and will load after some (or all) hydration occurs"*, so a visitor
      who leaves before hydration is never counted. Nothing here needs what
      `next/script` provides — no `onLoad`, no Partytown, no consent gate. Revisit if
      a consent banner ever has to gate the load.

      **All three variants were built and diffed on 2026-09-09**, because the
      difference is not visible in the source:

      | | in `out/*.html` | executes |
      | --- | --- | --- |
      | `<script async>` | real tag, 47/47, in `<head>` | before hydration |
      | `<script defer>` | real tag, 47/47, in `<body>` | before hydration |
      | `next/script` | **preload link only**, no tag | after hydration |

      The third row is the one worth knowing: `next/script` does *not* leave the HTML
      empty. It emits `<link rel="preload" href="…umami.is/script.js" as="script">`
      plus the URL inside the RSC payload, so the file still downloads early and only
      execution waits. It is also why the L8 check has to match a real `<script`
      element rather than the bare URL.

      One cosmetic consequence of the hoist: React places the tag ahead of `<title>`
      in `<head>`, so an async execution that wins a race against the parser would
      report an empty page title. It loses that race to a network round trip in
      practice; if titles ever look blank in the dashboard, this is why, and the path
      dimension is unaffected.
- [x] **S — Three events, four attributes, two files.** Done.

      On the anchor in `src/components/product/InstagramCheckout.tsx`:

      ```tsx
      data-umami-event="ig_dm_click"
      data-umami-event-product={productSlug}
      data-umami-event-size={selectedSize ?? "none"}
      ```

      And on the size-guide button in `ProductInfo.tsx`:

      ```tsx
      data-umami-event="size_guide_open"
      data-umami-event-product={slug}
      ```

      **Why `size` and not `color`.** The Direct message already carries product,
      colour and size, so the owner has them for anyone who pastes it. `size` is here
      for one reason only: `selectedSize` starts `null` by design (L2), and this
      counts how often the button is tapped with no size chosen — a test of that
      decision that nothing else can make. Colour is deliberately **not** tracked:
      `selectedColor` defaults to `"black"` in the component, so an untouched swatch
      is indistinguishable from a deliberate choice and the figure would
      systematically over-report black. If colourway preference ever matters, default
      that selector to `null` first, then measure.

      **Why `size_guide_open` earns its place.** Two L0 items are blocked on the owner
      — the height ranges per size, and the chart gaps at 85, 89 and 93 cm — with no
      way to know whether they are urgent. This gives one: guide opens as a share of
      product page views, and, paired with `ig_dm_click`, opens that led nowhere. That
      is as close as this site gets to watching sizing kill a sale.

      **Stop at three.** Accordion opens and filter taps would not change a decision.
      An event that changes nothing is a maintenance cost.

      **This does not break the L2 handoff**, which is the thing to check before
      touching that anchor. Umami's click handler calls `preventDefault()` only when
      the link would navigate in the same tab; for `target="_blank"` it lets the
      native navigation run and fires the event beside it with `keepalive: true`. It
      never calls `stopPropagation()`, so the clipboard write in `onClick` still
      happens inside the user gesture. **Re-check this if the tracker is ever
      upgraded** — an unconditional `preventDefault()` there would break the handoff
      on iOS, silently.

      Event properties are stored as strings, so both pass a slug rather than an
      index. Umami's pricing page puts properties on every plan including Hobby; if
      that turns out to be wrong in the dashboard, fold the value into the name
      (`ig_dm_click_no_size`) — nothing here needs a property to be useful.
- [ ] **S — Count the DMs by hand, weekly.** Umami sees the button being tapped. It
      cannot see a message being sent — the visitor still has to type something in
      Instagram, and some will not. The funnel is:

          product page views → `ig_dm_click` → DMs received

      Umami gives the first two. The third only the owner can supply, and the ratio
      between them is what says whether the pre-filled message is doing its job. At
      roughly ten orders a month a human can count them; that stops being true when
      volume grows or a second channel exists to compare against.
- [ ] Nothing to do, worth knowing: `cloud.umami.is` is on the common blocklists, so
      some visitors are never counted and every number is a floor rather than a
      truth. It matters less here than it would elsewhere — most traffic arrives
      inside the Instagram in-app browser, where content blockers are rare.

**What this gets you, in the end:** page views and visits by path, so which products
are looked at and which are ignored; referrer, country, device and browser; Core Web
Vitals from the field; `ig_dm_click` per product, so which garment actually moves
someone to write; how often that happens with no size chosen; and how many reach for
the size guide. Plus one number a week from the owner. That is enough to decide
what to photograph next, and it is the whole point of the phase.

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
- [ ] **S — Confirm the locale files are still key-identical.** 191 keys including
      intermediate objects, 159 of them leaves, across 12 namespaces — verified
      2026-09-08. The number has grown with every copy addition, so re-count rather
      than trusting this line. Several items above touch `uk.json` and `en.json`, and a key added
      to one and not the other breaks the build.
- [ ] **S — Confirm the analytics snippet is actually in the build**, not just a
      page view in the dashboard — the dashboard cannot tell "variable in the wrong
      box" apart from "no visitors yet".

          grep -rlE '<script[^>]+cloud\.umami\.is' out --include='*.html' | wc -l

      Every HTML file must match, 47 of them at the time of writing. Two details in
      that command are deliberate. It matches a real `<script` **element**, because a
      bare URL search also matches a preload link and would pass on a build where
      nothing executes. And it recurses over the directory rather than naming a file:
      the export writes `out/uk.html`, **not** `out/uk/index.html` (there is no
      `trailingSlash`), and `grep -c` on a path that does not exist returns `0`, which
      reads exactly like a real failure.
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
| Email signup, promo codes | After the first weeks of real traffic |
| Stale request reminders, workload counter, request statuses | These describe managing Order Requests. There are none yet |
| Model height and size worn on every image | Needs a photo session decision |
| A second Worker for owner review links | When `workers_dev: false` removes the review URL there is nowhere to send the owner. A named environment plus its own deploy script; give it `"routes": []` or its deploy takes the live domain |

## Still not doing

Everything in the "Explicitly not doing" table of the full checklist applies
unchanged. Lite removes a channel; it does not reopen any of those decisions. In
particular there is still no stock, no cart, no branch picker, and no measurement
collection.
