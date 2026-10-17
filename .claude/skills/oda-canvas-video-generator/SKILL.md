---
name: oda-canvas-video-generator
description: End-to-end process for producing and revising TM Forum ODA Canvas training-video decks in this repo: native PowerPoint slides and Remotion clips (including live recordings) with spoken-style speaker notes, which presentation-generator turns into a narrated video after slide-by-slide approval. Use this skill whenever the user wants to create, update, refresh, re-record, fix, review, approve, narrate or render an ODA Canvas training video, deck, script, slide, animation or speaker notes, e.g. "do the buy-or-build video next", "slide 7 feels too busy", "the narration on slide 12 is wrong", "approve slides 1-4", "generate the video", or "the Canvas changed, refresh the intro". Also use it whenever the user gives feedback on any deck, clip, script or narration (apply it, then consider it for this skill), and to record the ODA Component Directory, the Canvas Portal or helm/kubectl commands for a video. Use it even if the user names only one part.
---

# ODA Canvas video generator

This skill holds the house process for turning ODA Canvas knowledge into training videos. The repo
(`ODA-Canvas-training-videos`) produces one **deck per video**. The deck is a `.pptx` whose slides
each carry:

- either a **native PowerPoint layout**, with entrance animations timed to the narration, for titles,
  cards, lists and simple builds; or a silent **Remotion clip** for slides whose motion carries
  meaning, live Component Directory and Canvas Portal recordings, and terminal replays.
- **speaker notes**: the narration, written to be read aloud verbatim by an AI voice.

`presentation-generator` (`D:\Dev\lesterthomas\presentation-generator`, a separate repo) turns the
deck into the final narrated `.mp4`. The user reviews and approves the deck slide by slide on its
review page. It then voices the approved slides in the user's cloned voice, and has PowerPoint render
them, so animations and clips play. This repo never records or synthesises voice itself (Step 7).

The skill improves through use. Every piece of feedback the user gives is applied to the deck it
concerns, then weighed as a possible rule for all future decks (see **Feedback loop** below). Read
`references/lessons.md` before starting any work. It holds the rules earlier feedback produced, and
it overrides anything older in this file.

## Where things live

| Path | What it is |
|---|---|
| `specs/spec.md` | Project spec: pipeline, style guide, backlog of decks |
| `specs/video-update-plan.md` | Inventory of the upstream videos, what changed in the Canvas, production order |
| `specs/spec-<deck>.md`, `specs/tasks-<deck>.md` | Optional per-deck spec and task list |
| `presentations/` | Legacy material: `About ODA Canvas.pptx`, original transcripts (`transcripts/`) |
| `scripts/<deck-id>.md` | **Script**: one section per slide, with the visual, on-screen text, speaker notes and a source check |
| `images/` | Real Canvas Portal v2 screenshots (`Canvas 1–7.png`) |
| `videos/` | Remotion project: `src/theme.ts`, `src/lib/ui.tsx` (shared primitives), `src/<deck>/` scenes, `src/Root.tsx` |
| `videos/scripts/` | `render-all.mjs` (bundles once, renders clips) and `stills.mjs` (review stills and posters) |
| `demos/` | Playwright captures of the **Component Directory** and **Canvas Portal**, plus real **helm/kubectl** output (`demos/.env` holds the portal login and is gitignored) |
| `videos/public/captures/` | Recorded `.webm` files with `.marks.json` timelines, and `.cli.json` command outputs |
| `tools/build_deck.py` | Assembles the deck: full-bleed auto-play video, poster frame and notes on each slide |
| `decks/<deck-id>.pptx` | Deliverable, plus `<deck-id>.notes.json` and `<deck-id>.anim.json` |
| `decks/<deck-id>.review.json` | Slide-by-slide approvals and review comments (written by presentation-generator; committed) |
| `decks/<deck-id>/` | presentation-generator output: stills, narration, clips, final video (gitignored) |
| `.claude/launch.json` | `remotion-studio` preview config (runs from `videos/`) |

Deck ids are numbered to match `specs/video-update-plan.md` (for example `01-introduction-to-the-oda-canvas`).
The Remotion composition ids use a short prefix per deck plus the slide number (for example
`Intro-07-Component`). `build_deck.py` matches clips to slides by that `<prefix>-NN-` pattern.

