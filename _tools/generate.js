#!/usr/bin/env node
/* ==========================================================================
   GENERATE.JS — dev-only scaffolder. NEVER needed to deploy.

   The five brand folders are already generated and committed. You only run
   this if you want to regenerate them after editing _shared/ or _tools/.

     node _tools/generate.js                 rebuild HTML + css/js for all brands
     node _tools/generate.js clearpath       rebuild one brand
     node _tools/generate.js --assets-only   only refresh css/ and js/ (safe)
     node _tools/generate.js --force-config  ALSO overwrite js/brand-config.js

   SAFETY: js/brand-config.js is never overwritten once it exists, because it
   is the file you edit. Pass --force-config to reset it back to the defaults.
   ========================================================================== */

const fs = require('node:fs');
const path = require('node:path');
const { brands: sourceBrands, common } = require('./brands');
const mergedStore = require('./merged');

/* The 5 niche brands plus the single combined store. */
const brands = sourceBrands.concat([mergedStore]);
const legal = require('./legal');
const img = require('./images');

const crypto = require('node:crypto');

const ROOT = path.resolve(__dirname, '..');
const SHARED = path.join(ROOT, '_shared');

/* Short hash of the shared assets, appended to css/js URLs as ?v=<hash> so a
   browser can never serve a stale stylesheet after an update. It only changes
   when the assets themselves change. */
const ASSET_VERSION = (() => {
  const parts = ['css/base.css', 'js/site.js', 'js/theme-init.js', 'js/tracking.js']
    .map((f) => fs.readFileSync(path.join(SHARED, f), 'utf8')).join('');
  return crypto.createHash('md5').update(parts).digest('hex').slice(0, 8);
})();

