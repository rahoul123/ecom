# Turning on Save

Out of the box the admin panel edits your catalogue and hands you a file to
upload. With PHP behind it, **Save** writes straight to the site instead: press
it, reload the shop, done.

This is the setup for that. It takes about five minutes, once.

---

## Before you start

**Your host has to run PHP.** Almost every cPanel host does. Some do not:

| Host | Save works? |
|---|---|
| cPanel / shared hosting / VPS | Yes |
| **Vercel, Netlify, GitHub Pages, Cloudflare Pages** | **No** |

Those last ones only serve files; they never run code. The panel notices, hides
the Save button and gives you **Download file** instead — nothing breaks, you
just upload the file yourself.

> Your site is on Vercel today. Save will not work there. Move the site to your
> cPanel hosting first, or keep using Download.

---

## 1. Upload the site

Upload the whole `everwell` folder to `public_html` as usual. It already
contains an `api/` folder — that is the part that does the saving.

## 2. Pick a password

In a browser, go to:

```
https://yoursite.com/api/hash.php?p=pick-a-long-password-here
```

Use at least 10 characters. It will print a line like:

```
const ADMIN_HASH = '$2y$10$Xq3....';
```

## 3. Put it in config.php

Open `api/config.php` (cPanel → File Manager → Edit). Find:

```php
const ADMIN_HASH = 'SET-ME';
```

Replace that whole line with the one from step 2. Save.

Your password itself is never stored anywhere — only that hash, which cannot be
turned back into the password.

## 4. Delete hash.php

Delete `api/hash.php` from the server. It switches itself off once a password
is set, but delete it anyway.

## 5. Check the permissions

Two things need to be writable by the server:

| Folder | Permission |
|---|---|
| `js/` | 755 |
| `images/products/` | 755 |

In cPanel File Manager: right-click → Change Permissions. If the panel says it
cannot write, this is almost always why.

## 6. Use it

Go to `https://yoursite.com/admin.html`. The bar now has **Save to site**. The
first time you press it, it asks for your password.

Edit a product, press Save, reload the shop. That is the whole loop.

---

## What happens when you save

- `js/products.js` is rewritten, and the version it replaced is kept in
  `api/backups/` — the last 20 saves. That is your undo.
- The panel sends **data**, and PHP builds the JavaScript file itself. Nothing
  the browser sends is written to the site as code.
- The server re-checks everything the panel checks — names, prices, duplicate
  addresses — because a check in the browser is a convenience and a check on
  the server is the actual rule.

## Photos

With Save turned on, **Choose…** on a photo slot uploads the file to
`images/products/` and fills the path in for you.

Uploads are checked by opening the file as an image, not by trusting its name.
A PHP script renamed `photo.jpg` is refused. Nothing that is not a real JPEG,
PNG, GIF or WebP is ever written, and the extension comes from what the file
actually is.

Each product has four photo slots. The first is the one on the product card and
at the top of the product page; the others are the thumbnails. Leave a slot
empty and it is skipped.

---

## If something goes wrong

**"No password has been set"** — step 3 did not take. Check `api/config.php`
really says your hash and not `SET-ME`.

**"The js folder is not writable"** — step 5.

**The Save button is not there at all** — the panel could not reach
`api/session.php`. Either the host does not run PHP, or `api/` did not upload.
Open `https://yoursite.com/api/session.php` directly: you should see a line of
JSON. If you see the PHP source code instead, the host is not running PHP.

**You saved something wrong** — copy the newest file out of `api/backups/` over
`js/products.js`.

**Forgotten password** — put `const ADMIN_HASH = 'SET-ME';` back in
`api/config.php`, re-upload `hash.php`, and do steps 2–4 again.

---

## Keeping it locked

The panel page itself is public: anyone who finds `/admin.html` can open it.
They cannot save without the password, and they cannot see it — it is not in
the page. But if you would rather nobody even sees the screen, cPanel →
**Directory Privacy** on the site root adds a browser login in front of
everything.

Two things worth knowing:

- Sign-in lasts two hours of inactivity, then asks again.
- After 5 wrong passwords it makes you wait 30 seconds before trying more.

## Testing it yourself

If you have PHP locally, the whole API has a test that stands it up and tries
to break into it:

```bash
bash _tools/test-api.sh
```

30 checks: signing in, saving, and every way in that should be shut — no
password, no token, signed out, a PHP file dressed up as a photo, a product
slug trying to escape its folder.
