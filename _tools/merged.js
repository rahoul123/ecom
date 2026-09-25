/* ==========================================================================
   MERGED.JS — the storefront's source data.

   Brand: a silk pillowcase shop, styled after blissy.com.
   White ground, navy actions, the silk colours themselves doing the work.

   ALL CONTENT IS PLACEHOLDER. The name, copy and product range are stand-ins;
   the point of this file is that changing them is a data edit, not a rebuild.
   ========================================================================== */

/* Category order drives the nav, the filters and the tiles. */
const CATEGORY_ORDER = ['Pillowcases', 'Sleep Masks', 'Scrunchies', 'Bundles'];

/* ==========================================================================
   The silk palette. Each product carries its own swatch, so a card sits on
   the colour it actually sells — which is the whole look of a site like this.
   ========================================================================== */
const SILK = {
  champagne: '#e8dcc6',
  ivory: '#f2ece1',
  blush: '#edd3d1',
  rose: '#e2b8b8',
  midnight: '#2a3350',
  sage: '#cdd8c8',
  lavender: '#d8d2e6',
  pearl: '#e4e6ea',
  gold: '#dfc68c',
  charcoal: '#4a4e58'
};

function pillowcase(colour, hex, price, compareAt, rating, reviews, badge, featured) {
  return {
    slug: 'silk-pillowcase-' + colour.toLowerCase().replace(/\s+/g, '-'),
    name: 'Silk Pillowcase — ' + colour,
    category: 'Pillowcases',
    swatch: hex,
    colour: colour,
    shortBenefit: '22-momme mulberry silk, both sides.',
    price: price,
    compareAt: compareAt,
    rating: rating,
    reviewCount: reviews,
    badge: badge,
    featured: featured,
    optionLabel: 'Size',
    options: ['Standard', 'Queen', 'King'],
    benefits: [
      '[[PLACEHOLDER]] 100% mulberry silk, 22 momme',
      '[[PLACEHOLDER]] Hidden zip, silk on both sides',
      '[[PLACEHOLDER]] Machine washable on a delicate cycle'
    ],
    ingredients: ['[[PLACEHOLDER]] 100% mulberry silk', '[[PLACEHOLDER]] OEKO-TEX certified dye'],
    howItWorks: '[[PLACEHOLDER]] Slip it over your usual pillow and sleep on it. Wash cool on a delicate cycle, hang to dry.'
  };
}

