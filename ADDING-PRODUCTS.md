# Adding a product

There are two ways. Use the panel unless you have a reason not to.

---

## The panel

Open **`admin.html`** in a browser — on your live site (`yoursite.com/admin.html`)
or by double-clicking the file on your computer.

Press **Add product**, fill in the form, and press **Save to site**. Reload the
shop and it is there. The card preview at the top is the real product card, so
what you see is what the shop will show.

**Save to site needs PHP on your host** — see [ADMIN-SETUP.md](ADMIN-SETUP.md)
for the five-minute setup. It works on cPanel and normal hosting; it does not
work on Vercel, Netlify or GitHub Pages, which only serve files and never run
code.

Without PHP the panel hides Save and gives you **Download file** instead:

1. Press **Download file**. Your browser downloads `products.js`.
2. Upload it to the `js/` folder on your hosting, over the one already there.
3. Reload the shop.

### Photos

Each product has four photo slots. The first is the one on the product card and
at the top of the product page; the rest are the thumbnails under it. Leave a
slot empty to skip it.

With Save turned on, **Choose…** uploads the photo for you. Without it, either
put your images in `images/products/` yourself and type the filename, or tick
*Embed photos in products.js* and they travel inside the file — no separate
upload, but a bigger file. The panel tells you which photos it cannot find.

Your work is kept in the browser as you type, so you can close the tab and come
back to it. Until you press Save (or upload the downloaded file), it is *only*
in that browser.

**To edit later:** open the panel, press **Import**, and pick the `products.js`
you exported last time. Edit, export again.

**If the panel shows a different number of products than your shop**, it is
showing a draft saved in that browser from an earlier visit. The panel says so
at the top and offers to load the shop's products instead. Nothing is
overwritten until you choose.

### Categories

The **Categories** tab lists every category, in the order they appear in the
menu. You can rename one — every product in it follows — reorder them, and give
each a line of description. A category exists because products are in it, so
the only way to delete one is to empty it first, and adding one creates a blank
product for it to hold.

### Collections

A category is what a product *is*. A **collection** is why you would buy it:
"Gifts under $50", "The bedroom edit". One product can be in any number of
collections, and a collection can mix categories freely.

Make one in the **Collections** tab, tick the products that belong in it, and
it appears in the Categories menu straight away. Tick *Show on the home page*
and it also gets a tile there. Each one is served at
`collection.html?c=<its address>` — no new file to upload, no rebuild.

**Photos.** Either upload your images to `images/products/` and point each
product at its filename, or tick *Embed the photo* and the picture is carried
inside `products.js` itself — no separate upload, but a bigger file. The panel
tells you the size either way, and warns you if a path does not exist.

**Is the panel a security hole?** No. Anyone who opens it edits their own copy
in their own browser and changes nothing of yours. The only way anything reaches
the site is somebody uploading a file to your hosting, which needs your FTP
password. The page is set to `noindex` and is not linked from anywhere.

---

## By hand

The panel writes `js/products.js`. You can write it yourself instead — it is a
plain list. Or edit `js/brand-config.js`, which is what the site falls back to
when `products.js` is empty.

Either way the shape of one product is the same, and it is this:

### The shape of a product

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
git add everwell/js/products.js everwell/js/brand-config.js
git commit -m "Add Zinc Daily"
git push
```

If you are on cPanel rather than git, upload the changed file over FTP and you
are done — there is nothing to build.

**Check it first:**

```bash
node _tools/check.js everwell    # dead links, missing images, unstyled markup
node _tools/test.js              # pricing, and that the panel derives products
                                 # the same way the generator does
```

If you added an image that does not exist, `check.js` catches it before it
ships.

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
