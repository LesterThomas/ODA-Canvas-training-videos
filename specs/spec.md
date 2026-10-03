# ODA Canvas Training Videos — Project Specification

## 1. Purpose

This repository produces training videos that teach developers, architects, and operators how
to use the TM Forum **ODA Canvas**
([tmforum-oda/oda-canvas](https://github.com/tmforum-oda/oda-canvas)).

This repo's deliverable for each training video is a single **PowerPoint deck (`.pptx`)**
containing:

- A sequence of slides, each with a **source video** as its visual (either a short
  3Blue1Brown-style animated explainer clip, or a screen-recorded live demo of the Canvas Portal).
- **Speaker notes** on each slide — the narration script for that slide, written as clean
  spoken-style text.

That `.pptx` is then handed to a separate repository,
[presentation-generator](file:///D:/Dev/lesterthomas/presentation-generator)
(`D:\Dev\lesterthomas\presentation-generator`), which adds AI-generated voice narration (from the
speaker notes) and renders the final `.mp4`. **Voice narration generation is entirely
`presentation-generator`'s responsibility** — this repo never records or synthesizes
voice-over audio, and does not need a captions/transcription step.

## 2. Audience & Goals

- **Primary audience**: developers and solution architects who are new to ODA Canvas, TM Forum
  members evaluating the Canvas, and contributors who need a guided tour of a feature.
- **Goals**: reduce onboarding time, demonstrate real portal/CLI workflows, keep videos short and
  topic-focused, and build a reusable visual/narrative style that scales across many topics.

## 3. Source of Truth

This repo does not vendor the ODA Canvas source. It treats
[tmforum-oda/oda-canvas](https://github.com/tmforum-oda/oda-canvas) as an external dependency —
cloned/run locally or against a shared demo cluster purely to record demos and mine documentation
for script/speaker-notes content.

Key upstream material to use as source for scripts and diagrams:

| Source | Use |
|---|---|
| `README.md` | High-level architecture, operator overview, release context |
| `Canvas-design.md` | Detailed Canvas design — primary source for architecture diagrams |
| `AI-Native-Canvas-design.md` | "Agentic ODA" / MCP / AI Gateway concepts |
| `SecurityPrinciples.md` | Security/identity explainer content |
| `usecase-library/UC001`–`UC016` | One use case ≈ one candidate live-demo deck (see §4) |
| `installation/README.md` | Install/upgrade demo steps |
| `source/operators/README.md` | Per-operator deep dives |
| `canvas-portal-v2/` | The React + TypeScript portal UI to be driven by Playwright for demos |
| `presentations/About ODA Canvas.pptx` (this repo) | Existing 38-slide narrative deck — mine for talking points, structure, and diagrams to redraw as native, animatable Remotion graphics |

**Note:** the upstream repo has both a legacy `canvas-portal` and the newer `canvas-portal-v2`
(React/Vite/TypeScript). Default to **`canvas-portal-v2`** as the demo target unless told
otherwise (see Open Questions).

## 4. Video / Deck Catalog (Initial Backlog)

Each entry below becomes one `.pptx` deck (a sequence of slides = one finished training video).
This is a backlog to prioritize with the stakeholder before bulk production, not committed scope.

### Group A — Concept explainer decks (3Blue1Brown-style source videos)

- What is an ODA Component? / What is the ODA Canvas? (two-part intro)
- Composable IT with ODA (capabilities, modular operators)
- Composable AI with "Agentic ODA" (AI-native canvas: MCP tools, AI Gateway, LLM observability)
- ODA Canvas — Benefits
- ODA Golden Rules (design principles for modular, reusable components)
- ODA Component YAML definition, explained field by field
- Canvas as a set of modular software operators (overview)
- API Exposure deep-dive (API Management operator)
- Identity Config Management deep-dive
- Observability Config Management deep-dive
- How do you measure Canvas adoption?
- How do I buy or build a Canvas?
- What types of Canvas Operator are available? (series)

### Group B — Live demo decks (Playwright-captured source videos), mapped 1:1 to the upstream use-case library

- UC001 Install Canvas
- UC002 Manage Components
- UC003 Configure Exposed APIs
- UC004 Configure Published Events
- UC005 Configure Clients and Roles
- UC006 Configure Observability
- UC007 Configure Dependent APIs
- UC008 Configure Subscribed Events
- UC009 Internal Authentication
- UC010 External Authentication
- UC011 View Technical Observability
- UC012 View Business Observability
- UC013 Upgrade Canvas
- UC014 Secrets Management (JWT-based)
- UC016 ODA Component and API Registry

Most decks in practice will mix both: an opening Group-A-style concept slide or two, followed by
Group-B-style live-demo slides.

## 5. Style Guide

### 5.1 3Blue1Brown-style source videos (Remotion)

- Dark background, flat high-contrast vector shapes, smooth eased motion; one idea revealed at a
  time rather than dense slides.
- Diagrams are built up progressively (stroke-by-stroke / piece-by-piece), not pasted in as
  static images — redraw upstream diagrams (from `Canvas-design.md` and the pptx deck) as native
  animatable Remotion components.
- **Videos are silent** — no baked-in voice-over and no baked-in captions. All narration comes
  from the enclosing slide's speaker notes, synthesized by `presentation-generator`. Minimal
  on-screen text only, to reinforce key terms.
- Consistent colour-coding per recurring concept (e.g. always the same colour for "Component",
  "Operator", "API Gateway", "Identity", "Observability") defined once in a shared theme.
- Author each clip to hold cleanly on its final frame or loop seamlessly, since its on-slide
  duration will ultimately be driven by how long the narration audio for that slide runs.

### 5.2 Live demo source videos (Playwright capture)

- Full-browser capture of the Canvas Portal; cursor movement and clicks are visible; pacing is
  deliberate but dead time is trimmed in post.
- Clips are captured **silent** (no system audio) — narration is written as speaker notes on the
  enclosing slide(s), describing what the viewer is seeing.
- Callouts, zooms, and highlight boxes are added in post (e.g. as a Remotion overlay pass on top
  of the captured footage) rather than baked into the live capture.

### 5.3 Speaker notes (the narration script)

- Speaker notes are written as **clean, spoken-style narration sentences** — this text is spoken
  verbatim by `presentation-generator`'s AI voice narration, so avoid bullet fragments,
  abbreviations, or on-screen-only shorthand that would read awkwardly aloud.
- Keep each slide's notes to a single, natural narration beat (roughly 10–30 seconds spoken) so
  slide pacing stays tight; split a long explanation across multiple slides rather than one dense
  note block.

### 5.4 Shared conventions

- Every deck has: a title slide, a brief recap/CTA closing slide linking back to the
  [oda-canvas repo](https://github.com/tmforum-oda/oda-canvas) and relevant docs.
- Target overall length (once rendered): 3–8 minutes for concept decks, 5–12 minutes for demo
  decks.
- Source videos authored/captured at 1920×1080 (16:9) to match the eventual 1080p render.

## 6. Tooling & Tech Stack

- **Animation/compositing for 3Blue1Brown-style videos**: [Remotion](https://www.remotion.dev)
  (React-based). Project scaffolded per the installed `remotion-create` skill
  (`npx create-video@latest --yes --blank --no-tailwind`). Relevant installed Remotion Agent
  Skills under [.agents/skills](/d:/Dev/lesterthomas/ODA-Canvas-training-videos/.agents/skills):
  `remotion-best-practices`, `remotion-create`, `remotion-markup`, `remotion-studio`,
  `remotion-render`, `remotion-maps`, `remotion-interactivity`, `remotion-docs`,
  `remotion-upgrade`, `remotion-multimedia`.
- **Deck assembly**: `python-pptx` (and/or the installed `pptx` skill) to build/edit `.pptx`
  decks programmatically — adding slides, embedding source videos, and setting speaker notes
  text.
- **Live demo capture**: Playwright (VS Code Playwright browser tools) drives the Canvas Portal
  UI deterministically and records silent screen capture video.
- **Demo environment**: a running ODA Canvas instance (local `kind`/`k3d` cluster or a shared dev
  cluster) with `canvas-portal-v2` deployed and reachable by Playwright, seeded with consistent,
  repeatable demo data/components before each recording.
- **Out of scope (external repo)**: AI voice narration and final `.mp4` rendering are owned by
  `presentation-generator` (`D:\Dev\lesterthomas\presentation-generator`). This repo treats it as
  the consumer of its `.pptx` output; changes to its behavior are out of scope here.

## 7. Repository Structure (Proposed)

```
/
├── specs/                      # specs, briefs, style guide (this file)
│   └── spec.md
├── scripts/                    # draft narration/speaker-notes text per deck, before pasting
│   └── <deck-id>.md            # into the .pptx — one section per slide
├── videos/                     # Remotion project — one composition per 3Blue1Brown-style video
│   ├── src/
│   │   └── <video-id>/         # Composition.tsx, Scene*.tsx
│   └── out/                    # rendered silent .mp4 clips, ready to embed in slides
├── demos/                      # Playwright scripts that drive & capture Canvas Portal demos
│   └── <usecase-id>/           # e.g. UC003-configure-exposed-apis/, spec + recorded .mp4 clips
├── decks/                      # the actual deliverable: one .pptx per deck-id
│   └── <deck-id>.pptx          # source videos embedded + speaker notes set, ready to hand off
├── presentations/               # existing/legacy slide decks (source material)
└── .agents / .claude            # installed agent skills (remotion-*, pptx)
```

The exact Remotion scaffold layout will be finalized when the `remotion-create` skill is run
(likely nesting its own `package.json` under `videos/`).

## 8. Production Pipeline (per deck)

1. **Brief & outline** — pick a backlog item (§4), write a one-paragraph brief and a slide-by-
   slide beat outline in `scripts/<deck-id>.md`.
2. **Speaker notes draft** — write the narration script for every slide as spoken-style sentences
   (§5.3), in the same outline file.
3. **Produce the source video for each slide** — either:
   - a new or existing 3Blue1Brown-style clip, authored/rendered with Remotion into
     `videos/out/` (§5.1), or
   - a new or existing live-demo clip, captured with Playwright into `demos/<usecase-id>/`
     (§5.2).
4. **Assemble the deck** — build `decks/<deck-id>.pptx`: one slide per beat, each with its source
   video embedded and its speaker notes text set.
5. **Review** — read the notes aloud against each video; confirm every slide's notes text is
   clean narration (no fragments) and every embedded video is the right asset.
6. **Hand off** — `decks/<deck-id>.pptx` is the finished deliverable; `presentation-generator`
   takes it from here to add voice narration and render the final `.mp4`.
7. **Track status** — record in the catalog (§4) which decks are drafted / assembled /
   handed off.

## 9. Branding & Assets

- Reuse the TM Forum / ODA Canvas colour palette and logos (sourced from
  `presentations/About ODA Canvas.pptx` and the upstream repo's `images/` folder). Define once in
  a shared `videos/src/theme.ts` for Remotion clips, so 3Blue1Brown-style videos and live-demo
  recordings look like one consistent visual family within a deck.
- Maintain a shared component library for recurring diagram motifs (the "Lego block" component
  icon, operator icons, API Gateway, Identity, Observability icons, etc.) seen throughout the
  existing deck, so visual language stays consistent across all videos.

## 10. Versioning & Maintenance

- Each deck's outline (`scripts/<deck-id>.md`) records the `oda-canvas` version/commit it was
  demoed against, so demo decks can be flagged as outdated after upstream UI/CLI changes.
- Run the `remotion-upgrade` skill periodically to keep Remotion and related packages current.

## 11. Open Questions

- **Publishing channel(s)**: YouTube only, or also the TM Forum site / Vimeo / other?
- **Demo cluster access**: fresh local `kind`/`k3d` cluster per recording, or a shared persistent
  dev cluster for Playwright to target?
- **Branding assets**: is there an official TM Forum style guide/logo pack to source from, or
  should branding be derived ad-hoc from the existing pptx deck?
- **Priority/scope**: which backlog items (Group A vs. Group B, §4) should be produced first?
- **Portal version**: confirm `canvas-portal-v2` (not the legacy `canvas-portal`) is the correct
  demo target.
