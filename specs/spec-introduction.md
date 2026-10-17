# Spec: "Introduction to the ODA Canvas" (Video 1)

This spec covers the **first deck** to be produced under the pipeline defined in
[spec.md](/d:/Dev/lesterthomas/ODA-Canvas-training-videos/specs/spec.md): `decks/introduction-to-the-oda-canvas.pptx`.
It is the Group A (concept explainer) deck that kicks off the whole series.

## 1. Goal

Replace the existing intro video with an updated deck that keeps its proven narrative arc but:

- redraws every diagram as an animated, build-up-piece-by-piece 3Blue1Brown-style Remotion video
  instead of static slide graphics,
- refreshes the content for what has changed since the original recording (notably: the AI-Native
  / "Agentic ODA" canvas, and the existence of a working `canvas-portal-v2`), and
- adds at least one short **live demo** insert of the real Canvas Portal, so the video is not
  100% animated explainer — giving viewers a first glimpse of the tooling before later videos go
  deep on each module.

## 2. Source Material

| Source | Role |
|---|---|
| [Introduction to the ODA Canvas original script.md](/d:/Dev/lesterthomas/ODA-Canvas-training-videos/presentations/Introduction%20to%20the%20ODA%20Canvas%20original%20script.md) | Transcript of the existing video being replaced ([youtu.be/B5lF94l-Dek](https://youtu.be/B5lF94l-Dek)). Primary source for narrative structure and narration content — reused and updated, not written from scratch. |
| [About ODA Canvas.pptx](/d:/Dev/lesterthomas/ODA-Canvas-training-videos/presentations/About%20ODA%20Canvas.pptx) | Existing 38-slide deck. Slides 1–21 closely track the original transcript's structure and are the primary source for which diagrams to redraw. Slides 22+ are reference/backup material for *other*, later videos (Canvas Installation, Canvas Portal deep-dive, per-operator deep dives) — out of scope for this video except as optional cutaways. |
| `oda-canvas` repo docs (`Canvas-design.md`, `AI-Native-Canvas-design.md`, `README.md`, `usecase-library/`) | Fact-check and refresh content that has evolved since the original recording. |
| `canvas-portal-v2` | Target app for the live demo insert(s). |
| [images/Canvas 1.png](/d:/Dev/lesterthomas/ODA-Canvas-training-videos/images/Canvas%201.png) – [Canvas 7.png](/d:/Dev/lesterthomas/ODA-Canvas-training-videos/images/Canvas%207.png) | Existing screenshots of the real, running `canvas-portal-v2` UI — proof the Portal referenced in §3.2/§7 already exists and is not just a mockup. See §7 for the full shot-by-shot mapping; `Canvas 2` (Components → Inventory) and `Canvas 3` (Components → Deploy → Install Helm Chart) are the two confirmed for this deck. |

## 3. What Changes vs. the Original Video

The original transcript is still structurally sound and should be followed closely for narration
content and pacing. The following updates are needed:

1. **Add "Agentic ODA" / AI-Native Canvas content.** The original video predates this; the current
   pptx deck already has a dedicated slide (slide 3, "Composable AI with 'Agentic ODA'") mirroring
   slide 2 but showing the AI-native evolution (Agentic Components, AI & Data Foundations,
   ModelGateway, TMFAIAgents). Fold this in as a natural extension of the "Composable IT with ODA"
   beat, not a bolted-on afterthought — the original narration already mentions AI/cost/carbon
   management as "emerging services," so this is an update of that section, not a new one.
2. **Insert a real Canvas Portal glimpse.** The original video has no live software demo at all —
   the Portal didn't exist yet. It now does (`canvas-portal-v2`), and reference screenshots already
   exist locally in [images/](/d:/Dev/lesterthomas/ODA-Canvas-training-videos/images) (`Canvas
   1.png`–`Canvas 7.png`). Add a short Playwright-captured live clip (or, as a fallback, the static
   screenshots themselves) featuring at minimum **Canvas 2** (Components → Inventory — the
   component catalog) and **Canvas 3** (Components → Deploy → Install Helm Chart), so viewers see a
   real artifact, not just diagrams, before the series goes deep on each module in later videos.
   See §7 for the full treatment.
3. **Re-verify numbers and claims before reuse.** The original narration includes specific stats
   (e.g. "over 900,000 downloads... by over 50,000 individual developers", "6 different API
   Operators", "10x efficiency and agility improvement"). Confirm these are still accurate (or get
   updated figures) before finalizing speaker notes — do not silently carry forward stale numbers.
4. **Confirm the operator count/list is current.** The original video lists 6 API Gateway operator
   options, 2 Identity Config operator options (Keycloak, Entra ID), and observability options
   (Prometheus/Grafana/Kiali, Google, Microsoft, Datadog). Cross-check against
   `source/operators/README.md` in `oda-canvas` and the current pptx deck (which also lists
   WhaleCloud APIG, Apache APISIX, etc. on slide 26) before finalizing, since the reference
   implementation has likely gained operators since the original recording.
5. **Drop presenter-specific/meta phrasing.** The original is a personally-narrated, informal talk
   ("hello and welcome", "I'll start by...", "thanks for joining us"). Speaker notes for this deck
   should be rewritten as neutral third-person/voice-of-the-project narration suitable for an
   AI voice, while preserving the same content and ordering.

## 4. Audience & Key Messages (carried over from the original)

Two audiences in one video, stated up front:

1. Architects/engineers **building** ODA-compliant software components, who need to understand
   component standards and how the Canvas acts as their execution environment.
2. Architects/engineers/SREs **building or operating** a Canvas platform — whether a CSP building
   their own, or a hyperscaler/vendor delivering a managed platform.

Key messages to preserve: the history/motivation (standards → Open APIs → the deployment/
management gap that Components+Canvas close), what a Component is, what the Canvas is, the
business benefits, and a preview tour of the Canvas's modular operators — explicitly framed as a
"teaser" for a deeper per-module video series to follow.

## 5. Narrative Segments (mapped from the original transcript's own section headers)

The original transcript is already divided into clear named sections (its creator used
sub-headers). This deck follows the same six-segment structure:

1. **Intro** — two audiences, roadmap of the video (history → components & canvas → benefits →
   canvas modules preview → conclusion).
2. **History** — TM Forum frameworks → Open API programme (2013/2015) → the remaining
   deploy/manage gap → the idea of ODA Components.
3. **Components and Canvas** — what a Component is (modular, declarative functional +
   non-functional requirements, portable); what the Canvas is (shared operational services:
   identity, observability, API management, secrets, and emerging AI/cost/carbon management);
   composable IT and composable AI (Agentic ODA).
4. **Benefits** — customer experience, simplicity (SRE team vs. many ops teams), innovation/
   agility, operational efficiency/automation, security (zero trust, security-as-code), technical
   debt reduction, the "order of magnitude" efficiency claim.
5. **ODA Canvas modules** — the three horizons (Horizon 1: install/build/test automation and the
   Innovation Hub dashboard; Horizon 2: API management, identity config, observability, secrets,
   canvas portal; Experimental: AI management, developer experience, carbon/cost management,
   standard databases) — with the API Exposure operator pattern used as the one worked example
   (declarative requirement → operator automates configuration of chosen Gateway/Service Mesh).
6. **Conclusion** — collaboration across CSPs/hyperscalers/vendors/SIs, the ODA Manifesto, framing
   this as a teaser for a deep-dive series, and a call to engage/contribute.

## 6. Slide-by-Slide Outline & Visual Treatment

"Treatment" indicates how the slide's **source video** should be produced, per the parent spec's
style guide (§5 of `spec.md`): **[3B1B]** = new/updated Remotion animated explainer clip, redrawn
from the referenced source diagram; **[DEMO]** = Playwright-captured live clip of the Canvas
Portal; **[STATIC]** = a still frame is acceptable (e.g. a title/quote card) rather than a full
animation.

| # | Segment | Working title | Source(s) to redraw/adapt | Treatment |
|---|---|---|---|---|
| 1 | Intro | Title card: "Introduction to the ODA Canvas" | — | [STATIC] |
| 2 | Intro | Who this is for (two audiences) | Transcript intro paragraph | [3B1B] simple two-persona split animation |
| 3 | Intro | Roadmap of this video | — | [3B1B] simple animated agenda/outline |
| 4 | History | TM Forum frameworks → inconsistency problem | Transcript "History" section | [3B1B] |
| 5 | History | The Open API programme (2013/2015) and its adoption | Transcript "History" section (verify stats, §3.3) | [3B1B] |
| 6 | History | The remaining gap: deploying & managing IT is still hard | Transcript "History" section | [3B1B] |
| 7 | Components & Canvas | What is an ODA Component? ("Lego blocks", composable IT) | pptx slide 1 (left half), slide 2 | [3B1B] |
| 8 | Components & Canvas | What is the ODA Canvas? (operational services layer) | pptx slide 1 (right half) | [3B1B] |
| 9 | Components & Canvas | Composable IT with ODA (full capability map) | pptx slide 2 | [3B1B] — redraw the capability-map diagram, built up layer by layer |
| 10 | Components & Canvas | Composable AI with "Agentic ODA" (**new content**, §3.1) | pptx slide 3 | [3B1B] — animate as an evolution/transition from slide 9's diagram, not a new unrelated diagram |
| 11 | Components & Canvas | Example: Identity management, described not implemented | Transcript paragraph on identity | [3B1B] |
| 12 | Components & Canvas | Example: Secrets vault | Transcript paragraph on secrets | [3B1B] |
| 13 | Benefits | ODA Canvas — Benefits (the 6 benefit pillars) | pptx slide 4 | [3B1B] |
| 14 | Benefits | The "order of magnitude" efficiency claim (verify first, §3.3) | Transcript "Benefits" section | [3B1B] |
| 15 | Canvas modules | Golden Rules / component standard in two layers | pptx slide 5, slide 21 | [3B1B] |
| 16 | Canvas modules | ODA Component YAML definition | pptx slide 6 | [3B1B] |
| 17 | Canvas modules | Canvas as a set of modular software operators (overview) | pptx slide 7; reference real running operators in `Canvas 7.png` | [3B1B] |
| 18 | Canvas modules | Worked example: API Exposure operator pattern | pptx slides 8–11 | [3B1B] — declarative requirement → operator → Gateway/Mesh, as one animated sequence |
| 19 | Canvas modules | **Live demo (a):** Browsing the component catalog in the Canvas Portal | `canvas-portal-v2` Components → Inventory; reference `images/Canvas 2.png` | [DEMO] (fallback [STATIC] using `Canvas 2.png` directly, see §7) |
| 20 | Canvas modules | **Live demo (b):** Deploying a component via the Canvas Portal | `canvas-portal-v2` Components → Deploy → Install Helm Chart; reference `images/Canvas 3.png` | [DEMO] (fallback [STATIC] using `Canvas 3.png` directly, see §7) |
| 21 | Canvas modules | Identity Config Management (pattern recap) | pptx slides 12–14 | [3B1B] |
| 22 | Canvas modules | Observability Config Management (pattern recap) | pptx slides 15–19 | [3B1B] |
| 23 | Canvas modules | The three horizons (Horizon 1 / Horizon 2 / Experimental) | Transcript "ODA Canvas modules" section | [3B1B] |
| 24 | Canvas modules | How do you measure Canvas adoption? | pptx slide 20 | [3B1B] |
| 25 | Conclusion | Collaboration, the ODA Manifesto | Transcript "Conclusion" section | [3B1B] |
| 26 | Conclusion | This is a teaser — series roadmap + call to engage | Transcript closing | [STATIC] or [3B1B] simple outro card with links |

This is a draft shot list (~26 slides), not a locked count — merge/split slides as the actual
narration pacing and animation build-out dictate (§5.3/§6 of `spec.md`: keep each slide to one
~10–30s narration beat).

## 7. Live Demo Insert — Detail (Segments 19–20)

Reference screenshots of the real, running `canvas-portal-v2` already exist in
[images/](/d:/Dev/lesterthomas/ODA-Canvas-training-videos/images) (`Canvas 1.png`–`Canvas 7.png`).
These pin down exactly what the live portal looks like today and should be used as the storyboard
reference when capturing fresh footage — or as a direct fallback if a live Playwright capture
session isn't ready in time for this deck's deadline.

| Screenshot | Portal screen | Used for |
|---|---|---|
| `Canvas 2.png` | Components → Inventory (component catalog grouped by domain, e.g. "Core Commerce Management", with installed/not-installed status) | Segment 19 — visually pays off the "Golden components... available in the ODA Component Directory" idea from Segment 15, by showing the real catalog a user picks components from. |
| `Canvas 3.png` | Components → Deploy → Install Helm Chart (choosing a Helm repository/chart and release name) | Segment 20 — visually pays off "the canvas is just a set of Helm charts you can deploy" (transcript, Horizon 1) and the declarative-requirement story from Segment 18, by showing the actual deploy action. |
| `Canvas 7.png` | Platform → Operators (live list of running operators: `component-operator`, `identityconfig-operator-keycloak`, `secretsmanagement-operator`, `api-operator-istio`, `pdb-management-operator`) | Optional supporting still/cutaway for Segment 17 ("Canvas as a set of modular software operators") — confirms the operator pattern is real, running software, not just a diagram. |
| `Canvas 1.png`, `Canvas 4.png`–`Canvas 6.png` | Dashboard; Lifecycle/Upgrade; Exposed APIs; Dependent APIs | Not used in this deck — reserved as reference material for later Group B demo decks (e.g. UC002 Manage Components, UC013 Upgrade Canvas, UC003 Configure Exposed APIs, UC007 Configure Dependent APIs). |

- **Target app**: `canvas-portal-v2` (per `spec.md` §3 default), seeded with at least the example
  components visible in `Canvas 2.png` (or an equivalent small catalog) so there's real data to
  show, not an empty state.
- **Suggested walk (Segments 19→20 as one continuous live clip, split across two slides)**: land
  on Components → Inventory and browse the catalog (matching `Canvas 2.png`) → click through to
  Deploy → Install Helm Chart and fill in a chart/release (matching `Canvas 3.png`), stopping
  before or at the actual install action.
- **Keep it short**: this is a first glimpse within an explainer video, not a full walkthrough —
  target 15–30 seconds of footage per slide (30–60s total). Full per-feature demo walkthroughs
  (including the actual deploy completing, lifecycle upgrades, exposed/dependent APIs) belong to
  the Group B decks (UC001–UC016) defined in `spec.md` §4, not here.
- Capture per the style guide (`spec.md` §5.2): silent capture, visible cursor, dead time trimmed;
  narration describing what's on screen is written as each slide's speaker notes, not recorded
  live.
- **Fallback**: if live capture isn't feasible before this deck's deadline, embed `Canvas 2.png`
  and `Canvas 3.png` directly as static slide visuals ([STATIC] treatment) and revisit with a true
  [DEMO] capture in a later revision — don't let the live-capture dependency block shipping the
  rest of the deck.

## 8. Asset & Theme Reuse Plan

- Establish the shared Remotion theme (`videos/src/theme.ts` per `spec.md` §9) using this deck as
  the first consumer: colour-code Component (one colour), Operator (another), and each
  non-functional concern (API Gateway, Identity, Observability, Secrets, Cost, Carbon, AI) with a
  consistent colour/icon used identically across every segment in this deck and carried forward
  into every later deck.
- The component motif (originally the "Lego block" from pptx slides 1 and 21, now replaced by the
  standard ODA Component symbol, `images/ODA-Component.svg`) and the capability-map diagram (slide 2/3) are the
  two most-reused visual motifs in the source deck — build these as reusable Remotion components
  early, since nearly every later segment either reuses or evolves from them (e.g. Segment 10
  animates slide 9's diagram morphing into slide 3's AI-native version).
- Pull the ODA Canvas colour palette/logo from the existing pptx deck's theme and from the
  upstream `oda-canvas` repo's own `images/` folder (distinct from this repo's local
  [images/](/d:/Dev/lesterthomas/ODA-Canvas-training-videos/images), which holds Portal
  screenshots per §7, not branding assets).
- The real Portal screenshots (§7) also fix the actual product UI's colours (the TM Forum pink/
  magenta logo mark, dark sidebar, white content panels) — keep the Remotion theme's palette
  compatible with these so the animated segments and the live-demo segments feel like one product,
  not two different tools bolted together.

