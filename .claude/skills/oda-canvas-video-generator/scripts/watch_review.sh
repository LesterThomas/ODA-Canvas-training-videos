#!/usr/bin/env bash
# Print one line (JSON) for every "request changes" made on presentation-generator's review page,
# so a Monitor wakes Claude to act on it straight away.
#
# Usage: bash watch_review.sh "D:/Dev/lesterthomas/ODA-Canvas-training-videos/decks/<deck-id>.pptx"
#
# presgen appends every review action to <deck folder>/review-events.jsonl. Only new lines are
# followed (tail -n0), so requests made before the watch started are not replayed: read those with
# `presgen.py status --json` when the watch starts.
deck="$1"
events="${deck%.*}/review-events.jsonl"
mkdir -p "$(dirname "$events")"
touch "$events"
tail -n0 -F "$events" 2>/dev/null | grep --line-buffered '"action": "changes"'
