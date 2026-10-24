# Lessons learned

These rules come from building the decks and from the user's feedback. They override older guidance
elsewhere in the skill. Each entry gives the rule, **why** it matters, and where it came from. Add
new entries at the top. When a lesson is folded into the main guidance, keep the entry and note where
it now lives.

---

### 2026-10-23: Show metrics APIs as `apiType: openmetrics`
**Rule:** In any example YAML, diagram label or narration, give a component's metrics API `apiType: openmetrics`.
Use only `openmetrics` throughout a video: don't mention that `prometheus` is also accepted.
**Why:** The Component and ExposedAPI CRDs accept both `openmetrics` and `prometheus`, but TM Forum wants
people to use the open standard. Viewers copy what the training videos show.
**Source:** Deck 05 slide 6 review: "Show the apiType as openmetrics (the Canvas CRD allows openmetrics or
prometheus, but we prefer people to use openmetrics)." Then, on the same slide: "Remove the sentence 'The
Canvas also accepts prometheus, but openmetrics is preferred.' Throughout the video we should only use the
openmetrics apiType". Deck 04 slide 4 (published) still shows
`apiType: prometheus   # OpenMetrics`, so fix it at the next re-cut.

### 2026-10-19: One overview page for every deck; publish finished videos to YouTube with chapters and captions
**Rule:** Keep `presgen.py hub decks/` available as the way into every deck. It shows each deck's status,
final video and YouTube link, and starts or opens its review page. Publish a finished deck with
`youtube_package.py` (description with chapters from the slide titles, captions from the speaker notes
timed to the voice) and an upload through Claude in Chrome, unlisted first. Details are in `publishing.md`.
**Why:** With four decks and more coming, the user needs one place to see them all and jump into any
review. The speaker notes are already the exact narration, so they make accurate captions, and the slide
titles make natural chapters. Both help viewers navigate a 10 to 15 minute video.
**Source:** User, 2026-10-19: "There are now 4 separate videos. In the future there may be more. Create
an overview page to show all the available videos with links so that I can go in and review any one of
them. I also want to be able to publish these videos on YouTube when they are complete… initially as an
unlisted video. Include a description, upload the speaker notes so that YouTube can use captions and split
the video as chapters. This should be part of the skill." Folded into SKILL.md Step 8 and `publishing.md`.

### 2026-10-18: Check every take with speech-to-text, and learn from the failures
**Rule:** csm-voice transcribes every take with Whisper and only keeps takes that say the whole sentence.
A sentence that still fails after its retries becomes a "narration check" change request on the review
page. Reword it, rebuild and reply. Every checked sentence is logged to `tts-log.jsonl`. Summarise it
with `tts_report.py` and turn clear patterns into narration rules.
**Why:** takes were chosen by length alone, so a take that dropped "is a prototype" but ran about the
right length could win, and the user had to hear the gap to catch it. The first test also found a cause:
"model-as-a-service" counted as one word, which set the token limit too short, so the voice cut the
sentence off. Words are now counted as spoken. The log builds the evidence for what the voice says well.
**Source:** User, deck 02 review, 2026-10-18: "is it possible to use a speech-to-text model to
automatically validate the text-to-speech is working correctly. If something repeatedly fails to
generate, you should reword the speaker notes and keep a record to build data for what succeeds and what
fails." Then "Do this". Folded into SKILL.md Step 7 and narration-and-video.md ("Narration check").

### 2026-10-18: Spell out version numbers in speaker notes
**Rule:** In narration, write version numbers the way they should be spoken ("Apache two dot O", not
"Apache 2.0"). Keep the written form on screen. `extract_notes.py` flags any digits with dots in the
notes.
**Why:** The cloned voice reads text verbatim, and dotted numbers come out wrong or ambiguous
("two point zero", "two zero"). Spelling them out fixes the pronunciation at source.
**Source:** Deck 02 slide 3 review, 2026-10-18: "For Apache 2.0, spell this out in the speaker notes as
'Apache two dot O'". The user then asked for it as a rule, with the `extract_notes.py` check. Folded
into house-style.md (Narration voice) and script-template.md.

