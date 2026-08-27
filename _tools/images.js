/* ==========================================================================
   IMAGES.JS — generates every placeholder image.
   Dev-only. The output files are plain .svg / .png that upload like any asset.

   Everything produced here is a labelled placeholder. Real photography
   replaces these files by overwriting them at the same paths.
   ========================================================================== */

const zlib = require('node:zlib');

/* ------------------------------------------------------------------ SVG */

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Generic labelled placeholder block, sized to the real asset's aspect ratio. */
function placeholder(brand, w, h, label, sublabel) {
  const c = brand.colors;
  const fontStack = 'system-ui, -apple-system, Segoe UI, sans-serif';
  const short = Math.min(w, h);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(label)}">
  <!-- [[PLACEHOLDER IMAGE]] Replace this file with real photography at the same path and dimensions. -->
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c.soft}"/>
      <stop offset="100%" stop-color="${c.surface}"/>
    </linearGradient>
    <pattern id="hatch" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="16" stroke="${c.accent}" stroke-width="1" opacity="0.07"/>
    </pattern>
  </defs>

  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <rect width="${w}" height="${h}" fill="url(#hatch)"/>

  <circle cx="${w / 2}" cy="${h / 2 - short * 0.09}" r="${short * 0.13}" fill="none" stroke="${c.accent}" stroke-width="${Math.max(2, short * 0.008)}" opacity="0.35"/>
  <path d="M ${w / 2 - short * 0.055} ${h / 2 - short * 0.09} h ${short * 0.11} M ${w / 2} ${h / 2 - short * 0.145} v ${short * 0.11}"
        stroke="${c.accent}" stroke-width="${Math.max(2, short * 0.008)}" stroke-linecap="round" opacity="0.35"/>

  <text x="${w / 2}" y="${h / 2 + short * 0.11}" text-anchor="middle"
        font-family="${fontStack}" font-size="${Math.max(11, short * 0.045)}" font-weight="600" fill="${c.muted}">
    ${esc(label)}
  </text>
  <text x="${w / 2}" y="${h / 2 + short * 0.175}" text-anchor="middle"
        font-family="${fontStack}" font-size="${Math.max(9, short * 0.032)}" fill="${c.muted}" opacity="0.75">
    ${esc(sublabel || 'PLACEHOLDER — replace with a real photo')}
  </text>
</svg>
`;
}

/** Wordmark logo. `variant` is 'dark' (on light bg) or 'light' (on the footer). */
function logo(brand, variant) {
  const c = brand.colors;
  const textColor = variant === 'light' ? c.footerText : c.heading;
  const markColor = variant === 'light' ? c.accentTint : c.accent;
  const markInner = variant === 'light' ? c.footerBg : c.background;
  const w = Math.max(150, brand.name.length * 13 + 46);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} 40" width="${w}" height="40" role="img" aria-label="${esc(brand.name)}">
  <!-- [[PLACEHOLDER LOGO]] Replace with the real brand mark at this path. -->
  <rect x="0" y="8" width="26" height="26" rx="8" fill="${markColor}"/>
  <circle cx="13" cy="21" r="5.5" fill="${markInner}"/>
  <text x="36" y="28" font-family="${brand.fonts.heading.replace(/"/g, '')}" font-size="20"
        font-weight="${brand.fonts.headingWeight}" letter-spacing="-0.5" fill="${textColor}">${esc(brand.name)}</text>
</svg>
`;
}

function favicon(brand) {
  const c = brand.colors;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <!-- [[PLACEHOLDER FAVICON]] Replace with the real brand icon. -->
  <rect width="32" height="32" rx="9" fill="${c.accent}"/>
  <circle cx="16" cy="16" r="6.5" fill="${c.background}"/>
</svg>
`;
}

/* ------------------------------------------------------------------ PNG */
/* Minimal PNG writer. Open Graph does not accept SVG, so the social share
   image has to be a real raster file. Solid brand colour with an accent bar —
   deliberately plain, and clearly a placeholder. */

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

function hexToRGB(hex) {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((x) => x + x).join('') : h;
  return [parseInt(full.slice(0, 2), 16), parseInt(full.slice(2, 4), 16), parseInt(full.slice(4, 6), 16)];
}

/** 1200x630 OG image: brand soft background with an accent band across the base. */
function ogImage(brand) {
  const W = 1200, H = 630;
  const bg = hexToRGB(brand.colors.soft);
  const accent = hexToRGB(brand.colors.accent);
  const bandTop = H - 84;

  const raw = Buffer.alloc(H * (1 + W * 3));
  let o = 0;
  for (let y = 0; y < H; y++) {
    raw[o++] = 0; /* filter: none */
    const inBand = y >= bandTop;
    const px = inBand ? accent : bg;
    for (let x = 0; x < W; x++) {
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
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

module.exports = { placeholder, logo, favicon, ogImage };
