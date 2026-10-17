// Render an SVG to a transparent PNG at a given width, with the Playwright install in demos/.
// Usage: node tools/svg_to_png.mjs images/ODA-Canvas.svg videos/out/assets/canvas.png [width=1600]
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";

const require = createRequire(path.resolve("demos/package.json"));
const { chromium } = require("playwright");

const [src, dst, width = "1600"] = process.argv.slice(2);
const svg = fs.readFileSync(src, "utf8");
const [, , vw, vh] = svg.match(/viewBox="([\d.\s-]+)"/)[1].trim().split(/\s+/).map(Number);
const w = Number(width);
const h = Math.round((w * vh) / vw);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: w, height: h } });
await page.setContent(`<html><body style="margin:0;background:transparent">${svg.replace("<svg ", `<svg style="width:${w}px;height:${h}px;display:block" `)}</body></html>`);
fs.mkdirSync(path.dirname(dst), { recursive: true });
await page.screenshot({ path: dst, omitBackground: true });
await browser.close();
console.log(`wrote ${dst} (${w}x${h})`);
