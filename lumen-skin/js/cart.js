/* ==========================================================================
   CART.JS — the basket, kept in localStorage.

   Loaded before site.js. Holds line items, totals and the little pub/sub that
   keeps the header badge in step. No backend: everything here lives in the
   visitor's own browser, which is all a static site can honestly do.

   A line is identified by slug + option, so a Queen and a King of the same
   pillowcase are two lines rather than one with a confused quantity.
   ========================================================================== */

var Cart = (function () {
  'use strict';

  var KEY = 'cart.v1';
  var listeners = [];

  function read() {
    try {
      var raw = localStorage.getItem(KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      /* Private mode, cleared storage, or someone edited it by hand. */
      return [];
    }
  }

  function write(items) {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch (e) {
      /* Quota or private mode — the basket still works for this page view. */
    }
    listeners.forEach(function (fn) {
      try { fn(items); } catch (e) { /* one bad listener must not stop the rest */ }
    });
    return items;
  }

  function lineId(slug, option) {
    return slug + '::' + (option || '');
  }

  /** The product record behind a line, or null if it has since been removed. */
  function product(slug) {
    if (typeof PRODUCTS === 'undefined') return null;
    for (var i = 0; i < PRODUCTS.length; i++) {
      if (PRODUCTS[i].slug === slug) return PRODUCTS[i];
    }
    return null;
  }

  /**
   * Lines joined to their product, with anything that no longer exists in the
   * catalogue dropped. Prices always come from PRODUCTS, never from storage —
   * a basket left open for a week must not check out at last week's price.
   */
  function items() {
    var out = [];
    read().forEach(function (line) {
      var p = product(line.slug);
      if (!p) return;
      out.push({
        id: lineId(line.slug, line.option),
        slug: line.slug,
        option: line.option || (p.options && p.options[0]) || '',
        qty: Math.max(1, Math.min(99, Number(line.qty) || 1)),
        product: p,
        price: p.price,
        lineTotal: p.price * Math.max(1, Number(line.qty) || 1)
      });
    });
    return out;
  }

  function add(slug, option, qty) {
    var p = product(slug);
    if (!p) return false;

    var want = Math.max(1, Math.min(99, Number(qty) || 1));
    var opt = option || (p.options && p.options[0]) || '';
    var lines = read();
    var id = lineId(slug, opt);
    var found = false;

    lines = lines.map(function (line) {
      if (lineId(line.slug, line.option) !== id) return line;
      found = true;
      return { slug: line.slug, option: line.option, qty: Math.min(99, (Number(line.qty) || 1) + want) };
    });

    if (!found) lines.push({ slug: slug, option: opt, qty: want });
    write(lines);
    return true;
  }

  function setQty(id, qty) {
    var n = Math.max(0, Math.min(99, Number(qty) || 0));
    var lines = read().filter(function (line) {
      return n > 0 || lineId(line.slug, line.option) !== id;
    }).map(function (line) {
      if (lineId(line.slug, line.option) !== id) return line;
      return { slug: line.slug, option: line.option, qty: n };
    });
    write(lines);
  }

  function remove(id) {
    write(read().filter(function (line) {
      return lineId(line.slug, line.option) !== id;
    }));
  }

  function clear() { write([]); }

  function count() {
    return items().reduce(function (n, l) { return n + l.qty; }, 0);
  }

  function subtotal() {
    return items().reduce(function (n, l) { return n + l.lineTotal; }, 0);
  }

  /** Shipping is free over the threshold in BRAND.shipping, else a flat rate. */
  function shipping() {
    var cfg = (typeof BRAND !== 'undefined' && BRAND.shipping) || {};
    var sub = subtotal();
    if (!sub) return 0;
    var threshold = Number(cfg.freeOver);
    if (threshold && sub >= threshold) return 0;
    return Number(cfg.flatRate) || 0;
  }

  function total() { return subtotal() + shipping(); }

  /** How much more is needed to reach free shipping, or 0 if already there. */
  function freeShippingGap() {
    var cfg = (typeof BRAND !== 'undefined' && BRAND.shipping) || {};
    var threshold = Number(cfg.freeOver);
    if (!threshold) return 0;
    return Math.max(0, threshold - subtotal());
  }

  /** Called whenever the basket changes. Returns an unsubscribe function. */
  function onChange(fn) {
    listeners.push(fn);
    return function () {
      listeners = listeners.filter(function (f) { return f !== fn; });
    };
  }

  /* A basket changed in another tab should show up in this one. */
  if (typeof window !== 'undefined' && window.addEventListener) {
    window.addEventListener('storage', function (e) {
      if (e.key === KEY) {
        listeners.forEach(function (fn) {
          try { fn(read()); } catch (err) { /* ignore */ }
        });
      }
    });
  }

  return {
    items: items,
    add: add,
    setQty: setQty,
    remove: remove,
    clear: clear,
    count: count,
    subtotal: subtotal,
    shipping: shipping,
    total: total,
    freeShippingGap: freeShippingGap,
    onChange: onChange
  };
})();
