/* ==========================================================================
   TRACKING.JS — the ONE place ad pixels live
   Shared across all 5 brands. IDs come from BRAND.tracking in brand-config.js.

   Nothing loads and nothing fires until you put real IDs in brand-config.js
   AND set BRAND.tracking.enabled = true. Until then this file is inert.

   What it does once enabled:
     - loads the Google tag (GA4 and/or Google Ads) and the Meta Pixel
     - pushes a dataLayer event on every page view
     - fires add_to_cart, begin_checkout and purchase as the basket moves,
       so ads have real funnel events rather than an outbound-click proxy
   ========================================================================== */

var Tracking = (function () {
  'use strict';

  var cfg = (typeof BRAND !== 'undefined' && BRAND.tracking) || {};
  var enabled = cfg.enabled === true;

  window.dataLayer = window.dataLayer || [];

  function gtag() { window.dataLayer.push(arguments); }

  function loadScript(src) {
    var s = document.createElement('script');
    s.async = true;
    s.src = src;
    document.head.appendChild(s);
  }

  /* ------------------------------------------------------------- loaders */

  function initGoogle() {
    var ids = [];
    if (cfg.ga4MeasurementId) ids.push(cfg.ga4MeasurementId);
    if (cfg.googleAdsConversionId) ids.push(cfg.googleAdsConversionId);
    if (!ids.length) return;

    loadScript('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(ids[0]));
    gtag('js', new Date());
    ids.forEach(function (id) { gtag('config', id); });
  }

  function initMeta() {
    if (!cfg.metaPixelId) return;

    /* Standard Meta Pixel bootstrap, unmodified. */
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v;
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    window.fbq('init', cfg.metaPixelId);
    window.fbq('track', 'PageView');
  }

  /* --------------------------------------------------------------- events */

  function pageView() {
    window.dataLayer.push({
      event: 'page_view',
      page_title: document.title,
      page_location: window.location.href
    });
  }

  function viewItem(product) {
    if (!product) return;
    window.dataLayer.push({
      event: 'view_item',
      currency: currency(),
      value: Number(product.price),
      items: [item(product)]
    });
    if (enabled && window.fbq) {
      window.fbq('track', 'ViewContent', {
        content_ids: [product.sku],
        content_name: product.name,
        content_type: 'product',
        value: Number(product.price),
        currency: currency()
      });
    }
  }

  /** Something went into the basket. */
  function addToCart(product, qty) {
    if (!product) return;
    window.dataLayer.push({
      event: 'add_to_cart',
      currency: currency(),
      value: Number(product.price) * (qty || 1),
      items: [item(product, qty)]
    });
    if (enabled && window.fbq) {
      window.fbq('track', 'AddToCart', {
        content_ids: [product.sku],
        content_name: product.name,
        content_type: 'product',
        value: Number(product.price) * (qty || 1),
        currency: currency()
      });
    }
  }

  /** The visitor reached the checkout page with a basket. */
  function beginCheckout(lines, value) {
    window.dataLayer.push({
      event: 'begin_checkout',
      currency: currency(),
      value: Number(value) || 0,
      items: (lines || []).map(function (l) { return item(l.product, l.qty); })
    });
    if (enabled && window.fbq) {
      window.fbq('track', 'InitiateCheckout', {
        value: Number(value) || 0,
        currency: currency(),
        num_items: (lines || []).reduce(function (n, l) { return n + l.qty; }, 0)
      });
    }
  }

  /**
   * The order was placed. On a static site this fires at the point the basket
   * is handed to a payment provider, not on a confirmed payment — so treat it
   * as an intent signal until a provider webhook can confirm the sale.
   */
  function purchase(lines, value, orderId) {
    window.dataLayer.push({
      event: 'purchase',
      transaction_id: orderId,
      currency: currency(),
      value: Number(value) || 0,
      items: (lines || []).map(function (l) { return item(l.product, l.qty); })
    });
    if (!enabled) return;
    if (window.fbq) {
      window.fbq('track', 'Purchase', { value: Number(value) || 0, currency: currency() });
    }
    if (cfg.googleAdsConversionId && cfg.googleAdsConversionLabel) {
      gtag('event', 'conversion', {
        send_to: cfg.googleAdsConversionId + '/' + cfg.googleAdsConversionLabel,
        value: Number(value) || 0,
        currency: currency(),
        transaction_id: orderId
      });
    }
  }

  function currency() {
    return (typeof BRAND !== 'undefined' && BRAND.currency && BRAND.currency.code) || 'USD';
  }

  function item(product, qty) {
    return {
      item_id: product.sku,
      item_name: product.name,
      item_category: product.category,
      price: Number(product.price),
      quantity: qty || 1
    };
  }

  /* ----------------------------------------------------------------- boot */

  if (enabled) {
    initGoogle();
    initMeta();
  } else if (cfg.warnWhenDisabled !== false) {
    console.info('[tracking] Disabled. Add IDs and set tracking.enabled = true in js/brand-config.js.');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', pageView);
  } else {
    pageView();
  }

  return {
    addToCart: addToCart,
    beginCheckout: beginCheckout,
    purchase: purchase,
    viewItem: viewItem,
    pageView: pageView,
    isEnabled: function () { return enabled; }
  };
})();
