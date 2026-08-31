/* ==========================================================================
   MERGED.JS — the single combined store.

   Takes the products from all 5 brand definitions and merges them into ONE
   storefront with one identity. The 5 brands become CATEGORIES, not sites.

   Output folder: everwell/    (one site, 30 products, 6 categories)

   ALL CONTENT IS FICTIONAL PLACEHOLDER COPY. The store name "Everwell" is a
   placeholder — replace it in everwell/js/brand-config.js.
   ========================================================================== */

const { brands } = require('./brands');

/* Which category each source brand's products land in. */
const CATEGORY_OF = {
  'vitality-rx': "Men's Health",
  'lumen-skin': 'Skincare',
  'balance-co': 'Weight Management',
  'nova-daily': 'Daily Supplements',
  'clearpath': 'Sleep & Calm'
};

/* Bundles from every brand collect into one category so they stay findable. */
const BUNDLE_SOURCE_CATEGORIES = ['Bundles', 'Sets'];

/* Order categories appear in — the Shop dropdown, the homepage tiles and the
   filter list all follow this. Bundles last, since it cuts across the others. */
const CATEGORY_ORDER = [
  "Men's Health", 'Skincare', 'Weight Management', 'Daily Supplements', 'Sleep & Calm', 'Bundles'
];

/* A few products read oddly side by side once the catalogue is merged
   (three different "Evening ..." items). Renamed for the combined store. */
const RENAMES = {
  'evening-wind-down': { slug: 'nightly-reset', name: 'Nightly Reset' },
  'evening-calm': { slug: 'evening-support', name: 'Evening Support' },
  'magnesium-evening': { slug: 'magnesium-complex', name: 'Magnesium Complex' }
};

/* Explicit pack shapes where the product name alone would guess wrong. */
const IMAGE_FORMS = {
  'post-training-recovery': 'pouch',   // a tub you scoop from
  'vitamin-d3-k2': 'dropper',          // liquid drops, not capsules
  'daily-spf-40': 'tube',
  'hydration-sticks': 'box'
};

/* Homepage "best sellers" — a spread across categories, not 8 from one. */
const FEATURED = [
  'daily-foundation', 'gentle-gel-cleanser', 'hydrating-serum', 'daily-balance-capsules',
  'protein-shake-vanilla', 'daily-multi', 'night-capsules', 'wind-down-tea'
];

function mergeProducts() {
  const out = [];
  const seen = new Set();

  brands.forEach((brand) => {
    brand.products.forEach((p) => {
      const rename = RENAMES[p.slug];
      const slug = rename ? rename.slug : p.slug;

      if (seen.has(slug)) {
        throw new Error(`Duplicate product slug after merge: ${slug} (from ${brand.slug})`);
      }
      seen.add(slug);

      out.push(Object.assign({}, p, {
        slug,
        name: rename ? rename.name : p.name,
        category: BUNDLE_SOURCE_CATEGORIES.includes(p.category)
          ? 'Bundles'
          : CATEGORY_OF[brand.slug],
        featured: FEATURED.includes(slug),
        imageForm: IMAGE_FORMS[slug],
        /* Kept so you can trace a product back to the range it came from. */
        sourceBrand: brand.slug
      }));
    });
  });

  /* Group by CATEGORY_ORDER so every menu reads in a sensible sequence. */
  out.sort(function (a, b) {
    return CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category);
  });

  return out;
}

/* ==========================================================================
   Category page content. Each category gets its own .html page built from this.
   Add a category here + in CATEGORY_ORDER and it gains a page automatically.
   ALL COPY IS PLACEHOLDER — no medical claims, deliberately generic.
   ========================================================================== */
