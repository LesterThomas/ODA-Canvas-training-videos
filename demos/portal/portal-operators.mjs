// Canvas Portal: Platform › Operators: the running Canvas operators with their TMFOP ids.
// Usage (from repo root): node demos/portal/portal-operators.mjs
import { loadEnv, startCapture } from "../lib/capture.mjs";
import { portalLogin, sideItem } from "../lib/portal.mjs";

const env = loadEnv();
const c = await startCapture(process.argv[2] ?? "portal-operators");
const { page, mark, sleep, clickOn, hover, scrollBy } = c;

await portalLogin(c, env);
await clickOn(sideItem(page, "Operators"), { pause: 300 });
await page.getByText("Canvas Operators").first().waitFor();
await sleep(800);
mark("operators");
await hover(page.getByText("component-operator", { exact: true }).first(), { pause: 1400 });
await hover(page.getByText("identityconfig-operator-keycloak", { exact: true }).first(), { pause: 1200 });
await hover(page.getByText("secretsmanagement-operator", { exact: true }).first(), { pause: 1200 });
await scrollBy(400, 1200);
await hover(page.getByText("api-operator-istio", { exact: true }).first(), { pause: 1400 });
mark("api-operator");
await sleep(1500);
await c.finish();