### 2026-10-18: Every deck opens with the presenter on camera
**Rule:** Slide 1 of every new deck is a placeholder for the user's own head-and-shoulders video to
camera. Draft its speaker notes as the spoken introduction, about 110–130 words: what is different
or new about the topic (compared with traditional applications or the old way), then what the video
covers. Make the slide a simple native title card until the recording exists. Then turn it into a
presenter clip (overlays, plus the video's own EQ-matched sound), following "Presenter videos" in
`narration-and-video.md`.
**Why:** The user records the introduction themselves for each video, so the series opens with a real
person. The notes are their script, and about 110–130 words is roughly 45–55 seconds on camera, the
length of deck 01's recorded introduction.
**Source:** Deck 03 review, 2026-10-18: "The presentations will typically start with me recording a
head and shoulders video to camera. When you are drafting the slides, the first slide should be a
placeholder with the speaker notes of about 110-130 words to allow me to record the intro video
scene." Folded into SKILL.md Step 2, `script-template.md` and `extract_notes.py`.

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

### 2026-10-17: Write narration for the voice: short sentences, no colons or semicolons
**Rule:** Speaker notes use only full stops, question marks and commas to break up sentences, never
colons or semicolons. Keep each sentence to about 17 words. `extract_notes.py` flags both problems.
**Why:** csm-voice generates one sentence at a time and handles colons, semicolons and long sentences
badly, cutting words or reading them with odd pauses.
**Source:** Deck 01 review: "The speaker notes should not use colons or semi-colons. The csm voice
doesn't handle them well. Just replace with a period." Earlier: the request to split long sentences on
slides 1-5.

### 2026-10-17: Name example products only with "or another … platform"
**Rule:** Whenever a slide names an example implementation, the narration and the visual must also
say that another platform can be used. Make the point once, plainly, where it matters: the Canvas
mandates no product, and provides standard integration patterns built on open standards.
**Why:** Naming only Keycloak or Entra ID implies the Canvas requires them. It doesn't, and
portability and interoperability through open standards are the point of the Canvas.
**Source:** Deck 01 slide 11 review: "When we use examples like Keycloak or Microsoft Entra ID, we
should always say (and show) or other Identity Management Platform. The Canvas does not mandate
specific implementations, but provides standard integration patterns, adopting open standards to
enable interoperability and portability." Applied to slides 11, 12, 19, 22 and 23; folded into
house-style.md and script-template.md.

### 2026-10-17: Show the Canvas with the ODA Canvas picture
**Rule:** Wherever the ODA Canvas appears, use the ODA Canvas picture (`images/ODA-Canvas-dark.svg`),
never a plain blue plate or bar. Light up its modules to point at the services the narration names.
**Why:** The user supplied the picture as the visual for the Canvas, and asked for it on slide 1 and
again on slide 8 ("Use the new Canvas picture (like on slide 1)").
**Source:** Deck 01 review, 2026-10-17. Folded into house-style.md.

### 2026-10-17: Every slide title fades in at the start (widened from opening slides)
**Rule:** On every slide, the kicker, title and any subtitle fade in together at the start, with no
rise or slide. `k.heading` and `<Heading>` do this by default. Keep rise-ins for content that builds
with the narration.
**Why:** Titles rising from the bottom felt distracting. A title should be there as the slide
starts, so the viewer knows what it's about. Movement earns its place when it tracks the narration.
**Source:** Review-page feedback on deck 01 slide 1: "I think it is too distracting for everything to
appear from the bottom. For this introductory frame have the Titles fade-in together at the start."
The user agreed to make it a rule for opening slides. On slide 2 they then widened it: "All titles
should fade in at the start of the slide." Folded into house-style.md (Motion) and both heading
helpers. Applied to every slide of deck 01.

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
