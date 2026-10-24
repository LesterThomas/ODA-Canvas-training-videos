#!/usr/bin/env bash
# Print one line (JSON) for every "Republish to YouTube" request made on the overview page (presgen hub),
# so a Monitor wakes Claude to rebuild the final video if needed and re-upload it.
#
# Usage: bash watch_hub.sh "D:/Dev/lesterthomas/ODA-Canvas-training-videos/decks"
#
# The hub records each request in <deck>.youtube.json ("republish_requested") and appends it to
# <decks>/hub-events.jsonl. On start, this first prints every deck whose request is still open (a new
# upload replaces the .youtube.json, which clears it), then follows new lines.
decks="$1"
events="$decks/hub-events.jsonl"
touch "$events"
python - "$decks" <<'EOF'
import json, sys
from pathlib import Path
for f in sorted(Path(sys.argv[1]).glob("*.youtube.json")):
    try:
        y = json.loads(f.read_text(encoding="utf-8"))
    except ValueError:
        continue
    if y.get("republish_requested"):
        deck = f.name[: -len(".youtube.json")]
        print(json.dumps({"at": y["republish_requested"], "action": "republish", "deck": deck, "url": y.get("url"),
                          "pending": True}, ensure_ascii=False), flush=True)
EOF
tail -n0 -F "$events" 2>/dev/null | grep --line-buffered '"action": "republish"'
