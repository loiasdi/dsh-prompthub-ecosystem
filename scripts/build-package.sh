#!/usr/bin/env bash
set -euo pipefail

# BSD tar on macOS may not have the shell's C.UTF-8 locale available.
export LC_ALL=C
export LANG=C

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PACKAGE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
OUTPUT_DIR="$PACKAGE_DIR/dist"

cd "$PACKAGE_DIR"

command -v node >/dev/null 2>&1 || { echo "error: node is required" >&2; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "error: npm is required" >&2; exit 1; }
command -v tar >/dev/null 2>&1 || { echo "error: tar is required" >&2; exit 1; }

echo "==> Running tests"
npm test

echo "==> Checking JavaScript syntax"
node --check index.js
node --check client.js

mkdir -p "$OUTPUT_DIR"
echo "==> Building package"
pack_json="$(npm pack --json --pack-destination "$OUTPUT_DIR")"
package_name="$(node -e 'const data = JSON.parse(process.argv[1]); if (!data[0]?.filename) process.exit(1); process.stdout.write(data[0].filename)' "$pack_json")"
package_path="$OUTPUT_DIR/$package_name"

if [[ ! -f "$package_path" ]]; then
  echo "error: npm did not create $package_path" >&2
  exit 1
fi

echo "==> Checking archive contents"
archive_listing="$(tar -tzf "$package_path")"
if printf '%s\n' "$archive_listing" | grep -Eiq '(^|/)(\.env($|\.)|.*\.(pem|key|p12)($|/)|node_modules/|tests/)'; then
  echo "error: package contains a forbidden secret, dependency, or test path" >&2
  exit 1
fi

if command -v shasum >/dev/null 2>&1; then
  checksum="$(shasum -a 256 "$package_path" | awk '{print $1}')"
else
  checksum="$(sha256sum "$package_path" | awk '{print $1}')"
fi
size="$(wc -c < "$package_path" | tr -d '[:space:]')"

echo
echo "Package: $package_path"
echo "Size:    ${size} bytes"
echo "SHA-256: $checksum"
