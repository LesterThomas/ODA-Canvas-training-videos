# House style

The goal is for every deck to look like one product family, and for the animated scenes to match the
real Canvas Portal (dark sidebar, TM Forum magenta mark, amber TMF hexagons).

## Canvas and type

- 1920×1080, 30 fps, silent. Background `#0A0F1E` with a soft radial glow and a faint 48 px dot grid
  (`Stage`). Pass a different `glow` for mood: `#2A1534` for AI and benefit slides, `#1B2550` for the
  title and outro.
- Font: Inter, from `@remotion/google-fonts`. Code: JetBrains Mono.
- Heading (`Heading`): a 26 px uppercase kicker in the slide's concept colour, over a 68 px, weight
  800 title, at left 120 / top 84.
- Minimum text sizes: 26 px for labels, pills and code (21 px only in a dense code panel), 30–40 px
  for body and captions, 44+ px for key statements, 130–150 px for hero numbers.
- Safe area: keep content at least 100 px from the left and right edges and 40 px from the top and
  bottom. Captions sit at `bottom` 40–110.

## Concept colours (`videos/src/theme.ts`)

Keep each colour tied to the same concept in every deck. Viewers learn the mapping over the series.

| Concept | Colour | Motif |
|---|---|---|
| ODA Component | its own five segment colours (below) | **`OdaComponent` symbol**: the standard; never the Lego `Brick` |
| ODA Canvas | blue `#2F6FED` | `Plate` (glowing base plate) |
| Canvas operator | teal `#1FC7A8` | `Gear` (rotating) |
| API management, gateways | violet `#8B6CFF` | `gateway` icon |
| Identity | coral `#FF6B6B` | `shield` |
| Observability | sky `#38BDF8` | `chart` |
| Secrets | gold `#E9C46A` | `lock` / `key` |
| Events | lime `#A3E635` | `bell` |
| AI-native | pink `#F472B6` | `spark` |
| Agentic / AI solution component | white core `#F8FAFC` | `<OdaComponent agent />` (PNG: `oda-agent.png`). Only the Core Function segment is white; the other four keep their colours. It represents the solution components used to package an AI as an ODA Component |
| Carbon | green `#34D399` | `leaf` |
| Cost | orange `#FB923C` | `coin` |
| TM Forum accent, use cases | magenta `#E6007E` | kicker, highlights, cursor ripples |
| Status | ok `#22C55E`, danger `#F43F5E`, muted `#8F9BB8` | |

## The ODA Component symbol (standard)

Whenever a slide shows or refers to an ODA Component, use the official symbol: a hexagon with five
capability segments, exposed-API lollipops, dependent-API sockets, and a centre hub. The hub is a data
disc above a crossed lollipop and socket. Its outline is open over the grey Environment segment.
It comes from `images/ODA-Component.png` (approved by the user, 2026-10-17).

| Asset | Where | Use for |
|---|---|---|
| `OdaComponent` | `videos/src/lib/OdaComponent.tsx` | Every Remotion scene (it animates) |
| `images/ODA-Component.svg` | static SVG with labels | Slides, documents, anything outside Remotion |
| `images/ODA-Component-icon.svg` | static SVG, no text | Small sizes |
| `scripts/make_oda_component_svg.py` (this skill) | regenerates both SVGs | After any geometry change; keep it in step with `OdaComponent.tsx` |

**Segment colours** (fixed, from the original artwork): Core Function green `#7E9E54`,
Notification/Reporting yellow `#FABB42`, Security red `#E0141D`, Environment Dependence/Requirements
grey `#D3D4DA`, Management/Operations blue `#6596CE`. Outline navy `#1A2747`.

**Sizes and props**
- Use 400 px or more, with `labels`, when the component itself is the subject (slide 7 uses 660 px).
- Use 150–300 px with `labels={false}` as a character in a diagram. Add a `caption` (or a name and
  TMFC id below) for named components.
- Use `crop` at 30–60 px as an inline icon in pills, tiles and lists (hexagon only, tight bounds). It
  replaces the generic `cube` icon wherever the meaning is "ODA Component".
- `variant="dark"` (the default) draws light interface strokes and a light rim so the symbol reads on
  the dark stage. Use `variant="light"` on white backgrounds.

**Tell the story with the segments.** Map narration to segments rather than adding separate labels:
identity, roles and secrets go with **Security**; events go with **Notification/Reporting**; metrics,
observability and management APIs go with **Management/Operations**; the business function goes with
**Core Function**; dependencies and platform needs go with **Environment**. Use `highlight` (with a
`dim` of about 0.35–0.55; higher looks muddy on the dark stage), `build` (segments grow from the
centre) and `interfaces` (lollipops and sockets draw outward) to follow the narration.

## The ODA Canvas picture (standard)

Whenever a slide shows the ODA Canvas itself, use the **ODA Canvas picture**: a platform of capability
modules with ODA Component interfaces (lollipops and sockets) along its top, on a navy base carrying
the label. Never use a plain blue plate or bar. The source is `images/AI-Native-Canvas.webp` (from the
user); `scripts/make_oda_canvas_svg.py` generates the SVGs:

- `images/ODA-Canvas-dark.svg`: light outlines for the dark stage. **Use this one on slides.**
- `images/ODA-Canvas.svg`: for light backgrounds. `images/AI-Native-Canvas.svg`: the original label.

Native slides: `node tools/svg_to_png.mjs images/ODA-Canvas-dark.svg videos/out/assets/canvas-dark.png 1600`,
then `k.image(..., "canvas-dark.png", ...)`. Remotion: copy the SVG to `videos/public/` and use
`<Img src={staticFile("ODA-Canvas-dark.svg")} />`. To point at a module, overlay a glow box placed
from the SVG's coordinates (viewBox `10 180 1652 610`; see `S08Canvas` in `Seg3ComponentsCanvas.tsx`).
A component "running on the Canvas" sits just above its interfaces.

