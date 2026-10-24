// Shared helpers for recording browser demos with Playwright.
//
// A capture records a silent 1920x1080 video of a real site (ODA Component Directory, Canvas Portal)
// with a visible cursor and click ripples injected into the page, and writes a "marks" timeline
// ({label, t} in seconds from the start of the video) so Remotion overlays can be timed to each step.
//
// Output (per capture name): videos/public/captures/<name>.webm and <name>.marks.json
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const REPO = path.resolve(HERE, "..", "..");
export const OUT_DIR = path.join(REPO, "videos", "public", "captures");

/** Load demos/.env (KEY=VALUE lines) into an object. Credentials stay out of the repo. */
export function loadEnv() {
  const file = path.join(REPO, "demos", ".env");
  const env = {};
  if (fs.existsSync(file)) {
    for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m) env[m[1]] = m[2];
    }
  }
  return { ...env, ...process.env };
}

// Cursor + click ripple overlay, injected into every page (survives navigations).
const CURSOR_SCRIPT = `
(() => {
  if (window.__odaCursor) return;
  window.__odaCursor = true;
  const install = () => {
    if (!document.body || document.getElementById('__oda_cursor')) return;
    const c = document.createElement('div');
    c.id = '__oda_cursor';
    c.innerHTML = '<svg width="34" height="34" viewBox="0 0 24 24"><path d="M4 2l14 10-6.5 1.5L15 21l-3 1.5-3.5-7.5L4 19z" fill="#fff" stroke="#111" stroke-width="1.4"/></svg>';
    Object.assign(c.style, {position:'fixed', left:'0px', top:'0px', zIndex:2147483647, pointerEvents:'none', transform:'translate(-4px,-3px)'});
    document.body.appendChild(c);
    const pos = JSON.parse(sessionStorage.getItem('__oda_cursor_pos') || '[960,540]');
    c.style.left = pos[0] + 'px'; c.style.top = pos[1] + 'px';
    document.addEventListener('mousemove', e => {
      c.style.left = e.clientX + 'px'; c.style.top = e.clientY + 'px';
      sessionStorage.setItem('__oda_cursor_pos', JSON.stringify([e.clientX, e.clientY]));
    }, true);
    document.addEventListener('mousedown', e => {
      const r = document.createElement('div');
      Object.assign(r.style, {position:'fixed', left:(e.clientX-6)+'px', top:(e.clientY-6)+'px', width:'12px', height:'12px',
        borderRadius:'50%', border:'4px solid #E6007E', zIndex:2147483646, pointerEvents:'none',
        transition:'transform 600ms ease-out, opacity 600ms ease-out'});
      document.body.appendChild(r);
      requestAnimationFrame(() => { r.style.transform = 'scale(7)'; r.style.opacity = '0'; });
      setTimeout(() => r.remove(), 700);
    }, true);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install); else install();
})();`;

/**
 * Start a capture. Returns helpers bound to the page; call `finish()` at the end.
 * Pacing is deliberate (people need to read the screen); dead time is trimmed later in Remotion.
 */
