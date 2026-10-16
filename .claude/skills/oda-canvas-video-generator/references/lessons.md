# Lessons learned

These rules come from building the decks and from the user's feedback. They override older guidance
elsewhere in the skill. Each entry gives the rule, **why** it matters, and where it came from. Add
new entries at the top. When a lesson is folded into the main guidance, keep the entry and note where
it now lives.

---

### 2026-10-17: The ODA Component symbol is the standard, not the Lego block
**Rule:** Show ODA Components with the official hexagon symbol (`OdaComponent`, or
`images/ODA-Component.svg` outside Remotion), in every deck. Use the white `mono` version for agentic
components. Use `crop` at small inline sizes. Tie narration to its segments, for example highlighting
Security when roles or secrets are discussed.
**Why:** The user wants the recognisable TM Forum symbol across the series, not a generic metaphor.
The segments also carry meaning the Lego block didn't have, so the animation can point at the part of
the component being discussed.
**Source:** User feedback on deck 01: "use this image as a standard (and not the Lego block) when
talking about ODA Components". Folded into `house-style.md` (the ODA Component symbol section),
SKILL.md Step 4 and `remotion-scenes.md`.

### 2026-10-17: Check traced artwork against the original at high zoom before showing it
**Rule:** When recreating a TM Forum graphic, render a side-by-side close-up (original vs. trace, at
2× or more) of the fine details, and check what each glyph actually *is* before guessing.
**Why:** The first trace misread the centre of the component symbol as a person. It is actually a
lollipop and a socket crossed (exposed and dependent APIs), below a data disc. At normal size the
error was easy to miss, but the user spotted it at once.
**Source:** User correction: "It is not an icon of a man; instead it is just the exposed-api and
dependent-api icons overlapped."

### 2026-10-16: Assume presentation-generator shows each slide as a still
**Rule:** Make every clip's final frame a complete, self-explanatory version of the slide, and use it
as the poster frame (`stills.mjs --posters`).
**Why:** `presentation-generator` currently exports slides as PNGs through PowerPoint and narrates
over the still. It does not play the embedded video yet. A clip whose last frame is half-built, or
blank, gives a broken video today.
**Source:** Found while building deck 01 (reading `presentation-generator/extract_slides.py`).
Folded into SKILL.md Step 4 and `deck-assembly.md`.

### 2026-10-16: Review contact sheets before rendering video
**Rule:** Render half-size final-frame stills for every scene, review them as 2×2 contact sheets, and
fix layout problems before running the full video render.
**Why:** The first pass of deck 01 had overlaps or wrapping on about a third of the slides: pills
running off the frame, plate labels too big, tiles too narrow for their labels, a screenshot cutaway
covering the heading. Stills take about a minute for 26 scenes, while a full render takes about 8.
**Source:** Deck 01 build. Folded into SKILL.md Step 5.

### 2026-10-16: Confirm external figures and claims with the user
**Rule:** Mark any number or claim the upstream repo can't confirm (adoption stats, "10x"-style
claims, partner names) as **[VERIFY]**, and let the user sign it off before narration.
**Why:** The narration is spoken with authority by an AI voice and published under TM Forum's name.
The original intro video carried a stale "900,000 downloads" figure.
**Source:** User confirmed the deck 01 VERIFY items ("all the VERIFY checks are good").

### 2026-10-16: Don't claim operators that aren't in the repo
**Rule:** Name an operator or integration as available only if it exists in
`source/operators/` or `charts/` at the pinned commit. Label anything else "planned",
"experimental", "prototype" or "proposal", as the upstream README does.
**Why:** The original videos and the deck listed Google and Microsoft "managed observability
operators" and a Datadog operator. None exist. Observability is configured by the API operator's
`openMetricsImplementation` setting.
**Source:** Research for the video update plan. Detail in `research.md`.
