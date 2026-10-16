// Bundle once, then render stills for every composition matching a filter.
// Review stills (half size):  node scripts/stills.mjs [filter] [fraction...]   e.g. node scripts/stills.mjs Intro-1 0.5 1
// Poster frames (full size):  node scripts/stills.mjs --posters [filter]       → out/posters/<id>.png (final frame)
import { bundle } from "@remotion/bundler";
import { getCompositions, renderStill } from "@remotion/renderer";
import path from "node:path";

const args = process.argv.slice(2);
const posters = args[0] === "--posters";
if (posters) args.shift();
const filter = args[0] ?? "";
const fractions = posters ? [1] : args.slice(1).map(Number);
const fr = fractions.length ? fractions : [1];

const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const filters = filter.split(",");
const comps = (await getCompositions(serveUrl)).filter((c) => filters.some((f) => c.id.includes(f)));
for (const c of comps) {
  for (const f of fr) {
    const frame = Math.min(c.durationInFrames - 1, Math.round((c.durationInFrames - 1) * f));
    const output = posters
      ? path.resolve(`out/posters/${c.id}.png`)
      : path.resolve(`out/stills/${c.id}@${Math.round(f * 100)}.png`);
    await renderStill({ composition: c, serveUrl, output, frame, scale: posters ? 1 : 0.5 });
    console.log("ok", c.id, frame);
  }
}