/* "Men's Health" -> "mens-health", "Sleep & Calm" -> "sleep-calm" */
const slugifyCategory = (name) => name
  .toLowerCase()
  .replace(/['’]/g, '')
  .replace(/&/g, ' ')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

/* Categories present in a site's products, in the site's declared order. */
function categoriesOf(brand) {
  const seen = [];
  brand.products.forEach((p) => { if (!seen.includes(p.category)) seen.push(p.category); });
  if (brand.categoryOrder) {
    seen.sort((a, b) => brand.categoryOrder.indexOf(a) - brand.categoryOrder.indexOf(b));
  }
  return seen;
}

const argv = process.argv.slice(2);
const assetsOnly = argv.includes('--assets-only');
const forceConfig = argv.includes('--force-config');
const only = argv.filter((a) => !a.startsWith('--'));

const read = (...p) => fs.readFileSync(path.join(...p), 'utf8');
const write = (file, content) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
};

/* ------------------------------------------------------------- templating */

/** Resolves {{a.b.c}} against ctx. Unknown keys become findable placeholders. */
function fill(str, ctx, where, warnings) {
  return str.replace(/\{\{([a-zA-Z0-9_.]+)\}\}/g, (m, key) => {
    const value = key.split('.').reduce((a, k) => (a == null ? undefined : a[k]), ctx);
    if (value === undefined || value === null) {
      warnings.push(`${where}: unresolved {{${key}}}`);
      return `[[PLACEHOLDER: ${key}]]`;
    }
    return String(value);
  });
}

/* ------------------------------------------------------------------ pages */

const PAGES = [
  { file: 'index.html', src: 'index.html', nav: 'Home',
    title: (b) => `${b.name} — ${b.tagline}`,
    desc: (b) => `[[PLACEHOLDER]] ${b.name}: ${b.niche.toLowerCase()} products with clear labelling, discreet packaging and straightforward support.` },

  { file: 'shop.html', src: 'shop.html', nav: 'Shop',
    title: (b) => `Shop all products | ${b.name}`,
    desc: (b) => `[[PLACEHOLDER]] Browse the full ${b.name} range. Filter by category and price to find what fits your routine.` },

  { file: 'product.html', src: 'product.html', nav: 'Product', noindex: true,
    title: (b) => `Product | ${b.name}`,
    desc: (b) => `[[PLACEHOLDER]] Product details, benefits and ingredients from ${b.name}.` },

  { file: 'about.html', src: 'about.html', nav: 'About',
    title: (b) => `About us | ${b.name}`,
    desc: (b) => `[[PLACEHOLDER]] Why ${b.name} exists, how we choose what to sell, and what we will not claim.` },

  { file: 'faq.html', src: 'faq.html', nav: 'FAQ',
    title: (b) => `Frequently asked questions | ${b.name}`,
    desc: (b) => `[[PLACEHOLDER]] Answers about ordering, delivery, packaging and returns at ${b.name}.` },

  { file: 'contact.html', src: 'contact.html', nav: 'Contact',
    title: (b) => `Contact us | ${b.name}`,
    desc: (b) => `[[PLACEHOLDER]] Get in touch with the ${b.name} support team about an order, a product or a return.` },

  { file: '404.html', src: '404.html', nav: '404', noindex: true, skipSitemap: true,
    title: (b) => `Page not found | ${b.name}`,
    desc: () => 'Page not found.' }
];

/* --------------------------------------------------------------- brand.css */

function brandCSS(brand) {
  const c = brand.colors;
  const s = brand.style;
  return `/* ==========================================================================
   BRAND.CSS — ${brand.name}
   Static fallback for the brand tokens. js/brand-config.js is the live source:
   theme-init.js reads BRAND.colors and overrides these before first paint.

   These values exist so crawlers and JS-disabled browsers still see the brand.
   If you change a colour, change it in js/brand-config.js — then optionally
   mirror it here so the two never disagree.
   ========================================================================== */

:root {
  --color-bg: ${c.background};
  --color-surface: ${c.surface};
  --color-soft: ${c.soft};
  --color-text: ${c.text};
  --color-heading: ${c.heading};
  --color-muted: ${c.muted};
  --color-border: ${c.border};
  --color-border-strong: ${c.borderStrong};
  --color-accent: ${c.accent};
  --color-accent-hover: ${c.accentHover};
  --color-accent-tint: ${c.accentTint};
  --color-on-accent: ${c.onAccent};
  --color-footer-bg: ${c.footerBg};
  --color-footer-text: ${c.footerText};
  --color-star: ${c.star};

  --color-error: #b3261e;
  --color-warn: #a15c00;
  --color-warn-bg: #fff8ea;
  --color-warn-border: #f0dfbe;

  --font-heading: ${brand.fonts.heading};
  --font-body: ${brand.fonts.body};
  --weight-heading: ${brand.fonts.headingWeight};
  --tracking-heading: ${brand.fonts.tracking};

  --page-width: 1240px;
  --radius: ${s.radius};
  --radius-lg: ${s.radiusLarge};
  --radius-sm: 8px;
  --radius-btn: ${s.buttonRadius};
  --logo-width: ${s.logoWidth};

  --shadow-sm: 0 1px 3px rgba(16, 20, 25, 0.07);
  --shadow: 0 1px 2px rgba(16, 20, 25, 0.04), 0 6px 20px rgba(16, 20, 25, 0.06);
  --shadow-lg: 0 12px 38px rgba(16, 20, 25, 0.12);
}
`;
}

/* -------------------------------------------------------- brand-config.js */

function brandConfig(brand) {
  const products = brand.products.map((p) => ({
    slug: p.slug,
    name: p.name,
    sku: `${brand.slug.toUpperCase().replace(/-/g, '')}-${p.slug.toUpperCase().replace(/-/g, '').slice(0, 12)}`,
    category: p.category,
    shortBenefit: p.shortBenefit,
    description: `[[PLACEHOLDER]] ${p.shortBenefit} Full product copy goes here — keep it factual and avoid medical claims until reviewed.`,
    metaDescription: `[[PLACEHOLDER]] ${p.name} from ${brand.name}. ${p.shortBenefit}`,
    price: p.price,
    compareAt: p.compareAt,
    priceNote: p.category === 'Bundles' || p.category === 'Sets' ? 'one-off purchase' : 'per 30-day supply',
    rating: p.rating,
    reviewCount: p.reviewCount,
    badge: p.badge,
    featured: p.featured,
    optionLabel: 'Supply',
    options: ['1 month', '3 months', '6 months'],
    benefits: p.benefits,
    ingredients: p.ingredients,
    howItWorks: p.howItWorks,
    image: `images/products/${p.slug}.svg`,
    gallery: [
      `images/products/${p.slug}.svg`,
      'images/products/_angle-2.svg',
      'images/products/_angle-3.svg',
      'images/products/_angle-4.svg'
    ],
    imageAlt: `[[PLACEHOLDER: product photo of ${p.name}]]`,
    checkoutUrl: `https://example-shopify-store.myshopify.com/products/${p.slug}`
  }));

  const j = (v) => JSON.stringify(v, null, 2).replace(/\n/g, '\n');

  /* category name -> its own page. Used by the Shop dropdown, homepage tiles
     and footer. Delete an entry and that category falls back to shop.html?category= */
  const categoryPages = {};
  categoriesOf(brand).forEach((c) => { categoryPages[c] = slugifyCategory(c) + '.html'; });

  return `/* ==========================================================================
   BRAND-CONFIG.JS — ${brand.name}

   >>> THIS IS THE ONLY FILE YOU NEED TO EDIT. <<<

   Everything below drives the whole site: brand name, colours, products,
   prices, testimonials, FAQs, and the Shopify redirect links.

   TO GO LIVE, YOU MUST:
     1. Replace every checkoutUrl with the real Shopify product URL.
     2. Replace every [[PLACEHOLDER: ...]] string.
     3. Replace the images in images/ and images/products/ with real photos.
     4. Add real tracking IDs below and set tracking.enabled to true.
     5. Remove the noindex tag from every .html file (search for "noindex").

   Find every remaining placeholder at once:
     grep -rn "PLACEHOLDER" .           (Mac/Linux)
     findstr /s /n "PLACEHOLDER" *.*    (Windows)
   ========================================================================== */

var BRAND = {
  name: ${JSON.stringify(brand.name)},
  tagline: ${JSON.stringify(brand.tagline)},
  announcement: ${JSON.stringify(brand.announcement)},
  logo: 'images/logo.svg',

  /* ---- Colours. theme-init.js applies these before first paint. -------- */
  colors: ${j(brand.colors)},

  style: ${j(brand.style)},

  currency: ${j(common.currency)},

  /* Every category has its own page. Generated by _tools/generate.js. */
  categoryPages: ${j(categoryPages)},
  categoryIcons: ${j(brand.categoryIcons || {})},

  contact: {
    email: ${JSON.stringify(brand.contact.email)},
    phone: ${JSON.stringify(brand.contact.phone)},
    hours: ${JSON.stringify(brand.contact.hours)},
    address: ${JSON.stringify(brand.contact.address)},
    legalEntity: ${JSON.stringify(brand.legalEntity)}
  },

  /* ---- Footer health disclaimer. Ad reviewers read this. --------------- */
  disclaimer: "[[PLACEHOLDER: health disclaimer]] The content on this site is for general information only and is not medical advice. Always speak to a qualified healthcare professional before starting, stopping or changing anything related to your health. Products are not intended to diagnose, treat, cure or prevent any disease.",

  copy: {
    buyCta: 'Buy now'
  },

  /* ---- Ad pixels. Nothing loads or fires until enabled is true. -------- */
  tracking: {
    enabled: false,
    ga4MeasurementId: '',            // 'G-XXXXXXXXXX'
    googleAdsConversionId: '',       // 'AW-XXXXXXXXX'
    googleAdsConversionLabel: '',    // the label from the conversion action
    metaPixelId: ''                  // numeric ID only
  },

  seo: {
    /* Leave false until a real review app supplies ratings. Invented ratings
       in structured data get Merchant Center accounts suspended. */
    emitAggregateRating: false
  },

  heroProof: ${j(brand.heroProof)},
  valueProps: ${j(brand.valueProps)},
  howItWorks: ${j(brand.howItWorks)},
  trustBadges: ${j(common.trustBadges)},
  productReassurance: ${j(common.productReassurance)},
  values: ${j(common.values)},
  stats: ${j(common.stats)},
  aboutPoints: ${j(common.aboutPoints)}
};

/* ==========================================================================
   PRODUCTS
   checkoutUrl is the ONE integration point with your real Shopify store.
   Replace each one with the real product URL, e.g.
     'https://yourstore.com/products/daily-foundation'
   Buttons navigate there in the same tab after firing a tracking event.
   ========================================================================== */

var PRODUCTS = ${j(products)};

/* ========================================================================== */

var TESTIMONIALS = ${j(brand.testimonials)};

var FAQS = ${j(common.faqs)};
`;
}

/* ------------------------------------------------------------------ build */

function buildBrand(brand) {
  const dir = path.join(ROOT, brand.slug);
  const warnings = [];

  /* --- css + js: always refreshed from _shared --- */
  write(path.join(dir, 'css', 'base.css'), read(SHARED, 'css', 'base.css'));
  write(path.join(dir, 'css', 'brand.css'), brandCSS(brand));
  ['theme-init.js', 'site.js', 'tracking.js'].forEach((f) => {
    write(path.join(dir, 'js', f), read(SHARED, 'js', f));
  });

  /* --- brand-config.js: never clobber the user's edits --- */
  const cfgPath = path.join(dir, 'js', 'brand-config.js');
  if (!fs.existsSync(cfgPath) || forceConfig) {
    write(cfgPath, brandConfig(brand));
  }

  if (assetsOnly) return { warnings, files: 0 };

  /* --- images --- */
  write(path.join(dir, 'images', 'logo.svg'), img.logo(brand, 'dark'));
  write(path.join(dir, 'images', 'logo-light.svg'), img.logo(brand, 'light'));
  write(path.join(dir, 'favicon.svg'), img.favicon(brand));
  write(path.join(dir, 'images', 'og-default.png'), img.ogImage(brand));
  write(path.join(dir, 'images', 'hero.svg'), img.placeholder(brand, 1200, 1020, 'Hero image', 'PLACEHOLDER — 1200x1020 lifestyle photo'));
  write(path.join(dir, 'images', 'about.svg'), img.placeholder(brand, 800, 600, 'About image', 'PLACEHOLDER — team or lifestyle photo'));
  write(path.join(dir, 'images', 'about-2.svg'), img.placeholder(brand, 800, 600, 'About image 2', 'PLACEHOLDER — secondary photo'));

  brand.products.forEach((p) => {
    write(path.join(dir, 'images', 'products', `${p.slug}.svg`),
      img.placeholder(brand, 800, 800, p.name, 'PLACEHOLDER — product photo'));
  });
  [2, 3, 4].forEach((n) => {
    write(path.join(dir, 'images', 'products', `_angle-${n}.svg`),
      img.placeholder(brand, 800, 800, `Angle ${n}`, 'PLACEHOLDER — additional product shot'));
  });

  /* --- pages --- */
  const head = read(SHARED, 'partials', 'head.html');
  const header = read(SHARED, 'partials', 'header.html');
  const footer = read(SHARED, 'partials', 'footer.html');

  const baseCtx = {
    BRAND_NAME: brand.name,
    BRAND_TAGLINE: brand.tagline,
    DOMAIN: brand.domain,
    LEGAL_ENTITY: brand.legalEntity,
    ANNOUNCEMENT: brand.announcement,
    PRIMARY_CTA: brand.copy.primaryCta || common.copy.primaryCta,
    FONT_LINK: brand.fonts.link,
    ASSET_V: ASSET_VERSION,
    THEME_COLOR: brand.colors.background,
    DISCLAIMER: '[[PLACEHOLDER: health disclaimer — replace with reviewed legal copy before launch.]]',
    copy: Object.assign({}, common.copy, brand.copy)
  };

  const NOINDEX = '<!-- REMOVE BEFORE LAUNCH: keeps placeholder content out of search results -->\n' +
    '<meta name="robots" content="noindex, nofollow">';

  let count = 0;

  function renderPage(outFile, bodySrc, ctx) {
    const html = fill(head, ctx, outFile, warnings) +
      fill(header, ctx, outFile, warnings) +
      fill(bodySrc, ctx, outFile, warnings) +
      fill(footer, ctx, outFile, warnings);
    write(path.join(dir, outFile), html);
    count++;
  }

  PAGES.forEach((page) => {
    const ctx = Object.assign({}, baseCtx, {
      PAGE_TITLE: page.title(brand),
      PAGE_DESC: page.desc(brand),
      PAGE_PATH: page.file === 'index.html' ? '' : page.file,
      ROBOTS: NOINDEX,
      JSONLD: page.file === 'index.html' ? orgSchema(brand) : ''
    });
    renderPage(page.file, read(SHARED, 'pages', page.src), ctx);
  });

  /* --- legal pages --- */
  const legalTpl = read(SHARED, 'pages', 'legal.html');
  Object.keys(legal).forEach((slug) => {
    const doc = legal[slug];
    const body = doc.body
      .replace(/\{\{BRAND_NAME\}\}/g, brand.name)
      .replace(/\{\{LEGAL_ENTITY\}\}/g, brand.legalEntity);

    const ctx = Object.assign({}, baseCtx, {
      PAGE_TITLE: `${doc.title} | ${brand.name}`,
      PAGE_DESC: doc.description.replace(/\{\{BRAND_NAME\}\}/g, brand.name),
      PAGE_PATH: `${slug}.html`,
      ROBOTS: NOINDEX,
      JSONLD: '',
      LEGAL_TITLE: doc.title,
      LEGAL_BODY: body
    });
    renderPage(`${slug}.html`, legalTpl, ctx);
  });

  /* --- one page per category --- */
  const categoryTpl = read(SHARED, 'pages', 'category.html');
  const cats = categoriesOf(brand);

  cats.forEach((catName) => {
    const file = slugifyCategory(catName) + '.html';
    const content = (brand.categoryContent && brand.categoryContent[catName]) || {
      intro: `[[PLACEHOLDER: ${catName} category description — 1 to 2 sentences, no medical claims.]]`,
      pointsHeading: `About ${catName}`,
      points: [
        { title: '[[PLACEHOLDER: point one]]', text: '[[PLACEHOLDER: supporting sentence.]]' },
        { title: '[[PLACEHOLDER: point two]]', text: '[[PLACEHOLDER: supporting sentence.]]' },
        { title: '[[PLACEHOLDER: point three]]', text: '[[PLACEHOLDER: supporting sentence.]]' }
      ]
    };

    const pointsHTML = content.points.map((pt, i) =>
      `<div class="step"><span class="step__num">${i + 1}</span>` +
      `<h3>${pt.title}</h3><p>${pt.text}</p></div>`).join('');

    const count = brand.products.filter((p) => p.category === catName).length;

    const ctx = Object.assign({}, baseCtx, {
      PAGE_TITLE: `${catName} | ${brand.name}`,
      PAGE_DESC: `[[PLACEHOLDER]] ${catName} at ${brand.name} — ${count} products with clear labelling, discreet packaging and straightforward support.`,
      PAGE_PATH: file,
      ROBOTS: NOINDEX,
      JSONLD: '',
      CAT_NAME: catName,
      CAT_NAME_JS: JSON.stringify(catName),
      CAT_INTRO: content.intro,
      CAT_POINTS_HEADING: content.pointsHeading,
      CAT_POINTS: pointsHTML
    });
    renderPage(file, categoryTpl, ctx);
  });

  /* --- robots + sitemap --- */
  write(path.join(dir, 'robots.txt'),
`# ${brand.name}
# WHILE THIS SITE IS A PLACEHOLDER, crawling is blocked here and every page
# also carries a noindex tag. Remove BOTH before launch.
User-agent: *
Disallow: /

# Launch configuration — swap the block above for this:
# User-agent: *
# Allow: /
# Sitemap: https://${brand.domain}/sitemap.xml
`);

  const urls = PAGES.filter((p) => !p.skipSitemap && !p.noindex).map((p) =>
    `  <url><loc>https://${brand.domain}/${p.file === 'index.html' ? '' : p.file}</loc></url>`);
  brand.products.forEach((p) => {
    urls.push(`  <url><loc>https://${brand.domain}/product.html?p=${p.slug}</loc></url>`);
  });
  cats.forEach((catName) => {
    urls.push(`  <url><loc>https://${brand.domain}/${slugifyCategory(catName)}.html</loc></url>`);
  });
  Object.keys(legal).forEach((slug) => {
    urls.push(`  <url><loc>https://${brand.domain}/${slug}.html</loc></url>`);
  });

  write(path.join(dir, 'sitemap.xml'),
`<?xml version="1.0" encoding="UTF-8"?>
<!-- [[PLACEHOLDER: replace ${brand.domain} with the real domain before launch]] -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`);

  return { warnings, files: count };
}

function orgSchema(brand) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: brand.name,
    url: `https://${brand.domain}/`,
    logo: `https://${brand.domain}/images/logo.svg`,
    description: brand.tagline,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: brand.contact.email,
      telephone: brand.contact.phone
    }
  };
  return '<script type="application/ld+json">\n' + JSON.stringify(schema, null, 2) + '\n</script>';
}

/* -------------------------------------------------------------------- run */

const targets = only.length ? brands.filter((b) => only.includes(b.slug)) : brands;

if (!targets.length) {
  console.error('No matching brand. Available: ' + brands.map((b) => b.slug).join(', '));
  process.exit(1);
}

console.log(assetsOnly
  ? `Refreshing css/ and js/ for ${targets.length} brand(s)...\n`
  : `Generating ${targets.length} brand site(s)...\n`);

let allWarnings = [];
targets.forEach((brand) => {
  const { warnings, files } = buildBrand(brand);
  allWarnings = allWarnings.concat(warnings.map((w) => `${brand.slug}/${w}`));
  console.log(`  ${brand.slug.padEnd(14)} ${assetsOnly ? 'css + js refreshed' : files + ' pages'}`);
});

if (allWarnings.length) {
  console.log(`\n${allWarnings.length} unresolved template token(s):`);
  [...new Set(allWarnings)].slice(0, 15).forEach((w) => console.log('  - ' + w));
} else {
  console.log('\nAll template tokens resolved.');
}

console.log('\nOpen any brand folder\'s index.html in a browser, or run:');
console.log('  npx serve vitality-rx      (product.html needs ?p= query params, which file:// handles fine)');
