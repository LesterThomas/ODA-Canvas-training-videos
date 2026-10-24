// Deck 05 (Observability in the ODA Canvas): record the live segments on the demo cluster.
//
//   cli          Real helm/kubectl output for <Terminal>: the reference stack in `monitoring`, then the
//                ExposedAPIs and the ServiceMonitor the Canvas created for release obs.
//   targets      Prometheus › Status › Targets, filtered to the product catalog's metrics endpoint.
//   business     Prometheus › Graph: business events per second by type.
//   cpu          Prometheus › Graph: CPU of the component's pods.
//   grafana      Grafana › Dashboards › ODA Component (demos/observability/oda-component-dashboard.json).
//   k8sdash      Grafana › Kubernetes / Compute Resources / Namespace (Pods), namespace components.
//   jaeger       Jaeger › Search for obs-productcatalogmanagement, then one POST trace.
//   portal       Canvas Portal › Observability.
//
// Needs: release obs (feature-definition-and-test-kit/testData/productcatalog-v1) Complete in
// `components`, traffic from exercise_catalog_api.py for 15+ minutes, the port-forwards in
// live-demos.md ("Local Canvas environment"), and the ODA Component dashboard imported.
// Usage (repo root): node demos/observability/record-demo.mjs [phase …]   (no arguments = all)
// Outputs: videos/public/captures/obs-*.{webm,marks.json,cli.json}
import { loadEnv, startCapture } from "../lib/capture.mjs";
import { portalLogin, sideItem } from "../lib/portal.mjs";
import { recordSession } from "../lib/live-cli.mjs";

const env = loadEnv();
const PROM = env.PROMETHEUS_URL ?? "http://localhost:9090";
const GRAFANA = env.GRAFANA_URL ?? "http://localhost:3000";
const JAEGER = env.JAEGER_URL ?? "http://localhost:16686";
const SERVICE = "obs-productcatalogmanagement";
const VP = { width: 1280, height: 720 }; // scaled up to 1920×1080 on video
// Several pages render hidden copies of labels (menus, dropdowns), so the hovers target visible matches.
const log = (s) => console.log(`\n=== ${s}`);

/** Prometheus › Graph: type a query, run it, show it as a graph over 15 minutes. */
async function promQuery(c, query) {
  const { page, mark, sleep, typeInto, clickOn, hover } = c;
  await page.goto(`${PROM}/graph`);
  const input = page.locator(".cm-content").first();
  await input.waitFor();
  await sleep(1500);
  mark("page");
  await typeInto(input, query, { delay: 38 });
  await sleep(500);
  mark("typed");
  await clickOn(page.getByRole("button", { name: "Execute" }), { pause: 400 });
  await sleep(1200);
  mark("table");
  await clickOn(page.locator(".nav-tabs .nav-link").filter({ hasText: "Graph" }).first(), { pause: 300 });
  // Range: last 15 minutes (the field defaults to 1h).
  const range = page.locator(".graph-controls input").first();
  await clickOn(range, { pause: 150 });
  await page.keyboard.press("Control+A");
  await page.keyboard.type("15m", { delay: 110 });
  await page.keyboard.press("Enter");
  await page.locator(".graph-chart canvas").first().waitFor({ timeout: 15000 });
  await sleep(1800);
  mark("graph");
  const chart = page.locator(".graph-chart").first();
  const box = await chart.boundingBox();
  if (box) {
    await c.moveTo(box.x + box.width * 0.55, box.y + box.height * 0.45, 900);
    await sleep(1200);
    await c.moveTo(box.x + box.width * 0.85, box.y + box.height * 0.4, 1200);
    await sleep(1200);
  }
  mark("hover");
  await sleep(1000);
}

async function grafanaLogin(c) {
  const { page, sleep } = c;
  await page.goto(`${GRAFANA}/login`);
  await page.getByPlaceholder("email or username").fill(env.GRAFANA_USER);
  await page.getByPlaceholder("password").fill(env.GRAFANA_PASSWORD);
  await page.getByPlaceholder("password").press("Enter");
  await page.waitForURL((u) => !u.pathname.startsWith("/login"));
  await sleep(800);
}

