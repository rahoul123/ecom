<?php
/* ==========================================================================
   UPLOAD — puts a product photo into images/products/.

   POST api/upload.php  (multipart, field name "photo")
   -> { ok: true, url: "images/products/whatever.jpg" }

   The filename and the type the browser sends are both ignored. The file is
   opened as an image and the extension comes from what it actually is, so
   "cat.php" holding PHP source is rejected, and a real JPEG named "cat.php"
   is saved as a .jpg.
   ========================================================================== */

require_once __DIR__ . '/auth.php';

require_write_access();

if (empty($_FILES['photo'])) {
    fail('No file was sent.');
}

$file = $_FILES['photo'];

if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
    $why = [
        UPLOAD_ERR_INI_SIZE   => 'That file is larger than this server allows (upload_max_filesize).',
        UPLOAD_ERR_FORM_SIZE  => 'That file is too large.',
        UPLOAD_ERR_PARTIAL    => 'The upload was cut short. Try again.',
        UPLOAD_ERR_NO_FILE    => 'No file was sent.',
        UPLOAD_ERR_NO_TMP_DIR => 'The server has no temp folder to work in.',
        UPLOAD_ERR_CANT_WRITE => 'The server could not write the file.',
    ];
    fail($why[$file['error']] ?? 'The upload failed.', 400);
}

/* The one reliable way to know the browser sent a real upload and is not
   pointing at some other file on the server. */
if (!is_uploaded_file($file['tmp_name'])) {
    fail('That was not an upload.', 400);
}

if (($file['size'] ?? 0) > MAX_UPLOAD_BYTES) {
    fail('Photos must be under ' . round(MAX_UPLOAD_BYTES / 1048576, 1) . ' MB.', 413);
}

/* What is it, really? getimagesize reads the file's own header. */
$info = @getimagesize($file['tmp_name']);
if ($info === false || !isset($info[2]) || !isset(ALLOWED_IMAGE_TYPES[$info[2]])) {
    fail('That file is not a JPEG, PNG, GIF or WebP image.', 415);
}
$ext = ALLOWED_IMAGE_TYPES[$info[2]];

/* A name built from the original, but only from characters that cannot mean
   anything to a filesystem or a URL. */
$base = pathinfo((string) ($file['name'] ?? 'photo'), PATHINFO_FILENAME);
$base = strtolower($base);
$base = preg_replace('/[^a-z0-9]+/', '-', $base);
$base = trim((string) $base, '-');
if ($base === '' || strlen($base) > 60) {
    $base = substr($base, 0, 60) ?: 'photo';
    $base = trim($base, '-') ?: 'photo';
}

if (!is_dir(IMAGE_DIR) && !mkdir(IMAGE_DIR, 0755, true) && !is_dir(IMAGE_DIR)) {
    fail('Could not create images/products. Check the folder is writable.', 500);
}

/* Never silently replace a photo another product may be using. */
$name = $base . '.' . $ext;
$n = 1;
while (file_exists(IMAGE_DIR . '/' . $name)) {
    $n++;
    $name = $base . '-' . $n . '.' . $ext;
}

$dest = IMAGE_DIR . '/' . $name;
if (!move_uploaded_file($file['tmp_name'], $dest)) {
    fail('Could not save the photo. Check that images/products is writable.', 500);
}
@chmod($dest, 0644);

send([
    'ok'     => true,
    'url'    => 'images/products/' . $name,
    'width'  => $info[0],
    'height' => $info[1],
    'bytes'  => filesize($dest),
]);
