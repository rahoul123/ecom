/* ==========================================================================
   ADMIN.JS — the catalogue editor behind admin.html.

   The shape of the problem: this site has no server, so there is nowhere to
   "save" to. What there is instead is one small file, js/products.js, that
   the shop reads its catalogue from. So this panel edits a copy of the
   catalogue in the browser, keeps it in localStorage so a closed tab costs
   nothing, and then writes that file out for the owner to upload.

   Everything a product needs but nobody should have to type — the SKU, the
   card tint, the gallery, the meta description — is derived on export, using
   the same rules _tools/generate.js uses. That is deliberate duplication:
   generate.js runs in Node and cannot be loaded here. If you change the
   derivation there, change it here too. `deriveProduct` below is the whole
   of it, and it is short on purpose.

   Loaded on every page and does nothing unless #adm-list is present.
   ========================================================================== */

var Admin = (function () {
  'use strict';

  var STORE = 'admin.catalogue.v1';

  /* A photo bigger than this is downscaled before it is embedded. 1200px is
     more than the largest place a product image is shown. */
  var MAX_EMBED_PX = 1200;
  var EMBED_QUALITY = 0.82;

  function el(sel, ctx) { return (ctx || document).querySelector(sel); }
  function els(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var state = {
    items: [],
    index: -1,
    filter: '',
    /* Whether this catalogue differs from the one the site currently ships. */
    dirty: false
  };

  /* ------------------------------------------------------------ deriving -- */

  function slugify(name) {
    return String(name || '')
      .toLowerCase()
      .replace(/['’]/g, '')
      .replace(/&/g, ' ')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /** Mixes a hex colour toward white (amount > 0) or black (amount < 0). */
  function shade(hex, amount) {
    var h = String(hex || '').replace('#', '');
    if (h.length === 3) h = h.split('').map(function (x) { return x + x; }).join('');
    if (!/^[0-9a-f]{6}$/i.test(h)) return null;
    var mix = amount > 0 ? 255 : 0;
    var t = Math.abs(amount);
    return '#' + [0, 2, 4].map(function (i) {
      var v = parseInt(h.slice(i, i + 2), 16);
      return Math.round(v + (mix - v) * t).toString(16).padStart(2, '0');
    }).join('');
  }

  function brandSlug() {
    return String((BRAND && BRAND.slug) || 'shop').toUpperCase().replace(/-/g, '');
  }

  /**
   * Fills in everything the shop expects but the form does not ask for.
   * Mirrors the product normaliser in _tools/generate.js — see the file note.
   */
  function deriveProduct(p) {
    var out = {};
    var key;
    for (key in p) if (Object.prototype.hasOwnProperty.call(p, key)) out[key] = p[key];

    var cat = out.category || 'Products';
    var catSlug = slugify(cat);
    var image = out.image || ('images/products/' + out.slug + '.svg');

    out.sku = brandSlug() + '-' + String(out.slug || '').toUpperCase().replace(/-/g, '');
    out.metaDescription = out.metaDescription ||
      (out.name + ' from ' + ((BRAND && BRAND.name) || 'our shop') + '. ' + (out.shortBenefit || ''));
    out.image = image;
    out.imageAlt = out.imageAlt || ('Product photo of ' + out.name);

    /* An embedded photo has no sibling angle shots to show, so the gallery is
       just the one image rather than three broken ones. */
    out.gallery = image.indexOf('data:') === 0 ? [image] : [
      image,
      'images/products/_angle-' + catSlug + '-2.svg',
      'images/products/_angle-' + catSlug + '-3.svg',
      'images/products/_angle-' + catSlug + '-4.svg'
    ];

    if (out.priceNote === undefined) {
      out.priceNote = BRAND && BRAND.priceNote !== undefined ? BRAND.priceNote : null;
    }

    out.tint = out.swatch ? shade(out.swatch, 0.86) : null;
    out.deep = out.swatch ? shade(out.swatch, -0.55) : null;

    out.options = out.options || [];
    out.benefits = out.benefits || [];
    out.ingredients = out.ingredients || [];
    return out;
  }

  function blankProduct() {
    return {
      slug: '',
      name: '',
      category: (categories()[0] || 'Products'),
      shortBenefit: '',
      description: '',
      price: 0,
      compareAt: null,
      priceNote: undefined,
      rating: 5,
      reviewCount: 0,
      badge: 'New',
      featured: false,
      optionLabel: (BRAND && BRAND.optionLabel) || 'Option',
      options: [],
      benefits: [],
      ingredients: [],
      howItWorks: '',
      image: '',
      swatch: null,
      colour: null
    };
  }

  function categories() {
    var seen = [];
    state.items.forEach(function (p) {
      if (p.category && seen.indexOf(p.category) === -1) seen.push(p.category);
    });
    return seen;
  }

  /* ------------------------------------------------------------- storage -- */

  function save() {
    try {
      localStorage.setItem(STORE, JSON.stringify({ items: state.items, dirty: state.dirty }));
    } catch (e) {
      /* Private mode, or a full quota. The work is still on screen, so say so
         rather than failing silently. */
      toast('This browser will not let the panel save a draft. Export before you close the tab.', true);
    }
  }

  function load() {
    var raw = null;
    try { raw = localStorage.getItem(STORE); } catch (e) { raw = null; }

    if (raw) {
      try {
        var draft = JSON.parse(raw);
        if (draft && Array.isArray(draft.items) && draft.items.length > 0) {
          state.items = draft.items;
          state.dirty = !!draft.dirty;
          return;
        }
      } catch (e) { /* A corrupt draft is no reason to refuse to open. */ }
    }
    resetToLive();
  }

  /** Starts again from the catalogue the site currently ships. */
  function resetToLive() {
    var source = (typeof PRODUCTS !== 'undefined' && Array.isArray(PRODUCTS) && PRODUCTS.length)
      ? PRODUCTS
      : (typeof BRAND !== 'undefined' && BRAND.products && Array.isArray(BRAND.products))
      ? BRAND.products
      : [];

    state.items = source.map(function (p) {
      return JSON.parse(JSON.stringify(p));
    });
    state.dirty = false;
  }

  /* ------------------------------------------------------------ the list -- */

  function matches(p) {
    if (!state.filter) return true;
    var q = state.filter.toLowerCase();
    return (p.name || '').toLowerCase().indexOf(q) !== -1 ||
           (p.category || '').toLowerCase().indexOf(q) !== -1;
  }

  function money(v) {
    var cur = (BRAND && BRAND.currency) || { symbol: '$', decimals: 2 };
    return cur.symbol + Number(v || 0).toFixed(cur.decimals);
  }

  function renderList() {
    var host = el('#adm-list');
    if (!host) return;

    var shown = 0;
    host.innerHTML = state.items.map(function (p, i) {
      if (!matches(p)) return '';
      shown++;
      var tint = p.swatch ? shade(p.swatch, 0.86) : null;
      return '<li class="adm-item' + (i === state.index ? ' is-active' : '') + '" data-index="' + i + '">' +
        '<button type="button" class="adm-item__open">' +
          '<span class="adm-item__thumb"' + (tint ? ' style="background:' + esc(tint) + '"' : '') + '>' +
            (p.image ? '<img src="' + esc(p.image) + '" alt="" loading="lazy">' : '') +
          '</span>' +
          '<span class="adm-item__body">' +
            '<span class="adm-item__name">' + (esc(p.name) || '<i>Untitled</i>') + '</span>' +
            '<span class="adm-item__meta">' + esc(p.category || '—') + ' &middot; ' + money(p.price) +
            (p.featured ? ' &middot; <b>home</b>' : '') + '</span>' +
          '</span>' +
        '</button>' +
        '<span class="adm-item__move">' +
          '<button type="button" class="adm-mini" data-move="-1" aria-label="Move up"' + (i === 0 ? ' disabled' : '') + '>&#9650;</button>' +
          '<button type="button" class="adm-mini" data-move="1" aria-label="Move down"' + (i === state.items.length - 1 ? ' disabled' : '') + '>&#9660;</button>' +
        '</span>' +
      '</li>';
    }).join('');

    var empty = el('#adm-list-empty');
    if (empty) empty.hidden = shown > 0 || !state.filter;

    var count = el('#adm-count');
    if (count) {
      count.textContent = state.items.length + (state.items.length === 1 ? ' product' : ' products');
    }

    var flag = el('#adm-state');
    if (flag) {
      flag.hidden = !state.dirty;
      flag.textContent = 'not exported yet';
    }

    var listCats = el('#adm-categories');
    if (listCats) {
      listCats.innerHTML = categories().map(function (c) {
        return '<option value="' + esc(c) + '">';
      }).join('');
    }
  }

  /* ----------------------------------------------------------- the form -- */

  function current() {
    return state.index >= 0 ? state.items[state.index] : null;
  }

  function fillForm() {
    var p = current();
    var editor = el('#adm-editor');
    var blank = el('#adm-blank');
    if (editor) editor.hidden = !p;
    if (blank) blank.hidden = !!p;
    if (!p) return;

    els('[data-field]').forEach(function (input) {
      var v = p[input.getAttribute('data-field')];
      if (input.type === 'checkbox') input.checked = !!v;
      else input.value = v == null ? '' : v;
    });

    els('[data-list]').forEach(function (input) {
      var v = p[input.getAttribute('data-list')];
      input.value = Array.isArray(v) ? v.join('\n') : '';
    });

    var hex = el('#f-swatch-hex');
    if (hex) hex.value = p.swatch || '';
    var picker = el('#f-swatch');
    if (picker && p.swatch) picker.value = p.swatch;

    var embed = el('#adm-embed');
    if (embed) embed.checked = String(p.image || '').indexOf('data:') === 0;

    renderPreview();
    renderImagePreview();
    validate();
  }

  /** Reads one control back into the selected product. */
  function bindInput(input) {
    var field = input.getAttribute('data-field');
    var list = input.getAttribute('data-list');
    var p = current();
    if (!p) return;

    if (list) {
      p[list] = input.value.split('\n').map(function (s) { return s.trim(); })
        .filter(function (s) { return s; });
    } else if (input.type === 'checkbox') {
      p[field] = input.checked;
    } else if (input.type === 'number') {
      p[field] = input.value === '' ? null : Number(input.value);
    } else {
      var v = input.value.trim();
      /* An empty text box means "no value", not an empty string — the shop
         tests these with a plain truthiness check. */
      p[field] = v === '' ? (field === 'badge' || field === 'colour' || field === 'priceNote' ? null : '') : v;
    }

    /* The web address follows the name until somebody types their own. */
    if (field === 'name' && !p._slugLocked) {
      p.slug = uniqueSlug(slugify(p.name), state.index);
      var slugInput = el('#f-slug');
      if (slugInput) slugInput.value = p.slug;
    }
    if (field === 'slug') {
      p._slugLocked = true;
      p.slug = slugify(input.value);
    }

    touch();
  }

  function uniqueSlug(base, exceptIndex) {
    var slug = base || 'product';
    var n = 1;
    var taken = function (s) {
      return state.items.some(function (p, i) { return i !== exceptIndex && p.slug === s; });
    };
    while (taken(slug)) { n++; slug = base + '-' + n; }
    return slug;
  }

  function touch() {
    state.dirty = true;
    save();
    renderList();
    renderPreview();
    updateSlugPreview();
    validate();
  }

  function updateSlugPreview() {
    var p = current();
    var note = el('#slug-preview');
    if (note && p) note.textContent = 'product.html?p=' + (p.slug || '');
  }

  /* -------------------------------------------------------- the preview -- */

  function renderPreview() {
    var host = el('#adm-preview');
    var p = current();
    if (!host || !p) return;
    /* Site.productCard is the shop's own renderer, so this is not a mock-up
       of the card — it is the card. */
    try {
      host.innerHTML = Site.productCard(deriveProduct(p));
    } catch (e) {
      host.innerHTML = '<p class="adm-hint">Preview unavailable: ' + esc(e.message) + '</p>';
    }
  }

  function renderImagePreview() {
    var host = el('#adm-image-preview');
    var note = el('#adm-image-note');
    var p = current();
    if (!host || !p) return;

    if (!p.image) {
      host.innerHTML = '<span class="adm-image__none">No photo</span>';
      if (note) note.innerHTML = 'Point this at a file in your <code>images/products/</code> folder.';
      return;
    }

    host.innerHTML = '<img src="' + esc(p.image) + '" alt="">';

    if (String(p.image).indexOf('data:') === 0) {
      if (note) {
        note.innerHTML = 'Carried inside <code>products.js</code> (' +
          Math.round(p.image.length / 1024) + ' KB). Nothing to upload separately.';
      }
      return;
    }

    /* Tell them now if the path is wrong, not after they have uploaded. */
    var probe = new Image();
    probe.onload = function () {
      if (note) note.innerHTML = 'Found. <code>' + esc(p.image) + '</code>';
    };
    probe.onerror = function () {
      if (note) {
        note.innerHTML = '<b>Not found here.</b> Upload the file to <code>' +
          esc(p.image.replace(/[^/]+$/, '')) + '</code> on your hosting, or choose a photo below.';
      }
    };
    probe.src = p.image;
  }

  /* ------------------------------------------------------------ photos --- */

  /** Shrinks a chosen photo so an embedded copy stays a sane size. */
  function readImage(file, embed, done) {
    if (!embed) {
      done('images/products/' + file.name.replace(/\s+/g, '-').toLowerCase());
      return;
    }

    var reader = new FileReader();
    reader.onload = function () {
      var img = new Image();
      img.onload = function () {
        var scale = Math.min(1, MAX_EMBED_PX / Math.max(img.width, img.height));
        var canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        /* JPEG, because a photo as PNG is several times the size for no gain.
           A transparent cut-out would lose its transparency, which is worth
           saying out loud if that ever matters here. */
        done(canvas.toDataURL('image/jpeg', EMBED_QUALITY));
      };
      img.onerror = function () { toast('That file could not be read as an image.', true); };
      img.src = reader.result;
    };
    reader.onerror = function () { toast('That file could not be read.', true); };
    reader.readAsDataURL(file);
  }

  /* -------------------------------------------------------- validation --- */

  function setError(id, message) {
    var host = el('#err-' + id);
    if (host) host.textContent = message || '';
    var input = el('#f-' + id);
    if (input) input.classList.toggle('is-bad', !!message);
    return !message;
  }

  /** Problems worth blocking an export over, checked across the catalogue. */
  function validate() {
    var p = current();
    if (!p) return true;

    var ok = true;
    ok = setError('name', p.name ? '' : 'Give the product a name.') && ok;

    var clash = state.items.some(function (o, i) { return i !== state.index && o.slug === p.slug; });
    ok = setError('slug', !p.slug ? 'Needed — this is the product’s web address.'
      : clash ? 'Another product already uses this address.' : '') && ok;

    ok = setError('price', p.price === null || isNaN(p.price) || p.price < 0
      ? 'Enter a price of zero or more.' : '') && ok;

    ok = setError('compareAt', p.compareAt && p.compareAt <= p.price
      ? 'The old price should be higher than the price, or empty.' : '') && ok;

    ok = setError('rating', p.rating != null && (p.rating < 0 || p.rating > 5)
      ? 'A rating runs from 0 to 5.' : '') && ok;

    return ok;
  }

  /** Every product, not just the open one — an export ships the lot. */
  function problems() {
    var found = [];
    var seen = {};
    state.items.forEach(function (p, i) {
      var where = p.name || 'Product ' + (i + 1);
      if (!p.name) found.push(where + ' has no name.');
      if (!p.slug) found.push(where + ' has no web address.');
      else if (seen[p.slug]) found.push(where + ' shares a web address with ' + seen[p.slug] + '.');
      else seen[p.slug] = where;
      if (p.price === null || isNaN(p.price) || p.price < 0) found.push(where + ' has no price.');
      if (!p.category) found.push(where + ' has no category.');
    });
    return found;
  }

  /* ------------------------------------------------------------ export --- */

  function exportText() {
    var clean = state.items.map(function (p) {
      var d = deriveProduct(p);
      delete d._slugLocked;
      return d;
    });

    var embedded = clean.filter(function (p) { return String(p.image).indexOf('data:') === 0; }).length;

    return '/* ==========================================================================\n' +
      '   PRODUCTS.JS — your catalogue.\n' +
      '\n' +
      '   Written by admin.html on ' + new Date().toISOString().slice(0, 10) + '.\n' +
      '   ' + clean.length + ' product' + (clean.length === 1 ? '' : 's') +
      (embedded ? ', ' + embedded + ' with the photo carried inside this file' : '') + '.\n' +
      '\n' +
      '   Upload this over js/products.js on your hosting and reload the shop.\n' +
      '   To change it again, open admin.html, use Import to load this file, and\n' +
      '   export a new one.\n' +
      '   ========================================================================== */\n' +
      '\n' +
      'PRODUCTS = ' + JSON.stringify(clean, null, 2) + ';\n';
  }

  function download(name, text) {
    var blob = new Blob([text], { type: 'text/javascript' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    /* Revoking immediately can cancel the download in some browsers. */
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
  }

  function doExport() {
    var issues = problems();
    if (issues.length) {
      toast('Fix these first: ' + issues.slice(0, 3).join(' ') +
        (issues.length > 3 ? ' (+' + (issues.length - 3) + ' more)' : ''), true);
      return;
    }

    var text = exportText();
    download('products.js', text);

    state.dirty = false;
    save();
    renderList();
    toast('products.js downloaded (' + Math.round(text.length / 1024) + ' KB). ' +
      'Upload it to your js/ folder and reload the shop.');
  }

  /* ------------------------------------------------------------ import --- */

  function doImport(file) {
    var reader = new FileReader();
    reader.onload = function () {
      var text = String(reader.result);
      var items = null;

      /* Either a products.js this panel wrote, or a plain JSON array. */
      var start = text.indexOf('PRODUCTS');
      if (start !== -1) {
        var open = text.indexOf('[', start);
        var close = text.lastIndexOf(']');
        if (open !== -1 && close > open) {
          try { items = JSON.parse(text.slice(open, close + 1)); } catch (e) { items = null; }
        }
      }
      if (!items) {
        try { items = JSON.parse(text); } catch (e) { items = null; }
      }

      if (!Array.isArray(items) || !items.length) {
        toast('That file did not contain a product list.', true);
        return;
      }

      state.items = items;
      state.index = -1;
      state.dirty = true;
      save();
      renderList();
      fillForm();
      toast('Loaded ' + items.length + ' product' + (items.length === 1 ? '' : 's') + '.');
    };
    reader.onerror = function () { toast('That file could not be read.', true); };
    reader.readAsText(file);
  }

  /* ------------------------------------------------------------- toast --- */

  var toastTimer = null;
  function toast(message, bad) {
    var host = el('#adm-toast');
    if (!host) return;
    host.hidden = false;
    host.textContent = message;
    host.className = 'adm-toast' + (bad ? ' is-bad' : '');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { host.hidden = true; }, bad ? 9000 : 6000);
  }

  /* -------------------------------------------------------------- wire --- */

  function select(i) {
    state.index = i;
    renderList();
    fillForm();
    updateSlugPreview();
    var editor = el('#adm-editor');
    if (editor && window.innerWidth < 900) editor.scrollIntoView({ block: 'start' });
  }

  function init() {
    if (!el('#adm-list')) return;

    load();
    renderList();
    fillForm();

    /* --- the list --- */
    el('#adm-list').addEventListener('click', function (ev) {
      var row = ev.target.closest('.adm-item');
      if (!row) return;
      var i = Number(row.getAttribute('data-index'));

      var move = ev.target.closest('[data-move]');
      if (move) {
        var to = i + Number(move.getAttribute('data-move'));
        if (to < 0 || to >= state.items.length) return;
        var moved = state.items.splice(i, 1)[0];
        state.items.splice(to, 0, moved);
        if (state.index === i) state.index = to;
        else if (state.index === to) state.index = i;
        state.dirty = true;
        save();
        renderList();
        return;
      }

      select(i);
    });

    el('#adm-search').addEventListener('input', function (ev) {
      state.filter = ev.target.value;
      renderList();
    });

    /* --- the form --- */
    var form = el('#adm-form');
    form.addEventListener('input', function (ev) {
      var input = ev.target.closest('[data-field], [data-list]');
      if (input) bindInput(input);
    });
    form.addEventListener('change', function (ev) {
      var input = ev.target.closest('[data-field]');
      if (input && input.type === 'checkbox') bindInput(input);
    });
    form.addEventListener('submit', function (ev) { ev.preventDefault(); });

    /* --- colour --- */
    var picker = el('#f-swatch');
    var hexBox = el('#f-swatch-hex');
    picker.addEventListener('input', function () {
      var p = current();
      if (!p) return;
      p.swatch = picker.value;
      hexBox.value = picker.value;
      touch();
      renderImagePreview();
    });
    hexBox.addEventListener('input', function () {
      var p = current();
      if (!p) return;
      var v = hexBox.value.trim();
      if (/^#?[0-9a-f]{3}([0-9a-f]{3})?$/i.test(v)) {
        p.swatch = v[0] === '#' ? v : '#' + v;
        /* shade(x, 0) returns x unchanged but always six digits, which is
           the only form input[type=color] accepts. */
        picker.value = shade(p.swatch, 0) || picker.value;
        touch();
      }
    });
    el('#f-swatch-clear').addEventListener('click', function () {
      var p = current();
      if (!p) return;
      p.swatch = null;
      hexBox.value = '';
      touch();
    });

    /* --- photos --- */
    el('#adm-pick-file').addEventListener('click', function () { el('#adm-file').click(); });
    el('#adm-file').addEventListener('change', function (ev) {
      var file = ev.target.files && ev.target.files[0];
      var p = current();
      if (!file || !p) return;
      readImage(file, el('#adm-embed').checked, function (src) {
        p.image = src;
        el('#f-image').value = src.indexOf('data:') === 0 ? '' : src;
        touch();
        renderImagePreview();
      });
      ev.target.value = '';
    });
    el('#f-image').addEventListener('change', renderImagePreview);

    /* --- catalogue buttons --- */
    el('#adm-add').addEventListener('click', function () {
      var p = blankProduct();
      p.slug = uniqueSlug('new-product', -1);
      p.name = '';
      state.items.push(p);
      state.index = state.items.length - 1;
      state.filter = '';
      el('#adm-search').value = '';
      state.dirty = true;
      save();
      renderList();
      fillForm();
      var name = el('#f-name');
      if (name) name.focus();
    });

    el('#adm-duplicate').addEventListener('click', function () {
      var p = current();
      if (!p) return;
      var copy = JSON.parse(JSON.stringify(p));
      copy.name = p.name + ' (copy)';
      copy.slug = uniqueSlug(slugify(copy.name), -1);
      copy._slugLocked = true;
      state.items.splice(state.index + 1, 0, copy);
      select(state.index + 1);
      state.dirty = true;
      save();
      renderList();
    });

    el('#adm-delete').addEventListener('click', function () {
      var p = current();
      if (!p) return;
      if (!window.confirm('Delete "' + (p.name || 'this product') + '"? This cannot be undone.')) return;
      state.items.splice(state.index, 1);
      state.index = -1;
      state.dirty = true;
      save();
      renderList();
      fillForm();
    });

    el('#adm-revert').addEventListener('click', function () {
      if (!window.confirm('Throw away your edits and start again from the products the shop currently ships?')) return;
      resetToLive();
      state.index = -1;
      save();
      renderList();
      fillForm();
      toast('Back to the catalogue the site is using now.');
    });

    el('#adm-export').addEventListener('click', doExport);

    el('#adm-import').addEventListener('click', function () { el('#adm-import-file').click(); });
    el('#adm-import-file').addEventListener('change', function (ev) {
      var file = ev.target.files && ev.target.files[0];
      if (file) doImport(file);
      ev.target.value = '';
    });

    /* Leaving with work that has never been exported loses it if the browser
       clears its storage, so it is worth one prompt. */
    window.addEventListener('beforeunload', function (ev) {
      if (!state.dirty) return;
      ev.preventDefault();
      ev.returnValue = '';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { exportText: exportText, deriveProduct: deriveProduct };
})();
