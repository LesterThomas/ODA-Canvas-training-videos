// Render PNG assets for native PowerPoint slides (backgrounds, icons, ODA Component symbol).
// Usage: node scripts/assets.mjs  → out/assets/<name>.png
// Keep this list in step with tools/native/*.py (the native slide builders reference these names).
import { bundle } from "@remotion/bundler";
import { getCompositions, renderStill } from "@remotion/renderer";
import path from "node:path";

const C = {
  text: "#F2F5FB", muted: "#8F9BB8", tmf: "#E6007E", component: "#F5A623", canvas: "#2F6FED",
  operator: "#1FC7A8", api: "#8B6CFF", identity: "#FF6B6B", observability: "#38BDF8", ai: "#F472B6",
  carbon: "#34D399", ok: "#22C55E", agent: "#F8FAFC", secrets: "#E9C46A",
};
const icon = (name, color, file = `icon-${name}-${color.slice(1).toLowerCase()}`) => ({ id: "Asset-Icon", props: { name, color }, file });
const ASSETS = [
  { id: "Asset-Stage", props: { glow: "#16203A" }, file: "stage" },
  { id: "Asset-Stage", props: { glow: "#2A1534" }, file: "stage-ai" },
  { id: "Asset-Stage", props: { glow: "#1B2550" }, file: "stage-title" },
  { id: "Asset-Oda", props: { labels: false }, file: "oda" },
  { id: "Asset-Oda", props: { labels: false, agent: true }, file: "oda-agent" },
  { id: "Asset-OdaCrop", props: { labels: false, crop: true }, file: "oda-icon" },
  icon("person", C.component), icon("person", C.canvas),
  icon("doc", C.tmf), icon("doc", C.muted), icon("layers", C.tmf), icon("layers", C.muted),
  icon("rocket", C.tmf), icon("rocket", C.muted), icon("spark", C.tmf), icon("spark", C.muted),
  icon("smile", C.tmf), icon("people", C.canvas), icon("spark", C.ai), icon("bolt", C.operator),
  icon("shield", C.identity), icon("wrench", C.component),
  icon("check", C.ok), icon("flask", C.ai), icon("flask", C.ok), icon("rocket", C.muted),
  icon("globe", C.tmf), icon("cloud", C.canvas), icon("cube", C.component), icon("handshake", C.operator),
  icon("layers", C.canvas), icon("shield", C.identity), icon("leaf", C.carbon),
  // deck 03 (authentication and authorization)
  icon("people", C.identity), icon("key", C.identity), icon("link", C.identity), icon("doc", C.identity),
  // deck 02
  icon("lock", C.secrets), icon("key", C.secrets), icon("gear", C.operator), icon("doc", C.operator), icon("wrench", C.operator),
  icon("cloud", C.tmf), icon("check", C.operator), icon("spark", C.operator), icon("gear", C.muted), icon("layers", C.operator),
  // deck 04 (AI-Native ODA Canvas)
  ...["link", "gateway", "cloud", "check", "chart", "database", "doc", "trace", "shield", "coin", "bolt", "rocket", "layers"].map((n) => icon(n, C.ai)),
  icon("cloud", C.muted), icon("link", C.operator),
  // deck 05 (Observability)
  ...["chart", "trace", "server", "bell", "check", "cube", "doc", "flask", "people", "link"].map((n) => icon(n, C.observability)),
  icon("chart", C.muted), icon("gear", C.observability), icon("flask", C.observability),
];

const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const comps = await getCompositions(serveUrl);
const seen = new Set();
for (const a of ASSETS) {
  if (seen.has(a.file)) continue;
  seen.add(a.file);
  const composition = comps.find((c) => c.id === a.id);
  await renderStill({
    composition: { ...composition, props: { ...composition.defaultProps, ...a.props } },
    serveUrl,
    inputProps: a.props,
    output: path.resolve(`out/assets/${a.file}.png`),
    imageFormat: "png",
  });
  console.log("ok", a.file);
}
