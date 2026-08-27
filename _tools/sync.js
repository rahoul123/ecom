#!/usr/bin/env node
/* ==========================================================================
   SYNC.JS — push shared CSS/JS changes to all 5 brand folders.

     node _tools/sync.js

   Copies _shared/css/base.css and _shared/js/{theme-init,site,tracking}.js
   into every brand folder. Does NOT touch:
     - js/brand-config.js   (your data — never overwritten)
     - css/brand.css        (per-brand tokens)
     - any .html file       (use `node _tools/generate.js` for those)
     - images/              (your photos)

   No Node? Copy the four files by hand — they are byte-identical in every
   brand folder, so a plain copy-paste does exactly the same job.
   ========================================================================== */

const { execFileSync } = require('node:child_process');
const path = require('node:path');

execFileSync(process.execPath, [path.join(__dirname, 'generate.js'), '--assets-only'], { stdio: 'inherit' });
