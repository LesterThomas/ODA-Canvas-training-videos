---
deck-id: 02-how-do-i-buy-or-build-an-oda-canvas
replaces: https://www.youtube.com/watch?v=dYyyCDPlVHY  ("How do I buy or build an OCA Canvas?", 7:14; fix the title typo on republish)
linked-from: oda-canvas source/operators/README.md:9 (README.md:25 also uses its thumbnail by mistake)
original-transcript: presentations/transcripts/02-how-do-i-buy-or-build-an-oda-canvas.md
original-screenshots: presentations/screenshots/02-how-do-i-buy-or-build-an-oda-canvas/  (frames at m-ss)
source-slides: presentations/About ODA Canvas.pptx slides 30–37
use-cases: UC001, UC002, UC003, UC005, UC006, UC007, UC014, UC016
oda-canvas-commit: c39da6340dbc971981bcb1eea5da5d718fac11d2  (unchanged at origin/main on 2026-10-18; chart canvas-oda 1.2.6-rc4 on the demo cluster)
target-length: ~8 min (concept, with two short live segments)
status: facts confirmed 2026-10-18
---

# How do I buy or build an ODA Canvas? Updated script

The original (7:14) walked through the upstream "How do I buy or build a Canvas?" slide, then an
operator list with logo tables for API, observability and identity operators, then "future planned
operators". The structure still works. The facts have moved on, so this version keeps the three-route
story and the operator walk-through, and grounds both in what is in the repo and on the demo cluster
today.

**Main changes from the original:**
- Opens with the presenter on camera (slide 1), as every deck now does.
- New framing from `Canvas-design.md`. There is no separate Canvas standard. The standard is the ODA
  Component specification, and the use-case library and BDD test kit define the behaviour any Canvas
  must show.
- Operators use the official **TMFOP001–011** catalogue, with *available / experimental / planned*
  status (same wording as deck 01, slide 24).
- Shows **how modularity works**. The component operator splits a Component into sub-resources, and a
  technology-specific operator handles each one.
- **Live:** the Canvas Portal *Operators* page lists the operators in this Canvas, and
  `helm get values` / `helm list` show how they were chosen (Kong as the API operator, and the
  Keycloak-authorization dependency operator installed in place of the simple one).
- **Live:** the Portal *BDD* page and its feature catalogue, the objective test of any Canvas.
- Observability is configured by the API operator (`openMetricsImplementation`), not by separate
  observability operators. Google and Microsoft "managed observability operators" and Datadog are
  dropped as operators.
- Identity adds the companion **Credentials** and **Dependency** operators. Secrets (Vault) is added.
- Carbon moves from "planned" to experimental and implemented. AI becomes the AI-Native Canvas, with
  the Model-as-a-Service operator (experimental) providing governed access through the model gateway.
- New slide on **building your own operator**: any language that follows the Kubernetes operator
  pattern (the reference operators use Python KOPF and Go), reusing the standard custom resources.

**Demo environment** (as found on 2026-10-18, healthy, no components installed):
- `helm list -A`: `canvas` (canvas-oda 1.2.6-rc4), `canvas-portal`, `depmgmt-keycloak-authz`
  (dependency-management-keycloak-authz 0.2.1), Istio base, istiod and ingress, `observability`.
- `helm get values canvas -n canvas`: `api-operator-istio.enabled: false`,
  `kong-gateway-install.enabled: true`, `apisix-gateway-install.enabled: false`.
- Canvas deployments include `component-operator`, `canvas-kongistio-operator` (api-operator-kong),
  `identityconfig-operator-keycloak`, `canvas-smanop` (Vault secrets), `canvas-pdb-management-operator`,
  `dependency-management-keycloak-authz`, `compcrdwebhook`, `canvas-compreg`, `canvas-resource-inventory`
  and `canvas-info-service`. `canvas-depapi-op` (the simple dependency operator) is scaled to 0.
- Not installed: credentials management, carbon management, Model Gateway.
- Changes made for slide 6, approved by the user on 2026-10-18:
  - set `CONFORMANCE_KEYCLOAK_PASSWORD` in the `canvas-portal-backend` secret (it was empty, so every
    BDD run stopped on "Please set the environment variables KEYCLOAK_USER…"), then restarted the backend;
  - added ClusterRole and binding `canvas-portal-backend-conformance-namespaces` (create namespaces),
    because the test kit's `installPackage` always passes `helm install … --create-namespace`.
  A `helm upgrade` of the `canvas-portal` release may reset the secret value.