export async function startCapture(name, { width = 1920, height = 1080, headless = true, channel, viewport } = {}) {
  // `viewport` (e.g. {width: 1280, height: 720}) records a smaller page and video, so dense UIs
  // (Prometheus, Grafana, Jaeger) read larger once CaptureClip scales the video up. Playwright pads
  // rather than scales a video larger than the viewport, so the video takes the viewport's size.
  // Unlike CSS zoom, mouse positions stay correct on canvas charts.
  const vp = viewport ?? { width, height };
  ({ width, height } = vp);
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const tmpDir = path.join(REPO, "demos", "captures", "_tmp", name);
  fs.rmSync(tmpDir, { recursive: true, force: true });
  // Public tmforum.org pages sit behind a Cloudflare bot check that rejects headless Chromium; record
  // those in a normal, visible Chrome window (headless: false, channel: "chrome"). Never try to
  // bypass a bot check: if one appears, a person completes it in that window.
  const browser = await chromium.launch({ headless, ...(channel ? { channel } : {}) });
  const context = await browser.newContext({
    viewport: vp,
    deviceScaleFactor: 1,
    recordVideo: { dir: tmpDir, size: { width, height } },
    locale: "en-GB",
  });
  await context.addInitScript(CURSOR_SCRIPT);
  const page = await context.newPage();
  const t0 = Date.now();
  const marks = [];
  let mouse = { x: vp.width / 2, y: vp.height / 2 };

  const sleep = (ms) => page.waitForTimeout(ms);
  const mark = (label) => {
    marks.push({ label, t: +((Date.now() - t0) / 1000).toFixed(2) });
    console.log(`  [${marks.at(-1).t.toFixed(1)}s] ${label}`);
  };

  /** Glide the cursor to (x, y) so the motion is visible on video. */
  async function moveTo(x, y, ms = 700) {
    const steps = Math.max(8, Math.round(ms / 16));
    const from = { ...mouse };
    for (let i = 1; i <= steps; i++) {
      const k = i / steps;
      const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; // ease in-out
      await page.mouse.move(from.x + (x - from.x) * e, from.y + (y - from.y) * e);
      await sleep(ms / steps);
    }
    mouse = { x, y };
  }

  /** Move to an element's centre (scrolling it into view first) and click it. */
  async function clickOn(locator, { pause = 500, moveMs = 800 } = {}) {
    const el = locator.first();
    await el.scrollIntoViewIfNeeded();
    const box = await el.boundingBox();
    if (!box) throw new Error(`no box for ${locator}`);
    await moveTo(box.x + box.width / 2, box.y + box.height / 2, moveMs);
    await sleep(200);
    await page.mouse.down();
    await page.mouse.up();
    await sleep(pause);
  }

  /** Hover an element (for highlighting while narrating) without clicking. */
  async function hover(locator, { pause = 600, moveMs = 800 } = {}) {
    const el = locator.first();
    await el.scrollIntoViewIfNeeded();
    const box = await el.boundingBox();
    if (box) await moveTo(box.x + box.width / 2, box.y + box.height / 2, moveMs);
    await sleep(pause);
  }

  /** Type into a field at a human pace. */
  async function typeInto(locator, text, { delay = 70 } = {}) {
    await clickOn(locator, { pause: 150 });
    await page.keyboard.type(text, { delay });
  }

  /** Smooth scroll by dy pixels over ms. */
  async function scrollBy(dy, ms = 1200) {
    const steps = Math.max(10, Math.round(ms / 16));
    for (let i = 0; i < steps; i++) {
      await page.mouse.wheel(0, dy / steps);
      await sleep(ms / steps);
    }
  }

  /** Hide floating clutter that isn't part of what we're teaching (survey pop-ups, consent badges).
   *  Cosmetic only: elements are hidden with CSS, page content is untouched. Re-applied on a timer
   *  because these widgets mount late. */
  async function hideClutter({ texts = ["ODA support:"], selectors = ["#CookiebotWidget"] } = {}) {
    await page.evaluate(({ texts, selectors }) => {
      const run = () => {
        for (const sel of selectors) document.querySelectorAll(sel).forEach((e) => (e.style.display = "none"));
        for (const t of texts) {
          const walker = document.evaluate(`//*[contains(text(), "${t}")]`, document, null, 7, null);
          for (let i = 0; i < walker.snapshotLength; i++) {
            let n = walker.snapshotItem(i);
            while (n && n !== document.body && getComputedStyle(n).position !== "fixed") n = n.parentElement;
            if (n && n !== document.body) n.style.display = "none";
          }
        }
      };
      run();
      if (!window.__odaClutter) window.__odaClutter = setInterval(run, 400);
    }, { texts, selectors });
  }

  /** tmforum.org shows a Cookiebot banner a few seconds after load: decline non-essential cookies. */
  async function declineCookies(timeout = 10000) {
    const deny = page.locator("#CybotCookiebotDialogBodyButtonDecline");
    try {
      await deny.waitFor({ state: "visible", timeout });
      await deny.click();
      await deny.waitFor({ state: "hidden", timeout: 5000 });
    } catch {
      /* no banner this time */
    }
  }

  async function finish() {
    const video = page.video();
    await context.close();
    await browser.close();
    const src = await video.path();
    const dst = path.join(OUT_DIR, `${name}.webm`);
    fs.copyFileSync(src, dst);
    fs.writeFileSync(path.join(OUT_DIR, `${name}.marks.json`), JSON.stringify({ name, width, height, marks }, null, 1));
    fs.rmSync(tmpDir, { recursive: true, force: true });
    console.log(`saved ${dst} (${marks.length} marks, ${((Date.now() - t0) / 1000).toFixed(1)}s)`);
  }

  return { page, mark, sleep, moveTo, clickOn, hover, typeInto, scrollBy, declineCookies, hideClutter, finish };
}
