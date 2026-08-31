/* ==========================================================================
   IMAGES.JS — generates every placeholder image.
   Dev-only. Output is plain .svg / .png that uploads like any other asset.

   These are STYLISED PRODUCT ILLUSTRATIONS, not photographs. They are built to
   look like a real catalogue (correct pack shapes, per-category colour, soft
   shadows, product name on the label) so the store reads as a real shop while
   the real photography is still being shot.

   Every file carries an HTML comment marking it as a placeholder, and a small
   caption in the corner. Replace a file at the same path and the layout will
   not move — the aspect ratios are fixed.
   ========================================================================== */

const zlib = require('node:zlib');

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* ------------------------------------------------------------- colour ---- */

function hexToHsl(hex) {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((x) => x + x).join('') : h;
  let r = parseInt(full.slice(0, 2), 16) / 255;
  let g = parseInt(full.slice(2, 4), 16) / 255;
  let b = parseInt(full.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let hue = 0, sat = 0;
  const li = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    sat = li > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) hue = ((g - b) / d + (g < b ? 6 : 0));
    else if (max === g) hue = (b - r) / d + 2;
    else hue = (r - g) / d + 4;
    hue *= 60;
  }
  return { h: hue, s: sat * 100, l: li * 100 };
}

const hsl = (c, dl = 0, ds = 0, dh = 0) =>
  `hsl(${(c.h + dh + 360) % 360} ${Math.max(0, Math.min(100, c.s + ds))}% ${Math.max(0, Math.min(100, c.l + dl))}%)`;

/* Each category gets its own hue so a grid of 30 products has real variety. */
function productHue(brand, category, categories) {
  const base = hexToHsl(brand.colors.accent);
  const i = Math.max(0, categories.indexOf(category));
  return { h: (base.h + i * 47) % 360, s: Math.max(28, Math.min(52, base.s)), l: 46 };
}

/* -------------------------------------------------------- pack shapes ---- */

/**
 * Which pack a product comes in, inferred from its NAME only.
 * Name only, and word-bounded: matching the description too made "a routine
 * you will keep to" read as a bundle and "softgel" read as a tube.
 * Set `imageForm` on a product to override.
 */
function formOf(product) {
  const n = String(product.name).toLowerCase();
  if (/\b(bundle|kit|set|routine|trio|three)\b/.test(n)) return 'bundle';
  if (/\bmask\b/.test(n)) return 'soft';
  if (/\btea\b/.test(n)) return 'tin';
  if (/\b(sticks?|sachets?)\b/.test(n)) return 'box';
  if (/\b(powder|protein|greens|fibre|fiber|blend|shake)\b/.test(n)) return 'pouch';
  if (/\b(drops?|serum|oil)\b/.test(n)) return 'dropper';
  if (/\b(balm|moisturiser|moisturizer|cream|jar)\b/.test(n)) return 'jar';
  if (/\b(cleanser|spf|gel|tube|wash)\b/.test(n)) return 'tube';
  return 'bottle';
}

