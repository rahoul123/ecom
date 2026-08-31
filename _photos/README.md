# _photos/ — drop real photography here

This folder is **dev-only**. It never gets uploaded to hosting.

## How it works

Put a file here and it replaces the generated placeholder illustration
automatically the next time you run `node _tools/generate.js`.

```
_photos/
└── everwell/                     ← the site slug (folder name of the site)
    ├── daily-foundation.jpg      ← product slug + extension
    ├── gentle-gel-cleanser.png
    ├── hero.jpg                  ← homepage hero        (1200 x 1020)
    ├── about.jpg                 ← about page image     (800 x 600)
    ├── about-2.jpg               ← about page image 2   (800 x 600)
    ├── og-default.jpg            ← social share image   (1200 x 630)
    └── logo.png                  ← brand logo
```

Accepted extensions: `.jpg` `.jpeg` `.png` `.webp` `.avif`

**Product filenames must match the product `slug`** in `js/brand-config.js`
(e.g. `daily-foundation.jpg`). Anything without a matching file keeps its
generated illustration, so you can add photos one at a time.

Product images should be **square (1000 x 1000 or larger)**. The layout uses a
1:1 box, so a non-square photo gets cropped from the centre.

## Then

```bash
node _tools/generate.js everwell
```

The build prints how many real photos it picked up, and rewrites the image
paths in `brand-config.js` and the HTML for you. Nothing else to change.

## Where to get images you are allowed to use

- Photograph the actual products — best option, and what your Shopify listings
  should use anyway so the two sites match.
- Free for commercial use, no attribution required: **Unsplash**, **Pexels**,
  **Pixabay**. Search terms that work well: "supplement bottle", "skincare
  product", "vitamins flat lay", "wellness minimal".
- Paid stock with a commercial licence: Adobe Stock, Getty, Shutterstock.

**Do not** take photos from competitor websites. Product photography is
copyrighted; using it risks a takedown, and Google Merchant Center and Meta
both reject listings using imagery the seller does not own.