const categoryContent = {
  "Men's Health": {
    intro: '[[PLACEHOLDER]] Daily essentials built around the basics — energy, focus, recovery and sleep. Clear labels, no proprietary blends, and plain packaging on every order.',
    pointsHeading: 'What to expect from this range',
    points: [
      { title: 'Built for a routine', text: '[[PLACEHOLDER]] Simple daily formats designed to be easy to stick to.' },
      { title: 'Full ingredient lists', text: '[[PLACEHOLDER]] Every quantity printed on the label — nothing hidden behind a blend.' },
      { title: 'Discreet delivery', text: '[[PLACEHOLDER]] Plain outer packaging with no branding on the outside.' }
    ]
  },
  'Skincare': {
    intro: '[[PLACEHOLDER]] A short, deliberate range formulated to layer together — cleanse, treat, moisturise, protect. Fewer products, chosen to work as a routine.',
    pointsHeading: 'How this range works together',
    points: [
      { title: 'Designed to layer', text: '[[PLACEHOLDER]] Each step is made to sit under the next without pilling or clashing.' },
      { title: 'Fragrance-free options', text: '[[PLACEHOLDER]] Most of the range is unscented, and every ingredient is listed.' },
      { title: 'Start with one step', text: '[[PLACEHOLDER]] You do not need the whole shelf — add the step you are missing.' }
    ]
  },
  'Weight Management': {
    intro: '[[PLACEHOLDER]] Products meant to sit alongside habits you are already working on. No before-and-after photos, no promises about what your body will do.',
    pointsHeading: 'How we talk about this category',
    points: [
      { title: 'Support, not a promise', text: '[[PLACEHOLDER]] These products support a routine. The routine is still yours.' },
      { title: 'Plain language', text: '[[PLACEHOLDER]] We do not use claims we cannot stand behind.' },
      { title: 'Change it anytime', text: '[[PLACEHOLDER]] Pause, change or cancel a repeat order whenever you like.' }
    ]
  },
  'Daily Supplements': {
    intro: '[[PLACEHOLDER]] Third-party tested daily supplements with full ingredient disclosure, in sizes that make sense for one person.',
    pointsHeading: 'Why this range is short',
    points: [
      { title: 'Every quantity printed', text: '[[PLACEHOLDER]] No proprietary blends, so you can see exactly what you are taking.' },
      { title: 'Batch tested', text: '[[PLACEHOLDER]] Independently tested, with certificates available on request.' },
      { title: 'Build it up slowly', text: '[[PLACEHOLDER]] Start with one product and add to it when you are ready.' }
    ]
  },
  'Sleep & Calm': {
    intro: '[[PLACEHOLDER]] Everything here is built around the last few hours of the day — the routine, the packaging, even the way the labels read at 10pm.',
    pointsHeading: 'Built for the evening',
    points: [
      { title: 'One part of the day', text: '[[PLACEHOLDER]] A narrow range on purpose, so each product gets more attention.' },
      { title: 'Supplements and rituals', text: '[[PLACEHOLDER]] Capsules, drops, tea and a sleep mask — not everything has to be a pill.' },
      { title: 'Speak to a professional', text: '[[PLACEHOLDER]] If sleep is a persistent problem, please talk to a qualified healthcare professional.' }
    ]
  },
  'Bundles': {
    intro: '[[PLACEHOLDER]] Products grouped into one order at a lower price than buying them separately. One delivery instead of three.',
    pointsHeading: 'Why buy a bundle',
    points: [
      { title: 'Cheaper together', text: '[[PLACEHOLDER]] Every bundle costs less than the same items bought individually.' },
      { title: 'One delivery', text: '[[PLACEHOLDER]] Fewer parcels, fewer tracking emails.' },
      { title: 'Still flexible', text: '[[PLACEHOLDER]] Pause or cancel a repeat bundle at any time.' }
    ]
  }
};

/* Two testimonials pulled from across the original five, so the merged store
   does not read as one niche. Still fictional. */
const testimonials = [
  { name: 'Daniel R.', role: 'Verified customer', rating: 5,
    quote: '[[PLACEHOLDER]] Ordering was simple and it turned up faster than I expected. The packaging was completely plain, which I appreciated.' },
  { name: 'Priya S.', role: 'Verified customer', rating: 5,
    quote: '[[PLACEHOLDER]] I like getting my skincare and my supplements in one place instead of three different checkouts.' },
  { name: 'Rachel K.', role: 'Verified customer', rating: 5,
    quote: '[[PLACEHOLDER]] What sold me was the absence of hype. It reads like a normal shop, not a pitch.' },
  { name: 'Sam O.', role: 'Verified customer', rating: 5,
    quote: '[[PLACEHOLDER]] I asked for a batch certificate and they sent it the same day. That told me a lot.' },
  { name: 'Adam F.', role: 'Verified customer', rating: 4,
    quote: '[[PLACEHOLDER]] Straightforward to order and easy to pause. Support replied the next morning.' },
  { name: 'Elena M.', role: 'Verified customer', rating: 5,
    quote: '[[PLACEHOLDER]] Clear labels, quick delivery, and the packaging gives nothing away.' },
  { name: 'Tom A.', role: 'Verified customer', rating: 5,
    quote: '[[PLACEHOLDER]] Being able to see every quantity on the label is the reason I switched.' },
  { name: 'Nadia B.', role: 'Verified customer', rating: 4,
    quote: '[[PLACEHOLDER]] Easy to pause when I went travelling and just as easy to restart. No phone calls.' }
];