- Portal at `http://localhost:8090` (login in `demos/.env`). *Operators* (`/operators`) shows each
  operator with its TMFOP id, image and pods. *BDD* (`/bdd`) loads the feature catalogue and can run
  features against the cluster.

---

## Introduction

### Slide 1: How do I buy or build an ODA Canvas? (presenter introduction)
- **Visual:** [NATIVE for now, then CLIP Buy-01-Presenter] Title-card placeholder, "How do I buy or
  build an ODA Canvas?", with the ODA Canvas picture. The presenter records a head-and-shoulders
  introduction to camera, reading these notes.
- **Speaker notes:**
> One question we're asked a lot is how do I buy or build an ODA Canvas?
>
> With a traditional application, you buy the software and its platform together. Each vendor brings its own gateway, identity and monitoring. The ODA Canvas separates those. Components declare what they need, and the Canvas provides it, using the platform services you choose.
>
> So the Canvas isn't one product. It's a modular platform, built from Canvas operators. In this video we'll look at the three ways to get a Canvas. We'll see how to check that it really is one. Then we'll look at the types of operator, with examples, and at the Canvas running on a real cluster. Finally, we'll see what's coming next.

## What a Canvas is

### Slide 2: The standard is the component
- **Visual:** [3B1B] An ODA Component symbol with its YAML specification beside it. The YAML drops
  onto the ODA Canvas picture. Modules on the Canvas light up as each requirement is read (APIs,
  identity, observability), then the second row as the narration names AI models (Model operator),
  data products (Data operator), cost and carbon. A line follows, "Not exhaustive · any common platform
  service, same pattern". Caption, "No separate Canvas standard. The ODA Component specification
  is the standard."
- **On-screen text:** "The standard is the ODA Component specification" · "The Canvas reads it and does the rest"
- **Speaker notes:**
> There is no separate standard for the Canvas itself. The standard is the ODA Component specification. A Canvas is any platform that reads a component's specification and meets its requirements. It exposes the component's APIs, registers its roles, and monitors it. A component can also declare the AI models it needs, through the Model-as-a-Service operator. It can ask for data products through the Data operator. It can even manage its cost and carbon footprint, through the cost and carbon operators. This list isn't exhaustive. Any common platform service can be offered through the same pattern. The reference implementation does this on Kubernetes.

### Slide 3: Three ways to get a Canvas
- **Visual:** [NATIVE] Redraws the upstream `How-do-I-build-or-buy-a-Canvas.png`. The ODA Canvas
  picture on the left, three arrows building one at a time to three cards:
  1. *Public cloud offerings*, with small pills AWS · Azure · China Mobile · Google Cloud · Oracle Cloud.
  2. *Roll your own* from the reference implementation, "Apache 2.0", github.com/tmforum-oda/oda-canvas.
  3. *Vendor and open-source operators*, pills Istio · Kong · "or another product's operator".
- **Speaker notes:**
> There are three ways to get a Canvas. First, a managed Canvas from a public cloud provider. At DTW Copenhagen, AWS, Microsoft Azure, China Mobile, Google Cloud and Oracle Cloud showed proofs of concept. They build on the reference implementation and the provider's own services.
>
> Second, roll your own. The reference implementation is open source, under the Apache two dot O licence, and designed to be extended.
>
> Third, use operators from software vendors and open-source projects, such as Istio and Kong.

### Slide 4: Mix and match
- **Visual:** [3B1B] One Canvas assembles from parts of all three routes. A cloud provider's API
  management module, the reference identity and component operators, and a vendor's gateway operator
  slot into the ODA Canvas picture side by side. A banner settles, "The Canvas is modular. Mix and match."
- **Speaker notes:**
> These aren't either-or choices. The Canvas is modular, so you can mix and match. You might take a cloud provider's API management, the reference identity operator, and your own operator for an in-house system. A typical production Canvas combines standard operators with custom ones that apply the organisation's own policies.

### Slide 5: How you know it's a Canvas
- **Visual:** [3B1B] Three Canvases (cloud, home-grown, mixed) pass through a gate built from the
  use-case library (UC001… UC016) and BDD feature files. Green scenario ticks stream past. Each Canvas
  gets a tick.
