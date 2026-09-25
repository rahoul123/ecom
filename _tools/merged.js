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
      '100% mulberry silk, 22 momme',
      'Hidden zip, silk on both sides',
      'Machine washable on a delicate cycle'
    ],
    ingredients: ['[[PLACEHOLDER]] 100% mulberry silk', '[[PLACEHOLDER]] OEKO-TEX certified dye'],
    howItWorks: 'Slip it over your usual pillow and sleep on it. Wash cool on a delicate cycle, hang to dry.'
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
    benefits: ['[[PLACEHOLDER]] 22-momme mulberry silk', 'Adjustable, no-snag strap', 'Travel pouch included'],
    ingredients: ['[[PLACEHOLDER]] 100% mulberry silk'],
    howItWorks: 'Adjust the strap and wear it over the eyes. Hand wash cool.'
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
    benefits: ['[[PLACEHOLDER]] 22-momme mulberry silk', 'Adjustable, no-snag strap', 'Travel pouch included'],
    ingredients: ['[[PLACEHOLDER]] 100% mulberry silk'],
    howItWorks: 'Adjust the strap and wear it over the eyes. Hand wash cool.'
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
    benefits: ['[[PLACEHOLDER]] Three scrunchies per set', 'Soft elastic, holds without pulling', '22-momme mulberry silk'],
    ingredients: ['[[PLACEHOLDER]] 100% mulberry silk', '[[PLACEHOLDER]] Covered elastic'],
    howItWorks: 'Wear as you would any hair tie. Hand wash cool.'
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
    benefits: ['[[PLACEHOLDER]] Three scrunchies per set', 'Soft elastic, holds without pulling', '22-momme mulberry silk'],
    ingredients: ['[[PLACEHOLDER]] 100% mulberry silk', '[[PLACEHOLDER]] Covered elastic'],
    howItWorks: 'Wear as you would any hair tie. Hand wash cool.'
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
    benefits: ['[[PLACEHOLDER]] One pillowcase, one mask, one scrunchie set', 'Arrives gift-boxed', 'Cheaper than buying separately'],
    ingredients: ['[[PLACEHOLDER]] 100% mulberry silk throughout'],
    howItWorks: 'Follow the care label on each piece. Wash cool, hang to dry.'
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
    benefits: ['[[PLACEHOLDER]] Two 22-momme pillowcases', 'Mix or match the colours', 'Arrives gift-boxed'],
    ingredients: ['[[PLACEHOLDER]] 100% mulberry silk'],
    howItWorks: 'Wash cool on a delicate cycle, hang to dry.'
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
    benefits: ['[[PLACEHOLDER]] Pillowcase, mask, scrunchies and a travel pouch', 'Gift box and ribbon included', 'Add a handwritten note at checkout'],
    ingredients: ['[[PLACEHOLDER]] 100% mulberry silk throughout'],
    howItWorks: 'Follow the care label on each piece.'
  }
];

/* Sorted into the declared order so every menu reads the same way. */
products.sort((a, b) => CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category));

/* ==========================================================================
   Category page content.
   ========================================================================== */
const categoryContent = {
  Pillowcases: {
    intro: 'One pillowcase, every colour we make. 22-momme mulberry silk on both sides, with a hidden zip so nothing works loose in the wash.',
    pointsHeading: 'What every pillowcase has',
    points: [
      { title: 'Silk on both sides', text: 'Not silk on one face and cotton on the other.' },
      { title: 'Hidden zip', text: 'Stays put overnight, invisible when made up.' },
      { title: 'Washable at home', text: 'Cool delicate cycle, hang to dry. No dry cleaning.' }
    ]
  },
  'Sleep Masks': {
    intro: 'The same silk, cut for the eyes. Adjustable strap, travel pouch in the box.',
    pointsHeading: 'Made for actual sleep',
    points: [
      { title: 'Blocks the light', text: 'Contoured so it sits flush without pressing.' },
      { title: 'No-snag strap', text: 'Adjustable, and it will not catch your hair.' },
      { title: 'Comes with a pouch', text: 'Small enough to live in a bag.' }
    ]
  },
  Scrunchies: {
    intro: 'Sold in threes, in the same colours as the pillowcases.',
    pointsHeading: 'Why silk here too',
    points: [
      { title: 'Holds without pulling', text: 'Covered elastic, soft enough to sleep in.' },
      { title: 'Three per set', text: 'Neutrals or jewels.' },
      { title: 'Matches the range', text: 'Same silk, same colours.' }
    ]
  },
  Bundles: {
    intro: 'The range boxed together, at less than the pieces cost separately.',
    pointsHeading: 'Why buy a set',
    points: [
      { title: 'Cheaper together', text: 'Every set costs less than its pieces.' },
      { title: 'Gift-boxed', text: 'Ribbon on, note optional.' },
      { title: 'One delivery', text: 'Everything arrives at once.' }
    ]
  }
};

