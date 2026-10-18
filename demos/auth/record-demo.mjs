// Deck 03 (Authentication and Authorization): record the live demo, end to end, on the real cluster.
//
//   pc1 install → its client and Canvas system role in Keycloak → CSP and MVNO roles loaded via TMF672 →
//   pi1 and po1 installed, po1's two dependencies unmet → grant po1 the CSP role on pc1, then on pi1 →
//   both dependencies met → a product order → uninstall, and the clients disappear from Keycloak.
//
// This CHANGES the demo cluster (approved by the user for this video, 2026-10-17). It needs:
//   - REFERENCE_COMPONENTS_DIR: a checkout of tmforum-oda/reference-example-components @ be11fd0
//     (the commands on screen run there, so they read `helm install pc1 charts/ProductCatalog …`)
//   - demos/.env with PORTAL_* and KEYCLOAK_* (gitignored)
//   - the Keycloak-authorization dependency operator running (see scripts/03-…md, "Demo environment")
//
// Usage (repo root): REFERENCE_COMPONENTS_DIR=… node demos/auth/record-demo.mjs [phase …]
// Phases, in order: reset pc1 pc1-roles install-rest unmet grant-catalog grant-inventory order cleanup
// ("restore" rebuilds the pre-cleanup state off camera, to retake the cleanup on its own)
// (no arguments = all). Outputs: videos/public/captures/{auth-*.webm,.marks.json,.cli.json}.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv, startCapture } from "../lib/capture.mjs";
import { portalLogin, sideItem } from "../lib/portal.mjs";
import { run, recordSession } from "../lib/live-cli.mjs";
import { kcLogin, kcShowMoreClients, kcClientsList, kcOpenClient, kcTab, kcAssignClientRole, kcClientRoles, kcGrantClientRole, until } from "../lib/keycloak.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const env = loadEnv();
const WORK = env.REFERENCE_COMPONENTS_DIR;
if (!WORK || !fs.existsSync(path.join(WORK, "charts", "ProductCatalog"))) {
  console.error("Set REFERENCE_COMPONENTS_DIR to a reference-example-components checkout.");
  process.exit(1);
}
// The values files and Postman copies go next to the charts, so the on-screen commands stay short.
fs.mkdirSync(path.join(WORK, "demo"), { recursive: true });
for (const f of fs.readdirSync(HERE).filter((f) => f.endsWith("-values.yaml"))) fs.copyFileSync(path.join(HERE, f), path.join(WORK, "demo", f));
for (const f of fs.readdirSync(path.join(HERE, "postman"))) fs.copyFileSync(path.join(HERE, "postman", f), path.join(WORK, "demo", f));

const PC1 = "pc1-productcatalogmanagement";
const PI1 = "pi1-productinventory";
const PO1 = "po1-productordercaptureandvalidation";
const sh = (cmd) => run(cmd, { cwd: WORK });
const componentStatus = async (name) =>
  (await sh(`kubectl get component ${name} -n components -o jsonpath="{.status['summary/status'].deployment_status}"`)).output;
const depReady = async (dep) =>
  (await sh(`kubectl get dependentapi ${PO1}-${dep}-v4 -n components -o jsonpath='{.status.implementation.ready}'`)).output === "true";
const log = (s) => console.log(`\n=== ${s}`);