/* Each shape returns SVG drawn inside an 800x800 box, centred on (400, 400). */
const SHAPES = {
  bottle(c) {
    return `
    <rect x="286" y="300" width="228" height="288" rx="30" fill="url(#body)"/>
    <rect x="286" y="300" width="76" height="288" rx="30" fill="${hsl(c, 14)}" opacity="0.35"/>
    <rect x="322" y="232" width="156" height="76" rx="18" fill="${hsl(c, -12)}"/>
    <rect x="322" y="232" width="156" height="26" rx="13" fill="${hsl(c, -4)}"/>
    <rect x="306" y="372" width="188" height="150" rx="12" fill="#fff" opacity="0.93"/>
    <rect x="330" y="398" width="86" height="9" rx="4.5" fill="${hsl(c, 2)}"/>`;
  },
  dropper(c) {
    return `
    <rect x="316" y="330" width="168" height="256" rx="26" fill="url(#body)"/>
    <rect x="316" y="330" width="58" height="256" rx="26" fill="${hsl(c, 14)}" opacity="0.35"/>
    <rect x="356" y="212" width="88" height="126" rx="14" fill="${hsl(c, -14)}"/>
    <rect x="368" y="182" width="64" height="44" rx="14" fill="${hsl(c, -20)}"/>
    <rect x="334" y="392" width="132" height="140" rx="10" fill="#fff" opacity="0.93"/>
    <rect x="356" y="416" width="66" height="8" rx="4" fill="${hsl(c, 2)}"/>`;
  },
  jar(c) {
    return `
    <rect x="266" y="360" width="268" height="212" rx="34" fill="url(#body)"/>
    <rect x="266" y="360" width="84" height="212" rx="34" fill="${hsl(c, 14)}" opacity="0.32"/>
    <rect x="252" y="286" width="296" height="92" rx="26" fill="${hsl(c, -12)}"/>
    <rect x="252" y="286" width="296" height="30" rx="15" fill="${hsl(c, -3)}"/>
    <rect x="300" y="424" width="200" height="102" rx="10" fill="#fff" opacity="0.93"/>
    <rect x="326" y="448" width="82" height="9" rx="4.5" fill="${hsl(c, 2)}"/>`;
  },
  tube(c) {
    return `
    <path d="M300 300 h200 l-22 288 a26 26 0 0 1 -26 24 h-104 a26 26 0 0 1 -26 -24 z" fill="url(#body)"/>
    <path d="M300 300 h64 l-14 312 h-24 a26 26 0 0 1 -26 -24 z" fill="${hsl(c, 14)}" opacity="0.32"/>
    <rect x="352" y="214" width="96" height="60" rx="14" fill="${hsl(c, -14)}"/>
    <rect x="288" y="272" width="224" height="34" rx="12" fill="${hsl(c, -6)}"/>
    <rect x="322" y="366" width="156" height="150" rx="10" fill="#fff" opacity="0.93"/>
    <rect x="346" y="392" width="72" height="8" rx="4" fill="${hsl(c, 2)}"/>`;
  },
  pouch(c) {
    return `
    <path d="M282 268 h236 a18 18 0 0 1 18 18 v300 a26 26 0 0 1 -26 26 h-220 a26 26 0 0 1 -26 -26 v-300 a18 18 0 0 1 18 -18 z" fill="url(#body)"/>
    <path d="M282 268 h74 v344 h-56 a26 26 0 0 1 -26 -26 v-300 a18 18 0 0 1 8 -18 z" fill="${hsl(c, 14)}" opacity="0.3"/>
    <rect x="288" y="234" width="224" height="44" rx="10" fill="${hsl(c, -14)}"/>
    <rect x="366" y="222" width="68" height="20" rx="10" fill="${hsl(c, -20)}"/>
    <rect x="312" y="352" width="176" height="164" rx="12" fill="#fff" opacity="0.93"/>
    <rect x="336" y="380" width="80" height="9" rx="4.5" fill="${hsl(c, 2)}"/>`;
  },
  tin(c) {
    return `
    <ellipse cx="400" cy="330" rx="152" ry="42" fill="${hsl(c, -10)}"/>
    <rect x="248" y="330" width="304" height="216" fill="url(#body)"/>
    <rect x="248" y="330" width="92" height="216" fill="${hsl(c, 14)}" opacity="0.3"/>
    <ellipse cx="400" cy="546" rx="152" ry="42" fill="${hsl(c, -6)}"/>
    <ellipse cx="400" cy="322" rx="152" ry="42" fill="${hsl(c, 6)}"/>
    <ellipse cx="400" cy="322" rx="112" ry="30" fill="${hsl(c, 12)}" opacity="0.5"/>
    <rect x="296" y="386" width="208" height="118" rx="10" fill="#fff" opacity="0.93"/>
    <rect x="322" y="410" width="78" height="9" rx="4.5" fill="${hsl(c, 2)}"/>`;
  },
  box(c) {
    return `
    <path d="M260 316 l140 -66 l140 66 v240 l-140 66 l-140 -66 z" fill="url(#body)"/>
    <path d="M260 316 l140 66 v240 l-140 -66 z" fill="${hsl(c, -8)}" opacity="0.9"/>
    <path d="M400 250 l140 66 l-140 66 l-140 -66 z" fill="${hsl(c, 14)}"/>
    <rect x="300" y="412" width="86" height="128" rx="8" fill="#fff" opacity="0.9" transform="skewY(6)"/>`;
  },
  soft(c) {
    return `
    <path d="M226 372 q174 -96 348 0 q34 88 -26 132 q-148 74 -296 0 q-60 -44 -26 -132 z" fill="url(#body)"/>
    <path d="M226 372 q88 -48 174 -60 v250 q-98 -8 -148 -58 q-60 -44 -26 -132 z" fill="${hsl(c, 12)}" opacity="0.3"/>
    <path d="M226 388 q-56 34 -70 96" stroke="${hsl(c, -8)}" stroke-width="14" fill="none" stroke-linecap="round"/>
    <path d="M574 388 q56 34 70 96" stroke="${hsl(c, -8)}" stroke-width="14" fill="none" stroke-linecap="round"/>
    <rect x="330" y="418" width="140" height="70" rx="10" fill="#fff" opacity="0.9"/>`;
  },
  bundle(c) {
    return `
    <rect x="196" y="352" width="150" height="232" rx="24" fill="${hsl(c, 6)}"/>
    <rect x="196" y="352" width="48" height="232" rx="24" fill="${hsl(c, 18)}" opacity="0.4"/>
    <rect x="222" y="302" width="98" height="58" rx="14" fill="${hsl(c, -10)}"/>
    <rect x="454" y="352" width="150" height="232" rx="24" fill="${hsl(c, 6)}"/>
    <rect x="454" y="352" width="48" height="232" rx="24" fill="${hsl(c, 18)}" opacity="0.4"/>
    <rect x="480" y="302" width="98" height="58" rx="14" fill="${hsl(c, -10)}"/>
    <rect x="322" y="286" width="156" height="298" rx="28" fill="url(#body)"/>
    <rect x="322" y="286" width="52" height="298" rx="28" fill="${hsl(c, 14)}" opacity="0.35"/>
    <rect x="352" y="228" width="96" height="66" rx="16" fill="${hsl(c, -14)}"/>
    <rect x="340" y="360" width="120" height="150" rx="10" fill="#fff" opacity="0.93"/>
    <rect x="360" y="384" width="58" height="8" rx="4" fill="${hsl(c, 2)}"/>`;
  }
};

