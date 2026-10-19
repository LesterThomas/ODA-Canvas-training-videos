// Deck 02 (How do I buy or build an ODA Canvas?): record the live segments on the real cluster.
//
//   bdd        Portal › BDD: the feature catalogue, then a run of UC002-F001 (Install Component) and
//              its result. Running a feature installs and removes test components (approved by the
//              user for this video, 2026-10-18).
//   operators  Portal › Operators: the operators in this Canvas, with their TMFOP ids, images and pods.
//   cli        Real kubectl/helm output, replayed by <Terminal>: the Canvas deployments, the Helm
//              values that chose the operators, and the separately installed dependency operator.
//
// Usage (repo root): node demos/buy/record-demo.mjs [phase …]   (no arguments = all)
// Outputs: videos/public/captures/buy-*.{webm,marks.json,cli.json}
import { loadEnv, startCapture } from "../lib/capture.mjs";
import { portalLogin, sideItem } from "../lib/portal.mjs";
import { recordSession, run } from "../lib/live-cli.mjs";

const env = loadEnv();
const log = (s) => console.log(`\n=== ${s}`);

const phases = {
  async bdd() {
    log("bdd");
    const c = await startCapture("buy-bdd");
    const { page, mark, sleep, clickOn, hover, typeInto } = c;
    await portalLogin(c, env);
    await clickOn(sideItem(page, "BDD"), { pause: 400 });
    await page.getByText("Canvas Conformance Suite").waitFor();
    await sleep(1500);
    mark("bdd");
    await hover(page.getByText("tmforum-oda/oda-canvas", { exact: true }), { pause: 900 });
    await hover(page.getByText("feature-definition-and-test-kit/features", { exact: true }), { pause: 900 });
    await clickOn(page.getByText("Feature files", { exact: true }), { pause: 600 });
    const select = page.locator(".ant-select").filter({ hasText: /feature file/i }).first();
    await clickOn(select, { pause: 900 });
    mark("catalogue");
    const list = page.locator(".rc-virtual-list-holder").first();
    for (let i = 0; i < 4; i++) { await list.hover(); await page.mouse.wheel(0, 220); await sleep(700); }
    await sleep(400);
    await page.keyboard.type("UC002-F001", { delay: 90 });
    await sleep(800);
    await clickOn(page.locator(".ant-select-item-option").filter({ hasText: "UC002-F001" }).first(), { pause: 500 });
    await page.keyboard.press("Escape");
    mark("selected");
    await clickOn(page.getByRole("button", { name: /start run/i }), { pause: 800 });
    mark("started");
    // Wait for the run to finish; the page polls the backend.
    // Wait for this run to finish. The page shows its id ("run <id> started"); its log in the backend
    // pod ends with "Finished with exit code N".
    await sleep(2000);
    const body = await page.locator("body").innerText();
    const runId = (body.match(/conformance run ([0-9a-f]{12}) started/i) ?? body.match(/Run ([0-9a-f]{12}) is /))?.[1];
    if (!runId) throw new Error("no run id on the page");
    console.log(`  run ${runId}`);
    const logTail = () => run(`MSYS_NO_PATHCONV=1 kubectl exec -n canvas deploy/canvas-portal-backend -- tail -2 /app/data/conformance-work/${runId}/run.log`);
    const t0 = Date.now();
    while (Date.now() - t0 < 20 * 60_000 && !/Finished with exit code/.test((await logTail()).output)) await sleep(4000);
    console.log((await logTail()).output);
    await sleep(4000); // the page polls the backend
    await sleep(1500);
    mark("finished");
    await page.locator("main").innerText().then((t) => console.log(t.split("Validation history")[0].slice(0, 1500)));
    const row = page.locator(".ant-table-row").first();
    if (await row.count()) await hover(row, { pause: 2500 });
    await sleep(1500);
    await c.finish();
  },

  async operators() {
    log("operators");
    const c = await startCapture("buy-operators");
    const { page, mark, sleep, clickOn, hover } = c;
    await portalLogin(c, env);
    await clickOn(sideItem(page, "Operators"), { pause: 300 });
    await page.getByText("Canvas Operators").first().waitFor();
    await sleep(1500);
    mark("operators");
    await hover(page.getByText("TMFOP001", { exact: true }).first(), { pause: 1300 });
    await hover(page.getByText("TMFOP002", { exact: true }).first(), { pause: 600 });
    await hover(page.getByText("api-operator-kong", { exact: true }).first(), { pause: 1500 });
    mark("kong");
    await hover(page.getByText("TMFOP003", { exact: true }).first(), { pause: 1300 });
    mark("keycloak");
    await hover(page.getByText("TMFOP007", { exact: true }).first(), { pause: 1300 });
    mark("vault");
    await hover(page.getByText("TMFOP010", { exact: true }).first(), { pause: 1300 });
    await clickOn(page.getByText(/^\d+ pods?$/).first(), { pause: 2000 });
    mark("pods");
    await sleep(1500);
    await c.finish();
  },

  async cli() {
    log("cli");
    await recordSession("buy-cli", [
      "kubectl get deployments -n canvas",
      "helm get values canvas -n canvas",
      "helm list -n canvas",
    ]);
  },
};

const wanted = process.argv.slice(2);
for (const [name, fn] of Object.entries(phases)) if (!wanted.length || wanted.includes(name)) await fn();
