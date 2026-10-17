// Component Directory tour: components map → Product Catalog Management (TMFC001) → its sections →
// back to the map → Product Inventory (TMFC005).
// Usage (from repo root): node demos/directory/directory-tour.mjs [captureName]
import { loadEnv, startCapture } from "../lib/capture.mjs";

const env = loadEnv();
const name = process.argv[2] ?? "directory-tour";
const MAP = env.DIRECTORY_URL ?? "https://www.tmforum.org/oda/directory/components-map";

const c = await startCapture(name, { headless: false, channel: "chrome" });
const { page, mark, sleep, clickOn, hover, scrollBy, declineCookies, hideClutter } = c;
// Directory cards are clickable containers (div.cursor-pointer) around the component name.
const card = (title) => page.locator("div.cursor-pointer", { has: page.getByText(title, { exact: true }) }).last();

await page.goto(MAP, { waitUntil: "domcontentloaded" });
await page.getByText("Product Catalog Management", { exact: true }).first().waitFor();
await declineCookies(); // privacy-preserving default
await hideClutter();
await sleep(500);
mark("map");
await sleep(1500);

// Show the map: operators column, then the domains.
await scrollBy(420, 1400);
mark("map-domains");
await sleep(1200);
await hover(card("Product Catalog Management"), { pause: 700 });
await clickOn(card("Product Catalog Management"), { pause: 300 });
await page.waitForURL(/TMFC001/);
await page.getByText("Component ID:", { exact: false }).first().waitFor();
await hideClutter();
await sleep(600);
mark("tmfc001");
await sleep(2200);

// Sections of the component page.
await hover(page.getByText("Component ID:", { exact: false }), { pause: 1200 });
mark("tmfc001-metadata");
await scrollBy(520, 1300);
mark("tmfc001-resources");
await hover(page.getByText("YAML SPECIFICATION", { exact: false }), { pause: 1600 });
await scrollBy(560, 1300);
mark("tmfc001-apis");
await hover(page.getByText("TMF620 Product Catalog Management API", { exact: false }), { pause: 1800 });
await scrollBy(620, 1400);
mark("tmfc001-certified");
await sleep(2200);

// Back to the map and into a second component.
await page.goBack({ waitUntil: "domcontentloaded" });
await page.getByText("Product Inventory", { exact: true }).first().waitFor();
await hideClutter();
await sleep(700);
mark("map-again");
await hover(card("Product Inventory"), { pause: 600 });
await clickOn(card("Product Inventory"), { pause: 300 });
await page.waitForURL(/TMFC005/);
await page.getByText("Component ID:", { exact: false }).first().waitFor();
await hideClutter();
await sleep(600);
mark("tmfc005");
await sleep(1500);
await scrollBy(1000, 1600);
mark("tmfc005-apis");
await sleep(2000);

await c.finish();
