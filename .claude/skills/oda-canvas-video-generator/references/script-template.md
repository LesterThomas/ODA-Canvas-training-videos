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

### Slide 1: Title
- **Visual:** [STATIC] "<Title>"
- **Speaker notes:**
> Welcome sentence. Say what the video covers.

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

- **Treatment tags:** `[3B1B]` for an animated explainer, `[DEMO]` for the portal or CLI, `[STATIC]`
  for a title card. Most decks mix them: concept slides first, then a short demo.
- **`[VERIFY]` markers** go next to the claim, as `**[VERIFY]**`. They must all be resolved with the
  user before the deck is built. Afterwards, update the header paragraph to say the facts were
  confirmed, and on what date.
- **Shape:** title, then why or who, the main beats, a recap or status, and a closing slide that
  links to `github.com/tmforum-oda/oda-canvas` and the relevant doc or use case.
- **Pin the commit** in the front-matter. A deck is "outdated" once upstream moves past the facts in
  its source-check table.
