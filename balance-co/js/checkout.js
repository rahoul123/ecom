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

    var btnTotal = el('#btn-total');
    if (btnTotal) btnTotal.textContent = money(Cart.total());

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

  /* ----------------------------------------------------------------- card --
     The card fields are real: formatted as you type, brand-detected, and
     checked with Luhn and a live expiry test. They are also deliberately
     inert — nothing is submitted anywhere and no value is ever stored. See
     the submit handler at the bottom of this file.
     -------------------------------------------------------------------- */

  var CARD_BRANDS = [
    { id: 'amex', label: 'AMEX', test: /^3[47]/, digits: [15], cvc: 4, gaps: [4, 10] },
    { id: 'visa', label: 'VISA', test: /^4/, digits: [13, 16, 19], cvc: 3, gaps: [4, 8, 12] },
    { id: 'mastercard', label: 'MC', test: /^(5[1-5]|2[2-7])/, digits: [16], cvc: 3, gaps: [4, 8, 12] },
    { id: 'discover', label: 'DISC', test: /^(6011|65|64[4-9])/, digits: [16, 19], cvc: 3, gaps: [4, 8, 12] }
  ];

  function digitsOf(value) { return String(value || '').replace(/\D/g, ''); }

  function brandOf(number) {
    var d = digitsOf(number);
    for (var i = 0; i < CARD_BRANDS.length; i++) {
      if (CARD_BRANDS[i].test.test(d)) return CARD_BRANDS[i];
    }
    return null;
  }

  /** Groups digits the way the detected brand does; Amex is 4-6-5. */
  function formatCardNumber(value) {
    var brand = brandOf(value);
    var gaps = brand ? brand.gaps : [4, 8, 12];
    var d = digitsOf(value).slice(0, brand ? Math.max.apply(null, brand.digits) : 19);
    var out = '';
    for (var i = 0; i < d.length; i++) {
      if (gaps.indexOf(i) !== -1) out += ' ';
      out += d[i];
    }
    return out;
  }

  /** The standard checksum every card number satisfies. */
  function luhnValid(number) {
    var d = digitsOf(number);
    if (d.length < 12) return false;
    var sum = 0;
    var alt = false;
    for (var i = d.length - 1; i >= 0; i--) {
      var n = Number(d[i]);
      if (alt) {
        n *= 2;
        if (n > 9) n -= 9;
      }
      sum += n;
      alt = !alt;
    }
    return sum % 10 === 0;
  }

  function cardNumberError(value) {
    var d = digitsOf(value);
    if (!d) return 'Enter the long number on the card.';
    var brand = brandOf(value);
    if (!brand) return 'We do not recognise that card type.';
    if (brand.digits.indexOf(d.length) === -1) {
      var lens = brand.digits.slice();
      var last = lens.pop();
      return 'A ' + brand.label + ' number is ' +
        (lens.length ? lens.join(', ') + ' or ' + last : last) + ' digits.';
    }
    if (!luhnValid(d)) return 'Check the number — a digit looks wrong.';
    return '';
  }

  function formatExpiry(value) {
    var d = digitsOf(value).slice(0, 4);
    /* A lone 2-9 is unambiguous: it can only be a month with a leading zero. */
    if (d.length === 1 && Number(d) > 1) d = '0' + d;
    if (d.length <= 2) return d;
    return d.slice(0, 2) + ' / ' + d.slice(2);
  }

  function expiryError(value) {
    var d = digitsOf(value);
    if (d.length < 4) return 'Enter the expiry as MM / YY.';
    var month = Number(d.slice(0, 2));
    var year = 2000 + Number(d.slice(2, 4));
    if (month < 1 || month > 12) return 'That month does not exist.';
    var now = new Date();
    /* Valid through the last day of the stated month. */
    var expires = new Date(year, month, 1);
    if (expires <= now) return 'That card has expired.';
    if (year > now.getFullYear() + 25) return 'Check the year.';
    return '';
  }

  function cvcError(value, number) {
    var d = digitsOf(value);
    var brand = brandOf(number);
    var want = brand ? brand.cvc : 3;
    if (d.length !== want) {
      return 'The security code is ' + want + ' digits' + (brand && brand.id === 'amex' ? ' on Amex.' : '.');
    }
    return '';
  }

  /** Formats as the visitor types and keeps the brand badges in step. */
  function initCardFields() {
    var number = el('#co-cardnumber');
    var expiry = el('#co-expiry');
    var cvc = el('#co-cvc');
    if (!number) return;

    var badge = el('#card-brand');
    var marks = els('#card-brands .card-brands__mark');

    function paintBrand() {
      var brand = brandOf(number.value);
      if (badge) {
        badge.textContent = brand ? brand.label : '';
        badge.classList.toggle('is-shown', !!brand);
      }
      marks.forEach(function (m) {
        m.classList.toggle('is-active', !!brand && m.getAttribute('data-brand') === brand.id);
      });
      if (cvc) cvc.maxLength = brand && brand.id === 'amex' ? 4 : 3;
    }

    number.addEventListener('input', function () {
      var before = number.selectionStart;
      var hadSpaceBefore = number.value.slice(0, before).endsWith(' ');
      number.value = formatCardNumber(number.value);
      /* Keep the caret roughly where it was after a space is inserted. */
      if (before === number.value.length - 1 && hadSpaceBefore) before = number.value.length;
      paintBrand();
    });

    if (expiry) {
      expiry.addEventListener('input', function () {
        expiry.value = formatExpiry(expiry.value);
      });
    }

    if (cvc) {
      cvc.addEventListener('input', function () {
        cvc.value = digitsOf(cvc.value).slice(0, cvc.maxLength);
      });
    }

    paintBrand();
  }

  /** Card-specific checks, run after the generic required-field pass. */
  function validateCard() {
    var checks = [
      ['#co-cardnumber', function (v) { return cardNumberError(v); }],
      ['#co-expiry', function (v) { return expiryError(v); }],
      ['#co-cvc', function (v) { return cvcError(v, (el('#co-cardnumber') || {}).value); }]
    ];

    var ok = true;
    var first = null;

    checks.forEach(function (pair) {
      var input = el(pair[0]);
      if (!input) return;
      var message = pair[1](input.value);
      var field = input.closest('.field');
      var err = field ? el('.field__error', field) : null;
      if (field) field.classList.toggle('field--error', !!message);
      if (err) err.textContent = message;
      if (message && !first) first = input;
      if (message) ok = false;
    });

    if (first) first.focus();
    return ok;
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
   * What happens when the form validates.
   *
   * By design this does NOT place an order. The card fields above are a
   * working front end with no back end behind them — there is no server on a
   * static site, so nothing is charged, nothing is sent and no card value is
   * stored or logged. The form stops here and says so.
   *
   * When a provider is connected, BRAND.payment takes over:
   *   'link' — hand the basket to BRAND.payment.url (Stripe Payment Link,
   *            PayPal, a Shopify permalink). The card fields should be
   *            removed at that point; the provider collects them.
   *   'form' — POST the order to BRAND.payment.endpoint for a serverless
   *            function that opens a real payment session.
   */
  function submitOrder(form) {
    var lines = Cart.items();
    if (!lines.length) return;

    var pay = (BRAND.payment) || {};
    var total = Cart.total();

    if (pay.provider === 'link' && pay.url) {
      if (typeof Tracking !== 'undefined' && Tracking.purchase) {
        Tracking.purchase(lines, total, orderRef());
      }
      Cart.clear();
      window.location.href = pay.url;
      return;
    }

    if (pay.provider === 'form' && pay.endpoint) {
      if (typeof Tracking !== 'undefined' && Tracking.purchase) {
        Tracking.purchase(lines, total, orderRef());
      }
      form.action = pay.endpoint;
      form.method = 'POST';
      form.submit();
      return;
    }

    /* No provider: stop, and be plain about why. The basket is left intact so
       nothing is lost, and no purchase event fires — nothing was bought. */
    showStop(total);
  }

  function orderRef() {
    return 'LN-' + Date.now().toString(36).toUpperCase().slice(-6);
  }

  function showStop(total) {
    var host = el('#form-stop');
    if (!host) return;

    host.hidden = false;
    host.className = 'form-stop';
    host.setAttribute('role', 'status');
    host.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L14.7 3.9a2 2 0 00-3.4 0z"/>' +
      '<path d="M12 9v4M12 17h.01"/></svg>' +
      '<div><strong>[[PLACEHOLDER]] The form stops here — no order was placed.</strong>' +
      'Your details check out and the basket is still intact, but nothing was ' +
      'submitted or charged. Connect a provider in <code>BRAND.payment</code> ' +
      '(js/brand-config.js) to take real payments.</div>';

    var btn = el('#place-order');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Nothing was submitted';
    }

    host.scrollIntoView({ block: 'center', behavior: 'smooth' });
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
    initCardFields();

    if (typeof Tracking !== 'undefined' && Tracking.beginCheckout) {
      Tracking.beginCheckout(Cart.items(), Cart.total());
    }

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      /* Generic required-field pass first, then the card-specific rules, so
         the visitor is not told about a bad CVC while the email is empty. */
      if (!validate(form)) return;
      if (!validateCard()) return;
      submitOrder(form);
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
