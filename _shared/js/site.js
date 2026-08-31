/* ==========================================================================
   SITE.JS — shared component renderers and page behaviour
   Identical across all 5 brands. Reads everything from brand-config.js.
   Never put brand-specific values in this file.

   Edit in _shared/js/ and run `node _tools/sync.js` to push to all brands.

   Loaded synchronously in <head> so that render calls placed inline directly
   after their container run during parse — that is what keeps layout shift at
   zero without a build step.
   ========================================================================== */

var Site = (function () {
  'use strict';

  /* ---------------------------------------------------------------- utils */

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function money(value) {
    var cur = (BRAND.currency) || { symbol: '$', code: 'USD', decimals: 2 };
    return cur.symbol + Number(value).toFixed(cur.decimals);
  }

  function qs(name) {
    var m = new RegExp('[?&]' + name + '=([^&#]*)').exec(window.location.search);
    return m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : null;
  }

  function el(sel, ctx) { return (ctx || document).querySelector(sel); }
  function els(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function productBySlug(slug) {
    for (var i = 0; i < PRODUCTS.length; i++) {
      if (PRODUCTS[i].slug === slug) return PRODUCTS[i];
    }
    return null;
  }

  /* ---------------------------------------------------------------- icons */

  var ICONS = {
    check: '<path d="M20 6L9 17l-5-5"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    truck: '<path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
    lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>',
    leaf: '<path d="M11 20A7 7 0 019.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6"/>',
    stethoscope: '<path d="M4.8 2.3A.3.3 0 004.5 2H3a1 1 0 00-1 1v6a6 6 0 0012 0V3a1 1 0 00-1-1h-1.5a.3.3 0 00-.3.3"/><path d="M8 15v1a6 6 0 006 6 6 6 0 006-6v-4"/><circle cx="20" cy="10" r="2"/>',
    box: '<path d="M21 8v13H3V8"/><path d="M1 3h22v5H1z"/><path d="M10 12h4"/>',
    refresh: '<path d="M3 2v6h6"/><path d="M21 12A9 9 0 006 5.3L3 8"/><path d="M21 22v-6h-6"/><path d="M3 12a9 9 0 0015 6.7l3-2.7"/>',
    star: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>',
    cart: '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>',
    menu: '<path d="M3 12h18M3 6h18M3 18h18"/>',
    close: '<path d="M18 6L6 18M6 6l12 12"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 6L2 7"/>',
    phone: '<path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 1.9.7 2.8a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.3-1.2a2 2 0 012.1-.5c.9.3 1.8.6 2.8.7a2 2 0 011.7 2z"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    alert: '<path d="M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L14.7 3.9a2 2 0 00-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
    chat: '<path d="M21 11.5a8.4 8.4 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.4 8.4 0 01-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.4 8.4 0 013.8-.9h.5a8.5 8.5 0 018 8v.5z"/>',
    user: '<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>'
  };

  function icon(name, cls) {
    var path = ICONS[name] || ICONS.check;
    var filled = name === 'star';
    return '<svg viewBox="0 0 24 24" fill="' + (filled ? 'currentColor' : 'none') + '" ' +
      'stroke="' + (filled ? 'none' : 'currentColor') + '" stroke-width="1.8" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"' +
      (cls ? ' class="' + cls + '"' : '') + '>' + path + '</svg>';
  }

  function stars(rating, size) {
    var full = Math.round(Number(rating) || 0);
    var out = '<span class="stars' + (size ? ' stars--' + size : '') + '" role="img" aria-label="' +
      esc(rating) + ' out of 5 stars">';
    for (var i = 1; i <= 5; i++) {
      out += '<span style="opacity:' + (i <= full ? '1' : '0.25') + '">' + icon('star') + '</span>';
    }
    return out + '</span>';
  }

  /* -------------------------------------------------------------- checkout */

  /**
   * THE single integration point with the real Shopify stores.
   * Fires a trackable outbound event, then navigates in the same tab.
   * Redirect is never blocked by a slow pixel — see the timeout fallback.
   */
  function goToCheckout(slug, e) {
    if (e) e.preventDefault();
    var product = productBySlug(slug);
    if (!product) return false;

    var url = product.checkoutUrl;
    if (!url || url.indexOf('example-shopify-store') !== -1) {
      console.warn('[checkout] Placeholder URL still in place for "' + slug + '". ' +
        'Set checkoutUrl in js/brand-config.js to the real Shopify product link.');
    }

    var done = false;
    function go() {
      if (done) return;
      done = true;
      window.location.href = url;
    }

    if (typeof Tracking !== 'undefined' && typeof Tracking.checkoutClick === 'function') {
      Tracking.checkoutClick(product, go);
    }
    /* Never let analytics hold the user hostage. */
    setTimeout(go, 350);
    return false;
  }

  /* --------------------------------------------------------- product card */

  function productCard(p) {
    var onSale = p.compareAt && p.compareAt > p.price;
    return '' +
      '<article class="product-card">' +
        '<a class="product-card__media" href="product.html?p=' + esc(p.slug) + '" aria-label="' + esc(p.name) + '">' +
          /* [[PLACEHOLDER: product photo]] — swap image path in brand-config.js */
          '<img src="' + esc(p.image) + '" alt="' + esc(p.imageAlt || p.name) + '" width="600" height="600" loading="lazy" decoding="async">' +
          (p.badge ? '<span class="product-card__badge">' + esc(p.badge) + '</span>' : '') +
        '</a>' +
        '<div class="product-card__body">' +
          '<span class="product-card__cat">' + esc(p.category) + '</span>' +
          '<h3 class="product-card__title"><a href="product.html?p=' + esc(p.slug) + '">' + esc(p.name) + '</a></h3>' +
          '<p class="product-card__benefit">' + esc(p.shortBenefit) + '</p>' +
          '<div class="rating-line">' + stars(p.rating, 'sm') +
            '<span>' + esc(p.reviewCount) + ' reviews</span></div>' +
          '<div class="product-card__foot">' +
            '<span class="price">' +
              '<span class="price__now">' + money(p.price) + '</span>' +
              (onSale ? '<span class="price__was">' + money(p.compareAt) + '</span>' : '') +
            '</span>' +
            '<button type="button" class="btn btn--primary btn--sm" ' +
              'onclick="return Site.goToCheckout(\'' + esc(p.slug) + '\', event)">Shop now</button>' +
          '</div>' +
        '</div>' +
      '</article>';
  }

  /**
   * Renders a product grid. Call inline immediately after the container
   * element so the markup lands during parse (zero CLS).
   *   Site.renderProducts('#featured', { featured: true, limit: 4 });
   */
  function renderProducts(selector, opts) {
    opts = opts || {};
    var host = el(selector);
    if (!host) return;

    var list = PRODUCTS.slice();
    if (opts.featured) list = list.filter(function (p) { return p.featured; });
    if (opts.category) list = list.filter(function (p) { return p.category === opts.category; });
    if (opts.exclude) list = list.filter(function (p) { return p.slug !== opts.exclude; });
    if (opts.limit) list = list.slice(0, opts.limit);

    host.innerHTML = list.length
      ? list.map(productCard).join('')
      : '<div class="empty-state"><p>No products match those filters.</p></div>';
  }

  /* ------------------------------------------------------------ shop page */

  var shopState = { categories: [], price: 'all', sort: 'featured' };

  function setSort(value) {
    shopState.sort = value;
    renderShop();
  }

  function renderShop() {
    var host = el('#shop-grid');
    if (!host) return;

    var list = PRODUCTS.slice();

    if (shopState.categories.length) {
      list = list.filter(function (p) { return shopState.categories.indexOf(p.category) !== -1; });
    }
    if (shopState.price !== 'all') {
      var parts = shopState.price.split('-');
      var min = Number(parts[0]);
      var max = parts[1] === '' ? Infinity : Number(parts[1]);
      list = list.filter(function (p) { return p.price >= min && p.price <= max; });
    }
    if (shopState.sort === 'price-asc') list.sort(function (a, b) { return a.price - b.price; });
    else if (shopState.sort === 'price-desc') list.sort(function (a, b) { return b.price - a.price; });
    else if (shopState.sort === 'rating') list.sort(function (a, b) { return b.rating - a.rating; });

    host.innerHTML = list.length
      ? list.map(productCard).join('')
      : '<div class="empty-state"><p><strong>Nothing matches those filters.</strong></p>' +
        '<p>Try widening your price range or clearing a category.</p></div>';

    var count = el('#shop-count');
    if (count) {
      count.textContent = list.length + (list.length === 1 ? ' product' : ' products');
    }

    var chips = el('#active-filters');
    if (chips) {
      chips.innerHTML = shopState.categories.map(function (c) {
        return '<span class="filter-chip">' + esc(c) +
          '<button type="button" data-remove-category="' + esc(c) + '" ' +
          'aria-label="Remove ' + esc(c) + ' filter">&times;</button></span>';
      }).join('');
    }
  }

  function removeCategory(cat) {
    shopState.categories = shopState.categories.filter(function (c) { return c !== cat; });
    var box = el('input[name="category"][value="' + cat.replace(/"/g, '\\"') + '"]');
    if (box) box.checked = false;
    renderShop();
  }

  function renderFilters(selector) {
    var host = el(selector);
    if (!host) return;

    var cats = {};
    PRODUCTS.forEach(function (p) { cats[p.category] = (cats[p.category] || 0) + 1; });

    var bands = [
      { label: 'Under ' + money(40), value: '0-39.99' },
      { label: money(40) + ' – ' + money(70), value: '40-70' },
      { label: 'Over ' + money(70), value: '70.01-' }
    ];

    var html = '<div class="filters__group"><h4>Category</h4>';
    Object.keys(cats).forEach(function (cat) {
      html += '<label class="filter-option">' +
        '<input type="checkbox" name="category" value="' + esc(cat) + '">' +
        '<span>' + esc(cat) + '</span>' +
        '<span class="filter-option__count">' + cats[cat] + '</span></label>';
    });
    html += '</div><div class="filters__group"><h4>Price</h4>' +
      '<label class="filter-option"><input type="radio" name="price" value="all" checked>' +
      '<span>Any price</span></label>';
    bands.forEach(function (b) {
      html += '<label class="filter-option">' +
        '<input type="radio" name="price" value="' + b.value + '">' +
        '<span>' + esc(b.label) + '</span></label>';
    });
    html += '</div><div class="filters__group">' +
      '<button type="button" class="btn btn--secondary btn--sm btn--block" id="filters-clear">Clear filters</button></div>';

    host.innerHTML = html;

    /* Arriving from a category tile: pre-tick that box before the first render. */
    var incoming = qs('category');
    if (incoming && cats[incoming]) {
      var box = el('input[name="category"][value="' + incoming.replace(/"/g, '\\"') + '"]', host);
      if (box) {
        box.checked = true;
        shopState.categories = [incoming];
      }
    }

    host.addEventListener('change', function (ev) {
      if (ev.target.name === 'category') {
        shopState.categories = els('input[name="category"]:checked', host).map(function (i) { return i.value; });
      } else if (ev.target.name === 'price') {
        shopState.price = ev.target.value;
      }
      renderShop();
    });

    el('#filters-clear').addEventListener('click', function () {
      els('input[name="category"]', host).forEach(function (i) { i.checked = false; });
      var any = el('input[name="price"][value="all"]', host);
      if (any) any.checked = true;
      shopState.categories = [];
      shopState.price = 'all';
      renderShop();
    });
  }

  /* --------------------------------------------------------- product page */

  var currentProduct = null;

  function renderProduct() {
    var slug = qs('p') || (PRODUCTS[0] && PRODUCTS[0].slug);
    var p = productBySlug(slug);
    currentProduct = p;

    if (!p) {
      var main = el('#pdp');
      if (main) {
        main.innerHTML = '<div class="empty-state"><p><strong>Product not found.</strong></p>' +
          '<p><a class="btn btn--primary mt-2" href="shop.html">Back to shop</a></p></div>';
      }
      return;
    }

    /* Page metadata — injected before paint, so Google sees the real values. */
    document.title = p.name + ' | ' + BRAND.name;
    setMeta('name', 'description', p.metaDescription || p.shortBenefit);
    setMeta('property', 'og:title', p.name + ' | ' + BRAND.name);
    setMeta('property', 'og:description', p.metaDescription || p.shortBenefit);
    setMeta('property', 'og:url', window.location.href);
    injectProductSchema(p);

    var onSale = p.compareAt && p.compareAt > p.price;
    var save = onSale ? Math.round((1 - p.price / p.compareAt) * 100) : 0;

    setHTML('#pdp-breadcrumb-name', esc(p.name));
    setHTML('#pdp-title', esc(p.name));
    setHTML('#pdp-category', esc(p.category));
    setHTML('#pdp-lede', esc(p.shortBenefit));
    setHTML('#pdp-rating', stars(p.rating, 'lg') + '<span>' + esc(p.reviewCount) + ' reviews</span>');

    setHTML('#pdp-price',
      '<span class="price__now">' + money(p.price) + '</span>' +
      (onSale ? '<span class="price__was">' + money(p.compareAt) + '</span>' +
        '<span class="pdp__save">Save ' + save + '%</span>' : '') +
      '<span class="price__note">' + esc(p.priceNote || '') + '</span>');

    /* Gallery — every image is a labelled placeholder until real photos land. */
    var imgs = p.gallery && p.gallery.length ? p.gallery : [p.image];
    setHTML('#pdp-main-image',
      '<img id="pdp-img" src="' + esc(imgs[0]) + '" alt="' + esc(p.imageAlt || p.name) +
      '" width="800" height="800" decoding="async">');
    setHTML('#pdp-thumbs', imgs.map(function (src, i) {
      return '<button type="button" class="pdp__thumb' + (i === 0 ? ' is-active' : '') +
        '" data-src="' + esc(src) + '" aria-label="View image ' + (i + 1) + '">' +
        '<img src="' + esc(src) + '" alt="" width="180" height="180" loading="lazy"></button>';
    }).join(''));

    var thumbHost = el('#pdp-thumbs');
    if (thumbHost) {
      thumbHost.addEventListener('click', function (ev) {
        var btn = ev.target.closest('.pdp__thumb');
        if (!btn) return;
        el('#pdp-img').src = btn.getAttribute('data-src');
        els('.pdp__thumb', thumbHost).forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
      });
    }

    /* Supply options are presentational here — the real variant choice happens
       on the Shopify product page after redirect. */
    if (p.options && p.options.length) {
      setHTML('#pdp-options',
        '<h4>' + esc(p.optionLabel || 'Supply') + '</h4><div class="option-pills">' +
        p.options.map(function (o, i) {
          return '<button type="button" class="option-pill' + (i === 0 ? ' is-active' : '') + '">' +
            esc(o) + '</button>';
        }).join('') + '</div>');
      var opts = el('#pdp-options');
      opts.addEventListener('click', function (ev) {
        if (!ev.target.classList.contains('option-pill')) return;
        els('.option-pill', opts).forEach(function (b) { b.classList.remove('is-active'); });
        ev.target.classList.add('is-active');
      });
    }

    setHTML('#pdp-buy',
      '<button type="button" class="btn btn--primary btn--lg btn--block" ' +
      'onclick="return Site.goToCheckout(\'' + esc(p.slug) + '\', event)">' +
      esc(BRAND.copy && BRAND.copy.buyCta ? BRAND.copy.buyCta : 'Buy now') + '</button>');

    setHTML('#pdp-benefits', p.benefits.map(function (b) {
      return '<li>' + icon('check') + '<span>' + esc(b) + '</span></li>';
    }).join(''));

    setHTML('#pdp-ingredients', p.ingredients.map(function (b) {
      return '<li>' + icon('leaf') + '<span>' + esc(b) + '</span></li>';
    }).join(''));

    setHTML('#pdp-how', esc(p.howItWorks));
    setHTML('#pdp-description', esc(p.description));

    if (typeof Tracking !== 'undefined' && Tracking.viewItem) Tracking.viewItem(p);
  }

  /**
   * Second half of the product page. Called at the very end of product.html
   * because these containers sit after the main block in the document —
   * splitting the render keeps above-the-fold markup landing during parse.
   */
  function renderProductExtras() {
    var p = currentProduct;
    if (!p) return;

    var onSale = p.compareAt && p.compareAt > p.price;
    var cta = esc(BRAND.copy && BRAND.copy.buyCta ? BRAND.copy.buyCta : 'Buy now');

    setHTML('#sticky-buy',
      '<div class="sticky-buy__info">' +
        '<div class="sticky-buy__name">' + esc(p.name) + '</div>' +
        '<div class="sticky-buy__price">' + money(p.price) +
          (onSale ? ' <s>' + money(p.compareAt) + '</s>' : '') + '</div>' +
      '</div>' +
      '<button type="button" class="btn btn--primary" ' +
      'onclick="return Site.goToCheckout(\'' + esc(p.slug) + '\', event)">' + cta + '</button>');

    renderProducts('#pdp-related', { limit: 4, exclude: p.slug });
  }

  function setHTML(sel, html) { var n = el(sel); if (n) n.innerHTML = html; }

  function setMeta(attr, key, value) {
    var node = document.head.querySelector('meta[' + attr + '="' + key + '"]');
    if (!node) {
      node = document.createElement('meta');
      node.setAttribute(attr, key);
      document.head.appendChild(node);
    }
    node.setAttribute('content', value);
  }

  function injectProductSchema(p) {
    var schema = {
      '@context': 'https://schema.org/',
      '@type': 'Product',
      name: p.name,
      description: p.metaDescription || p.shortBenefit,
      sku: p.sku,
      brand: { '@type': 'Brand', name: BRAND.name },
      image: [new URL(p.image, window.location.href).href],
      offers: {
        '@type': 'Offer',
        url: p.checkoutUrl,
        priceCurrency: (BRAND.currency && BRAND.currency.code) || 'USD',
        price: Number(p.price).toFixed(2),
        availability: 'https://schema.org/InStock'
      }
    };

    /* aggregateRating is deliberately omitted while reviews are placeholders.
       Turn it on in brand-config.js ONLY once a real review source exists —
       invented ratings get Merchant Center accounts suspended. */
    if (BRAND.seo && BRAND.seo.emitAggregateRating) {
      schema.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: String(p.rating),
        reviewCount: String(p.reviewCount)
      };
    }

    var tag = document.createElement('script');
    tag.type = 'application/ld+json';
    tag.textContent = JSON.stringify(schema);
    document.head.appendChild(tag);
  }

  /* ------------------------------------------------- testimonials and FAQ */

  function renderTestimonials(selector, limit) {
    var host = el(selector);
    if (!host) return;
    var list = limit ? TESTIMONIALS.slice(0, limit) : TESTIMONIALS;
    host.innerHTML = list.map(function (t) {
      return '<figure class="testimonial is-placeholder">' +
        stars(t.rating) +
        '<blockquote class="testimonial__quote">' + esc(t.quote) + '</blockquote>' +
        '<figcaption class="testimonial__who">' +
          '<span class="testimonial__avatar" aria-hidden="true">' + esc(t.name.charAt(0)) + '</span>' +
          '<span><span class="testimonial__name">' + esc(t.name) + '</span>' +
          '<span class="testimonial__meta">' + esc(t.meta) + '</span></span>' +
        '</figcaption></figure>';
    }).join('');
  }

  function renderFaq(selector, limit) {
    var host = el(selector);
    if (!host) return;
    var list = limit ? FAQS.slice(0, limit) : FAQS;
    host.innerHTML = list.map(function (f, i) {
      var id = 'faq-panel-' + i;
      return '<div class="accordion__item">' +
        '<h3 style="margin:0"><button type="button" class="accordion__trigger" aria-expanded="false" aria-controls="' + id + '">' +
        '<span>' + esc(f.q) + '</span><span class="accordion__icon" aria-hidden="true"></span></button></h3>' +
        '<div class="accordion__panel" id="' + id + '" role="region"><div><p>' + esc(f.a) + '</p></div></div>' +
        '</div>';
    }).join('');
  }

  /**
   * FAQPage structured data, built from the same FAQS array the page renders,
   * so the two can never drift apart. Call once, on the full FAQ page only —
   * Google wants FAQPage markup on a page that is genuinely about the FAQs.
   */
  function emitFaqSchema() {
    if (typeof FAQS === 'undefined' || !FAQS.length) return;
    var schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQS.map(function (f) {
        return {
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a }
        };
      })
    };
    var tag = document.createElement('script');
    tag.type = 'application/ld+json';
    tag.textContent = JSON.stringify(schema);
    document.head.appendChild(tag);
  }

  /**
   * Category tiles, built from whatever categories exist in PRODUCTS.
   * Useful on a multi-category store; harmless on a single-category one.
   * Icons come from BRAND.categoryIcons if present, otherwise a sensible default.
   */
  function categoryList() {
    var counts = {};
    var order = [];
    PRODUCTS.forEach(function (p) {
      if (!counts[p.category]) { counts[p.category] = 0; order.push(p.category); }
      counts[p.category]++;
    });
    return order.map(function (name) { return { name: name, count: counts[name] }; });
  }

  /**
   * Each category has its own page (mens-health.html, skincare.html, ...).
   * BRAND.categoryPages maps category name -> filename. If a category has no
   * page of its own, fall back to the filtered shop view so links never break.
   */
  function categoryHref(name) {
    var pages = BRAND.categoryPages || {};
    return pages[name] || ('shop.html?category=' + encodeURIComponent(name));
  }

  function renderCategories(selector, opts) {
    var host = el(selector);
    if (!host) return;
    opts = opts || {};

    var counts = {};
    var order = [];
    PRODUCTS.forEach(function (p) {
      if (!counts[p.category]) { counts[p.category] = 0; order.push(p.category); }
      counts[p.category]++;
    });

    if (opts.exclude) {
      order = order.filter(function (c) { return c !== opts.exclude; });
    }

    var icons = (BRAND.categoryIcons) || {};
    host.innerHTML = order.map(function (cat) {
      return '<a class="category-tile" href="shop.html?category=' + encodeURIComponent(cat) + '">' +
        '<span class="category-tile__icon">' + icon(icons[cat] || 'leaf') + '</span>' +
        '<span class="category-tile__name">' + esc(cat) + '</span>' +
        '<span class="category-tile__count">' + counts[cat] +
          (counts[cat] === 1 ? ' product' : ' products') + '</span></a>';
    }).join('');
  }

  /**
   * A category's own page: renders just that category's products.
   * Called inline from <category>.html with the category name baked in.
   */
  function renderCategoryPage(catName, sort) {
    var host = el('#category-grid');
    if (!host) return;

    var list = PRODUCTS.filter(function (p) { return p.category === catName; });

    if (sort === 'price-asc') list.sort(function (a, b) { return a.price - b.price; });
    else if (sort === 'price-desc') list.sort(function (a, b) { return b.price - a.price; });
    else if (sort === 'rating') list.sort(function (a, b) { return b.rating - a.rating; });

    host.innerHTML = list.length
      ? list.map(productCard).join('')
      : '<div class="empty-state"><p><strong>Nothing in this category yet.</strong></p>' +
        '<p><a class="btn btn--primary mt-2" href="shop.html">View all products</a></p></div>';

    var count = el('#category-count');
    if (count) count.textContent = list.length + (list.length === 1 ? ' product' : ' products');
  }

  /**
   * Categories mega menu: the category list, and a live preview of the products
   * in whichever category is hovered. Also fills the mobile drawer submenu.
   * Everything is derived from PRODUCTS, so a new category needs no markup change.
   */
  function renderCategoryMenu() {
    var cats = categoryList();
    if (!cats.length) return;
    var icons = (BRAND.categoryIcons) || {};

    var list = el('#mega-cats');
    if (list) {
      list.innerHTML = cats.map(function (c, i) {
        return '<a class="nav-mega__cat' + (i === 0 ? ' is-active' : '') + '" ' +
          'href="' + categoryHref(c.name) + '" data-cat="' + esc(c.name) + '">' +
          '<span class="nav-mega__cat-icon">' + icon(icons[c.name] || 'leaf') + '</span>' +
          '<span class="nav-mega__cat-text">' +
            '<span class="nav-mega__cat-name">' + esc(c.name) + '</span>' +
            '<span class="nav-mega__cat-count">' + c.count + ' products</span>' +
          '</span></a>';
      }).join('');
    }

    var total = el('#mega-total');
    if (total) total.textContent = PRODUCTS.length + ' items';

    megaPreview(cats[0].name);

    var mobile = el('#mobile-categories-menu');
    if (mobile && mobile.firstElementChild) {
      mobile.firstElementChild.innerHTML =
        '<a href="shop.html"><span>All products</span>' +
        '<span class="nav-menu__count">' + PRODUCTS.length + '</span></a>' +
        cats.map(function (c) {
          return '<a href="' + categoryHref(c.name) + '"><span>' + esc(c.name) + '</span>' +
            '<span class="nav-menu__count">' + c.count + '</span></a>';
        }).join('');
    }
  }

  /* Fills the right-hand side of the mega menu with one category's products. */
  function megaPreview(catName) {
    var host = el('#mega-products');
    if (!host) return;

    var items = PRODUCTS.filter(function (p) { return p.category === catName; }).slice(0, 3);

    host.innerHTML = items.map(function (p) {
      var onSale = p.compareAt && p.compareAt > p.price;
      return '<a class="nav-mini" href="product.html?p=' + esc(p.slug) + '">' +
        '<span class="nav-mini__media">' +
          '<img src="' + esc(p.image) + '" alt="" width="200" height="200" loading="lazy" decoding="async">' +
        '</span>' +
        '<span class="nav-mini__name">' + esc(p.name) + '</span>' +
        '<span class="nav-mini__price">' + money(p.price) +
          (onSale ? '<s>' + money(p.compareAt) + '</s>' : '') + '</span></a>';
    }).join('');

    var title = el('#mega-panel-title');
    if (title) title.textContent = catName;

    var link = el('#mega-panel-link');
    if (link) {
      link.href = categoryHref(catName);
      link.innerHTML = 'See all ' + esc(catName) + ' →';
    }
  }

  /* Desktop: hover or keyboard focus opens it; clicking the trigger still
     navigates to the shop. Hovering a category swaps the product preview. */
  function initCategoryMenu() {
    var item = el('#categories-nav-item');

    if (item) {
      var trigger = el('.nav-trigger', item);

      var open = function () {
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      };
      var close = function () {
        item.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
      };

      item.addEventListener('mouseenter', open);
      item.addEventListener('mouseleave', close);
      item.addEventListener('focusin', open);
      item.addEventListener('focusout', function (ev) {
        if (!item.contains(ev.relatedTarget)) close();
      });
      document.addEventListener('keydown', function (ev) {
        if (ev.key === 'Escape' && item.classList.contains('is-open')) {
          close();
          trigger.focus();
        }
      });

      var cats = el('#mega-cats');
      if (cats) {
        var swap = function (ev) {
          var link = ev.target.closest('.nav-mega__cat');
          if (!link) return;
          els('.nav-mega__cat', cats).forEach(function (a) { a.classList.remove('is-active'); });
          link.classList.add('is-active');
          megaPreview(link.getAttribute('data-cat'));
        };
        cats.addEventListener('mouseover', swap);
        cats.addEventListener('focusin', swap);
      }
    }

    /* Mobile drawer submenu */
    var toggle = el('.mobile-nav__sub-toggle');
    var panel = el('#mobile-categories-menu');
    if (toggle && panel) {
      toggle.addEventListener('click', function () {
        var isOpen = panel.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    }
  }

  function renderTrust(selector) {
    var host = el(selector);
    if (!host) return;
    host.innerHTML = (BRAND.trustBadges || []).map(function (b) {
      return '<div class="trust-badge is-placeholder">' +
        '<span class="trust-badge__icon">' + icon(b.icon) + '</span>' +
        '<h4>' + esc(b.title) + '</h4><p>' + esc(b.text) + '</p></div>';
    }).join('');
  }

  function renderSteps(selector) {
    var host = el(selector);
    if (!host) return;
    host.innerHTML = (BRAND.howItWorks || []).map(function (s, i) {
      return '<div class="step"><span class="step__num">' + (i + 1) + '</span>' +
        '<h3>' + esc(s.title) + '</h3><p>' + esc(s.text) + '</p></div>';
    }).join('');
  }

  /* -------------------------------------------------------- brand chrome */

  function applyBrandChrome() {
    els('[data-brand-name]').forEach(function (n) { n.textContent = BRAND.name; });
    els('[data-brand-tagline]').forEach(function (n) { n.textContent = BRAND.tagline; });
    els('[data-brand-logo]').forEach(function (n) {
      n.src = BRAND.logo;
      n.alt = BRAND.name;
    });
    els('[data-brand-email]').forEach(function (n) {
      n.textContent = BRAND.contact.email;
      if (n.tagName === 'A') n.href = 'mailto:' + BRAND.contact.email;
    });
    els('[data-brand-phone]').forEach(function (n) {
      n.textContent = BRAND.contact.phone;
      if (n.tagName === 'A') n.href = 'tel:' + BRAND.contact.phone.replace(/[^0-9+]/g, '');
    });
    els('[data-brand-hours]').forEach(function (n) { n.textContent = BRAND.contact.hours; });
    els('[data-brand-address]').forEach(function (n) { n.textContent = BRAND.contact.address; });
    els('[data-brand-entity]').forEach(function (n) { n.textContent = BRAND.contact.legalEntity; });
    els('[data-brand-disclaimer]').forEach(function (n) { n.textContent = BRAND.disclaimer; });
    els('[data-brand-announcement]').forEach(function (n) { n.textContent = BRAND.announcement; });
    els('[data-year]').forEach(function (n) { n.textContent = new Date().getFullYear(); });

    /* Footer "Shop" column lists the live categories. */
    var footCats = el('#footer-categories');
    if (footCats) {
      footCats.innerHTML = '<li><a href="shop.html">All products</a></li>' +
        categoryList().map(function (c) {
          return '<li><a href="' + categoryHref(c.name) + '">' + esc(c.name) + '</a></li>';
        }).join('');
    }
  }

  /* ------------------------------------------------------------ behaviour */

  function initHeader() {
    var header = el('.site-header');
    if (header) {
      var onScroll = function () {
        header.classList.toggle('is-scrolled', window.scrollY > 4);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    var nav = el('.mobile-nav');
    var open = el('.nav-toggle');
    if (!nav || !open) return;

    var close = function () {
      nav.classList.remove('is-open');
      document.body.style.overflow = '';
      open.setAttribute('aria-expanded', 'false');
    };

    open.addEventListener('click', function () {
      nav.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      open.setAttribute('aria-expanded', 'true');
      var first = el('a, button', nav);
      if (first) first.focus();
    });

    els('.mobile-nav__scrim, .mobile-nav__close', nav).forEach(function (n) {
      n.addEventListener('click', close);
    });
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && nav.classList.contains('is-open')) close();
    });
  }

  function initAccordions() {
    document.addEventListener('click', function (ev) {
      var trigger = ev.target.closest('.accordion__trigger');
      if (!trigger) return;
      var item = trigger.closest('.accordion__item');
      var isOpen = item.classList.toggle('is-open');
      trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  function initStickyBuy() {
    var bar = el('.sticky-buy');
    var anchor = el('#pdp-buy');
    if (!bar || !anchor || !('IntersectionObserver' in window)) return;

    new IntersectionObserver(function (entries) {
      bar.classList.toggle('is-visible', !entries[0].isIntersecting);
    }, { rootMargin: '0px 0px -100px 0px' }).observe(anchor);
  }

  /**
   * Contact form. There is NO backend on shared hosting by default, so this
   * validates and shows a confirmation without sending. README explains the
   * two real options (mailto or a form service endpoint).
   */
  function initForms() {
    var form = el('#contact-form');
    if (!form) return;

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var ok = true;

      els('[required]', form).forEach(function (input) {
        var field = input.closest('.field');
        var err = el('.field__error', field);
        var valid = input.value.trim() !== '' &&
          (input.type !== 'email' || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.value));
        field.classList.toggle('field--error', !valid);
        if (err) err.textContent = valid ? '' : (input.type === 'email' ? 'Enter a valid email address.' : 'This field is required.');
        if (!valid) ok = false;
      });

      if (!ok) return;

      var note = el('#contact-result');
      note.className = 'form-note form-note--ok';
      note.textContent = 'Thanks — your message has been noted. [[PLACEHOLDER: this form does not send yet. See README.md → Contact form.]]';
      note.hidden = false;
      form.reset();
      note.scrollIntoView({ block: 'center' });
    });
  }

  /**
   * Fades sections in as they scroll into view. Marks every section that is
   * not already on screen, so the first viewport paints instantly with no
   * flash. Does nothing when the browser lacks IntersectionObserver or the
   * visitor prefers reduced motion.
   */
  function initReveal() {
    if (!('IntersectionObserver' in window)) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var targets = els('section, .cta-banner').filter(function (n) {
      return n.getBoundingClientRect().top > window.innerHeight * 0.9;
    });
    if (!targets.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

    targets.forEach(function (n) {
      n.setAttribute('data-reveal', '');
      observer.observe(n);
    });
  }

  /* Dev aid: append ?showplaceholders=1 to outline every dummy block. */
  function initPlaceholderMode() {
    if (qs('showplaceholders') === '1') document.body.classList.add('show-placeholders');
  }

  function init() {
    applyBrandChrome();
    renderCategoryMenu();
    initHeader();
    initCategoryMenu();
    initAccordions();
    initStickyBuy();
    initForms();
    initPlaceholderMode();
    initReveal();

    /* Removing an active filter chip on the shop page. */
    document.addEventListener('click', function (ev) {
      var btn = ev.target.closest('[data-remove-category]');
      if (btn) removeCategory(btn.getAttribute('data-remove-category'));
    });

    var current = window.location.pathname.split('/').pop() || 'index.html';
    els('.header-nav a, .mobile-nav__links a').forEach(function (a) {
      if (a.getAttribute('href') === current) a.setAttribute('aria-current', 'page');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {
    money: money,
    icon: icon,
    stars: stars,
    esc: esc,
    goToCheckout: goToCheckout,
    renderProducts: renderProducts,
    renderShop: renderShop,
    renderFilters: renderFilters,
    renderCategories: renderCategories,
    renderCategoryMenu: renderCategoryMenu,
    renderCategoryPage: renderCategoryPage,
    removeCategory: removeCategory,
    renderProduct: renderProduct,
    renderProductExtras: renderProductExtras,
    setSort: setSort,
    renderTestimonials: renderTestimonials,
    renderFaq: renderFaq,
    emitFaqSchema: emitFaqSchema,
    renderTrust: renderTrust,
    renderSteps: renderSteps
  };
})();