const products = [
  /* ---- Pillowcases: the hero product, one card per colour ---- */
  pillowcase('Champagne', SILK.champagne, 89, 109, 4.9, 4820, 'Best seller', true),
  pillowcase('Ivory', SILK.ivory, 89, 109, 4.9, 3140, null, true),
  pillowcase('Blush', SILK.blush, 89, 109, 4.8, 2760, null, true),
  pillowcase('Midnight', SILK.midnight, 89, 109, 4.9, 2210, null, true),
  pillowcase('Sage', SILK.sage, 89, null, 4.8, 1180, 'New', false),
  pillowcase('Lavender', SILK.lavender, 89, null, 4.8, 960, 'New', false),
  pillowcase('Pearl', SILK.pearl, 89, 109, 4.7, 1540, null, false),
  pillowcase('Gold', SILK.gold, 99, 124, 4.9, 870, 'New', false),

  /* ---- A few accessories so every section has something to show ---- */
  {
    slug: 'silk-sleep-mask-champagne',
    name: 'Silk Sleep Mask — Champagne',
    category: 'Sleep Masks',
    swatch: SILK.champagne,
    colour: 'Champagne',
    shortBenefit: 'Blocks the light, adjustable strap.',
    price: 39, compareAt: 49, rating: 4.8, reviewCount: 1420, badge: null, featured: true,
    optionLabel: 'Fit', options: ['One size'],
    benefits: ['[[PLACEHOLDER]] 22-momme mulberry silk', '[[PLACEHOLDER]] Adjustable, no-snag strap', '[[PLACEHOLDER]] Travel pouch included'],
    ingredients: ['[[PLACEHOLDER]] 100% mulberry silk'],
    howItWorks: '[[PLACEHOLDER]] Adjust the strap and wear it over the eyes. Hand wash cool.'
  },
  {
    slug: 'silk-sleep-mask-midnight',
    name: 'Silk Sleep Mask — Midnight',
    category: 'Sleep Masks',
    swatch: SILK.midnight,
    colour: 'Midnight',
    shortBenefit: 'Blocks the light, adjustable strap.',
    price: 39, compareAt: null, rating: 4.9, reviewCount: 980, badge: null, featured: false,
    optionLabel: 'Fit', options: ['One size'],
    benefits: ['[[PLACEHOLDER]] 22-momme mulberry silk', '[[PLACEHOLDER]] Adjustable, no-snag strap', '[[PLACEHOLDER]] Travel pouch included'],
    ingredients: ['[[PLACEHOLDER]] 100% mulberry silk'],
    howItWorks: '[[PLACEHOLDER]] Adjust the strap and wear it over the eyes. Hand wash cool.'
  },
  {
    slug: 'silk-scrunchies-neutrals',
    name: 'Silk Scrunchies — Neutrals',
    category: 'Scrunchies',
    swatch: SILK.ivory,
    colour: 'Neutrals',
    shortBenefit: 'Set of three, no-crease.',
    price: 29, compareAt: 36, rating: 4.7, reviewCount: 2310, badge: null, featured: false,
    optionLabel: 'Set', options: ['Set of 3'],
    benefits: ['[[PLACEHOLDER]] Three scrunchies per set', '[[PLACEHOLDER]] Soft elastic, holds without pulling', '[[PLACEHOLDER]] 22-momme mulberry silk'],
    ingredients: ['[[PLACEHOLDER]] 100% mulberry silk', '[[PLACEHOLDER]] Covered elastic'],
    howItWorks: '[[PLACEHOLDER]] Wear as you would any hair tie. Hand wash cool.'
  },
  {
    slug: 'silk-scrunchies-jewels',
    name: 'Silk Scrunchies — Jewels',
    category: 'Scrunchies',
    swatch: SILK.lavender,
    colour: 'Jewels',
    shortBenefit: 'Set of three, no-crease.',
    price: 29, compareAt: null, rating: 4.7, reviewCount: 1160, badge: 'New', featured: false,
    optionLabel: 'Set', options: ['Set of 3'],
    benefits: ['[[PLACEHOLDER]] Three scrunchies per set', '[[PLACEHOLDER]] Soft elastic, holds without pulling', '[[PLACEHOLDER]] 22-momme mulberry silk'],
    ingredients: ['[[PLACEHOLDER]] 100% mulberry silk', '[[PLACEHOLDER]] Covered elastic'],
    howItWorks: '[[PLACEHOLDER]] Wear as you would any hair tie. Hand wash cool.'
  },

  /* ---- Bundles ---- */
  {
    slug: 'the-sleep-set',
    name: 'The Sleep Set',
    category: 'Bundles',
    swatch: SILK.rose,
    colour: 'Blush',
    shortBenefit: 'Pillowcase, sleep mask and scrunchies.',
    price: 139, compareAt: 179, rating: 4.9, reviewCount: 1640, badge: 'Save 22%', featured: true,
    optionLabel: 'Size', options: ['Standard', 'Queen', 'King'],
    benefits: ['[[PLACEHOLDER]] One pillowcase, one mask, one scrunchie set', '[[PLACEHOLDER]] Arrives gift-boxed', '[[PLACEHOLDER]] Cheaper than buying separately'],
    ingredients: ['[[PLACEHOLDER]] 100% mulberry silk throughout'],
    howItWorks: '[[PLACEHOLDER]] Follow the care label on each piece. Wash cool, hang to dry.'
  },
  {
    slug: 'the-pillowcase-pair',
    name: 'The Pillowcase Pair',
    category: 'Bundles',
    swatch: SILK.pearl,
    colour: 'Pearl',
    shortBenefit: 'Two pillowcases, one for each side.',
    price: 159, compareAt: 198, rating: 4.9, reviewCount: 920, badge: 'Buy 3 get 1', featured: false,
    optionLabel: 'Size', options: ['Standard', 'Queen', 'King'],
    benefits: ['[[PLACEHOLDER]] Two 22-momme pillowcases', '[[PLACEHOLDER]] Mix or match the colours', '[[PLACEHOLDER]] Arrives gift-boxed'],
    ingredients: ['[[PLACEHOLDER]] 100% mulberry silk'],
    howItWorks: '[[PLACEHOLDER]] Wash cool on a delicate cycle, hang to dry.'
  },
  {
    slug: 'the-gift-box',
    name: 'The Gift Box',
    category: 'Bundles',
    swatch: SILK.gold,
    colour: 'Gold',
    shortBenefit: 'The whole range, boxed and ribboned.',
    price: 199, compareAt: 254, rating: 5.0, reviewCount: 540, badge: 'Save 22%', featured: false,
    optionLabel: 'Size', options: ['Standard', 'Queen', 'King'],
    benefits: ['[[PLACEHOLDER]] Pillowcase, mask, scrunchies and a travel pouch', '[[PLACEHOLDER]] Gift box and ribbon included', '[[PLACEHOLDER]] Add a handwritten note at checkout'],
    ingredients: ['[[PLACEHOLDER]] 100% mulberry silk throughout'],
    howItWorks: '[[PLACEHOLDER]] Follow the care label on each piece.'
  }
];

