# Telehealth Storefront — One Combined Store (+ 5 separate brand sites)

Static storefront sites. Each one looks and behaves like a real ecommerce store, but
**checkout happens elsewhere**: every Buy / Shop button fires a tracking event and then
redirects to that product's page on your real Shopify store.

**No build step. No Node. No server.** Every page is a plain `.html` file. Zip a folder,
upload it to cPanel/FTP, done.

---

## ⭐ `everwell/` — the combined store (this is the one you asked for)

**One site. One brand. All 30 products. Six categories.**

| | |
|---|---|
| Folder | `everwell/` |
| Products | 30 |
| Categories | Men's Health (5), Skincare (5), Weight Management (5), Daily Supplements (5), Sleep & Calm (5), Bundles (5) |
| Price range | $22 – $104 |
| Palette | Deep teal accent on white, Plus Jakarta Sans + Inter |
| Pages | 11 — home, shop, product, about, FAQ, contact, 4 legal, 404 |

The five niche brands became **categories** inside this one store. The homepage has a
"Shop by need" tile row; clicking a tile opens the shop pre-filtered
(`shop.html?category=Skincare`) with a removable filter chip.

**The store name "Everwell" is a placeholder.** Change it in `everwell/js/brand-config.js`.

### Category pages

Every category has its **own real HTML page**, not just a filtered view:

| Category | Page | Products |
|---|---|---|
| Men's Health | `mens-health.html` | 5 |
| Skincare | `skincare.html` | 5 |
| Weight Management | `weight-management.html` | 5 |
| Daily Supplements | `daily-supplements.html` | 5 |
| Sleep & Calm | `sleep-calm.html` | 5 |
| Bundles | `bundles.html` | 5 |

Each has its own `<title>`, meta description, intro paragraph, three "good to know" points,
its products with sorting, and links to the other categories. Clean URLs like `/skincare.html`
make far better Shopping-ad landing pages than `shop.html?category=Skincare`.

The header **Shop** dropdown, the homepage tiles and the footer all link to these pages
automatically — they read `BRAND.categoryPages` in `brand-config.js`.

Category intro copy and the three points live in `_tools/merged.js` under `categoryContent`.
Edit there and re-run `node _tools/generate.js everwell`.

> **Renaming a category** changes its filename. The old `.html` file is not deleted
> automatically — remove it by hand so a stale page doesn't stay live.

### Run it

```bash
python -m http.server 8000
# then open http://localhost:8000/everwell/
```

Or just double-click `everwell/index.html`.

---

## The 5 separate brand sites (optional — kept as an alternative)

These were built first, before the switch to one combined store. They still work, and the
combined store is generated from their product data. **If you only want the one site, you can
delete these five folders** — nothing in `everwell/` depends on them at runtime.

### The five brands

| Folder | Niche | Accent | Fonts | Card style |
|---|---|---|---|---|
| `vitality-rx/` | Men's daily health | Teal on navy | Sora + Inter | Bordered, pill buttons |
| `lumen-skin/` | Skincare | Terracotta on warm sand | Fraunces + DM Sans | Flat, square corners |
| `balance-co/` | Weight management | Sage green | Outfit + Karla | Elevated, soft/round |
| `nova-daily/` | Daily supplements | Amber on ivory | Playfair Display + Manrope | Bordered, small radius |
| `clearpath/` | Sleep & calm | Indigo on cool grey | Plus Jakarta Sans + Source Sans 3 | Elevated, pill buttons |

They share structure and code but not palette, type, corner radius, hero copy, product range or
brand story — so they don't read as five copies of one template.

---

## Preview locally

**Easiest:** double-click any brand's `index.html`. Everything works from `file://`, including
`product.html?p=daily-foundation`.

**Slightly better** (correct relative paths, no browser quirks) — any one of these:

```bash
npx serve vitality-rx            # if you have Node
python -m http.server 8000       # then open http://localhost:8000/vitality-rx/
```

