// Bundle once and render every composition matching argv[2] to out/<id>.mp4 (H.264, silent).
// argv[2] may be a comma-separated list of filters, e.g. "Intro-07,Intro-11" to re-render only changed slides.
import { bundle } from "@remotion/bundler";
import { getCompositions, renderMedia } from "@remotion/renderer";
import path from "node:path";

const filter = process.argv[2] ?? "";
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const filters = filter.split(",");
const comps = (await getCompositions(serveUrl)).filter((c) => filters.some((f) => c.id.includes(f)));
for (const c of comps) {
  const t0 = Date.now();
  await renderMedia({
    composition: c,
    serveUrl,
    codec: "h264",
    crf: 20,
    muted: true,
    outputLocation: path.resolve(`out/${c.id}.mp4`),
  });
  console.log("rendered", c.id, `${((Date.now() - t0) / 1000).toFixed(0)}s`);
}
console.log("ALL DONE");