/* Sorted into the declared order so every menu reads the same way. */
products.sort((a, b) => CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category));

/* ==========================================================================
   Category page content.
   ========================================================================== */
const categoryContent = {
  Pillowcases: {
    intro: '[[PLACEHOLDER]] One pillowcase, ten colours. 22-momme mulberry silk on both sides, with a hidden zip so nothing works loose in the wash.',
    pointsHeading: 'What every pillowcase has',
    points: [
      { title: 'Silk on both sides', text: '[[PLACEHOLDER]] Not silk on one face and cotton on the other.' },
      { title: 'Hidden zip', text: '[[PLACEHOLDER]] Stays put overnight, invisible when made up.' },
      { title: 'Washable at home', text: '[[PLACEHOLDER]] Cool delicate cycle, hang to dry. No dry cleaning.' }
    ]
  },
  'Sleep Masks': {
    intro: '[[PLACEHOLDER]] The same silk, cut for the eyes. Adjustable strap, travel pouch in the box.',
    pointsHeading: 'Made for actual sleep',
    points: [
      { title: 'Blocks the light', text: '[[PLACEHOLDER]] Contoured so it sits flush without pressing.' },
      { title: 'No-snag strap', text: '[[PLACEHOLDER]] Adjustable, and it will not catch your hair.' },
      { title: 'Comes with a pouch', text: '[[PLACEHOLDER]] Small enough to live in a bag.' }
    ]
  },
  Scrunchies: {
    intro: '[[PLACEHOLDER]] Sold in threes, in the same colours as the pillowcases.',
    pointsHeading: 'Why silk here too',
    points: [
      { title: 'Holds without pulling', text: '[[PLACEHOLDER]] Covered elastic, soft enough to sleep in.' },
      { title: 'Three per set', text: '[[PLACEHOLDER]] Neutrals or jewels.' },
      { title: 'Matches the range', text: '[[PLACEHOLDER]] Same silk, same colours.' }
    ]
  },
  Bundles: {
    intro: '[[PLACEHOLDER]] The range boxed together, at less than the pieces cost separately.',
    pointsHeading: 'Why buy a set',
    points: [
      { title: 'Cheaper together', text: '[[PLACEHOLDER]] Every set costs less than its pieces.' },
      { title: 'Gift-boxed', text: '[[PLACEHOLDER]] Ribbon on, note optional.' },
      { title: 'One delivery', text: '[[PLACEHOLDER]] Everything arrives at once.' }
    ]
  }
};

/* ==========================================================================
   Reviews. Fictional — replace with a real source before launch.
   ========================================================================== */
const testimonials = [
  { name: 'Amelia R.', role: '[[PLACEHOLDER]] Verified buyer', rating: 5,
    quote: '[[PLACEHOLDER]] I bought one to try and ordered three more the same week. My hair is noticeably less of a mess in the morning.' },
  { name: 'Priya S.', role: '[[PLACEHOLDER]] Verified buyer', rating: 5,
    quote: '[[PLACEHOLDER]] It washes beautifully. Six months in and the champagne one still looks like it did on day one.' },
  { name: 'Daniel K.', role: '[[PLACEHOLDER]] Verified buyer', rating: 5,
    quote: '[[PLACEHOLDER]] Bought the midnight as a gift and ended up keeping it. Ordered two more.' },
  { name: 'Hana M.', role: '[[PLACEHOLDER]] Verified buyer', rating: 4,
    quote: '[[PLACEHOLDER]] The zip is the detail that sold me — nothing slides off in the night.' },
  { name: 'Grace L.', role: '[[PLACEHOLDER]] Verified buyer', rating: 5,
    quote: '[[PLACEHOLDER]] The gift box arrived looking genuinely expensive. I did not need to wrap anything.' },
  { name: 'Sofia T.', role: '[[PLACEHOLDER]] Verified buyer', rating: 5,
    quote: '[[PLACEHOLDER]] Sleep mask and pillowcase in the same colour. Small thing, but it looks considered.' },
  { name: 'Noor A.', role: '[[PLACEHOLDER]] Verified buyer', rating: 5,
    quote: '[[PLACEHOLDER]] Delivery was quicker than the estimate and the packaging was lovely.' },
  { name: 'Elena V.', role: '[[PLACEHOLDER]] Verified buyer', rating: 4,
    quote: '[[PLACEHOLDER]] I was sceptical about the price. Having slept on it for a month, I get it now.' }
];

