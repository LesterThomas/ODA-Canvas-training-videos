# Deck assembly and verification

## Build (hybrid: native slides plus clip slides)

```bash
python tools/build_deck.py decks/<deck-id>.notes.json videos/out videos/out/posters <Prefix> decks/<deck-id>.pptx "<Deck title>"
```

With `--native tools/native/<deck>.py --assets videos/out/assets`, slides listed in that module's
`BUILDERS` are drawn as native PowerPoint shapes (`tools/native/pptx_kit.py`). Their planned entrance
animations, and every slide's narration length, go to `decks/<deck-id>.anim.json`. Then
`pwsh tools/animate_deck.ps1 decks/<deck-id>.pptx` opens the deck in PowerPoint. It adds the
entrances (first "After Previous", the rest "With Previous", each delayed from slide start) and sets
every slide to auto-advance after its narration plus 1.5 s. Always run it after `build_deck.py`.

For the clip slides, `tools/build_deck.py` makes one slide per entry in the notes JSON:

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

1. `PYTHONUTF8=1 python .agents/skills/pptx/scripts/office/validate.py decks/<deck-id>.pptx` should
   print "All validations PASSED!" Without `PYTHONUTF8=1`, the validator crashes on Windows when
   slide text contains curly quotes.
2. `python .claude/skills/oda-canvas-video-generator/scripts/check_deck.py decks/<deck-id>.pptx decks/<deck-id>.notes.json`
   confirms the slide count and notes that match the JSON exactly. For clip slides it checks there
   is one media shape with auto-play timing. For native slides it checks every animated shape exists
   and the animations were applied.
3. `pwsh .claude/skills/oda-canvas-video-generator/scripts/ppt_check.ps1 decks/<deck-id>.pptx` opens
   the deck in real PowerPoint and prints `slide:effects/trigger` for each slide. Clip slides show
   `1/3`; native slides show their effect count, for example `9/3`. The `/3` (the first effect starts
   "After Previous") must be on every slide. It also exports sample slides as PNGs to the scratchpad
   (or `-OutDir`).
4. Look at one or two exported PNGs. They are the stills on the presentation-generator review page.

## presentation-generator compatibility

presentation-generator (see `narration-and-video.md`) renders every slide with PowerPoint's own
`CreateVideo`. So the auto-play clips and the native entrances must work in a real PowerPoint slide
show, which `ppt_check.ps1` confirms. It sets each slide's length itself, from the real narration
length, the last animation and the clip length, so the auto-advance times from `animate_deck.ps1`
only matter for live presenting. Hidden slides are skipped, so never hide a slide just to park it.
Any rebuild that changes a slide clears that slide's approval in `decks/<deck-id>.review.json`.

## Size and git

About 2 MB per slide: roughly 1.2 MB of clip plus a full-resolution PNG poster. Deck 01 is 56 MB.
GitHub's per-file limit is 100 MB, so split long decks or move to Git LFS before getting near it.
`~$*.pptx` lock files are gitignored.