**Cache note:** CSS and JS are linked with a `?v=<hash>` fingerprint that changes whenever those
files change, so browsers pick up updates automatically. If a page ever looks broken right after
an edit, hard-refresh once (**Ctrl+Shift+R**) — that clears a stale cached HTML file.

**Dev aid:** append `?showplaceholders=1` to any URL to outline every block containing dummy
content in orange. Example: `index.html?showplaceholders=1`.

---

## Folder structure

```
ecom site/
├── README.md                ← you are here
├── _shared/                 ← MASTER copies. Never uploaded to hosting.
│   ├── css/base.css             the design system, identical in every site
│   ├── js/{site,theme-init,tracking}.js
│   ├── partials/{head,header,footer}.html
│   └── pages/*.html             page bodies with {{tokens}}
├── _tools/                  ← DEV ONLY. Never uploaded. Never needed to deploy.
│   ├── brands.js                the 5 niche brand definitions
│   ├── merged.js                the COMBINED store (categories, featured, palette)
│   ├── legal.js                 placeholder legal copy
│   ├── images.js                placeholder image generator
│   ├── generate.js              scaffolds the brand folders
│   └── sync.js                  pushes shared css/js to all 5 brands
│
├── everwell/                ← ⭐ THE COMBINED STORE. Upload this one.
│   └── (same layout as below, 30 products, 6 categories)
│
├── vitality-rx/             ← optional separate brand site
│   ├── index.html  shop.html  product.html  about.html  faq.html  contact.html
│   ├── privacy-policy.html  terms-of-service.html
│   ├── shipping-refund-policy.html  medical-disclaimer.html  404.html
│   ├── css/
│   │   ├── base.css             shared design system — same in every brand
│   │   └── brand.css            this brand's colour/font tokens
│   ├── js/
│   │   ├── brand-config.js      ★ THE ONLY FILE YOU EDIT
│   │   ├── theme-init.js        applies brand colours before first paint
│   │   ├── site.js              renders products, filters, accordions, etc.
│   │   └── tracking.js          ad pixels — inert until you add IDs
│   ├── images/
│   │   ├── logo.svg  logo-light.svg  hero.svg  about.svg  about-2.svg
│   │   ├── og-default.png       social/ad share image (1200x630)
│   │   └── products/*.svg       one per product + 3 extra gallery angles
│   ├── favicon.svg  robots.txt  sitemap.xml
│
├── lumen-skin/   balance-co/   nova-daily/   clearpath/     (identical layout)
```

**Only a site folder gets uploaded** — for the combined store that is `everwell/` alone.
`_shared/` and `_tools/` are how the folders were built and kept in sync; hosting never sees them.

---

## ★ The one file you edit: `js/brand-config.js`

Everything variable about a brand lives in this single file. It defines four things:

```js
var BRAND = { name, tagline, announcement, logo, colors, style, contact,
              disclaimer, tracking, seo, heroProof, valueProps, howItWorks,
              trustBadges, productReassurance, values, stats, aboutPoints };

var PRODUCTS = [ { slug, name, sku, category, price, compareAt, benefits,
                   ingredients, image, gallery, checkoutUrl, ... } ];

var TESTIMONIALS = [ { name, meta, rating, quote } ];

var FAQS = [ { q, a } ];
```

Change `BRAND.name` and it updates in the header, footer, page copy, meta tags and structured
data. Change `BRAND.colors.accent` and every button, badge, icon and link changes with it —
applied before first paint, so there's no flash of the old colour.

### Adding or removing a product

Add an object to `PRODUCTS`. That's the whole job — it appears in the shop grid, gains a working
product page at `product.html?p=<slug>`, joins the category filter, and shows up in "you might
also like". No new HTML file, no other edit.

Drop a photo at `images/products/<slug>.svg` (or `.jpg` — just update the `image` path).

---

## Plugging in the real Shopify links

This is the single integration point with your Shopify stores. In `js/brand-config.js`, every
product has:

