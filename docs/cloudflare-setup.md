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
  replaced photo keeps its filename. Every path also gets
  `Content-Security-Policy: frame-ancestors 'none'` and `X-Frame-Options: DENY`,
  so no other site can show ours in a frame.
- **`public/.assetsignore`.** Files Wrangler leaves out of the upload, in
  gitignore syntax: `.DS_Store`. The build copies it into `out/`, where
  Wrangler looks for it.
- **`npm run build`.** The checks live here, so every Workers Builds build runs
  them, on `main` and on every other branch: lint, `npm run typecheck`
  (`tsc --noEmit` over every `.ts` file, tests and scripts included, which
  `next build` skips), `npm run check:locales`, the Vitest unit tests
  (`npm test`), `next build`, then `scripts/check-umami.mjs`. Any failure
  stops the build before the deploy command runs, so a broken `main` leaves the
  live site on its last good version. The Umami check runs in Workers Builds
  whenever the id is set, which today means `main` only, and fails a `main`
  build where the id is unset or any page lacks the script. A one-sided locale
  key needs its own check because next-intl renders the key path and
  `next build` succeeds.
- **`npm run deploy`.** Runs `npm run build && wrangler deploy`, the manual path
  to the same Worker. A local `.env` usually carries neither the Umami id nor
  `NEXT_PUBLIC_ALLOW_INDEXING`, and a manual deploy without them ships no
  analytics and a `noindex` site. `.DS_Store` files that end up in `out/`
  stay behind, through `.assetsignore`.

---

## In the dashboard

### Workers Builds

Workers & Pages → `velels` → Settings → Builds. The repo is connected, and every
push to `main` builds and deploys.

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Builds for non-production branches | on |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Version command | `npx wrangler versions upload` |
| Root directory | `/` |

Production and branch builds share the build command. `main` runs the deploy
command. Every other branch runs the version command, which uploads a Worker
version without sending it traffic. Version URLs follow `workers_dev`, which is
`false`, so a branch build has no public URL.

Branch builds get **none** of the build variables (seen on the first one,
2026-10-02). They build `noindex` with no analytics, which is harmless with no
URL. It also means the Umami check runs on `main` only in practice: it skips a
branch build without the id, and fails a `main` build that has no id. If
branch builds ever receive the id, the check runs there too.

Branch builds are how a pull request gets built before its merge deploys
(post-launch T1). Workers Builds posts a check run on each PR commit, and a
GitHub ruleset makes that check required for `main` ("On GitHub" below).

**Never click "Set up Worker Previews"**, the banner at the top of Builds. It
moves the Worker to the newer preview model, and Cloudflare says that cannot be
undone. Under it, previews stop using the production settings, the command must
invoke `npx wrangler preview`, and each branch gets a Preview with its own
public URL: a second copy of the site on the open web. That command also needs
Wrangler 4.135 or later, and the repo pins 4.127. A public copy is why branch
builds stayed off until 2026-10-01, back when `workers.dev` existed.

The free plan allows 3,000 build minutes a month and one build at a time, so a
branch build and a `main` deploy queue behind each other.

### Build variables

All three are set under Builds, and only `main` builds receive them. `next build` inlines every `NEXT_PUBLIC_*` value
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

## On GitHub

A branch ruleset named `main`, under Settings → Rulesets, set
2026-10-02. It targets the default branch and is Active, with an empty bypass
list, so it binds the owner and the developer too.

- Pull request required, with 0 approvals, since nobody can approve their own.
- Status check required: "Workers Builds: velels", from Cloudflare Workers and
  Pages. "Require branches to be up to date" is off, because one build runs at
  a time and it would add a build to every merge.
- Deletions and force pushes blocked.

A direct push to `main` is refused, so every change goes through a PR, small
ones included. GitHub Actions is not used: the account's Actions are locked by
a stale billing flag from a cancelled Copilot subscription, with a balance of
$0.00.

---

## Adding a second Worker

A second Worker, such as the owner preview links in post-launch G8, needs
`"routes": []` in its environment. `routes` is inheritable. Without that line the
new environment inherits the apex Custom Domain, and its first deploy moves
`velels.com` away from production. Wrangler prints a warning about this in the
deploy output, and it is easy to miss.
