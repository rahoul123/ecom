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
  { name: 'Daniel R.', meta: '[[PLACEHOLDER]] Verified customer', rating: 5,
    quote: '[[PLACEHOLDER]] Ordering was simple and it turned up faster than I expected. The packaging was completely plain, which I appreciated.' },
  { name: 'Priya S.', meta: '[[PLACEHOLDER]] Verified customer', rating: 5,
    quote: '[[PLACEHOLDER]] I like being able to get my skincare and my supplements in one place instead of three different checkouts.' },
  { name: 'Rachel K.', meta: '[[PLACEHOLDER]] Verified customer', rating: 5,
    quote: '[[PLACEHOLDER]] What sold me was the absence of hype. It reads like a normal shop, not a pitch.' },
  { name: 'Sam O.', meta: '[[PLACEHOLDER]] Verified customer', rating: 5,
    quote: '[[PLACEHOLDER]] I asked for a batch certificate and they sent it the same day. That told me a lot.' },
  { name: 'Adam F.', meta: '[[PLACEHOLDER]] Verified customer', rating: 4,
    quote: '[[PLACEHOLDER]] Straightforward to order and easy to pause. Support replied the next morning.' },
  { name: 'Elena M.', meta: '[[PLACEHOLDER]] Verified customer', rating: 5,
    quote: '[[PLACEHOLDER]] Clear labels, quick delivery, and the packaging gives nothing away.' }
];

module.exports = {
  slug: 'everwell',
  name: 'Everwell',
  domain: 'everwell-placeholder.com',
  legalEntity: 'Everwell Health Ltd',
  tagline: 'Everyday health essentials, all in one place.',
  announcement: 'Free discreet shipping on orders over $50',
  niche: 'Health & wellness',

  fonts: {
    link: '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@600;700&display=swap" rel="stylesheet">',
    heading: "'Plus Jakarta Sans', 'Segoe UI', system-ui, sans-serif",
    body: "'Inter', 'Segoe UI', system-ui, sans-serif",
    headingWeight: '600',
    tracking: '-1.4px'
  },

  colors: {
    background: '#ffffff', surface: '#f4f7f8', soft: '#eff4f5',
    text: '#132228', heading: '#0d1a1f', muted: '#5b6d74',
    border: '#dde7e9', borderStrong: '#c2d1d4',
    accent: '#0e6f6c', accentHover: '#0a5451', accentTint: '#e3f0ef', onAccent: '#ffffff',
    footerBg: '#0d1a1f', footerText: '#c3d3d6', star: '#e0a12c'
  },

  style: { radius: '14px', radiusLarge: '18px', buttonRadius: '999px', cardStyle: 'bordered', logoWidth: '152px' },

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
    shopLede: '[[PLACEHOLDER]] Everything we sell, in one grid. Filter by category or price to narrow it down.'
  },

  heroProof: ['Licensed providers', 'Discreet packaging', 'Cancel anytime'],

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
  categoryContent,
  categoryOrder: CATEGORY_ORDER,
  products: mergeProducts()
};
