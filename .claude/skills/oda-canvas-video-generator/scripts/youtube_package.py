"""Prepare a finished deck for YouTube: title, description with chapters, and captions from the speaker notes.

Usage (repo root): python .claude/skills/oda-canvas-video-generator/scripts/youtube_package.py <deck-id> [--no-asr]

Reads:
  scripts/<deck-id>.md          its "## YouTube" section (title, description, chapter-title overrides) and the notes
  decks/<deck-id>/slides.json   slide titles and notes, as presentation-generator saw them
  decks/<deck-id>/render.json   each slide's length in the final video (`_final` lists the slides it was built from)
  decks/<deck-id>/<deck-id>_video.mp4

Writes decks/<deck-id>/youtube/:
  title.txt, description.txt    paste into YouTube Studio (the description ends with the chapter list,
                                which YouTube turns into chapters: first at 0:00, at least 3, each ≥ 10 s)
  captions.srt                  the speaker notes as English captions, one sentence per cue (split if long),
                                timed to the real voice with Whisper word timestamps (asr_words.py, run with
                                csm-lester-voice's Python). --no-asr spreads each slide's sentences over its
                                narration by word count instead.
  package.json                  everything above, plus the video path, for the upload step

The "## YouTube" section of the script looks like:

  ## YouTube
  - **Title:** Introduction to the ODA Canvas | ODA Canvas training, part 1
  - **Chapters:** 1=Introduction; 16=Live: the ODA Component Directory
  - **Description:**
  > First paragraph…
  >
  > Second paragraph…
  - **Links:**
  > ODA Canvas on GitHub: https://github.com/tmforum-oda/oda-canvas
"""
import argparse
import difflib
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
CSM_PY = Path(r"D:\Dev\lesterthomas\csm-lester-voice\.venv\Scripts\python.exe")
LEAD = 1.0  # presentation-generator starts each slide's narration this many seconds in (Options.lead)
MAX_LINE = 42
MIN_CHAPTER = 10.0


def ffmpeg() -> str:
    try:
        import imageio_ffmpeg

        return imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError:
        exe = ROOT / "videos/node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe"
        return str(exe) if exe.exists() else "ffmpeg"


def youtube_section(script: Path) -> dict:
    text = script.read_text(encoding="utf-8")
    m = re.search(r"\n## YouTube\n(.*?)(?=\n## |\Z)", text, re.S)
    if not m:
        raise SystemExit(f"{script.name} has no '## YouTube' section (title, description, links): add one first")
    sec = m.group(1)
    title = re.search(r"\*\*Title:\*\*\s*(.+)", sec)
    chapters = re.search(r"\*\*Chapters:\*\*\s*(.+)", sec)

    def quoted(label, keep_lines=False):
        mm = re.search(rf"\*\*{label}:\*\*\s*\n((?:>.*\n?)+)", sec)
        if not mm:
            return ""
        paras, cur = [], []
        for line in mm.group(1).splitlines():
            line = line[1:].strip()
            if line and keep_lines:
                paras.append(line)
            elif line:
                cur.append(line)
            elif cur:
                paras.append(" ".join(cur))
                cur = []
        if cur:
            paras.append(" ".join(cur))
        return paras

    overrides = {}
    if chapters:
        for part in chapters.group(1).split(";"):
            if "=" in part:
                n, t = part.split("=", 1)
                overrides[int(n.strip())] = t.strip()
    if not title:
        raise SystemExit("the YouTube section needs a **Title:** line")
    t = title.group(1).strip()
    if len(t) > 100:
        raise SystemExit(f"YouTube titles are at most 100 characters ({len(t)}): {t}")
    return {"title": t, "description": quoted("Description"), "links": quoted("Links", keep_lines=True), "chapters": overrides}


def ts(t: float, srt: bool = False) -> str:
    if srt:
        ms = int(round(t * 1000))
        return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"
    t = int(t)
    return f"{t // 3600}:{t // 60 % 60:02d}:{t % 60:02d}" if t >= 3600 else f"{t // 60}:{t % 60:02d}"


