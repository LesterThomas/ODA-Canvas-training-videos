#!/usr/bin/env bash
# Print one line (JSON) for every "request changes" made on presentation-generator's review page,
# so a Monitor wakes Claude to act on it straight away.
#
# Usage: bash watch_review.sh "D:/Dev/lesterthomas/ODA-Canvas-training-videos/decks/<deck-id>.pptx"
#
# presgen appends every review action to <deck folder>/review-events.jsonl. On start, this first
# prints every change request that has no later reply from Claude (so requests made while the
# watch was down, e.g. between expiry and re-arming, are not missed), then follows new lines.
deck="$1"
events="${deck%.*}/review-events.jsonl"
mkdir -p "$(dirname "$events")"
touch "$events"
python - "$events" <<'EOF'
import json, sys
pending = {}
for line in open(sys.argv[1], encoding="utf-8"):
    try:
        e = json.loads(line)
    except ValueError:
        continue
    for n in e.get("slides", []):
        if e.get("action") == "changes":
            pending[n] = e
        elif e.get("action") == "reply" and e.get("by") == "claude" or e.get("action") in ("approve", "reset"):
            pending.pop(n, None)
for n in sorted(pending):
    print(json.dumps({**pending[n], "pending": True}, ensure_ascii=False), flush=True)
EOF
tail -n0 -F "$events" 2>/dev/null | grep --line-buffered '"action": "changes"'
