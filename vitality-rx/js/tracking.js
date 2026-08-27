/* ==========================================================================
   TRACKING.JS — the ONE place ad pixels live
   Shared across all 5 brands. IDs come from BRAND.tracking in brand-config.js.

   Nothing loads and nothing fires until you put real IDs in brand-config.js
   AND set BRAND.tracking.enabled = true. Until then this file is inert.

   What it does once enabled:
     - loads the Google tag (GA4 and/or Google Ads) and the Meta Pixel
     - pushes a dataLayer event on every page view
     - fires an outbound-click conversion right before the Shopify redirect,
       which is your proxy conversion for ads (see Site.goToCheckout)
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

  /**
   * Outbound click to the real Shopify store.
   * This is the proxy conversion — the actual purchase happens on a domain
   * this site cannot see, so this click is the last event we control.
   *
   * `done` is called as soon as the pixels have been handed the event; the
   * caller also runs its own timeout so a blocked pixel never eats the click.
   */
  function checkoutClick(product, done) {
    var payload = {
      event: 'begin_checkout_outbound',
      currency: currency(),
      value: Number(product.price),
      destination: product.checkoutUrl,
      items: [item(product)]
    };
    window.dataLayer.push(payload);

    if (!enabled) {
      if (typeof done === 'function') done();
      return;
    }

    if (window.fbq) {
      window.fbq('track', 'InitiateCheckout', {
        content_ids: [product.sku],
        content_name: product.name,
        content_type: 'product',
        value: Number(product.price),
        currency: currency()
      });
    }

    if (cfg.googleAdsConversionId && cfg.googleAdsConversionLabel) {
      gtag('event', 'conversion', {
        send_to: cfg.googleAdsConversionId + '/' + cfg.googleAdsConversionLabel,
        value: Number(product.price),
        currency: currency(),
        /* Lets the tag finish before we navigate away. */
        event_callback: done
      });
      return;
    }

    if (typeof done === 'function') done();
  }

  function currency() {
    return (typeof BRAND !== 'undefined' && BRAND.currency && BRAND.currency.code) || 'USD';
  }

  function item(product) {
    return {
      item_id: product.sku,
      item_name: product.name,
      item_category: product.category,
      price: Number(product.price),
      quantity: 1
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
    checkoutClick: checkoutClick,
    viewItem: viewItem,
    pageView: pageView,
    isEnabled: function () { return enabled; }
  };
})();