```js
checkoutUrl: 'https://example-shopify-store.myshopify.com/products/daily-foundation'
```

Replace each one with the real product URL:

```js
checkoutUrl: 'https://vitalityrx.com/products/daily-foundation'
```

Find them all at once:

```bash
grep -rn "example-shopify-store" .          # Mac/Linux
findstr /s /n "example-shopify-store" *.*   # Windows
```

Nothing else changes. Every "Shop now", "Buy now" and the sticky mobile bar all route through
one function (`Site.goToCheckout`) which reads `checkoutUrl`, fires the tracking event, and
navigates **in the same tab** — the way a normal checkout hand-off behaves.

Until you replace them, clicking a buy button logs a console warning naming the product, so a
missed link is loud rather than silent.

---

## Where the placeholder content lives

Everything fake is tagged `[[PLACEHOLDER: ...]]`. Find all of it:

```bash
grep -rn "PLACEHOLDER" vitality-rx/          # Mac/Linux
findstr /s /n "PLACEHOLDER" vitality-rx\*    # Windows
```

Roughly 190–200 hits per brand. They fall into five groups:

| What | Where |
|---|---|
| Product names, prices, benefits, ingredients | `js/brand-config.js` → `PRODUCTS` |
| Testimonials (all fictional) | `js/brand-config.js` → `TESTIMONIALS` |
| FAQ answers | `js/brand-config.js` → `FAQS` |
| Page copy — hero, about story, section headings | directly in the `.html` files |
| **Legal text — all four pages** | `privacy-policy.html`, `terms-of-service.html`, `shipping-refund-policy.html`, `medical-disclaimer.html` |

### The legal pages

All four carry a visible amber banner reading **"PLACEHOLDER — replace with reviewed legal copy
before launch."** The text below it is generic filler written to show page structure. It is not
legal advice and has not been reviewed by anyone. Replace it with copy prepared for your
jurisdiction before you accept an order or run an ad — health/wellness ad review looks at these
pages specifically.

The master copies live in `_tools/legal.js` if you'd rather edit once and regenerate all five.

### Images

Every image is a **generated illustration**, not a photograph. Products are drawn in the pack
shape their name implies (bottle, dropper, jar, tube, pouch, tin, box, sleep mask, bundle) and
tinted by category, so a 30-product grid reads like a real catalogue. Each file carries a
`[[PLACEHOLDER IMAGE]]` comment and a small caption.

#### Dropping in real photography

Put a file in `_photos/<site>/` and it replaces the illustration on the next build. Nothing else
to change — the build rewrites the paths in `brand-config.js` and the HTML for you.

```
_photos/everwell/
├── daily-foundation.jpg     ← must match the product slug
├── hero.jpg                 ← 1200 x 1020
├── about.jpg   about-2.jpg  ← 800 x 600
├── og-default.jpg           ← 1200 x 630
└── logo.png
```

Accepted: `.jpg` `.jpeg` `.png` `.webp` `.avif`. Products should be **square**, 1000px or larger.

```bash
node _tools/generate.js everwell     # prints how many real photos it picked up
```

Add photos one at a time — anything without a matching file keeps its illustration.
`_photos/` is dev-only and never uploaded. Full guide in `_photos/README.md`.

#### Where to get images you may legally use

Photograph the real products (best — your Shopify listings need the same shots anyway), or use
**Unsplash / Pexels / Pixabay** (free, commercial use) or paid stock with a commercial licence.

> Do not reuse photography from competitor sites. Product photography is copyrighted; it risks a
> takedown, and Google Merchant Center and Meta both reject listings using imagery the seller
> does not own — which would take the ad account down with it.


---

## What's duplicated across pages

There's no templating engine, so these blocks are **copy-pasted identically into all 11 HTML
files** in a brand. If you hand-edit one, edit all eleven:

| Block | Marked by | Appears in |
|---|---|---|
| `<head>` — meta, OG tags, script tags | top of file | all 11 pages |
| Announcement bar + header + mobile nav | `<!-- ===== HEADER ... ===== -->` | all 11 pages |
| Footer + disclaimer + legal links | `<!-- ===== FOOTER ... ===== -->` | all 11 pages |

