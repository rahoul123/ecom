#!/bin/bash
# Run:  bash _tools/test-api.sh
#
# Stands the admin API up on PHP's built-in server and exercises it the way a
# browser would: sign in, save, upload, and every way in that should be shut.
set -u

# Point PHP at your own binary if it is not on the PATH.
PHP=${PHP:-php}
command -v "$PHP" >/dev/null 2>&1 || PHP=/c/xampp/php/php.exe
ROOT=${1:-${TMPDIR:-/tmp}/shop-api-test}   # a throwaway site root
PORT=8899
JAR="$ROOT/cookies.txt"
BASE="http://127.0.0.1:$PORT"

pass=0; fail=0
check() { # check <label> <expected> <got>
  if [ "$2" = "$3" ]; then echo "  ok   $1"; pass=$((pass+1));
  else echo "  FAIL $1 — expected [$2] got [$3]"; fail=$((fail+1)); fi
}

rm -rf "$ROOT"; mkdir -p "$ROOT/api" "$ROOT/js" "$ROOT/images/products"
cp "$OLDPWD"/_shared/php/*.php "$ROOT/api/"
echo '/* stub */' > "$ROOT/js/products.js"

"$PHP" -S 127.0.0.1:$PORT -t "$ROOT" >/dev/null 2>&1 &
SRV=$!
sleep 2

echo "before a password is set"
code=$(curl -s -o /dev/null -w '%{http_code}' -X POST "$BASE/api/save.php" -H 'Content-Type: application/json' -d '{"products":[{"slug":"a","name":"A","price":1}]}')
check "save is refused (503)" "503" "$code"

hash=$(curl -s "$BASE/api/hash.php?p=a-long-enough-password" | grep "ADMIN_HASH" | sed "s/.*= '//;s/';//")
check "hash.php produces a hash" "yes" "$([ -n "$hash" ] && echo yes || echo no)"
short=$(curl -s "$BASE/api/hash.php?p=short" | head -1)
check "a short password is turned down" "yes" "$(echo "$short" | grep -q 'at least 10' && echo yes || echo no)"

"$PHP" -r '
$f = $argv[1]; $h = $argv[2];
file_put_contents($f, str_replace("const ADMIN_HASH = \x27SET-ME\x27;", "const ADMIN_HASH = \x27$h\x27;", file_get_contents($f)));
' "$ROOT/api/config.php" "$hash"
grep -q "SET-ME" "$ROOT/api/config.php" && echo "  FAIL password not written" && fail=$((fail+1))

echo
echo "hash.php after a password exists"
code=$(curl -s -o /dev/null -w '%{http_code}' "$BASE/api/hash.php?p=whatever")
check "switches itself off (410)" "410" "$code"

echo
echo "signing in"
rm -f "$JAR"
csrf=$(curl -s -c "$JAR" "$BASE/api/session.php" | "$PHP" -r 'echo json_decode(stream_get_contents(STDIN),true)["csrf"];')
check "a token is issued" "yes" "$([ -n "$csrf" ] && echo yes || echo no)"

code=$(curl -s -o /dev/null -w '%{http_code}' -b "$JAR" -c "$JAR" -X POST "$BASE/api/session.php" -H 'Content-Type: application/json' -d '{"password":"wrong-password-here"}')
check "the wrong password is refused (401)" "401" "$code"

out=$(curl -s -b "$JAR" -c "$JAR" -X POST "$BASE/api/session.php" -H 'Content-Type: application/json' -d '{"password":"a-long-enough-password"}')
check "the right password signs in" "yes" "$(echo "$out" | grep -q '"signedIn":true' && echo yes || echo no)"
csrf=$(echo "$out" | "$PHP" -r 'echo json_decode(stream_get_contents(STDIN),true)["csrf"];')

echo
echo "saving"
code=$(curl -s -o /dev/null -w '%{http_code}' -b "$JAR" -X POST "$BASE/api/save.php" -H 'Content-Type: application/json' -d '{"products":[{"slug":"a","name":"A","price":1}]}')
check "no CSRF token is refused (403)" "403" "$code"

body='{"products":[{"slug":"silk-a","name":"Silk A","price":89},{"slug":"silk-b","name":"Silk B","price":39}],"categories":[{"name":"Pillowcases"}],"collections":[{"slug":"edit","name":"The Edit","products":["silk-a"]}]}'
out=$(curl -s -b "$JAR" -X POST "$BASE/api/save.php" -H 'Content-Type: application/json' -H "X-CSRF: $csrf" -d "$body")
check "a good save succeeds" "yes" "$(echo "$out" | grep -q '"ok":true' && echo yes || echo no)"
check "products.js now has both products" "2" "$(sed -n '/^PRODUCTS = /,/^];/p' "$ROOT/js/products.js" | grep -c '"slug"')"
check "and the collection" "yes" "$(grep -q 'COLLECTIONS' "$ROOT/js/products.js" && echo yes || echo no)"
check "the file is valid JavaScript" "yes" "$(node --check "$ROOT/js/products.js" 2>/dev/null && echo yes || echo no)"
check "the replaced version was kept" "1" "$(ls "$ROOT/api/backups"/products-*.js 2>/dev/null | wc -l | tr -d ' ')"

