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

- [x] **S — Owner: ФОП details, and which address may be published.** ПІБ,
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

      **Shipped, box corrected 2026-09-16.** `info.terms` names ФОП Фам Тхі Нга,
      РНОКПП 3595505528 and the email, and the privacy policy names the same as
      data controller. No address is published, which is option three above. This
      item sat unticked long after it landed and was reported as blocking; verify
      against `src/messages/uk.json`, not against this box.
- [x] **S — Confirm the domain name.** Decided 2026-08-27: `velels.com`. The
      brand mark is VELÉLS and the catalogue already carries dresses, so `swim` in
      the permanent address names a category the brand has outgrown.
      `velelswim.com` was the alternative, matching the Instagram handle, the DM
      link and the `velelswim@gmail.com` address; it is not being bought, so it
      stays available to anyone. Still to register, see L1. The site URL comes from
      `NEXT_PUBLIC_SITE_URL`, so a later change is one line.

- [ ] **S — Owner: the height ranges per size.** For the size-guide column the
      direct competitor has and this site does not. The guide carries bust, waist
      and hips only.

      **No sale is coming.** The owner confirmed on 2026-09-21 that none is
      planned, after the 2026-08-28 one ended. The mechanism is built and idle and
      no product carries sale data. Stop asking; raise it only if the owner does.

      Fabric composition for the two dresses, once listed here, shipped in
      `e5b5cc8`: `lunar` is поліамід 80% / віскоза 17% / еластан 3%, `noblesse`
      поліамід 80% / віскоза 20%.

      The ФОП details shipped as well. Of the five things this item once blocked
      on, only the height ranges remain.

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
      `orderMessage` signature took a `{site}` placeholder, since removed with the
      signature itself on 2026-09-21. Documented in `.env.example`. Confirmed by
      building against the other domain: every canonical, OG url, image url and
      JSON-LD offer url followed.

      **The variable is set wrong in production.** Workers Builds has
      `NEXT_PUBLIC_SITE_URL=https://velels.datngn11.workers.dev`, left from before
      the apex existed, so every live canonical, hreflang, `og:url` and JSON-LD
      url points at a hostname that 404s. The code default is already
      `https://velels.com`, so deleting the variable fixes it. **This has to land
      before indexing is turned on**, or Google is told the canonical home of
      every page is a host that does not exist. Found 2026-09-21 by reading the
      live HTML, not the build.
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
- [x] **S — Re-encode the hero video.**
      -> Done 2026-09-15. **7.91 MB to 2.07 MB.** Two encodes behind a `<source>`
      list, both from the owner's 113 MB 2160x3836 master scaled to 1080x1918
      (lanczos), audio dropped — the element is muted and `aria-hidden`:

      | file | codec | size | VMAF (phone) |
      | ---- | ----- | ---- | ------------ |
      | `hero_mobile.hevc.mp4` | H.265 Main L4.0, crf 30 veryslow | 2.07 MB | 99.05 |
      | `hero_mobile.mp4` | H.264 High L4.0, crf 28 veryslow | 3.24 MB | 98.03 |

      **Score with VMAF's phone model, not the default.** The video is inside
      `block md:hidden` and never renders above 768px, so the default 1080p-desktop
      model measures a viewing condition that does not exist here. It reads ~6
      points lower and led to stopping at 3.25 MB when 2.07 MB is indistinguishable
      on the device that actually plays it:
      `libvmaf=model='version=vmaf_v0.6.1\:enable_transform=true'`.

      **Encode from the master, never from a shipped file.** The 7.91 MB original
      was itself H.264 at 4205 kbps, so encodes from it stacked generation loss —
      about 3 VMAF at equal size.

      **The H.264 fallback needs its level pinned.** `-preset veryslow` defaults to
      16 reference frames, which pushed it to High@L5.1 — backwards for the file
      whose whole job is rescuing old hardware, since cheaper decoders cap at L4.x
      or limit ref frames. `-level 4.0 -refs 4 -bf 3` costs nothing measurable
      (3.22 MB/97.92 became 3.24 MB/98.03).

      **H.265 rather than AV1**, though AV1 measured better: the audience arrives
      from Instagram and is heavily iPhone, where every device since 2017 decodes
      H.265 in hardware while AV1 needs an A17 Pro or newer. **Main, not Main10**,
      though 10-bit also measured better — Main10 hardware decode is not guaranteed
      on older iPhones. The tag must be `hvc1`, not `hev1`, or Safari refuses it.

      Quality floor, phone model: crf 28 = 2.59 MB/99.78, **crf 30 = 2.07 MB/99.05**,
      crf 32 = 1.66 MB/97.61, crf 34 = 1.33 MB/95.51. Losses stay under a point per
      step to crf 30, then cost 1.4 and 2.1 — that is the knee.

      Four fallbacks, so no device can get a broken hero: a browser only picks a
      `type` it claims; unclaimed falls to H.264; if both fail the `error` listener
      in `useVideoAutoplay` shows the 79 KB poster; and that hook already declines
      to play under reduced motion, Low Power Mode or Data Saver.

      `-movflags +faststart` matters and is easy to omit: it moves the moov atom
      ahead of the media so playback can begin before the download finishes.

      Two measurement traps, both hit here: SSIM ranked AV1 far too low, so score
      with VMAF; and comparing across containers needs the timebases synced
      (`fps=30,settb=AVTB` on both inputs) or VMAF collapses to a plausible but
      meaningless number — VP9 first measured 74 instead of 94.6.

      The master lives at `~/Desktop/velels-masters/`, outside the repo: 113 MB in
      `public/` would be published and exceeds Cloudflare's 25 MiB asset limit, and
      in git it would be permanent. ffmpeg is required — `brew install ffmpeg`;
      macOS `avconvert` cannot do this, its presets target quality with no bitrate
      control and `Preset1280x720` produced a file *larger* than the source.

      Verified: VideoToolbox (Apple's own decoder) reads all 451 frames, faststart
      confirmed on both, and Chrome — which does not claim the type — falls through
      to the H.264 and plays. **Not yet verified on a real iPhone**, which is the
      device this whole choice serves.
      → `public/hero/hero_mobile{,.hevc}.mp4`, `src/components/home/HeroSection.tsx`

- [ ] **M — Cloudflare image transformations via a custom `next/image` loader.**
      Point the loader at `/cdn-cgi/image/`. The free plan allows 5,000 unique
      transformations a month, where unique means one option-combination per source
      image per month. 93 images at four widths is roughly 370, so about 7% of the
      allowance. The catalogue currently ships 18 MB of WebP with no `srcset` at
      all, and the product carousels are the heaviest thing a visitor loads.
      *If time runs out, the minimum acceptable version is the hero `<picture>` fix
      in L5 alone, leaving `unoptimized: true` in place.*
- [x] **S — Add `www.velels.com` as well as the apex.** Workers Custom Domains
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

      **Done 2026-09-21.** The apex is a Custom Domain declared in
      `wrangler.jsonc` (`c1497c1`) so it reapplies on every deploy. `www` is a
      proxied CNAME to the apex plus a Redirect Rule: 301, wildcard path, query
      string preserved. Verified `/`, `/uk`, a deep product path and `?ref=story`
      all reach the apex in one hop.

      The rule matched nothing at first because the Request URL carried a leading
      space. Cloudflare flagged it twice, as "include the protocol" and as a
      proxying warning, and both were dismissed as UI glitches. They were not.
- [x] **S — Keep preview and `workers.dev` URLs out of the index.** The existing
      `NEXT_PUBLIC_ALLOW_INDEXING` gate already fails closed. Set it only on the
      production build.
      **Better than `noindex`: set `"workers_dev": false` in `wrangler.jsonc` once the
      custom domain resolves.** That removes the `velels.workers.dev` hostname
      altogether — no page to crawl beats a page asking not to be crawled, and it
      also removes a duplicate-content source whose canonicals point at the real
      domain. It has to stay enabled until then, because it is the only URL the
      first deploy can be smoke-tested on.

      **Done 2026-09-21** in `65b8402`: `workers_dev: false` once the apex
      answered. Versioned preview URLs 404 as well, so no second copy exists.
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
- [x] ~~**S — Add a height line to the copied message.**~~ **Reverted 2026-09-21
      at the owner's request.** The blank `Мій зріст: ___ см` is gone, along with
      the `— via {site}` signature. The Consultant asks for height and the other
      measurements in conversation anyway, so the line saved no round trip and
      only made the pasted text look like a form to fill in.

      The greeting is `Вітаю!` rather than `Привіт!`, the owner's wording: it is
      the singular a customer would write, where `Вітаємо` is the plural a
      business uses, and `Доброго дня` would be wrong outside daytime. The message is one line: greeting, model, colour, size.
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
- [ ] **S — Owner: re-export that OG image at 1200×630.** The file is 1431×858,
      5:3 where the share card is 1.91:1, so previews centre-crop about 6% off the
      top and bottom. The wordmark sits centred and survives; the model's feet get
      clipped. Cosmetic, not broken, and it needs the source file rather than a crop
      of the JPEG.

      -> The other half is done, 2026-09-22 in `4e5e281`. The export carried a
      Display P3 profile, which preview crawlers and in-app browsers routinely
      ignore, so it rendered oversaturated. It is now sRGB: a real colour transform
      rather than a stripped profile, checked against macOS ColorSync. 182 KB, JPEG.
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

      **Checked 2026-09-23:** the domain is behind Cloudflare now, but
      `/cdn-cgi/image/…` returns 404, so Image Transformations are not enabled on
      the zone. That is a dashboard switch for the owner, or the owner supplies the
      eleven files instead. Size is not the obstacle: 4 of the 11 covers are already
      1200px wide or more. Orientation is. All eleven are portrait.
- [x] **S — Favicon and `apple-icon`.**
      -> Done 2026-09-14. The owner supplied a "Vé" script monogram and composed
      the square crop himself; `assets/brand/icon-master.png` is that 256x256
      master and `assets/brand/mark.png` the 820x820 original. Both sit outside
      `public/` so neither is served. Shipped as `src/app/favicon.ico` (16/32/48),
      `icon.png` 256x256 and `apple-icon.png` 180x180 through Next's file
      convention, plus `public/icons/icon-{192,512}.png` for Android, which the
      manifest points at. The Android pair lives in `public/` deliberately: under
      the file convention they would each add a `<link rel="icon">`, and nothing
      should fetch a 512px icon to draw a tab.

      Three things about the conversion that would otherwise be rediscovered:
      - **The `.ico` frames must be RGBA.** Turbopack's decoder rejects an ICO
        whose PNG frames are RGB — *"The PNG is not in RGBA format"* — and the
        build fails outright.
      - **Preview exports Display P3**, whatever the source was, so every file is
        converted to sRGB on the way in. Convert, never assign.
      - **The master's composition is authoritative.** The icons are straight
        LANCZOS reductions of it; nothing is re-cropped or re-centred. Regenerate
        them from the master if it changes, and do not pad or recompose.

      A favicon.io set was generated from the same original and compared rather
      than adopted: its frames washed out at 32 and 48 (darkest pixel 41 and 15,
      against 20 and 0 here) and its `.ico` was 15.4 KB to this one's 4.1 KB,
      storing uncompressed BMP frames. Its `site.webmanifest` would have quietly
      reverted `display` to `standalone` and `theme_color` to white.

      The mark is roughly 2.1:1, so in a square it fills about 43% of the height
      and 16px is faint by construction — measured, not guessed: at 16px no pixel
      reaches even 50% grey, in either that set or this one. That is the artwork,
      not the pipeline, and the trade-off was the owner's to make. An SVG would
      render sharper and could invert for dark mode, but would not fix the detail
      at 16px, and Canva gates SVG export behind Pro.
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
- [x] **S — `<html>` carries no `lang` attribute.** Confirmed in the build: both
      `out/uk.html` and `out/en.html` open `<html class="..." data-scroll-behavior>`
      with no language declared. This undercuts the rest of L3 — the site tells
      crawlers which page is which language via canonicals and `hreflang`, while the
      document itself declares none — and a screen reader gets no signal to switch
      to a Ukrainian voice for Cyrillic copy.

      -> Done 2026-09-11. Not by the restructure sketched below: moving `<html>`
      into `[locale]/layout.tsx` worked for `lang` and for `global-not-found`, but
      broke Next's internal `/_not-found` with a `headers()` error that emits no
      stack trace. Six attempts, then reverted.

      What shipped instead: the root layout renders `lang` at the default locale
      and an inline script corrects it from the first path segment before paint,
      with `HtmlLang.tsx` mounted inside `[locale]/layout.tsx` keeping it in step
      across client-side locale switches. The 404 resets it separately, since one
      `404.html` serves both locales.
      → `src/app/layout.tsx`, `src/components/layout/HtmlLang.tsx`
- [x] **S — The deployed 404 is always Ukrainian.** A static export emits one
      `out/404.html` and no per-locale variant, so Cloudflare's
      `not_found_handling` serves the Ukrainian page for `/en/mistyped` too. An
      English visitor arriving from a bad Instagram link gets a page she cannot
      read. Worse, the `LocaleSwitcher` in the navbar on that page calls
      `router.replace(pathname, { locale: "en" })`, which sends her to
      `/en/<the stray path>` — a second 404.

      -> Partially done 2026-09-11. The `lang` attribute is now reset to the
      locale read from the path, so the document no longer lies to a screen reader
      about what language it is in. **The copy itself is still Ukrainian only** —
      one `404.html` serves both locales and translating it at runtime was judged
      more risk than the page is worth. Revisit if `en` traffic materialises.
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
- [ ] **S — Mark the story links with `?ref=story`, and leave the bio bare.**
      Instagram's in-app browser passes no usable referrer, so bio and story traffic
      are indistinguishable unless one of them is tagged. Tag the stories:

      - bio: `velels.com` — nothing appended
      - story stickers: `velels.com/uk?ref=story`

      No code; the parameter is unused by the site and only has to survive into the
      analytics.

      **Tag the stories, not the bio** — the reverse of the obvious. A bio link is
      displayed as its URL, so a tracking parameter sits on the profile looking like
      spam. A story link sticker replaces the URL with custom text ("Shop now"), so
      the parameter is never visible. Untagged traffic is then the bio, and the split
      still works.

      Do not use `?ref=ig`: near enough all traffic is Instagram, so it separates
      nothing. Bio vs story is the only division with any information in it. Accept
      that "untagged" also absorbs links pasted into DMs and comments — at this
      volume the bio dominates.

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
- [x] **M — Search metadata pass.** Done 2026-09-23 on `seo/audit-fixes`, which
      is **not deployed until it is merged and pushed**. Audited against Google's
      docs and the built output of all 44 indexable pages; canonicals, hreflang,
      status codes and `robots.txt` were already right.
      1. `max-image-preview:large` on the root robots tag.
      2. Product titles name the category: «Dimaya, суцільний купальник — VELÉLS».
      3. Product descriptions add the size range and «пошиття на замовлення».
      4. Product image alts are composed from a per-photo `shot` tag, in the
         page's language. Checked photo by photo, 42 of the 101 old English alts
         described a shot the image does not show.
      → `src/app/layout.tsx`, `src/app/[locale]/product/[slug]/page.tsx`,
      `src/lib/utils/productImageAlt.ts`, `src/lib/data/products.ts`
- [ ] **S — After that branch deploys:** re-scrape the share previews (every
      product title changed) and request reindexing of the product pages in Search
      Console.
- [ ] **M — The second colourway is invisible to crawlers.** The gallery renders
      only the first colour in the static HTML; the other appears on a click, and
      crawlers do not click. 34 of 101 photos, and their alts, therefore never
      reach Google except as bare URLs in the Product JSON-LD. Needs a decision on
      how to expose them before it is worth building.
- [x] **S — Catalogue title.** «Колекція — VELÉLS» named no product, on the page
      that should rank for «купальники». Now «Купальники та курортні сукні —
      VELÉLS» from `catalog.metaTitle`; the visible heading and the breadcrumb keep
      «Колекція». Done 2026-09-23, same branch.

- [x] **S — English left on the Ukrainian homepage:** the hero, editorial and three
      Instagram image alts, and the homepage `og:image:alt`. All localised and
      describing what the photo shows. The hero keeps a general alt on purpose:
      `<picture>` serves two different photos through one `<img>`. Done
      2026-09-23, same branch.
- [x] **S — `og:image:width`/`height` on the catalogue and info pages.** They use
      the home image, whose size is known; `pageMetadata()` now declares it
      whenever no image is passed. Done 2026-09-23, same branch.
- [x] **S — Email in the Organization JSON-LD.** Google recommends it and the
      address was already published on the contact page. Now `siteConfig.email`,
      which the contact linkifier reads too. Done 2026-09-23, same branch.

      Considered and dropped, each on Google's own documentation:
      - **sku, itemCondition, colour, material, size on the Product.** These serve
        merchant listings, and *"only pages where a shopper can purchase a product
        are eligible"*. Ordering happens in Instagram Direct, not on the page. The
        return and shipping policy already on the Offer is inert for the same
        reason; it is truthful, so it stays. Revisit if an order form lands.
      - **Sitemap `lastmod`.** Used only if *"consistently and verifiably
        accurate"*. A static export has no honest per-page date, and a build date
        on every page is the inaccuracy that teaches Google to ignore it.
      - **`ItemList` on the catalogue.** Carousels support Course, Movie, Recipe and
        Restaurant only.
      - **`og:type: product`.** Next's metadata types do not allow it, and only
        Facebook reads it.
      - **A shorter Ukrainian homepage description.** At 178 characters it runs
        past what a Google result shows, but Google does not show it anyway: for
        a Ukrainian query it quotes the brand paragraph instead. Telegram, where
        links are actually shared, shows it in full. Tried and reverted
        2026-09-23.

---

## L4 — Product information

With no form and no Consultant in the loop until Direct opens, the page has to
answer on its own.

- [ ] **S — Fix the dress size chart.** Bust 82–84 then 86–88 leaves 85 in no size,
      and 88–90 repeats the gap. Make the ranges contiguous. Wrong sizing data is
      worse in lite, because the size she reads is the size she puts in the message.
      → `src/components/product/SizeGuideModal.tsx`
- [x] **S — State the fabric composition.**
      -> Done 2026-09-14. The owner gave one figure for the whole swimwear range,
      so it is a single `productDetail.composition` string rather than per-product
      copy, and the first line of the visible facts list under the call to action
      rather than in the Details accordion — an accordion is where information
      goes to be ignored. The label is bold, marked up as `<b>` inside the message
      and rendered with `t.rich` so a translation can move it, rather than being
      concatenated in the component. Shown for
      the nine swimwear Models and withheld from `lunar` and `noblesse`, which are
      a different fabric the owner has not specified — a wrong composition on a
      garment is worse than none.

      "Spandex" is rendered as «еластан» in Ukrainian and "elastane" in English:
      the same fibre, and the term Ukrainian and EU labels actually use. Change it
      to «спандекс» if the owner prefers her own wording.
      → `src/components/product/ProductInfo.tsx`, `src/messages/{uk,en}.json`
- [x] **S — State the dress length.** 131 cm is fixed rather than height-scaled, so
      the same dress is floor-length on 157 cm and midi on 175 cm.
      -> Done 2026-09-15 for `lunar`, as a `length` message read through
      `tProduct.has()` and shown in the visible facts list. Called *length*, not
      height: `CONTEXT.md` reserves height for the customer's own measurement.
      It could not go in the size guide, whose chart is per category, or Noblesse
      would have inherited a measurement that is not its own. **Noblesse carries no
      length by the owner's decision (2026-09-16)**, so the glossary's "131 cm by
      default" applies to Lunar alone for now.
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

- [x] **S — The hero parallax was dead code, and was suppressing the zoom.**
      -> Done 2026-09-14. Removed entirely: the `heroScrollParallax` keyframes, the
      `@supports` block, the class on the hero `<img>`, and the entry in
      `AGENTS.md`'s animation list. Three faults, found while checking an external
      review's reduced-motion claim, all of them predating the `<picture>` rewrite:

      - **It never moved.** `animation-range: exit 0% exit 100%` uses *view*-timeline
        range names, which mean nothing on a `scroll()` timeline, so the animation
        sat permanently out of range. Measured in Chrome: `translateY` stayed at
        `0px` at every scroll position from 0 to 2902.
      - **It suppressed the zoom.** `.animate-hero-zoom` and `.hero-parallax-img`
        both sat on the same element and both set the `animation` shorthand. Equal
        specificity, so source order decided it, and the parallax rule is later —
        `heroZoom` never entered the animation list at all. Deleting the parallax
        brings the 8s zoom back, confirmed in Chrome.
      - **Reduced motion could not have stopped it.** The blanket
        `animation-duration: 0.01ms !important` cannot touch a scroll-driven
        animation: once `animation-timeline` drives progress, duration is ignored.
        That was the external review's finding and it was correct, but the fix it
        implied guarded an animation that did nothing. No guard is needed now —
        `heroZoom` is time-based, so the blanket rule does reach it.

      `.scroll-progress-bar` has the same immunity and was wrongly left alone at
      first, on the grounds that its movement was essential information. It is not:
      the browser's own scrollbar already shows scroll position, so the bar is
      decoration, and rule 4 in `AGENTS.md` admits no exemption anyway. Measured
      under reduced motion it tracked scroll exactly as normal — `scaleX` 0.25,
      0.50, 0.75, 1.00 across the page. Now cleared in the same block; it rests at
      its base `scaleX(0)`, invisible rather than frozen part way.

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
- [x] **S — One `<picture>` for the hero instead of two `<Image>` elements.** The
      `hidden md:block` / `block md:hidden` pair downloads both images on every
      device and emits two competing `<link rel="preload">` tags for two
      viewport-dependent LCP candidates. Art direction with `media`-scoped `<source>`
      elements removes the double download and the double preload together.
      -> Done 2026-09-13. One `<img>` inside a `<picture>`, `media`-scoped
      `<source>` for desktop, saving 101.5 KB on every phone. The wrapper needs
      `class="contents"` or it becomes an in-flow flex item — the elements it
      replaced were absolutely positioned. `next/image` gives nothing up here:
      `images.unoptimized` is already set.
      → `src/components/home/HeroSection.tsx`
- [x] **S — Throttled mobile Lighthouse pass.** Record the numbers so later
      regressions are visible against something.

      **Baseline 2026-09-16**, Lighthouse 12 against the production build served
      locally, default mobile throttling. Median of three runs per route.

      | route | perf | a11y | best-practices | seo | LCP |
      | --- | --- | --- | --- | --- | --- |
      | `/uk` | 82 | 100 | 100 | 69 | 4.9s |
      | `/en` | 82 | 100 | 100 | 69 | 4.9s |
      | `/uk/product/dimaya` | 83 | 98 | 100 | 69 | 4.8s |
      | `/uk/catalog` | 84 | 98 | 100 | 69 | 4.6s |
      | `/uk` desktop | 100 | 100 | 100 | 69 | 0.1s |

      Homepage figures updated 2026-09-18 after `4c85e23`; it was 75 and 9.0s.
      Under real throttling the homepage is 85 with LCP 2.9s.

      **Read performance as a band, not a value.** Three runs of one unchanged
      build gave 86, 84, 84 on the catalogue. Anything inside ±4 points or ±0.4s
      is noise on this machine; only a swing past 10 points is worth chasing. An
      earlier single run recorded the catalogue at 91 and that number was wrong.

      **SEO 69 is not a defect.** The only failing audit is `is-crawlable`, the
      `NEXT_PUBLIC_ALLOW_INDEXING` gate failing closed as designed. It goes to ~100
      on a production build with indexing on. Likewise the cache-lifetime failures
      are `npx serve`'s headers, not Cloudflare's.

      Two real findings came out of it and are fixed: contrast 3.24:1 on the
      footer copyright (`ca52977`), and a locale-switcher `aria-label` that
      replaced rather than contained its visible text (`6b5f151`). Accessibility
      went 96 to 100 on the homepage.

      **Still failing:** `heading-order` on the product and catalogue pages, both
      jumping to `<h3>` with no `<h2>` above. That is what holds them at 98.

- [x] **S — The homepage LCP was 12.0s on mobile, and it was the hero video.**
      Fixed 2026-09-18 in `4c85e23`. Real throttling: **12.0s and 64 became 2.9s
      and 85**. Simulated: 9.0s and 75 became 4.9s and 82. Desktop stayed 100.

      **Read the old numbers with care.** Everything recorded before this used
      Lighthouse's default *simulated* throttling, which reported 8.5s where real
      applied throttling reported 12.0s. Use `--throttling-method=devtools` when a
      number has to be trusted.

      **The cause was paint order, not bytes.** Nothing large sat in the mobile
      HTML, so the video was the first big element to paint. LCP keeps whichever
      element painted first at the largest size, so the video held the entry at
      12s and nothing arriving later could displace it.

      Three plausible causes were measured and ruled out. A 2.75 MB faststart
      encode scored the same 12.0s as the 3.24 MB one, so file size was not it.
      Stripping 1.5 MB from the Instagram strip moved LCP by 0.4s. Hydration was
      never a factor: bootup 0.2s, total blocking time 10ms, FCP 0.9s.

      What exposed the mechanism was dropping `PROBE_TIMEOUT_MS` to 6s. The poster
      then won the LCP entry, but at **12.6s**, because its 46 KB request was
      queued behind the video's 3.2 MB download. The two compete for one throttled
      connection, which is why every half-measure was bistable, sometimes 3s and
      sometimes 12s across identical builds.

      **The fix is one `<picture>` with `fetchPriority="high"`**, which is the
      structure the file had before the poster was removed, and which
      `globals.css` still assumed — its `animate-hero-zoom` comment describes "one
      `<picture>`, so this sits on the element the phone also uses". `media` is
      resolved before the fetch, so a phone takes the 46 KB poster and a desktop
      the 101 KB landscape. That also ended the 101 KB every phone was downloading
      and never painting.

      **Two traps worth keeping.** A 494-byte inlined blur moves nothing: Chrome
      excludes low-entropy images from LCP candidacy by design. And an encode
      without `-movflags +faststart` measured *worse* (14.8s), because the browser
      must pull the whole file before a frame appears. Both production encodes
      have `moov` at byte 32 and are correct.

      **Cost:** 46 KB on every mobile visit, and a still is visible before the
      video. The owner had asked for that still removed on 2026-09-15; it is
      acceptable now only because the poster is the video's own first frame and
      there is no cross-fade, so the picture does not change, it begins to move.

- [x] **S — Low Power Mode showed a blank white hero.** iOS refuses unprompted
      playback, the probe fails, the video unmounts, and with the poster gone that
      left white copy on a white ground. Fixed by the same change: the still is
      already painted when `play()` is refused. **3.0s and 92**, against 8.7s and
      a blank screen while the poster was gated behind JavaScript. Those visits
      fetch no video at all, 3.3 MB against 6.4 MB, because `preload="none"` means
      nothing loads until a `play()` that never succeeds. Same for Save-Data,
      reduced motion and a decode error.

- [x] **S — The Instagram strip is 1.70 MB, and one file is most of it.**
      `post_2.webp` is 3334x5000 and 1 MB, rendered in a four-across grid at 25vw
      on desktop and 50vw on mobile, so a thumbnail. Resized to 800px at the same
      quality it is 44 KB. `post_3.webp` is 591 KB against 93 KB; `post_1.webp` is
      already sensible at 101 KB. All three together drop to roughly 170 KB.

      Worth doing for the data, not the score: removing them moved LCP by 0.4s but
      takes a quarter off the homepage's transfer. Measured 2026-09-18.
      -> `public/instagram/`

      **Done 2026-09-21** from the owner's originals. 1739 KB to 483 KB, a 72%
      cut, and the homepage drops from 6,517 to 4,478 KiB. All three are 1000px
      wide at webp q88: the grid gives each one 316 CSS px and mobile 75vw is
      about 320, so 1000 covers a DPR3 phone with nothing spare. 800px and 900px
      both scored worse at that viewing size.

      Quality was chosen by measuring SSIM of each encode *as displayed* rather
      than against the full-size original, since grain that vanishes on downscale
      should not drive the decision. At 320 CSS px even q55 scores 0.98; q88
      holds 0.975 at DPR3.

      `post_3` is 323 KB against 67 and 93 for the others, and that is inherent:
      it is a dark high-ISO frame with 3.5x the high-frequency energy, so the
      encoder spends its bits on grain in the black fabric. A median denoise made
      SSIM worse and saved almost nothing.

      **AVIF was rejected on mechanism, not merit.** It is roughly 35% smaller
      again at matching quality, but `images.unoptimized: true` serves the `src`
      verbatim with no format negotiation, so an AVIF would simply fail below
      iOS 16.4. Revisit when the full plan turns optimization on.

- [x] **S — `heading-order` on the product and catalogue pages.** Both jump from
      `<h1>` straight to `<h3>` with no `<h2>` between, confirmed in the built
      HTML. The last real accessibility failure, and what holds those two pages at
      98 where the homepage is 100.
      -> `src/components/product/ProductInfo.tsx`, `src/components/catalog/`

      **Done 2026-09-21** in `916490f`, PR #28. The footer columns were the
      cause: `h3` on every page, and the homepage only passed because ProductGrid
      and InstagramFeed emit `h2`s above them. They are `h2` now, and
      `ProductCard` takes a heading level: `h3` inside the homepage section, `h2`
      on the catalogue where only the page `h1` is above it. Accessibility 100 on
      home, catalogue and product.

- [ ] **S — 17 product images sit above 0.15 bytes per pixel**, against a median
      of 0.086. Re-encoding them at the quality the rest of the set uses saves
      2.3 MB of 19.3 MB, with no dimension change. Lauri is worst: `black_4.webp`
      is 373 KB against 116 KB re-encoded, `black_2.webp` 670 KB against 283 KB.
      Some barely move, meaning those are genuinely detailed rather than badly
      encoded. **Deferred by the owner 2026-09-15**, who will do the image pass.
      -> `public/products/`

---

## L6 — Legal and copy

- [x] **S — Trader identity, in `info/terms`, not `info/contact`.** Article 7 of the
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

      **Done 2026-09-10, with two deliberate omissions.** The clause names the ФОП,
      her РНОКПП, the email and the site. It does **not** carry an address: the owner
      chose not to publish one, which leaves a known shortfall against Article 7 and
      is accepted on the same reasoning as the tier above — enforcement is
      complaint-driven, and three of the five competitors publish nothing at all.
      The ЄДР record number and date are also absent; ROÁR publishes theirs, Article 7
      does not ask for them, and they can be added from a Diia extract at any time.

      **The IBAN is deliberately not on the site.** Article 7 does not ask for a bank
      account, ROÁR does not publish one, and a visible account invites payment before
      an Order exists — which for a made-to-order business means money arriving with
      no size, no colourway and a manual refund. Payment details go out in Direct at
      confirmation.

      This also cleared the last of the six `[[ TODO: ]]` placeholders, which were
      rendering publicly on the live terms page.
      → `src/messages/{uk,en}.json` `info.terms`
- [x] **M — Rewrite the privacy policy to match reality.** Done 2026-09-10. The old
      one claimed the site collects name, phone, email, delivery address and order
      history, shares data with payment processors, and uses cookies. None of that
      happens.

      **Written from what the business actually does, not from "we collect nothing"** —
      which would have been the opposite error. The site collects nothing; the
      *business* does collect a name, phone, city and branch, in Instagram Direct.
      Thirteen sections: the site stores nothing, analytics and hosting, what arrives
      via Direct, purposes, grounds, recipients, retention, rights, children,
      customers outside Ukraine, changes, contact.

      **Three disclosures no competitor makes**, because they all have website
      checkouts and we do not:
      - **Meta is a processor here.** Every order conversation lives in Instagram
        under Meta Platforms Ireland Limited's own policy, which we cannot control.
        The policy says so and offers email as an alternative channel.
      - **Cloudflare processes request IPs** to serve a static site. True of every
        hosted site; almost never disclosed.
      - **Nova Poshta's own policy puts the duty on us.** The sender is responsible
        for collecting recipient data lawfully and for consent to pass it on, so the
        transfer is named explicitly, along with customs for international parcels.

      **Surveyed five Ukrainian fashion brands first.** ROÁR, KSENIASCHNAIDER,
      Sleeper and BEVZA all publish the Shopify boilerplate — ROÁR's runs to roughly
      8,000 words about Shopify, Google Analytics, Shopify Audiences and Facebook
      ads, none of which they need and none of which we use. KSENIASCHNAIDER cites
      the US Patriot Act and neither Ukrainian law nor GDPR; BEVZA omits rights and
      retention entirely. Only INSTYTUTUM, outside fashion, has a real Ukrainian
      document, and its section order is what this one follows. The bar here is low
      and worth clearing properly rather than copying.

      **Language deliberately kept factual about analytics**, per the correction
      already recorded in this item's history: no claim that analytics data "is not
      personal data", no claim that consent is unnecessary, and Umami's "IP is not
      stored" is attributed to Umami rather than asserted.

      **Dependency:** the analytics section describes the L7 tracker in the present
      tense. If the site launches before `NEXT_PUBLIC_UMAMI_WEBSITE_ID` is set, that
      section describes collection that is not happening — the exact defect being
      fixed here. Ship the snippet or cut the section.
      → `src/messages/{uk,en}.json` `info.privacy`
- [x] **S — Read `info/payment` and `info/terms` against the lite site.** Both
      already say orders are placed in Direct, which is why lite is coherent at all.
      Confirm nothing elsewhere promises a site checkout.
      -> Read 2026-09-16. Nothing promises a site checkout anywhere: the payment
      page and the FAQ both route to Instagram, and the privacy policy states
      there is no form, account, cart or payment.

      The read found two things that were wrong instead, both fixed in `e08cb0d`.
      `info.terms` claimed *"Усі товари залежать від наявності"* and reserved the
      right to limit quantities, on a site where nothing is ever in stock. And
      Обмеження відповідальності was a literal translation of US boilerplate —
      "непрямі, випадкові або побічні збитки" for "indirect, incidental, or
      consequential damages" — categories Ukrainian civil law does not use, and
      unenforceable against a consumer under ст. 18 anyway. Section removed.

      **Still open in the same file:** section [0] reserves the right to change
      the terms "в будь-який час", another unfair-term candidate under ст. 18.
- [x] **S — International wording.** State plainly that international orders are
      quoted individually, with full prepayment and shipping paid in advance.
      -> **Two of the three already hold**, in eleven places across the delivery
      page, FAQ, payment page, the PDP payment bullet and the privacy policy: full
      prepayment, and shipping paid in advance. Only *quoted individually* is
      missing, and it needs the owner's wording.

      **Done 2026-09-21** in `f86a93a`, English only. "prepaid in full,
      including the cost of shipping" read either way; it is two sentences now,
      with "Shipping is quoted separately by destination" on the PDP and the
      payment page. The owner reverted the matching Ukrainian, so `uk` states
      prepayment and shipping in advance without saying the amount is quoted.
      The locales differ in completeness, not meaning.
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

- [x] **S — Sign up for Umami Cloud and add `velels.com`.** Done 2026-09-11; the id is a Workers Builds variable, and the repo is connected so pushes to `main` build and deploy. The Hobby plan is free
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

- [x] **M — The Direct handoff on a real phone**, inside the Instagram in-app
      browser, on mobile data, both iOS and Android if possible. This is the single
      highest-risk item in lite and the one most likely to be silently broken.

      **Done 2026-09-22.** The owner tested it inside the Instagram in-app
      browser and the message copied and pasted as expected. This was the only
      part of the order path nothing could check remotely.
- [x] **S — Both locales, every route:** home, catalog, filtered catalog, all 11
      products, all nine info pages, 404, error page.

      **Done 2026-09-22** against the live site: 51 pages, all 200. Both
      homepages, both catalogues, 11 products x 2, 9 info pages x 2, plus robots,
      sitemap, manifest and the OG image. `/nonexistent` returns a real 404 with
      the Ukrainian error page.
- [ ] **S — Share previews for real.** Post a product link into Telegram and
      Instagram and look at what renders. Run the homepage through Facebook's sharing
      debugger.
- [ ] **S — Keyboard-only pass** of the whole site, with attention to the catalogue
      dropdown.
- [x] **S — Confirm the locale files are still key-identical.** 362 keys including
      intermediate objects, 269 of them leaves, across 12 namespaces — verified
      2026-09-18. The number has grown with every copy addition, so re-count rather
      than trusting this line. Several items above touch `uk.json` and `en.json`, and a key added
      to one and not the other breaks the build.

      **Verified 2026-09-23:** 296 leaves, 390 including intermediate objects,
      identical across `uk` and `en`, zero one-sided keys. Added for search: the
      three category nouns and the description tail in `meta`, the image alt
      vocabulary (`meta.imageShot`, the two colour words, `imagePosition`), and
      `productDetail.showImage` for the gallery thumbnails. Then the catalogue
      `metaTitle`, `meta.ogImageAlt`, and alts for the hero, editorial and three
      Instagram images.
- [x] **S — Confirm the analytics snippet is actually in the build**, not just a
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
- [x] **S — Flip indexing on**, submit the sitemap in Search Console, verify the
      property.

      **Done 2026-09-22.** `NEXT_PUBLIC_ALLOW_INDEXING=true` in Workers Builds,
      then a rebuild, because it is inlined at build time and setting the
      variable alone changes nothing. Live: `index, follow`, `robots.txt` carries
      `Host:` and `Sitemap:`, sitemap holds 44 URLs with 88 hreflang alternates.
      Fetched all 44: none broken, none on the wrong host. Search Console
      verified by DNS TXT on the domain property; sitemap submitted and
      processed, 44 pages discovered.

      Expect a lag. Google's first crawl landed before the rebuild, so URL
      Inspection reported `noindex` from cache afterwards. Use "Test live URL"
      rather than the cached verdict when checking.

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