- **On-screen text:** "Use-case library" · "BDD features and scenarios" · "Test kit"
- **Speaker notes:**
> Whichever route you take, there's an objective way to check the result. The behaviour every Canvas must show is written down in two places. The use-case library describes it at a high level. Behaviour-driven development features describe it in detail, as scenarios. The test kit turns those scenarios into executable tests that can validate any Canvas implementation.

### Slide 6: Live, the test kit in the Canvas Portal
- **Visual:** [DEMO] Canvas Portal → Platform → BDD. The feature catalogue loads from GitHub. Open the
  feature list and scroll through it (UC002 install and upgrade, UC003 exposed APIs, UC005 roles,
  UC007 dependent APIs, UC012 observability, UC017 disruption budgets…). Select a feature, then show a
  run and its scenario results. Run `UC002-F001 Install Component` live (approved by the user, 2026-10-18). UC016-F001 was tried first, but it needs a Resource Inventory URL that the portal's runner doesn't pass, so its queries default to localhost and fail.
- **Speaker notes:**
> Here is the test kit in the Canvas Portal. The catalogue loads the feature files straight from the GitHub repository. Each one is named after the use case it tests, such as installing components, exposing APIs, or configuring roles. You can pick features and run them against this Canvas. Every change to the reference implementation is checked this way too.

## Canvas operators

### Slide 7: Operators are the modules
- **Visual:** [3B1B] A Component resource drops onto the Canvas. The Component Management operator
  (gear, teal) splits it into sub-resources, ExposedAPI, DependentAPI, IdentityConfig and
  SecretsManagement, that fan out. Each sub-resource lands on its own operator gear. Then one gear
  swaps, Kong for Istio, while the sub-resource stays the same.
- **Speaker notes:**
> The modules of a Canvas are called Canvas operators. They follow the Kubernetes operator pattern, software that holds the operational knowledge for one job. The Component Management operator splits each component into parts, such as exposed APIs, dependent APIs and identity. A separate operator handles each part. So you can swap one technology for another without changing the component.

### Slide 8: The operator catalogue
- **Visual:** [NATIVE] Three columns of cards, building column by column with the narration.
  - *Available:* TMFOP001 Component Management, 002 API Management, 003 Identity Config, 004 Credentials
    Management, 005 Dependency Management, 007 Secrets Management, 010 Disruption Budget Management.
    008 OAuth2 Config with a "prototype" tag.
  - *Experimental:* 009 Model-as-a-Service, Data Product, 011 Carbon Management (deck 01 order).
  - *Planned:* 006 Event Management, Cost Control, Database Management.
- **Speaker notes:**
> These are the operator types today. Seven are available now. They cover components, APIs, identity, credentials, dependencies, secrets and disruption budgets. A prototype operator handles authentication between components. Three operators are experimental. One provides model as a service. One manages data products. And one scales workloads to cut carbon. Event management, cost control and database services are planned. The list isn't fixed. New types will be added as the Canvas matures.

### Slide 9: Live, the operators in this Canvas
- **Visual:** [DEMO] Canvas Portal → Platform → Operators. The summary tiles (total, running), then the
  list with TMFOP ids. Highlight TMFOP001 Component Management, TMFOP002 API Management (Kong),
  TMFOP003 Identity Configuration (Keycloak), TMFOP007 Secrets Management (Vault), TMFOP010 Disruption
  Budget. Open one operator to show its image and pods. Cut to a terminal replay of
  `kubectl get deployments -n canvas`.
- **Speaker notes:**
> Here are the operators in a running Canvas, in the Canvas Portal. Each one shows its catalogue number, its image and its pods. This Canvas uses the Kong API operator, the Keycloak identity operator, and the Vault secrets operator. The same list is visible from the command line, as ordinary Kubernetes deployments.

### Slide 10: Live, choosing the modules
- **Visual:** [DEMO] Terminal replay.
  1. `helm get values canvas -n canvas`, highlighting `api-operator-istio: enabled: false` and
     `kong-gateway-install: enabled: true`.
  2. `helm list -n canvas`, highlighting the separate `depmgmt-keycloak-authz` release.
  Caption, "One API operator at a time · the dependency operator swapped for the Keycloak-authorization one".
