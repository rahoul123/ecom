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

  /* ------------------------------------------------------------------ cart */

  /**
   * Adds a product and sends the visitor to the basket.
   *
   * This replaced a redirect to an external Shopify product page. The basket
   * and checkout now live on this site, so the only hand-off left is the
   * payment step itself — see checkout.html and BRAND.payment.
   */
  function addToCart(slug, option, qty, opts) {
    opts = opts || {};
    if (!Cart.add(slug, option, qty)) {
      console.warn('[cart] no product with slug "' + slug + '"');
      return false;
    }

    if (typeof Tracking !== 'undefined' && Tracking.addToCart) {
      Tracking.addToCart(productBySlug(slug), qty || 1);
    }
    syncCartCount();

    if (opts.stay) return true;
    window.location.href = 'cart.html';
    return true;
  }

  /** Keeps every cart badge on the page in step with the basket. */
  function syncCartCount() {
    var n = Cart.count();
    els('[data-cart-count]').forEach(function (node) {
      node.textContent = n;
      node.hidden = n === 0;
    });
    els('[data-cart-link]').forEach(function (node) {
      node.setAttribute('aria-label', 'Basket, ' + n + (n === 1 ? ' item' : ' items'));
    });
  }

  /* --------------------------------------------------------- product card */

  /**
   * Inline custom properties for one card. A product that names its own silk
   * swatch is drawn in that colour; anything else falls back to the tint its
   * category was assigned.
   */
  function cardTint(p) {
    if (p.swatch) {
      return ' style="--tint:' + esc(p.tint || p.swatch) +
        ';--deep:' + esc(p.deep || 'inherit') +
        ';--swatch:' + esc(p.swatch) + '"';
    }
    var n = (BRAND.categoryIndex && BRAND.categoryIndex[p.category]) || 0;
    return n ? ' style="--tint:var(--cat-' + n + '-tint);--deep:var(--cat-' + n + '-deep)"' : '';
  }


  function productCard(p) {
    var onSale = p.compareAt && p.compareAt > p.price;
    /* Each card carries its category's tint, so a shop grid is colour-coded
       rather than 30 identical white boxes. brand.css defines --cat-N-*. */
    var style = cardTint(p);
    return '' +
      '<article class="product-card"' + style + '>' +
        '<a class="product-card__media" href="product.html?p=' + esc(p.slug) + '" aria-label="' + esc(p.name) + '">' +
          /* [[PLACEHOLDER: product photo]] — swap image path in brand-config.js */
          '<img src="' + esc(p.image) + '" alt="' + esc(p.imageAlt || p.name) + '" width="600" height="600" loading="lazy" decoding="async">' +
          (p.badge ? '<span class="product-card__badge">' + esc(p.badge) + '</span>' : '') +
          (onSale ? '<span class="product-card__save">-' +
            Math.round((1 - p.price / p.compareAt) * 100) + '%</span>' : '') +
        '</a>' +
        '<div class="product-card__body">' +
          (p.colour
            ? '<span class="product-card__colour"><i></i>' + esc(p.colour) + '</span>'
            : '<span class="product-card__cat">' + esc(p.category) + '</span>') +
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
              'data-add="' + esc(p.slug) + '">Add to cart</button>' +
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
      '<div class="qty" role="group" aria-label="Quantity">' +
        '<button type="button" class="qty__btn" data-qty-step="-1" aria-label="Decrease quantity">&minus;</button>' +
        '<input class="qty__input" id="pdp-qty" type="number" min="1" max="99" value="1" aria-label="Quantity">' +
        '<button type="button" class="qty__btn" data-qty-step="1" aria-label="Increase quantity">+</button>' +
      '</div>' +
      '<button type="button" class="btn btn--primary btn--lg btn--block" id="pdp-add">' +
      esc(BRAND.copy && BRAND.copy.buyCta ? BRAND.copy.buyCta : 'Add to cart') + '</button>');

    var qtyBox = el('#pdp-qty');
    els('[data-qty-step]').forEach(function (b) {
      b.addEventListener('click', function () {
        var next = (Number(qtyBox.value) || 1) + Number(b.getAttribute('data-qty-step'));
        qtyBox.value = Math.max(1, Math.min(99, next));
      });
    });

    var addBtn = el('#pdp-add');
    if (addBtn) {
      addBtn.addEventListener('click', function () {
        var active = el('.option-pill.is-active');
        addToCart(p.slug, active ? active.textContent.trim() : null, Number(qtyBox.value) || 1);
      });
    }

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
      '<button type="button" class="btn btn--primary" data-add="' + esc(p.slug) + '">' + cta + '</button>');

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
        url: new URL('product.html?p=' + p.slug, window.location.href).href,
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

  /* Split card: stars, quote and attribution on the left, portrait on the right. */
  function testimonialCard(t, i) {
    return '<figure class="testimonial is-placeholder">' +
      '<div class="testimonial__body">' +
        stars(t.rating) +
        '<blockquote class="testimonial__quote">&ldquo;' + esc(t.quote) + '</blockquote>' +
        '<figcaption class="testimonial__who">' +
          '<span class="testimonial__name">' + esc(t.name) + '</span>' +
          '<span class="testimonial__meta">' + esc(t.role || t.meta) + '</span>' +
        '</figcaption>' +
      '</div>' +
      '<div class="testimonial__photo">' +
        '<img src="' + esc(t.avatar || ('images/avatars/avatar-' + (i + 1) + '.svg')) +
        '" alt="" width="600" height="800" loading="lazy" decoding="async">' +
      '</div>' +
    '</figure>';
  }

  function renderTestimonials(selector, limit) {
    var host = el(selector);
    if (!host) return;
    var list = limit ? TESTIMONIALS.slice(0, limit) : TESTIMONIALS;
    host.innerHTML = list.map(testimonialCard).join('');
  }

  /**
   * The line under the reviews slider: an optional promo strip, then the
   * aggregate score. Numbers come from REVIEWS_SUMMARY and are placeholders
   * until a real review source supplies them.
   */
  function renderReviewsSummary(selector) {
    var host = el(selector);
    if (!host) return;
    var r = (typeof REVIEWS_SUMMARY !== 'undefined' && REVIEWS_SUMMARY) || { rating: 4.8, count: '' };

    var promo = r.promo
      ? '<p class="reviews-promo">' +
          (r.promo.pill ? '<span class="reviews-promo__pill">' + esc(r.promo.pill) + '</span>' : '') +
          '<span>' + esc(r.promo.text) + '</span>' +
          '<a href="' + esc(r.promo.href || 'shop.html') + '">' + esc(r.promo.linkText) + '</a>' +
        '</p>'
      : '';

    host.innerHTML = promo +
      '<p class="reviews-score">' +
        '<span>' + esc(r.rating) + '/5</span>' + stars(r.rating) +
        '<span>Our ' + esc(r.count) + ' Reviews</span>' +
      '</p>';
  }

  /**
   * Scroll-snap slider. Works without JS (it stays a horizontally scrollable
   * track); JS only adds the arrows and dots. One "page" is one visible column.
   */
  function initSlider(root) {
    var wrap = el(root);
    if (!wrap) return;
    var track = el('.slider__track', wrap);
    var prev = el('[data-slider-prev]', wrap);
    var next = el('[data-slider-next]', wrap);
    var dotHost = el('.slider__dots', wrap);
    if (!track) return;

    function step() {
      var first = track.firstElementChild;
      if (!first) return track.clientWidth;
      var gap = parseFloat(getComputedStyle(track).columnGap || '0') || 0;
      return first.getBoundingClientRect().width + gap;
    }

    function pages() {
      return Math.max(1, Math.ceil(track.scrollWidth / Math.max(1, track.clientWidth)));
    }

    function current() {
      return Math.round(track.scrollLeft / Math.max(1, track.clientWidth));
    }

    function sync() {
      var i = current();
      var max = pages() - 1;
      if (prev) prev.disabled = track.scrollLeft <= 4;
      if (next) next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 4;
      if (dotHost) {
        els('.slider__dot', dotHost).forEach(function (d, n) {
          d.classList.toggle('is-active', n === Math.min(i, max));
          d.setAttribute('aria-current', n === Math.min(i, max) ? 'true' : 'false');
        });
      }
    }

    function buildDots() {
      if (!dotHost) return;
      var n = pages();
      if (n < 2) { dotHost.innerHTML = ''; return; }
      dotHost.innerHTML = '';
      for (var i = 0; i < n; i++) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'slider__dot';
        b.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        b.dataset.page = String(i);
        dotHost.appendChild(b);
      }
      dotHost.addEventListener('click', function (ev) {
        var dot = ev.target.closest('.slider__dot');
        if (!dot) return;
        track.scrollTo({ left: Number(dot.dataset.page) * track.clientWidth, behavior: 'smooth' });
      });
    }

    if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: 'smooth' }); });
    if (next) next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: 'smooth' }); });
    track.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', function () { buildDots(); sync(); });

    buildDots();
    sync();

    /* ---- autoplay ----
       Advances one card at a time and wraps at the end. Pauses while the
       pointer is over it, while anything inside has focus, while the visitor
       is dragging it, and whenever the slider is off screen. Skipped entirely
       for visitors who prefer reduced motion. */
    var delay = Number(wrap.getAttribute('data-autoplay')) || 0;
    if (!delay) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var timer = null;
    var paused = false;

    function advance() {
      if (paused) return;
      var atEnd = track.scrollLeft >= track.scrollWidth - track.clientWidth - 4;
      if (atEnd) track.scrollTo({ left: 0, behavior: 'smooth' });
      else track.scrollBy({ left: step(), behavior: 'smooth' });
    }

    function start() { if (!timer) timer = setInterval(advance, delay); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }

    wrap.addEventListener('mouseenter', function () { paused = true; });
    wrap.addEventListener('mouseleave', function () { paused = false; });
    wrap.addEventListener('focusin', function () { paused = true; });
    wrap.addEventListener('focusout', function () {
      if (!wrap.contains(document.activeElement)) paused = false;
    });
    track.addEventListener('pointerdown', function () { paused = true; });
    document.addEventListener('pointerup', function () { paused = false; });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else start();
    });

    /* Only run while the slider is actually on screen. */
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) start(); else stop();
      }, { threshold: 0.2 }).observe(wrap);
    } else {
      start();
    }
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
  /**
   * The categories the shop has, in the order they should appear.
   *
   * Order comes from CATEGORIES when the catalogue defines one — that is what
   * the admin panel writes when someone drags a category up the list.
   * Otherwise it is the order the categories first appear in PRODUCTS, which
   * is how this worked before and still works with no extra configuration.
   *
   * A category with no products in it is dropped: an empty link in the menu
   * is worse than no link.
   */
  function categoryList() {
    var counts = {};
    var seen = [];
    PRODUCTS.forEach(function (p) {
      if (!p.category) return;
      if (!counts[p.category]) { counts[p.category] = 0; seen.push(p.category); }
      counts[p.category]++;
    });

    var defined = (typeof CATEGORIES !== 'undefined' && Array.isArray(CATEGORIES)) ? CATEGORIES : [];
    var order = [];

    defined.forEach(function (c) {
      var name = c && c.name;
      if (name && counts[name] && order.indexOf(name) === -1) order.push(name);
    });
    /* Anything with products but no entry in CATEGORIES still gets shown. */
    seen.forEach(function (name) { if (order.indexOf(name) === -1) order.push(name); });

    return order.map(function (name) {
      var meta = null;
      defined.forEach(function (c) { if (c && c.name === name) meta = c; });
      return {
        name: name,
        count: counts[name],
        blurb: (meta && meta.blurb) || '',
        image: (meta && meta.image) || null
      };
    });
  }

  /* ------------------------------------------------------- collections ----
     A collection is a named set of products chosen by hand, which may cut
     across categories — "Gifts under $50", "The bedroom edit". Categories
     describe what a product is; a collection describes why you would buy it.
     -------------------------------------------------------------------- */

  function collectionList() {
    var list = (typeof COLLECTIONS !== 'undefined' && Array.isArray(COLLECTIONS)) ? COLLECTIONS : [];
    return list.filter(function (c) {
      return c && c.slug && c.name && productsIn(c).length;
    });
  }

  function findCollection(slug) {
    var found = null;
    collectionList().forEach(function (c) { if (c.slug === slug) found = c; });
    return found;
  }

  /** The products of a collection, in the order the collection lists them. */
  function productsIn(collection) {
    var want = (collection && collection.products) || [];
    var out = [];
    want.forEach(function (slug) {
      PRODUCTS.forEach(function (p) { if (p.slug === slug) out.push(p); });
    });
    return out;
  }

  function collectionHref(slug) {
    return 'collection.html?c=' + encodeURIComponent(slug);
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
  /** collection.html — one collection, or a list of them if ?c= is missing. */
  function renderCollectionPage() {
    var host = el('#collection-products');
    if (!host) return;

    var slug = qs('c');
    var one = slug ? findCollection(slug) : null;
    var title = el('#collection-title');
    var blurb = el('#collection-blurb');
    var crumb = el('#collection-crumb');

    if (slug && !one) {
      /* A link to a collection that no longer exists should say so and offer
         the way back, not show an empty grid. */
      if (title) title.textContent = 'Collection not found';
      if (blurb) blurb.textContent = 'That collection has been removed or renamed.';
      host.className = '';
      host.innerHTML = '<div class="empty-state"><p><strong>Collection not found.</strong></p>' +
        '<p><a href="shop.html">Browse the full range</a></p></div>';
      return;
    }

    if (one) {
      document.title = one.name + ' | ' + BRAND.name;
      if (title) title.textContent = one.name;
      if (blurb) { blurb.textContent = one.blurb || ''; blurb.hidden = !one.blurb; }
      if (crumb) crumb.textContent = one.name;
      host.className = 'product-grid';
      host.innerHTML = productsIn(one).map(productCard).join('');
      return;
    }

    /* No ?c= — show every collection as a card. */
    var all = collectionList();
    if (title) title.textContent = 'Collections';
    if (blurb) { blurb.textContent = 'Hand-picked groups from across the range.'; blurb.hidden = false; }
    if (!all.length) {
      host.className = '';
      host.innerHTML = '<div class="empty-state"><p><strong>No collections yet.</strong></p>' +
        '<p><a href="shop.html">Browse the full range</a></p></div>';
      return;
    }
    host.className = 'collection-index';
    host.innerHTML = all.map(function (c) {
      var items = productsIn(c);
      return '<a class="collection-card" href="' + collectionHref(c.slug) + '">' +
        '<span class="collection-card__shots">' +
          items.slice(0, 3).map(function (p) {
            return '<span class="collection-card__shot"' +
              (p.tint ? ' style="--tint:' + esc(p.tint) + '"' : '') + '>' +
              '<img src="' + esc(p.image) + '" alt="" loading="lazy" decoding="async">' +
            '</span>';
          }).join('') +
        '</span>' +
        '<span class="collection-card__name">' + esc(c.name) + '</span>' +
        '<span class="collection-card__count">' + items.length +
          (items.length === 1 ? ' product' : ' products') + '</span>' +
      '</a>';
    }).join('');
  }

  /** The home-page row of collections. Hides itself when there are none. */
  function renderFeaturedCollections(selector) {
    var host = el(selector);
    if (!host) return;

    var all = collectionList().filter(function (c) { return c.featured; });
    var section = host.closest('section');

    if (!all.length) {
      if (section) section.hidden = true;
      return;
    }
    if (section) section.hidden = false;

    host.innerHTML = all.map(function (c) {
      var items = productsIn(c);
      return '<a class="collection-tile" href="' + collectionHref(c.slug) + '">' +
        '<span class="collection-tile__media"' +
          (items[0] && items[0].tint ? ' style="--tint:' + esc(items[0].tint) + '"' : '') + '>' +
          (items[0] ? '<img src="' + esc(items[0].image) + '" alt="" loading="lazy" decoding="async">' : '') +
        '</span>' +
        '<span class="collection-tile__body">' +
          '<span class="collection-tile__name">' + esc(c.name) + '</span>' +
          (c.blurb ? '<span class="collection-tile__blurb">' + esc(c.blurb) + '</span>' : '') +
          '<span class="collection-tile__count">' + items.length + ' products</span>' +
        '</span>' +
      '</a>';
    }).join('');
  }

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

    /* Collections sit beside the categories, and the block disappears when
       there are none rather than leaving an empty heading. */
    var collHost = el('#mega-collections');
    if (collHost) {
      var colls = collectionList();
      var wrap = collHost.closest('[data-collections-block]');
      if (wrap) wrap.hidden = !colls.length;
      collHost.innerHTML = colls.map(function (c) {
        return '<a href="' + collectionHref(c.slug) + '">' + esc(c.name) +
          '<span class="nav-menu__count">' + productsIn(c).length + '</span></a>';
      }).join('');
    }

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

  /**
   * Scrolling ticker under the hero. The items are duplicated once so the
   * -50% keyframe loops seamlessly; screen readers only see the first copy.
   */
  function renderMarquee(selector) {
    var host = el(selector);
    if (!host) return;
    var items = (BRAND.marquee || []).map(function (t) {
      return '<span class="marquee__item">' + icon('check') + esc(t) + '</span>';
    }).join('');
    if (!items) return;
    host.innerHTML = '<div class="marquee__track">' + items +
      '<span aria-hidden="true" style="display:contents">' + items + '</span></div>';
  }

  /**
   * New arrivals — three products at a larger size than the shop grid, with
   * the image doing most of the work. Uses BRAND.newArrivals if set, else the
   * products carrying a "New" badge, else the last three in the catalogue.
   */
  function renderArrivals(selector) {
    var host = el(selector);
    if (!host) return;

    var picks = (BRAND.newArrivals || []).map(productBySlug).filter(Boolean);
    if (picks.length < 3) {
      var flagged = PRODUCTS.filter(function (p) { return p.badge === 'New'; });
      picks = flagged.length >= 3 ? flagged : PRODUCTS.slice(-3);
    }

    host.innerHTML = picks.slice(0, 3).map(function (p) {
      var onSale = p.compareAt && p.compareAt > p.price;

      return '<article class="arrival"' + cardTint(p) + '>' +
        '<a class="arrival__media" href="product.html?p=' + esc(p.slug) + '" aria-label="' + esc(p.name) + '">' +
          '<img src="' + esc(p.image) + '" alt="' + esc(p.imageAlt || p.name) +
          '" width="800" height="720" loading="lazy" decoding="async">' +
          '<span class="arrival__flag">' + esc(p.badge || 'New in') + '</span>' +
        '</a>' +
        '<div class="arrival__body">' +
          (p.colour
            ? '<span class="product-card__colour"><i></i>' + esc(p.colour) + '</span>'
            : '<span class="arrival__cat">' + esc(p.category) + '</span>') +
          '<h3><a href="product.html?p=' + esc(p.slug) + '">' + esc(p.name) + '</a></h3>' +
          '<p>' + esc(p.shortBenefit) + '</p>' +
          '<div class="rating-line">' + stars(p.rating, 'sm') +
            '<span>' + esc(p.reviewCount) + ' reviews</span></div>' +
          '<div class="arrival__foot">' +
            '<span class="price"><span class="price__now">' + money(p.price) + '</span>' +
              (onSale ? '<span class="price__was">' + money(p.compareAt) + '</span>' : '') + '</span>' +
            '<button type="button" class="btn btn--primary btn--sm" data-add="' + esc(p.slug) + '">Add to cart</button>' +
          '</div>' +
        '</div>' +
      '</article>';
    }).join('');
  }

  /**
   * Quality picks — a short editorial list beside one large product visual.
   * The list is the top-rated products; the hero is the first of them.
   */
  function renderPicks(listSelector, heroSelector) {
    var list = el(listSelector);
    if (!list) return;

    var picks = (BRAND.qualityPicks || []).map(productBySlug).filter(Boolean);
    if (picks.length < 3) {
      picks = PRODUCTS.slice().sort(function (a, b) { return b.rating - a.rating; }).slice(0, 3);
    }
    picks = picks.slice(0, 3);

    list.innerHTML = picks.map(function (p, i) {
      return '<a class="pick" href="product.html?p=' + esc(p.slug) + '">' +
        '<span class="pick__num">0' + (i + 1) + '</span>' +
        '<span class="pick__thumb">' +
          '<img src="' + esc(p.image) + '" alt="" width="140" height="140" loading="lazy" decoding="async">' +
        '</span>' +
        '<span class="pick__text">' +
          '<h3>' + esc(p.name) + '</h3>' +
          '<p>' + esc(p.shortBenefit) + '</p>' +
        '</span>' +
        '<span class="pick__price">' + money(p.price) + '</span>' +
      '</a>';
    }).join('');

    var hero = el(heroSelector);
    if (!hero) return;
    var lead = picks[0];
    var n = (BRAND.categoryIndex && BRAND.categoryIndex[lead.category]) || 0;
    if (n) hero.setAttribute('style', '--tint:var(--cat-' + n + '-tint)');

    hero.innerHTML =
      '<img src="' + esc(lead.image) + '" alt="' + esc(lead.imageAlt || lead.name) +
      '" width="800" height="864" loading="lazy" decoding="async">' +
      '<span class="picks__hero-tag">' +
        '<span>' +
          '<strong>' + esc(lead.name) + '</strong>' +
          '<span>' + esc(lead.reviewCount) + ' reviews &middot; ' + esc(lead.rating) + '/5</span>' +
        '</span>' +
        '<button type="button" class="btn btn--primary btn--sm" data-add="' + esc(lead.slug) + '">Add to cart</button>' +
      '</span>';
  }

  /** Three packs along the base of the CTA banner. */
  function renderCtaPacks(selector) {
    var host = el(selector);
    if (!host) return;
    var picks = PRODUCTS.filter(function (p) { return p.featured; }).slice(0, 3);
    if (picks.length < 3) picks = PRODUCTS.slice(0, 3);

    host.innerHTML = picks.map(function (p) {
      return '<a class="cta-banner__pack" href="product.html?p=' + esc(p.slug) + '" aria-label="' + esc(p.name) + '">' +
        '<img src="' + esc(p.image) + '" alt="" width="300" height="300" loading="lazy" decoding="async"></a>';
    }).join('');
  }

  /** Shop-by-goal grid. Each goal links into a category. */
  function renderGoals(selector) {
    var host = el(selector);
    if (!host) return;
    var goals = BRAND.goals || [];
    if (!goals.length) return;

    host.innerHTML = goals.map(function (g) {
      var n = (BRAND.categoryIndex && BRAND.categoryIndex[g.category]) || 0;
      var vars = n ? ' style="--goal-tint:var(--cat-' + n + '-tint);--goal-deep:var(--cat-' + n + '-deep)"' : '';
      return '<a class="goal is-placeholder" href="' + categoryHref(g.category) + '"' + vars + '>' +
        '<span class="goal__icon">' + icon(g.icon || 'leaf') + '</span>' +
        '<h3>' + esc(g.title) + '</h3>' +
        '<p>' + esc(g.text) + '</p>' +
        '<span class="goal__link">Shop ' + esc(g.title) + ' &rarr;</span></a>';
    }).join('');
  }

  /**
   * Best-seller spotlight: one product given the full-width treatment.
   * Uses BRAND.spotlightSlug, else the highest-rated featured product.
   */
  function renderSpotlight(selector) {
    var host = el(selector);
    if (!host) return;

    var p = (BRAND.spotlightSlug && productBySlug(BRAND.spotlightSlug)) ||
      PRODUCTS.filter(function (x) { return x.featured; })
        .sort(function (a, b) { return b.rating - a.rating; })[0] || PRODUCTS[0];
    if (!p) return;

    var onSale = p.compareAt && p.compareAt > p.price;
    var save = onSale ? Math.round((1 - p.price / p.compareAt) * 100) : 0;
    var cta = esc(BRAND.copy && BRAND.copy.buyCta ? BRAND.copy.buyCta : 'Buy now');
    if (p.tint) host.setAttribute('style', '--spot-tint:' + p.tint);
    else {
      var n = (BRAND.categoryIndex && BRAND.categoryIndex[p.category]) || 0;
      if (n) host.setAttribute('style', '--spot-tint:var(--cat-' + n + '-tint)');
    }

    host.innerHTML =
      '<div class="spotlight__media" data-parallax="0.05">' +
        '<img src="' + esc(p.image) + '" alt="' + esc(p.imageAlt || p.name) +
        '" width="800" height="800" loading="lazy" decoding="async">' +
        (onSale ? '<span class="spotlight__flag">Save ' + save + '%</span>' : '') +
      '</div>' +
      '<div class="spotlight__body">' +
        '<span class="eyebrow">Best seller</span>' +
        '<h2>' + esc(p.name) + '</h2>' +
        '<div class="rating-line" style="margin-bottom:1rem">' + stars(p.rating) +
          '<span>' + esc(p.reviewCount) + ' reviews</span></div>' +
        '<p class="spotlight__lede">' + esc(p.shortBenefit) + '</p>' +
        '<ul class="spotlight__specs">' +
          p.benefits.slice(0, 3).map(function (b) {
            return '<li>' + icon('check') + '<span>' + esc(b) + '</span></li>';
          }).join('') +
        '</ul>' +
        '<div class="pdp__price" style="margin-block:0 1.5rem">' +
          '<span class="price__now">' + money(p.price) + '</span>' +
          (onSale ? '<span class="price__was">' + money(p.compareAt) + '</span>' +
            '<span class="pdp__save">Save ' + save + '%</span>' : '') +
        '</div>' +
        '<div class="btn-row">' +
          '<button type="button" class="btn btn--primary btn--lg" data-add="' + esc(p.slug) + '">' + cta + '</button>' +
          '<a class="btn btn--secondary btn--lg" href="product.html?p=' + esc(p.slug) + '">See details</a>' +
        '</div>' +
      '</div>';
  }

  /**
   * Hero stage: three product packs arranged on a tinted disc, plus two
   * floating chips. Uses the real product artwork rather than an abstract
   * image, so the hero matches the rest of the shop.
   */
  function renderHeroStage(selector) {
    var host = el(selector);
    if (!host) return;

    var picks = (BRAND.heroProducts || [])
      .map(productBySlug)
      .filter(Boolean);

    if (picks.length < 3) {
      var featured = PRODUCTS.filter(function (p) { return p.featured; });
      var pool = featured.length >= 3 ? featured : PRODUCTS;
      picks = pool.slice(0, 3);
    }
    if (!picks.length) return;

    var slots = ['main', 'a', 'b'];
    /* Different speeds give the stage depth as the page scrolls. */
    var speeds = [0.05, 0.11, 0.08];
    var packs = picks.slice(0, 3).map(function (p, i) {
      return '<a class="hero__pack hero__pack--' + slots[i] + '" ' +
        'data-parallax="' + speeds[i] + '" ' +
        'href="product.html?p=' + esc(p.slug) + '" aria-label="' + esc(p.name) + '">' +
        '<img src="' + esc(p.image) + '" alt="' + esc(p.imageAlt || p.name) +
        '" width="800" height="800" ' + (i === 0 ? 'fetchpriority="high"' : 'loading="lazy"') +
        ' decoding="async"></a>';
    }).join('');

    var r = (typeof REVIEWS_SUMMARY !== 'undefined' && REVIEWS_SUMMARY) || {};
    var chips =
      '<div class="hero__chip hero__chip--rating">' +
        stars(r.rating || 4.8, 'sm') +
        '<span><strong>' + esc(r.rating || 4.8) + '/5</strong>' +
        '<span>' + esc(r.count || '') + ' reviews</span></span>' +
      '</div>' +
      '<div class="hero__chip hero__chip--ship">' + icon('truck') +
        '<span><strong>Free shipping</strong><span>on orders over $50</span></span>' +
      '</div>';

    host.innerHTML = '<div class="hero__disc" data-parallax="-0.04"></div>' + packs + chips;
  }

  /** The numbers strip under the hero. */
  function renderAwards(selector) {
    var host = el(selector);
    if (!host) return;
    var items = BRAND.awards || [];
    if (!items.length) return;

    host.innerHTML = items.map(function (a, i) {
      return '<div class="is-placeholder">' +
        (i === 0 ? stars(5, 'sm') : '') +
        '<span class="award__value">' + esc(a.value) + '</span>' +
        '<span class="award__label">' + esc(a.label) + '</span></div>';
    }).join('');
  }

  /** Press wordmarks. Replace with real, permissioned logos before launch. */
  function renderPress(selector) {
    var host = el(selector);
    if (!host) return;
    var items = BRAND.press || [];
    if (!items.length) return;
    host.innerHTML = items.map(function (p) {
      return '<span class="press__logo">' + p + '</span>';
    }).join('');
  }

  /**
   * The collection band: every colour the shop sells, as swatch chips that
   * link to the product. Built from the products that carry a swatch.
   */
  /**
   * The collection row: the product itself in every colour it comes in.
   * Was a row of plain coloured circles, which looked like a colour picker
   * rather than a shop — the product was never visible.
   */
  function renderCollection(selector, category) {
    var host = el(selector);
    if (!host) return;

    /* The hero product's colours, not every colour in the shop, so a bundle
       in a near-identical shade does not show up as a duplicate. */
    var only = category || BRAND.swatchCategory ||
      (PRODUCTS[0] && PRODUCTS[0].category);

    var seen = {};
    var list = PRODUCTS.filter(function (p) {
      if (!p.swatch || !p.colour) return false;
      if (only && p.category !== only) return false;
      if (seen[p.colour]) return false;
      seen[p.colour] = true;
      return true;
    });
    if (!list.length) return;

    host.innerHTML = list.map(function (p) {
      var onSale = p.compareAt && p.compareAt > p.price;
      return '<a class="colour-tile" href="product.html?p=' + esc(p.slug) + '" ' +
        'style="--tile-tint:' + esc(p.tint || p.swatch) + ';--swatch:' + esc(p.swatch) + '">' +
        '<span class="colour-tile__media">' +
          '<img src="' + esc(p.image) + '" alt="' + esc(p.imageAlt || p.name) +
          '" width="400" height="400" loading="lazy" decoding="async">' +
          '<span class="colour-tile__chip"></span>' +
        '</span>' +
        '<span class="colour-tile__name">' + esc(p.colour) + '</span>' +
        '<span class="colour-tile__price">' + money(p.price) +
          (onSale ? '<s>' + money(p.compareAt) + '</s>' : '') + '</span>' +
      '</a>';
    }).join('');
  }



  /**
   * The reasons-to-buy list beside a product shot. Reads the same
   * BRAND.trustBadges the old icon grid used, so the data did not move —
   * only the way it is presented, which previously had almost no weight.
   */
  function renderFeatures(listSelector, mediaSelector) {
    var list = el(listSelector);
    if (!list) return;

    list.innerHTML = (BRAND.trustBadges || []).map(function (b) {
      return '<li class="feature-item">' +
        '<span class="feature-item__icon">' + icon(b.icon) + '</span>' +
        '<span><h3>' + esc(b.title) + '</h3><p>' + esc(b.text) + '</p></span>' +
      '</li>';
    }).join('');

    var media = el(mediaSelector);
    if (!media) return;

    /* The hero product supplies both the shot and the tint behind it. */
    var p = (BRAND.spotlightSlug && productBySlug(BRAND.spotlightSlug)) || PRODUCTS[0];
    if (!p) return;
    if (p.tint) media.setAttribute('style', '--feature-tint:' + p.tint);

    /* A few of the colours it comes in, as chips over the corner. */
    var seen = {};
    var chips = PRODUCTS.filter(function (x) {
      if (!x.swatch || !x.colour || x.category !== p.category) return false;
      if (seen[x.colour]) return false;
      seen[x.colour] = true;
      return true;
    });

    media.innerHTML =
      '<img src="' + esc(p.image) + '" alt="' + esc(p.imageAlt || p.name) +
      '" width="800" height="840" loading="lazy" decoding="async">' +
      (chips.length
        ? '<span class="feature-split__chips">' +
            chips.slice(0, 5).map(function (x) {
              return '<i style="background:' + esc(x.swatch) + '"></i>';
            }).join('') +
            '<span>' + chips.length + ' colours</span>' +
          '</span>'
        : '');
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

    /* Footer legal links come from the config, so a removed legal page cannot
       leave a dead link behind in the footer. */
    var legal = BRAND.legalPages || [];
    var legalCol = el('#footer-legal');
    if (legalCol && legal.length) {
      legalCol.innerHTML = legal.map(function (l) {
        return '<li><a href="' + esc(l.href) + '">' + esc(l.title) + '</a></li>';
      }).join('');
    }
    var legalRow = el('#footer-legal-inline');
    if (legalRow) {
      legalRow.innerHTML = legal.map(function (l) {
        return '<li><a href="' + esc(l.href) + '">' + esc(l.title) + '</a></li>';
      }).join('') + '<li><a href="contact.html">Contact</a></li>';
    }

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

  /* ------------------------------------------------------------------ */
  /* Scroll motion. One rAF loop drives parallax and the progress bar; an
     IntersectionObserver drives reveals. Everything below no-ops when the
     visitor prefers reduced motion.                                        */
  /* ------------------------------------------------------------------ */

  function prefersReducedMotion() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  /**
   * Fades sections in as they scroll into view, and staggers the children of
   * any [data-stagger] container. Only marks what is currently below the fold,
   * so the first screen paints instantly with no flash.
   */
  function initReveal() {
    if (!('IntersectionObserver' in window) || prefersReducedMotion()) return;

    var vh = window.innerHeight;
    var targets = els('section, .cta-banner').filter(function (n) {
      return n.getBoundingClientRect().top > vh * 0.9;
    });

    /* Grids whose cards should arrive one after another. */
    var staggers = els('.product-grid, .category-grid, .goals, .steps, .trust-grid, .bento')
      .filter(function (n) { return n.getBoundingClientRect().top > vh * 0.9; });

    staggers.forEach(function (grid) {
      grid.setAttribute('data-stagger', '');
      els(':scope > *', grid).forEach(function (child, i) {
        child.style.setProperty('--i', i);
      });
    });

    var all = targets.concat(staggers);
    if (!all.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

    targets.forEach(function (n) { n.setAttribute('data-reveal', ''); });
    all.forEach(function (n) { observer.observe(n); });
  }

  /**
   * Parallax and the top progress bar, both driven from one scroll handler.
   * Elements opt in with data-parallax="<speed>"; positive drifts against the
   * scroll, negative with it. Skipped on narrow screens, where the effect is
   * mostly wasted work.
   */
  function initScrollMotion() {
    if (prefersReducedMotion()) return;

    var bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);

    var wide = window.innerWidth >= 768;
    var items = wide ? els('[data-parallax]').map(function (n) {
      return { el: n, speed: parseFloat(n.getAttribute('data-parallax')) || 0.08 };
    }) : [];

    var ticking = false;

    function update() {
      ticking = false;
      var vh = window.innerHeight;

      var doc = document.documentElement;
      var max = doc.scrollHeight - vh;
      bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, doc.scrollTop / max) : 0) + ')';

      for (var i = 0; i < items.length; i++) {
        var r = items[i].el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) continue;
        var fromCentre = r.top + r.height / 2 - vh / 2;
        items[i].el.style.setProperty('--py', (-fromCentre * items[i].speed).toFixed(1) + 'px');
      }
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  }

  /**
   * Counts numbers up when they scroll into view. Keeps whatever prefix and
   * suffix the label already has, so "10k+" and "4.8" both work.
   */
  function initCounters() {
    if (!('IntersectionObserver' in window) || prefersReducedMotion()) return;

    var nodes = els('[data-count], .stat__num, .bento__stat').filter(function (n) {
      return /\d/.test(n.textContent);
    });
    if (!nodes.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        countUp(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.6 });

    nodes.forEach(function (n) { observer.observe(n); });
  }

  function countUp(node) {
    var raw = node.textContent.trim();
    var match = raw.match(/^([^0-9]*)([0-9]+(?:[.,][0-9]+)?)(.*)$/);
    if (!match) return;

    var prefix = match[1];
    var target = parseFloat(match[2].replace(',', ''));
    var suffix = match[3];
    var decimals = (match[2].split('.')[1] || '').length;
    var start = null;
    var duration = 1100;

    function frame(now) {
      if (start === null) start = now;
      var t = Math.min(1, (now - start) / duration);
      var eased = 1 - Math.pow(1 - t, 3);
      node.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
      if (t < 1) window.requestAnimationFrame(frame);
      else node.textContent = raw;
    }
    window.requestAnimationFrame(frame);
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
    initScrollMotion();
    initCounters();

    /* Anything carrying data-add puts that product in the basket. A delegated
       listener keeps quoting out of the generated markup. */
    document.addEventListener('click', function (ev) {
      var add = ev.target.closest('[data-add]');
      if (!add) return;
      ev.preventDefault();
      addToCart(add.getAttribute('data-add'), add.getAttribute('data-option'),
        Number(add.getAttribute('data-qty')) || 1);
    });

    syncCartCount();
    Cart.onChange(syncCartCount);

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
    addToCart: addToCart,
    syncCartCount: syncCartCount,
    /* Exported so admin.html can preview a card with the very markup the
       shop renders, rather than an approximation of it. */
    productCard: productCard,
    renderProducts: renderProducts,
    renderShop: renderShop,
    renderFilters: renderFilters,
    renderCategories: renderCategories,
    renderCategoryMenu: renderCategoryMenu,
    renderCategoryPage: renderCategoryPage,
    categoryList: categoryList,
    collectionList: collectionList,
    productsIn: productsIn,
    collectionHref: collectionHref,
    renderCollectionPage: renderCollectionPage,
    renderFeaturedCollections: renderFeaturedCollections,
    removeCategory: removeCategory,
    renderProduct: renderProduct,
    renderProductExtras: renderProductExtras,
    setSort: setSort,
    renderTestimonials: renderTestimonials,
    renderReviewsSummary: renderReviewsSummary,
    initSlider: initSlider,
    renderFaq: renderFaq,
    emitFaqSchema: emitFaqSchema,
    renderTrust: renderTrust,
    renderFeatures: renderFeatures,
    renderAwards: renderAwards,
    renderPress: renderPress,
    renderCollection: renderCollection,
    renderHeroStage: renderHeroStage,
    renderGoals: renderGoals,
    renderSpotlight: renderSpotlight,
    renderMarquee: renderMarquee,
    renderArrivals: renderArrivals,
    renderPicks: renderPicks,
    renderCtaPacks: renderCtaPacks,
    renderSteps: renderSteps
  };
})();