## Choose the mode

1. **New deck**: start at Step 1.
2. **Feedback on an existing deck, clip or script**: go to **Feedback loop**. Change only what the
   feedback touches, then rebuild from the step that change affects.
3. **Upstream Canvas changed**: re-run Step 1 for the facts in that deck's source-check table, then
   update the script and the affected clips.
4. **Review, approve, narrate or render a built deck**: go to Step 7. Comments left on the review
   page are feedback, so handle them through the **Feedback loop**.

## The process

### Step 1: Research the facts (scripts are only as good as their sources)

The upstream repo is [tmforum-oda/oda-canvas](https://github.com/tmforum-oda/oda-canvas). Clone it
shallowly into the scratchpad. On Windows, set `core.longpaths true` and `git reset --hard`, or
checkout fails. Then fact-check every claim against it. Record the commit you used, because each script
pins it. See `references/research.md` for:

- where the authoritative facts live (operator catalogue, chart values, portal routes, release notes),
- how to find every recorded video the docs link to,
- how to fetch YouTube transcripts, including behind TLS-intercepting antivirus,
- the traps found so far, such as operators that the docs mention but that don't exist in the repo.

When a figure comes from outside the repo (for example Open API download counts), search the web.
Then mark the figure **[VERIFY]** in the script and let the user confirm it. Don't silently carry an
old figure forward.

### Step 2: Write the script

Write `scripts/<deck-id>.md` using `references/script-template.md`. What matters most:

- **Narration is read verbatim by an AI voice.** Write neutral third-person, spoken-style sentences
  with no bullet fragments and no on-screen-only shorthand. Drop presenter-specific phrasing such as
  "I'll show you" or "at Vodafone we…".
- **One beat per slide**, about 10–30 seconds (25–75 words). Split long ideas across slides.
- Concept decks run about 6–9 minutes. Demo decks run about 5–12 minutes. If a source video is much
  longer, propose splitting it (the AI-Native video became two parts).
- Each slide gives the **Visual** with a treatment tag (`[3B1B]`, `[DEMO]` or `[STATIC]`), any
  **On-screen text**, the **Speaker notes** (as `>` quote lines) and, where useful, a source.
- Finish with a **Source check** table that maps each claim to a file at the pinned commit.

Get the user's confirmation on every `[VERIFY]` item. Then remove the markers and set `status:` in the
front-matter.

### Step 3: Extract the notes

```bash
python .claude/skills/oda-canvas-video-generator/scripts/extract_notes.py scripts/<deck-id>.md decks/<deck-id>.notes.json
```

This prints the word count and estimated seconds for each slide (about 2.5 words per second). Those
numbers set each clip's length and the timing of its build-up.

### Step 4: Build each slide: native PowerPoint or a Remotion clip

First decide the treatment of every slide with the table in `references/house-style.md` ("Native
PowerPoint or Remotion?"). Titles, agendas, cards, lists, simple builds and calls to action are
**native**: write a builder in `tools/native/<deck>.py` (see `tools/native/intro.py` and
`pptx_kit.py`). Slides whose motion explains something, and live demos, are **Remotion clips**. Don't
make a clip just because the tooling exists.

**Native slides.** Run `node videos/scripts/assets.mjs` for the stage backgrounds, icons and
component-symbol PNGs. Then draw with `Kit` in 1920×1080 px coordinates (`k.rect`, `k.text`,
`k.pill`, `k.image`, `k.line(..., elbow=True)`, `k.group`) and time entrances with
`k.anim(name, at, "fade"|"rise"|"wipe-up"|"wipe-down"|"zoom")`.

**Remotion clips:**

Load the `remotion-best-practices` skill first, and follow its markup rules: `interpolate` and
`useCurrentFrame` only, and no CSS transitions. Then read `references/remotion-scenes.md` for this
repo's conventions:

- **Reuse the shared theme and primitives** (`videos/src/theme.ts`, `videos/src/lib/ui.tsx`):
  `Stage`, `Heading`, `Appear`, `Tile`, `Gear` (the operator motif), `Draw`, `Code`, `Pill`,
  `Caption`, `BrowserFrame`, `Icon`, plus **`OdaComponent`** (`lib/OdaComponent.tsx`). That is the
  standard ODA Component symbol (hexagon, five segments, lollipops and sockets). Use it every time a
  component appears, never the old Lego `Brick`. Every deck should look like one
  family. When you add a motif, add it to `lib/ui.tsx`, not to one scene.
- **Keep the concept colours fixed.** The component symbol keeps its own five segment colours.
  Component-related accents are amber, Canvas blue, operator teal, API violet,
  identity coral, observability sky, secrets gold, events lime, AI pink, carbon green, cost orange,
  and agentic components white. `references/house-style.md` has the full palette and layout rules.
- **Time each build to the narration.** An element appears at roughly
  `(words before it in the notes) / 2.5` seconds. Set the composition length to the narration length
  plus 1–2 seconds.
- **Make the final frame complete.** The poster frame is the last frame. It is the review still,
  and it is what the `--renderer still` fallback shows. So the finished diagram has to stand on its
  own, even though the final video plays the whole clip.
- **Show the real thing.** Read `references/live-demos.md` first.
  - When a slide talks about **which components exist**, record the ODA Component Directory
    (tmforum.org) and drill into components such as TMFC001, 002, 005, 006, 007, 008, 043 and 023.
  - When it talks about **a part of the Canvas**, record the Canvas Portal (`demos/portal/`), and
    pair it with the matching **helm/kubectl** commands replayed from real output
    (`demos/cli/capture-cli.mjs` → `<Terminal>`).
  - Edit captures in Remotion with `CaptureClip` segments.
  - Only fall back to animating a static screenshot (`lib/PortalShot.tsx`) when no live environment
    is available, and say so in the script.

Register each *clip* slide as its own `<Composition>` inside a `<Folder>` for the deck in `Root.tsx`
(native slides have none). Then run `npx tsc --noEmit` from `videos/`.

### Step 5: Review the stills before rendering video

Rendering is cheap, but catching layout bugs from stills is cheaper:

```bash
cd videos && node scripts/stills.mjs <Prefix> 1          # final frames, half size → out/stills/
python ../.claude/skills/oda-canvas-video-generator/scripts/contact_sheet.py out/stills "<Prefix>-*@100.png"
```

Look at every contact sheet. Check for overlaps, text wrapping inside tiles or pills, anything
clipped at the frame edge, and too much empty space. Also render frames at 0.4 for the scenes with
the most motion. Fix the problems and look again. In this repo, the first pass has always turned up
a handful of overlaps. Start Studio from the `remotion-studio` launch config so the user can scrub
through scenes in the browser pane.

### Step 6: Render, add posters, assemble and verify

```bash
cd videos && node scripts/render-all.mjs <Prefix>          # run in background; ~15 s per clip
node scripts/stills.mjs --posters <Prefix>                 # full-res final frames → out/posters/
node scripts/assets.mjs                                   # PNG assets for native slides
cd .. && python tools/build_deck.py decks/<deck-id>.notes.json videos/out videos/out/posters <Prefix> decks/<deck-id>.pptx "<Deck title>" --native tools/native/<deck>.py --assets videos/out/assets
pwsh tools/animate_deck.ps1 decks/<deck-id>.pptx          # native entrances + auto-advance, applied by PowerPoint
PYTHONUTF8=1 python .agents/skills/pptx/scripts/office/validate.py decks/<deck-id>.pptx
python .claude/skills/oda-canvas-video-generator/scripts/check_deck.py decks/<deck-id>.pptx decks/<deck-id>.notes.json
pwsh .claude/skills/oda-canvas-video-generator/scripts/ppt_check.ps1 decks/<deck-id>.pptx -Slides "1,7"   # real PowerPoint
```

`ppt_check.ps1` should show `N:<effects>/3` for every slide: 1 effect for a clip slide, several for a
native slide, and the first effect always trigger 3 ("After Previous"), so the slide starts by itself.
It also exports sample PNGs, which are what the review page shows as stills. If PowerPoint has
the deck open, a `~$` lock file appears. It is gitignored.

### Step 7: Review, approve, narrate and render (presentation-generator)

Read `references/narration-and-video.md` first. Then:

1. Start the review page in the background:
   `uv run --native-tls presgen.py review "<abs path>/decks/<deck-id>.pptx"`, run from
   `D:\Dev\lesterthomas\presentation-generator`. It opens in the user's browser with a still, a
   silent PowerPoint render and the narration text for every slide.
2. The user switches slides from Draft to Approved on the page, or tells you in chat ("approve 1–4").
   In that case, record it with `presgen.py approve`. **Never approve a slide yourself.** Each
   approved slide is narrated and rendered straight away, with its animation timed to the real
   narration. The final video rebuilds once all are approved.
3. **Watch for change requests and act on them straight away.** Arm a Monitor on
   `scripts/watch_review.sh` and keep re-arming it while the review page runs. For each request:
   - fix the slide through the **Feedback loop**,
   - rebuild only what changed,
   - run `presgen.py refresh` (the open page updates itself),
   - post a `presgen.py reply` saying what changed.

   The slide then shows as "Updated: review again". The details are in the **Live fixes** section of
   `references/narration-and-video.md`.
4. Watch for slides flagged as timing **CLAMPED** (in the log or on the page), and retime them at
   source.
5. When the final video is built (`decks/<deck-id>/<deck-id>_video.mp4`), check sample frames. Then
   tell the user where it is, how long it runs, and any slides still in draft.

### Step 8: Close out

Update the deck's task list and status, and mention anything you couldn't verify. Commit only when
the user asks. Rendered clips (`videos/out/`) are gitignored. The `.pptx` is committed, and it is
large (about 55 MB for 26 slides).

## Feedback loop (continual improvement)

The user reviews decks and clips and gives feedback. Handle every item in four steps.

1. **Fix it where it was found.** Change the script, the scene, or both for the deck in question, and
   rebuild only what changed. For a scene change: re-render that composition, its poster, and the
   deck. For a notes change: re-run `extract_notes.py` and `build_deck.py`. Re-check stills for any
   visual change.
2. **Decide whether it generalises.** Ask whether the feedback would have applied to other decks too.
   - *Specific to this deck* (a fact on slide 9, the wording of one sentence, one diagram's content):
     fix it locally, with no skill change. Do check whether other decks repeat the same wrong fact.
   - *General* (pacing, tone, colour use, text size, how demos should look, how to fact-check, a
     recurring layout mistake, a tooling gotcha): fix it locally **and** turn it into a rule.
   - *Unsure*: fix it locally and propose the rule to the user in one sentence. Write it into the
     skill only once they agree.
3. **Write general rules where future runs will see them.**
   - Add a dated entry to `references/lessons.md`: the rule, *why* it matters, and the feedback that
     produced it. Put the reason first. A rule without its reason gets misapplied.
   - If the rule changes a step, edit that step in this file or the relevant reference
     (`house-style.md`, `remotion-scenes.md`, `script-template.md`, `research.md`). Then the guidance
     in those files stays current rather than being contradicted by a lesson.
   - If it changes shared visuals (palette, a primitive, a motif), change `videos/src/theme.ts` or
     `lib/ui.tsx`. Then say which other decks will change when they are re-rendered, and offer to
     re-render them.
4. **Log every item**, general or not, in `references/feedback-log.md` with the date, the deck and
   slide, the feedback as given, what you changed, and whether the skill changed and why. This log is
   the audit trail. Revisit it from time to time: a "local" fix that keeps recurring is a missing rule.

Shared visual assets (the component symbol, palette, motifs) affect every deck. When you create or
change one, show the user a comparison or reference sheet and **wait for approval** before rolling it
into decks.

Tell the user, briefly, what changed in the deck and what (if anything) changed in the skill.

## Reference files

- `references/lessons.md`: rules learned from feedback. **Read this first, every time.**
- `references/house-style.md`: visual language, palette, layout and text sizes, narration voice.
- `references/script-template.md`: the script file format, with an annotated example slide.
- `references/research.md`: upstream sources, finding videos, transcripts, known factual traps.
- `references/remotion-scenes.md`: project structure, primitives, timing, portal demos, Studio, pitfalls.
- `references/live-demos.md`: recording the Component Directory, the Canvas Portal and helm/kubectl, and editing them with `CaptureClip` and `Terminal`.
- `references/deck-assembly.md`: `build_deck.py`, the auto-play XML, posters, verification.
- `references/narration-and-video.md`: presentation-generator, covering slide-by-slide review and approval, narration, PowerPoint rendering and the final video.
- `references/feedback-log.md`: the log of every feedback item and its outcome.