Each block is fenced with a comment naming its master file, so a find-and-replace across
`*.html` is reliable.

**Product card markup is not duplicated** — it's generated once by `Site.productCard()` in
`js/site.js`, so changing a card changes it everywhere in that brand.

### Keeping the five brands in sync

`css/base.css` and `js/{site,theme-init,tracking}.js` are **byte-identical in all five brands**.
After editing the master copy in `_shared/`:

```bash
node _tools/sync.js
```

This copies those four files into all five folders and touches nothing else — not
`brand-config.js`, not `brand.css`, not your images, not your HTML.

**No Node?** Copy the four files by hand. Identical files, plain copy-paste, same result.

To regenerate the HTML too (after editing `_shared/partials/` or `_shared/pages/`):

```bash
node _tools/generate.js               # everything (combined store + 5 brand sites)
node _tools/generate.js everwell      # just the combined store
node _tools/generate.js clearpath     # just one brand site
```

The combined store is defined in `_tools/merged.js` — that file controls which category each
product lands in, which 8 products are featured on the homepage, and the store's colours and
copy. Editing it and re-running `generate.js` rebuilds `everwell/` — but note it will **not**
overwrite `everwell/js/brand-config.js` once that exists, so your product edits are safe.

`generate.js` **never overwrites `js/brand-config.js`** once it exists — your data is safe. Pass
`--force-config` only if you deliberately want to reset a brand to defaults.

---

## Deploying to shared hosting

1. Open the brand folder (e.g. `vitality-rx/`).
2. Zip **the contents**, not the folder itself — `index.html` must land in the web root.
3. In cPanel → File Manager, upload to `public_html/` and extract. Or drag the folder contents
   over by FTP.
4. Visit the domain. That's it.

Hosting one brand per domain is the normal case. For a subfolder (`example.com/brand/`)
everything still works — all paths are relative.

**Custom 404:** add this line to `.htaccess` in the web root (Apache/cPanel):

```apache
ErrorDocument 404 /404.html
```

---

## Making the contact form actually send

`contact.html` validates input and shows a confirmation, but **sends nothing** — static hosting
has no server to receive a POST. Two options:

**A. A form service** (easiest, free tiers exist — Formspree, Web3Forms, Basin). Sign up, get an
endpoint URL, then in `contact.html` change:

```html
<form class="form" id="contact-form" novalidate>
```
to
```html
<form class="form" id="contact-form" action="https://formspree.io/f/YOUR_ID" method="POST">
```

and delete the `initForms` submit handler's `ev.preventDefault()` line in `js/site.js`, or just
remove `id="contact-form"` so the script leaves the form alone.

**B. cPanel PHP.** Shared hosting almost always has PHP even without Node. Write a small
`contact.php` mail handler and point `action="contact.php"` at it.

---

## Tracking and ad pixels

All pixel code lives in **one file per brand**: `js/tracking.js`. It reads IDs from
`BRAND.tracking` in `brand-config.js` and **nothing loads or fires until you enable it**:

```js
tracking: {
  enabled: true,                         // ← flip this last
  ga4MeasurementId: 'G-XXXXXXXXXX',
  googleAdsConversionId: 'AW-XXXXXXXXX',
  googleAdsConversionLabel: 'abcDEFghi',
  metaPixelId: '123456789012345'
}
```

Once enabled you get: GA4 + Google Ads tag, Meta Pixel, a `page_view` push on every page, a
`view_item` push on product pages, and — the important one —

**Outbound click conversion.** Because the purchase happens on a domain this site can't see, the
click to Shopify is the last event you control. Every buy button pushes
`begin_checkout_outbound` to `dataLayer`, fires Meta's `InitiateCheckout`, and fires a Google Ads
conversion if you've set a conversion label — *then* redirects. A 350ms timeout guarantees the
redirect happens even if a pixel is blocked or slow, so tracking can never eat a click.

