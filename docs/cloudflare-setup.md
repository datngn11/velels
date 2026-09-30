# Cloudflare setup

How velels.com is hosted and deployed. Part of the configuration lives in the
repo and the rest in the Cloudflare dashboard. No file in the code records the
dashboard half, so this page does, in enough detail to rebuild it from scratch.
The history behind each setting, with the reasons, is L1 of
[`archive/release-checklist-lite.md`](./archive/release-checklist-lite.md). Open work is in
[`post-launch-checklist.md`](./post-launch-checklist.md).

Checked against the repo on 2026-09-29. The dashboard values are as the
checklists recorded them when each was set, so confirm one in the dashboard
before relying on it.

---

## What runs

The site is `output: "export"`. `next build` writes every page to `out/` as a
prebuilt file, and an assets-only Worker serves that directory. `wrangler.jsonc`
has no `main`, so there is no Worker script and no code runs on a page view.
Static asset requests are free and unlimited, and they don't count against the
free plan's 100,000 Worker requests a day. Nothing here needs a paid plan.

The build on 2026-09-28 was 618 files against a limit of 20,000 per version. Its
largest file, `hero/hero_mobile.mp4` at 3.2 MB, is well under the 25 MiB limit
per file.

---

## In the repo

- **`wrangler.jsonc`.** The Worker name (`velels`), the assets directory, the
  apex as a Custom Domain, `workers_dev: false`, and the 404 and trailing-slash
  handling. The file comments each setting.
- **`public/_headers`.** Caches `/_next/static/*` for a year. Everything else,
  photos included, keeps Cloudflare's default `max-age=0` on purpose, because a
  replaced photo keeps its filename.
- **`npm run deploy`.** Runs `next build && wrangler deploy`, the manual path to
  the same Worker. Run from a Mac, it also publishes any `.DS_Store` files that
  ended up in `out/` (post-launch T3).

---

## In the dashboard

### Workers Builds

Workers & Pages → `velels` → Settings → Builds. The repo is connected, and every
push to `main` builds and deploys.

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Root directory | empty |
| Builds for non-production branches | off |

Branch builds stayed off while the `workers.dev` hostname existed, because each
one would have been a public, indexable copy of the site. Since
`workers_dev: false` a version has no public URL, so that reason is gone.
Post-launch T1 may turn them on to get a build on every pull request.

### Build variables

All three are set under Builds. `next build` inlines every `NEXT_PUBLIC_*` value
into the HTML, and nothing reads them after that.

| Variable | Value | When it is missing |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://velels.com`, or unset | The code falls back to `https://velels.com` |
| `NEXT_PUBLIC_ALLOW_INDEXING` | `true` | Every page says `noindex` |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | the id from the Umami dashboard | No page loads the analytics script |

Never put these under Settings → Variables and Secrets. That box holds runtime
variables for a Worker script, and this Worker has no script, so a value there
does nothing. Wrangler also deletes dashboard `vars` on its next deploy. A value
in the wrong box fails silently. The build succeeds and the feature is missing.

A changed variable reaches the live site only with the next build. Push a
commit, or use "Retry build".

`NEXT_PUBLIC_SITE_URL` once still pointed at the old `workers.dev` hostname,
which put every canonical on a host that returned 404 (lite L1). After changing
it, read the canonical on a live page.

### Domain and DNS

- **Registrar.** `velels.com` is registered at Cloudflare Registrar and renews on
  2027-08-28 (post-launch T6). Registrar requires Cloudflare nameservers, so the
  zone lives on this account.
- **Apex.** A Custom Domain declared in `wrangler.jsonc`, so every deploy
  reapplies it. Cloudflare manages its DNS record and certificate.
- **`www`.** A Custom Domain matches one exact hostname, so the apex does not
  cover `www`. It is a proxied CNAME to the apex plus a Redirect Rule: 301,
  wildcard path, query string preserved. `http`, `www` and deep paths all reach
  the apex in one hop. The rule matched nothing at first because its Request URL
  had a leading space. Cloudflare showed two warnings about it, and both were
  real.
- **`/`.** A second Redirect Rule, "Root to /uk", added 2026-09-30. Custom
  filter expression `(http.host eq "velels.com" and http.request.uri.path eq "/")`,
  static target `https://velels.com/uk`, 302, query string preserved. The
  Instagram bio link is the bare domain, so this sends it to the homepage
  before any HTML loads, and Umami no longer counts `/` as a page. A 302, not a
  301, because browsers cache a 301 indefinitely. `RootRedirect` in the code
  still redirects in the browser if this rule is ever removed.
- **Search Console.** The domain property is verified by a DNS TXT record.

### Zone settings

- **`robots.txt`.** Cloudflare can serve a managed `robots.txt` of its own. The
  one at the edge is ours, from `src/app/robots.ts` (checked 2026-09-28).
- **Image Transformations.** Off, so `/cdn-cgi/image/` returns 404. Turning it on
  unblocks the image loader and the landscape share cards (post-launch B9, P1,
  G4). The free plan includes 5,000 unique transformations a month. Past that,
  cached results keep serving, new ones fail with error 9422, and nothing is
  billed. OG images don't pass through `next/image`, so their transformation
  URLs have to be written by hand.
- **Web Analytics.** Not used. It logs no query strings and has no custom events,
  so it can't see `?ref=story` or the Direct button. The site uses Umami Cloud
  (lite L7).
- **R2.** Not used. The hero video has been 3.2 MB at most since the 2026-09-15
  re-encode, and Cloudflare's current terms put no file-type restriction on the
  Developer Platform.

---

## Adding a second Worker

A second Worker, such as the owner preview links in post-launch G8, needs
`"routes": []` in its environment. `routes` is inheritable. Without that line the
new environment inherits the apex Custom Domain, and its first deploy moves
`velels.com` away from production. Wrangler prints a warning about this in the
deploy output, and it is easy to miss.
