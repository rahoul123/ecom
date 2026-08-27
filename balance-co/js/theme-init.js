/* ==========================================================================
   THEME-INIT.JS — shared, do not edit per brand
   Loaded SYNCHRONOUSLY in <head>, before any paint, so brand colours from
   brand-config.js are applied with no flash and no layout shift.

   css/brand.css holds the same values as static fallbacks (for crawlers and
   JS-disabled browsers). BRAND.colors in brand-config.js wins at runtime.
   ========================================================================== */

(function () {
  'use strict';

  if (typeof BRAND === 'undefined') {
    console.error('[theme-init] brand-config.js must load before theme-init.js');
    return;
  }

  var root = document.documentElement;
  var c = BRAND.colors || {};

  var tokens = {
    '--color-bg': c.background,
    '--color-surface': c.surface,
    '--color-soft': c.soft,
    '--color-text': c.text,
    '--color-heading': c.heading || c.text,
    '--color-muted': c.muted,
    '--color-border': c.border,
    '--color-border-strong': c.borderStrong,
    '--color-accent': c.accent,
    '--color-accent-hover': c.accentHover,
    '--color-accent-tint': c.accentTint,
    '--color-on-accent': c.onAccent,
    '--color-footer-bg': c.footerBg,
    '--color-footer-text': c.footerText,
    '--color-star': c.star
  };

  for (var key in tokens) {
    if (tokens[key]) root.style.setProperty(key, tokens[key]);
  }

  var style = BRAND.style || {};
  if (style.radius) {
    root.style.setProperty('--radius', style.radius);
    root.style.setProperty('--radius-lg', style.radiusLarge || style.radius);
  }
  if (style.buttonRadius) root.style.setProperty('--radius-btn', style.buttonRadius);
  if (style.logoWidth) root.style.setProperty('--logo-width', style.logoWidth);

  /* Card style is a class because it switches which properties apply, not a value. */
  root.className += ' card-style-' + (style.cardStyle || 'bordered');
})();