## 9. Target Length

Following `spec.md` §5.4 (3–8 minutes for concept decks): aim for the shorter end, **~6–8
minutes**, consistent with the original video's ~22-minute runtime being considered too long for
a single modern explainer — if the full 26-slide outline above runs long in review, prefer
splitting lower-priority depth (e.g. Segments 21–22's pattern recaps, which are already previewed
in Segment 18) out into a short "part 2" or deferring them entirely to their dedicated later
deep-dive videos (API Exposure, Identity Config, Observability Config each already have their own
backlog entries in `spec.md` §4 Group A), rather than cutting the history/benefits/conclusion
segments that give this video its narrative completeness.

## 10. Open Questions

- **Stats/claims refresh**: confirm current figures for Open API adoption (downloads/developers),
  the number of available API/Identity/Observability operators, and whether the "10x
  efficiency" claim should be retained, softened, or updated (§3.3).
- **Demo environment readiness**: is there already a seeded `canvas-portal-v2` instance available
  to capture against, or does one need to be stood up for this recording (per `spec.md` §11 open
  question on demo cluster access)?
- **Runtime trade-off**: confirm whether to keep the full 6-segment/~26-slide structure at ~6–8
  minutes, or deliberately split into two shorter videos (e.g. "Part 1: History & Concepts" /
  "Part 2: Canvas Modules Tour") — the original pptx deck's own slide 1 and 29 ("Components and
  Canvas — A Story in Two Parts" duplicated near the start and the backup section) hints the
  original authors considered a two-part split.
- **Whether to keep the video as a single narrator voice or multiple "guest" segments** — the
  original explicitly says future videos will feature other contributors; confirm this first video
  stays single-voice (single AI narration track) throughout.
