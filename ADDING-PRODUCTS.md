# Adding a product

Everything happens in **one file**: `everwell/js/brand-config.js`.

Open it, find `var PRODUCTS = [`, and add an object to the array. That is the
whole job — the product appears in the shop grid, the category filters, its
category page, the mega menu counts, "you might also like", and it gets its own
page at `product.html?p=<slug>`. Nothing else to touch.

> **Add it at the END of the array, not the top.** Category order in the menu
> and the homepage tiles follows the order categories first appear in
> `PRODUCTS`. Inserting at the top moves that product's category to first place.

---

## Copy this block

Paste it as the last item in `PRODUCTS` (mind the comma after the previous `}`):

```js
  {
    "slug": "zinc-daily",
    "name": "Zinc Daily",
    "sku": "EVERWELL-ZINCDAILY",
    "category": "Daily Supplements",

    "shortBenefit": "A simple one-a-day, third-party tested.",
    "description": "Longer copy for the product page. Keep it factual.",
    "metaDescription": "Zinc Daily from Everwell. Shown in search results.",

    "price": 24,
    "compareAt": 30,
    "priceNote": "per 30-day supply",

    "rating": 4.6,
    "reviewCount": 128,
    "badge": "New",
    "featured": false,

    "optionLabel": "Supply",
    "options": ["1 month", "3 months"],

    "benefits": [
      "One tablet daily",
      "Third-party tested",
      "60 tablets per bottle"
    ],
    "ingredients": ["Ingredient one", "Ingredient two"],
    "howItWorks": "Take as directed on the label.",

    "image": "images/products/zinc-daily.svg",
    "gallery": [
      "images/products/zinc-daily.svg",
      "images/products/_angle-daily-supplements-2.svg",
      "images/products/_angle-daily-supplements-3.svg",
      "images/products/_angle-daily-supplements-4.svg"
    ],
    "imageAlt": "Zinc Daily",

    "checkoutUrl": "https://yourstore.com/products/zinc-daily"
  }
```

### What each field does

| Field | Notes |
|---|---|
| `slug` | The URL: `product.html?p=zinc-daily`. Lowercase, hyphens, must be unique. |
| `sku` | Only used in tracking events and Product schema. Any unique string. |
| `category` | **Must match an existing category exactly**, including the apostrophe in `Men's Health`. A new value needs the extra step below. |
| `shortBenefit` | The one line under the product name on cards. |
| `price` / `compareAt` | Numbers, no currency symbol. `compareAt` higher than `price` produces the `-20%` badge and the "Save" pill. Set it to `null` for no discount. |
| `rating` / `reviewCount` | Shown as stars. Placeholder until a real review source exists. |
| `badge` | Corner label: `"New"`, `"Best seller"`, or `null`. |
| `featured` | `true` puts it in the homepage "Best sellers" row. |
| `options` | Presentational only — the real variant choice happens on Shopify after the redirect. |
| `image` / `gallery` | See images below. |
| `checkoutUrl` | **The Shopify link.** This is the only integration point. |

---

## The image

Three ways, easiest first.

**1. Reuse an existing illustration** — point `image` at any file already in
`everwell/images/products/`. Fine for testing.

**2. Drop in a real photo (no Node needed)** — put a square photo at
`everwell/images/products/zinc-daily.jpg` and set
`"image": "images/products/zinc-daily.jpg"`. Square, 1000px or larger; the
layout crops from the centre.

**3. Generate an illustration to match the rest** — put the product in
`_tools/merged.js` instead (see below) and run the generator.

For `gallery`, the `_angle-*` files already exist per category. Use the ones
matching your category:

```
_angle-mens-health-2.svg        _angle-daily-supplements-2.svg
_angle-skincare-2.svg           _angle-sleep-calm-2.svg
_angle-weight-management-2.svg  _angle-bundles-2.svg
```
(and `-3`, `-4` of each)

---

## Adding a product in a NEW category

A new category needs its own page, so this one goes through the generator:

1. Add the product to `_tools/merged.js` under `products`
2. Add the category name to `CATEGORY_ORDER` and `CATEGORY_OF`
3. Add an entry to `categoryContent` (intro + three points) and `categoryIcons`
4. Run:

```bash
node _tools/generate.js everwell --force-config
node _tools/check.js everwell
```

That writes the new category page, its illustration, and rebuilds
`brand-config.js`.

> **`--force-config` overwrites `brand-config.js`.** If you have been editing
> that file by hand, your edits are lost. Pick one workflow and stick to it:
> either hand-edit `brand-config.js` and never pass `--force-config`, or keep
> `_tools/merged.js` as the source and always regenerate.

---

## After editing

**Locally:** refresh the browser. Hard-refresh (**Ctrl+Shift+R**) if the change
does not show — that is a cached `brand-config.js`.

**Live:** commit and push. Vercel redeploys automatically.

```bash
git add everwell/js/brand-config.js
git commit -m "Add Zinc Daily"
git push
```

**Check it first:**

```bash
node _tools/check.js everwell
```

If you added an image that does not exist, this catches it before it ships.

---

## Removing a product

Delete its object from `PRODUCTS`. Also check whether its slug is named in
`BRAND.heroProducts`, `newArrivals`, `qualityPicks` or `spotlightSlug` — those
fall back gracefully if a slug is missing, but you probably want to name a
replacement rather than let the fallback choose.

---

## Verified

This workflow was tested end to end: adding one product took the shop grid from
30 to 31 cards, the Daily Supplements filter and category page from 5 to 6, the
mega menu count updated, and the product got a working page at
`product.html?p=zinc-daily` with the right title — all from that single edit.

The array-position gotcha above was found the same way: inserting at the top
moved Daily Supplements to first place in the menu. Appending keeps the order.
