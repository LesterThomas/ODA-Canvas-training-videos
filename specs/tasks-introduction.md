# Tasks: "Introduction to the ODA Canvas" (Video 1)

Actionable task list to take [spec-introduction.md](/d:/Dev/lesterthomas/ODA-Canvas-training-videos/specs/spec-introduction.md)
from spec to a finished `decks/introduction-to-the-oda-canvas.pptx`, ready to hand off to
`presentation-generator`. Organized in phases; later phases depend on earlier ones unless noted.

## Phase 0 — Resolve Open Questions (blocking)

These decisions shape the script and shot list, so resolve before heavy production work starts
(spec §10).

- [ ] Decide whether to refresh the stats/claims in §3 item 3 (Open API downloads/developers,
      operator counts, the "10x efficiency" claim) — get updated figures, or confirm reuse as-is.
- [ ] Confirm demo environment readiness: is a seeded `canvas-portal-v2` instance available to
      capture against, or does one need to be stood up first (spec §7, `spec.md` §11)?
- [ ] Decide the runtime/structure trade-off: one ~6–8 minute video covering all 6 segments, or a
      deliberate two-part split (spec §9, §10).
- [ ] Confirm narration stays single-voice throughout this first video (spec §10).

## Phase 1 — Research & Fact-Check

Depends on: Phase 0 (stats decision). Feeds: Phase 2 (script).

- [ ] Verify current Open API adoption figures (downloads / developer count) cited in the original
      transcript's History section (spec §3 item 3).
- [ ] Verify the current list of API Gateway operators (original: 6 — Apache APISIX, Kong, Istio
      service mesh, Google, Microsoft, Well Cloud) against `source/operators/README.md` and pptx
      slides 26/31–33, which also mention WhaleCloud APIG (spec §3 item 4).
- [ ] Verify the current list of Identity Config operators (original: Keycloak, Microsoft Entra ID)
      against `source/operators/README.md` and pptx slide 36 (spec §3 item 4).
- [ ] Verify the current list of Observability operators (original: Prometheus/Grafana/Kiali,
      Google, Microsoft, Datadog) against `source/operators/README.md` and pptx slides 16–19, 34
      (spec §3 item 4).
- [ ] Decide final wording for the "10x efficiency and agility improvement" claim — retain, soften,
      or update, per the Phase 0 decision.
- [ ] Re-read `AI-Native-Canvas-design.md` and pptx slide 3 ("Composable AI with 'Agentic ODA'") to
      confirm the AI-Native content (Agentic Components, AI & Data Foundations, ModelGateway, TMF
      AI Agents) is accurately summarized before scripting Segment 10 (spec §3 item 1, §6).

## Phase 2 — Narration Script (Speaker Notes)

Depends on: Phase 1. Feeds: Phase 6 (deck assembly — notes get pasted into the `.pptx`).

Draft in `scripts/introduction-to-the-oda-canvas.md`, one section per slide, written as clean
spoken-style narration (`spec.md` §5.3) in neutral third-person voice, not the original's
first-person presenter style (spec §3 item 5). Record the `oda-canvas` commit/version this script
is based on in the file's front-matter (`spec.md` §11).

- [ ] Draft speaker notes for Segment 1 — Intro (slides 1–3: title, audiences, roadmap).
- [ ] Draft speaker notes for Segment 2 — History (slides 4–6: TM Forum frameworks, Open API
      initiative, the remaining deploy/manage gap).
- [ ] Draft speaker notes for Segment 3 — Components and Canvas (slides 7–12: what is a Component,
      what is the Canvas, Composable IT, Composable AI/Agentic ODA, identity example, secrets
      example).
- [ ] Draft speaker notes for Segment 4 — Benefits (slides 13–14: benefit pillars, efficiency
      claim).
- [ ] Draft speaker notes for Segment 5 — Canvas modules (slides 15–24: golden rules, YAML
      definition, modular operators overview, API Exposure worked example, both live-demo slides,
      identity/observability recaps, the three horizons, measuring adoption).
- [ ] Draft speaker notes for Segment 6 — Conclusion (slides 25–26: collaboration/manifesto, teaser
      + call to engage).
- [ ] Read the full draft aloud end-to-end; check total runtime against the Phase 0 target and trim
      or split per spec §9 if it overruns.
- [ ] Review every slide's notes text for clean spoken-style sentences (no bullet fragments,
      abbreviations, or on-screen-only shorthand) per `spec.md` §5.3.

## Phase 3 — Shared Visual Assets & Theme

Can start in parallel with Phase 1–2. Feeds: Phase 4.

- [ ] Scaffold the Remotion project (`videos/`) per the `remotion-create` skill, if not already
      done.
- [ ] Define the shared theme (`videos/src/theme.ts`): consistent colour/icon per concept —
      Component, Operator, API Gateway, Identity, Observability, Secrets, Cost, Carbon, AI — used
      identically across every segment (spec §8).
- [ ] Keep the theme's palette compatible with the real Portal screenshots' colours (TM Forum
      pink/magenta mark, dark sidebar, white content panels) so animated and live-demo segments
      feel like one product (spec §8).
