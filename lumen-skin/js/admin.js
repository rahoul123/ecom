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

/* ==========================================================================
   SERVER — the optional half.

   If api/save.php is on the host, the panel can write the catalogue straight
   to the site: press Save, reload the shop, done. If it is not — a static
   host, or the files opened from disk — every call here reports "no server"
   and the panel falls back to downloading products.js for you to upload.

   So the panel works either way. It just works better with PHP behind it.
   ========================================================================== */

var Server = (function () {
  'use strict';

  var state = {
    /* null until the first probe answers: unknown, not absent. */
    reachable: null,
    configured: false,
    signedIn: false,
    writable: false,
    csrf: ''
  };

  function available() { return state.reachable === true; }
  function signedIn() { return state.reachable === true && state.signedIn; }
  function configured() { return state.configured; }
  function writable() { return state.writable; }

  function json(res) {
    return res.text().then(function (text) {
      try { return JSON.parse(text); }
      catch (e) {
        /* A PHP fatal, or a host serving the file as plain text. Either way
           the useful thing is the first line of what came back. */
        throw new Error(text.slice(0, 160) || ('Server said ' + res.status));
      }
    });
  }

  /** Asks the host whether there is an API, and who we are. */
  function probe(done) {
    if (typeof fetch !== 'function' || location.protocol === 'file:') {
      state.reachable = false;
      done(state);
      return;
    }

    fetch('api/session.php', { credentials: 'same-origin', headers: { Accept: 'application/json' } })
      .then(json)
      .then(function (data) {
        state.reachable = true;
        state.configured = !!data.configured;
        state.signedIn = !!data.signedIn;
        state.writable = !!data.writable;
        state.csrf = data.csrf || '';
      })
      .catch(function () { state.reachable = false; })
      .then(function () { done(state); });
  }

  function signIn(password, done) {
    fetch('api/session.php', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: password })
    })
      .then(json)
      .then(function (data) {
        if (!data.ok) throw new Error(data.error || 'Could not sign in.');
        state.signedIn = true;
        state.csrf = data.csrf || state.csrf;
        done(null);
      })
      .catch(function (e) { done(e.message); });
  }

  function signOut(done) {
    fetch('api/session.php', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ logout: 1 })
    })
      .then(json)
      .then(function () { state.signedIn = false; done(null); })
      .catch(function (e) { done(e.message); });
  }

  function save(payload, done) {
    fetch('api/save.php', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', 'X-CSRF': state.csrf },
      body: JSON.stringify(payload)
    })
      .then(json)
      .then(function (data) {
        if (!data.ok) throw new Error(data.error || 'The save failed.');
        done(null, data);
      })
      .catch(function (e) {
        /* A session that timed out looks like any other refusal from here,
           so say the one thing that fixes it. */
        done(/signed in/i.test(e.message) ? 'Your sign-in expired. Sign in and save again.' : e.message);
      });
  }

  function upload(file, done) {
    var form = new FormData();
    form.append('photo', file);
    fetch('api/upload.php', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'X-CSRF': state.csrf },
      body: form
    })
      .then(json)
      .then(function (data) {
        if (!data.ok) throw new Error(data.error || 'The upload failed.');
        done(null, data.url);
      })
      .catch(function (e) { done(e.message); });
  }

  return {
    probe: probe,
    available: available,
    configured: configured,
    signedIn: signedIn,
    writable: writable,
    signIn: signIn,
    signOut: signOut,
    save: save,
    upload: upload
  };
})();

