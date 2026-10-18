# Script file format: `scripts/<deck-id>.md`

The script is the source of truth for a deck. `scripts/extract_notes.py` reads it by structure:
`### Slide N: Title` headings, with notes in `> ` lines. Keep that shape exact. Everything else is
for people.

Good examples to copy: `scripts/01-introduction-to-the-oda-canvas.md` (concept deck),
`scripts/03-authentication-and-authorization.md` (concept plus live demo).

````markdown
---
deck-id: 02-how-do-i-buy-or-build-an-oda-canvas
replaces: https://youtu.be/<id>  (original title, m:ss)        # omit for brand-new topics
linked-from: oda-canvas <file>:<line>                           # where upstream docs embed it
original-transcript: presentations/transcripts/<file>.md
oda-canvas-commit: <full sha>  (chart x.y.z, component spec v1)
target-length: ~5–6 min
status: draft script | facts confirmed YYYY-MM-DD; deck at decks/<deck-id>.pptx
---

# <Title>: updated script

One paragraph on why it is being remade, and a short **Main changes from the original:** list.
Note demo-environment needs if there are [DEMO] slides.

---

## Segment name            ← optional grouping; extract_notes ignores it

### Slide 1: Title (presenter introduction)
- **Visual:** [NATIVE for now, then CLIP <Prefix>-01-Presenter] A title-card placeholder. The presenter
  records a head-and-shoulders introduction to camera, reading these notes. The recording later
  replaces the placeholder, with overlays and its own sound (narration-and-video.md, "Presenter videos").
- **Speaker notes:**
> About 110–130 words, written for the presenter to say on camera (first person plural is fine here).
> Welcome viewers to this part of the series. Say what is different or new about the topic,
> compared with traditional applications or the old way. Then say what the video covers.
> Same voice rules as every slide: short sentences, no colons or semicolons, and "or another …
> platform" whenever a product is named.

### Slide 2: <Working title>
- **Visual:** [3B1B] What builds up, in narration order, using house motifs (the ODA Component symbol, plate, gear…).
  Name the source diagram if one is being redrawn (for example, deck slide 9 or an upstream PNG).
- **On-screen text:** "<only short terms that reinforce the narration>"
- **Speaker notes:**
> Spoken sentences only. Roughly 25–75 words (10–30 s). Each sentence that introduces a new element
> lines up with the moment that element appears.

### Slide 3: Live demo: <what is shown>
- **Visual:** [DEMO] Portal → Section → Page: the clicks, typing and highlights, in order.
  Fallback: [STATIC] `images/Canvas N.png` animated as a walkthrough.
- **Speaker notes:**
> Describe what the viewer sees, in the present tense.

---

## Source check

| Claim | Source in oda-canvas @ <short sha> |
|---|---|
| Six API operators | `source/operators/TMFOP002-API-Management/README.md` |
````

## Rules of thumb

- For more than one paragraph of narration, put a bare `>` line between them. `extract_notes.py` keeps the break.

- Speaker notes have no colons or semicolons and no sentence over about 17 words (house-style.md).

- When you name an example product, add "or another … platform" in the narration and on screen
  (see house-style.md, "Naming products").

- **Treatment tags:** `[NATIVE]` for a native PowerPoint slide (titles, agendas, cards, lists,
  simple builds, links), `[3B1B]` for a Remotion explainer where the motion carries meaning, and
  `[DEMO]` for a live recording of the Component Directory, Canvas Portal or a terminal replay.
  Decide per slide with the table in `house-style.md` ("Native PowerPoint or Remotion?").
- **`[VERIFY]` markers** go next to the claim, as `**[VERIFY]**`. They must all be resolved with the
  user before the deck is built. Afterwards, update the header paragraph to say the facts were
  confirmed, and on what date.
- **Shape:** title, then why or who, the main beats, a recap or status, and a closing slide that
  links to `github.com/tmforum-oda/oda-canvas` and the relevant doc or use case.
- **Pin the commit** in the front-matter. A deck is "outdated" once upstream moves past the facts in
  its source-check table.
