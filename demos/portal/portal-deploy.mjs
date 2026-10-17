// Canvas Portal: Components › Deploy › Install Helm Chart: choose the repository and the Product
// Catalog (TMFC001) chart, type release name r2, and stop at "Next" (nothing is installed).
// (r1 already exists on the demo cluster, and the portal rightly flags a duplicate name; the
// helm/kubectl clip that follows shows r1, deployed earlier from the same chart.)
// Usage (from repo root): node demos/portal/portal-deploy.mjs
import { loadEnv, startCapture } from "../lib/capture.mjs";
import { portalLogin, sideItem } from "../lib/portal.mjs";

const env = loadEnv();
const c = await startCapture(process.argv[2] ?? "portal-deploy");
const { page, mark, sleep, clickOn, hover, typeInto } = c;

await portalLogin(c, env);
await clickOn(sideItem(page, "Deploy"), { pause: 300 });
await page.getByText("Install a Helm chart into the canvas").first().waitFor();
await sleep(500);
mark("deploy");
await sleep(1200);
await clickOn(page.getByRole("button", { name: /install component/i }), { pause: 700 });
const dlg = page.locator(".ant-modal").first();
mark("modal");
const selects = dlg.locator(".ant-select");
await clickOn(selects.nth(0), { pause: 500 });
await clickOn(page.locator(".ant-select-item-option").filter({ hasText: "reference-example-components" }), { pause: 800 });
mark("repo");
await clickOn(selects.nth(1), { pause: 700 });
await hover(page.locator(".ant-select-item-option").filter({ hasText: "partymanagement" }).first(), { pause: 400 });
await clickOn(page.locator(".ant-select-item-option").filter({ hasText: "productcatalog" }), { pause: 800 });
mark("chart");
await typeInto(dlg.getByPlaceholder(/my-productcatalog/i), "r2", { delay: 160 });
await sleep(600);
mark("release");
await hover(dlg.getByRole("button", { name: /next: edit values/i }), { pause: 2200 });
mark("next");
await sleep(800);
await c.finish();
