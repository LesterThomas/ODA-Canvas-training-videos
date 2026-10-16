# ODA Canvas Video Update Plan

This plan covers every recorded video that the upstream
[tmforum-oda/oda-canvas](https://github.com/tmforum-oda/oda-canvas) documentation links to. It sets out
what is out of date in each one and how to replace it using the pipeline in [spec.md](spec.md): a `.pptx`
with source videos and speaker notes, handed to `presentation-generator`.

- **Upstream baseline:** `oda-canvas` `main` @ `c39da6340dbc971981bcb1eea5da5d718fac11d2`
  (15 Oct 2026). Chart `canvas-oda` version `1.2.6-rc5`, component spec `v1`. Latest tagged
  release in README: **1.2.5** (March 2026).
- **Review date:** 16 Oct 2026.
- **Original transcripts:** Video 1 is in [presentations/](../presentations/Introduction%20to%20the%20ODA%20Canvas%20original%20script.md).
  Videos 2–5 are in [presentations/transcripts/](../presentations/transcripts/), taken from YouTube
  captions.
- **Updated scripts:** one per deck in [scripts/](../scripts/).

---

## 1. Video inventory

Doing a full-text search of the repo (all `*.md` plus non-markdown files) for `youtu`, `vimeo`, `.mp4`
and `video` finds **5 distinct recorded videos**. All are on the *Systems Architecture* YouTube channel.

| # | Video (YouTube title) | ID | Length | Linked from (upstream) | New deck / script |
|---|---|---|---|---|---|
| 1 | ODA Canvas introductory video | `B5lF94l-Dek` | 22:40 | `README.md:25` | [01-introduction-to-the-oda-canvas.md](../scripts/01-introduction-to-the-oda-canvas.md) |
| 2 | How do I buy or build an OCA Canvas? *(typo in title)* | `dYyyCDPlVHY` | 7:14 | `source/operators/README.md:9` | [02-how-do-i-buy-or-build-an-oda-canvas.md](../scripts/02-how-do-i-buy-or-build-an-oda-canvas.md) |
| 3 | ODA Canvas Authentication and Authorization deep-dive | `w0iQv9FtuiM` | 14:11 | `Authentication-design.md:7` | [03-authentication-and-authorization.md](../scripts/03-authentication-and-authorization.md) |
| 4 | AI Native ODA Canvas | `MICzwN8VB_o` | 30:32 | `AI-Native-Canvas-design.md:7`, `:314–326` (9 chapter deep-links) | [04-ai-native-oda-canvas.md](../scripts/04-ai-native-oda-canvas.md) (two parts) |
| 5 | Carbon Aware Software | `I78MSow6RQg` | 13:25 | `source/operators/TMFOP011-Carbon-Management/README.md:6` | [05-carbon-aware-software.md](../scripts/05-carbon-aware-software.md) |

`docs/writing-style.md:392–396` has a placeholder (`VIDEO_ID`) showing how to embed videos. It isn't a
real video.

### Link problems found in the upstream docs (fix with or before the re-publish)

1. **`README.md:25`: the thumbnail and the link point at different videos.** The image is the
   *buy-or-build* thumbnail (`dYyyCDPlVHY`) and its alt text says "How do I buy or build an ODA
   Canvas?", but it links to the *introductory* video (`B5lF94l-Dek`). Readers see one video advertised
   and land on another.
2. **The YouTube title for `dYyyCDPlVHY` says "OCA Canvas"** where it should say "ODA Canvas".
3. **The `AI-Native-Canvas-design.md` chapter deep-links (`&t=…`)** will break if Video 4 is split or
   re-cut. Regenerate them from the new video.
4. Every embed uses YouTube's default thumbnail (`img.youtube.com/vi/<id>/0.jpg`) except
   `Authentication-design.md`, which uses a local PNG (`Authentication-video.png`). Pick one convention
   for the new videos. Using the default thumbnail means no image file to maintain.
5. A related doc inconsistency, not a video link: `source/operators/TMFOP003-Identity-Config/keycloak/README.md`
   still describes dynamic roles via TMF669, but the parent `TMFOP003…/README.md` says TMF672. Fix it
   before Video 3 is re-recorded.

---

## 2. What has changed in the Canvas since the videos were recorded

These facts were checked against the repo at the baseline commit. Every script draws on them, so they
are collected here once.

| Topic | What the videos say | What the repo says now | Source |
|---|---|---|---|
| Maturity | "Horizon 2 … new features we believe we need for launch" | Canvas is **generally available**: `v1` component spec (Dec 2024), releases 1.2.0 → 1.2.5 (Mar 2026), `1.2.6-rc5` on main. The reference implementation "will be used for ODA Component certification". | `README.md`, `release-notes/ReleaseNotes.md` |
| Operator catalogue | Informal list of operator types | A numbered catalogue: **TMFOP001** Component Mgmt, **002** API Mgmt, **003** Identity Config, **004** Credentials Mgmt, **005** Dependency Mgmt, **006** Event Mgmt *(planned)*, **007** Secrets Mgmt, **008** OAuth2 Config, **009** Model-as-a-Service *(planned)*, **010** Disruption Budget Mgmt, **011** Carbon Mgmt. Cost Control and Database Mgmt are listed as planned. | `source/operators/README.md` |
| API operators | 6: Kong, APISIX, Istio, Google, Microsoft, Whale Cloud | **Still 6**: Apache APISIX, Kong, Istio, Azure API Management, Google Apigee, Whale Cloud. Istio is the default and only one API operator can be enabled at a time. Kong and APISIX still run on Istio internally. | `TMFOP002…/README.md`, `installation/README.md` |
| API policies | "how the canvas configures API gateways to enforce … future video" (Video 3) | **Done.** `ExposedAPI` / `gatewayConfiguration` supports `apiKeyVerification`, `rateLimit`, `quota`, `OASValidation` and `CORS`. The Portal has *Gateway*, *Service Mesh* and *Policies* views. | `TMFOP002…/README.md`, portal `Sidebar.tsx` |
| Identity | Keycloak and Entra ID; roles static or dynamic | Same two operators. Dynamic roles now use **TMF672** (`permissionSpecificationSetAPI`). TMF669 `partyRoleAPI` is being deprecated. `controllerRole` was **renamed `canvasSystemRole`** (v1beta4). | `TMFOP003…/README.md`, ReleaseNotes |
| New identity-related operators | — | **Credentials Mgmt** (writes component client credentials into Kubernetes secrets), **Dependency Mgmt using Keycloak authorization** (a dependency only resolves after a Keycloak role grant), **OAuth2 Config** (Envoy filter, prototype). | TMFOP004/005/008 READMEs |
| Observability | "Observability config operators" for Prometheus/Grafana/Kiali, Google, Microsoft, Datadog | **There is no separate observability operator in the TMFOP list.** The API operator configures metrics scraping through `openMetricsImplementation`: `ServiceMonitor` (default), `DataDogAnnotations`, or `PrometheusAnnotation` (for managed Prometheus such as Azure). The reference stack is Prometheus + Grafana + **Jaeger** + OpenTelemetry Collector (`charts/observability-stack`); Kiali is no longer mentioned. **Google and Microsoft "managed observability operators" do not appear in the repo, so don't claim them.** | `TMFOP002…/istio/README.md`, `UC006`, `charts/observability-stack/README.md` |
| Secrets | "a Secrets Vault" | HashiCorp Vault, **JWT/OIDC-based with no bootstrap credentials** (UC014), installed by default (`canvas-vault`). | `UC014`, `installation/README.md` |
| AI | "experimental … AI management operator" | **AI-Native Canvas** design epic: `apiType: mcp` in the component spec, agentic components, `dependentModels`, an AI/Model Gateway, evaluation, and a use-case registry. Portal v2 has **Model Gateway** (`ModelGatewayService` CRD, `v1alpha1`) and **TMF AI Agents** pages. TMFOP009 is still "*Implementation Planned*", so call it experimental. | `AI-Native-Canvas-design.md`, portal `api/modelGateway.ts` |
| Carbon | "planned operator" (Videos 1 and 2) | **Implemented**: KEDA-based Carbon Management operator, `CarbonManagement` CRD `v1alpha1`, TMF628 carbon-intensity service, Helm charts `carbon-management-operator` and `carbon-intensity-service`. Time-shift scheduling is still planned. | `TMFOP011…/README.md` |
| Registry and discovery | Shown as a demo in Video 4 | **In the chart by default**: `resource-inventory` (TMF639), `component-registry`, `canvas-info-service` (TMF638 service inventory). There is a TMF639 MCP server with **Helm tools**, so an agent can install components, and a multi-canvas service-discovery demo. | `charts/canvas-oda/values.yaml`, `source/tmf-services/MCP_Resource_Inventory/README.md`, `demos/` |
| Availability | — | **Disruption Budget Mgmt** (PDB operator), enabled by default. | TMFOP010 |
| Tooling / developer experience | "Canvas portal and a set of tools", "Innovation Hub dashboard" | **Canvas Portal v2** with sections Dashboard · Components (Inventory/Deploy/Lifecycle) · APIs (Exposed/Dependent/Gateway/Service Mesh/Policies) · AI (Model Gateway/TMF AI Agents) · Platform (Operators/Observability/BDD). There are AI coding-assistant **skills** (`canvas-ops-tutorial`, `create-oda-operator`, `write-bdd-feature`, …) and a devcontainer. | `canvas-portal-v2/`, `skills/`, `ai-coding-assistants.md` |
| Tested platforms | "tested across all the major Kubernetes cloud platforms" | EKS, AKS, GKE, Rancher, MicroK8s, Minikube, Docker Desktop, **Kind (used in all CI)**, K3s. | `installation/README.md` |
| Buy-or-build | Public cloud / roll your own / vendors | Unchanged, plus PoC demonstrations at DTW Copenhagen from **AWS, Azure, China Mobile, Google Cloud and Oracle Cloud**. | `Canvas-design.md` |
| Open API stats | "over 900,000 downloads … over 50,000 developers" | TM Forum's own site says **over 1 million downloads (Feb 2025)**. Its developer figure is about 50,000 (undated). **Confirm before recording.** | [tmforum.org/open-digital-architecture/about-open-apis](https://www.tmforum.org/open-digital-architecture/about-open-apis/) |

---

## 3. Per-video assessment and update approach

**Urgency** means how misleading the current video is today. **Effort** means how much of it has to be
rebuilt.

### Video 1: Introduction to the ODA Canvas (22:40)
- **Urgency: high.** It is the front-door video on the repo README. It calls GA features "launch
  features", carbon "planned" and AI "experimental only". It lists observability operators that don't
  exist in the repo and has no Portal.
- **Approach:** follow the existing [spec-introduction.md](spec-introduction.md) 26-slide outline.
  Update the facts using §2 and target 8–9 minutes. Retire the three "Horizons" framing, which is out
  of date. Replace it with "what's available today / what's experimental / what's planned", built from
  the TMFOP catalogue.
- **Effort:** high. Mostly new 3B1B animation, plus two short Portal demo clips.

### Video 2: How do I buy or build an ODA Canvas? (7:14)
- **Urgency: medium.** The structure is still right. The operator list is stale (carbon is shown as
  future, observability is framed as an operator, and AI is "planned").
- **Approach:** keep the same three-option narrative and the same "a few examples of operator types"
  walk-through, using the TMFOP numbering. Add the DTW Copenhagen cloud PoCs and the "validate with the
  BDD test kit" message. Fix the title typo when republishing. The source slides are deck slides 30–37.
- **Effort:** low–medium. It is a concept deck that reuses the operator-catalogue animation from Video 1.

### Video 3: Authentication and Authorization deep-dive (14:11)
- **Urgency: high.** The live demo shows YAML using `controllerRole` (renamed) and the dynamic-roles API
  that is being deprecated (TMF669). It also predates three operators that change the story:
  Credentials Mgmt, Keycloak-authorised Dependency Mgmt, and OAuth2 Config. It promises a future video on
  gateway enforcement, which now exists as a feature.
- **Approach:** keep the "three questions" structure. Re-record the Keycloak demo on a current canvas
  using `productcatalog-static-roles-v1` and `productcatalog-dynamic-roles-v1`. Add a new fourth beat:
  "granting a role resolves a dependency", which is the Keycloak-authz dependency operator. End with
  pointers to API policies and internal authentication.
- **Effort:** high. Mostly a new demo capture (Keycloak admin console, the Portal, and `kubectl`).

### Video 4: AI Native ODA Canvas (30:32)
- **Urgency: low–medium.** The content is recent and the design doc was written from it. What has
  changed is that the Portal now has Model Gateway and TMF AI Agents pages, the MCP server can now run
  Helm, and MCP is in the component test data. It is also far too long for the series format.
- **Approach:** split it into **Part 1, "Agents and the ODA Component model"** (MCP, agentic components,
  dependent models, AI gateway, about 9 min) and **Part 2, "Operating AI agents at scale"** (Canvas AI
  services, end-to-end data and AI architecture, resource inventory via MCP, classical ML, evaluation,
  about 9 min). Use neutral narration and generalise the first-person and company-specific references
  ("at Vodafone…" becomes "a typical CSP…").
- **Effort:** medium. Most diagrams already exist in `images/AI-Native Canvas/`, so redraw them in
  Remotion. Add new demo clips for the Model Gateway page and an MCP agent session.

### Video 5: Carbon Aware Software (13:25)
- **Urgency: low.** It is accurate about the implemented operator. It only needs to be tied to the
  TMFOP011 naming, the CRD and chart names, and the reproducible scenario in the repo.
- **Approach:** tighten it to about 7 minutes. Keep the three pillars (time, location, demand shaping)
  and the high-carbon versus low-carbon experiment. Add a short demo of the `CarbonManagement` resource
  and the Grafana panels from `carbon-aware-scaling-scenario.md`. Keep the credit to the developer
  (Adarsh) on screen.
- **Effort:** medium. Graphs need recapturing from a live run, or redrawing from the scenario data.

---

## 4. Production order

1. **Video 1 (Introduction).** It sets the shared Remotion theme, the "Lego block" component, the
   capability map and the **operator-catalogue animation** that Videos 2 and 3 reuse. It also fixes the
   front-door README link.
2. **Video 2 (Buy or build).** Short, and almost entirely reuses assets from Video 1. A quick win.
3. **Video 3 (AuthN/AuthZ).** It needs the demo cluster with Keycloak, so stand that up once and
   capture its clips together with Video 1's Portal clips.
4. **Video 5 (Carbon).** It needs KEDA, the observability stack and the carbon services on the same
   cluster.
5. **Video 4 (AI Native, two parts).** Its demos depend on the most experimental pieces (Model Gateway
   CRD, MCP servers), which are the most likely to change in the next few weeks, so record them last.

## 5. Shared demo environment (one cluster, all captures)

- Kind or Docker Desktop. On kind, give the `istio-ingress` service an address **before** installing
  components, or the ExposedAPIs stay at `In-Progress-CompCon` (issue #621 in `installation/README.md`).
- `helm install canvas oda-canvas/canvas-oda -n canvas --create-namespace` with Istio as the API
  operator, the defaults (Keycloak, Vault, PDB, resource inventory, component registry, canvas info
  service), and **no `--wait`**.
- `charts/observability-stack` installed in `monitoring` with
  `openMetricsImplementation=ServiceMonitor` (Videos 1 and 5).
- `canvas-portal-v2` installed from `canvas-portal-v2/helm/canvas-portal`. Use the Keycloak login, and
  hide the default-credential warning before capture.
- Components installed from the `oda-components` Helm repo or `feature-definition-and-test-kit/testData`:
  `productcatalog-v1`, `productcatalog-static-roles-v1`, `productcatalog-dynamic-roles-v1` (MCP),
  `productinventory-v1`, and `ProductOrderCaptureAndValidation` (carbon scenario).
- Video 5 also needs KEDA plus the `carbon-intensity-service` and `carbon-management-operator` charts.
- Video 4 needs the `ModelGatewayService` CRD and the gateway backend that the Portal's *Model Gateway*
  page reads. **Confirm with the AI-Native work-stream which chart installs these**, because none of the
  `charts/` folders does today.
- Record the exact image tags in each script's front-matter. Re-check for upstream drift before
  capture (spec.md §10).

## 6. Republish checklist (per video)

- [ ] Deck built and handed to `presentation-generator`. Check the rendered `.mp4`.
- [ ] Upload with the corrected title and a description that links to the repo, the relevant doc and
      the component directory. Add chapters.
- [ ] Open an upstream PR updating the embed (and chapter links for Video 4). For Video 1, fix the
      thumbnail/link mismatch at `README.md:25`.
- [ ] Mark the old video as superseded: unlist it, or pin a comment that links to the replacement.
- [ ] Update the status column in [spec.md](spec.md) §4.

## 7. Gaps: videos the docs need but don't have

These are not in scope for this update. They are recorded here because the old videos promise them,
or the docs have no video at all:

- **Observability** (`Observability-design.md` has no video, and it was promised in Video 1). This maps
  to UC006, UC011 and UC012.
- **API exposure and gateway policies**, promised at the end of Video 3. This maps to UC003 and the
  Portal's Gateway and Policies pages.
- **Canvas Portal v2 tour** and **installing the Canvas** (UC001 and UC013), from deck slides 23–24.
- **Secrets management without bootstrap credentials** (UC014).
- **Event-based integration** (`Event-based-integration-design.md`). Wait until TMFOP006 is implemented.

## 8. Open questions

1. Confirm the Open API figures and whether to keep the "10x efficiency" claim (Video 1).
2. Can the Model Gateway / `ModelGatewayService` backend be installed from the repo today, or should
   Video 4 Part 1 show it as a design (diagram only)?
3. Should the new videos keep the presenter-led framing for Videos 4 and 5, which credit Innovation Hub
   work and people, or switch fully to AI narration per spec.md?
4. Should the old videos be unlisted or kept public, given they are linked from external TM Forum pages?