/* ------------------------------------------------------------- product ---- */

function product(brand, prod, categories) {
  const c = productHue(brand, prod.category, categories);
  const form = prod.imageForm || formOf(prod);
  const shape = (SHAPES[form] || SHAPES.bottle)(c);
  const name = prod.name.length > 22 ? prod.name.slice(0, 21) + '…' : prod.name;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800" role="img" aria-label="${esc(prod.name)}">
  <!-- [[PLACEHOLDER IMAGE]] Stylised illustration, not a photograph.
       Replace this file with real product photography at the same path (800x800). -->
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0.6" y2="1">
      <stop offset="0%" stop-color="${hsl(c, 46, -14)}"/>
      <stop offset="100%" stop-color="${hsl(c, 38, -10)}"/>
    </linearGradient>
    <linearGradient id="body" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${hsl(c, 12)}"/>
      <stop offset="55%" stop-color="${hsl(c, 0)}"/>
      <stop offset="100%" stop-color="${hsl(c, -12)}"/>
    </linearGradient>
    <radialGradient id="halo" cx="50%" cy="42%" r="52%">
      <stop offset="0%" stop-color="${hsl(c, 30, -6)}" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="${hsl(c, 30, -6)}" stop-opacity="0"/>
    </radialGradient>
    <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="18"/>
    </filter>
  </defs>

  <rect width="800" height="800" fill="url(#bg)"/>
  <circle cx="400" cy="376" r="250" fill="url(#halo)"/>
  <circle cx="640" cy="150" r="96" fill="${hsl(c, 42, -12)}" opacity="0.55"/>
  <circle cx="150" cy="654" r="62" fill="${hsl(c, 42, -12)}" opacity="0.45"/>

  <ellipse cx="400" cy="612" rx="176" ry="30" fill="${hsl(c, -26)}" opacity="0.22" filter="url(#soft)"/>

  ${shape}

  <text x="400" y="690" text-anchor="middle" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif"
        font-size="27" font-weight="600" letter-spacing="-0.4" fill="${hsl(c, -30, -6)}">${esc(name)}</text>
  <text x="400" y="762" text-anchor="middle" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif"
        font-size="14" letter-spacing="1.6" fill="${hsl(c, -22, -10)}" opacity="0.5">PLACEHOLDER IMAGE</text>
</svg>
`;
}

/* Extra gallery angles: same treatment, no pack — a clean tinted backdrop. */
function angle(brand, category, n, categories) {
  const c = productHue(brand, category, categories);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800" role="img" aria-label="Additional product view ${n}">
  <!-- [[PLACEHOLDER IMAGE]] Additional product angle. Replace with a real photo (800x800). -->
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0.7" y2="1">
      <stop offset="0%" stop-color="${hsl(c, 47, -16)}"/>
      <stop offset="100%" stop-color="${hsl(c, 40, -12)}"/>
    </linearGradient>
  </defs>
  <rect width="800" height="800" fill="url(#bg)"/>
  <circle cx="400" cy="400" r="${150 + n * 28}" fill="none" stroke="${hsl(c, 26, -8)}" stroke-width="26" opacity="0.5"/>
  <circle cx="400" cy="400" r="${86 + n * 14}" fill="${hsl(c, 30, -6)}" opacity="0.75"/>
  <text x="400" y="742" text-anchor="middle" font-family="system-ui, sans-serif"
        font-size="15" letter-spacing="1.6" fill="${hsl(c, -20, -10)}" opacity="0.55">PLACEHOLDER — VIEW ${n}</text>
</svg>
`;
}

