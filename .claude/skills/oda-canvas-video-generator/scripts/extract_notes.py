"""Extract per-slide speaker notes from a deck script into the JSON that build_deck.py consumes.

Usage: python extract_notes.py scripts/<deck-id>.md decks/<deck-id>.notes.json

The script format is `### Slide N: Title` headings with narration in `> ` lines
(see references/script-template.md). Prints words and estimated seconds per slide (2.5 words/s)
so clip lengths and build-up timings can follow the narration. Warns about leftover [VERIFY] markers,
and flags notes the voice reads badly: colons, semicolons, long sentences and dotted version numbers.
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
        # "> text" lines are narration; a bare ">" line starts a new paragraph (kept as a blank line).
        paras, cur = [], []
        for l in body.splitlines():
            if l.startswith("> ") and l[2:].strip():
                cur.append(l[2:].strip())
            elif l.strip() == ">" and cur:
                paras.append(" ".join(cur))
                cur = []
        if cur:
            paras.append(" ".join(cur))
        notes = "\n\n".join(paras)
        words = len(notes.split())
        slides.append({"n": n, "title": title, "notes": notes, "words": words, "secs": round(words / WORDS_PER_SECOND, 1)})
        if not notes:
            flag = "  <-- no notes"
        elif n == 1:  # the presenter's introduction to camera: about 110-130 words (lessons.md, 2026-10-18)
            flag = "  <-- presenter intro: aim for 110-130 words" if not 100 <= words <= 140 else ""
        else:
            flag = "  <-- long, consider splitting" if words > 90 else ""
        dotted = sorted(set(re.findall(r"\d+(?:\.\d+)+", notes)))
        if dotted:
            flag += f"  <-- spell out {', '.join(dotted)} as spoken (e.g. 'two dot O')"
        if ":" in notes or ";" in notes:
            flag += "  <-- colon/semicolon: the voice reads them badly, use a full stop"
        longest = max((len(x.split()) for x in re.split(r"(?<=[.!?])\s+", notes)), default=0)
        if longest > 20:
            flag += f"  <-- a {longest}-word sentence: split it (the voice can cut long sentences short)"
        print(f"{n:>2} {title[:55]:<55} {words:>3} words ~{round(words / WORDS_PER_SECOND):>3}s{flag}")

    nums = [s["n"] for s in slides]
    if nums != list(range(1, len(nums) + 1)):
        print(f"WARNING: slide numbers are not 1..{len(nums)} in order: {nums}")
    total = sum(s["words"] for s in slides)
    print(f"{len(slides)} slides, {total} words, ~{total / WORDS_PER_SECOND / 60:.1f} min narration")
    json.dump(slides, open(dst, "w", encoding="utf-8"), indent=1, ensure_ascii=False)


if __name__ == "__main__":
    main()