const phases = {
  async cli() {
    log("cli");
    await recordSession("obs-cli-stack", [
      "helm list -n monitoring",
      "kubectl get pods -n monitoring",
    ]);
    await recordSession("obs-cli-wiring", [
      "kubectl get exposedapis -n components",
      "kubectl get servicemonitors -n components",
      "kubectl get servicemonitor obs-productcatalogmanagement-metrics -n components -o yaml",
    ]);
  },

  async targets() {
    log("targets");
    const c = await startCapture("obs-prom-targets", { viewport: VP });
    const { page, mark, sleep, typeInto, hover } = c;
    await page.goto(`${PROM}/targets`);
    await page.getByPlaceholder(/filter by endpoint or labels/i).waitFor();
    await sleep(1500);
    mark("targets");
    await typeInto(page.getByPlaceholder(/filter by endpoint or labels/i), "productcatalog", { delay: 80 });
    await sleep(1200);
    mark("filtered");
    await hover(page.getByText(/obs-productcatalogmanagement-metrics/).filter({ visible: true }).first(), { pause: 1500 });
    await hover(page.getByText("UP", { exact: true }).filter({ visible: true }).first(), { pause: 1800 });
    mark("up");
    await hover(page.getByText(/:4000\/obs-productcatalogmanagement\/metrics/).filter({ visible: true }).first(), { pause: 1800 });
    await hover(page.getByText(/ago$/).filter({ visible: true }).first(), { pause: 1800 });
    mark("scrape");
    await sleep(1000);
    await c.finish();
  },

  async business() {
    log("business");
    const c = await startCapture("obs-prom-business", { viewport: VP });
    await promQuery(c, `sum by (NotificationEvent) (rate(${SERVICE.replace(/-/g, "_")}_api_counter[5m]))`);
    await c.finish();
  },

  async cpu() {
    log("cpu");
    const c = await startCapture("obs-prom-cpu", { viewport: VP });
    await promQuery(c, `sum by (pod) (rate(container_cpu_usage_seconds_total{namespace="components"}[5m]))`);
    await c.finish();
  },

  async grafana() {
    log("grafana");
    const c = await startCapture("obs-grafana", { viewport: VP });
    const { page, mark, sleep, clickOn, hover } = c;
    await grafanaLogin(c);
    await page.goto(`${GRAFANA}/dashboards`);
    const search = page.getByPlaceholder(/search for dashboards/i);
    await search.waitFor();
    await sleep(1500);
    mark("dashboards");
    // The list is virtualised and alphabetical, so search rather than scroll.
    await c.typeInto(search, "ODA", { delay: 120 });
    await page.getByText("ODA Component", { exact: true }).first().waitFor();
    await sleep(900);
    await clickOn(page.getByText("ODA Component", { exact: true }).filter({ visible: true }).first(), { pause: 400 });
    await page.getByText("Business events per minute").first().waitFor();
    await sleep(2500);
    mark("dashboard");
    await hover(page.getByText("Metrics endpoint").filter({ visible: true }).first(), { pause: 1200 });
    await hover(page.getByText(/^Business events \(last/).filter({ visible: true }).first(), { pause: 1200 });
    mark("top");
    // Grafana panels are <section> elements headed by their title.
    const ts = page.locator("section").filter({ has: page.getByText("Business events per minute", { exact: true }) }).first();
    const box = await ts.boundingBox({ timeout: 5000 }).catch(() => null);
    if (box) {
      await c.moveTo(box.x + box.width * 0.6, box.y + box.height * 0.4, 900);
      await sleep(1500);
      await c.moveTo(box.x + box.width * 0.85, box.y + box.height * 0.45, 1200);
      await sleep(1500);
    }
    mark("events");
    await hover(page.getByText("CPU by pod").filter({ visible: true }).first(), { pause: 1500 });
    await hover(page.getByText("Memory by pod").filter({ visible: true }).first(), { pause: 1500 });
    mark("pods");
    await sleep(1000);
    await c.finish();
  },

  async k8sdash() {
    log("k8sdash");
    const c = await startCapture("obs-grafana-k8s", { viewport: VP });
    const { page, mark, sleep, scrollBy } = c;
    await grafanaLogin(c);
    const r = await page.request.get(`${GRAFANA}/api/search?query=${encodeURIComponent("Namespace (Pods)")}`);
    const hit = (await r.json()).find((d) => d.title === "Kubernetes / Compute Resources / Namespace (Pods)");
    if (!hit) throw new Error("no Namespace (Pods) dashboard");
    await page.goto(`${GRAFANA}${hit.url}?var-namespace=components&from=now-30m&to=now`);
    await page.getByText("CPU Usage").first().waitFor();
    await sleep(3000);
    mark("dashboard");
    await c.moveTo(960, 520, 900);
    await sleep(1500);
    await scrollBy(700, 1800);
    await sleep(1500);
    mark("memory");
    await scrollBy(700, 1800);
    await sleep(1500);
    await c.finish();
  },

  async jaeger() {
    log("jaeger");
    const c = await startCapture("obs-jaeger", { viewport: VP });
    const { page, mark, sleep, clickOn, hover } = c;
    await page.goto(`${JAEGER}/search`);
    await sleep(2000);
    mark("search");
    await clickOn(page.locator("form .ant-select").first(), { pause: 500 });
    await page.keyboard.type("obs", { delay: 120 });
    await sleep(600);
    await clickOn(page.locator(".ant-select-item-option").filter({ hasText: SERVICE }).first(), { pause: 600 });
    mark("service");
    await clickOn(page.getByRole("button", { name: "Find Traces" }), { pause: 400 });
    await page.getByText(/\d+ Traces?/).first().waitFor();
    await sleep(2000);
    mark("results");
    // The duration scatter plot sits at the top of the results; glide across it without scrolling.
    await c.moveTo(640, 150, 900);
    await sleep(800);
    await c.moveTo(1000, 120, 1400);
    await sleep(1200);
    mark("list");
    await clickOn(page.getByText(new RegExp(`${SERVICE}: POST`)).filter({ visible: true }).first(), { pause: 600 });
    await page.getByText(/Trace Start/i).first().waitFor({ timeout: 15000 }).catch(() => {});
    await sleep(1500);
    // Widen the operation-name column so the span names read in full.
    const dragger = page.locator('.VerticalResizer--dragger').first();
    const db = await dragger.boundingBox({ timeout: 5000 }).catch(() => null);
    if (db) {
      await c.moveTo(db.x + db.width / 2, db.y + 40, 700);
      await page.mouse.down();
      await c.moveTo(db.x + 300, db.y + 40, 900);
      await page.mouse.up();
    }
    await sleep(1000);
    mark("trace");
    await hover(page.getByText("POST", { exact: true }).filter({ visible: true }).first(), { pause: 1500 });
    await hover(page.getByText(/swaggerValidator/).filter({ visible: true }).first(), { pause: 1500 });
    mark("middleware");
    await hover(page.getByText(/^mongodb\./).filter({ visible: true }).first(), { pause: 1500 });
    mark("mongodb");
    await clickOn(page.getByText(/^mongodb\.insert/).filter({ visible: true }).first(), { pause: 2500 });
    mark("span");
    await sleep(1500);
    await c.finish();
  },

  async portal() {
    log("portal");
    const c = await startCapture("obs-portal"); // the Portal is laid out for 1920 px
    const { page, mark, sleep, clickOn, hover } = c;
    await portalLogin(c, env);
    await clickOn(sideItem(page, "Observability"), { pause: 400 });
    await page.getByText("Telemetry tools").first().waitFor();
    await sleep(2500);
    mark("observability");
    await hover(page.getByText("Prometheus", { exact: true }).filter({ visible: true }).first(), { pause: 1200 });
    await hover(page.getByText("Found in cluster").filter({ visible: true }).first(), { pause: 1500 });
    await hover(page.getByText(/prometheus-operated\.monitoring/).filter({ visible: true }).first(), { pause: 1800 });
    mark("prometheus");
    await hover(page.getByText("Grafana", { exact: true }).filter({ visible: true }).first(), { pause: 1500 });
    mark("grafana");
    await sleep(1500);
    await c.finish();
  },
};

const wanted = process.argv.slice(2);
for (const [name, fn] of Object.entries(phases)) if (!wanted.length || wanted.includes(name)) await fn();
