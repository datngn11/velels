# SEO plan for velels.com

Written 2026-10-30 from Google's own documentation, the Search Console and
Umami exports of 2026-10-30, a check of the live site, and a second audit
checked against the code the same day. Items chosen from here move into
`docs/post-launch-checklist.md`, which stays the only task list.

## 1. Where we stand

Search Console, last 3 months to 2026-10-27:

| Measure | Value |
| --- | --- |
| Pages in the sitemap | 50, all fetched successfully |
| Indexed | 37 (18 at launch, 33 the day after the indexing requests) |
| Discovered, not yet indexed | 7. Google knows them and has not fetched them yet |
| Excluded by `noindex` | 6. Every live page is clean, so this is an old copy from before indexing was switched on |
| Clicks from Google | 3, and one came from Vietnam, so probably the developer |
| Impressions | about 375, 335 of them in Ukraine |
| One-piece category page | 181 impressions, average position 62 |
| Two-piece category page | 132 impressions, average position 63 |
| Ukrainian dresses category page | no impressions |
| Product snippets | 16 impressions, so the product structured data works |
| Devices on Google | 277 desktop, 92 mobile. Instagram traffic is the opposite |

Every top query is generic and Ukrainian: «купальник суцільний», «купити
роздільний купальник» and their variants. The category pages built in G3
started appearing for them on 2026-10-13, but at position 60, which is page 6.
Searches for the brand name find `/uk` around position 6 and `/en` around 1.

The category result looks plain for two reasons:

- **No photo.** The category pages carry no structured data, and their share
  image is the generic homepage photo, so Google has no representative image to
  show.
- **Plain text under the title.** Google ignored our description and quoted the
  page itself: the heading, then each card's name and price. The page has no
  other text to quote, and the heading is the short tab label, «Роздільні
  купальники», not the page's title, «Жіночі роздільні купальники».

## 2. What Google recommends

Only what applies to a small catalogue that sells through Instagram.

