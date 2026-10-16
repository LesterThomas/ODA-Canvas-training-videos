# Deck assembly and verification

## Build

```bash
python tools/build_deck.py decks/<deck-id>.notes.json videos/out videos/out/posters <Prefix> decks/<deck-id>.pptx "<Deck title>"
```

`tools/build_deck.py` makes one slide per entry in the notes JSON:

- a 13.333 × 7.5 in (16:9) slide with a dark background (`#0A0F1E`),
- the title placeholder set to the slide title but moved **off the slide**, so it shows in outline
  view and to screen readers but never covers the video,
- a full-bleed movie (`add_movie`) using `<Prefix>-NN-*.mp4`, with `<Prefix>-NN-*.png` as the poster,
- the **auto-play timing** (below) in place of python-pptx's click-to-play,
- speaker notes copied verbatim from the JSON.

## Auto-play timing

PowerPoint only treats a media call as "Start: Automatically" when it sits in a **`mainSeq`** sequence
with an `afterEffect` node and `onBegin` trigger, plus the `prevCondLst`/`nextCondLst`. The first
attempt, without `mainSeq`, opened fine, but PowerPoint reported `MainSequence.Count = 0`, meaning no
auto-play. The template in `build_deck.py` is the version PowerPoint accepts. Keep the
`<p:timing>` element before any `<p:extLst>` (schema order).

## Verify (all four checks, every build)

1. `python .agents/skills/pptx/scripts/office/validate.py decks/<deck-id>.pptx` should print
   "All validations PASSED!"
2. `python .claude/skills/oda-canvas-video-generator/scripts/check_deck.py decks/<deck-id>.pptx decks/<deck-id>.notes.json`
   confirms the slide count, notes that match the JSON exactly, one media shape per slide, and
   auto-play timing on every slide.
3. `pwsh .claude/skills/oda-canvas-video-generator/scripts/ppt_check.ps1 decks/<deck-id>.pptx` opens
   the deck in real PowerPoint and prints `slide:effects/trigger` for each slide. You want `1/3` on
   every slide (trigger 3 = after previous). It also exports sample slides as PNGs to the scratchpad
   (or `-OutDir`).
4. Look at one or two exported PNGs. They are exactly what presentation-generator will narrate over.

## presentation-generator compatibility

`D:\Dev\lesterthomas\presentation-generator\extract_slides.py` exports each visible slide to PNG
through PowerPoint COM, saves the notes to `text_NN.txt`, synthesises audio, and builds the video
from the still and the audio. **It does not play embedded video yet.** Until it does, the poster frame
is what viewers see. So final frames must be complete (see `lessons.md`). Hidden slides are skipped,
so never hide a slide just to park it.

## Size and git

About 2 MB per slide: roughly 1.2 MB of clip plus a full-resolution PNG poster. Deck 01 is 56 MB.
GitHub's per-file limit is 100 MB, so split long decks or move to Git LFS before getting near it.
`~$*.pptx` lock files are gitignored.
