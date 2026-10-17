# Lessons learned

These rules come from building the decks and from the user's feedback. They override older guidance
elsewhere in the skill. Each entry gives the rule, **why** it matters, and where it came from. Add
new entries at the top. When a lesson is folded into the main guidance, keep the entry and note where
it now lives.

---

### 2026-10-17: Narrate on approval, and time the animation to the real voice
**Rule:** Approving a slide (the Approved/Draft toggle) narrates and renders it straight away. Each
clip's animation is aligned to its real narration: it starts with the voice, and is stretched by
voice length ÷ planned length (words ÷ 2.5), clamped at ×1.25. Retime any clamped slide at source.
**Why:** The user wants to hear each slide as soon as they sign it off, not after a batch run. The
real voice is about 5–10% slower than the 2.5 words per second the builds were planned at, so
unaligned builds ran ahead of the words, and clip slides started a second before the narration.
**Source:** User: "As soon as I approve a slide, I want the presentation-generator to generate the
audio and final video for that slide. For each slide, I want the Approved/Draft to be a toggle…" and
"When the presentation-generator has generated the audio, re-check the timing of the slides animation
to make sure the timing and the length of audio aligns." Folded into SKILL.md Step 7 and
`narration-and-video.md` (Timing).

### 2026-10-17: Title and section-opening slides fade their titles in together
**Rule:** On the title card and the first slide of every segment, fade the kicker, title and any
subtitle in together at the start (`opening=True` / `<Heading opening />`). Keep rise-ins for content
that builds with the narration.
**Why:** Elements rising from the bottom one after another felt distracting on an opening frame,
which should settle at once and set the scene. Movement earns its place when it tracks the narration.
**Source:** Review-page feedback on deck 01 slide 1: "I think it is too distracting for everything to
appear from the bottom. For this introductory frame have the Titles fade-in together at the start."
The user agreed to make it a rule. Folded into house-style.md (Motion). Applied to deck 01 slides 1,
4, 7, 13, 15 and 26.

### 2026-10-17: Act on review-page change requests straight away
**Rule:** While a review page is open, keep a Monitor on `scripts/watch_review.sh`. Fix each change
request as it arrives: feedback loop, minimal rebuild, `presgen.py refresh`, then a `presgen.py reply`
on the page.
**Why:** The user wants requested changes made at once, not when they next remember to mention them
in chat. The reply and the "Updated: review again" status close the loop on the page itself.
**Source:** User: "When I request changes, how are those changes made. Ideally I'd like the changes
to be actioned straight away." Chose the in-session watch over a headless Claude run, so that every
change stays visible and steerable. Folded into SKILL.md Step 7 and `narration-and-video.md`.

### 2026-10-17: The user approves every slide before it is narrated
**Rule:** Run presentation-generator's review page. The user approves slides one by one, there or in
chat, and only approved slides are narrated and rendered. Never approve on the user's behalf. Treat
review-page comments as feedback, through the feedback loop.
**Why:** The cloned voice costs 1.5–2.5 minutes per slide, and the user wants to sign off each slide
before it goes into a video. Approvals carry a fingerprint, so a slide changed after sign-off can't
slip into the video unseen.
**Source:** User request for deck 01: "I want to be able to review the presentation and approve
slides on a slide-by-slide basis and then have the presentation-generator generate the videos."
Folded into SKILL.md Step 7 and `narration-and-video.md`.

### 2026-10-17: Use native PowerPoint unless motion carries meaning
**Rule:** Decide each slide's treatment. Titles, agendas, cards, lists, simple builds and calls to
action are native PowerPoint slides with timed entrance animations. Remotion is for transformations,
flows, timed data, the animated component symbol, and live demos.
**Why:** The user asked to stop making a video for every slide. Native slides are editable, crisp,
smaller (deck 01 went from 64 MB to 51 MB with 10 slides native) and keep clickable links. Remotion is
worth its cost only where the animation explains something.
**Source:** User feedback on deck 01: "Consider whether for some slides it is simpler to just use the
powerpoint features and animations. Use remotion if it makes sense, but not necessarily
everywhere." Folded into house-style.md, script-template.md and SKILL.md Step 4.

### 2026-10-17: Show the real Component Directory, Canvas Portal and CLI, not mock-ups
**Rule:** When narration covers which components exist, show a recording of the TM Forum ODA
Component Directory and drill into real components. When it covers part of the Canvas, show a
recording of the Canvas Portal **and** the equivalent helm/kubectl commands with their real output.
**Why:** The user wants viewers to see the actual tools they will use. Real recordings and real
command output are also self-verifying: they can't drift from the product the way a diagram can.
**Source:** User request (2026-10-17) with the directory URL, the components to drill into, and
the local portal. Process in `live-demos.md`; first applied to deck 01 (new slide 16, and slides 18,
20 and 21).

### 2026-10-17: Never fake terminal output; label stand-ins honestly
**Rule:** Terminal clips replay real output captured from the cluster. If the on-screen action
(e.g. deploying `r2`) can't be completed, show the real state of an equivalent release and label it
("release r1 · same chart, deployed earlier").
**Why:** These are training videos. A viewer who runs the same command must see the same thing.
**Source:** Deck 01 slide 21. The portal rejected a duplicate release name, and a real install of the
published chart would fail on missing images.

### 2026-10-17: Check the demo environment's health before recording
**Rule:** Before any Portal or CLI capture, check that `kubectl get components -A` is all `Complete`,
that no pods are in `ImagePullBackOff`, and that the dashboard shows components ready. Fix it, or ask
the user, before recording.
**Why:** The first look at the demo cluster showed the product catalog stuck "In Deployment". The
published `productcatalog-1.4.5` chart references images that don't exist. Recording that would
teach viewers a broken state.
**Source:** Deck 01 live-demo work. The user chose to reinstall from the upstream test chart.

### 2026-10-17: Public tmforum.org pages need a visible browser window
**Rule:** Record tmforum.org with Playwright in a visible Chrome window (`headless: false, channel:
"chrome"`). Never attempt to bypass a bot check.
**Why:** Cloudflare blocks headless Chromium, while a normal visible window loads fine. The built-in
browser pane can't capture at 1920×1080, because it renders at the pane's own width.
**Source:** Deck 01 Component Directory capture.

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

### 2026-10-16: Make every final frame complete (updated 2026-10-17)
**Rule:** Make every clip's final frame a complete, self-explanatory version of the slide, and use it
as the poster frame (`stills.mjs --posters`).
**Why:** presentation-generator first narrated over a still of each slide. Since 2026-10-17 it has
PowerPoint render the slides, so clips and animations play. The final frame is still the review-page
still and the `--renderer still` fallback, so a half-built or blank last frame still shows up.
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