echo
echo "saves that should be refused"
for t in '{"products":[]}|an empty catalogue' \
         '{"products":[{"slug":"../../evil","name":"X","price":1}]}|a path in the slug' \
         '{"products":[{"slug":"a","name":"A","price":1},{"slug":"a","name":"B","price":2}]}|a duplicate address' \
         '{"products":[{"slug":"a","name":"","price":1}]}|a nameless product' \
         '{"products":[{"slug":"a","name":"A"}]}|a product with no price'; do
  data="${t%%|*}"; label="${t##*|}"
  code=$(curl -s -o /dev/null -w '%{http_code}' -b "$JAR" -X POST "$BASE/api/save.php" -H 'Content-Type: application/json' -H "X-CSRF: $csrf" -d "$data")
  check "$label" "400" "$code"
done
check "and the good catalogue survived all that" "2" "$(sed -n '/^PRODUCTS = /,/^];/p' "$ROOT/js/products.js" | grep -c '"slug"')"

echo
echo "uploads"
# A genuine 1x1 PNG, byte for byte — no image extension needed to make one.
"$PHP" -r 'file_put_contents($argv[1], base64_decode("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="));' "$ROOT/real.jpg"
printf '<?php system($_GET["c"]); ?>' > "$ROOT/evil.php"
cp "$ROOT/evil.php" "$ROOT/evil.jpg"

out=$(curl -s -b "$JAR" -X POST "$BASE/api/upload.php" -H "X-CSRF: $csrf" -F "photo=@$ROOT/real.jpg")
check "a real photo uploads" "yes" "$(echo "$out" | grep -q '"ok":true' && echo yes || echo no)"
url=$(echo "$out" | "$PHP" -r 'echo json_decode(stream_get_contents(STDIN),true)["url"] ?? "";')
check "it lands in images/products" "yes" "$(echo "$url" | grep -q '^images/products/' && echo yes || echo no)"
check "the file is really there" "yes" "$([ -f "$ROOT/$url" ] && echo yes || echo no)"

code=$(curl -s -o /dev/null -w '%{http_code}' -b "$JAR" -X POST "$BASE/api/upload.php" -H "X-CSRF: $csrf" -F "photo=@$ROOT/evil.php")
check "a PHP file is turned away (415)" "415" "$code"
code=$(curl -s -o /dev/null -w '%{http_code}' -b "$JAR" -X POST "$BASE/api/upload.php" -H "X-CSRF: $csrf" -F "photo=@$ROOT/evil.jpg")
check "PHP renamed .jpg is still turned away (415)" "415" "$code"
check "nothing executable was written" "0" "$(ls "$ROOT/images/products" | grep -c '\.php$')"

out=$(curl -s -b "$JAR" -X POST "$BASE/api/upload.php" -H "X-CSRF: $csrf" -F "photo=@$ROOT/real.jpg")
url2=$(echo "$out" | "$PHP" -r 'echo json_decode(stream_get_contents(STDIN),true)["url"] ?? "";')
check "the same name twice does not overwrite" "yes" "$([ "$url" != "$url2" ] && echo yes || echo no)"

echo
echo "after signing out"
curl -s -b "$JAR" -c "$JAR" -X POST "$BASE/api/session.php" -H 'Content-Type: application/json' -d '{"logout":1}' >/dev/null
code=$(curl -s -o /dev/null -w '%{http_code}' -b "$JAR" -X POST "$BASE/api/save.php" -H 'Content-Type: application/json' -H "X-CSRF: $csrf" -d "$body")
check "saving is refused (401)" "401" "$code"
code=$(curl -s -o /dev/null -w '%{http_code}' -b "$JAR" -X POST "$BASE/api/upload.php" -H "X-CSRF: $csrf" -F "photo=@$ROOT/real.jpg")
check "uploading is refused (401)" "401" "$code"

echo
echo "a signed-out stranger"
code=$(curl -s -o /dev/null -w '%{http_code}' -X POST "$BASE/api/save.php" -H 'Content-Type: application/json' -d "$body")
check "cannot save (401)" "401" "$code"
code=$(curl -s -o /dev/null -w '%{http_code}' "$BASE/api/save.php")
check "cannot GET it either (405)" "405" "$code"

kill $SRV 2>/dev/null
echo
echo "$pass passed, $fail failed"
exit $([ $fail -eq 0 ] && echo 0 || echo 1)
