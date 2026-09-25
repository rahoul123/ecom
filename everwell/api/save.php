<?php
/* ==========================================================================
   SAVE — writes js/products.js.

   POST api/save.php  { products: [...], categories: [...], collections: [...] }

   The panel sends data, never code: this file builds the JavaScript itself
   from JSON it has validated. Nothing the browser sends is written to disk
   verbatim, so a malformed or hostile payload cannot become script on the
   site. The previous catalogue is kept in api/backups first.
   ========================================================================== */

require_once __DIR__ . '/auth.php';

require_write_access();

$raw = file_get_contents('php://input');
if ($raw === false || $raw === '') {
    fail('Nothing was sent.');
}

$body = json_decode($raw, true);
if (!is_array($body)) {
    fail('That was not valid JSON.');
}

$products    = $body['products']    ?? null;
$categories  = $body['categories']  ?? [];
$collections = $body['collections'] ?? [];

if (!is_array($products) || !$products) {
    fail('No products were sent. Refusing to empty the shop.');
}
if (!is_array($categories) || !is_array($collections)) {
    fail('Categories and collections must be lists.');
}

/* --- checks the panel also makes, repeated here because a browser check is
       a convenience and a server check is the actual rule --- */
$seen = [];
foreach ($products as $i => $p) {
    if (!is_array($p)) {
        fail('Product ' . ($i + 1) . ' is not an object.');
    }
    $slug = (string) ($p['slug'] ?? '');
    $name = (string) ($p['name'] ?? '');
    if ($slug === '' || !preg_match('/^[a-z0-9][a-z0-9-]*$/', $slug)) {
        fail('Product "' . ($name ?: $i + 1) . '" has a bad web address.');
    }
    if (isset($seen[$slug])) {
        fail('Two products share the web address "' . $slug . '".');
    }
    $seen[$slug] = true;
    if ($name === '') {
        fail('Product "' . $slug . '" has no name.');
    }
    if (!isset($p['price']) || !is_numeric($p['price']) || $p['price'] < 0) {
        fail('Product "' . $slug . '" has no price.');
    }
}

/* --- keep the version we are about to replace --- */
if (is_file(CATALOGUE)) {
    if (!is_dir(BACKUP_DIR)) {
        @mkdir(BACKUP_DIR, 0755, true);
    }
    if (is_dir(BACKUP_DIR)) {
        @copy(CATALOGUE, BACKUP_DIR . '/products-' . date('Ymd-His') . '.js');

        /* Trim to the newest KEEP_BACKUPS. */
        $old = glob(BACKUP_DIR . '/products-*.js') ?: [];
        if (count($old) > KEEP_BACKUPS) {
            sort($old);
            foreach (array_slice($old, 0, count($old) - KEEP_BACKUPS) as $drop) {
                @unlink($drop);
            }
        }
    }
}

/* --- build the file --- */
$flags = JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE;

/* JSON is valid JavaScript with one exception that matters: these two
   separators are legal inside a JSON string but end a line in a script. */
$encode = static function ($value) use ($flags): string {
    $json = json_encode($value, $flags);
    return str_replace(["\u{2028}", "\u{2029}"], ['\\u2028', '\\u2029'], $json);
};

$js  = "/* ==========================================================================\n";
$js .= "   PRODUCTS.JS — your catalogue.\n";
$js .= "\n";
$js .= "   Saved from admin.html on " . date('Y-m-d H:i') . ".\n";
$js .= "   " . count($products) . " products, " . count($collections) . " collections.\n";
$js .= "\n";
$js .= "   Written by api/save.php. Edit it through the panel rather than by\n";
$js .= "   hand — the next save overwrites whatever is here. The version this\n";
$js .= "   one replaced is in api/backups.\n";
$js .= "   ========================================================================== */\n";
$js .= "\n";
$js .= 'PRODUCTS = ' . $encode($products) . ";\n\n";
$js .= "/* Category order and descriptions. Membership comes from each product. */\n";
$js .= 'CATEGORIES = ' . $encode($categories) . ";\n\n";
$js .= "/* Hand-picked sets, served at collection.html?c=<slug>. */\n";
$js .= 'COLLECTIONS = ' . $encode($collections) . ";\n";

if (!write_atomic(CATALOGUE, $js)) {
    fail('Could not write js/products.js. Check that the js folder is writable (chmod 755, and the file 644).', 500);
}

send([
    'ok'          => true,
    'products'    => count($products),
    'collections' => count($collections),
    'bytes'       => strlen($js),
    'savedAt'     => date('c'),
]);
