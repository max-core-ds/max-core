#!/usr/bin/env bash
#
# fetch-tree.sh — regenerate figma-tree.json
#
# Fetches the full Figma document for the Max Core file and flattens it to a compact
# name/id/type/link tree (the input to split-tree.mjs). This is the exact pipeline the
# tree was originally generated with, checked in for reproducibility.
#
# Requires:  curl, jq
# Secret:    FIGMA_TOKEN must be set via .env or the environment — NEVER passed as an arg
#            (CLI args leak into shell history and `ps` output).
# Usage:     ./fetch-tree.sh [FILE_KEY] [FILE_SLUG] [OUTPUT]
#              FILE_KEY   defaults to $FIGMA_FILE_KEY
#              FILE_SLUG  defaults to $FIGMA_FILE_SLUG (only used to build clickable links)
#              OUTPUT     defaults to figma-tree.json next to this script
#
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Load .env from this folder or the repo root if present (without overriding real env vars).
for envfile in "$here/.env" "$here/../.env"; do
  if [[ -f "$envfile" ]]; then
    set -a
    # shellcheck disable=SC1090
    source "$envfile"
    set +a
  fi
done

FILE_KEY="${1:-${FIGMA_FILE_KEY:-}}"
FILE_SLUG="${2:-${FIGMA_FILE_SLUG:-figma}}"
OUTPUT="${3:-$here/figma-tree.json}"

if [[ -z "${FIGMA_TOKEN:-}" ]]; then
  echo "error: FIGMA_TOKEN is not set. Copy .env.example to .env and fill it in." >&2
  exit 1
fi
if [[ -z "$FILE_KEY" ]]; then
  echo "error: no file key. Pass it as the first argument or set FIGMA_FILE_KEY." >&2
  exit 1
fi

echo "fetching file $FILE_KEY …" >&2
resp="$(curl -sS -H "X-Figma-Token: ${FIGMA_TOKEN}" "https://api.figma.com/v1/files/${FILE_KEY}")"

# Bail out clearly if the API returned an error instead of a document.
if ! jq -e '.document' >/dev/null 2>&1 <<<"$resp"; then
  echo "error: Figma API did not return a document:" >&2
  jq -r '.err // ("status " + (.status|tostring)) // .' <<<"$resp" 2>/dev/null | head -5 >&2
  exit 1
fi

jq --arg key "$FILE_KEY" --arg slug "$FILE_SLUG" '
  def simplify:
    {
      name: .name,
      id: .id,
      type: .type,
      link: ("https://www.figma.com/design/" + $key + "/" + $slug + "?node-id=" + (.id | gsub(":"; "-")))
    }
    + (if .children then { children: [ .children[] | simplify ] } else {} end);
  .document | simplify
' <<<"$resp" > "$OUTPUT"

echo "wrote $OUTPUT ($(du -h "$OUTPUT" | cut -f1))" >&2
echo "next: node split-tree.mjs" >&2
