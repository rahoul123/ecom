<?php
/* ==========================================================================
   HASH — a one-off helper. DELETE THIS FILE once you have your password set.

   Visit:  https://yoursite.com/api/hash.php?p=your-chosen-password
   Copy the line it prints into config.php, then delete this file.

   It refuses to run at all once config.php has a real password in it, so
   forgetting to delete it is not a disaster — but delete it anyway.
   ========================================================================== */

require_once __DIR__ . '/config.php';

header('Content-Type: text/plain; charset=utf-8');
header('X-Robots-Tag: noindex, nofollow');

if (ADMIN_HASH !== 'SET-ME' && ADMIN_HASH !== '') {
    http_response_code(410);
    echo "A password is already set, so this helper is switched off.\n\n";
    echo "If you need to change it, put ADMIN_HASH back to 'SET-ME' in\n";
    echo "config.php, reload this page, then delete this file again.\n";
    exit;
}

$p = (string) ($_GET['p'] ?? '');

if ($p === '') {
    echo "Add your chosen password to the address, like this:\n\n";
    echo "    hash.php?p=my-password-here\n";
    exit;
}

if (strlen($p) < 10) {
    echo "That password is " . strlen($p) . " characters. Use at least 10.\n";
    echo "This is the only thing standing between the internet and your shop.\n";
    exit;
}

echo "Put this line in config.php, replacing the one that says SET-ME:\n\n";
echo "const ADMIN_HASH = '" . password_hash($p, PASSWORD_DEFAULT) . "';\n\n";
echo "Then delete this file (api/hash.php) from your server.\n";
