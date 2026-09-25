/* ==========================================================================
   CHECKOUT.JS — the basket page, the checkout form and the confirmation.

   Loaded after site.js, and only does anything on the pages that contain the
   elements it looks for.

   On payment: this site has no server, so it cannot take card details itself.
   Doing so would put raw card numbers through a page with no PCI scope, which
   is not something to ship. `placeOrder` therefore hands the basket to
   whatever provider BRAND.payment names. Until one is configured it shows the
   order summary and says plainly that nothing was charged.
   ========================================================================== */

var Checkout = (function () {
  'use strict';

  var esc = Site.esc;
  var money = Site.money;
  var icon = Site.icon;

  function el(sel, ctx) { return (ctx || document).querySelector(sel); }
  function els(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function tintOf(p) {
    if (p.tint) return ' style="--tint:' + esc(p.tint) + '"';
    return '';
  }

  /* ------------------------------------------------------------- basket ---- */

  function renderCart() {
    var host = el('#cart-lines');
    if (!host) return;

    var lines = Cart.items();
    var empty = el('#cart-empty');
    var body = el('#cart-body');

    if (!lines.length) {
      if (empty) empty.hidden = false;
      if (body) body.hidden = true;
      return;
    }
    if (empty) empty.hidden = true;
    if (body) body.hidden = false;

    host.innerHTML = lines.map(function (l) {
      var p = l.product;
      return '<li class="cart-line"' + tintOf(p) + '>' +
        '<a class="cart-line__media" href="product.html?p=' + esc(p.slug) + '">' +
          '<img src="' + esc(p.image) + '" alt="" width="240" height="240" loading="lazy" decoding="async">' +
        '</a>' +
        '<div class="cart-line__body">' +
          '<h3 class="cart-line__name"><a href="product.html?p=' + esc(p.slug) + '">' + esc(p.name) + '</a></h3>' +
          '<p class="cart-line__meta">' + (l.option ? esc(l.option) + ' &middot; ' : '') + money(l.price) + ' each</p>' +
          '<div class="cart-line__controls">' +
            '<span class="qty qty--sm">' +
              '<button type="button" class="qty__btn" data-line-step="-1" data-line="' + esc(l.id) + '" aria-label="Decrease quantity">&minus;</button>' +
              '<input class="qty__input" type="number" min="1" max="99" value="' + l.qty + '" data-line-qty="' + esc(l.id) + '" aria-label="Quantity for ' + esc(p.name) + '">' +
              '<button type="button" class="qty__btn" data-line-step="1" data-line="' + esc(l.id) + '" aria-label="Increase quantity">+</button>' +
            '</span>' +
            '<button type="button" class="cart-line__remove" data-line-remove="' + esc(l.id) + '">Remove</button>' +
          '</div>' +
        '</div>' +
        '<span class="cart-line__price">' + money(l.lineTotal) + '</span>' +
      '</li>';
    }).join('');

    renderTotals();
  }

  function renderTotals() {
    var sub = Cart.subtotal();
    var ship = Cart.shipping();

    var subEl = el('#sum-subtotal');
    if (subEl) subEl.textContent = money(sub);

    var shipEl = el('#sum-shipping');
    if (shipEl) shipEl.textContent = ship === 0 ? 'Free' : money(ship);

    var totalEl = el('#sum-total');
    if (totalEl) totalEl.textContent = money(Cart.total());

    var countEl = el('#sum-count');
    if (countEl) {
      var n = Cart.count();
      countEl.textContent = n + (n === 1 ? ' item' : ' items');
    }

    renderShipMeter();
  }

  /** Progress toward the free-delivery threshold. */
  function renderShipMeter() {
    var host = el('#ship-meter');
    if (!host) return;

    var cfg = (BRAND.shipping) || {};
    var threshold = Number(cfg.freeOver);
    if (!threshold || !Cart.count()) { host.hidden = true; return; }

    host.hidden = false;
    var gap = Cart.freeShippingGap();
    var pct = Math.min(100, (Cart.subtotal() / threshold) * 100);

    host.innerHTML =
      '<p class="ship-meter__text">' +
        (gap > 0
          ? 'Spend <b>' + money(gap) + '</b> more for free delivery'
          : '<b>Free delivery</b> unlocked') +
      '</p>' +
      '<span class="ship-meter__track"><span class="ship-meter__fill" style="width:' + pct.toFixed(0) + '%"></span></span>';
  }

  function initCart() {
    if (!el('#cart-lines')) return;
    renderCart();

    document.addEventListener('click', function (ev) {
      var step = ev.target.closest('[data-line-step]');
      if (step) {
        var id = step.getAttribute('data-line');
        var input = el('[data-line-qty="' + CSS.escape(id) + '"]');
        var next = (Number(input && input.value) || 1) + Number(step.getAttribute('data-line-step'));
        Cart.setQty(id, Math.max(0, next));
        renderCart();
        return;
      }
      var rm = ev.target.closest('[data-line-remove]');
      if (rm) {
        Cart.remove(rm.getAttribute('data-line-remove'));
        renderCart();
      }
    });

    document.addEventListener('change', function (ev) {
      var input = ev.target.closest('[data-line-qty]');
      if (!input) return;
      Cart.setQty(input.getAttribute('data-line-qty'), input.value);
      renderCart();
    });
  }

  /* ----------------------------------------------------------- checkout ---- */

  function renderSummaryLines() {
    var host = el('#summary-lines');
    if (!host) return;

    var lines = Cart.items();
    host.innerHTML = lines.map(function (l) {
      var p = l.product;
      return '<li class="summary-line"' + tintOf(p) + '>' +
        '<span class="summary-line__media">' +
          '<img src="' + esc(p.image) + '" alt="" width="120" height="120" loading="lazy" decoding="async">' +
          '<span class="summary-line__qty">' + l.qty + '</span>' +
        '</span>' +
        '<span class="summary-line__body">' +
          '<span class="summary-line__name">' + esc(p.name) + '</span>' +
          (l.option ? '<span class="summary-line__opt">' + esc(l.option) + '</span>' : '') +
        '</span>' +
        '<span class="summary-line__price">' + money(l.lineTotal) + '</span>' +
      '</li>';
    }).join('');

    renderTotals();
  }

  /** Every required field valid, with the message shown under the offender. */
  function validate(form) {
    var ok = true;
    els('[required]', form).forEach(function (input) {
      var field = input.closest('.field');
      var err = field ? el('.field__error', field) : null;
      var value = input.value.trim();

      var valid = value !== '';
      if (valid && input.type === 'email') valid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value);
      if (valid && input.getAttribute('inputmode') === 'tel') valid = value.replace(/\D/g, '').length >= 7;

      if (field) field.classList.toggle('field--error', !valid);
      if (err) {
        err.textContent = valid ? ''
          : input.type === 'email' ? 'Enter a valid email address.'
          : 'This field is required.';
      }
      if (!valid && ok) input.focus();
      if (!valid) ok = false;
    });
    return ok;
  }

  function orderRef() {
    return 'LN-' + Date.now().toString(36).toUpperCase().slice(-6);
  }

  /**
   * Hands the basket to the configured payment provider.
   *
   * BRAND.payment.provider:
   *   'none'   — no provider yet. Shows the confirmation and says clearly that
   *              nothing was charged. This is the default.
   *   'link'   — sends the visitor to BRAND.payment.url, with the order
   *              reference appended. Use for a Stripe Payment Link, a PayPal
   *              button, or a Shopify cart permalink.
   *   'form'   — POSTs the order to BRAND.payment.endpoint, for a serverless
   *              function that creates a real payment session.
   */
  function placeOrder(form) {
    var lines = Cart.items();
    if (!lines.length) return;

    var ref = orderRef();
    var total = Cart.total();
    var pay = (BRAND.payment) || {};

    if (typeof Tracking !== 'undefined' && Tracking.purchase) {
      Tracking.purchase(lines, total, ref);
    }

    if (pay.provider === 'link' && pay.url) {
      Cart.clear();
      window.location.href = pay.url + (pay.url.indexOf('?') === -1 ? '?' : '&') +
        'ref=' + encodeURIComponent(ref);
      return;
    }

    if (pay.provider === 'form' && pay.endpoint) {
      form.action = pay.endpoint;
      form.method = 'POST';
      var hidden = document.createElement('input');
      hidden.type = 'hidden';
      hidden.name = 'order';
      hidden.value = JSON.stringify({ ref: ref, total: total, lines: lines.map(function (l) {
        return { sku: l.product.sku, name: l.product.name, option: l.option, qty: l.qty, price: l.price };
      }) });
      form.appendChild(hidden);
      form.submit();
      return;
    }

    /* No provider configured: confirm the order and be honest about it. */
    showConfirmation(ref, total, pay.provider !== 'none' && pay.provider);
    Cart.clear();
  }

  function showConfirmation(ref, total, misconfigured) {
    var host = el('#checkout-main');
    if (!host) return;

    host.innerHTML =
      '<div class="confirm">' +
        '<span class="confirm__tick">' + icon('check') + '</span>' +
        '<h1>Thank you</h1>' +
        '<p class="text-muted">Your order has been recorded. A confirmation will follow by email.</p>' +
        '<span class="confirm__ref">' + esc(ref) + '</span>' +
        '<div class="pay-note" style="text-align:left">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
          '<path d="M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L14.7 3.9a2 2 0 00-3.4 0z"/><path d="M12 9v4M12 17h.01"/></svg>' +
          '<div><strong>[[PLACEHOLDER]] No payment was taken.</strong>' +
          (misconfigured
            ? 'BRAND.payment names the provider &ldquo;' + esc(misconfigured) + '&rdquo; but its url or endpoint is missing.'
            : 'This site has no payment provider connected yet. Set BRAND.payment in js/brand-config.js — see README.') +
          '</div>' +
        '</div>' +
        '<div class="btn-row" style="justify-content:center;margin-top:2rem">' +
          '<a class="btn btn--primary btn--lg" href="shop.html">Continue shopping</a>' +
        '</div>' +
      '</div>';

    window.scrollTo({ top: 0, behavior: 'smooth' });
    Site.syncCartCount();
  }

  function initCheckout() {
    var form = el('#checkout-form');
    if (!form) return;

    /* An empty basket has no business on this page. */
    if (!Cart.count()) {
      window.location.replace('cart.html');
      return;
    }

    renderSummaryLines();

    if (typeof Tracking !== 'undefined' && Tracking.beginCheckout) {
      Tracking.beginCheckout(Cart.items(), Cart.total());
    }

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (!validate(form)) return;
      placeOrder(form);
    });
  }

  function init() {
    initCart();
    initCheckout();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { renderCart: renderCart, renderSummaryLines: renderSummaryLines, renderTotals: renderTotals };
})();