/* ------------------------------------------------------------ avatars ---- */

/**
 * Reviewer portrait, 600x800. A stylised figure on a tinted interior, sized to
 * sit as a tall panel on the right of a testimonial card. Clearly a
 * placeholder; replace with a real, permissioned photo at the same path.
 */
function avatar(brand, index) {
  const base = hexToHsl(brand.colors.accent);
  const c = { h: (base.h + index * 61) % 360, s: 32, l: 52 };
  const W = 600, H = 800;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Reviewer photo placeholder">
  <!-- [[PLACEHOLDER IMAGE]] Reviewer portrait. Replace with a real photo (600x800, 3:4). -->
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0.6" y2="1">
      <stop offset="0%" stop-color="${hsl(c, 36, -10)}"/>
      <stop offset="100%" stop-color="${hsl(c, 26, -6)}"/>
    </linearGradient>
    <linearGradient id="fig" x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0%" stop-color="${hsl(c, 8)}"/>
      <stop offset="100%" stop-color="${hsl(c, -8)}"/>
    </linearGradient>
    <filter id="sh" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="26"/>
    </filter>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>

  <!-- suggestion of a room behind the figure -->
  <rect x="52" y="96" width="150" height="112" rx="12" fill="${hsl(c, 20, -8)}" opacity="0.65"/>
  <rect x="410" y="150" width="132" height="86" rx="12" fill="${hsl(c, 20, -8)}" opacity="0.5"/>
  <rect x="0" y="628" width="${W}" height="172" fill="${hsl(c, 16, -6)}" opacity="0.7"/>

  <ellipse cx="300" cy="700" rx="220" ry="46" fill="${hsl(c, -20)}" opacity="0.2" filter="url(#sh)"/>

  <!-- figure -->
  <circle cx="300" cy="286" r="92" fill="url(#fig)"/>
  <path d="M120 800 q0 -212 180 -212 q180 0 180 212 z" fill="url(#fig)"/>
  <path d="M120 800 q0 -212 180 -212 v212 z" fill="${hsl(c, 8)}" opacity="0.35"/>

  <text x="${W / 2}" y="770" text-anchor="middle" font-family="system-ui, sans-serif"
        font-size="17" letter-spacing="1.8" fill="${hsl(c, -26, -10)}" opacity="0.5">PLACEHOLDER PHOTO</text>
</svg>
`;
}

/* ---------------------------------------------------------- lifestyle ---- */

/** Abstract brand composition for the hero and about sections. */
function scene(brand, w, h, seed, label) {
  const c = hexToHsl(brand.colors.accent);
  const r = (n) => ((seed * 9301 + n * 49297) % 233280) / 233280;

  const blobs = [0, 1, 2, 3, 4].map((i) => {
    const cx = 0.12 * w + r(i + 1) * 0.78 * w;
    const cy = 0.12 * h + r(i + 6) * 0.78 * h;
    const rad = (0.10 + r(i + 11) * 0.20) * Math.min(w, h);
    return `<circle cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" r="${rad.toFixed(0)}" fill="${hsl(c, 22 + i * 5, -6, i * 26)}" opacity="${(0.30 + r(i + 16) * 0.28).toFixed(2)}"/>`;
  }).join('\n  ');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(label)}">
  <!-- [[PLACEHOLDER IMAGE]] Abstract brand composition. Replace with real photography (${w}x${h}). -->
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0.8" y2="1">
      <stop offset="0%" stop-color="${hsl(c, 44, -12)}"/>
      <stop offset="100%" stop-color="${hsl(c, 32, -6, 18)}"/>
    </linearGradient>
    <filter id="blur" x="-25%" y="-25%" width="150%" height="150%">
      <feGaussianBlur stdDeviation="${(Math.min(w, h) * 0.055).toFixed(0)}"/>
    </filter>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <g filter="url(#blur)">
  ${blobs}
  </g>
  <text x="${w / 2}" y="${h - 26}" text-anchor="middle" font-family="system-ui, sans-serif"
        font-size="${Math.max(12, Math.min(w, h) * 0.019).toFixed(0)}" letter-spacing="1.8"
        fill="${hsl(c, -24, -8)}" opacity="0.45">PLACEHOLDER IMAGE</text>
