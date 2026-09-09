# Cloudflare setup — runbook

The operational detail behind L1 of [`release-checklist-lite.md`](./release-checklist-lite.md).
That document says *what* and *why*; this one says *how*, in the order it has to
happen. Verified against Cloudflare's docs on 2026-08-28.

The site stays `output: "export"`. Every page is a prebuilt file served as a static
asset, and **no Worker code runs on a page view**. That is the whole reason this is
cheap: requests to static assets are free and unlimited, and they do not count
against the Workers free-plan ceiling of 100,000 requests a day.

---

## What the build actually produces

Confirmed against `out/` on 2026-08-28, so the settings below are not guesses:

| | |
| --- | --- |
| Total size | 39 MB (`out/products` alone is 18 MB) |
| File count | 588 — against a free-plan limit of **20,000 files per version** |
| Largest file | `out/hero/hero_mobile.mp4` at 7.5 MB — against a limit of **25 MiB per file** |
| Page URL shape | `out/uk/product/azure.html`, served at `/uk/product/azure` |
| 404 | `out/404.html` exists, but it is Next's unstyled built-in |

Both limits have a lot of headroom. Nothing about this site needs a paid plan.

---

## Step 1 — Register the domain

Cloudflare Registrar, `velels.com`, about **$10.44/year** at wholesale with no
renewal markup. Registrar requires the domain to use Cloudflare nameservers, which
is what everything below assumes anyway.

Do this first. It is the only step with propagation delay, and Step 4 cannot be
verified until it has landed.

---

## Step 2 — Write `wrangler.jsonc`

There is no wrangler config in the repo yet. Create one at the root:

```jsonc
{
  "$schema": "./node_modules/wrangler/config-schema.json",
  "name": "velels",
  "compatibility_date": "2026-08-28",
  "assets": {
    "directory": "./out",
    "not_found_handling": "404-page",
    "html_handling": "auto-trailing-slash"
  }
}
```

Four things worth understanding rather than copying:

- **No `main` key.** `main` is optional for assets-only Workers. Omitting it means
  there is no Worker script at all, so nothing can run on a page view and nothing
  can be billed.
- **`compatibility_date` is still required** even with no script.
- **`not_found_handling` defaults to `"none"`**, which serves a bare Cloudflare
  error page. `"404-page"` serves the nearest `404.html` with a real 404 status.
  Do **not** use `"single-page-application"` — it returns HTTP 200 for every
  unmatched path, which would feed the index unlimited duplicate homepages and
  undo the canonical work in L3.
- **`html_handling` defaults to `"auto-trailing-slash"`**, which is already correct
  here: it serves `azure.html` at `/uk/product/azure` and 307-redirects the
  trailing-slash form. Set it explicitly anyway so a future default change cannot
  silently alter every URL on the site.

The Worker `name` must match the name in the dashboard or the build fails.

---

## Step 3 — Connect the repo (Workers Builds)

Dashboard → **Workers & Pages** → your Worker → **Settings → Builds → Connect**.

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` (required; the default) |
| Root directory | leave empty |

The assets directory comes from `wrangler.jsonc`, so it does not need to be set in
the dashboard. Pushing a commit then triggers a build and deploy.

**Change `npm run build` first.** The current `deploy` script still pushes to GitHub
Pages via `gh-pages -d out`. Leave it or delete it, but do not let both deploy
paths run against the same domain.

---

## Step 4 — Attach the custom domain

**Settings → Domains & Routes → Add → Custom Domain.**

Cloudflare creates the DNS records and an Advanced Certificate automatically. The
zone has to be on the same account, which Step 1 guarantees.

> **Add `www.velels.com` as a second Custom Domain, or a redirect rule.** Custom
> Domains match the exact hostname — `velels.com` does **not** catch
> `www.velels.com`. The lite checklist does not mention this, and a visitor who
> types the `www` form would otherwise get nothing. A redirect rule pointing `www`
> at the apex is the better of the two, because it keeps one canonical hostname.

Set `NEXT_PUBLIC_SITE_URL=https://velels.com` as a build environment variable, and
set `NEXT_PUBLIC_ALLOW_INDEXING` **only** on production, so the `*.workers.dev`
preview hostname stays `noindex`.

---

## Step 5 — The hero video

`hero_mobile.mp4` is 7.5 MB — roughly 30% of what the site weighs, and every mobile
visitor downloads it.

**Correction to the lite checklist's stated reason.** It says Cloudflare's terms
name R2 as the compliant way to serve video rather than proxying a large file
through the CDN on a free plan. That reasoning is out of date: **Section 2.8 was
removed from the Self-Serve Subscription Agreement in May 2023**, and the current
Service-Specific Terms place no file-type restriction on the Developer Platform.
The file is also under the 25 MiB per-asset limit. Serving it straight from Workers
static assets is permitted.

So the case for acting is performance, not compliance — which changes the priority
order:

1. **Re-encode it first.** Cap at 720×1280, drop the muted audio track, 6–8 second
   loop, add a WebM source. Going from 7.5 MB to ~1.5 MB is the change that
   actually helps a visitor on Ukrainian mobile data.
2. **Then decide about R2.** Once the file is 1.5 MB, moving it is optional. If you
   do move it, a **custom domain on the bucket is required** — the `r2.dev`
   subdomain is rate-limited and documented as development-only.

---

## Step 6 — Image transformations

`out/products` is 18 MB of WebP shipped with no `srcset` at all. Point a custom
`next/image` loader at `/cdn-cgi/image/`.

Confirmed current pricing: **5,000 unique transformations a month free, on the free
plan, with no subscription required.** "Unique" means one option-combination per
source image per month. 93 images at four widths is ~370, about 7% of the
allowance. Past 5,000, cached results keep serving and new ones fail with error
9422 — you are not billed.

Note that OG images do **not** pass through the `next/image` loader, so the
landscape share cards in L3 need their transformation URL written by hand.

---

## Step 7 — Analytics

**Not Cloudflare Web Analytics.** It is free and already here, but it logs no query
strings and supports no custom events, so it cannot see the `?ref=` marker or the
Direct button — the only two things worth measuring at launch. Umami Cloud's free
tier does both. The snippet, the website id and the reasoning are in L7 of
[`release-checklist-lite.md`](./release-checklist-lite.md); nothing about it needs a
Cloudflare setting.

---

## Order of operations

```
1. Register velels.com                     ← do today, it has propagation delay
2. wrangler.jsonc                          ← can be written now, no account needed
3. Connect the repo, first deploy to *.workers.dev
4. Custom domain (apex AND www) + env vars
5. Re-encode the video
6. Image loader
7. Analytics
```

Steps 2 and 5 need no Cloudflare account and can be done while the domain
propagates.

---

## Things that are cheaper than the checklist assumes

- Static asset requests are **free and unlimited** and do not touch the 100,000/day
  Workers limit. Only the optional `/` → `/uk` redirect would invoke Worker code.
- Image transformations need **no paid plan**.
- 588 files against a 20,000 limit, 7.5 MB against 25 MiB. No limit is close.