const reviewsSummary = {
  rating: 4.9,
  count: '[[PLACEHOLDER: 230,000]]',
  promo: {
    pill: 'Award',
    text: '[[PLACEHOLDER]] Most gifted product three years running —',
    linkText: 'Read all reviews',
    href: 'shop.html'
  }
};

module.exports = {
  slug: 'everwell',
  name: 'Lunelle Silk',

  /* A silk shop has no business shipping a medical disclaimer. */
  legalPages: ['privacy-policy', 'terms-of-service', 'shipping-refund-policy'],

  domain: 'lunelle-placeholder.com',
  legalEntity: 'Lunelle Silk Ltd',
  tagline: 'A little silk. A lot to love.',
  announcement: '[[PLACEHOLDER]] Buy 3, get 1 free — ends Sunday',
  niche: 'Silk pillowcases',

  fonts: {
    link: '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&display=swap" rel="stylesheet">',
    heading: "'Fraunces', Georgia, 'Times New Roman', serif",
    body: "'Inter', 'Segoe UI', system-ui, sans-serif",
    headingWeight: '600',
    tracking: '-0.6px'
  },

  colors: {
    /* White ground, navy for every action, the silk colours supply the warmth.
       Gold is reserved for stars and awards; rust only for sale badges. */
    background: '#ffffff', surface: '#f7f8fb', soft: '#f1f3f9',
    text: '#2b3244', heading: '#111a2e', muted: '#6b7488',
    border: '#e5e8f0', borderStrong: '#c9cfdd',
    accent: '#1b2a4e', accentHover: '#111d3a', accentTint: '#e9edf6', onAccent: '#ffffff',
    accentDeep: '#16233f', accentDeeper: '#0c1630',
    accentAlt: '#c0563c', accentAltTint: '#fbeee9',
    footerBg: '#111a2e', footerText: '#c3c9d8', star: '#dfa93f'
  },

  style: { radius: '14px', radiusLarge: '22px', buttonRadius: '999px', cardStyle: 'bordered', logoWidth: '156px' },

  categoryIcons: {
    Pillowcases: 'leaf',
    'Sleep Masks': 'clock',
    Scrunchies: 'refresh',
    Bundles: 'box'
  },

  contact: {
    email: 'hello@lunelle-placeholder.com',
    phone: '+1 (555) 010-7788',
    hours: 'Mon–Sat, 9am–7pm',
    address: '[[PLACEHOLDER: registered business address]]'
  },

  copy: {
    heroEyebrow: '22-momme mulberry silk',
    heroH1: 'A little silk.',
    heroH1Accent: 'A lot to love.',
    heroLede: '[[PLACEHOLDER]] One pillowcase, ten colours, silk on both sides. Kinder to hair and skin than cotton, and it washes at home.',
    primaryCta: 'Shop pillowcases',
    stepsHeading: 'From order to first night',
    stepsLede: '[[PLACEHOLDER]] Three steps, and then you sleep on it.',
    featuredHeading: 'Best Sellers — Pillowcases',
    featuredLede: '[[PLACEHOLDER]] The colours that go out the door fastest.',
    arrivalsLede: '[[PLACEHOLDER]] The newest colours in the collection.',
    picksLede: '[[PLACEHOLDER]] The three our customers rate highest, and the ones we would gift first.',
    reviewsHeading: 'What people say',
    reviewsLede: '[[PLACEHOLDER]] Fictional reviews shown for layout. Replace with a real review source before launch.',
    trustHeading: 'Why people keep reordering',
    trustLede: '[[PLACEHOLDER]] The things that matter once it is actually on your pillow.',
    ctaHeading: 'Sleep on it tonight',
    ctaLede: '[[PLACEHOLDER]] Pick a colour, check out securely, and it arrives gift-boxed.',
    shopLede: '[[PLACEHOLDER]] Every colour and every size, in one place.',
    aboutH1: 'We only wanted to get one thing right',
    aboutLede: '[[PLACEHOLDER]] A single pillowcase, made properly, in the colours people actually want.',
    aboutStoryHeading: 'Why just silk',
    aboutStory1: '[[PLACEHOLDER]] Lunelle started with one complaint: every silk pillowcase on the market was either silk on one side only, or so thin it did not survive a wash.',
    aboutStory2: '[[PLACEHOLDER]] So we made one. 22-momme mulberry silk on both faces, a hidden zip, and a dye that holds. Then we made it in ten colours and stopped there.',
    aboutStory3: '[[PLACEHOLDER]] The range grows slowly on purpose. A sleep mask and a set of scrunchies in the same silk, and that is the whole shop.',
    aboutHowHeading: 'How it is made',
    aboutHowText: '[[PLACEHOLDER]] Every piece comes from the same mill and goes through the same checks.',
    faqLede: '[[PLACEHOLDER]] Sizing, washing, delivery and returns.',
    contactLede: '[[PLACEHOLDER]] A question about an order, a size or a colour? Send us a message.',
    shippingBlurb: '[[PLACEHOLDER]] Free delivery over $75, gift-boxed, with 60 nights to change your mind.',
    collectionEyebrow: 'The collection',
    collectionHeading: 'A little silk. A lot to love.',
    collectionLede: '[[PLACEHOLDER]] Ten colours of 22-momme mulberry silk, plus the mask and scrunchies that match them.'
  },

  heroProof: ['Free delivery over $75', '60-night trial', 'Gift-boxed'],

  /* The award strip under the hero — the most Blissy thing on the page. */
  awards: [
    { value: '230,000+', label: '[[PLACEHOLDER]] 5-star reviews' },
    { value: '2023–25', label: '[[PLACEHOLDER]] Most gifted, three years' },
    { value: '22', label: 'Momme mulberry silk' },
    { value: '60', label: 'Night trial' }
  ],

  /* Press logos, rendered as wordmarks — replace with real, permissioned logos. */
  press: ['[[PLACEHOLDER]] VOGUE', 'FORBES', 'ELLE', 'GQ', 'HARPER&rsquo;S', 'ALLURE'],

  marquee: [
    'Free delivery over $75',
    '60-night trial',
    '22-momme mulberry silk',
    'Silk on both sides',
    'Gift-boxed as standard',
    'Machine washable',
    'Buy 3, get 1 free'
  ],

  valueProps: [
    { icon: 'truck', text: 'Free delivery over $75' },
    { icon: 'box', text: 'Gift-boxed as standard' },
    { icon: 'refresh', text: '60-night trial' },
    { icon: 'chat', text: 'Support in 24h' }
  ],

  howItWorks: [
    { title: 'Pick your colour', text: '[[PLACEHOLDER]] Ten silk colours, three sizes. Swatches on every product page.' },
    { title: 'We box it up', text: '[[PLACEHOLDER]] Gift box and ribbon as standard, note optional at checkout.' },
    { title: 'Sleep on it', text: '[[PLACEHOLDER]] Sixty nights to decide. Send it back if it is not for you.' }
  ],

  heroProducts: ['silk-pillowcase-champagne', 'silk-pillowcase-blush', 'silk-pillowcase-midnight'],
  heroOffer: '[[PLACEHOLDER]] Buy 3, get 1 free',
  newArrivals: ['silk-pillowcase-sage', 'silk-pillowcase-lavender', 'silk-pillowcase-gold'],
  qualityPicks: ['silk-pillowcase-champagne', 'the-sleep-set', 'silk-sleep-mask-champagne'],
  spotlightSlug: 'silk-pillowcase-champagne',

  promo: {
    tag: 'This week',
    heading: '[[PLACEHOLDER]] Buy 3, get 1 free',
    text: '[[PLACEHOLDER]] Mix any colours and any sizes. The cheapest of the four comes off at checkout.',
    code: 'SILK4',
    cta: 'Shop the offer'
  },

  testimonials,
  reviewsSummary,
  categoryContent,
  categoryOrder: CATEGORY_ORDER,
  products
};