def norm(w: str) -> str:
    w = w.lower().replace("’", "'")
    return re.sub(r"[^a-z0-9']", "", w)


def sentences(notes: str) -> list[str]:
    return [s.strip() for s in re.split(r"(?<=[.!?])\s+", notes.replace("\n", " ")) if s.strip()]


def _balanced(words: list[str], parts: int) -> list[list[str]]:
    """Split words into `parts` runs of roughly equal character length."""
    total = sum(len(w) + 1 for w in words)
    out, cur, acc = [], [], 0
    for w in words:
        cur.append(w)
        acc += len(w) + 1
        if len(out) < parts - 1 and acc >= total * (len(out) + 1) / parts:
            out.append(cur)
            cur = []
    if cur:
        out.append(cur)
    return out


def wrap(text: str) -> list[str]:
    """Split a sentence into balanced caption cues of at most two lines of about MAX_LINE characters,
    so no cue is left holding one stray word."""
    words = text.split()
    lines_needed = max(1, -(-len(text) // MAX_LINE))
    cues = _balanced(words, -(-lines_needed // 2))
    return ["\n".join(" ".join(l) for l in _balanced(c, 2 if len(" ".join(c)) > MAX_LINE else 1)) for c in cues]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("deck")
    ap.add_argument("--no-asr", action="store_true", help="time captions by word count instead of Whisper")
    a = ap.parse_args()
    deck = a.deck
    out = ROOT / "decks" / deck
    video = out / f"{deck}_video.mp4"
    if not video.exists():
        raise SystemExit(f"no final video yet: {video}")
    meta = youtube_section(ROOT / "scripts" / f"{deck}.md")
    slides = {f"{s['number']:02d}": s for s in json.loads((out / "slides.json").read_text(encoding="utf-8"))}
    manifest = json.loads((out / "render.json").read_text(encoding="utf-8"))
    order = list(manifest.get("_final") or {})
    stale = [k for k, fp in (manifest.get("_final") or {}).items() if manifest.get(k, {}).get("fingerprint") != fp]
    if not order or stale:
        raise SystemExit(f"the final video is out of date (slides {', '.join(stale)}): rebuild it first")

    # Slide windows in the final video.
    windows, t = [], 0.0
    for k in order:
        e = manifest[k]
        voice = (e.get("timing") or {}).get("voice") or (e["secs"] - LEAD - 0.75)
        windows.append({"key": k, "start": t, "end": t + e["secs"], "voice": (t + LEAD, min(t + LEAD + voice, t + e["secs"]))})
        t += e["secs"]
    total = t

    # Chapters: one per slide title (consecutive duplicates merged), overrides from the script, each ≥ 10 s.
    chapters = []
    for w in windows:
        n = int(w["key"])
        title = meta["chapters"].get(n) or slides[w["key"]]["title"]
        if chapters and (chapters[-1]["title"] == title or w["start"] - chapters[-1]["start"] < MIN_CHAPTER):
            continue
        chapters.append({"start": w["start"], "title": title})
    while len(chapters) > 1 and total - chapters[-1]["start"] < MIN_CHAPTER:
        chapters.pop()
    if len(chapters) < 3:
        raise SystemExit("YouTube needs at least 3 chapters")

    # Caption sentences, per slide.
    items = []
    for w in windows:
        for s in sentences(slides[w["key"]]["notes"]):
            items.append({"slide": w["key"], "text": s, "words": [norm(x) for x in s.split() if norm(x)]})

    words = None
    if not a.no_asr:
        ydir = out / "youtube"
        ydir.mkdir(exist_ok=True)
        wav, wj = ydir / "narration16k.wav", ydir / "asr_words.json"
        if not wj.exists() or wj.stat().st_mtime < video.stat().st_mtime:
            subprocess.run([ffmpeg(), "-v", "error", "-y", "-i", str(video), "-vn", "-ac", "1", "-ar", "16000", str(wav)], check=True)
            r = subprocess.run([str(CSM_PY), str(Path(__file__).with_name("asr_words.py")), str(wav), str(wj)])
            if r.returncode:
                print("Whisper failed: timing captions by word count instead", file=sys.stderr)
        if wj.exists():
            words = json.loads(wj.read_text(encoding="utf-8"))

    script_words = [(i, wd) for i, it in enumerate(items) for wd in it["words"]]
    if words:
        asr = [norm(x["w"]) for x in words]
        sm = difflib.SequenceMatcher(None, [w for _, w in script_words], asr, autojunk=False)
        hit = {}
        for blk in sm.get_matching_blocks():
            for j in range(blk.size):
                hit[blk.a + j] = blk.b + j
        pos = 0
        for i, it in enumerate(items):
            idx = [k for k in range(pos, pos + len(it["words"])) if k in hit]
            pos += len(it["words"])
            if len(idx) >= max(1, len(it["words"]) // 3):
                it["start"], it["end"] = words[hit[idx[0]]]["start"], words[hit[idx[-1]]]["end"]
        matched = sum(1 for it in items if "start" in it)
        print(f"Whisper alignment: {matched}/{len(items)} sentences timed from the voice, "
              f"{len(hit)}/{len(script_words)} words matched")

    # Fill the rest by word count within the slide's narration, and keep every cue inside its slide.
    for w in windows:
        its = [it for it in items if it["slide"] == w["key"]]
        n = sum(len(it["words"]) for it in its) or 1
        v0, v1 = w["voice"]
        acc = 0
        for it in its:
            est0 = v0 + (v1 - v0) * acc / n
            acc += len(it["words"])
            est1 = v0 + (v1 - v0) * acc / n
            it.setdefault("start", est0)
            it.setdefault("end", est1)
            it["start"] = max(it["start"], w["start"])
            it["end"] = min(max(it["end"], it["start"] + 0.8), w["end"])
    for a_, b_ in zip(items, items[1:]):  # no overlaps
        if a_["end"] > b_["start"]:
            a_["end"] = max(a_["start"] + 0.5, b_["start"] - 0.05)

    cues = []
    for it in items:
        chunks = wrap(it["text"])
        span = it["end"] - it["start"]
        weight = [len(c) for c in chunks]
        t0 = it["start"]
        for c, wgt in zip(chunks, weight):
            t1 = t0 + span * wgt / sum(weight)
            cues.append((t0, t1, c))
            t0 = t1
    srt = "\n".join(f"{i}\n{ts(s, True)} --> {ts(e, True)}\n{c}\n" for i, (s, e, c) in enumerate(cues, 1))

    chapter_text = "\n".join(f"{ts(c['start'])} {c['title']}" for c in chapters)
    desc = "\n\n".join(meta["description"])
    if meta["links"]:
        desc += "\n\n" + "\n".join(meta["links"])
    desc += "\n\nChapters\n" + chapter_text
    if len(desc) > 5000:
        raise SystemExit(f"description is {len(desc)} characters; YouTube allows 5000")
    if "<" in desc or ">" in desc:
        raise SystemExit("YouTube descriptions can't contain < or >")

    ydir = out / "youtube"
    ydir.mkdir(exist_ok=True)
    (ydir / "title.txt").write_text(meta["title"], encoding="utf-8")
    (ydir / "description.txt").write_text(desc, encoding="utf-8")
    (ydir / "captions.srt").write_text(srt, encoding="utf-8")
    pkg = {"deck": deck, "title": meta["title"], "description": desc, "chapters": chapters,
           "video": str(video), "captions": str(ydir / "captions.srt"), "duration": round(total, 1),
           "cues": len(cues)}
    (ydir / "package.json").write_text(json.dumps(pkg, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"{deck}: {ts(total)} · {len(chapters)} chapters · {len(cues)} caption cues · description {len(desc)} chars")
    print(f"  {ydir}")


if __name__ == "__main__":
    main()