</svg>
`;
}

/* --------------------------------------------------------------- brand ---- */

function logo(brand, variant) {
  const c = brand.colors;
  const textColor = variant === 'light' ? c.footerText : c.heading;
  const markColor = variant === 'light' ? c.accentTint : c.accent;
  const markInner = variant === 'light' ? c.footerBg : c.background;
  const w = Math.max(150, brand.name.length * 13 + 46);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} 40" width="${w}" height="40" role="img" aria-label="${esc(brand.name)}">
  <!-- [[PLACEHOLDER LOGO]] Replace with the real brand mark at this path. -->
  <defs>
    <linearGradient id="m" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${markColor}"/>
      <stop offset="100%" stop-color="${c.accentHover}"/>
    </linearGradient>
  </defs>
  <rect x="0" y="7" width="28" height="28" rx="9" fill="url(#m)"/>
  <path d="M8 21 l5 5 l8 -10" stroke="${markInner}" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="38" y="28" font-family="${brand.fonts.heading.replace(/"/g, '')}" font-size="20"
        font-weight="${brand.fonts.headingWeight}" letter-spacing="-0.6" fill="${textColor}">${esc(brand.name)}</text>
</svg>
`;
}

function favicon(brand) {
  const c = brand.colors;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <!-- [[PLACEHOLDER FAVICON]] Replace with the real brand icon. -->
  <defs>
    <linearGradient id="f" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c.accent}"/>
      <stop offset="100%" stop-color="${c.accentHover}"/>
    </linearGradient>
  </defs>
  <rect width="32" height="32" rx="9" fill="url(#f)"/>
  <path d="M9 16.5 l4.5 4.5 l9 -10" stroke="${c.background}" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;
}

/* ----------------------------------------------------------------- PNG ---- */
/* Open Graph will not accept SVG, so the share image has to be a raster file. */

const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function hslToRgb(h, s, l) {
  s /= 100; l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}

/** 1200x630 OG image: a soft diagonal brand gradient with an accent base band. */
function ogImage(brand) {
  const W = 1200, H = 630;
  const c = hexToHsl(brand.colors.accent);
  const bandTop = H - 76;

  const raw = Buffer.alloc(H * (1 + W * 3));
  let o = 0;
  for (let y = 0; y < H; y++) {
    raw[o++] = 0; /* filter: none */
    for (let x = 0; x < W; x++) {
      let px;
      if (y >= bandTop) {
        px = hslToRgb(c.h, c.s, c.l);
      } else {
        const t = (x / W) * 0.55 + (y / H) * 0.45;
        px = hslToRgb((c.h + t * 22) % 360, Math.max(18, c.s - 12), 94 - t * 10);
      }
      raw[o++] = px[0];
      raw[o++] = px[1];
      raw[o++] = px[2];
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(W, 0);
  ihdr.writeUInt32BE(H, 4);
  ihdr[8] = 8;  /* bit depth */
  ihdr[9] = 2;  /* colour type: truecolour */

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

module.exports = { product, angle, scene, avatar, logo, favicon, ogImage, formOf };
