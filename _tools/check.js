#!/usr/bin/env node
/* ==========================================================================
   CHECK.JS — catches the mistakes that are easy to make in this project.

     node _tools/check.js            check every generated site
     node _tools/check.js everwell   check one

   Written after a stylesheet edit truncated everything past section 27 and
   silently unstyled five sections. Run it after any edit to _shared/.
   ========================================================================== */

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const only = process.argv.slice(2).filter((a) => !a.startsWith('--'));

const sites = fs.readdirSync(ROOT, { withFileTypes: true })
  .filter((d) => d.isDirectory() && !d.name.startsWith('_') && !d.name.startsWith('.'))
  .map((d) => d.name)
  .filter((n) => fs.existsSync(path.join(ROOT, n, 'index.html')))
  .filter((n) => !only.length || only.includes(n));

let failures = 0;

function fail(site, msg) {
  console.log('  FAIL  ' + msg);
  failures++;
}

for (const site of sites) {
  const dir = path.join(ROOT, site);
  console.log('\n' + site);

  const pages = fs.readdirSync(dir).filter((f) => f.endsWith('.html'));
  const css = fs.readFileSync(path.join(dir, 'css', 'base.css'), 'utf8') +
              fs.readFileSync(path.join(dir, 'css', 'brand.css'), 'utf8');
  const js = fs.readFileSync(path.join(dir, 'js', 'site.js'), 'utf8');

  /* 1. Every class the site renders should have a rule somewhere. */
  const used = new Set();
  for (const f of pages.concat(['js/site.js'])) {
    const text = fs.readFileSync(path.join(dir, f), 'utf8');
    for (const m of text.matchAll(/class=["']([^"']+)["']/g)) {
      m[1].split(/\s+/).filter(Boolean).forEach((c) => used.add(c));
    }
  }
  const defined = new Set();
  for (const m of css.matchAll(/\.([a-zA-Z][a-zA-Z0-9_-]*)/g)) defined.add(m[1]);

  /* State classes are toggled by JS, and these two are JS hooks only. */
  const IGNORE = new Set(['hero__pack--', 'mobile-nav__close']);
  const unstyled = [...used]
    .filter((c) => !defined.has(c) && !c.startsWith('is-') && !IGNORE.has(c))
    .sort();

  if (unstyled.length) fail(site, unstyled.length + ' unstyled class(es): ' + unstyled.join(', '));
  else console.log('  ok    every rendered class has a rule (' + used.size + ' classes)');

  /* 2. Balanced braces — a truncated stylesheet usually shows up here. */
  let depth = 0, stray = 0;
  for (const ch of css) {
    if (ch === '{') depth++;
    else if (ch === '}') { depth--; if (depth < 0) stray++; }
  }
  if (depth !== 0 || stray) fail(site, 'unbalanced CSS braces (depth ' + depth + ', stray ' + stray + ')');
  else console.log('  ok    CSS braces balanced');

  /* 3. Every image the HTML points at exists on disk. */
  let missing = 0, imgs = 0;
  for (const f of pages) {
    const html = fs.readFileSync(path.join(dir, f), 'utf8');
    for (const m of html.matchAll(/src="(images\/[^"]+)"/g)) {
      imgs++;
      if (!fs.existsSync(path.join(dir, m[1]))) {
        fail(site, 'missing image ' + m[1] + ' (' + f + ')');
        missing++;
      }
    }
  }
  if (!missing) console.log('  ok    ' + imgs + ' image references all resolve');

  /* 4. Every Site.* called from a page is actually exported. */
  const exported = new Set();
  const ret = js.slice(js.lastIndexOf('return {'));
  for (const m of ret.matchAll(/^\s*([a-zA-Z0-9_]+):/gm)) exported.add(m[1]);

  const calledMissing = new Set();
  for (const f of pages) {
    const html = fs.readFileSync(path.join(dir, f), 'utf8');
    for (const m of html.matchAll(/Site\.([a-zA-Z0-9_]+)\s*\(/g)) {
      if (!exported.has(m[1])) calledMissing.add(m[1] + ' (' + f + ')');
    }
  }
  if (calledMissing.size) fail(site, 'Site.* called but not exported: ' + [...calledMissing].join(', '));
  else console.log('  ok    every Site.* call is exported');

  /* 5. No unrendered template tokens left behind. */
  let tokens = 0;
  for (const f of pages) {
    const html = fs.readFileSync(path.join(dir, f), 'utf8');
    const found = html.match(/\{\{[a-zA-Z0-9_.]+\}\}/g);
    if (found) { fail(site, f + ' still has ' + found.length + ' token(s): ' + found.join(', ')); tokens++; }
  }
  if (!tokens) console.log('  ok    no unrendered {{tokens}}');
}

console.log('\n' + (failures ? failures + ' problem(s) found.' : 'All checks passed for ' + sites.length + ' site(s).'));
process.exit(failures ? 1 : 0);