/* ==========================================================================
   Reviews. Fictional — replace with a real source before launch.
   ========================================================================== */
const testimonials = [
  { name: 'Amelia R.', role: 'Verified buyer', rating: 5,
    quote: 'I bought one to try and ordered three more the same week. My hair is noticeably less of a mess in the morning.' },
  { name: 'Priya S.', role: 'Verified buyer', rating: 5,
    quote: 'It washes beautifully. Six months in and the champagne one still looks like it did on day one.' },
  { name: 'Daniel K.', role: 'Verified buyer', rating: 5,
    quote: 'Bought the midnight as a gift and ended up keeping it. Ordered two more.' },
  { name: 'Hana M.', role: 'Verified buyer', rating: 4,
    quote: 'The zip is the detail that sold me — nothing slides off in the night.' },
  { name: 'Grace L.', role: 'Verified buyer', rating: 5,
    quote: 'The gift box arrived looking genuinely expensive. I did not need to wrap anything.' },
  { name: 'Sofia T.', role: 'Verified buyer', rating: 5,
    quote: 'Sleep mask and pillowcase in the same colour. Small thing, but it looks considered.' },
  { name: 'Noor A.', role: 'Verified buyer', rating: 5,
    quote: 'Delivery was quicker than the estimate and the packaging was lovely.' },
  { name: 'Elena V.', role: 'Verified buyer', rating: 4,
    quote: 'I was sceptical about the price. Having slept on it for a month, I get it now.' }
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
    heroLede: 'One pillowcase, every colour we make, silk on both sides. Kinder to hair and skin than cotton, and it washes at home.',
    primaryCta: 'Shop pillowcases',
    stepsHeading: 'From order to first night',
    stepsLede: 'Three steps, and then you sleep on it.',
    featuredHeading: 'Best Sellers — Pillowcases',
    featuredLede: 'The colours that go out the door fastest.',
    arrivalsLede: 'The newest colours in the collection.',
    picksLede: 'The three our customers rate highest, and the ones we would gift first.',
    reviewsHeading: 'What people say',
    reviewsLede: 'Fictional reviews shown for layout. Replace with a real review source before launch.',
    trustHeading: 'Why people keep reordering',
    trustLede: 'The things that matter once it is actually on your pillow.',
    ctaHeading: 'Sleep on it tonight',
    ctaLede: 'Pick a colour, check out securely, and it arrives gift-boxed.',
    shopLede: 'Every colour and every size, in one place.',
    aboutH1: 'We only wanted to get one thing right',
    aboutLede: 'A single pillowcase, made properly, in the colours people actually want.',
    aboutStoryHeading: 'Why just silk',
    aboutStory1: 'Lunelle started with one complaint: every silk pillowcase on the market was either silk on one side only, or so thin it did not survive a wash.',
    aboutStory2: 'So we made one. 22-momme mulberry silk on both faces, a hidden zip, and a dye that holds. Then we made it in every colour we would actually use ourselves, and stopped there.',
    aboutStory3: 'The range grows slowly on purpose. A sleep mask and a set of scrunchies in the same silk, and that is the whole shop.',
    aboutHowHeading: 'How it is made',
    aboutHowText: 'Every piece comes from the same mill and goes through the same checks.',
    faqLede: 'Sizing, washing, delivery and returns.',
    contactLede: 'A question about an order, a size or a colour? Send us a message.',
    shippingBlurb: 'Free delivery over $75, gift-boxed, with 60 nights to change your mind.',
    collectionEyebrow: 'The collection',
    collectionHeading: 'A little silk. A lot to love.',
    collectionLede: 'Every colour we make, in 22-momme mulberry silk, plus the mask and scrunchies that match them.'
  },

  heroProof: ['Free delivery over $75', '60-night trial', 'Gift-boxed'],

  /* ---- Everything below was inheriting the old telehealth defaults, which
     put a stethoscope and "licensed providers" on a pillowcase shop. ---- */

  trustBadges: [
    { icon: 'leaf', title: '22-momme mulberry silk', text: 'Silk on both sides, not one.' },
    { icon: 'refresh', title: '60-night trial', text: 'Sleep on it. Send it back if it is not for you.' },
    { icon: 'box', title: 'Gift-boxed as standard', text: 'Box and ribbon on every order.' },
    { icon: 'truck', title: 'Free delivery over $75', text: 'Tracked, and quicker than the estimate.' }
  ],

  productReassurance: [
    { icon: 'truck', text: 'Free delivery over $75' },
    { icon: 'box', text: 'Arrives gift-boxed' },
    { icon: 'refresh', text: '60 nights to change your mind' },
    { icon: 'lock', text: 'Secure checkout' }
  ],

  values: [
    { icon: 'leaf', title: 'One thing, done properly', text: 'A single pillowcase done properly, rather than a catalogue.' },
    { icon: 'shield', title: 'Silk on both faces', text: 'Not silk on one side and cotton on the other, which is the usual trick.' },
    { icon: 'refresh', title: 'Made to be washed', text: 'Cool delicate cycle at home. No dry cleaning, no hand washing.' },
    { icon: 'chat', title: 'Support that answers', text: 'Real people, replying within one business day.' }
  ],

  aboutPoints: [
    'Every piece is 22-momme mulberry silk',
    'Hidden zip on every pillowcase',
    'OEKO-TEX certified dyes',
    'Sixty nights to change your mind'
  ],

  faqs: [
    { q: 'What does 22-momme mean?', a: 'Momme measures the weight of silk. 22 is the point where it feels substantial and survives washing — thinner silk is cheaper to make and wears out faster.' },
    { q: 'Which size do I need?', a: 'Standard fits most pillows. Queen is a little longer, King noticeably so. If your pillow is deep, size up — the case should slip on without stretching.' },
    { q: 'How do I wash it?', a: 'Cool delicate cycle with a mild detergent, ideally in a mesh bag, then hang to dry. No tumble dryer, no bleach, no dry cleaning.' },
    { q: 'Is it silk on both sides?', a: 'Yes. Both faces are the same 22-momme mulberry silk. Some pillowcases are silk on one side and cotton on the other — ours are not.' },
    { q: 'What is the zip for?', a: 'It keeps the case on the pillow overnight and stops it working loose in the wash. It sits hidden along one edge.' },
    { q: 'Can I try it first?', a: 'Sixty nights. Sleep on it, wash it, and if it is not for you send it back for a refund.' },
    { q: 'Do the colours fade?', a: 'The dyes are OEKO-TEX certified and set for washing. Wash cool and dry out of direct sun and the colour holds.' },
    { q: 'How long does delivery take?', a: '[[PLACEHOLDER: confirm real timings]] Orders are packed within a business day. Delivery estimates are shown at checkout, and every order is tracked.' }
  ],

  stats: [
    { value: '230000', label: '[[PLACEHOLDER]] 5-star reviews', display: '230k+' },
    { value: '4.9', label: 'Average rating' },
    { value: '22', label: 'Momme mulberry silk' },
    { value: '60', label: 'Night trial' }
  ],


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
    { title: 'Pick your colour', text: 'Every colour, in three sizes. Swatches on each product page.' },
    { title: 'We box it up', text: 'Gift box and ribbon as standard, note optional at checkout.' },
    { title: 'Sleep on it', text: 'Sixty nights to decide. Send it back if it is not for you.' }
  ],

  heroProducts: ['silk-pillowcase-champagne', 'silk-pillowcase-blush', 'silk-pillowcase-midnight'],
  heroOffer: '[[PLACEHOLDER]] Buy 3, get 1 free',
  newArrivals: ['silk-pillowcase-sage', 'silk-pillowcase-lavender', 'silk-pillowcase-gold'],
  qualityPicks: ['silk-pillowcase-champagne', 'the-sleep-set', 'silk-sleep-mask-champagne'],
  spotlightSlug: 'silk-pillowcase-champagne',

  promo: {
    tag: 'This week',
    heading: 'Buy 3, get 1 free',
    text: 'Mix any colours and any sizes. The cheapest of the four comes off at checkout.',
    code: 'SILK4',
    cta: 'Shop the offer'
  },

  testimonials,
  reviewsSummary,
  categoryContent,
  categoryOrder: CATEGORY_ORDER,
  products
};