- **Links decide what Google finds and what it treats as important.** "The vast
  majority of the new pages Google finds every day are through links"
  ([SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)).
  For shops: link "from menus to category pages", then "to all product pages",
  and link what matters from the home page
  ([ecommerce site structure](https://developers.google.com/search/docs/specialty/ecommerce/help-google-understand-your-ecommerce-site-structure)).
- **Snippets come from the page.** They are "primarily created from the page
  content itself". The meta description is used only when it describes the page
  better, and a good one brings together details like price
  ([snippets](https://developers.google.com/search/docs/appearance/snippet)).
- **The thumbnail can be steered.** Name a preferred image through
  `primaryImageOfPage`, the main entity's `image`, or `og:image`, and avoid
  generic images like a logo
  ([Google Images](https://developers.google.com/search/docs/appearance/google-images)).
- **Breadcrumb data** replaces the address line with readable names on desktop.
  Since January 2025 mobile results show the domain only
  ([breadcrumbs](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb),
  [announcement](https://developers.google.com/search/blog/2025/01/simplifying-breadcrumbs)).
- **Site name** comes from `WebSite` structured data on the domain's home page,
  with `url` set to that home page. A locale path such as `/uk` is not a home
  page. It can take weeks to update
  ([site names](https://developers.google.com/search/docs/appearance/site-names)).
- **Product data:** product snippets are for "product pages where people can't
  directly purchase the product". Merchant listings are for pages where
  customers buy from you
  ([product structured data](https://developers.google.com/search/docs/appearance/structured-data/product)).
  Velels sells through Direct, so product snippets are the right fit today.
- **Content quality beats tricks.** Original, useful content counts most. Word
  count does not matter, meta keywords are ignored, and E-E-A-T is not a ranking
  factor ([SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide),
  [helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)).
- **Speed counts, but relevance comes first.** Core Web Vitals "are used by our
  ranking systems", yet Google shows the most relevant page "even if the page
  experience is sub-par" ([page experience](https://developers.google.com/search/docs/appearance/page-experience)).
- **Never buy links**, exchange them in bulk, or mass-produce pages for search.
  All three are spam ([spam policies](https://developers.google.com/search/docs/essentials/spam-policies)).
- **Sitemaps:** Google ignores `priority` and `changefreq`, and uses `lastmod`
  only when it is "consistently and verifiably" accurate
  ([sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)).

## 3. How velels.com measures up

| Area | State | Evidence |
| --- | --- | --- |
| Indexing, canonicals, hreflang | Good | All 50 sitemap URLs return 200, no `noindex`, self canonical. English pages indexed on their own |
| Titles | Good | Unique and descriptive, «Lunar, курортна сукня — VELÉLS» |
| Product structured data | Good | Brand, 13 images, price, `MadeToOrder`, return policy, shipping |
| Image alt text and formats | Good | Descriptive alts, and Google supports WebP. The three photos measured are 1167–1400 px wide |
| **Links to category pages** | **Weak** | The menu's category links are not in the HTML until someone opens the menu. Of the pages checked, only `/uk/catalog` links to the 3 categories. The homepage, product pages and info pages link to none |
| **Product pages link nowhere** | **Weak** | The breadcrumb goes to «Колекція» (`/uk/catalog`), not to the product's category. No links to other Models. The 2026-10-29 audit calls these dead ends too |
| **Category page image** | **Missing** | Share image is `og/home.jpg`. No structured data at all |
| **Category page text** | **Thin** | A heading and the cards. Google quotes names and prices |
| **Category page heading** | **Short** | The `<h1>` is the tab label («Сукні»), while the title says «Курортні сукні з мережива» |
| Site name | Shows "velels.com" | `WebSite` data has `url` set to `https://velels.com/uk`, not the domain root |
| Breadcrumb data on category pages | Missing | Product pages have it, category pages do not |
| Page speed | Good on real phones | Umami, p75 of the main image on phones: home 0.79 s, products 0.85 s, catalogue 0.99 s (14 samples). Google's "good" is under 2.5 s. Full-size photos still cost data, tracked as P1 (blocked on B9) |
| Unused downloads | Waste | Every page preloads 2 files of a font used nowhere (58 KB) and a 50 KB logo shown at 128×48. The first catalogue photos are set to load late |
| Links from other sites | Not checked yet | Search Console's Links report lists them. Instagram marks its links `nofollow`, so they bring visitors rather than ranking |

## 4. The plan

### Phase 1. Code only, no owner input (about 1 day)

1. **Category links in every page's HTML.** Add a «Колекція» column to the
   footer with the 3 category pages and «Усі». Every page then links to every
   category, which is the structure Google asks for. On a phone the columns
   stack, so it is one more short column at the bottom of the page. On desktop
   the grid holds two columns in 560 px and needs widening for a third.
   *Effect: the biggest of this phase. It tells Google the category pages
   matter, and helps the 7 waiting pages get fetched.*
2. **Product breadcrumbs point to the category.** «VELÉLS › Роздільні
   купальники › Lauri», both visible and in the structured data. Each of the 11
   product pages then links to its category.
3. **A photo for each category page.** Name one photo per category as
   `og:image`, add `CollectionPage` data whose `primaryImageOfPage` is that
   photo, and add breadcrumb data (data only: the page already shows the way
   back). Don't list the products in it: `Product` entries without prices
   would put an error on all 6 category pages in Search Console's Product
   snippets report. Also fixes shared category links in Telegram and
   Instagram, which show the homepage photo today.
4. **Site name.** Point the `WebSite` data's `url` at `https://velels.com/` and
   add `alternateName: "Velels"`, the spelling people type. With one url for
   both languages, drop `inLanguage`, or the two homepages would call one
   address both Ukrainian and English. Put the same `WebSite` data on `/` too:
   it is the bio link, and Google asks for the same data on every copy of the
   home page. Point `Organization`'s `url` at the root as well. Not
   guaranteed, and it can take weeks.
5. **The category's full name as its heading.** «Жіночі роздільні купальники»
   instead of «Роздільні купальники», «Курортні сукні з мережива» instead of
   «Сукні». The names already exist as each category's title
   (`categoryPages.*.title`), and Google quotes the heading in the result.
   Customers see it, and on a phone the dresses heading may take two lines.
   `AGENTS.md` also wants `.text-display-md` in place of the heading's raw
   size classes, but that changes the look on a phone (30 px to 28 px, tight
   letter spacing to wide). Compare screenshots before switching.
6. **Stop downloading what pages don't use.** Remove Cormorant Garamond from
   `src/app/layout.tsx`, and its `--font-logo` line from `globals.css`: it is
   used nowhere, yet every page preloads two of its files (58 KB). Drop
   Bodoni's `latin-ext` subset too (14 KB): the only character from that range
   on the site is ₴, and prices are set in Inter. Load the first two catalogue
   photos straight away instead of late.
   *Effect: about 70 KB less on every first visit. Ranking won't move, since
   phone speed is already good.*

### Phase 2. Copy the owner approves (about half a day)

7. **One intro sentence on each category page**, under the heading. It gives
   Google a sentence worth quoting and helps ranking a little. Drafts:
   - Суцільні: «Архітектурні вирізи, відкрита спина, закриті фасони та
     модель-трансформер. Шиємо кожен купальник на замовлення.»
   - Роздільні: «Ліф на кісточках, трикутник або формована чашка, трусики на
     високій талії. Шиємо кожен купальник на замовлення.»
   - Сукні: «Мереживо Chantilly для відпустки, вечора біля моря й особливих
     подій. Шиємо кожну сукню на замовлення.»

   On a phone this adds about two lines above the products. For the dresses,
   the owner can also use words people type, such as «мереживна сукня» or
   «пляжна сукня», where they are true of the Models. Search Console shows no
   dress searches yet, so which words matter is not known.
8. **Category descriptions with the starting price**, worked out from the
   product data so it stays true: «…від 2 700 ₴». Google may still write its own
   snippet.

### Phase 3. Outside the code (owner and developer, ongoing)

9. **Search Console.** Click Validate fix on the `noindex` row now, and look at
   the Links report to see which sites already link to velels.com. Then once a
   month: indexed count, the impressions and position of the 3 category pages,
   and the Product snippets and Breadcrumbs reports.
10. **Earn links from Ukrainian sites.** Fashion media regularly publish
    roundups of Ukrainian swimwear brands. Being in one gives a strong, relevant
    link. Collaborations with bloggers who have their own site help the same way.
    Never pay for links.
11. **Keep velels.com in every profile** (Instagram, Telegram). This brings
    visitors, not ranking.
12. **A smaller logo file.** `public/logo_black.png` is 1326×499 (50 KB), shown
    at 128×48 and preloaded on every page. The owner sends an SVG, or a PNG
    about 384 px wide, and the code swaps it in. Saves about 45 KB per first
    visit.

### Phase 4. Later, or blocked

13. **Faster photos** (P1, blocked on B9). Helps Core Web Vitals and the phone
    experience.
14. **Other Models on each product page.** «Інші моделі» or the mix-and-match
    pairs (Lauri with Naevi) the audit mentions. More internal links and fewer
    dead ends, but it is a design change, so it needs the owner. A first step
    needs no design: Lauri's and Naevi's details already name each other, so
    those names can become links.
15. **Descriptive photo file names** (`lauri-white-1.webp`) when P4 re-exports
    the set. A small help for Google Images, not worth renaming files on its
    own.
16. **Merchant listings and Google Shopping**, once the order form (G6) lets
    customers buy on the site.

## 5. Not doing, and why

| Not doing | Why |
| --- | --- |
| Review stars | The owner dropped reviews (`AGENTS.md`), and review data needs real reviews |
| Google Business Profile | A profile needs a place customers visit or a business that travels to them ([eligibility](https://support.google.com/business/answer/3038177)). Velels ships by Nova Poshta |
| Blog posts written for search | Google warns against content made mainly to attract search visits. Write one only if it would help a customer anyway, such as how to choose a swimsuit size |
| Buying links, link exchanges | Spam under Google's policies |
| Meta keywords, repeating keywords | Google ignores the first and penalises the second |
| Sitemap `priority`, `changefreq`, `lastmod` | Google ignores the first two. We have no true per-page change date for the third |
| Pages for Google Shopping now | Merchant listings are for pages where customers can buy. Revisit with the form |
| FAQ structured data | Google stopped showing FAQ results on 2026-05-07 ([FAQPage](https://developers.google.com/search/docs/appearance/structured-data/faqpage)) |
| Responsive `sizes` on photos | No effect today: with `images.unoptimized` each photo is one file with no `srcset`. Belongs to image optimisation in the full plan |
| `x-default` in the sitemap | Every page already declares it in its head |
| Language switcher as links | Google finds the English pages through hreflang, and Search Console shows them indexed |
| Hero photo preload | The photo is already in the HTML with high priority, and the home page shows it in 0.79 s on phones |
| `robots` tag on the 404 page | The page is served with a real 404 status and already says `noindex` |
| Width and height of product share images | Telegram and Instagram previews were checked on 2026-10-14 and work |
| Twitter/X tags, `theme-color`, `og:locale:alternate` | Google ignores them, and customers don't share to X |
| Refactors: one metadata builder, a `JsonLd` component, `@id` links, per-page translations, a server-rendered hero | Tidier code, no change in search |
| «купальник» and the price in product descriptions | Every product title already names the category («Dimaya, суцільний купальник»), and Google shows the price from the product data |
| Resizing the logo ourselves | Brand files come from the owner (item 12) |

## 6. How we will know it worked

Check in Search Console at the end of November, and again at the end of
December. Compare with the baseline in section 1:

- Indexed pages: from 37 toward 50.
- Category page average position: from about 62 toward the first two pages.
- A photo beside the category result, on phone and desktop.
- "VELÉLS" instead of "velels.com" above the result.
- Clicks from Google: from 3 in 5 weeks to something countable.

Google re-reads the pages over days to weeks, so judge after a month, not a
week.