/* Aggregate rating shown above the reviews. PLACEHOLDER numbers — these must
   NOT be fed to structured data until a real review source supplies them. */
const reviewsSummary = { rating: 4.8, count: '[[PLACEHOLDER: 6,200]]' };


module.exports = {
  slug: 'everwell',
  name: 'Everwell',
  domain: 'everwell-placeholder.com',
  legalEntity: 'Everwell Health Ltd',
  tagline: 'Everyday health essentials, all in one place.',
  announcement: '[[PLACEHOLDER]] Flat 15% off your first order — code WELCOME15 · Free shipping over $50',
  niche: 'Health & wellness',

  fonts: {
    link: '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@600;700&display=swap" rel="stylesheet">',
    heading: "'Plus Jakarta Sans', 'Segoe UI', system-ui, sans-serif",
    body: "'Inter', 'Segoe UI', system-ui, sans-serif",
    headingWeight: '600',
    tracking: '-1.4px'
  },

  colors: {
    /* Supplement-store palette: clean white, a confident fresh green for
       actions, and orange reserved for sale tags and savings. */
    background: '#ffffff', surface: '#f7f8f5', soft: '#f2f5ee',
    text: '#1a1d18', heading: '#0f120d', muted: '#5c6357',
    border: '#e5e8df', borderStrong: '#cdd3c3',
    accent: '#4c8c1b', accentHover: '#3c7014', accentTint: '#eef6e4', onAccent: '#ffffff',
    accentAlt: '#e8590c', accentAltTint: '#fdefe6',
    footerBg: '#12150f', footerText: '#c9d1c2', star: '#f5a524'
  },

  style: { radius: '14px', radiusLarge: '24px', buttonRadius: '999px', cardStyle: 'bordered', logoWidth: '152px' },

  /* Icon per category tile on the homepage. Names come from site.js ICONS. */
  categoryIcons: {
    "Men's Health": 'user',
    'Skincare': 'leaf',
    'Weight Management': 'refresh',
    'Daily Supplements': 'shield',
    'Sleep & Calm': 'clock',
    'Bundles': 'box'
  },

  contact: {
    email: 'support@everwell-placeholder.com',
    phone: '+1 (555) 010-3300',
    hours: 'Mon–Sat, 8am–7pm ET',
    address: '[[PLACEHOLDER: registered business address]]'
  },

  copy: {
    heroEyebrow: 'Health & wellness',
    heroH1: 'Everything for your routine, in one place.',
    heroLede: '[[PLACEHOLDER]] Skincare, daily supplements, sleep support and more — one shop, clear labels, and plain packaging on every order.',
    primaryCta: 'Shop all products',
    heroCardTitle: '4.8 out of 5',
    heroCardText: '[[PLACEHOLDER]] from 6,200+ reviews',
    stepsHeading: 'Three steps, then it just arrives',
    stepsLede: '[[PLACEHOLDER]] No appointments to book, no queues to sit in.',
    featuredHeading: 'Best sellers across the shop',
    featuredLede: '[[PLACEHOLDER]] The products people order most, from every category.',
    reviewsHeading: 'What customers say',
    ctaHeading: 'Ready when you are',
    ctaLede: '[[PLACEHOLDER]] Pick what you need, check out securely, and get it delivered in plain packaging.',
    aboutH1: 'One shop instead of five',
    aboutLede: '[[PLACEHOLDER]] We brought our ranges together so you can buy everything in a single order.',
    aboutStoryHeading: 'Why we put it all under one roof',
    aboutStory1: '[[PLACEHOLDER]] Everwell started as a set of separate ranges — men\'s health, skincare, weight management, supplements and sleep. Useful individually, annoying together: five checkouts, five deliveries, five support inboxes.',
    aboutStory2: '[[PLACEHOLDER]] So we merged them. Same products, same standards, one shop. Full ingredient lists on everything, plain outer packaging on every order, and one team answering the emails.',
    aboutStory3: '[[PLACEHOLDER]] The range grows slowly on purpose. If a product does not earn its place, it does not go on the shelf.',
    aboutHowHeading: 'How we choose what to sell',
    aboutHowText: '[[PLACEHOLDER]] Every product goes through the same review before it joins the shop, whichever category it lands in.',
    shopLede: '[[PLACEHOLDER]] Everything we sell, in one grid. Filter by category or price to narrow it down.',
    bentoLede: '[[PLACEHOLDER]] The things that apply to every order, whichever part of the shop you buy from.'
  },

  heroProof: ['Licensed providers', 'Discreet packaging', 'Cancel anytime'],

  /* Scrolling ticker under the hero. */
  marquee: [
    'Free shipping over $50',
    'Plain, unbranded packaging',
    '30-day returns',
    'Third-party tested',
    'Cancel anytime',
    'Support replies in 24h',
    'Full ingredient lists'
  ],

  /* Bento "why us" grid. One accent cell, one wide cell. */
  bento: [
    { icon: 'shield', title: 'Nothing hidden', text: '[[PLACEHOLDER]] Every quantity printed on the label. No proprietary blends anywhere in the range.', wide: true },
    { stat: '30', title: 'Day returns', text: '[[PLACEHOLDER]] On unopened items, no questions.', accent: true },
    { icon: 'box', title: 'Plain packaging', text: '[[PLACEHOLDER]] No branding on the outside of any parcel.' },
    { icon: 'chat', title: 'Real support', text: '[[PLACEHOLDER]] A person replies within one business day.' },
    { icon: 'refresh', title: 'Change anytime', text: '[[PLACEHOLDER]] Pause, skip or cancel a repeat order yourself.' }
  ],

  /* Shop-by-goal grid — the entry point most people actually use. */
  goals: [
    { icon: 'user', title: 'Daily basics', text: '[[PLACEHOLDER]] The everyday foundation most routines are missing.', category: 'Daily Supplements' },
    { icon: 'leaf', title: 'Skin', text: '[[PLACEHOLDER]] A short routine that layers together, morning and night.', category: 'Skincare' },
    { icon: 'clock', title: 'Sleep', text: '[[PLACEHOLDER]] Built for the last few hours of the day.', category: 'Sleep & Calm' },
    { icon: 'refresh', title: 'Weight', text: '[[PLACEHOLDER]] Support alongside habits you are already working on.', category: 'Weight Management' }
  ],

  /* Which product gets the full-width spotlight treatment. */
  spotlightSlug: 'daily-multi',

  /* Mid-page offer strip. */
  promo: {
    tag: 'Limited offer',
    heading: '[[PLACEHOLDER]] 15% off your first order',
    text: '[[PLACEHOLDER]] Applies to everything in the shop, including bundles. One use per customer.',
    code: 'WELCOME15',
    cta: 'Shop the offer'
  },

  compareOther: 'Typical pharmacy',
  compare: [
    { label: 'Full ingredient quantities on the label', us: true, them: false },
    { label: 'Plain, unbranded outer packaging', us: true, them: false },
    { label: 'Everything in one order', us: true, them: false },
    { label: 'Pause or cancel without a phone call', us: true, them: false },
    { label: 'Delivered to your door', us: true, them: true }
  ],

  valueProps: [
    { icon: 'truck', text: 'Free shipping over $50' },
    { icon: 'box', text: 'Plain packaging' },
    { icon: 'refresh', text: '30-day returns' },
    { icon: 'chat', text: 'Support in 24h' }
  ],

  howItWorks: [
    { title: 'Find what you need', text: '[[PLACEHOLDER]] Browse by category, or answer a few questions and we will point you at the right shelf.' },
    { title: 'Check out securely', text: '[[PLACEHOLDER]] One basket for everything, however many categories you are buying from.' },
    { title: 'Delivered discreetly', text: '[[PLACEHOLDER]] Plain outer packaging, on a schedule you control.' }
  ],

  testimonials,
  reviewsSummary,
  categoryContent,
  categoryOrder: CATEGORY_ORDER,
  products: mergeProducts()
};
