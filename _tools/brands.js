/* ==========================================================================
   BRANDS.JS — source data for all 5 placeholder brands.
   Used ONCE by _tools/generate.js to scaffold each brand folder.

   After generation, the live source of truth for each brand is
   <brand>/js/brand-config.js. generate.js will NOT overwrite that file if it
   already exists, so your edits are safe.

   ALL CONTENT HERE IS FICTIONAL PLACEHOLDER COPY.
   No medical claims, no dosages, no efficacy statistics — deliberately.
   ========================================================================== */

/* Shared structural content. Brands override anything they need to. */
const common = {
  currency: { symbol: '$', code: 'USD', decimals: 2 },

  productReassurance: [
    { icon: 'truck', text: 'Free shipping on orders over $50' },
    { icon: 'box', text: 'Plain, unbranded outer packaging' },
    { icon: 'refresh', text: '30-day return window on unopened items' },
    { icon: 'lock', text: 'Secure checkout' }
  ],

  trustBadges: [
    { icon: 'stethoscope', title: 'Licensed providers', text: '[[PLACEHOLDER: substantiate before launch]]' },
    { icon: 'lock', title: 'Secure checkout', text: 'Payments handled by an encrypted provider.' },
    { icon: 'box', title: 'Discreet packaging', text: 'Plain outer packaging, no branding outside.' },
    { icon: 'refresh', title: 'Money-back guarantee', text: '[[PLACEHOLDER: confirm real terms]]' }
  ],

  values: [
    { icon: 'shield', title: 'Transparent by default', text: '[[PLACEHOLDER]] Full ingredient lists and honest labelling on everything we sell.' },
    { icon: 'stethoscope', title: 'Guided by professionals', text: '[[PLACEHOLDER]] Our range is reviewed by qualified practitioners.' },
    { icon: 'leaf', title: 'Thoughtfully sourced', text: '[[PLACEHOLDER]] We work with suppliers who meet our quality standards.' },
    { icon: 'chat', title: 'Support that answers', text: '[[PLACEHOLDER]] Real people, replying within one business day.' }
  ],

  stats: [
    { value: '10k+', label: '[[PLACEHOLDER]] orders delivered' },
    { value: '4.8', label: '[[PLACEHOLDER]] average rating' },
    { value: '24h', label: '[[PLACEHOLDER]] support response' },
    { value: '30d', label: '[[PLACEHOLDER]] returns window' }
  ],

  aboutPoints: [
    '[[PLACEHOLDER]] Every product reviewed before it joins the range',
    '[[PLACEHOLDER]] Clear ingredient lists, no proprietary blends',
    '[[PLACEHOLDER]] Plain packaging on every order',
    '[[PLACEHOLDER]] Cancel or change a subscription at any time'
  ],

  faqs: [
    { q: 'How do I place an order?', a: '[[PLACEHOLDER]] Choose the product you want and select Buy now. You will be taken to our secure store to complete checkout.' },
    { q: 'How long does delivery take?', a: '[[PLACEHOLDER: confirm real timings]] Orders are usually prepared for dispatch within a couple of business days. Delivery estimates are shown at checkout.' },
    { q: 'Is the packaging discreet?', a: '[[PLACEHOLDER]] Yes. Orders arrive in plain outer packaging with no product branding on the outside.' },
    { q: 'Can I return something?', a: '[[PLACEHOLDER: confirm real policy]] Unopened items can be returned within the window shown at checkout. Some health and personal care items cannot be returned once opened.' },
    { q: 'Do you offer a subscription?', a: '[[PLACEHOLDER]] Where a repeat option is available it is shown on the product page at checkout, and you can change or cancel it at any time.' },
    { q: 'Should I speak to a healthcare professional first?', a: '[[PLACEHOLDER]] If you are pregnant or breastfeeding, take prescription medicine, or have an existing medical condition, speak to a qualified healthcare professional before starting anything new. See our medical disclaimer.' },
    { q: 'How do I contact support?', a: '[[PLACEHOLDER]] Use the contact form, or email us directly. We aim to reply within one business day.' },
    { q: 'Where do you ship?', a: '[[PLACEHOLDER: list real destinations]] Shipping destinations and rates are shown at checkout.' }
  ],

  marquee: [
    'Free shipping over $50',
    'Plain, unbranded packaging',
    '30-day returns',
    'Cancel anytime',
    'Support replies in 24h',
    'Full ingredient lists'
  ],


  promo: {
    tag: 'Limited offer',
    heading: '[[PLACEHOLDER]] 15% off your first order',
    text: '[[PLACEHOLDER]] Applies to everything in the range. One use per customer.',
    code: 'WELCOME15',
    cta: 'Shop the offer'
  },


  copy: {
    primaryCta: 'Shop now',
    shopLede: '[[PLACEHOLDER]] Browse the full range. Filter by category or price to narrow things down.',
    faqLede: '[[PLACEHOLDER]] Everything people usually ask about ordering, delivery and returns.',
    contactLede: '[[PLACEHOLDER]] Questions about an order, a product or a return? Send us a message and we will get back to you.',
    shippingBlurb: '[[PLACEHOLDER]] Free shipping over $50, plain outer packaging, and a 30-day return window on unopened items.',
    trustHeading: 'Built to be worth trusting',
    trustLede: '[[PLACEHOLDER]] The things we think matter most when you are buying something for your health.',
    reviewsLede: '[[PLACEHOLDER]] Fictional reviews shown for layout purposes only.',
    arrivalsLede: '[[PLACEHOLDER]] The newest products in the range.',
    picksLede: '[[PLACEHOLDER]] The three our customers rate highest.'
  }
};

/* -------------------------------------------------------------------------- */

