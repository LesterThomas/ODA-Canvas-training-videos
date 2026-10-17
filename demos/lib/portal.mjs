// Canvas Portal helpers for captures. Credentials come from demos/.env (gitignored).

/** Sign in. With `show`, the typing is paced for the camera; otherwise it is instant. */
export async function portalLogin(c, env, { show = false } = {}) {
  const { page, typeInto, clickOn, mark, sleep } = c;
  await page.goto(env.PORTAL_URL);
  await page.getByPlaceholder("Username").waitFor();
  if (show) {
    mark("login");
    await typeInto(page.getByPlaceholder("Username"), env.PORTAL_USER);
    await typeInto(page.getByPlaceholder("Password"), env.PORTAL_PASSWORD, { delay: 25 });
    await clickOn(page.getByRole("button", { name: /sign in/i }), { pause: 200 });
  } else {
    await page.getByPlaceholder("Username").fill(env.PORTAL_USER);
    await page.getByPlaceholder("Password").fill(env.PORTAL_PASSWORD);
    await page.getByRole("button", { name: /sign in/i }).click();
  }
  await page.getByText("Canvas Cluster").first().waitFor();
  await sleep(1200); // let dashboard cards load
  mark("dashboard");
}

/** Sidebar navigation item by its label (Dashboard, Inventory, Deploy, Operators, …).
 *  The sidebar is first in the DOM, so the first exact match is the menu item. */
export const sideItem = (page, label) => page.getByText(label, { exact: true }).first();
