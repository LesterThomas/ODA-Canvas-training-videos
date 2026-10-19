# Live demos: Component Directory, Canvas Portal, helm and kubectl

Use these standing processes so viewers see the **real** experience, not a mock-up:

- **Which components are available** → browse the public **ODA Component Directory**.
- **Any part of the Canvas** (components, APIs, operators, observability, deploy) → show the
  **Canvas Portal**, and next to it the **helm or kubectl** commands that show the same thing.

Everything is recorded with Playwright into `videos/public/captures/` and then edited in Remotion
(segments, labels, terminal replays). Each live slide's script **Visual** names the capture it uses.

## Layout

```
demos/
├── .env                    PORTAL_URL, PORTAL_USER, PORTAL_PASSWORD, DIRECTORY_URL (gitignored)
├── .env.example            template (committed)
├── lib/capture.mjs         startCapture(): 1920×1080 video, injected cursor and click ripples, mark(), moveTo/clickOn/hover/typeInto/scrollBy, declineCookies(), hideClutter()
├── lib/portal.mjs          portalLogin(), sideItem()
├── directory/*.mjs         Component Directory tours
├── portal/*.mjs            Canvas Portal tours (one per slide)
└── cli/capture-cli.mjs     named sessions of read-only helm/kubectl commands → <session>.cli.json
videos/public/captures/     <name>.webm + <name>.marks.json, <session>.cli.json (committed: source assets)
```

Run from the repo root, for example `node demos/portal/portal-inventory.mjs` or
`node demos/cli/capture-cli.mjs cli-deploy`. Install once with `cd demos && npm i` (Playwright 1.58).
Each run prints its marks: `[12.8s] tmfc001`. Use them to set the Remotion segments.

## ODA Component Directory (tmforum.org)

- Map: `https://www.tmforum.org/oda/directory/components-map`. Component pages are
  `…/components-map/<domain-slug>/<TMFCxxx>`, for example `core-commerce-management/TMFC001`. The
  map also lists the **Canvas operators** (TMFOP001–011) next to the business domains.
- **Good components to drill into:** TMFC001 Product Catalog, TMFC002 Product Order Capture &
  Validation, TMFC005 Product Inventory, TMFC006 Service Catalog, TMFC007 Service Order,
  TMFC008 Service Inventory, TMFC043 Fault Management, TMFC023 Party Interaction. The first six also
  have reference charts in the Portal's `reference-example-components` repo, so a directory page can
  be paired with a Portal deploy of the same component.
- **Sections of a component page** (scroll order): description and metadata (function block, id,
  version, status, published date) → **Component resources** (YAML specification, component
  specification, conformance profile, CTK, reference implementation; some pages also have BDD
  feature files) → **Exposed APIs** (mandatory and optional) → **Dependent APIs** → **Certified
  component conformance** (vendor products) → providers with mandatory APIs certified.
- **Cloudflare bot check:** headless Chromium gets "Performing security verification". Record
  tmforum.org pages in a **visible Chrome window**: `startCapture(name, { headless: false, channel:
  "chrome" })`, which loads normally. **Never try to bypass a bot check.** If one ever appears in
  the visible window, a person completes it there.
- **Cookie banner:** it appears a few seconds after load. `declineCookies()` waits for it and
  declines non-essential cookies (the privacy-preserving choice).
- **Clutter:** an "ODA support" survey pop-up and the Cookiebot badge. Hide them with
  `hideClutter()` (CSS only, re-applied on a timer). Call it again after each navigation.
- Map cards are `div.cursor-pointer` containers. Click the container, not the text (see
  `card()` in `directory/directory-tour.mjs`). Wait for content with `getByText(...).waitFor()`,
  never `networkidle`: analytics keep the network busy.
- Narrate vendor names neutrally ("the products certified against it"). Don't single one out.

## Canvas Portal (local reference Canvas)

- URL and credentials are in `demos/.env`. It's a local test instance, so the user has said the
  credentials are not sensitive, but keep them out of committed files and chat anyway.
  `portalLogin(c, env)` signs in instantly; `{ show: true }` types it on camera instead.
- Routes, from the sidebar: Dashboard `/` · Components: Inventory `/components`, Deploy
  `/components/deploy`, Lifecycle · APIs: Exposed APIs `/exposedapis` (tabs for APIs, Dependent
  APIs, API Gateway, Service Mesh, API Policies; Table and Graph views), Dependent APIs, Gateway,
  Service Mesh, Policies · AI: Model Gateway, TMF AI Agents · Platform: Operators `/operators`,
  Observability, BDD. Use `sideItem(page, "Operators")` to click menu items.
- Deploy modal: Repository select (`.ant-select` 0) → Chart select (1) → Version (2) → Release Name
  (placeholder "e.g. my-productcatalog") → Namespace (3) → "Next: Edit Values & Install".
  **Stop before installing** unless the slide is about a real install. Use a release name that
  doesn't already exist, or the portal shows "Release … already exists" on screen.
- **Check the demo environment is healthy first.** `kubectl get components -A` should show
  `Complete`, the dashboard should say "N ready", and no pods should be in `ImagePullBackOff`.
  Recording a broken state teaches the wrong thing.
  - Known issue (Oct 2026): `oda-components/productcatalog` **1.4.5** pulls
    `tmforumodacanvas/*:1.0.0` images that aren't on Docker Hub, so it sticks at
    `In-Progress-CompCon`. The upstream test chart
    `feature-definition-and-test-kit/testData/productcatalog-v1` (images `lesterthomas/*`) works.
    The demo cluster runs it as release **r1** in `components`. Ask the user before changing their
    cluster.

## helm and kubectl

