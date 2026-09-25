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
  /* ---- Pillowcases (10 products) ---- */
  pillowcase('Champagne', SILK.champagne, 89, 109, 4.9, 4820, 'Best seller', true),
  pillowcase('Ivory', SILK.ivory, 89, 109, 4.9, 3140, null, true),
  pillowcase('Blush', SILK.blush, 89, 109, 4.8, 2760, null, true),
  pillowcase('Midnight', SILK.midnight, 89, 109, 4.9, 2210, null, true),
  pillowcase('Sage', SILK.sage, 89, null, 4.8, 1180, 'New', false),
  pillowcase('Lavender', SILK.lavender, 89, null, 4.8, 960, 'New', false),
  pillowcase('Pearl', SILK.pearl, 89, 109, 4.7, 1540, null, false),
  pillowcase('Gold', SILK.gold, 99, 124, 4.9, 870, 'New', false),
  pillowcase('Rose', SILK.rose, 89, 109, 4.8, 1240, null, false),
  pillowcase('Charcoal', SILK.charcoal, 89, 109, 4.9, 1680, null, false),

  /* ---- Sleep Masks (10 products) ---- */
  {
    slug: 'silk-sleep-mask-champagne',
    name: 'Silk Sleep Mask — Champagne',
    category: 'Sleep Masks',
    swatch: SILK.champagne,
    colour: 'Champagne',
    shortBenefit: 'Blocks the light, adjustable strap.',
    price: 39, compareAt: 49, rating: 4.8, reviewCount: 1420, badge: 'Popular', featured: true,
    optionLabel: 'Fit', options: ['One size'],
    benefits: ['22-momme mulberry silk', 'Adjustable, no-snag strap', 'Travel pouch included'],
    ingredients: ['100% mulberry silk'],
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
    benefits: ['22-momme mulberry silk', 'Adjustable, no-snag strap', 'Travel pouch included'],
    ingredients: ['100% mulberry silk'],
    howItWorks: 'Adjust the strap and wear it over the eyes. Hand wash cool.'
  },
  {
    slug: 'silk-sleep-mask-ivory',
    name: 'Silk Sleep Mask — Ivory',
    category: 'Sleep Masks',
    swatch: SILK.ivory,
    colour: 'Ivory',
    shortBenefit: 'Pure silk contour mask for restful sleep.',
    price: 39, compareAt: 49, rating: 4.8, reviewCount: 840, badge: null, featured: false,
    optionLabel: 'Fit', options: ['One size'],
    benefits: ['22-momme mulberry silk', 'Light-blocking design', 'Travel pouch included'],
    ingredients: ['100% mulberry silk'],
    howItWorks: 'Adjust strap for a snug fit. Hand wash cool.'
  },
  {
    slug: 'silk-sleep-mask-blush',
    name: 'Silk Sleep Mask — Blush',
    category: 'Sleep Masks',
    swatch: SILK.blush,
    colour: 'Blush',
    shortBenefit: 'Gentle on eyes and lashes.',
    price: 39, compareAt: 49, rating: 4.9, reviewCount: 920, badge: 'Best Seller', featured: false,
    optionLabel: 'Fit', options: ['One size'],
    benefits: ['22-momme mulberry silk', 'Smooth plush inner layer', 'Gentle strap'],
    ingredients: ['100% mulberry silk'],
    howItWorks: 'Place over eyes before sleep.'
  },
  {
    slug: 'silk-sleep-mask-rose',
    name: 'Silk Sleep Mask — Rose',
    category: 'Sleep Masks',
    swatch: SILK.rose,
    colour: 'Rose',
    shortBenefit: 'Deep light blocking for travel or home.',
    price: 39, compareAt: null, rating: 4.8, reviewCount: 650, badge: null, featured: false,
    optionLabel: 'Fit', options: ['One size'],
    benefits: ['Ultra-soft silk padding', 'Breathable natural fabric', 'No-tangle elastic'],
    ingredients: ['100% mulberry silk'],
    howItWorks: 'Adjust strap and rest peacefully.'
  },
  {
    slug: 'silk-sleep-mask-sage',
    name: 'Silk Sleep Mask — Sage',
    category: 'Sleep Masks',
    swatch: SILK.sage,
    colour: 'Sage',
    shortBenefit: 'Calming sage tone in 22-momme silk.',
    price: 39, compareAt: null, rating: 4.7, reviewCount: 510, badge: 'New', featured: false,
    optionLabel: 'Fit', options: ['One size'],
    benefits: ['Soothing natural silk', 'Protects delicate eye skin', 'Includes storage pouch'],
    ingredients: ['100% mulberry silk'],
    howItWorks: 'Adjust strap to your comfort level.'
  },
  {
    slug: 'silk-sleep-mask-lavender',
    name: 'Silk Sleep Mask — Lavender',
    category: 'Sleep Masks',
    swatch: SILK.lavender,
    colour: 'Lavender',
    shortBenefit: 'Soft lavender silk mask.',
    price: 39, compareAt: null, rating: 4.8, reviewCount: 430, badge: 'New', featured: false,
    optionLabel: 'Fit', options: ['One size'],
    benefits: ['Hypoallergenic mulberry silk', 'Completely blackout', 'Elastic band covered in silk'],
    ingredients: ['100% mulberry silk'],
    howItWorks: 'Wear comfortably overnight.'
  },
  {
    slug: 'silk-sleep-mask-pearl',
    name: 'Silk Sleep Mask — Pearl',
    category: 'Sleep Masks',
    swatch: SILK.pearl,
    colour: 'Pearl',
    shortBenefit: 'Luminous pearl silk mask.',
    price: 39, compareAt: 49, rating: 4.8, reviewCount: 760, badge: null, featured: false,
    optionLabel: 'Fit', options: ['One size'],
    benefits: ['22-momme pure silk', 'Smooth texture prevents creasing', 'Lightweight design'],
    ingredients: ['100% mulberry silk'],
    howItWorks: 'Hand wash cool and dry flat.'
  },
  {
    slug: 'silk-sleep-mask-gold',
    name: 'Silk Sleep Mask — Gold',
    category: 'Sleep Masks',
    swatch: SILK.gold,
    colour: 'Gold',
    shortBenefit: 'Luxurious gold silk with blackout padding.',
    price: 45, compareAt: 55, rating: 4.9, reviewCount: 380, badge: 'Limited Edition', featured: false,
    optionLabel: 'Fit', options: ['One size'],
    benefits: ['Premium gold mulberry silk', 'Padded for ultimate light block', 'Gift box included'],
    ingredients: ['100% mulberry silk'],
    howItWorks: 'Fit strap around head gently.'
  },
  {
    slug: 'silk-sleep-mask-charcoal',
    name: 'Silk Sleep Mask — Charcoal',
    category: 'Sleep Masks',
    swatch: SILK.charcoal,
    colour: 'Charcoal',
    shortBenefit: 'Deep charcoal shade for total blackout.',
    price: 39, compareAt: null, rating: 4.8, reviewCount: 590, badge: null, featured: false,
    optionLabel: 'Fit', options: ['One size'],
    benefits: ['Dark weave for 100% blackout', 'Cooling silk feel', 'Strap covered in soft silk'],
    ingredients: ['100% mulberry silk'],
    howItWorks: 'Adjust and wear for night or travel.'
  },

  /* ---- Scrunchies (10 products) ---- */
  {
    slug: 'silk-scrunchies-neutrals',
    name: 'Silk Scrunchies — Neutrals',
    category: 'Scrunchies',
    swatch: SILK.ivory,
    colour: 'Neutrals',
    shortBenefit: 'Set of three, no-crease.',
    price: 29, compareAt: 36, rating: 4.7, reviewCount: 2310, badge: null, featured: false,
    optionLabel: 'Set', options: ['Set of 3'],
    benefits: ['Three scrunchies per set', 'Soft elastic, holds without pulling', '22-momme mulberry silk'],
    ingredients: ['100% mulberry silk', 'Covered elastic'],
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
    benefits: ['Three scrunchies per set', 'Soft elastic, holds without pulling', '22-momme mulberry silk'],
    ingredients: ['100% mulberry silk', 'Covered elastic'],
    howItWorks: 'Wear as you would any hair tie. Hand wash cool.'
  },
  {
    slug: 'silk-scrunchies-champagne-trio',
    name: 'Silk Scrunchies — Champagne Trio',
    category: 'Scrunchies',
    swatch: SILK.champagne,
    colour: 'Champagne',
    shortBenefit: 'Three Champagne silk scrunchies.',
    price: 29, compareAt: 36, rating: 4.9, reviewCount: 1840, badge: 'Best Seller', featured: false,
    optionLabel: 'Set', options: ['Set of 3'],
    benefits: ['Gentle on hair shafts', 'Reduces breakage & dents', '22-momme mulberry silk'],
    ingredients: ['100% mulberry silk'],
    howItWorks: 'Wrap around hair 2-3 times.'
  },
  {
    slug: 'silk-scrunchies-midnight-trio',
    name: 'Silk Scrunchies — Midnight Trio',
    category: 'Scrunchies',
    swatch: SILK.midnight,
    colour: 'Midnight',
    shortBenefit: 'Three Midnight navy silk scrunchies.',
    price: 29, compareAt: 36, rating: 4.8, reviewCount: 1290, badge: null, featured: false,
    optionLabel: 'Set', options: ['Set of 3'],
    benefits: ['Sleek dark silk finish', 'Prevents frizz and split ends', 'Durable inner band'],
    ingredients: ['100% mulberry silk'],
    howItWorks: 'Ideal for sleep buns or daytime styles.'
  },
  {
    slug: 'silk-scrunchies-blush-trio',
    name: 'Silk Scrunchies — Blush Trio',
    category: 'Scrunchies',
    swatch: SILK.blush,
    colour: 'Blush',
    shortBenefit: 'Three romantic Blush pink scrunchies.',
    price: 29, compareAt: null, rating: 4.8, reviewCount: 940, badge: null, featured: false,
    optionLabel: 'Set', options: ['Set of 3'],
    benefits: ['Soft blush tone', 'Glides off hair smoothly', '100% pure silk outer'],
    ingredients: ['100% mulberry silk'],
    howItWorks: 'Gentle hold for all hair types.'
  },
  {
    slug: 'silk-scrunchies-rose-trio',
    name: 'Silk Scrunchies — Rose Trio',
    category: 'Scrunchies',
    swatch: SILK.rose,
    colour: 'Rose',
    shortBenefit: 'Three elegant Rose silk scrunchies.',
    price: 29, compareAt: 36, rating: 4.7, reviewCount: 720, badge: null, featured: false,
    optionLabel: 'Set', options: ['Set of 3'],
    benefits: ['Deep rose hue', 'Snag-free hold', 'Machine washable delicate'],
    ingredients: ['100% mulberry silk'],
    howItWorks: 'Use daily to prevent hair damage.'
  },
  {
    slug: 'silk-scrunchies-sage-trio',
    name: 'Silk Scrunchies — Sage Trio',
    category: 'Scrunchies',
    swatch: SILK.sage,
    colour: 'Sage',
    shortBenefit: 'Three soothing Sage silk scrunchies.',
    price: 29, compareAt: null, rating: 4.8, reviewCount: 580, badge: 'New', featured: false,
    optionLabel: 'Set', options: ['Set of 3'],
    benefits: ['Modern pastel green', 'Holds tight without headaches', '22-momme grade silk'],
    ingredients: ['100% mulberry silk'],
    howItWorks: 'Wrap gently around ponytails or buns.'
  },
  {
    slug: 'silk-scrunchies-lavender-trio',
    name: 'Silk Scrunchies — Lavender Trio',
    category: 'Scrunchies',
    swatch: SILK.lavender,
    colour: 'Lavender',
    shortBenefit: 'Three soft Lavender silk hair ties.',
    price: 29, compareAt: null, rating: 4.8, reviewCount: 490, badge: 'New', featured: false,
    optionLabel: 'Set', options: ['Set of 3'],
    benefits: ['Dreamy lavender tint', 'Non-damaging elastic', 'Ultra smooth finish'],
    ingredients: ['100% mulberry silk'],
    howItWorks: 'Perfect for overnight hair protection.'
  },
  {
    slug: 'silk-scrunchies-pearl-gold',
    name: 'Silk Scrunchies — Pearl & Gold Set',
    category: 'Scrunchies',
    swatch: SILK.gold,
    colour: 'Gold',
    shortBenefit: 'Premium 4-pack of Pearl and Gold scrunchies.',
    price: 34, compareAt: 42, rating: 4.9, reviewCount: 630, badge: 'Special Value', featured: false,
    optionLabel: 'Set', options: ['Set of 4'],
    benefits: ['Includes 2 Pearl & 2 Gold scrunchies', 'High shine finish', 'Great for gifting'],
    ingredients: ['100% mulberry silk'],
    howItWorks: 'Mix and match for styles.'
  },
  {
    slug: 'silk-scrunchies-charcoal-trio',
    name: 'Silk Scrunchies — Charcoal Trio',
    category: 'Scrunchies',
    swatch: SILK.charcoal,
    colour: 'Charcoal',
    shortBenefit: 'Three versatile Charcoal grey scrunchies.',
    price: 29, compareAt: 36, rating: 4.8, reviewCount: 810, badge: null, featured: false,
    optionLabel: 'Set', options: ['Set of 3'],
    benefits: ['Classic neutral charcoal', 'Strong hold for thick hair', 'Smooth silk exterior'],
    ingredients: ['100% mulberry silk'],
    howItWorks: 'Hand wash cool.'
  },

  /* ---- Bundles (10 products) ---- */
  {
    slug: 'the-sleep-set',
    name: 'The Sleep Set',
    category: 'Bundles',
    swatch: SILK.rose,
    colour: 'Blush',
    shortBenefit: 'Pillowcase, sleep mask and scrunchies.',
    price: 139, compareAt: 179, rating: 4.9, reviewCount: 1640, badge: 'Save 22%', featured: true,
    optionLabel: 'Size', options: ['Standard', 'Queen', 'King'],
    benefits: ['One pillowcase, one mask, one scrunchie set', 'Arrives gift-boxed', 'Cheaper than buying separately'],
    ingredients: ['100% mulberry silk throughout'],
    howItWorks: 'Follow the care label on each piece. Wash cool, hang to dry.'
  },
  {
    slug: 'the-pillowcase-pair',
    name: 'The Pillowcase Pair',
    category: 'Bundles',
    swatch: SILK.pearl,
    colour: 'Pearl',
    shortBenefit: 'Two pillowcases, one for each side.',
    price: 159, compareAt: 198, rating: 4.9, reviewCount: 920, badge: 'Buy 2 & Save', featured: false,
    optionLabel: 'Size', options: ['Standard', 'Queen', 'King'],
    benefits: ['Two 22-momme pillowcases', 'Mix or match the colours', 'Arrives gift-boxed'],
    ingredients: ['100% mulberry silk'],
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
    benefits: ['Pillowcase, mask, scrunchies and a travel pouch', 'Gift box and ribbon included', 'Add a handwritten note at checkout'],
    ingredients: ['100% mulberry silk throughout'],
    howItWorks: 'Follow the care label on each piece.'
  },
  {
    slug: 'the-deluxe-silk-set',
    name: 'The Deluxe Silk Set',
    category: 'Bundles',
    swatch: SILK.midnight,
    colour: 'Midnight',
    shortBenefit: 'Two pillowcases, two masks, and 6 scrunchies.',
    price: 229, compareAt: 289, rating: 5.0, reviewCount: 780, badge: 'Save 25%', featured: true,
    optionLabel: 'Size', options: ['Standard', 'Queen', 'King'],
    benefits: ['Complete set for couples', 'Premium gift box presentation', 'Maximum savings bundle'],
    ingredients: ['100% mulberry silk throughout'],
    howItWorks: 'Unbox and enjoy total silk luxury.'
  },
  {
    slug: 'the-travel-companion',
    name: 'The Travel Companion Set',
    category: 'Bundles',
    swatch: SILK.champagne,
    colour: 'Champagne',
    shortBenefit: 'Sleep mask, scrunchie & silk travel pouch.',
    price: 89, compareAt: 115, rating: 4.8, reviewCount: 640, badge: 'Travel Pack', featured: false,
    optionLabel: 'Size', options: ['One size'],
    benefits: ['Includes silk mask & scrunchie', 'Custom compact carry pouch', 'Ideal for flights and hotel stays'],
    ingredients: ['100% mulberry silk'],
    howItWorks: 'Pack in carry-on bag.'
  },
  {
    slug: 'the-weekend-luxe-bundle',
    name: 'The Weekend Luxe Bundle',
    category: 'Bundles',
    swatch: SILK.sage,
    colour: 'Sage',
    shortBenefit: 'Pillowcase & sleep mask in soothing Sage.',
    price: 119, compareAt: 148, rating: 4.9, reviewCount: 490, badge: 'Save 20%', featured: false,
    optionLabel: 'Size', options: ['Standard', 'Queen', 'King'],
    benefits: ['Color-matched pillowcase & mask', '22-momme mulberry silk', 'Gift packaging'],
    ingredients: ['100% mulberry silk'],
    howItWorks: 'Wash cool, dry in shade.'
  },
  {
    slug: 'the-bedtime-essentials',
    name: 'The Bedtime Essentials Bundle',
    category: 'Bundles',
    swatch: SILK.ivory,
    colour: 'Ivory',
    shortBenefit: 'Pillowcase and set of 3 scrunchies.',
    price: 109, compareAt: 135, rating: 4.9, reviewCount: 870, badge: 'Popular', featured: false,
    optionLabel: 'Size', options: ['Standard', 'Queen', 'King'],
    benefits: ['Ivory pillowcase with matching scrunchies', 'Protects hair and skin overnight', 'Delicate wash approved'],
    ingredients: ['100% mulberry silk'],
    howItWorks: 'Use daily for skin and hair health.'
  },
  {
    slug: 'the-silk-trio-pack',
    name: 'The Silk Trio Pack',
    category: 'Bundles',
    swatch: SILK.lavender,
    colour: 'Lavender',
    shortBenefit: 'Three silk pillowcases in pastel tones.',
    price: 239, compareAt: 297, rating: 4.9, reviewCount: 350, badge: 'Best Value', featured: false,
    optionLabel: 'Size', options: ['Standard', 'Queen', 'King'],
    benefits: ['Three pillowcases in Lavender, Sage, Pearl', 'Save $58 vs buying individual items', 'Great for laundry rotation'],
    ingredients: ['100% mulberry silk'],
    howItWorks: 'Rotate weekly for fresh sleep.'
  },
  {
    slug: 'the-ultimate-glow-kit',
    name: 'The Ultimate Glow Kit',
    category: 'Bundles',
    swatch: SILK.blush,
    colour: 'Blush',
    shortBenefit: 'Blush pillowcase, sleep mask, and face band.',
    price: 149, compareAt: 185, rating: 4.9, reviewCount: 520, badge: 'Gift Choice', featured: false,
    optionLabel: 'Size', options: ['Standard', 'Queen', 'King'],
    benefits: ['Complete night skin routine kit', 'Ultra gentle on sensitive skin', 'Beautiful gift presentation'],
    ingredients: ['100% mulberry silk'],
    howItWorks: 'Incorporate into nighttime beauty ritual.'
  },
  {
    slug: 'the-double-pillowcase-mask-set',
    name: 'The Double Pillowcase & Mask Set',
    category: 'Bundles',
    swatch: SILK.charcoal,
    colour: 'Charcoal',
    shortBenefit: '2 Charcoal pillowcases + 2 Charcoal sleep masks.',
    price: 185, compareAt: 235, rating: 4.8, reviewCount: 410, badge: 'Save 21%', featured: false,
    optionLabel: 'Size', options: ['Standard', 'Queen', 'King'],
    benefits: ['Set of 2 pillowcases and 2 masks', 'Matching deep charcoal aesthetic', 'Hypoallergenic and breathable'],
    ingredients: ['100% mulberry silk'],
    howItWorks: 'Machine wash cool.'
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

  /* Silk is bought once, not subscribed to. No supply note, and no months
     to choose from — every product here names its own sizes or sets. */
  priceNote: null,
  optionLabel: 'Option',
  productOptions: [],

  shipping: { freeOver: 75, flatRate: 6.95 },

  /* No provider connected yet — the checkout confirms the order and says
     plainly that nothing was charged. See README -> Payments. */
  payment: { provider: 'none', url: '', endpoint: '' },

  /* Delivery options offered at checkout. The first is the default, and any
     method carrying freeOver drops to nothing once the basket clears it —
     which is what the free-delivery promise on the product pages refers to. */
  shippingMethods: [
    { id: 'standard', label: 'Standard delivery', eta: '5-8 business days', price: 6.95, freeOver: 75 },
    { id: 'express', label: 'Express delivery', eta: '2-3 business days', price: 14.95 },
    { id: 'priority', label: 'Priority overnight', eta: 'Next business day if ordered before 2pm', price: 29.95 }
  ],

  /* Discount codes. These live in the page, so a determined visitor can read
     them straight out of the source — fine for a launch code, wrong for
     anything you would not print on a postcard. Real validation belongs on a
     payment provider's side once one is connected. */
  discounts: [
    { code: 'SILK10', kind: 'percent', value: 10, label: '10% off your order' },
    { code: 'WELCOME15', kind: 'amount', value: 15, label: '$15 off your order' },
    { code: 'FREESILK', kind: 'shipping', value: 0, label: 'Free delivery' }
  ],

  /* The reassurance rail beside the order summary. */
  checkoutTrust: [
    { icon: 'lock', label: 'Secure checkout' },
    { icon: 'truck', label: 'Fast shipping' },
    { icon: 'chat', label: 'Real people, real help' }
  ],

  guarantees: [
    { title: '60-night sleep guarantee', body: 'Sleep on it for two months. If it is not for you, send it back for a full refund.' },
    { title: 'Over 250,000 cases shipped', body: '[[PLACEHOLDER: replace with your own figure once you have one.]]' }
  ],

  /* Express wallet buttons. They are presentational until a provider is
     connected — see the note in checkout.js. */
  expressPay: [
    { id: 'shoppay', label: 'Shop Pay' },
    { id: 'paypal', label: 'PayPal' },
    { id: 'gpay', label: 'G Pay' }
  ],

  copy: {
    buyCta: 'Add to cart',
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