- **Speaker notes:**
> Choosing the modules is configuration, not code. When this Canvas was installed, the Istio API operator was switched off and Kong switched on. Only one API operator runs at a time. Later, the simple dependency operator was replaced with one that waits for an access grant in Keycloak. The components didn't change at all.

## Examples

### Slide 11: Example 1, API management
- **Visual:** [3B1B] Redraws the original logo table (02:20). An ExposedAPI card (path, spec,
  rateLimit, apiKeyVerification) flows into the TMFOP002 gear, which fans out to six tiles, Istio,
  Kong, Apache APISIX, Azure API Management, Google Apigee, Whale Cloud, plus a dashed "or another
  gateway" tile.
- **Speaker notes:**
> First, API management. Every component declares the APIs it exposes, with policies such as rate limits or API-key checks. A Canvas can use any API gateway or service mesh, and an API operator configures it. There are operators for Istio, Kong and Apache APISIX. There are also operators for Azure API Management, Google Apigee and Whale Cloud. Any other gateway can be added with its own operator.

### Slide 12: Example 2, observability
- **Visual:** [3B1B] Replaces the original "Observability Management Operators" table (03:20). The
  component exposes a metrics endpoint. The API operator's `openMetricsImplementation` switch points
  at three outputs, a Prometheus ServiceMonitor, Prometheus annotations for a managed service, or
  Datadog annotations. Underneath, the reference stack (Prometheus, Grafana, Jaeger, OpenTelemetry
  Collector), with an "or another observability platform" tile.
- **Speaker notes:**
> Second, observability. A component doesn't bring its own monitoring tools. It publishes metrics and traces using the OpenMetrics and OpenTelemetry standards. When the API operator exposes the metrics endpoint, it also sets up how it is collected. That could be a Prometheus operator, a managed Prometheus service, or Datadog. The reference implementation includes a ready-made stack, and any other observability platform can be used.

### Slide 13: Example 3, identity
- **Visual:** [3B1B] Replaces the original identity table (03:50). Left, many applications each with
  its own identity box. They collapse into one identity platform that each component sends only its
  roles to. Tiles, Keycloak · Microsoft Entra ID · "or another identity platform". Below, two smaller
  companion gears, TMFOP004 Credentials and TMFOP005 Dependency (with its two implementations, simple
  and Keycloak authorization).
- **Speaker notes:**
> Third, identity. Most applications today bring their own identity management. Each one has to be integrated with the company's central system. In the ODA model, a component holds only its roles and permissions, and declares them. Identity config operators register them in Keycloak, Microsoft Entra ID, or another identity platform. Companion operators manage each component's credentials and connect its dependencies once access is granted.

### Slide 14: Example 4, secrets
- **Visual:** [NATIVE] A component card, an arrow to a vault tile "HashiCorp Vault, or another secrets
  platform", and a note "No bootstrap credentials. The component proves who it is with its Kubernetes
  identity."
- **Speaker notes:**
> Fourth, secrets. A component declares that it needs a secrets store, and the secrets management operator provides one. The reference implementation uses HashiCorp Vault, and another secrets platform can be used. The component signs in with its own Kubernetes identity, so no bootstrap passwords are needed.

### Slide 15: Example 5, carbon-aware scaling
- **Visual:** [3B1B] A grid carbon-intensity curve. The replica count of a carbon-aware deployment drops
  when the curve is high and recovers when it is low. Tag, "Experimental · TMFOP011".
- **Speaker notes:**
> Carbon management was only a plan in the original version of this video. Now there is an experimental operator. A component marks some workloads as carbon-aware. The operator reads real-time grid carbon intensity, and limits how far those workloads scale when electricity is carbon-intensive. There's a dedicated video on this.

## Building your own

### Slide 16: Build your own operator
- **Visual:** [NATIVE] Three cards. *Any language* (the Kubernetes operator pattern; reference
  operators in Python with KOPF, and Go). *Same custom resources* (Component, ExposedAPI, DependentAPI,
  IdentityConfig, SecretsManagement). *Help to start* (the `create-oda-operator` AI coding-assistant
  skill, and the BDD features to test against).
- **Speaker notes:**
> You can also build your own operators. They can be written in any language that follows the Kubernetes operator pattern. The reference operators use Python with the KOPF framework, and Go. To work with the rest of the Canvas, an operator uses the same standard custom resources. The repository includes an AI coding-assistant skill for creating operators, and the test kit to check them.

