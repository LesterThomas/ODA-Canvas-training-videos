# Review, narration and the final video (presentation-generator)

`D:\Dev\lesterthomas\presentation-generator` (separate repo, `uv`, Windows + PowerPoint) turns a
finished deck into the narrated `.mp4`. Its README is the full manual. This file covers how the skill
uses it.

## What it does

1. **review**: exports each slide as a 1920×1080 still and a *silent PowerPoint render* (so the
   native entrances and the embedded Remotion clips can be checked). Then it serves a review page at
   http://localhost:8765, where the user approves slides or requests changes, one slide at a time.
2. **generate**: for **approved** slides only, it
   - synthesises the narration from the speaker notes in the user's cloned voice (csm-voice),
   - has PowerPoint render the slide on its own (`CreateVideo`, 1080p),
   - adds the narration with FFmpeg, starting 1 s in.

   Once every visible slide is approved, it joins the clips into the final video plus a chapter list.

The deck is never modified. presentation-generator renders from a copy in `<deck>/.work/`.

Because PowerPoint does the rendering, **animations and embedded clips play in the final video.** The
poster frame and native final state still matter: they are the review stills and the
`--renderer still` fallback.

## Files

| Path | What | Git |
|---|---|---|
| `decks/<deck-id>.review.json` | approvals, comments and history per slide (keyed by PowerPoint SlideID) | **commit** with the deck |
| `decks/<deck-id>/` | stills, notes text, `audio_NN.wav`, `previews/`, `clips/`, the final `<deck-id>_video.mp4`, `<deck-id>_chapters.txt`, `presgen.log` | ignored (`decks/*/`) |

Each approval stores the slide's fingerprint: its still, notes, embedded media and animation timings.
Rebuilding the deck in a way that changes a slide (`build_deck.py`, `animate_deck.ps1`, a notes edit)
marks that slide **changed since approval**, and it needs approving again. Rebuilding without changes
keeps approvals, because the stills are byte-identical between PowerPoint runs.

## Commands (run from the presentation-generator folder)

```bash
cd D:/Dev/lesterthomas/presentation-generator
uv run --native-tls presgen.py review   "D:/Dev/lesterthomas/ODA-Canvas-training-videos/decks/<deck-id>.pptx"   # background: it serves until stopped
uv run --native-tls presgen.py status   "<deck>.pptx" --json
uv run --native-tls presgen.py approve  "<deck>.pptx" 1-4,7          # only when the user said so
uv run --native-tls presgen.py changes  "<deck>.pptx" 5 -m "comment"
uv run --native-tls presgen.py generate "<deck>.pptx"                 # background: about 1.5–2.5 min of TTS per slide
uv run --native-tls presgen.py generate "<deck>.pptx" --redo-audio 5  # re-voice one slide
```

`--native-tls` is needed on this machine because Norton intercepts TLS. `review` opens the page in the
user's default browser. Run it, and `generate`, with `run_in_background`, because both run for
minutes. The page polls for changes, so it picks up new clips while `generate` runs.

## Rules

- **Approval is the user's call.** Never approve a slide on your own initiative, not even one you
  just fixed. Record approvals only when the user gives them in chat ("approve 1–4"), and tell them
  that the page does the same.
- **Comments on the review page are feedback.** Read them with `status --json` (or
  `decks/<deck-id>.review.json`). Handle each one through the skill's **Feedback loop**, so the deck
  is fixed and the rule is considered for the skill. After a fix, rebuild the deck and re-run `review`.
  Then tell the user which slides now need approving again.
- **Narration problems are notes problems.** Mispronunciations, odd pauses and wrong emphasis are fixed
  in the script's speaker notes, then `extract_notes.py` → `build_deck.py` → `animate_deck.ps1`.
  - Use phonetic spelling, such as "O-D-A", only when the voice gets a term wrong.
  - Add `[pause]` for a one-second pause.
  - Don't use version numbers with full stops, because csm-voice splits sentences at every `.`.

  Use `--redo-audio` only when the text is right and the voice simply produced a bad take.
- **Final video only from a fully approved deck.** `--partial` is for previews. Say so if you use it.
- **Check the result before reporting it.** Look at the log summary, and sample a few frames of the
  final video, at least one native slide mid-build and one clip slide, with FFmpeg
  (`imageio_ffmpeg.get_ffmpeg_exe()` in presentation-generator's venv).

## Timing

The real voice ran at about 2.3–2.4 words per second on deck 01 (25 words → 11.1 s, 67 words →
28.1 s). That's slightly slower than the 2.5 used to plan builds. Each slide's clip lasts as long as
the longest of these:

- the narration plus 1.75 s,
- its last animation,
- its embedded clip.

So nothing is cut off. A build can still run a little ahead of the voice. If the user says a slide's
animation is out of step, the narration lengths in `decks/<deck-id>/render.json` (`secs`) and the
`audio_NN.wav` durations are the real timings to retime against.
