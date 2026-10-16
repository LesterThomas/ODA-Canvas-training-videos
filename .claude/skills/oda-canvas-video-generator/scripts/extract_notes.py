"""Extract per-slide speaker notes from a deck script into the JSON that build_deck.py consumes.

Usage: python extract_notes.py scripts/<deck-id>.md decks/<deck-id>.notes.json

The script format is `### Slide N: Title` headings with narration in `> ` lines
(see references/script-template.md). Prints words and estimated seconds per slide (2.5 words/s)
so clip lengths and build-up timings can follow the narration. Warns about leftover [VERIFY] markers.
"""

import json
import re
import sys

WORDS_PER_SECOND = 2.5


def main() -> None:
    src, dst = sys.argv[1], sys.argv[2]
    text = open(src, encoding="utf-8").read()
    if "[VERIFY" in text:
        print("WARNING: script still contains [VERIFY] markers; confirm them with the user first.")

    parts = re.split(r"\n### Slide (\d+): (.+)\n", text)
    slides = []
    for i in range(1, len(parts), 3):
        n, title, body = int(parts[i]), parts[i + 1].strip(), parts[i + 2]
        body = body.split("\n## ")[0].split("\n---")[0]  # stop at the next segment or the source check
        notes = " ".join(l[2:].strip() for l in body.splitlines() if l.startswith("> "))
        words = len(notes.split())
        slides.append({"n": n, "title": title, "notes": notes, "words": words, "secs": round(words / WORDS_PER_SECOND, 1)})
        flag = "  <-- no notes" if not notes else ("  <-- long, consider splitting" if words > 90 else "")
        print(f"{n:>2} {title[:55]:<55} {words:>3} words ~{round(words / WORDS_PER_SECOND):>3}s{flag}")

    nums = [s["n"] for s in slides]
    if nums != list(range(1, len(nums) + 1)):
        print(f"WARNING: slide numbers are not 1..{len(nums)} in order: {nums}")
    total = sum(s["words"] for s in slides)
    print(f"{len(slides)} slides, {total} words, ~{total / WORDS_PER_SECOND / 60:.1f} min narration")
    json.dump(slides, open(dst, "w", encoding="utf-8"), indent=1, ensure_ascii=False)


if __name__ == "__main__":
    main()