### Slide 17: What's next
- **Visual:** [NATIVE] Left, the experimental AI-Native Canvas card: AI models declared by components,
  governed access through a model gateway run by the Model-as-a-Service operator (TMFOP009,
  experimental), guardrails and usage records, MCP tools and agentic components. Right, *Planned*:
  Event Management, Cost Control, Database Management.
- **Speaker notes:**
> The biggest area of new work is the AI-Native Canvas. Components will declare which AI models they need. The experimental Model-as-a-Service operator grants governed access through a model gateway. The gateway applies guardrails and records usage. The AI-Native Canvas has its own video. Operators for events, cost control and database services are also on the roadmap.

### Slide 18: Recap
- **Visual:** [NATIVE] Three short lines build. "Buy, build, or mix and match." "Operators are the
  modules, chosen by configuration." "The test kit checks any Canvas."
- **Speaker notes:**
> To recap. You can buy a Canvas, build one, or mix and match. Operators are the modules, and you choose them through configuration. Whatever you choose, the test kit checks that it behaves like a Canvas.

### Slide 19: Find out more
- **Visual:** [NATIVE] Clickable links, tmforum.org/oda, the ODA Component Directory
  (tmforum.org/oda/directory), github.com/tmforum-oda/oda-canvas (Canvas-design.md,
  source/operators), and the oda-ca-docs ODA Component Design Guidelines.
- **Speaker notes:**
> To find out more, see the Open Digital Architecture pages on the TM Forum website. Browse the ODA Component Directory. And explore the reference implementation on GitHub, at TM Forum dash ODA slash ODA Canvas.

---

## Decisions (confirmed by the user, 2026-10-18)

1. Keep "DTW Copenhagen" and the five PoC names as `Canvas-design.md` gives them.
2. Run one BDD feature live on slide 6 (`UC002-F001`, after `UC016-F001` failed on the portal's configuration).
3. Carbon-aware scaling is experimental, as in deck 01, although the TMFOP011 README says "Implemented".
4. Keep the Data Product operator as experimental. Some experimental operator code isn't on GitHub yet.

---

## Source check

| Claim | Source in oda-canvas @ c39da63 |
|---|---|
| No separate Canvas standard; the component spec is the standard | `Canvas-design.md` "What is the ODA Canvas?" |
| Three routes, DTW Copenhagen PoCs, Istio and Kong operators, mix and match | `Canvas-design.md` "How do I buy or build a Canvas?" |
| Production Canvas = standard plus custom operators | `source/operators/README.md` intro |
| Use-case library, BDD features, test kit | `Canvas-design.md` "Canvas Design structure"; `usecase-library/`; `feature-definition-and-test-kit/features/` (31 feature files) |
| Portal BDD page loads the catalogue from GitHub and runs features | `canvas-portal-v2/frontend/src/pages/BDD/index.tsx` |
| Component operator splits a Component into sub-resources | `source/operators/TMFOP001-Component-Management/README.md` |
| Operator catalogue and status | `source/operators/README.md`; TMFOP006/009 "Implementation Planned"; TMFOP008 "should not be used directly" |
| Portal Operators page with TMFOP ids | `canvas-portal-v2/backend/k8s/resources/operators.py` (`TMF_OPERATOR_IDS`) |
| One API operator at a time | `installation/README.md`; `charts/canvas-oda/values.yaml` |
| Two dependency operators, one enabled at a time | `source/operators/TMFOP005-Dependency-Management/README.md` |
| Six API operators | `source/operators/TMFOP002-API-Management/README.md` |
| Observability via `openMetricsImplementation` | `source/operators/TMFOP002-API-Management/istio/README.md`; `charts/observability-stack/README.md` |
| Keycloak and Entra ID identity operators | `source/operators/TMFOP003-Identity-Config/README.md` |
| Vault, JWT-based, no bootstrap credentials | `source/operators/TMFOP007-Secrets-Management/README.md`; `usecase-library/UC014-Secrets-Management-JWT-based.md` |
| Carbon operator (KEDA, TMF628) | `source/operators/TMFOP011-Carbon-Management/README.md` |
| Operators in any language; KOPF and Go | `source/operators/README.md`; `TMFOP010…/pdb-management/go.mod` |
| `create-oda-operator` skill | `skills/create-oda-operator/SKILL.md` |
| AI-Native Canvas | `AI-Native-Canvas-design.md` |
