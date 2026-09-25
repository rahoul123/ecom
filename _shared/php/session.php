<?php
/* ==========================================================================
   SESSION — sign in, sign out, and "are we signed in?".

   GET  api/session.php          -> whether the panel can save, and the token
   POST api/session.php {password} -> sign in
   POST api/session.php {logout:1} -> sign out
   ========================================================================== */

require_once __DIR__ . '/auth.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

/* --- who are we? The panel asks this on load to decide what to show. --- */
if ($method === 'GET') {
    send([
        'ok'          => true,
        'configured'  => password_is_set(),
        'signedIn'    => logged_in(),
        'csrf'        => csrf_token(),
        'writable'    => is_writable(dirname(CATALOGUE)),
        'imagesWritable' => is_dir(IMAGE_DIR) ? is_writable(IMAGE_DIR) : is_writable(SITE_ROOT . '/images'),
    ]);
}

if ($method !== 'POST') {
    fail('GET or POST only.', 405);
}

$body = json_decode(file_get_contents('php://input') ?: '', true);
if (!is_array($body)) {
    fail('Expected JSON.');
}

/* --- sign out --- */
if (!empty($body['logout'])) {
    start_session();
    $_SESSION = [];
    session_destroy();
    send(['ok' => true, 'signedIn' => false]);
}

/* --- sign in --- */
if (!password_is_set()) {
    fail('No password has been set. Open api/config.php and follow the instructions at the top.', 503);
}

start_session();

/* A slow, fixed penalty after a wrong password. Nothing clever, but it turns
   "guess a million passwords" into "guess a few thousand", and this endpoint
   has exactly one legitimate user who will not notice the wait. */
$now = time();
$fails = $_SESSION['fails'] ?? 0;
$last  = $_SESSION['lastTry'] ?? 0;
if ($fails >= 5 && $now - $last < 30) {
    fail('Too many attempts. Wait half a minute.', 429);
}

$password = (string) ($body['password'] ?? '');
if ($password === '' || !password_verify($password, ADMIN_HASH)) {
    $_SESSION['fails'] = $fails + 1;
    $_SESSION['lastTry'] = $now;
    /* Same wait whether the password was empty or merely wrong. */
    usleep(400000);
    fail('That password is not right.', 401);
}

/* A fresh id on login, so a session id someone else already knows is
   useless to them. */
session_regenerate_id(true);
$_SESSION['admin'] = true;
$_SESSION['seen'] = $now;
$_SESSION['fails'] = 0;

send(['ok' => true, 'signedIn' => true, 'csrf' => csrf_token()]);