- Add a named session to `SESSIONS` in `demos/cli/capture-cli.mjs` and run it. It executes the
  commands for real and saves the command, output and exit code, plus the kube context and a
  timestamp.
- **Only read-only commands** (`get`, `list`, `describe`, `helm list/status`). **Never invent or
  edit output.** If the slide needs an install, either record a real one, or show the read-only
  state of an equivalent release and label it honestly (slide 21 says "release r1 · same chart,
  deployed earlier").
- Good pairings: the operators slide with `kubectl get deployments -n canvas`; a deploy with
  `helm list -n components`, `kubectl get components -n components` and `kubectl get exposedapis -n
  components`; identity with `kubectl get identityconfigs -n components`; and
  `kubectl get crds | grep oda.tmforum.org` for the resource types.

## Keycloak and other live actions (deck 03 onwards)

Some demos must **change** the cluster on camera: install components, load data, grant roles, send an
order, uninstall. Do this only with the user's approval for that demo. Use these tools:

- **`demos/lib/live-cli.mjs`**: `recordSession(name, steps, {cwd})` runs real commands in Git Bash and
  saves `<name>.cli.json` (the format `<Terminal>` replays, plus `live: true`). Steps can include
  `{wait: async () => …}` entries, which run without being recorded, such as waiting for `Complete`. Run the
  commands from a checkout of the charts, so the on-screen paths are short (`charts/ProductCatalog`).
- **`demos/lib/keycloak.mjs`**: `kcLogin` (off camera, onto realm `odari`), `kcShowMoreClients`
  (20 per page, so new clients aren't on page 2), `kcOpenClient(c, id, tab)`, and
  `kcAssignClientRole(c, roleClient, role)` (Service accounts roles → Assign role → Filter by clients →
  search → tick → Assign). It also has a small admin REST client (`kcClientRoles`, `kcGrantClientRole`,
  `until`), so a script can wait for an operator to finish before it records the result.
- **One script per demo, in phases** (`demos/auth/record-demo.mjs`), plus a `reset` phase and a
  `restore` phase that rebuilds a mid-demo state off camera. A bad take is then one phase to redo, not
  the whole demo.

Keycloak 20 admin-console traps:
- **Lists don't refetch** when you click the tab or menu item you're already on. To show a change
  (new roles, deleted clients), re-open the client from the list, or reload the page, as a person would.
  Otherwise the capture shows stale data while the API already has the new state.
- **Service-account users aren't listed** under Users. Grant a client's service account a role from
  that client's **Service accounts roles** tab.
- In the Assign role dialog, a row reads `<client badge><role>` with no space between them. Match the
  client and the role as separate plain-text filters, not as one word-boundary regex.

`<Terminal>` options for long or streaming output: `stopAt` shows a step's output up to a given line
(the run as it looked at that moment, for example before newman's summary and Node's TLS warning) without
editing it. `outputDur` reveals long output over a few seconds. `wrap` wraps long curl commands.

## Remotion side

- **`CaptureClip`** (`lib/CaptureClip.tsx`) plays a capture in browser chrome, cut into
  **segments** `{from, to, rate, url, label, zoom}` measured in capture seconds from the marks file.
  - Trim dead time by starting segments after logins and page loads.
  - Use `rate` 1.3–2.4 to speed through selections and scrolling, but keep text-heavy moments near 1.
  - The **last segment freezes** on its final frame until the slide ends (`<Freeze>`), so the poster
    frame is the final state. Don't use tiny playback rates to hold a frame: they render blank.
  - The address bar shows `url`, and the lower-third shows `label`. Don't add other pills along the
    bottom edge, because they collide with the label.
  - Fit the total segment time to the narration: list the narration beats with their times
    (words ÷ 2.5), then give each beat a segment.
- **`Terminal`** (`lib/Terminal.tsx`) replays a `.cli.json`: it types each command, then reveals the
  real output. Set `starts` to line commands up with the narration, and `highlight` to tint the
  relevant rows (a release name, "operator"). kubectl rows can be about 150 characters wide, so use
  `fontSize` 17–18 at `width` 1760, or 22 for narrower output.
- Import `.cli.json` directly (`resolveJsonModule` is on).
- Live clips are slow to render (video decode). Re-render only the slides that use them.
- **Fallback** when no live capture is possible: `lib/PortalShot.tsx` animates a cursor, highlights
  and typing over a static screenshot.

## Running BDD features from the Canvas Portal (deck 02, 2026-10-18)

The Portal's *BDD* page clones `tmforum-oda/oda-canvas` main into the backend pod and runs
cucumber there. On the demo cluster it needed two fixes (both approved by the user) before a run
could pass:

- `CONFORMANCE_KEYCLOAK_PASSWORD` in the `canvas-portal-backend` secret was empty, so every run stopped
  at "Please set the environment variables KEYCLOAK_USER…". Set it from `demos/.env`, then restart
  the backend. A `helm upgrade` of the `canvas-portal` release may reset it.
- The test kit's `installPackage` always runs `helm install … -n components --create-namespace`, and
  Helm then tries to create the namespace even when it exists. The portal's service account is
  sandboxed to `components`, so it was given a ClusterRole that can only create namespaces
  (`canvas-portal-backend-conformance-namespaces`).

Pick features that need only Helm and Kubernetes. `UC002-F001 Install Component` passes (6
scenarios). `UC016-F001` doesn't: the runner passes no `RESOURCE_INVENTORY_BASE_URL`, so its queries
go to localhost. Runs leave their `ctk` release installed, so run `helm uninstall ctk -n components`
afterwards. In recorder scripts, prefix `kubectl exec … /app/...` with `MSYS_NO_PATHCONV=1`, or Git
Bash rewrites the pod path. The history table keeps failed attempts, so cut the clip before it
scrolls into view.