Set the Google Ads conversion action to **click**-based to receive it.

---

## SEO notes

- **Every page currently carries `<meta name="robots" content="noindex, nofollow">`, and
  `robots.txt` blocks all crawling.** That's deliberate — placeholder content with fictional
  reviews should not be indexed. **Remove both before launch** (search for `noindex` across the
  brand folder, and swap the commented block in `robots.txt`).
- `sitemap.xml` lists every page including each product URL. Replace the placeholder domain.
- Canonical + Open Graph tags are set per page. Update the `DOMAIN` in `_tools/brands.js` and
  regenerate, or find-and-replace the placeholder domain across the HTML.
- Product structured data (JSON-LD) is injected on `product.html` from `PRODUCTS`.
- FAQPage structured data is emitted on `faq.html` from `FAQS`.
- **`aggregateRating` is deliberately switched off** (`BRAND.seo.emitAggregateRating: false`).
  The star ratings you see on the page are placeholder numbers. Publishing invented ratings in
  structured data is how Merchant Center accounts get suspended. Turn it on only once a real
  review source supplies the numbers.

---

## Decisions worth knowing about

**Product pages use `product.html?p=<slug>`, not one file per product.** This keeps the promise
that adding a product means editing one data file. The trade-off: Meta/Slack/WhatsApp link
preview scrapers don't run JavaScript, so sharing a *product* link socially falls back to the
site-wide OG image rather than the product's own. Google renders JS and reads the product schema
fine, and Google Ads handles query-param destinations routinely. If rich per-product social
previews become important, the fix is a static HTML file per product with baked meta tags.

**Brand name and colours exist in two places.** `brand-config.js` is the live source and
overrides everything before first paint. `brand.css` and the HTML carry the same values baked in
as a fallback, so crawlers and JS-disabled browsers still see a real brand rather than blanks.
Editing only `brand-config.js` genuinely works — the baked values just stop matching. When you
finalise the name, find-and-replace it across the folder to keep the two honest.

**No cart.** The header cart icon links to the shop page. Checkout is Shopify's job. If you'd
rather not show a cart icon at all, delete the `.icon-btn` anchor from the header block.

---

## Before you spend money on ads

- [ ] Real product photography replacing every placeholder SVG
- [ ] Every `checkoutUrl` pointing at a real, live Shopify product page
- [ ] All four legal pages replaced with lawyer-reviewed copy
- [ ] Testimonials replaced with real, attributable reviews **or the section deleted**
- [ ] Real logo at `images/logo.svg` and `images/logo-light.svg`, real favicon
- [ ] `og-default.png` replaced with a real 1200x630 branded image
- [ ] `grep -rn "PLACEHOLDER"` returns nothing
- [ ] `noindex` removed from all 11 pages, `robots.txt` switched to the launch block
- [ ] Real domain in `sitemap.xml`, canonical tags and OG URLs
- [ ] Tracking IDs entered and `tracking.enabled = true`, verified with Google Tag Assistant
- [ ] Contact form wired to a real endpoint
- [ ] Tested on a real phone, not just a resized desktop browser

### Two policy checks that could change the architecture

**1. Healthcare ad policy.** Google Ads and Meta both restrict prescription medication,
weight-loss and mental-health advertising by category, and some need certification (Google
requires LegitScript certification for online pharmacies and certain telehealth advertisers).
Check the policy for your exact product category before building campaigns.

**2. Destination mismatch.** This is the one specific to how these sites are built. A site whose
purpose is to send visitors to a *different* domain to buy is close to what Google Ads' bridge
page / destination mismatch policies target, and Shopping ads generally expect the landing domain
and the selling domain to match. Worth confirming with each platform before spend — if it turns
out the checkout has to live on the same domain, the change is contained: `checkoutUrl` in
`brand-config.js` is the only integration point, so it's a data edit, not a rebuild.
#   e c o m 
 
 