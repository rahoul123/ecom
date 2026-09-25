/* ==========================================================================
   TEST.JS — the maths that would be expensive to get wrong.

   Not a test framework and not coverage. Two things are checked here, both
   because they are silent when they break:

     1. Checkout pricing. It decides what a customer is charged.
     2. The product derivation in js/admin.js, which duplicates the one in
        _tools/generate.js. Duplication drifts; this compares the two against
        the real generated catalogue.

   Run:  node _tools/test.js      (after node _tools/generate.js)
   ========================================================================== */

const fs = require('fs');
const vm = require('vm');

let FAILS = 0;


(function pricing() {
const fs = require('fs');
const vm = require('vm');

const src = fs.readFileSync('_shared/js/checkout.js', 'utf8');

function grab(name) {
  const start = src.indexOf('  function ' + name + '(');
  if (start === -1) throw new Error('no ' + name);
  // Walk braces from the first { after the signature.
  let i = src.indexOf('{', start), depth = 0;
  for (; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') { depth--; if (!depth) return src.slice(start, i + 1); }
  }
  throw new Error('unbalanced ' + name);
}

let choice = { shipping: null, discount: null };
let subtotal = 0;
let hasPicker = true;

const ctx = {
  get choice() { return choice; },
  BRAND: {},
  Cart: { subtotal: () => subtotal, shipping: () => 9.99 },
  el: (sel) => (sel === '#ship-methods' && hasPicker ? {} : null),
  console
};
vm.createContext(ctx);
vm.runInContext(grab('shipMethods') + '\n' + grab('selectedMethod') + '\n' + grab('pricing'), ctx);

ctx.BRAND.shippingMethods = [
  { id: 'standard', label: 'Standard', price: 6.95, freeOver: 75 },
  { id: 'express', label: 'Express', price: 14.95 },
  { id: 'priority', label: 'Priority', price: 29.95 }
];


function is(label, got, want) {
  const ok = Math.abs(got - want) < 0.005;
  if (!ok) FAILS++;
  console.log((ok ? '  ok   ' : '  FAIL ') + label + '  got ' + got.toFixed(2) + ' want ' + want.toFixed(2));
}

console.log('shipping methods');
subtotal = 50; choice = { shipping: 'standard', discount: null };
is('standard under threshold', ctx.pricing().total, 56.95);
subtotal = 80;
is('standard over threshold is free', ctx.pricing().total, 80);
choice.shipping = 'express';
is('express is never free', ctx.pricing().total, 94.95);
choice.shipping = 'nonsense';
is('unknown id falls back to the first', ctx.pricing().total, 80);

console.log('discounts');
subtotal = 100; choice = { shipping: 'express', discount: { code: 'SILK10', kind: 'percent', value: 10 } };
is('10 percent off', ctx.pricing().total, 104.95);
choice.discount = { code: 'WELCOME15', kind: 'amount', value: 15 };
is('flat 15 off', ctx.pricing().total, 99.95);
choice.discount = { code: 'FREESILK', kind: 'shipping', value: 0 };
is('free delivery code', ctx.pricing().total, 100);
subtotal = 10; choice.discount = { code: 'WELCOME15', kind: 'amount', value: 15 };
is('discount never exceeds subtotal', ctx.pricing().total, 14.95);
is('  and the line shown matches', ctx.pricing().off, 10);

console.log('basket page (no picker)');
hasPicker = false; subtotal = 40; choice = { shipping: null, discount: null };
is('falls back to Cart.shipping()', ctx.pricing().total, 49.99);

console.log(FAILS ? '\n' + fails + ' FAILED' : '\nall pricing checks passed');

})();

