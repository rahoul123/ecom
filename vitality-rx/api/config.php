<?php
/* ==========================================================================
   CONFIG — the one file you edit before the admin panel can save.

   SET A PASSWORD BEFORE YOU UPLOAD THIS.

   Do not put your password here as plain text. Put its hash. To get one,
   upload this folder, visit:

       https://yoursite.com/api/hash.php?p=whatever-you-picked

   copy the line it prints into ADMIN_HASH below, re-upload this file, and
   then DELETE hash.php from your server.

   While ADMIN_HASH is still the placeholder, every endpoint refuses to do
   anything. That is deliberate: an admin panel that saves without a password
   is a public "edit my shop" button.
   ========================================================================== */

/* Replace with the hash hash.php gives you. */
const ADMIN_HASH = 'SET-ME';

/* How long a login lasts without activity, in seconds. */
const SESSION_TTL = 7200;

/* The largest photo you can upload, in bytes. Your host may cap this lower
   through upload_max_filesize; that limit wins. */
const MAX_UPLOAD_BYTES = 6 * 1024 * 1024;

/* Only these can be uploaded. The extension is taken from the image's real
   type, not from the name the browser sent. */
const ALLOWED_IMAGE_TYPES = [
    IMAGETYPE_JPEG => 'jpg',
    IMAGETYPE_PNG  => 'png',
    IMAGETYPE_GIF  => 'gif',
    IMAGETYPE_WEBP => 'webp',
];

/* Where things live, relative to this folder. */
const SITE_ROOT   = __DIR__ . '/..';
const CATALOGUE   = SITE_ROOT . '/js/products.js';
const IMAGE_DIR   = SITE_ROOT . '/images/products';
const BACKUP_DIR  = __DIR__ . '/backups';

/* How many previous catalogues to keep. Every save writes one, so this is
   your undo. */
const KEEP_BACKUPS = 20;