var Admin = (function () {
  'use strict';

  var STORE = 'admin.catalogue.v1';

  /* A photo bigger than this is downscaled before it is embedded. 1200px is
     more than the largest place a product image is shown. */
  var MAX_EMBED_PX = 1200;

  /* How many photos a product can carry. Four is what the product page lays
     out: one large, three thumbnails beneath. */
  var GALLERY_SLOTS = 4;
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
    /* Category order and blurbs. A category only exists because a product is
       in it, so this list is about presentation, not membership. */
    categories: [],
    collections: [],
    index: -1,
    collIndex: -1,
    filter: '',
    pickerFilter: '',
    tab: 'products',
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

    /* The gallery is whatever the product actually has.
       Those _angle- files are one generic set per category, so every
       pillowcase was showing the same three grey circles. They are only a
       fallback now, for a product nobody has given photos to yet. */
    var shots = (out.gallery || []).filter(Boolean);
    if (shots.length) {
      out.gallery = shots.slice(0, GALLERY_SLOTS);
      out.image = shots[0];
    } else if (image.indexOf('data:') === 0) {
      out.gallery = [image];
    } else {
      out.gallery = [
        image,
        'images/products/_angle-' + catSlug + '-2.svg',
        'images/products/_angle-' + catSlug + '-3.svg',
        'images/products/_angle-' + catSlug + '-4.svg'
      ];
    }

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
      gallery: [],
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
      localStorage.setItem(STORE, JSON.stringify({
        items: state.items,
        categories: state.categories,
        collections: state.collections,
        dirty: state.dirty
      }));
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
        if (draft && Array.isArray(draft.items) && draft.items.length) {
          state.items = draft.items;
          state.categories = Array.isArray(draft.categories) ? draft.categories : [];
          state.collections = Array.isArray(draft.collections) ? draft.collections : [];
          state.dirty = !!draft.dirty;
          syncCategories();
          return;
        }
      } catch (e) { /* A corrupt draft is no reason to refuse to open. */ }
    }
    resetToLive();
  }

  /** Starts again from the catalogue the site currently ships. */
  function resetToLive() {
    var live = (typeof PRODUCTS !== 'undefined' && Array.isArray(PRODUCTS)) ? PRODUCTS : [];
    state.items = live.map(function (p) { return JSON.parse(JSON.stringify(p)); });

    var liveCats = (typeof CATEGORIES !== 'undefined' && Array.isArray(CATEGORIES)) ? CATEGORIES : [];
    state.categories = liveCats.map(function (c) { return JSON.parse(JSON.stringify(c)); });

    var liveColls = (typeof COLLECTIONS !== 'undefined' && Array.isArray(COLLECTIONS)) ? COLLECTIONS : [];
    state.collections = liveColls.map(function (c) { return JSON.parse(JSON.stringify(c)); });

    state.index = -1;
    state.collIndex = -1;
    state.dirty = false;
    syncCategories();
  }

  /* ------------------------------------------------------- categories ---- */

  /**
   * Keeps state.categories in step with the products.
   *
   * A category exists because products are in it. This adds an entry for any
   * category a product names but the list has not got, and drops entries for
   * categories nothing is in any more — an empty category is a menu link to
   * an empty page.
   */
  function syncCategories() {
    var counts = {};
    state.items.forEach(function (p) {
      if (p.category) counts[p.category] = (counts[p.category] || 0) + 1;
    });

    state.categories = state.categories.filter(function (c) {
      return c && c.name && counts[c.name];
    });

    var have = {};
    state.categories.forEach(function (c) { have[c.name] = true; });

    /* New ones go on the end, in the order the products introduce them. */
    state.items.forEach(function (p) {
      if (p.category && !have[p.category]) {
        have[p.category] = true;
        state.categories.push({ name: p.category, slug: slugify(p.category), blurb: '' });
      }
    });

    state.categories.forEach(function (c) {
      c.slug = slugify(c.name);
      c.count = counts[c.name] || 0;
    });
  }

  function renderCategories() {
    var host = el('#adm-cats');
    if (!host) return;
    syncCategories();

    host.innerHTML = state.categories.map(function (c, i) {
      return '<li class="adm-cat" data-cat-index="' + i + '">' +
        '<span class="adm-cat__move">' +
          '<button type="button" class="adm-mini" data-cat-move="-1" aria-label="Move up"' + (i === 0 ? ' disabled' : '') + '>&#9650;</button>' +
          '<button type="button" class="adm-mini" data-cat-move="1" aria-label="Move down"' + (i === state.categories.length - 1 ? ' disabled' : '') + '>&#9660;</button>' +
        '</span>' +
        '<span class="adm-cat__fields">' +
          '<input class="adm-cat__name" type="text" value="' + esc(c.name) + '" data-cat-name aria-label="Category name">' +
          '<input class="adm-cat__blurb" type="text" value="' + esc(c.blurb || '') + '" data-cat-blurb placeholder="One line about this category (optional)" aria-label="Category description">' +
        '</span>' +
        '<span class="adm-cat__count">' + c.count + '</span>' +
        '<button type="button" class="adm-mini adm-mini--danger" data-cat-delete' +
          ' title="A category can only go once nothing is in it">Delete</button>' +
      '</li>';
    }).join('');
  }

  /** Renaming a category moves every product that was in it. */
  function renameCategory(from, to) {
    to = String(to || '').trim();
    if (!to || to === from) return false;

    var clash = state.categories.some(function (c) { return c.name === to; });
    state.items.forEach(function (p) { if (p.category === from) p.category = to; });

    if (clash) {
      /* Merging into an existing category: drop the now-duplicate entry. */
      state.categories = state.categories.filter(function (c) { return c.name !== from; });
    } else {
      state.categories.forEach(function (c) { if (c.name === from) { c.name = to; c.slug = slugify(to); } });
    }
    return true;
  }

  /* ------------------------------------------------------ collections ---- */

  function currentColl() {
    return state.collIndex >= 0 ? state.collections[state.collIndex] : null;
  }

  function uniqueCollSlug(base, exceptIndex) {
    var slug = base || 'collection';
    var n = 1;
    while (state.collections.some(function (c, i) { return i !== exceptIndex && c.slug === slug; })) {
      n++;
      slug = base + '-' + n;
    }
    return slug;
  }

  /** Products still in the catalogue, in the order the collection lists. */
  function collProducts(coll) {
    var out = [];
    (coll.products || []).forEach(function (slug) {
      state.items.forEach(function (p) { if (p.slug === slug) out.push(p); });
    });
    return out;
  }

  function renderCollections() {
    var host = el('#adm-colls');
    if (!host) return;

    host.innerHTML = state.collections.map(function (c, i) {
      var items = collProducts(c);
      var first = items[0];
      var tint = first && first.swatch ? shade(first.swatch, 0.86) : null;
      return '<li class="adm-item' + (i === state.collIndex ? ' is-active' : '') + '" data-coll-index="' + i + '">' +
        '<button type="button" class="adm-item__open">' +
          '<span class="adm-item__thumb"' + (tint ? ' style="background:' + esc(tint) + '"' : '') + '>' +
            (first && first.image ? '<img src="' + esc(first.image) + '" alt="" loading="lazy">' : '') +
          '</span>' +
          '<span class="adm-item__body">' +
            '<span class="adm-item__name">' + (esc(c.name) || '<i>Untitled</i>') + '</span>' +
            '<span class="adm-item__meta">' + items.length +
              (items.length === 1 ? ' product' : ' products') +
              (c.featured ? ' &middot; <b>home</b>' : '') + '</span>' +
          '</span>' +
        '</button>' +
        '<span class="adm-item__move">' +
          '<button type="button" class="adm-mini" data-coll-move="-1" aria-label="Move up"' + (i === 0 ? ' disabled' : '') + '>&#9650;</button>' +
          '<button type="button" class="adm-mini" data-coll-move="1" aria-label="Move down"' + (i === state.collections.length - 1 ? ' disabled' : '') + '>&#9660;</button>' +
        '</span>' +
      '</li>';
    }).join('');

    var empty = el('#adm-colls-empty');
    if (empty) empty.hidden = state.collections.length > 0;
  }

  function fillCollForm() {
    var c = currentColl();
    var editor = el('#adm-coll-editor');
    var blank = el('#adm-coll-blank');
    if (editor) editor.hidden = !c;
    if (blank) blank.hidden = !!c;
    if (!c) return;

    els('[data-coll]').forEach(function (input) {
      var v = c[input.getAttribute('data-coll')];
      if (input.type === 'checkbox') input.checked = !!v;
      else input.value = v == null ? '' : v;
    });

    var note = el('#coll-slug-preview');
    if (note) note.textContent = 'collection.html?c=' + (c.slug || '');

    renderPicker();
    validateColl();
  }

  /** The product chooser: every product, grouped by category, with a tick. */
  function renderPicker() {
    var host = el('#adm-picker');
    var c = currentColl();
    if (!host || !c) return;

    var chosen = {};
    (c.products || []).forEach(function (slug) { chosen[slug] = true; });

    var q = state.pickerFilter.toLowerCase();
    var groups = {};
    var order = [];
    state.items.forEach(function (p) {
      if (q && (p.name || '').toLowerCase().indexOf(q) === -1 &&
               (p.category || '').toLowerCase().indexOf(q) === -1) return;
      var cat = p.category || 'Uncategorised';
      if (!groups[cat]) { groups[cat] = []; order.push(cat); }
      groups[cat].push(p);
    });

    if (!order.length) {
      host.innerHTML = '<p class="adm-hint">Nothing matches that.</p>';
      return;
    }

    host.innerHTML = order.map(function (cat) {
      return '<div class="adm-picker__group">' +
        '<p class="adm-picker__cat">' + esc(cat) + '</p>' +
        groups[cat].map(function (p) {
          return '<label class="adm-pick' + (chosen[p.slug] ? ' is-on' : '') + '">' +
            '<input type="checkbox" data-pick="' + esc(p.slug) + '"' + (chosen[p.slug] ? ' checked' : '') + '>' +
            '<span class="adm-pick__thumb"' +
              (p.swatch ? ' style="background:' + esc(shade(p.swatch, 0.86)) + '"' : '') + '>' +
              (p.image ? '<img src="' + esc(p.image) + '" alt="" loading="lazy">' : '') + '</span>' +
            '<span class="adm-pick__name">' + esc(p.name) + '</span>' +
            '<span class="adm-pick__price">' + money(p.price) + '</span>' +
          '</label>';
        }).join('') +
      '</div>';
    }).join('');

    var count = el('#adm-picked-count');
    if (count) {
      var n = collProducts(c).length;
      count.textContent = n + (n === 1 ? ' chosen' : ' chosen');
    }
  }

  function validateColl() {
    var c = currentColl();
    if (!c) return true;
    var ok = true;

    var nameErr = el('#err-cname');
    if (nameErr) nameErr.textContent = c.name ? '' : 'Give the collection a name.';
    if (!c.name) ok = false;

    var clash = state.collections.some(function (o, i) { return i !== state.collIndex && o.slug === c.slug; });
    var slugErr = el('#err-cslug');
    if (slugErr) {
      slugErr.textContent = !c.slug ? 'Needed \u2014 this is the collection\u2019s web address.'
        : clash ? 'Another collection already uses this address.' : '';
    }
    if (!c.slug || clash) ok = false;

    return ok;
  }

  function selectColl(i) {
    state.collIndex = i;
    state.pickerFilter = '';
    var search = el('#adm-coll-search');
    if (search) search.value = '';
    renderCollections();
    fillCollForm();
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
    renderGallery();
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

  /**
   * The four photo slots.
   *
   * Slot 0 is the product's main image; the others are the thumbnails on the
   * product page. Each is independent, which is the whole point — before
   * this, slots 1-3 were one shared set per category, so every pillowcase
   * showed the same three grey circles.
   */
  function renderGallery() {
    var host = el('#adm-gallery');
    var p = current();
    if (!host || !p) return;

    var shots = p.gallery && p.gallery.length ? p.gallery.slice() : [];
    /* Show what the product would actually render, so an untouched product
       arrives with its existing images in the slots rather than blank. */
    if (!shots.length) shots = deriveProduct(p).gallery.slice();

    var html = '';
    for (var i = 0; i < GALLERY_SLOTS; i++) {
      var src = shots[i] || '';
      var embedded = src.indexOf('data:') === 0;
      html +=
        '<div class="adm-shot' + (src ? '' : ' is-empty') + '" data-slot="' + i + '">' +
          '<span class="adm-shot__frame">' +
            (src ? '<img src="' + esc(src) + '" alt="">'
                 : '<span class="adm-shot__none">Empty</span>') +
            (i === 0 ? '<span class="adm-shot__tag">Main</span>' : '') +
          '</span>' +
          '<input class="adm-shot__path" type="text" data-slot-path="' + i + '" ' +
            'value="' + (embedded ? '' : esc(src)) + '" ' +
            'placeholder="' + (embedded ? 'embedded in products.js' : 'images/products/photo.jpg') + '" ' +
            'aria-label="Path for photo ' + (i + 1) + '"' + (embedded ? ' readonly' : '') + '>' +
          '<span class="adm-shot__actions">' +
            '<button type="button" class="adm-mini" data-slot-pick="' + i + '">Choose&hellip;</button>' +
            (src ? '<button type="button" class="adm-mini adm-mini--danger" data-slot-clear="' + i + '">Clear</button>' : '') +
          '</span>' +
        '</div>';
    }
    host.innerHTML = html;

    /* Keep the product's own copy in step with what is on screen. */
    p.gallery = shots.slice(0, GALLERY_SLOTS).filter(Boolean);
    if (p.gallery.length) p.image = p.gallery[0];

    reportGallery(p);
  }

  /** Says whether each path resolves, and what an embedded photo costs. */
  function reportGallery(p) {
    var note = el('#adm-image-note');
    if (!note) return;

    var shots = (p.gallery || []).filter(Boolean);
    if (!shots.length) {
      note.textContent = 'No photos yet. This product will fall back to a generated placeholder.';
      return;
    }

    var embedded = shots.filter(function (s) { return s.indexOf('data:') === 0; });
    if (embedded.length) {
      var kb = embedded.reduce(function (n, s) { return n + s.length; }, 0) / 1024;
      note.innerHTML = embedded.length + ' photo' + (embedded.length === 1 ? '' : 's') +
        ' carried inside <code>products.js</code> (' + Math.round(kb) + ' KB). Nothing to upload separately.';
      return;
    }

    var paths = shots.filter(function (s) { return s.indexOf('data:') !== 0; });
    var checked = 0;
    var bad = [];
    paths.forEach(function (src) {
      var probe = new Image();
      probe.onload = probe.onerror = function () {
        checked++;
        if (!probe.naturalWidth) bad.push(src);
        if (checked !== paths.length) return;
        note.innerHTML = bad.length
          ? '<b>' + bad.length + ' photo' + (bad.length === 1 ? ' is' : 's are') +
            ' not on the site yet:</b> ' + bad.map(esc).join(', ')
          : 'All ' + paths.length + ' photo' + (paths.length === 1 ? '' : 's') + ' found.';
      };
      probe.src = src;
    });
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

    var seenColl = {};
    state.collections.forEach(function (c, i) {
      var where = c.name || 'Collection ' + (i + 1);
      if (!c.name) found.push(where + ' has no name.');
      if (!c.slug) found.push(where + ' has no web address.');
      else if (seenColl[c.slug]) found.push(where + ' shares a web address with ' + seenColl[c.slug] + '.');
      else seenColl[c.slug] = where;
      if (!collProducts(c).length) found.push(where + ' has no products in it.');
    });
    return found;
  }

  /* ------------------------------------------------------------ export --- */

  /**
   * The catalogue as plain data: what save.php is posted, and what the
   * downloaded file is built from. One source, so the two cannot drift.
   */
  function payload() {
    syncCategories();

    var products = state.items.map(function (p) {
      var d = deriveProduct(p);
      delete d._slugLocked;
      return d;
    });

    var categories = state.categories.map(function (c) {
      return { name: c.name, slug: slugify(c.name), blurb: c.blurb || '' };
    });

    /* A collection pointing only at deleted products would render an empty
       page, so it is dropped rather than published broken. */
    var collections = state.collections
      .filter(function (c) { return c.name && c.slug && collProducts(c).length; })
      .map(function (c) {
        return {
          slug: c.slug,
          name: c.name,
          blurb: c.blurb || '',
          featured: !!c.featured,
          products: collProducts(c).map(function (p) { return p.slug; })
        };
      });

    return { products: products, categories: categories, collections: collections };
  }

  function exportText() {
    var clean = payload().products;

    var embedded = clean.filter(function (p) { return String(p.image).indexOf('data:') === 0; }).length;

    var data = payload();
    var cats = data.categories;
    var colls = data.collections;

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
      'PRODUCTS = ' + JSON.stringify(clean, null, 2) + ';\n' +
      '\n' +
      '/* Category order and descriptions. Membership comes from each product\n' +
      '   above; this only decides how they are shown. */\n' +
      'CATEGORIES = ' + JSON.stringify(cats, null, 2) + ';\n' +
      '\n' +
      '/* Hand-picked sets, served at collection.html?c=<slug>. */\n' +
      'COLLECTIONS = ' + JSON.stringify(colls, null, 2) + ';\n';
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

  /* -------------------------------------------------------------- save --- */

  /** Reflects what the host can do in what the bar offers. */
  function paintServerState() {
    var saveBtn = el('#adm-save');
    var signOut = el('#adm-signout');
    var exportBtn = el('#adm-export');

    var on = Server.available();
    if (saveBtn) saveBtn.hidden = !on;
    if (signOut) signOut.hidden = !(on && Server.signedIn());
    if (exportBtn) {
      exportBtn.classList.toggle('adm-btn--primary', !on);
      exportBtn.title = on
        ? 'Download products.js instead of saving to the site'
        : 'Download products.js and upload it to your js/ folder';
    }

    if (on && !Server.configured()) {
      toast('The panel found api/save.php but no password is set yet. Open api/config.php and follow the note at the top.', true);
    } else if (on && !Server.writable()) {
      toast('api/save.php is there, but the js folder is not writable. Set it to 755 in your file manager.', true);
    }
  }

  function askSignIn(then) {
    var modal = el('#adm-signin');
    if (!modal) return;
    modal.hidden = false;
    pendingAfterSignIn = then || null;
    var pw = el('#adm-password');
    if (pw) { pw.value = ''; pw.focus(); }
    var err = el('#err-signin');
    if (err) err.textContent = '';
  }

  var pendingAfterSignIn = null;

  function closeSignIn() {
    var modal = el('#adm-signin');
    if (modal) modal.hidden = true;
    pendingAfterSignIn = null;
  }

  /** Save, which for once actually means save. */
  function doSave() {
    var issues = problems();
    if (issues.length) {
      toast('Fix these first: ' + issues.slice(0, 3).join(' ') +
        (issues.length > 3 ? ' (+' + (issues.length - 3) + ' more)' : ''), true);
      return;
    }

    if (!Server.signedIn()) {
      askSignIn(doSave);
      return;
    }

    var btn = el('#adm-save');
    if (btn) { btn.disabled = true; btn.classList.add('is-busy'); }

    Server.save(payload(), function (err, data) {
      if (btn) { btn.disabled = false; btn.classList.remove('is-busy'); }

      if (err) {
        toast(err, true);
        /* An expired session is the common case; offer the fix rather than
           making them find the button. */
        if (/sign in/i.test(err)) askSignIn(doSave);
        return;
      }

      state.dirty = false;
      save();
      renderList();
      paintServerState();
      toast('Saved. ' + data.products + ' product' + (data.products === 1 ? '' : 's') +
        ' are live — reload the shop to see them.');
    });
  }

  /* ------------------------------------------------------------ import --- */

  /** Pulls `NAME = [ ... ];` out of an exported file, as JSON. */
  function grab(text, name) {
    var at = text.indexOf(name + ' =');
    if (at === -1) return null;
    var open = text.indexOf('[', at);
    if (open === -1) return null;

    /* Walk the brackets rather than guessing at the last ']' — there are
       three arrays in the file and they must not be confused. */
    var depth = 0;
    var inStr = false;
    var quote = '';
    for (var i = open; i < text.length; i++) {
      var ch = text[i];
      if (inStr) {
        if (ch === '\\') { i++; continue; }
        if (ch === quote) inStr = false;
        continue;
      }
      if (ch === '"' || ch === "'") { inStr = true; quote = ch; continue; }
      if (ch === '[') depth++;
      else if (ch === ']') {
        depth--;
        if (!depth) {
          try { return JSON.parse(text.slice(open, i + 1)); } catch (e) { return null; }
        }
      }
    }
    return null;
  }

  function doImport(file) {
    var reader = new FileReader();
    reader.onload = function () {
      var text = String(reader.result);
      var items = null;

      /* Either a products.js this panel wrote, or a plain JSON array. */
      items = grab(text, 'PRODUCTS');
      if (!items) {
        try { items = JSON.parse(text); } catch (e) { items = null; }
      }

      if (!Array.isArray(items) || !items.length) {
        toast('That file did not contain a product list.', true);
        return;
      }

      state.items = items;
      state.categories = grab(text, 'CATEGORIES') || [];
      state.collections = grab(text, 'COLLECTIONS') || [];
      state.index = -1;
      state.collIndex = -1;
      state.dirty = true;
      syncCategories();
      save();
      renderList();
      fillForm();
      renderCategories();
      renderCollections();
      fillCollForm();
      checkStale();
      toast('Loaded ' + items.length + ' product' + (items.length === 1 ? '' : 's') +
        (state.collections.length ? ' and ' + state.collections.length + ' collection' +
          (state.collections.length === 1 ? '' : 's') : '') + '.');
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

  /* ---------------------------------------------------------- the tabs -- */

  function showTab(name) {
    state.tab = name;
    els('.adm-tab').forEach(function (b) {
      var on = b.getAttribute('data-tab') === name;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', String(on));
    });
    els('.adm-pane').forEach(function (p) {
      p.hidden = p.getAttribute('data-pane') !== name;
    });

    if (name === 'categories') renderCategories();
    if (name === 'collections') { renderCollections(); fillCollForm(); }
  }

  /* --------------------------------------------------- the stale notice -- */

  /**
   * The draft in this browser can fall behind: somebody changes the
   * catalogue elsewhere, uploads it, and this panel still shows what it had.
   * Saying nothing was how a 16-product draft quietly hid a 40-product shop.
   * This offers the choice and takes neither side by itself.
   */
  function checkStale() {
    var host = el('#adm-stale');
    if (!host) return;

    var live = (typeof PRODUCTS !== 'undefined' && Array.isArray(PRODUCTS)) ? PRODUCTS : [];
    if (!live.length || !state.items.length) { host.hidden = true; return; }

    var mine = state.items.map(function (p) { return p.slug; }).sort().join('|');
    var theirs = live.map(function (p) { return p.slug; }).sort().join('|');
    if (mine === theirs) { host.hidden = true; return; }

    host.hidden = false;
    var text = el('#adm-stale-text');
    if (text) {
      text.innerHTML = 'This browser has a draft of <b>' + state.items.length +
        '</b> product' + (state.items.length === 1 ? '' : 's') +
        ', but the shop is currently serving <b>' + live.length +
        '</b>. Your draft has not been exported, so nothing is lost either way.';
    }
  }

  function init() {
    if (!el('#adm-list')) return;

    load();
    renderList();
    fillForm();
    renderCategories();
    renderCollections();
    fillCollForm();
    checkStale();

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
    /* --- photos: four slots, each its own --- */
    var pendingSlot = 0;
    var gallery = el('#adm-gallery');

    /** Writes one slot and keeps `image` pointing at the first photo. */
    function setSlot(i, src) {
      var p = current();
      if (!p) return;
      var shots = (p.gallery && p.gallery.length ? p.gallery.slice() : deriveProduct(p).gallery.slice());
      while (shots.length < GALLERY_SLOTS) shots.push('');
      shots[i] = src || '';
      p.gallery = shots.filter(Boolean).slice(0, GALLERY_SLOTS);
      p.image = p.gallery[0] || '';
      touch();
      renderGallery();
    }

    if (gallery) {
      gallery.addEventListener('click', function (ev) {
        var pick = ev.target.closest('[data-slot-pick]');
        if (pick) {
          pendingSlot = Number(pick.getAttribute('data-slot-pick'));
          el('#adm-file').click();
          return;
        }
        var clear = ev.target.closest('[data-slot-clear]');
        if (clear) setSlot(Number(clear.getAttribute('data-slot-clear')), '');
      });

      gallery.addEventListener('change', function (ev) {
        var path = ev.target.closest('[data-slot-path]');
        if (path) setSlot(Number(path.getAttribute('data-slot-path')), path.value.trim());
      });
    }

    el('#adm-file').addEventListener('change', function (ev) {
      var file = ev.target.files && ev.target.files[0];
      if (!file) return;
      var slot = pendingSlot;
      var embed = el('#adm-embed').checked;

      /* With a server behind the panel the file is uploaded and the slot gets
         a normal path. Without one, it is either embedded or the visitor is
         told where to put it themselves. */
      if (!embed && Server.available()) {
        toast('Uploading ' + file.name + '\u2026');
        Server.upload(file, function (err, url) {
          if (err) { toast(err, true); return; }
          setSlot(slot, url);
          toast('Uploaded.');
        });
      } else {
        readImage(file, embed, function (src) { setSlot(slot, src); });
      }
      ev.target.value = '';
    });

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
      syncCategories();
      save();
      renderList();
      fillForm();
      renderCategories();
      renderCollections();
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

    /* --- tabs --- */
    els('.adm-tab').forEach(function (b) {
      b.addEventListener('click', function () { showTab(b.getAttribute('data-tab')); });
    });

    /* --- the stale notice --- */
    var staleLoad = el('#adm-stale-load');
    if (staleLoad) {
      staleLoad.addEventListener('click', function () {
        resetToLive();
        save();
        renderList();
        fillForm();
        renderCategories();
        renderCollections();
        fillCollForm();
        checkStale();
        toast('Loaded the ' + state.items.length + ' products the shop is serving.');
      });
    }
    var staleKeep = el('#adm-stale-keep');
    if (staleKeep) {
      staleKeep.addEventListener('click', function () { el('#adm-stale').hidden = true; });
    }

    /* --- categories --- */
    var catNew = el('#adm-cat-new');
    if (catNew) {
      catNew.addEventListener('submit', function (ev) {
        ev.preventDefault();
        var input = el('#adm-cat-name');
        var name = input.value.trim();
        if (!name) return;
        if (state.categories.some(function (c) { return c.name === name; })) {
          toast('There is already a category called that.', true);
          return;
        }
        /* A category with nothing in it would be dropped by syncCategories,
           so it is created by putting a new product in it. */
        var p = blankProduct();
        p.category = name;
        p.name = '';
        p.slug = uniqueSlug('new-product', -1);
        state.items.push(p);
        state.categories.push({ name: name, slug: slugify(name), blurb: '', count: 1 });
        state.index = state.items.length - 1;
        state.dirty = true;
        input.value = '';
        save();
        renderCategories();
        renderList();
        fillForm();
        showTab('products');
        toast('Category "' + name + '" created with an empty product in it. Fill that in and it is live.');
        var nameInput = el('#f-name');
        if (nameInput) nameInput.focus();
      });
    }

    var cats = el('#adm-cats');
    if (cats) {
      cats.addEventListener('click', function (ev) {
        var row = ev.target.closest('[data-cat-index]');
        if (!row) return;
        var i = Number(row.getAttribute('data-cat-index'));

        var move = ev.target.closest('[data-cat-move]');
        if (move) {
          var to = i + Number(move.getAttribute('data-cat-move'));
          if (to < 0 || to >= state.categories.length) return;
          var moved = state.categories.splice(i, 1)[0];
          state.categories.splice(to, 0, moved);
          state.dirty = true;
          save();
          renderCategories();
          return;
        }

        if (ev.target.closest('[data-cat-delete]')) {
          var cat = state.categories[i];
          if (cat.count) {
            toast('"' + cat.name + '" still has ' + cat.count + ' product' +
              (cat.count === 1 ? '' : 's') + ' in it. Move or delete those first.', true);
            return;
          }
          state.categories.splice(i, 1);
          state.dirty = true;
          save();
          renderCategories();
        }
      });

      cats.addEventListener('change', function (ev) {
        var row = ev.target.closest('[data-cat-index]');
        if (!row) return;
        var i = Number(row.getAttribute('data-cat-index'));
        var cat = state.categories[i];
        if (!cat) return;

        if (ev.target.hasAttribute('data-cat-name')) {
          var was = cat.name;
          if (!renameCategory(was, ev.target.value)) { renderCategories(); return; }
          toast('Renamed "' + was + '". Every product in it moved too.');
        } else if (ev.target.hasAttribute('data-cat-blurb')) {
          cat.blurb = ev.target.value.trim();
        }
        state.dirty = true;
        save();
        renderCategories();
        renderList();
      });
    }

    /* --- collections --- */
    var collAdd = el('#adm-coll-add');
    if (collAdd) {
      collAdd.addEventListener('click', function () {
        var c = { name: '', slug: uniqueCollSlug('new-collection', -1), blurb: '', featured: false, products: [] };
        state.collections.push(c);
        state.dirty = true;
        save();
        selectColl(state.collections.length - 1);
        var nameInput = el('#fc-name');
        if (nameInput) nameInput.focus();
      });
    }

    var colls = el('#adm-colls');
    if (colls) {
      colls.addEventListener('click', function (ev) {
        var row = ev.target.closest('[data-coll-index]');
        if (!row) return;
        var i = Number(row.getAttribute('data-coll-index'));

        var move = ev.target.closest('[data-coll-move]');
        if (move) {
          var to = i + Number(move.getAttribute('data-coll-move'));
          if (to < 0 || to >= state.collections.length) return;
          var moved = state.collections.splice(i, 1)[0];
          state.collections.splice(to, 0, moved);
          if (state.collIndex === i) state.collIndex = to;
          else if (state.collIndex === to) state.collIndex = i;
          state.dirty = true;
          save();
          renderCollections();
          return;
        }
        selectColl(i);
      });
    }

    var collEditor = el('#adm-coll-editor');
    if (collEditor) {
      collEditor.addEventListener('input', function (ev) {
        var c = currentColl();
        var input = ev.target.closest('[data-coll]');
        if (!c || !input) return;
        var key = input.getAttribute('data-coll');

        if (input.type === 'checkbox') c[key] = input.checked;
        else if (key === 'slug') c.slug = slugify(input.value);
        else c[key] = input.value.trim();

        /* The address follows the name until somebody types their own. */
        if (key === 'name' && !c._slugLocked) {
          c.slug = uniqueCollSlug(slugify(c.name), state.collIndex);
          var slugInput = el('#fc-slug');
          if (slugInput) slugInput.value = c.slug;
        }
        if (key === 'slug') c._slugLocked = true;

        var note = el('#coll-slug-preview');
        if (note) note.textContent = 'collection.html?c=' + (c.slug || '');

        state.dirty = true;
        save();
        renderCollections();
        validateColl();
      });

      collEditor.addEventListener('change', function (ev) {
        var c = currentColl();
        var input = ev.target.closest('[data-coll]');
        if (c && input && input.type === 'checkbox') {
          c[input.getAttribute('data-coll')] = input.checked;
          state.dirty = true;
          save();
          renderCollections();
        }
      });
    }

    var picker = el('#adm-picker');
    if (picker) {
      picker.addEventListener('change', function (ev) {
        var box = ev.target.closest('[data-pick]');
        var c = currentColl();
        if (!box || !c) return;
        var slug = box.getAttribute('data-pick');
        c.products = c.products || [];
        var at = c.products.indexOf(slug);
        if (box.checked && at === -1) c.products.push(slug);
        if (!box.checked && at !== -1) c.products.splice(at, 1);
        state.dirty = true;
        save();
        renderPicker();
        renderCollections();
      });
    }

    var collSearch = el('#adm-coll-search');
    if (collSearch) {
      collSearch.addEventListener('input', function (ev) {
        state.pickerFilter = ev.target.value;
        renderPicker();
      });
    }

    var collDelete = el('#adm-coll-delete');
    if (collDelete) {
      collDelete.addEventListener('click', function () {
        var c = currentColl();
        if (!c) return;
        if (!window.confirm('Delete the collection "' + (c.name || 'untitled') + '"? The products stay in the shop.')) return;
        state.collections.splice(state.collIndex, 1);
        state.collIndex = -1;
        state.dirty = true;
        save();
        renderCollections();
        fillCollForm();
      });
    }

    el('#adm-export').addEventListener('click', doExport);

    var saveBtn = el('#adm-save');
    if (saveBtn) saveBtn.addEventListener('click', doSave);

    var signOutBtn = el('#adm-signout');
    if (signOutBtn) {
      signOutBtn.addEventListener('click', function () {
        Server.signOut(function () { paintServerState(); toast('Signed out.'); });
      });
    }

    var signInForm = el('#adm-signin-form');
    if (signInForm) {
      signInForm.addEventListener('submit', function (ev) {
        ev.preventDefault();
        var pw = el('#adm-password');
        var err = el('#err-signin');
        var go = el('#adm-signin-go');
        if (go) go.disabled = true;

        Server.signIn(pw.value, function (problem) {
          if (go) go.disabled = false;
          if (problem) {
            if (err) err.textContent = problem;
            pw.select();
            return;
          }
          var next = pendingAfterSignIn;
          closeSignIn();
          paintServerState();
          if (next) next();
        });
      });
    }
    els('[data-close-signin]').forEach(function (b) {
      b.addEventListener('click', closeSignIn);
    });
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape') closeSignIn();
    });

    /* Ask the host what it can do, then show the matching buttons. */
    Server.probe(paintServerState);

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