const phases = {
  // Not recorded: start from a Canvas with none of the three components.
  async reset() {
    log("reset");
    const { output } = await sh("helm list -n components -q");
    const present = ["po1", "pi1", "pc1"].filter((r) => output.split("\n").includes(r));
    if (present.length) console.log((await sh(`helm uninstall ${present.join(" ")} -n components --wait`)).output);
    await until(async () => (await sh("kubectl get components -n components -o name")).output, (o) => !/p[cio]1-/.test(o), { label: "components gone" });
    for (const id of [PC1, PI1, PO1]) await until(() => kcClientRoles(env, id), (r) => r === null, { label: `${id} client deleted` });
    await until(async () => (await sh("kubectl get pvc -n components -o name")).output, (o) => !/p[cio]1-/.test(o), { label: "PVCs gone" });
    console.log("clean");
  },

  // Slides 9 and 10: install pc1, then see it in the Portal and its client in Keycloak.
  async pc1() {
    log("pc1");
    await recordSession("auth-install-pc1", [
      "helm install pc1 charts/ProductCatalog -n components -f demo/pc1-values.yaml",
      { wait: () => until(() => componentStatus(PC1), (s) => s === "Complete", { label: "pc1 Complete" }) },
      "kubectl get components -n components",
      "kubectl get identityconfigs -n components",
    ], { cwd: WORK });
    await until(() => kcClientRoles(env, PC1), (r) => r?.includes("canvasRole"), { label: "pc1 canvasRole" });

    const c = await startCapture("auth-portal-pc1");
    const { page, mark, sleep, clickOn, hover } = c;
    await portalLogin(c, env);
    await clickOn(sideItem(page, "Inventory"), { pause: 300 });
    await page.goto(`${env.PORTAL_URL}/components/components/${PC1}`);
    await page.getByText(PC1).first().waitFor();
    await sleep(1200);
    mark("pc1-overview");
    await hover(page.getByText("Phase", { exact: true }).first(), { pause: 1500 });
    await clickOn(page.getByRole("tab", { name: /APIs/ }).first(), { pause: 800 });
    mark("pc1-apis");
    await hover(page.getByText("SECURITY FUNCTION").or(page.getByText("Security function")).first(), { pause: 800 });
    await hover(page.getByText("userrolesandpermissions").first(), { pause: 2500 });
    mark("pc1-security-function");
    await sleep(1500);
    await c.finish();
  },

  // Slides 10 and 12: pc1's client with only its Canvas system role, then the CSP and MVNO roles arriving
  // through TMF672 while we watch (newman runs during the capture).
  async "pc1-roles"() {
    log("pc1-roles");
    const c = await startCapture("auth-kc-pc1");
    const { page, mark, sleep, hover } = c;
    await kcLogin(c, env);
    await hover(page.getByRole("link", { name: PC1, exact: true }), { pause: 1200 });
    mark("pc1-client-in-list");
    await kcOpenClient(c, PC1, "Roles");
    await hover(page.getByRole("link", { name: "canvasRole" }).or(page.getByText("canvasRole")).first(), { pause: 2000 });
    mark("pc1-roles-canvasRole");
    await sleep(1500);
    mark("newman-start");
    await recordSession("auth-roles-pc1", ["newman run demo/pc1-RetailandWholesale.postman_collection.json --insecure"], { cwd: WORK });
    await until(() => kcClientRoles(env, PC1), (r) => r?.includes("CSP") && r?.includes("MVNO"), { label: "pc1 CSP and MVNO roles" });
    mark("roles-created");
    // Re-open the client from the list, as a person would: switching tabs alone doesn't refetch roles.
    await kcClientsList(c);
    await kcOpenClient(c, PC1, "Roles");
    await page.getByText("CSP", { exact: true }).first().waitFor();
    await sleep(800);
    mark("pc1-roles-dynamic");
    await hover(page.getByText("CSP", { exact: true }).first(), { pause: 1200 });
    await hover(page.getByText("MVNO", { exact: true }).first(), { pause: 2000 });
    await sleep(1200);
    await c.finish();
  },

  // Slide 13: pi1 and po1 installed; po1 waits on its two dependencies. pi1's roles are loaded too.
  async "install-rest"() {
    log("install-rest");
    await recordSession("auth-install-pi1-po1", [
      "helm install pi1 charts/ProductInventory -n components -f demo/pi1-values.yaml",
      "helm install po1 charts/ProductOrderCaptureAndValidation -n components -f demo/po1-values.yaml",
      { wait: () => until(() => componentStatus(PI1), (s) => s === "Complete", { label: "pi1 Complete" }) },
      { wait: () => until(() => componentStatus(PO1), (s) => s === "In-Progress-DepApi", { label: "po1 waiting on dependencies" }) },
      "kubectl get components -n components",
      "kubectl get dependentapis -n components",
    ], { cwd: WORK });
    await recordSession("auth-roles-pi1", ["newman run demo/pi1-RetailandWholesale.postman_collection.json --insecure"], { cwd: WORK });
    await until(() => kcClientRoles(env, PI1), (r) => r?.includes("CSP"), { label: "pi1 CSP role" });
    await until(() => kcClientRoles(env, PO1), (r) => r?.includes("canvasRole"), { label: "po1 client" });
  },

  // Slide 13: the new clients in Keycloak, and the unmet dependencies in the Portal.
  async unmet() {
    log("unmet");
    let c = await startCapture("auth-kc-clients");
    await kcLogin(c, env);
    await kcShowMoreClients(c);
    c.mark("all-clients");
    for (const id of [PC1, PI1, PO1]) await c.hover(c.page.getByRole("link", { name: id, exact: true }), { pause: 900 });
    await c.sleep(1500);
    await c.finish();

    c = await startCapture("auth-portal-unmet");
    await portalLogin(c, env);
    await c.clickOn(sideItem(c.page, "Dependent APIs"), { pause: 300 });
    await c.page.getByText("downstreamproductcatalog").first().waitFor();
    await c.sleep(1000);
    c.mark("depapis-unresolved");
    await c.hover(c.page.getByText("UNRESOLVED").first(), { pause: 1500 });
    await c.hover(c.page.getByText("UNRESOLVED").nth(1), { pause: 1500 });
    await c.sleep(1500);
    await c.finish();
  },

  // Slide 14: grant po1 the CSP role on the product catalog, and watch the dependency resolve.
  async "grant-catalog"() {
    await grantAndWatch("auth-grant-catalog", PC1, "downstreamproductcatalog");
  },

  // Slide 15: the same for the product inventory.
  async "grant-inventory"() {
    await grantAndWatch("auth-grant-inventory", PI1, "downstreamproductinventory");
    await until(() => componentStatus(PO1), (s) => s === "Complete", { label: "po1 Complete" });
    await recordSession("auth-deps-met", ["kubectl get components -n components", "kubectl get dependentapis -n components"], { cwd: WORK });
  },

  // Slide 16: send one valid product order. (Slide 17 is an animation; the inventory check is evidence.)
  async order() {
    log("order");
    const q = await sh(
      `curl -sk "https://localhost/${PC1}/tmf-api/productCatalogManagement/v4/productOffering?name=Unlimited%20Max%20SIM%20Only%2024-month&fields=id,name"`,
    );
    const offering = JSON.parse(q.output)[0];
    if (!offering?.id) throw new Error(`offering not found: ${q.output}`);
    const body = {
      "@type": "ProductOrder",
      description: "CSP retail customer order for Unlimited Max SIM Only 24-month plan",
      priority: "1",
      productOrderItem: [
        { "@type": "ProductOrderItem", id: "1", quantity: 1, action: "add", productOffering: { "@type": "ProductOfferingRef", id: offering.id, name: offering.name } },
      ],
    };
    fs.writeFileSync(path.join(WORK, "demo", "order.json"), JSON.stringify(body, null, 2));
    await recordSession("auth-order", [
      `curl -sk "https://localhost/${PC1}/tmf-api/productCatalogManagement/v4/productOffering?name=Unlimited%20Max%20SIM%20Only%2024-month&fields=id,name"`,
      `curl -sk -X POST https://localhost/${PO1}/tmf-api/productOrderingManagement/v4/productOrder -H "Content-Type: application/json" -d @demo/order.json | python -m json.tool`,
    ], { cwd: WORK });
    await new Promise((ok) => setTimeout(ok, 15000)); // the order processor completes orders in ~10 s
    await recordSession("auth-inventory", [
      `curl -sk "https://localhost/${PI1}/tmf-api/productInventory/v4/product?fields=id,name,status" | python -m json.tool`,
      `curl -sk "https://localhost/${PO1}/tmf-api/productOrderingManagement/v4/productOrder?fields=id,state" | python -m json.tool`,
    ], { cwd: WORK });
  },

  // Not recorded: rebuild the end-of-demo state (three components, CSP and MVNO roles, po1's two grants)
  // so the cleanup can be retaken from the same state as the real run.
  async restore() {
    log("restore");
    await phases.reset();
    for (const [rel, chart] of [["pc1", "ProductCatalog"], ["pi1", "ProductInventory"], ["po1", "ProductOrderCaptureAndValidation"]])
      console.log((await sh(`helm install ${rel} charts/${chart} -n components -f demo/${rel}-values.yaml`)).output.split("\n")[0]);
    await until(() => componentStatus(PC1), (s) => s === "Complete", { label: "pc1 Complete" });
    await until(() => componentStatus(PI1), (s) => s === "Complete", { label: "pi1 Complete" });
    for (const rel of ["pc1", "pi1"]) await sh(`newman run demo/${rel}-RetailandWholesale.postman_collection.json --insecure`);
    await until(() => kcClientRoles(env, PC1), (r) => r?.includes("CSP"), { label: "pc1 CSP role" });
    await until(() => kcClientRoles(env, PI1), (r) => r?.includes("CSP"), { label: "pi1 CSP role" });
    await until(() => kcClientRoles(env, PO1), (r) => r?.includes("canvasRole"), { label: "po1 client" });
    await kcGrantClientRole(env, PO1, PC1, "CSP");
    await kcGrantClientRole(env, PO1, PI1, "CSP");
    await until(() => componentStatus(PO1), (s) => s === "Complete", { label: "po1 Complete" });
    console.log("restored: three components Complete, both dependencies resolved");
  },

  // Slide 18: uninstall the three components while watching their clients disappear from Keycloak.
  async cleanup() {
    log("cleanup");
    const c = await startCapture("auth-kc-cleanup");
    await kcLogin(c, env);
    await kcShowMoreClients(c);
    c.mark("before-uninstall");
    await c.sleep(1500);
    const uninstall = recordSession("auth-uninstall", ["helm uninstall po1 pi1 pc1 -n components", "kubectl get components -n components"], { cwd: WORK });
    c.mark("uninstall-start");
    await until(() => Promise.all([PC1, PI1, PO1].map((id) => kcClientRoles(env, id))), (l) => l.every((r) => r === null), { label: "clients deleted" });
    await uninstall;
    // Clicking Clients while on the list doesn't refetch it, so reload the page, as a person would.
    await c.page.reload();
    await c.page.getByText("Clients list").waitFor();
    await c.sleep(600);
    await kcShowMoreClients(c);
    c.mark("clients-gone");
    await c.sleep(2500);
    await c.finish();
  },
};

