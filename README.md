# VELÉLS

The catalogue site for VELÉLS swimwear, live at [velels.com](https://velels.com)
in Ukrainian and English. There is no cart and no order form. A customer picks a
Model, colour and size, and the order button opens Instagram Direct with the
message copied, ready to paste.

It is a static Next.js 16 export (`output: "export"`) with next-intl, Tailwind 4
and Radix, served by Cloudflare as a Worker with static assets only. No server
code runs on a page view.

## Run it locally

You need Node 22, pinned in `.nvmrc`.

```bash
nvm use
npm ci
cp .env.example .env
npm run dev
```

The site runs at http://localhost:3000 and sends `/` on to `/uk`.

`npm run build` runs every check a deploy runs: lint, the type check, the locale
check, the unit tests, `next build` and the Umami check. Any failure stops a
deploy, so run it before you open a pull request. The built site lands in
`out/`.

## How a change ships

1. Make a branch and open a pull request. `main` is protected, so a pull request
   is the only way in.
2. Cloudflare Workers Builds builds the branch and posts two things on the pull
   request: a check that has to pass before merging, and a preview link,
   `<branch>-velels.datngn11.workers.dev`. Open the link on a phone, since most
   customers use one. Preview pages say `noindex` and load no analytics.
3. Merge. Cloudflare builds `main` and deploys it to velels.com a few minutes
   later.

Don't use `npm run deploy` unless Workers Builds is down. It deploys from your
machine with whatever your `.env` holds, and without the variables below the
live site goes `noindex` with no analytics.

[`docs/cloudflare-setup.md`](docs/cloudflare-setup.md) records the dashboard
settings behind all this.

## Build variables

Three variables, set in the Cloudflare dashboard under the Worker's Settings →
Builds → Variables and secrets. Only `main` builds receive them. `next build`
writes each value into the HTML, so a change reaches the site with the next
build.

| Variable | What it does | When it is missing |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | The origin used in canonicals, share previews and the sitemap | The code uses `https://velels.com` |
| `NEXT_PUBLIC_ALLOW_INDEXING` | `true` lets search engines index the site | Every page says `noindex` |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | The site id from the Umami dashboard | No analytics load. A `main` build fails rather than ship without it |

Never put them under the Worker's own Variables and Secrets. Those are runtime
variables, this Worker runs no code, and a value there does nothing.

## Photos and video

The repo holds only the files the site serves, in `public/products/` and
`public/hero/`. The originals are not in it: the owner's HEIC photos of each
Model, and the master of the phone hero video, `hero_mobile_master.MP4`. The
owner has the photos, and the developer keeps a copy of both.

## Before you change anything

- [`AGENTS.md`](AGENTS.md) has the project rules and a list of things not to
  build.
- [`CONTEXT.md`](CONTEXT.md) is the glossary. An Order Request is not an Order.
- [`docs/post-launch-checklist.md`](docs/post-launch-checklist.md) is the task
  list.
- [`docs/cloudflare-setup.md`](docs/cloudflare-setup.md) covers hosting and
  deploys.

Two rules get broken most often. There is no stock: every garment is sewn after
the order, so never add stock counts or sold-out states. And
`prefers-reduced-motion` applies to JavaScript as well as CSS.
