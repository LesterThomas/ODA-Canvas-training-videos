// Keycloak admin-console helpers for captures (Keycloak 20, new admin console), plus a small admin
// REST client so a script can wait for the identity operators to finish before it moves on.
// The URL and login come from demos/.env (KEYCLOAK_URL, KEYCLOAK_USER, KEYCLOAK_PASSWORD): a local
// test instance, but keep the values out of committed files and chat anyway.

/** Sign in to the admin console straight onto a realm page. Instant: trim it out in Remotion. */
export async function kcLogin(c, env, { realm = "odari", route = "clients" } = {}) {
  const { page, sleep, mark } = c;
  await page.goto(`${env.KEYCLOAK_URL}/admin/master/console/#/${realm}/${route}`);
  await page.locator("#username").fill(env.KEYCLOAK_USER);
  await page.locator("#password").fill(env.KEYCLOAK_PASSWORD);
  await page.locator("#kc-login").click();
  await page.getByText("Clients list").waitFor();
  await sleep(800);
  mark("clients");
}

/** Show up to 20 clients per page, so new component clients aren't on page 2. */
export async function kcShowMoreClients(c, perPage = 20) {
  const { page, clickOn, sleep } = c;
  await clickOn(page.getByRole("button", { name: "Items per page" }), { pause: 300 });
  await clickOn(page.getByRole("menuitem", { name: new RegExp(`^${perPage}`) }), { pause: 300 });
  await sleep(900);
}

/** Back to the clients list (the sidebar link) and wait for it. */
export async function kcClientsList(c) {
  const { page, clickOn, sleep } = c;
  await clickOn(page.locator("nav").getByRole("link", { name: "Clients", exact: true }), { pause: 300 });
  await page.getByText("Clients list").waitFor();
  await sleep(700);
}

export const kcClientLink = (page, clientId) => page.getByRole("link", { name: clientId, exact: true });

/** Open a client from the list and pick one of its tabs (Roles, Service accounts roles, …). */
export async function kcOpenClient(c, clientId, tab) {
  const { page, clickOn, sleep } = c;
  await clickOn(kcClientLink(page, clientId), { pause: 400 });
  await page.getByRole("tab", { name: "Settings" }).waitFor();
  if (tab) await kcTab(c, tab);
  await sleep(500);
}

export async function kcTab(c, name) {
  const { page, clickOn, sleep } = c;
  await clickOn(page.getByRole("tab", { name, exact: true }), { pause: 300 });
  await sleep(900);
}

/**
 * Assign one client role to the open client's service account: Service accounts roles → Assign role →
 * Filter by clients → search → tick the row for <roleClient> <role> → Assign.
 */
export async function kcAssignClientRole(c, roleClient, role) {
  const { page, clickOn, typeInto, sleep, mark } = c;
  await clickOn(page.getByRole("button", { name: "Assign role" }).first(), { pause: 600 });
  const dialog = page.getByRole("dialog");
  await clickOn(dialog.getByRole("button", { name: /Filter by realm roles/ }), { pause: 300 });
  await clickOn(page.getByRole("menuitem", { name: /Filter by clients/ }), { pause: 700 });
  await typeInto(dialog.getByPlaceholder(/Search by role name/), role);
  await page.keyboard.press("Enter");
  await sleep(1200);
  mark(`search-${role}`);
  // A row reads "<client badge><role>" with no space between them, so match each part as plain text.
  const row = dialog.getByRole("row").filter({ hasText: roleClient }).filter({ hasText: role });
  await clickOn(row.getByRole("checkbox"), { pause: 700 });
  mark(`tick-${roleClient}-${role}`);
  await clickOn(dialog.getByRole("button", { name: "Assign", exact: true }), { pause: 300 });
  await page.getByText(/Role mapping updated|successfully/i).first().waitFor({ timeout: 10000 }).catch(() => {});
  mark(`assigned-${roleClient}-${role}`);
  await sleep(1500);
}

// ---- Admin REST (not on camera) -------------------------------------------------------------

export async function kcToken(env) {
  const r = await fetch(`${env.KEYCLOAK_URL}/realms/master/protocol/openid-connect/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: "admin-cli", grant_type: "password", username: env.KEYCLOAK_USER, password: env.KEYCLOAK_PASSWORD }),
  });
  if (!r.ok) throw new Error(`Keycloak token: HTTP ${r.status}`);
  return (await r.json()).access_token;
}

async function kcGet(env, pathAndQuery) {
  const r = await fetch(`${env.KEYCLOAK_URL}/admin/realms/${env.KEYCLOAK_REALM ?? "odari"}${pathAndQuery}`, {
    headers: { Authorization: `Bearer ${await kcToken(env)}` },
  });
  if (!r.ok) throw new Error(`Keycloak GET ${pathAndQuery}: HTTP ${r.status}`);
  return r.json();
}

async function kcPost(env, pathAndQuery, body) {
  const r = await fetch(`${env.KEYCLOAK_URL}/admin/realms/${env.KEYCLOAK_REALM ?? "odari"}${pathAndQuery}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${await kcToken(env)}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`Keycloak POST ${pathAndQuery}: HTTP ${r.status}`);
}

/** Grant <roleClientId> <role> to <clientId>'s service account (off camera, e.g. to set up a retake). */
export async function kcGrantClientRole(env, clientId, roleClientId, role) {
  const [cl] = await kcGet(env, `/clients?clientId=${encodeURIComponent(clientId)}`);
  const [rc] = await kcGet(env, `/clients?clientId=${encodeURIComponent(roleClientId)}`);
  const user = await kcGet(env, `/clients/${cl.id}/service-account-user`);
  const roleRep = await kcGet(env, `/clients/${rc.id}/roles/${encodeURIComponent(role)}`);
  await kcPost(env, `/users/${user.id}/role-mappings/clients/${rc.id}`, [roleRep]);
}

/** Role names on a client, or null if the client doesn't exist. */
export async function kcClientRoles(env, clientId) {
  const [cl] = await kcGet(env, `/clients?clientId=${encodeURIComponent(clientId)}`);
  if (!cl) return null;
  return (await kcGet(env, `/clients/${cl.id}/roles`)).map((r) => r.name).sort();
}

/** Poll until `test(value)` is true for `fn()`; throws after timeoutMs. */
export async function until(fn, test, { timeoutMs = 240000, everyMs = 2000, label = "condition" } = {}) {
  const t0 = Date.now();
  for (;;) {
    let v;
    try {
      v = await fn();
    } catch (e) {
      v = e;
    }
    if (test(v)) return v;
    if (Date.now() - t0 > timeoutMs) throw new Error(`timed out waiting for ${label}; last value: ${JSON.stringify(v)}`);
    await new Promise((ok) => setTimeout(ok, everyMs));
  }
}
