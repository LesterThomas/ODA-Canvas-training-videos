// Deck 04 (The AI-Native ODA Canvas): record the demo segments.
//
//   gateway  SIMULATED. Canvas Portal › AI › Model Gateway on the real Portal, with the Portal's
//            /api/model-gateway-services routes answered from model-gateway.fixture.json, because the
//            Model-as-a-Service operator and its CRD are not installed on the demo Canvas (user,
//            2026-10-19). Nothing reaches the cluster: the list, the token, the model list and the chat
//            reply all come from the fixture. The clip labels itself "Simulated" in Remotion.
//   github   The public oda-canvas repository on GitHub: AGENTS.md at the root and in source/operators,
//            then skills/ and skills/create-oda-operator/SKILL.md.
//
// Usage (repo root): node demos/ai/record-demo.mjs [phase …]   (no arguments = all)
// Outputs: videos/public/captures/ai-*.{webm,marks.json}
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv, startCapture } from "../lib/capture.mjs";
import { portalLogin, sideItem } from "../lib/portal.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const fixture = JSON.parse(fs.readFileSync(path.join(HERE, "model-gateway.fixture.json"), "utf8"));
const env = loadEnv();
const log = (s) => console.log(`\n=== ${s}`);
const REPO_URL = "https://github.com/tmforum-oda/oda-canvas";
/** A visible file or folder link in a GitHub listing (GitHub labels them "name, (File)" / "name, (Directory)"). */
const ghLink = (page, name) => page.locator(`a[aria-label^="${name}, ("]:visible`).first();

/** Answer the Portal's Model Gateway API from the fixture (with a short, realistic delay). */
async function simulateModelGateway(page) {
  await page.route(/\/api\/model-gateway-services(\/.*)?(\?.*)?$/, async (route) => {
    const url = new URL(route.request().url());
    const sub = url.pathname.replace(/^.*\/api\/model-gateway-services/, "");
    const body =
      sub === "" ? fixture.list
      : sub === "/availability" ? { available: true }
      : sub === "/proxy/token" ? fixture.token
      : sub === "/proxy/models" ? fixture.models
      : sub === "/proxy/chat" ? fixture.chat
      : null;
    if (!body) return route.fulfill({ status: 404, json: { detail: "not simulated" } });
    await new Promise((r) => setTimeout(r, sub.startsWith("/proxy") ? 700 : 150));
    await route.fulfill({ status: 200, json: body });
  });
}

const phases = {
  async gateway() {
    log("gateway (simulated)");
    const c = await startCapture("ai-gateway");
    const { page, mark, sleep, clickOn, hover, typeInto } = c;
    await simulateModelGateway(page);
    await portalLogin(c, env);
    await clickOn(sideItem(page, "Model Gateway"), { pause: 400 });
    await page.getByText("Model Gateway Services").first().waitFor();
    await sleep(1500);
    mark("list");
    const rows = page.locator(".ant-table-row");
    for (const name of ["primary-llm-high-reasoning", "open-llm-medium-reasoning", "primary-llm-fast", "open-multimodal"]) {
      await hover(rows.filter({ hasText: name }).first().locator("td").first(), { pause: 1100 });
    }
    mark("models");
    const row = rows.filter({ hasText: "primary-llm-medium-reasoning" }).first();
    await hover(row.locator("code").first(), { pause: 1500 });
    mark("endpoint");
    await clickOn(row.locator("td").last().locator("button").first(), { pause: 900 });
    await page.getByText("1. Get token").waitFor();
    mark("test");
    const drawer = page.locator(".ant-drawer-content");
    await typeInto(drawer.getByPlaceholder("Keycloak client id for this MGS"), "productcatalog-component");
    await typeInto(drawer.locator("input[type=password]").first(), "simulated-secret", { delay: 40 });
    await clickOn(drawer.getByRole("button", { name: /request token/i }), { pause: 1500 });
    mark("token");
    await clickOn(drawer.getByRole("button", { name: /get models/i }), { pause: 1500 });
    mark("listed");
    const prompt = drawer.locator("textarea").filter({ hasText: /introduce yourself/ }).first();
    await clickOn(prompt, { pause: 200 });
    await page.keyboard.press("Control+A");
    await page.keyboard.type("In one sentence, what does a product catalog component do?", { delay: 45 });
    await sleep(500);
    await clickOn(drawer.getByRole("button", { name: /send chat/i }), { pause: 800 });
    await drawer.getByText(/chatcmpl-simulated/).waitFor();
    await drawer.locator(".ant-drawer-body").evaluate((el) => el.scrollTo({ top: el.scrollHeight, behavior: "smooth" }));
    await c.moveTo(900, 860, 900);
    await sleep(600);
    mark("reply");
    await sleep(4000);
    await c.finish();
  },

  async github() {
    log("github");
    const c = await startCapture("ai-github");
    const { page, mark, sleep, clickOn, hover, scrollBy } = c;
    // GitHub's layout is narrow at 1920 px: zoom it so the text reads on video (cosmetic only).
    await page.context().addInitScript(() => {
      const z = () => document.documentElement && (document.documentElement.style.zoom = "1.4");
      z(); document.addEventListener("DOMContentLoaded", z);
    });
    await page.goto(REPO_URL);
    await ghLink(page, "AGENTS.md").waitFor();
    await sleep(1500);
    mark("repo");
    await hover(ghLink(page, "AGENTS.md"), { pause: 1500 });
    mark("agents-root");
    await clickOn(ghLink(page, "AGENTS.md"), { pause: 1500 });
    await page.locator("article").first().waitFor();
    await sleep(1000);
    mark("agents-open");
    await scrollBy(700, 2500);
    await sleep(1200);
    mark("agents-arch");
    await scrollBy(900, 2500);
    await sleep(1800);
    mark("agents-do");
    await page.goto(`${REPO_URL}/blob/main/source/operators/AGENTS.md`);
    await page.locator("article").first().waitFor();
    await sleep(1500);
    mark("operators-agents");
    await scrollBy(600, 2500);
    await sleep(2000);
    mark("operators-pattern");
    await page.goto(`${REPO_URL}/tree/main/skills`);
    await ghLink(page, "create-oda-operator").waitFor();
    await sleep(1500);
    mark("skills");
    await hover(ghLink(page, "create-oda-operator"), { pause: 1500 });
    await clickOn(ghLink(page, "create-oda-operator"), { pause: 1200 });
    await ghLink(page, "SKILL.md").waitFor();
    await sleep(800);
    await clickOn(ghLink(page, "SKILL.md"), { pause: 1500 });
    await page.locator("article").first().waitFor();
    await sleep(1200);
    mark("skill-open");
    await scrollBy(600, 2500);
    await sleep(1800);
    mark("skill-tech");
    await scrollBy(700, 2500);
    await sleep(2500);
    mark("skill-table");
    await c.finish();
  },
};

const wanted = process.argv.slice(2);
for (const [name, fn] of Object.entries(phases)) if (!wanted.length || wanted.includes(name)) await fn();
