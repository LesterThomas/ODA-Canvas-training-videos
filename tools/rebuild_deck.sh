#!/usr/bin/env bash
# Rebuild a deck after a fix, verify it, and refresh its review page.
#
# Usage: bash tools/rebuild_deck.sh <deck-id> <Prefix> <native-module> "<title>" [clip filters]
#   e.g. bash tools/rebuild_deck.sh 01-introduction-to-the-oda-canvas Intro intro "Introduction to the ODA Canvas" Intro-04,Intro-05
#
# Steps: re-render only the named Remotion clips and their posters (if any) -> extract notes ->
# build_deck.py -> animate_deck.ps1 -> check_deck.py + validate.py -> presgen refresh. A running
# review page picks the result up by itself. Stops at the first failure.
set -euo pipefail
deck="$1"; prefix="$2"; native="$3"; title="$4"; clips="${5:-}"
root="$(cd "$(dirname "$0")/.." && pwd)"
skill="$root/.claude/skills/oda-canvas-video-generator/scripts"
cd "$root"

if [ -n "$clips" ]; then
  (cd videos && node scripts/render-all.mjs "$clips" | tail -1 && node scripts/stills.mjs --posters "$clips" | tail -1)
fi
python "$skill/extract_notes.py" "scripts/$deck.md" "decks/$deck.notes.json" > /dev/null
python tools/build_deck.py "decks/$deck.notes.json" videos/out videos/out/posters "$prefix" "decks/$deck.pptx" "$title" \
  --native "tools/native/$native.py" --assets videos/out/assets
pwsh -NoProfile -File tools/animate_deck.ps1 "decks/$deck.pptx" | tail -1
python "$skill/check_deck.py" "decks/$deck.pptx" "decks/$deck.notes.json" | tail -1
PYTHONUTF8=1 python .agents/skills/pptx/scripts/office/validate.py "decks/$deck.pptx" | tail -1
[ -n "${NO_REFRESH:-}" ] || (cd ../presentation-generator && uv run --native-tls presgen.py refresh "$root/decks/$deck.pptx" 2>&1 | grep -E "rendered|ERROR" || true)
echo "rebuilt and refreshed decks/$deck.pptx"