- [ ] Build the reusable "Lego block" component motif (pptx slides 1, 21) as a Remotion component.
- [ ] Build the reusable capability-map diagram component (pptx slide 2) as a Remotion component,
      designed so it can morph/evolve into the AI-native version (slide 3) for Segment 10.

## Phase 4 — Build 3B1B Remotion Video Clips

Depends on: Phase 2 (for on-screen text/terms) and Phase 3 (shared assets). Each row is one
slide's source video, per the shot list in spec §6. Output to `videos/out/`.

| # | Segment | Slide | Done |
|---|---|---|---|
| 1 | Intro | Title card: "Introduction to the ODA Canvas" | [ ] |
| 2 | Intro | Who this is for (two audiences) | [ ] |
| 3 | Intro | Roadmap of this video | [ ] |
| 4 | History | TM Forum frameworks → inconsistency problem | [ ] |
| 5 | History | The Open API initiative (2013/2017) and its adoption | [ ] |
| 6 | History | The remaining gap: deploying & managing IT is still hard | [ ] |
| 7 | Components & Canvas | What is an ODA Component? | [ ] |
| 8 | Components & Canvas | What is the ODA Canvas? | [ ] |
| 9 | Components & Canvas | Composable IT with ODA (capability map) | [ ] |
| 10 | Components & Canvas | Composable AI with "Agentic ODA" | [ ] |
| 11 | Components & Canvas | Example: Identity management | [ ] |
| 12 | Components & Canvas | Example: Secrets vault | [ ] |
| 13 | Benefits | ODA Canvas — Benefits (6 pillars) | [ ] |
| 14 | Benefits | The "order of magnitude" efficiency claim | [ ] |
| 15 | Canvas modules | Golden Rules / component standard in two layers | [ ] |
| 16 | Canvas modules | ODA Component YAML definition | [ ] |
| 17 | Canvas modules | Canvas as a set of modular software operators | [ ] |
| 18 | Canvas modules | Worked example: API Exposure operator pattern | [ ] |
| 21 | Canvas modules | Identity Config Management (pattern recap) | [ ] |
| 22 | Canvas modules | Observability Config Management (pattern recap) | [ ] |
| 23 | Canvas modules | The three horizons | [ ] |
| 24 | Canvas modules | How do you measure Canvas adoption? | [ ] |
| 25 | Conclusion | Collaboration, the ODA Manifesto | [ ] |
| 26 | Conclusion | Teaser — series roadmap + call to engage | [ ] |

(Slides 19–20 are the live-demo inserts — tracked separately in Phase 5.)

- [ ] Preview each clip in Remotion Studio against its slide's speaker notes for timing/pacing fit.
- [ ] Render all clips via the `remotion-render` skill into `videos/out/`.

## Phase 5 — Live Demo Capture (Segments 19–20)

Depends on: Phase 0 (demo environment decision). Can run in parallel with Phase 4.

- [ ] Stand up / confirm a seeded `canvas-portal-v2` instance with an example component catalog
      matching (or equivalent to) `Canvas 2.png` (spec §7).
- [ ] Write the Playwright script in `demos/introduction-to-the-oda-canvas/` to capture: Components
      → Inventory browse (matching `Canvas 2.png`) → Deploy → Install Helm Chart form fill
      (matching `Canvas 3.png`), stopping before/at the install action.
- [ ] Capture silent footage; trim dead time; keep each beat to ~15–30s (spec §7).
- [ ] **Fallback (if live capture slips)**: prepare `images/Canvas 2.png` and `Canvas 3.png` as
      static slide visuals for slides 19–20 instead, to avoid blocking the rest of the deck (spec
      §7).
- [ ] Optional: capture or prepare `Canvas 7.png` (Operators) as a supporting still/cutaway for
      slide 17.

## Phase 6 — Deck Assembly

Depends on: Phase 2 (notes), Phase 4 (clips), Phase 5 (demo clips/fallback stills).

- [ ] Build `decks/introduction-to-the-oda-canvas.pptx` with one slide per row in the Phase 4 table
      plus slides 19–20, using `python-pptx` / the `pptx` skill (`spec.md` §6–§7).
- [ ] Embed each slide's source video (or static fallback image) as its visual.
- [ ] Set each slide's speaker notes text from the Phase 2 script, verbatim.
- [ ] Confirm the title slide and closing/CTA slide (linking back to the
      [oda-canvas repo](https://github.com/tmforum-oda/oda-canvas)) are present (`spec.md` §5.4).

## Phase 7 — Review & Hand-off

Depends on: Phase 6.

- [ ] Read the notes aloud against each slide's visual; confirm timing feels right and nothing was
      mis-paired (`spec.md` §8 step 5).
- [ ] Confirm every slide's notes text is clean, spoken-style narration with no leftover
      fragments/shorthand.
- [ ] Confirm every embedded clip/image is the correct, final asset (no placeholders left over from
      Phase 5's fallback path, unless intentionally kept).
- [ ] Update the deck's status in the catalog (`spec.md` §4) to reflect drafted / assembled /
      handed off.
- [ ] Hand off `decks/introduction-to-the-oda-canvas.pptx` to `presentation-generator` for voice
      narration and final `.mp4` rendering.
