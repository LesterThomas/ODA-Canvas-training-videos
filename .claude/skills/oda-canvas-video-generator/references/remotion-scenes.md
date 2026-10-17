# Remotion scenes: repo conventions

Load the `remotion-best-practices` skill for general Remotion rules. This file covers how this repo
uses Remotion.

## Layout of `videos/`

```
videos/
├── src/
│   ├── index.ts            registerRoot
│   ├── Root.tsx            one <Folder> per deck, one <Composition> per slide
│   ├── theme.ts            palette (C), fonts (FONT, MONO); the single source of colours
│   ├── lib/ui.tsx          shared primitives (below)
│   └── intro/              deck 01 scenes, grouped by segment: Seg1Intro.tsx … Seg6Conclusion.tsx
├── public/portal/          Canvas Portal screenshots copied from images/ (inventory, deploy, operators)
├── scripts/render-all.mjs  bundle once → renderMedia for each composition matching a filter
├── scripts/stills.mjs      review stills (half size) or --posters (full size, final frame)
└── out/                    gitignored: <id>.mp4, stills/, posters/
```

Put a new deck's scenes in `src/<short-deck-name>/`, grouped into files by segment. Register them in
`Root.tsx` like this:

```tsx
<Folder name="Buy-or-Build">
  <Composition id="BuyBuild-01-Title" component={S01Title} durationInFrames={300} fps={30} width={1920} height={1080} />
  …
</Folder>
```

The prefix (`BuyBuild`) is what `render-all.mjs`, `stills.mjs` and `build_deck.py` filter on. Keep it
unique: no prefix should be a substring of another deck's prefix.

## Primitives in `lib/ui.tsx`

| Primitive | Use |
|---|---|
| `Stage` | Scene background (pass `glow` for mood) |
| `Heading({kicker,title,color,at})` | Top-left slide heading |
| `Appear({at,dur,from,dist,out,style})` | Entrance wrapper. `from`: up, down, left, right, pop. `out` = exit time |
| `useProg(at,dur)` / `useT()` | 0→1 progress from a start time / current seconds, for custom motion |
| `Tile({label,sub,color,icon,iconNode,w,h,fontSize,filled,glow,dim})` | Concept box (`iconNode` takes e.g. `<OdaComponent size={56} crop />`) |
| `OdaComponent({size,labels,build,interfaces,highlight,dim,mono,crop,variant,caption})` (`lib/OdaComponent.tsx`) | **The** ODA Component symbol. See house-style.md for the size and prop rules |
| `Brick` | Legacy Lego motif. Don't use it for ODA Components; kept only for generic "building block" metaphors |
| `Plate` (in `intro/Seg1Intro.tsx`) | Canvas base plate. Move it to `lib/ui.tsx` when a second deck needs it |
| `Gear({size,color,spin})` | Operator motif |
| `Svg` + `Draw({d,at,dur,color,width,arrow,dash})` | Self-drawing connectors (full-frame SVG overlay) |
| `Code({lines,at,perLine,fontSize,width,title,focus})` | Code panel that types in line by line, with an optional highlighted line range |
| `Pill`, `Caption`, `Icon` | Tags, bottom captions, a 28-glyph line-icon set |
| `BrowserFrame({url,style})` | Browser chrome around portal screenshots |

The portal walkthrough helpers (`PortalShot`, `Highlight`, `Cursor`, `Typed`) live in
`intro/Seg5Portal.tsx`. They take **screenshot pixel coordinates** (the screenshots are 1920×1080).
Measure the boxes by opening the PNG. Lift these helpers into `lib/` when the next demo deck needs them.

## Timing to the narration

1. Run `extract_notes.py` to get the words and seconds for each slide.
2. Composition length is the narration length rounded up, plus 1–2 seconds, at 30 fps.
3. Start time for an element is the number of words before its mention, divided by 2.5. For example,
   in slide 19, "the Istio service mesh" starts at about word 54, so the Istio tile lights at about 21.6 s.
4. Put any "cycling" or emphasis loop at the end. It must still finish on a clean, complete frame.

## Workflow and checks

- After edits, run `npx tsc --noEmit` from `videos/`.
- **Studio:** use the `remotion-studio` config in `.claude/launch.json`. It has to run from inside
  `videos/` (`cmd /c "cd videos && npx remotion studio --no-open --port 3000"`). Run from the repo
  root, it fails with "ENOENT … package.json". Open `http://localhost:3000/<composition-id>`.
- **Stills:** run `node scripts/stills.mjs <Prefix> 1` (add `0.4` for mid-motion), then build contact
  sheets with `contact_sheet.py` and look at every one.
- **Assets for native slides:** `Asset-Stage`, `Asset-Icon`, `Asset-Oda` and `Asset-OdaCrop`
  (`src/library/Assets.tsx`) are rendered to transparent PNGs by `node scripts/assets.mjs`. Add any
  new icon or colour a native builder needs to that script's list.
- **Library:** the `Library` folder in Studio holds `Lib-OdaComponent`, a reference sheet comparing the
  original PNG, the static SVG and the animated symbol at several sizes. Check it after touching the
  symbol.
- **Re-render only what changed:** `render-all.mjs` and `stills.mjs` take a comma-separated filter
  (for example `"Intro-07,Intro-11"`). Then rebuild the deck: `build_deck.py` always uses the latest
  clips and posters.
- **Render:** `node scripts/render-all.mjs <Prefix>`, as a background job writing to `out/render.log`.
  It takes about 15 s per clip. The first run downloads Chrome Headless Shell. Wait with an `until grep
  -q "ALL DONE" out/render.log` loop.

## Pitfalls hit so far

- Writing Python edits through a bash heredoc that contains `${…}` and backticks breaks the shell
  parse. Write the patch script to a scratchpad file and run it.
- Make React keys unique when a list has repeated labels (two "Agentic component" items).
- `Draw` arrowheads use a marker id per colour. Reusing a colour is fine.
- `Img` from `remotion` plus `staticFile()` works for screenshots. The PNGs must be in `videos/public/`.