const brands = [

  /* ======================================================== 1. VITALITY RX */
  {
    slug: 'vitality-rx',
    name: 'Vitality Rx',
    domain: 'vitality-rx-placeholder.com',
    legalEntity: 'Vitality Rx Ltd',
    tagline: 'Everyday support for men who want to stay ahead of it.',
    announcement: 'Free discreet shipping on orders over $50',
    niche: "Men's daily health",

    fonts: {
      link: '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Sora:wght@600;700&display=swap" rel="stylesheet">',
      heading: "'Sora', 'Segoe UI', system-ui, sans-serif",
      body: "'Inter', 'Segoe UI', system-ui, sans-serif",
      headingWeight: '600',
      tracking: '-1.5px'
    },
    colors: {
      background: '#ffffff', surface: '#f4f7f7', soft: '#eef4f3',
      text: '#0f2d3d', heading: '#0b2331', muted: '#5a7280',
      border: '#dde7e8', borderStrong: '#c3d3d5',
      accent: '#0e7c66', accentHover: '#0a5f4e', accentTint: '#e2f1ed', onAccent: '#ffffff',
      footerBg: '#0b2331', footerText: '#c2d4d9', star: '#e0a12c'
    },
    style: { radius: '14px', radiusLarge: '18px', buttonRadius: '999px', cardStyle: 'bordered', logoWidth: '150px' },

    contact: {
      email: 'support@vitality-rx-placeholder.com',
      phone: '+1 (555) 010-4477',
      hours: 'Mon–Fri, 9am–6pm ET',
      address: '[[PLACEHOLDER: registered business address]]'
    },

    copy: {
      heroEyebrow: 'Men’s daily health',
      heroH1: 'Daily support, without the guesswork.',
      heroLede: '[[PLACEHOLDER]] A focused range built around the basics — energy, sleep and daily nutrition — with clear labels and nothing hidden behind proprietary blends.',
      primaryCta: 'Start now',
      heroCardTitle: '4.8 out of 5',
      heroCardText: '[[PLACEHOLDER]] from 2,400+ reviews',
      stepsHeading: 'Three steps, then it just arrives',
      stepsLede: '[[PLACEHOLDER]] No appointments to book, no queues to sit in.',
      featuredHeading: 'Where most people start',
      featuredLede: '[[PLACEHOLDER]] The four products our customers order most often.',
      reviewsHeading: 'What men tell us',
      ctaHeading: 'Ready when you are',
      ctaLede: '[[PLACEHOLDER]] Pick a product, check out securely, and get it delivered in plain packaging.',
      aboutH1: 'We built the range we wanted to buy',
      aboutLede: '[[PLACEHOLDER]] Straightforward products for men who would rather not think about it twice.',
      aboutStoryHeading: 'It started with a frustrating shelf',
      aboutStory1: '[[PLACEHOLDER]] Vitality Rx began because buying anything for your health online felt like work — labels that hid behind blends, claims that stretched further than the evidence, and checkout pages that felt like a gamble.',
      aboutStory2: '[[PLACEHOLDER]] We decided to build the opposite. A short range instead of an endless catalogue. Full ingredient lists on every product. Plain packaging, plainly priced, with support you can actually reach.',
      aboutStory3: '[[PLACEHOLDER]] We are a small team, and the range grows slowly on purpose. If something does not earn its place, it does not go on the shelf.',
      aboutHowHeading: 'How we choose what to sell',
      aboutHowText: '[[PLACEHOLDER]] Every product in the range goes through the same review before it goes live.'
    },

    heroProof: ['Licensed providers', 'Discreet packaging', 'Cancel anytime'],
    valueProps: [
      { icon: 'truck', text: 'Free shipping over $50' },
      { icon: 'box', text: 'Plain packaging' },
      { icon: 'refresh', text: '30-day returns' },
      { icon: 'chat', text: 'Support in 24h' }
    ],
    howItWorks: [
      { title: 'Tell us your goal', text: '[[PLACEHOLDER]] Answer a few quick questions so we can point you at the right part of the range.' },
      { title: 'Get matched', text: '[[PLACEHOLDER]] We suggest products that fit what you told us, with the full ingredient list for each.' },
      { title: 'Delivered discreetly', text: '[[PLACEHOLDER]] Your order arrives in plain outer packaging, on a schedule you control.' }
    ],
    testimonials: [
      { name: 'Daniel R.', role: '[[PLACEHOLDER]] Verified customer', rating: 5, quote: '[[PLACEHOLDER]] Ordering was simple and it turned up faster than I expected. The packaging was completely plain, which I appreciated.' },
      { name: 'Marcus T.', role: '[[PLACEHOLDER]] Verified customer', rating: 5, quote: '[[PLACEHOLDER]] I like that the label actually tells you what is in it. No mystery blend, no fine print I needed a magnifying glass for.' },
      { name: 'Omar J.', role: '[[PLACEHOLDER]] Verified customer', rating: 4, quote: '[[PLACEHOLDER]] Support answered my question the same day. Straightforward to reorder when I ran low.' }
    ],

    products: [
      { slug: 'daily-foundation', name: 'Daily Foundation', category: 'Daily essentials', price: 42, compareAt: 52, rating: 4.8, reviewCount: 612, badge: 'Best seller', featured: true,
        shortBenefit: 'A once-a-day base for a routine you will actually keep to.',
        benefits: ['One capsule, once a day', 'Full ingredient list on the label', 'No proprietary blends'],
        ingredients: ['[[PLACEHOLDER: ingredient one]]', '[[PLACEHOLDER: ingredient two]]', '[[PLACEHOLDER: ingredient three]]'],
        howItWorks: '[[PLACEHOLDER]] Take as directed on the label as part of your daily routine. Speak to a healthcare professional before starting anything new.' },

      { slug: 'evening-wind-down', name: 'Evening Wind Down', category: 'Sleep & recovery', price: 38, compareAt: 46, rating: 4.7, reviewCount: 431, badge: null, featured: true,
        shortBenefit: 'Formulated to support your evening routine.',
        benefits: ['Designed for the end of the day', 'Clearly labelled contents', 'Comes in a 30-day supply'],
        ingredients: ['[[PLACEHOLDER: ingredient one]]', '[[PLACEHOLDER: ingredient two]]', '[[PLACEHOLDER: ingredient three]]'],
        howItWorks: '[[PLACEHOLDER]] Use as directed on the label in the evening. Speak to a healthcare professional before starting anything new.' },

      { slug: 'focus-support', name: 'Focus Support', category: 'Daily essentials', price: 46, compareAt: null, rating: 4.6, reviewCount: 288, badge: null, featured: true,
        shortBenefit: 'Made for the middle of a long day.',
        benefits: ['Convenient daily format', 'Transparent labelling', 'Fits alongside the rest of the range'],
        ingredients: ['[[PLACEHOLDER: ingredient one]]', '[[PLACEHOLDER: ingredient two]]', '[[PLACEHOLDER: ingredient three]]'],
        howItWorks: '[[PLACEHOLDER]] Take as directed on the label. Speak to a healthcare professional before starting anything new.' },

      { slug: 'hair-thickening-serum', name: 'Thickening Serum', category: 'Hair & skin', price: 54, compareAt: 68, rating: 4.5, reviewCount: 356, badge: 'New', featured: true,
        shortBenefit: 'A daily topical step for your routine.',
        benefits: ['Lightweight, non-greasy formula', 'Applied once daily', 'Unscented'],
        ingredients: ['[[PLACEHOLDER: ingredient one]]', '[[PLACEHOLDER: ingredient two]]', '[[PLACEHOLDER: ingredient three]]'],
        howItWorks: '[[PLACEHOLDER]] Apply to clean, dry skin as directed on the label. Patch test before first use.' },

      { slug: 'post-training-recovery', name: 'Post-Training Recovery', category: 'Sleep & recovery', price: 44, compareAt: null, rating: 4.7, reviewCount: 197, badge: null, featured: false,
        shortBenefit: 'Built into the part of the day you already plan around.',
        benefits: ['Mixes into water or a shake', 'Unflavoured option available', '30 servings per tub'],
        ingredients: ['[[PLACEHOLDER: ingredient one]]', '[[PLACEHOLDER: ingredient two]]', '[[PLACEHOLDER: ingredient three]]'],
        howItWorks: '[[PLACEHOLDER]] Mix one serving as directed on the label. Speak to a healthcare professional before starting anything new.' },

      { slug: 'starter-bundle', name: 'The Starter Bundle', category: 'Bundles', price: 96, compareAt: 126, rating: 4.9, reviewCount: 143, badge: 'Save 24%', featured: false,
        shortBenefit: 'Three of the range together, at a lower price than buying separately.',
        benefits: ['Daily Foundation, Focus Support and Evening Wind Down', 'One delivery instead of three', 'Cancel or change at any time'],
        ingredients: ['[[PLACEHOLDER: see individual product labels]]'],
        howItWorks: '[[PLACEHOLDER]] Follow the label directions for each product in the bundle.' }
    ]
  },

  /* ========================================================= 2. LUMEN SKIN */
  {
    slug: 'lumen-skin',
    name: 'Lumen Skin',
    domain: 'lumen-skin-placeholder.com',
    legalEntity: 'Lumen Skin Co.',
    tagline: 'Considered skincare, without the ten-step routine.',
    announcement: 'Complimentary shipping on orders over $50',
    niche: 'Skincare',

    fonts: {
      link: '<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Fraunces:opsz,wght@9..144,500;9..144,600&display=swap" rel="stylesheet">',
      heading: "'Fraunces', Georgia, 'Times New Roman', serif",
      body: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
      headingWeight: '600',
      tracking: '-0.5px'
    },
    colors: {
      background: '#ffffff', surface: '#faf5f1', soft: '#f7efe8',
      text: '#2e2723', heading: '#241e1a', muted: '#7a6b61',
      border: '#eadfd6', borderStrong: '#d6c4b6',
      accent: '#b4573b', accentHover: '#93442d', accentTint: '#f8e9e3', onAccent: '#ffffff',
      footerBg: '#241e1a', footerText: '#ded2c8', star: '#c98a2e'
    },
    style: { radius: '4px', radiusLarge: '6px', buttonRadius: '4px', cardStyle: 'flat', logoWidth: '148px' },

    contact: {
      email: 'hello@lumen-skin-placeholder.com',
      phone: '+1 (555) 010-8823',
      hours: 'Mon–Fri, 9am–5pm ET',
      address: '[[PLACEHOLDER: registered business address]]'
    },

    copy: {
      heroEyebrow: 'Skincare, simplified',
      heroH1: 'Fewer products. Better mornings.',
      heroLede: '[[PLACEHOLDER]] A short, deliberate range designed to work together — so your shelf holds four things instead of fourteen.',
      primaryCta: 'Find your routine',
      heroCardTitle: 'Loved by 12,000+',
      heroCardText: '[[PLACEHOLDER]] customers and counting',
      stepsHeading: 'Getting started takes about four minutes',
      stepsLede: '[[PLACEHOLDER]] Answer a few questions and we will suggest where to begin.',
      featuredHeading: 'The core four',
      featuredLede: '[[PLACEHOLDER]] Everything most people need, and nothing they do not.',
      reviewsHeading: 'From our customers',
      ctaHeading: 'Start with one product',
      ctaLede: '[[PLACEHOLDER]] You do not need the whole shelf. Pick the step you are missing and build from there.',
      aboutH1: 'Skincare should be legible',
      aboutLede: '[[PLACEHOLDER]] We make a small number of products and tell you exactly what is in them.',
      aboutStoryHeading: 'Born from an overcrowded bathroom cabinet',
      aboutStory1: '[[PLACEHOLDER]] Lumen Skin started with a simple observation: most people own far more skincare than they use, and almost none of it explains itself.',
      aboutStory2: '[[PLACEHOLDER]] So we went the other way. A deliberately small range, formulated to layer together, with full ingredient lists printed in a size you can actually read.',
      aboutStory3: '[[PLACEHOLDER]] We add a product only when there is a gap worth filling — which is why the range has grown by three items in as many years.',
      aboutHowHeading: 'How a product earns its place',
      aboutHowText: '[[PLACEHOLDER]] Every formula goes through the same process before it reaches the shelf.'
    },

    heroProof: ['Dermatologist-reviewed', 'Cruelty-free', 'Full ingredient lists'],
    valueProps: [
      { icon: 'leaf', text: 'Cruelty-free' },
      { icon: 'shield', text: 'Dermatologist-reviewed' },
      { icon: 'truck', text: 'Free shipping over $50' },
      { icon: 'refresh', text: '30-day returns' }
    ],
    howItWorks: [
      { title: 'Take the routine quiz', text: '[[PLACEHOLDER]] A few questions about your skin and what your mornings actually look like.' },
      { title: 'Get a routine, not a catalogue', text: '[[PLACEHOLDER]] We suggest the two or three products that fit, in the order to use them.' },
      { title: 'Adjust as you go', text: '[[PLACEHOLDER]] Change or pause deliveries whenever you like — no phone call required.' }
    ],
    testimonials: [
      { name: 'Priya S.', role: '[[PLACEHOLDER]] Verified customer', rating: 5, quote: '[[PLACEHOLDER]] I went from seven products to three and my routine is genuinely easier to stick to now.' },
      { name: 'Elena M.', role: '[[PLACEHOLDER]] Verified customer', rating: 5, quote: '[[PLACEHOLDER]] The texture is lovely and the ingredient list is printed where I can actually find it.' },
      { name: 'Josie W.', role: '[[PLACEHOLDER]] Verified customer', rating: 4, quote: '[[PLACEHOLDER]] Packaging is beautiful without being wasteful. Delivery was quick.' }
    ],

    products: [
      { slug: 'gentle-gel-cleanser', name: 'Gentle Gel Cleanser', category: 'Cleanse', price: 28, compareAt: null, rating: 4.8, reviewCount: 894, badge: 'Best seller', featured: true,
        shortBenefit: 'A morning and evening first step that does not strip.',
        benefits: ['Fragrance-free', 'Rinses clean', '150ml pump bottle'],
        ingredients: ['[[PLACEHOLDER: ingredient one]]', '[[PLACEHOLDER: ingredient two]]', '[[PLACEHOLDER: ingredient three]]'],
        howItWorks: '[[PLACEHOLDER]] Massage into damp skin and rinse. Use morning and evening, or as directed on the label.' },

      { slug: 'hydrating-serum', name: 'Hydrating Serum', category: 'Treat', price: 46, compareAt: 58, rating: 4.9, reviewCount: 1120, badge: null, featured: true,
        shortBenefit: 'The layer between cleansing and moisturising.',
        benefits: ['Lightweight, absorbs quickly', 'Layers under moisturiser', '30ml dropper bottle'],
        ingredients: ['[[PLACEHOLDER: ingredient one]]', '[[PLACEHOLDER: ingredient two]]', '[[PLACEHOLDER: ingredient three]]'],
        howItWorks: '[[PLACEHOLDER]] Apply a few drops to clean skin before moisturiser, as directed on the label.' },

      { slug: 'daily-moisturiser', name: 'Daily Moisturiser', category: 'Moisturise', price: 38, compareAt: null, rating: 4.7, reviewCount: 742, badge: null, featured: true,
        shortBenefit: 'A final step that sits well under makeup.',
        benefits: ['Non-greasy finish', 'Fragrance-free', '50ml jar'],
        ingredients: ['[[PLACEHOLDER: ingredient one]]', '[[PLACEHOLDER: ingredient two]]', '[[PLACEHOLDER: ingredient three]]'],
        howItWorks: '[[PLACEHOLDER]] Apply to face and neck as the last step of your routine, as directed on the label.' },

      { slug: 'daily-spf-40', name: 'Daily SPF 40', category: 'Protect', price: 34, compareAt: 42, rating: 4.6, reviewCount: 566, badge: 'New', featured: true,
        shortBenefit: 'The step most routines skip.',
        benefits: ['No white cast', 'Wears well under makeup', '50ml tube'],
        ingredients: ['[[PLACEHOLDER: ingredient one]]', '[[PLACEHOLDER: ingredient two]]', '[[PLACEHOLDER: ingredient three]]'],
        howItWorks: '[[PLACEHOLDER]] Apply generously as the final morning step and reapply as directed on the label.' },

      { slug: 'overnight-recovery-balm', name: 'Overnight Recovery Balm', category: 'Treat', price: 52, compareAt: null, rating: 4.8, reviewCount: 318, badge: null, featured: false,
        shortBenefit: 'A richer option for the end of the day.',
        benefits: ['Richer evening texture', 'A little goes a long way', '50ml jar'],
        ingredients: ['[[PLACEHOLDER: ingredient one]]', '[[PLACEHOLDER: ingredient two]]', '[[PLACEHOLDER: ingredient three]]'],
        howItWorks: '[[PLACEHOLDER]] Warm a small amount between fingertips and press into skin at night, as directed on the label.' },

      { slug: 'the-core-routine', name: 'The Core Routine', category: 'Sets', price: 104, compareAt: 138, rating: 4.9, reviewCount: 402, badge: 'Save 25%', featured: false,
        shortBenefit: 'Cleanser, serum, moisturiser and SPF, together.',
        benefits: ['All four core steps', 'Cheaper than buying separately', 'Arrives in one box'],
        ingredients: ['[[PLACEHOLDER: see individual product labels]]'],
        howItWorks: '[[PLACEHOLDER]] Use in order: cleanse, serum, moisturise, then SPF in the morning.' }
    ]
  },

  /* ========================================================= 3. BALANCE CO */
  {
    slug: 'balance-co',
    name: 'Balance Co',
    domain: 'balance-co-placeholder.com',
    legalEntity: 'Balance Co Wellness Ltd',
    tagline: 'Support for the goals you set yourself.',
    announcement: 'Free shipping over $50 · Plain packaging on every order',
    niche: 'Weight management',

    fonts: {
      link: '<link href="https://fonts.googleapis.com/css2?family=Karla:wght@400;500;600&family=Outfit:wght@500;600;700&display=swap" rel="stylesheet">',
      heading: "'Outfit', 'Segoe UI', system-ui, sans-serif",
      body: "'Karla', 'Segoe UI', system-ui, sans-serif",
      headingWeight: '600',
      tracking: '-1px'
    },
    colors: {
      background: '#ffffff', surface: '#f3f7f2', soft: '#eef3ec',
      text: '#1f2a24', heading: '#16211b', muted: '#5d6f64',
      border: '#dee8dc', borderStrong: '#c3d4c0',
      accent: '#4a7c59', accentHover: '#3a6246', accentTint: '#e6f0e6', onAccent: '#ffffff',
      footerBg: '#16211b', footerText: '#c8d6c9', star: '#d29a2b'
    },
    style: { radius: '18px', radiusLarge: '24px', buttonRadius: '999px', cardStyle: 'elevated', logoWidth: '150px' },

    contact: {
      email: 'support@balance-co-placeholder.com',
      phone: '+1 (555) 010-6612',
      hours: 'Mon–Sat, 8am–7pm ET',
      address: '[[PLACEHOLDER: registered business address]]'
    },

    copy: {
      heroEyebrow: 'Weight management support',
      heroH1: 'Steady beats drastic.',
      heroLede: '[[PLACEHOLDER]] Products built to sit alongside the habits you are already working on, with clear labels and no pressure to buy the whole range.',
      primaryCta: 'Take the quiz',
      heroCardTitle: 'Rated 4.8/5',
      heroCardText: '[[PLACEHOLDER]] by 3,100+ customers',
      stepsHeading: 'How it works',
      stepsLede: '[[PLACEHOLDER]] A short quiz, a suggestion, and a delivery schedule you control.',
      featuredHeading: 'Popular right now',
      featuredLede: '[[PLACEHOLDER]] The products people most often start with.',
      reviewsHeading: 'In their words',
      ctaHeading: 'Start where you are',
      ctaLede: '[[PLACEHOLDER]] Take the two-minute quiz and we will point you at a sensible first step.',
      aboutH1: 'We are not interested in quick fixes',
      aboutLede: '[[PLACEHOLDER]] Balance Co exists for people who want support, not a transformation promise.',
      aboutStoryHeading: 'A category that needed calming down',
      aboutStory1: '[[PLACEHOLDER]] Weight management is the loudest shelf in the shop. Before-and-after photos, countdowns, numbers that nobody can back up.',
      aboutStory2: '[[PLACEHOLDER]] We built Balance Co to be the quiet option. Clear labels, honest language, and no claims about what your body will do.',
      aboutStory3: '[[PLACEHOLDER]] What we sell is support for a routine. The routine is still yours, and we would rather say that plainly.',
      aboutHowHeading: 'What we will and will not say',
      aboutHowText: '[[PLACEHOLDER]] We hold our own copy to the same standard we would want as customers.'
    },

    heroProof: ['No before-and-after photos', 'Clear labelling', 'Cancel anytime'],
    valueProps: [
      { icon: 'shield', text: 'No inflated claims' },
      { icon: 'box', text: 'Plain packaging' },
      { icon: 'truck', text: 'Free shipping over $50' },
      { icon: 'refresh', text: 'Cancel anytime' }
    ],
    howItWorks: [
      { title: 'Take the quiz', text: '[[PLACEHOLDER]] Two minutes of questions about your routine and what you are working towards.' },
      { title: 'See what fits', text: '[[PLACEHOLDER]] We suggest products that match, and tell you plainly when nothing does.' },
      { title: 'Delivered on your schedule', text: '[[PLACEHOLDER]] Choose how often it arrives. Pause or cancel whenever you want.' }
    ],
    testimonials: [
      { name: 'Rachel K.', role: '[[PLACEHOLDER]] Verified customer', rating: 5, quote: '[[PLACEHOLDER]] The thing that sold me was the absence of hype. It reads like a normal shop, not a pitch.' },
      { name: 'Tom A.', role: '[[PLACEHOLDER]] Verified customer', rating: 4, quote: '[[PLACEHOLDER]] Easy to pause when I went travelling and just as easy to restart. No phone calls.' },
      { name: 'Nadia B.', role: '[[PLACEHOLDER]] Verified customer', rating: 5, quote: '[[PLACEHOLDER]] Clear labels, quick delivery, and the packaging gives nothing away.' }
    ],

    products: [
      { slug: 'daily-balance-capsules', name: 'Daily Balance Capsules', category: 'Daily support', price: 44, compareAt: 55, rating: 4.7, reviewCount: 523, badge: 'Best seller', featured: true,
        shortBenefit: 'A once-daily capsule to sit alongside your routine.',
        benefits: ['One capsule per day', '30-day supply', 'Full ingredient list on the label'],
        ingredients: ['[[PLACEHOLDER: ingredient one]]', '[[PLACEHOLDER: ingredient two]]', '[[PLACEHOLDER: ingredient three]]'],
        howItWorks: '[[PLACEHOLDER]] Take as directed on the label. Speak to a healthcare professional before starting anything new.' },

      { slug: 'fibre-blend', name: 'Daily Fibre Blend', category: 'Daily support', price: 36, compareAt: null, rating: 4.6, reviewCount: 388, badge: null, featured: true,
        shortBenefit: 'Mixes into water, coffee or a smoothie.',
        benefits: ['Unflavoured', '30 servings', 'Dissolves without clumping'],
        ingredients: ['[[PLACEHOLDER: ingredient one]]', '[[PLACEHOLDER: ingredient two]]', '[[PLACEHOLDER: ingredient three]]'],
        howItWorks: '[[PLACEHOLDER]] Mix one serving into a drink as directed on the label.' },

      { slug: 'protein-shake-vanilla', name: 'Protein Shake — Vanilla', category: 'Nutrition', price: 48, compareAt: 58, rating: 4.8, reviewCount: 671, badge: null, featured: true,
        shortBenefit: 'A straightforward shake for busy mornings.',
        benefits: ['20 servings per pouch', 'Mixes with water or milk', 'Also available unflavoured'],
        ingredients: ['[[PLACEHOLDER: ingredient one]]', '[[PLACEHOLDER: ingredient two]]', '[[PLACEHOLDER: ingredient three]]'],
        howItWorks: '[[PLACEHOLDER]] Blend one scoop with liquid of your choice as directed on the label.' },

      { slug: 'evening-calm', name: 'Evening Calm', category: 'Sleep', price: 34, compareAt: null, rating: 4.5, reviewCount: 244, badge: null, featured: true,
        shortBenefit: 'Formulated for the end of the day.',
        benefits: ['Designed for evening use', '30-day supply', 'Clearly labelled'],
        ingredients: ['[[PLACEHOLDER: ingredient one]]', '[[PLACEHOLDER: ingredient two]]', '[[PLACEHOLDER: ingredient three]]'],
        howItWorks: '[[PLACEHOLDER]] Take in the evening as directed on the label.' },

      { slug: 'hydration-sticks', name: 'Hydration Sticks', category: 'Nutrition', price: 26, compareAt: 32, rating: 4.7, reviewCount: 412, badge: null, featured: false,
        shortBenefit: 'Single-serve sticks for a water bottle.',
        benefits: ['14 sticks per box', 'Citrus flavour', 'Fits in a pocket'],
        ingredients: ['[[PLACEHOLDER: ingredient one]]', '[[PLACEHOLDER: ingredient two]]', '[[PLACEHOLDER: ingredient three]]'],
        howItWorks: '[[PLACEHOLDER]] Add one stick to water as directed on the label.' },

      { slug: 'balance-starter-kit', name: 'Balance Starter Kit', category: 'Bundles', price: 98, compareAt: 128, rating: 4.8, reviewCount: 176, badge: 'Save 23%', featured: false,
        shortBenefit: 'Three products to cover the basics of a routine.',
        benefits: ['Capsules, fibre blend and protein', 'One delivery', 'Pause or cancel anytime'],
        ingredients: ['[[PLACEHOLDER: see individual product labels]]'],
        howItWorks: '[[PLACEHOLDER]] Follow the label directions for each product in the kit.' }
    ]
  },

  /* ========================================================== 4. NOVA DAILY */
  {
    slug: 'nova-daily',
    name: 'Nova Daily',
    domain: 'nova-daily-placeholder.com',
    legalEntity: 'Nova Daily Nutrition Inc.',
    tagline: 'The daily basics, done properly.',
    announcement: 'Free shipping over $50 · Subscribe and save 15%',
    niche: 'Daily supplements',

    fonts: {
      link: '<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet">',
      heading: "'Playfair Display', Georgia, 'Times New Roman', serif",
      body: "'Manrope', 'Segoe UI', system-ui, sans-serif",
      headingWeight: '600',
      tracking: '-0.5px'
    },
    colors: {
      background: '#fffdfa', surface: '#faf3e9', soft: '#f8f1e6',
      text: '#2a2318', heading: '#1f1a12', muted: '#7a6b56',
      border: '#ece0cd', borderStrong: '#d8c5a8',
      accent: '#a06a1f', accentHover: '#835616', accentTint: '#f6ead6', onAccent: '#ffffff',
      footerBg: '#1f1a12', footerText: '#ddd0bb', star: '#c98a2e'
    },
    style: { radius: '10px', radiusLarge: '12px', buttonRadius: '6px', cardStyle: 'bordered', logoWidth: '152px' },

    contact: {
      email: 'hello@nova-daily-placeholder.com',
      phone: '+1 (555) 010-2290',
      hours: 'Mon–Fri, 9am–6pm ET',
      address: '[[PLACEHOLDER: registered business address]]'
    },

    copy: {
      heroEyebrow: 'Daily supplements',
      heroH1: 'The shelf, edited down.',
      heroLede: '[[PLACEHOLDER]] Third-party tested daily supplements with full ingredient disclosure, sold in sizes that make sense for one person.',
      primaryCta: 'Build your routine',
      heroCardTitle: 'Third-party tested',
      heroCardText: '[[PLACEHOLDER]] certificates available on request',
      stepsHeading: 'From order to doorstep',
      stepsLede: '[[PLACEHOLDER]] Three steps, and then you can forget about it.',
      featuredHeading: 'The daily line-up',
      featuredLede: '[[PLACEHOLDER]] Our most-ordered products, all in the same clear format.',
      reviewsHeading: 'Customer reviews',
      ctaHeading: 'Build a routine that fits',
      ctaLede: '[[PLACEHOLDER]] Start with one product and add to it when you are ready. No minimum commitment.',
      aboutH1: 'Supplements you can read the label of',
      aboutLede: '[[PLACEHOLDER]] Nova Daily makes a small, tested range with nothing hidden behind a blend.',
      aboutStoryHeading: 'We got tired of guessing',
      aboutStory1: '[[PLACEHOLDER]] The supplement aisle asks you to take a lot on faith. Proprietary blends, quantities you cannot see, and testing nobody will show you.',
      aboutStory2: '[[PLACEHOLDER]] Nova Daily was built the other way round. Every quantity printed, every batch tested by an independent lab, and the certificates available if you ask for them.',
      aboutStory3: '[[PLACEHOLDER]] It makes the range smaller and slower to grow. We think that is the right trade.',
      aboutHowHeading: 'Our testing process',
      aboutHowText: '[[PLACEHOLDER]] Every batch goes through the same checks before it ships.'
    },

    heroProof: ['Third-party tested', 'No proprietary blends', 'Subscribe and save'],
    valueProps: [
      { icon: 'shield', text: 'Third-party tested' },
      { icon: 'leaf', text: 'Full disclosure labels' },
      { icon: 'truck', text: 'Free shipping over $50' },
      { icon: 'refresh', text: 'Cancel anytime' }
    ],
    howItWorks: [
      { title: 'Pick your products', text: '[[PLACEHOLDER]] Browse the range and choose what fits your routine. No quiz required.' },
      { title: 'Choose a schedule', text: '[[PLACEHOLDER]] One-off order, or a repeat delivery at 15% off. Change it whenever.' },
      { title: 'It arrives, quietly', text: '[[PLACEHOLDER]] Plain outer packaging, on the schedule you picked.' }
    ],
    testimonials: [
      { name: 'Grace L.', role: '[[PLACEHOLDER]] Verified customer', rating: 5, quote: '[[PLACEHOLDER]] First supplement brand where I could actually work out how much of each thing I was taking.' },
      { name: 'Sam O.', role: '[[PLACEHOLDER]] Verified customer', rating: 5, quote: '[[PLACEHOLDER]] I asked for the batch certificate and they sent it the same day. That told me a lot.' },
      { name: 'Ines D.', role: '[[PLACEHOLDER]] Verified customer', rating: 4, quote: '[[PLACEHOLDER]] Subscription is genuinely easy to change, which is rarer than it should be.' }
    ],

    products: [
      { slug: 'daily-multi', name: 'Daily Multi', category: 'Foundations', price: 32, compareAt: 40, rating: 4.8, reviewCount: 1340, badge: 'Best seller', featured: true,
        shortBenefit: 'One capsule covering the everyday basics.',
        benefits: ['Every quantity printed on the label', 'Third-party tested batches', '30-day supply'],
        ingredients: ['[[PLACEHOLDER: ingredient one]]', '[[PLACEHOLDER: ingredient two]]', '[[PLACEHOLDER: ingredient three]]'],
        howItWorks: '[[PLACEHOLDER]] Take one capsule daily with food, as directed on the label.' },

      { slug: 'omega-3', name: 'Omega-3', category: 'Foundations', price: 34, compareAt: null, rating: 4.7, reviewCount: 806, badge: null, featured: true,
        shortBenefit: 'A daily softgel with no aftertaste.',
        benefits: ['Third-party tested for purity', '60 softgels', 'Full disclosure label'],
        ingredients: ['[[PLACEHOLDER: ingredient one]]', '[[PLACEHOLDER: ingredient two]]'],
        howItWorks: '[[PLACEHOLDER]] Take as directed on the label, ideally with a meal.' },

      { slug: 'magnesium-evening', name: 'Magnesium Evening', category: 'Evening', price: 28, compareAt: 34, rating: 4.8, reviewCount: 923, badge: null, featured: true,
        shortBenefit: 'Made to be the last thing in your routine.',
        benefits: ['Designed for evening use', '60 capsules', 'Third-party tested'],
        ingredients: ['[[PLACEHOLDER: ingredient one]]', '[[PLACEHOLDER: ingredient two]]'],
        howItWorks: '[[PLACEHOLDER]] Take in the evening as directed on the label.' },

      { slug: 'vitamin-d3-k2', name: 'Vitamin D3 + K2', category: 'Foundations', price: 26, compareAt: null, rating: 4.9, reviewCount: 655, badge: 'New', featured: true,
        shortBenefit: 'A small daily drop, easy to remember.',
        benefits: ['Liquid drops, no capsule', '60-day supply', 'Third-party tested'],
        ingredients: ['[[PLACEHOLDER: ingredient one]]', '[[PLACEHOLDER: ingredient two]]'],
        howItWorks: '[[PLACEHOLDER]] Take the number of drops stated on the label, with food.' },

      { slug: 'greens-powder', name: 'Greens Powder', category: 'Blends', price: 42, compareAt: 52, rating: 4.4, reviewCount: 377, badge: null, featured: false,
        shortBenefit: 'A daily scoop for water or a smoothie.',
        benefits: ['30 servings', 'Mild flavour', 'Every ingredient quantified'],
        ingredients: ['[[PLACEHOLDER: ingredient one]]', '[[PLACEHOLDER: ingredient two]]', '[[PLACEHOLDER: ingredient three]]'],
        howItWorks: '[[PLACEHOLDER]] Mix one scoop into liquid as directed on the label.' },

      { slug: 'the-daily-three', name: 'The Daily Three', category: 'Bundles', price: 82, compareAt: 106, rating: 4.9, reviewCount: 289, badge: 'Save 22%', featured: false,
        shortBenefit: 'Multi, Omega-3 and Magnesium in one subscription.',
        benefits: ['Covers morning and evening', '15% off as a repeat order', 'Pause or cancel anytime'],
        ingredients: ['[[PLACEHOLDER: see individual product labels]]'],
        howItWorks: '[[PLACEHOLDER]] Follow the label directions for each product in the bundle.' }
    ]
  },

  /* =========================================================== 5. CLEARPATH */
  {
    slug: 'clearpath',
    name: 'Clearpath',
    domain: 'clearpath-placeholder.com',
    legalEntity: 'Clearpath Wellbeing Ltd',
    tagline: 'For the hours that decide the rest of your day.',
    announcement: 'Free discreet shipping over $50',
    niche: 'Sleep & calm',

    fonts: {
      link: '<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700&family=Source+Sans+3:wght@400;500;600&display=swap" rel="stylesheet">',
      heading: "'Plus Jakarta Sans', 'Segoe UI', system-ui, sans-serif",
      body: "'Source Sans 3', 'Segoe UI', system-ui, sans-serif",
      headingWeight: '600',
      tracking: '-1.2px'
    },
    colors: {
      background: '#ffffff', surface: '#f4f6fb', soft: '#eef0f8',
      text: '#1b2333', heading: '#141a28', muted: '#5d6782',
      border: '#dfe3ef', borderStrong: '#c3cade',
      accent: '#4a5aa0', accentHover: '#3a477f', accentTint: '#e8ebf7', onAccent: '#ffffff',
      footerBg: '#141a28', footerText: '#c5cbdd', star: '#d9a02e'
    },
    style: { radius: '16px', radiusLarge: '20px', buttonRadius: '999px', cardStyle: 'elevated', logoWidth: '146px' },

    contact: {
      email: 'support@clearpath-placeholder.com',
      phone: '+1 (555) 010-7734',
      hours: 'Mon–Fri, 9am–8pm ET',
      address: '[[PLACEHOLDER: registered business address]]'
    },

    copy: {
      heroEyebrow: 'Sleep & calm',
      heroH1: 'Better evenings, quieter nights.',
      heroLede: '[[PLACEHOLDER]] A small range built around the end of the day, with clear labels and no promises we cannot stand behind.',
      primaryCta: 'Get started',
      heroCardTitle: 'Rated 4.7/5',
      heroCardText: '[[PLACEHOLDER]] from 1,800+ reviews',
      stepsHeading: 'Simple from the start',
      stepsLede: '[[PLACEHOLDER]] No appointments, no waiting rooms, no fuss.',
      featuredHeading: 'For the evening routine',
      featuredLede: '[[PLACEHOLDER]] The products people reach for first.',
      reviewsHeading: 'What people say',
      ctaHeading: 'Start tonight',
      ctaLede: '[[PLACEHOLDER]] Pick one product, check out securely, and it arrives in plain packaging.',
      aboutH1: 'Evenings deserve more attention',
      aboutLede: '[[PLACEHOLDER]] Clearpath focuses entirely on the last few hours of the day.',
      aboutStoryHeading: 'One problem, properly',
      aboutStory1: '[[PLACEHOLDER]] Most wellness brands try to cover the whole day. We decided to do one part of it and do it carefully.',
      aboutStory2: '[[PLACEHOLDER]] Everything we make is designed for the evening — the routine, the packaging, even the way the labels read at 10pm.',
      aboutStory3: '[[PLACEHOLDER]] It is a narrow range on purpose, and it will stay that way.',
      aboutHowHeading: 'Why the range is small',
      aboutHowText: '[[PLACEHOLDER]] Focusing on one part of the day lets us be more careful about everything in it.'
    },

    heroProof: ['Licensed providers', 'Plain packaging', 'Cancel anytime'],
    valueProps: [
      { icon: 'clock', text: 'Built for evenings' },
      { icon: 'box', text: 'Discreet packaging' },
      { icon: 'truck', text: 'Free shipping over $50' },
      { icon: 'chat', text: 'Support in 24h' }
    ],
    howItWorks: [
      { title: 'Answer a few questions', text: '[[PLACEHOLDER]] A short set of questions about your evenings and what you have already tried.' },
      { title: 'Get a recommendation', text: '[[PLACEHOLDER]] We suggest a starting point, and tell you if we think you should speak to a professional first.' },
      { title: 'Delivered to your door', text: '[[PLACEHOLDER]] Plain outer packaging, on a schedule you can change at any time.' }
    ],
    testimonials: [
      { name: 'Adam F.', role: '[[PLACEHOLDER]] Verified customer', rating: 5, quote: '[[PLACEHOLDER]] The whole thing is calm — the site, the packaging, the emails. It suits what they sell.' },
      { name: 'Maya H.', role: '[[PLACEHOLDER]] Verified customer', rating: 4, quote: '[[PLACEHOLDER]] Straightforward to order and easy to pause. Support replied the next morning.' },
      { name: 'Ben C.', role: '[[PLACEHOLDER]] Verified customer', rating: 5, quote: '[[PLACEHOLDER]] Appreciated that they told me to check with my GP rather than just taking the order.' }
    ],

    products: [
      { slug: 'night-capsules', name: 'Night Capsules', category: 'Evening', price: 38, compareAt: 46, rating: 4.7, reviewCount: 742, badge: 'Best seller', featured: true,
        shortBenefit: 'A once-nightly capsule for the end of your routine.',
        benefits: ['One capsule at night', '30-day supply', 'Clear ingredient list'],
        ingredients: ['[[PLACEHOLDER: ingredient one]]', '[[PLACEHOLDER: ingredient two]]', '[[PLACEHOLDER: ingredient three]]'],
        howItWorks: '[[PLACEHOLDER]] Take before bed as directed on the label. Speak to a healthcare professional before starting anything new.' },

      { slug: 'calm-drops', name: 'Calm Drops', category: 'Evening', price: 42, compareAt: null, rating: 4.6, reviewCount: 511, badge: null, featured: true,
        shortBenefit: 'A liquid option for people who dislike capsules.',
        benefits: ['Measured dropper', 'Unflavoured', '30ml bottle'],
        ingredients: ['[[PLACEHOLDER: ingredient one]]', '[[PLACEHOLDER: ingredient two]]'],
        howItWorks: '[[PLACEHOLDER]] Use the dropper as directed on the label in the evening.' },

      { slug: 'wind-down-tea', name: 'Wind Down Tea', category: 'Rituals', price: 22, compareAt: 28, rating: 4.8, reviewCount: 894, badge: null, featured: true,
        shortBenefit: 'A caffeine-free evening ritual.',
        benefits: ['30 bags per tin', 'Caffeine-free', 'Loose-leaf option available'],
        ingredients: ['[[PLACEHOLDER: ingredient one]]', '[[PLACEHOLDER: ingredient two]]', '[[PLACEHOLDER: ingredient three]]'],
        howItWorks: '[[PLACEHOLDER]] Steep as directed on the tin, ideally an hour before bed.' },

      { slug: 'magnesium-night', name: 'Magnesium Night', category: 'Evening', price: 30, compareAt: null, rating: 4.7, reviewCount: 623, badge: 'New', featured: true,
        shortBenefit: 'A simple, single-ingredient evening option.',
        benefits: ['One ingredient, clearly stated', '60 capsules', 'Third-party tested'],
        ingredients: ['[[PLACEHOLDER: ingredient one]]'],
        howItWorks: '[[PLACEHOLDER]] Take in the evening as directed on the label.' },

      { slug: 'silk-sleep-mask', name: 'Silk Sleep Mask', category: 'Rituals', price: 34, compareAt: 42, rating: 4.9, reviewCount: 288, badge: null, featured: false,
        shortBenefit: 'A physical part of the routine, not a supplement.',
        benefits: ['Adjustable strap', 'Machine washable bag included', 'Blocks light fully'],
        ingredients: ['[[PLACEHOLDER: material composition]]'],
        howItWorks: '[[PLACEHOLDER]] Wear as part of your evening routine. Hand wash as directed on the care label.' },

      { slug: 'evening-ritual-set', name: 'Evening Ritual Set', category: 'Bundles', price: 84, compareAt: 108, rating: 4.8, reviewCount: 164, badge: 'Save 22%', featured: false,
        shortBenefit: 'Capsules, tea and a sleep mask together.',
        benefits: ['Covers the whole evening routine', 'Arrives in one box', 'Cheaper than buying separately'],
        ingredients: ['[[PLACEHOLDER: see individual product labels]]'],
        howItWorks: '[[PLACEHOLDER]] Follow the directions on each item in the set.' }
    ]
  }
];

module.exports = { brands, common };
