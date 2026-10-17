// Canvas Portal: dashboard → Components › Inventory, highlighting the domains and installed components.
// Usage (from repo root): node demos/portal/portal-inventory.mjs
import { loadEnv, startCapture } from "../lib/capture.mjs";
import { portalLogin, sideItem } from "../lib/portal.mjs";

const env = loadEnv();
const c = await startCapture(process.argv[2] ?? "portal-inventory");
const { page, mark, sleep, clickOn, hover, scrollBy } = c;

await portalLogin(c, env);
await sleep(1500);
await clickOn(sideItem(page, "Inventory"), { pause: 300 });
await page.getByText("Core Commerce Management").first().waitFor();
await sleep(600);
mark("inventory");
await sleep(1000);
await scrollBy(560, 1400); // past Party Management to Core Commerce
mark("core-commerce");
await hover(page.getByText("Core Commerce Management").first(), { pause: 900 });
await hover(page.getByText("Installed", { exact: true }).first(), { pause: 1600 });
mark("installed");
await sleep(1200);
await scrollBy(700, 1500);
mark("production");
await sleep(1800);
await c.finish();