## Native PowerPoint or Remotion? (decide per slide)

Use a Remotion clip only where **motion carries meaning**. Otherwise build a native PowerPoint slide.

| Use **native PowerPoint** (`[NATIVE]`) when the slide is… | Use **Remotion** (`[3B1B]` / `[DEMO]`) when the slide needs… |
|---|---|
| a title, agenda, outro or call to action | a diagram that **transforms** (morph, merge, split, drop onto) |
| cards, lists or columns appearing one by one | things **moving between** elements (tokens, requests, sub-resources fanning out) |
| simple bars or counters that just grow or appear | **timed data** (counters ticking, metrics, scaling), or code typing in with highlights |
| links the viewer should be able to click | the **ODA Component symbol animating** (segments lighting, interfaces drawing) |
| text the user may want to edit later | **live recordings** (Component Directory, Canvas Portal) and **terminal replays** |

Why: native slides are editable, crisp at any size, small, and keep real hyperlinks. Remotion is worth
its cost when the animation explains something. When unsure, prefer native and say so in the script.

Native slides keep the same look as the clips. They use the same stage background, icons and
component symbol (PNG assets from `videos/scripts/assets.mjs`), the same palette, and the same
1920×1080 coordinates. The font is Segoe UI, because Inter isn't installed on the build machine.
Install Inter to make them match exactly. Native entrance effects are timed to the narration exactly
like Remotion builds (`k.anim(shape, at)`).

In the final video **both kinds play**. presentation-generator has PowerPoint render each slide, so
native entrances and Remotion clips run as in a slide show, with the narration starting 1 s in. The
final state of each slide must still be complete, because the review page shows it as the slide's still
and the `--renderer still` fallback uses it.

## Motion

- **Every slide title fades in at the start, with no movement.** On every slide, the kicker, title and
  any subtitle appear together as one plain fade in the first moment of the slide, never rising or
  sliding in. `k.heading(...)` (native) and `<Heading>` (Remotion) do this, so use them for every
  heading. Hand-placed titles, like those on the title card, must do the same. Keep rise-ins (`rise`,
  `Appear`) for content that builds with the narration.
- Use one idea per beat, and build diagrams piece by piece in the order the narration mentions them.
- Entrances: `Appear` (fade plus a 40 px slide, or `pop`), with an ease-out bezier (0.16, 1, 0.3, 1).
  Connectors draw on with `Draw`, and gears spin all the time.
- To show transformation, morph the existing diagram rather than cutting to a new one. For example,
  the Composable IT map morphs into the AI-Native map.
- Hold the finished state for the last 1–2 seconds. It is the poster frame.

## Layout pitfalls already hit (check for these in stills)

- Moving elements can overlap the title on their way in. Check early frames (`stills.mjs <id> 0.05 0.3`),
  not only the final frame. Nothing should start above the heading area (y < 215).

- Arrows pointing at a shape point *towards* it and stop clearly short of it, leaving a visible gap.
  Prefer straight arrows. Draw them above pictures, so their heads are never hidden.

- Rows of pills wider than the space left at the right of the frame. Shorten the text or centre the
  row under its parent.
- Labels on `Plate` or `Tile` that wrap or overflow. Pass an explicit `fontSize`, or widen the tile
  (290 px or more for two-word labels with an icon).
- Large `OdaComponent` symbols leave little room under them. Check that captions, pills and rows
  below don't collide, especially rows that appear late in the scene.
- Screenshot cutaways covering the heading or caption. Keep a `BrowserFrame` between y ≈ 220 and
  950.
- Stacked highlight shading (`boxShadow 9999px`) darkens the screenshot too much. Shade only the
  first highlight in a group.
- Content that moves (pull or translate animations) into another group's labels late in a scene.
  Check the final frame.

## Naming products: always "or another …"

The Canvas does not mandate specific implementations. It provides standard integration patterns,
built on open standards, for interoperability and portability. So whenever narration or a visual
names an example product (Keycloak, Microsoft Entra ID, HashiCorp Vault, Istio, Kong, Apache APISIX,
Prometheus, Datadog and so on), it must also **say and show** that another platform can be used:
"…or another identity management platform", "…any secrets management platform can be used",
"Any other gateway can be added with its own operator". On screen, add a matching tile, pill or
"or another … platform" line next to the named products. Where the point matters to the story,
say it outright once: the Canvas does not mandate a specific product.

## Narration voice

- **No colons or semicolons in speaker notes.** The voice (csm-voice) reads them badly. Use a full stop
  and start a new sentence. `extract_notes.py` flags any it finds.
- **Keep sentences to about 17 words, 20 at most.** The voice can cut long sentences short.
  `extract_notes.py` flags longer ones.
- **Spell out version numbers as they should be spoken.** Write "Apache two dot O", not "Apache 2.0".
  The voice reads digits with dots unpredictably. On-screen text keeps the written form. `extract_notes.py` flags dotted numbers.

- Say "human operator", not "administrator", for the person who would otherwise do the work by hand. This matches the operator pattern the Canvas is built on.

- Neutral, third-person voice of the project: "The Canvas…", "A component declares…". Not "I" or
  "we at <company>".
- Plain spoken English. Expand an acronym on first use in a deck when the audience might not know it
  (behaviour-driven development, site reliability engineer). Keep the well-known ones (API,
  Kubernetes, YAML).
- Say version and API ids naturally: "the TMF672 user roles and permissions API", "version one".
- No on-screen-only shorthand in the notes (no arrows, slashes or "e.g.").