(function adminDerivation() {
const fs = require('fs');
const vm = require('vm');

/* --- ground truth: what generate.js actually wrote --- */
const cfgSrc = fs.readFileSync('everwell/js/brand-config.js', 'utf8');
const cfg = { console };
vm.createContext(cfg);
vm.runInContext(cfgSrc, cfg);
const BRAND = cfg.BRAND;
const TRUTH = cfg.PRODUCTS;

/* --- admin.js, loaded with just enough browser to not throw --- */
const adminSrc = fs.readFileSync('_shared/js/admin.js', 'utf8');
const sandbox = {
  BRAND,
  PRODUCTS: TRUTH,
  Site: { productCard: () => '' },
  console,
  setTimeout, clearTimeout,
  localStorage: { getItem: () => null, setItem() {}, },
  window: { addEventListener() {}, confirm: () => false, innerWidth: 1200 },
  document: {
    readyState: 'complete',
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener() {}
  }
};
vm.createContext(sandbox);
vm.runInContext(adminSrc, sandbox);
const derive = sandbox.Admin.deriveProduct;

/* The fields the panel's form owns. Everything else is derived. */
const SOURCE_FIELDS = [
  'slug', 'name', 'category', 'shortBenefit', 'description', 'price', 'compareAt',
  'rating', 'reviewCount', 'badge', 'featured', 'optionLabel', 'options',
  'benefits', 'ingredients', 'howItWorks', 'image', 'swatch', 'colour'
];

/* Derived mechanically, so the two implementations must agree exactly. */
const DERIVED = ['sku', 'tint', 'deep', 'gallery', 'priceNote', 'image'];


let compared = 0;

for (const want of TRUTH) {
  const src = {};
  for (const f of SOURCE_FIELDS) if (want[f] !== undefined) src[f] = want[f];
  const got = derive(src);

  for (const f of DERIVED) {
    const a = JSON.stringify(got[f]);
    const b = JSON.stringify(want[f]);
    compared++;
    if (a !== b) {
      FAILS++;
      console.log('  FAIL ' + want.slug + '.' + f + '\n        admin: ' + a + '\n        gen:   ' + b);
    }
  }
}
console.log((FAILS ? '  ' : '  ok   ') + compared + ' derived fields compared across ' +
  TRUTH.length + ' products' + (FAILS ? ', ' + fails + ' MISMATCHED' : ', all agree'));

/* --- a brand-new product, the thing the panel is actually for --- */
const fresh = derive({
  slug: 'silk-eye-pillow', name: 'Silk Eye Pillow', category: 'Sleep Masks',
  shortBenefit: 'Weighted, lavender-filled.', price: 45, compareAt: null,
  swatch: '#cdd8c8', colour: 'Sage', options: ['One size'], optionLabel: 'Fit'
});

function is(label, got, want) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) { FAILS++; console.log('  FAIL ' + label + '\n        got:  ' + JSON.stringify(got) + '\n        want: ' + JSON.stringify(want)); }
  else console.log('  ok   ' + label);
}

console.log('\na product created in the panel');
is('sku is built from the brand and slug', fresh.sku, 'EVERWELL-SILKEYEPILLOW');
is('image falls back to the slug', fresh.image, 'images/products/silk-eye-pillow.svg');
is('gallery picks up the category angles', fresh.gallery[1], 'images/products/_angle-sleep-masks-2.svg');
is('tint is the card wash', fresh.tint, '#f8faf7');
is('priceNote honours the brand default', fresh.priceNote, null);
is('options survive', fresh.options, ['One size']);

console.log('\nan embedded photo');
const embedded = derive({ slug: 'x', name: 'X', category: 'Bundles', price: 1, image: 'data:image/jpeg;base64,AAAA' });
is('gallery does not invent angle shots', embedded.gallery.length, 1);

console.log('\nno colour chosen');
const plain = derive({ slug: 'y', name: 'Y', category: 'Bundles', price: 1 });
is('tint stays null', plain.tint, null);
is('deep stays null', plain.deep, null);

console.log(FAILS ? '\n' + fails + ' FAILED' : '\nall admin derivation checks passed');

})();

process.exit(FAILS ? 1 : 0);
