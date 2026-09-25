<?php
/* ==========================================================================
   AUTH — shared by every endpoint. Session login, CSRF token, JSON replies.

   The session cookie is the login. Because a cookie is sent automatically by
   the browser, a cookie alone would let any other site post to these
   endpoints on your behalf, so every write also has to carry a token that
   only this origin can read. That is the X-CSRF header below.
   ========================================================================== */

require_once __DIR__ . '/config.php';

/* Nothing here is for a search engine or a cache. */
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('X-Robots-Tag: noindex, nofollow');

function send(array $body, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($body, JSON_UNESCAPED_SLASHES);
    exit;
}

function fail(string $message, int $status = 400): void
{
    send(['ok' => false, 'error' => $message], $status);
}

function start_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }
    session_set_cookie_params([
        'httponly' => true,
        'samesite' => 'Strict',
        /* Only promise HTTPS when we are actually on it, or the cookie is
           dropped on a plain-http setup and login silently fails. */
        'secure'   => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
    ]);
    session_name('shopadmin');
    session_start();
}

function password_is_set(): bool
{
    return ADMIN_HASH !== 'SET-ME' && ADMIN_HASH !== '';
}

function logged_in(): bool
{
    start_session();
    if (empty($_SESSION['admin']) || empty($_SESSION['seen'])) {
        return false;
    }
    if (time() - $_SESSION['seen'] > SESSION_TTL) {
        $_SESSION = [];
        session_destroy();
        return false;
    }
    $_SESSION['seen'] = time();
    return true;
}

function csrf_token(): string
{
    start_session();
    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf'];
}

/**
 * Every endpoint that changes something calls this first.
 *
 * Checks, in order: that a password was ever set, that this request is a
 * POST, that somebody is logged in, and that the request carries the token.
 */
function require_write_access(): void
{
    if (!password_is_set()) {
        fail('No password has been set. Open api/config.php and follow the instructions at the top.', 503);
    }
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        fail('POST only.', 405);
    }
    if (!logged_in()) {
        fail('Not signed in.', 401);
    }
    $sent = $_SERVER['HTTP_X_CSRF'] ?? '';
    if (!hash_equals($_SESSION['csrf'] ?? '', $sent)) {
        fail('This request did not come from the panel. Reload it and sign in again.', 403);
    }
}

/**
 * Writes a file without ever leaving a half-written one in place: the new
 * content goes to a temporary file first and is then moved over the old one,
 * which the filesystem does in a single step.
 */
function write_atomic(string $path, string $contents): bool
{
    $dir = dirname($path);
    if (!is_dir($dir) && !mkdir($dir, 0755, true) && !is_dir($dir)) {
        return false;
    }
    $tmp = tempnam($dir, '.tmp');
    if ($tmp === false) {
        return false;
    }
    if (file_put_contents($tmp, $contents) === false) {
        @unlink($tmp);
        return false;
    }
    @chmod($tmp, 0644);
    if (!rename($tmp, $path)) {
        @unlink($tmp);
        return false;
    }
    return true;
}