async function grantAndWatch(name, roleClient, dep) {
  log(name);
  let c = await startCapture(`${name}-kc`);
  await kcLogin(c, env);
  await kcShowMoreClients(c);
  await kcOpenClient(c, PO1, "Service accounts roles");
  c.mark("service-account-roles");
  await kcAssignClientRole(c, roleClient, "CSP");
  await c.finish();
  await until(() => depReady(dep), (v) => v === true, { label: `${dep} resolved` });

  c = await startCapture(`${name}-portal`);
  await portalLogin(c, env);
  await c.clickOn(sideItem(c.page, "Dependent APIs"), { pause: 300 });
  await c.page.getByText(dep).first().waitFor();
  await c.sleep(1000);
  c.mark("depapis");
  const row = c.page.getByRole("row").filter({ hasText: dep });
  await c.hover(row.getByText(/RESOLVED|READY/i).first(), { pause: 1500 });
  await c.hover(row.getByText(/https?:\/\//).first(), { pause: 2000 });
  c.mark("resolved");
  await c.sleep(1500);
  await c.finish();
}

const order = ["reset", "pc1", "pc1-roles", "install-rest", "unmet", "grant-catalog", "grant-inventory", "order", "cleanup"];
const wanted = process.argv.slice(2).length ? process.argv.slice(2) : order;
for (const p of wanted) {
  if (!phases[p]) throw new Error(`unknown phase ${p}; one of ${order.join(", ")}, restore`);
  await phases[p]();
}
console.log("\ndone:", wanted.join(", "));
