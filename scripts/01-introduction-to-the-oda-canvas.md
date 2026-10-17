---
deck-id: 01-introduction-to-the-oda-canvas
replaces: https://youtu.be/B5lF94l-Dek  (ODA Canvas introductory video, 22:40)
linked-from: oda-canvas README.md:25
oda-canvas-commit: c39da6340dbc971981bcb1eea5da5d718fac11d2  (chart 1.2.6-rc5, component spec v1)
outline: specs/spec-introduction.md §6
target-length: ~8–9 min (~1,300 narrated words)
status: facts confirmed 2026-10-16; deck at decks/01-introduction-to-the-oda-canvas.pptx
---

# Introduction to the ODA Canvas: updated script

This follows the shot list (now 27 slides, after adding the Component Directory demo; slides marked [NATIVE] are built as native PowerPoint slides by `tools/native/intro.py`, the rest are Remotion clips) in [spec-introduction.md](../specs/spec-introduction.md) §6. Facts
were refreshed using [video-update-plan.md](../specs/video-update-plan.md) §2. All facts were
confirmed on 2026-10-16, including the Open API download figure and the 10x claim.

**Main changes from the original:**
- The "Horizon 1 / 2 / Experimental" framing is replaced by *available today / experimental / planned*.
- The Canvas is described as generally available, with the TMFOP operator catalogue.
- Observability is described as it actually works now (configured by the API operator, with a
  Prometheus/Grafana/Jaeger/OpenTelemetry reference stack).
- Carbon is described as implemented.
- An AI-Native Canvas segment and two Canvas Portal v2 demo clips are added.

---

## Segment 1: Intro

### Slide 1: Title card
- **Visual:** [NATIVE] "Introduction to the ODA Canvas" with the TM Forum ODA mark.
- **Speaker notes:**
> Welcome to the first video in a series about the Open Digital Architecture Canvas, the execution platform for ODA Components, and its open-source reference implementation.

### Slide 2: Who this is for
- **Visual:** [NATIVE] Two personas slide in. On the left, a component developer beside the ODA Component symbol. On the right, a platform engineer holding the Canvas.
- **Speaker notes:**
> This video is for two groups. First, architects and software engineers who build functional software components, and want to know what it means to meet the ODA standards and run on the Canvas. Second, architects, engineers and site reliability engineers who build or operate a Canvas platform, whether that is a communication service provider running its own, or a cloud provider offering a managed Canvas to others.

### Slide 3: Roadmap
- **Visual:** [NATIVE] Agenda builds: History, Components and Canvas, Benefits, A tour of the Canvas, What's next.
- **Speaker notes:**
> We'll start with a short history of how we got here. Then we'll explain what an ODA Component is and what the Canvas provides. After that we'll cover the business benefits, take a quick tour of the Canvas, including the Canvas Portal, and finish with where the work is heading. Later videos in the series go deeper into each area.

## Segment 2: History

### Slide 4: Frameworks and the problem of interpretation
- **Visual:** [3B1B] Process, information and functional framework documents appear, then fork into many slightly different copies, one per operator.
- **Speaker notes:**
> For more than twenty-five years, TM Forum has been a hub for collaboration on telecom IT. The early frameworks gave the industry a common language for processes, information and functions. They were valuable, but they were human-readable documents, open to interpretation. Each operator built its own variant, and the industry ended up with many slightly different versions of the same standards.

### Slide 5: The Open API programme
- **Visual:** [3B1B] Timeline: hackathons in 2013, the Open API launch in January 2017, then a download counter ticking up.
- **On-screen text:** "Over 1 million downloads"
- **Speaker notes:**
> The next big step was TM Forum's Open API programme. It began with experiments and hackathons around 2013 and launched formally in January 2017. Open APIs are detailed, prescriptive, machine-readable specifications for standard services. Adoption has been huge: the APIs have been downloaded more than a million times by tens of thousands of developers, and today most telecom IT capabilities start with the question, "Which standard APIs do we need?"

### Slide 6: The remaining gap
- **Visual:** [3B1B] A tangle of vertically integrated systems. An "upgrade" arrow tries to move one box and drags the others with it.
- **Speaker notes:**
> Standard APIs didn't solve everything. Telecom IT estates are still diverse and complex, and upgrading them is hard. Often several systems have to be upgraded together in one large transformation project. Standardising the interfaces wasn't enough. The industry also needed a standard way to package, deploy and operate the software behind them.

## Segment 3: Components and Canvas

### Slide 7: What is an ODA Component?
- **Visual:** [3B1B] The ODA Component symbol builds up segment by segment. Its exposed-API lollipops and dependent-API sockets draw outward as the APIs are mentioned. Core Function, Notification/Reporting, Security and Management/Operations glow in turn while callout tiles list the declared needs. (Deck slide 1, left half.)
- **Speaker notes:**
> That's where ODA Components come in. An ODA Component is an independently deployable unit of functionality. Alongside its business function, it declares its non-functional needs, such as the APIs it exposes and depends on, the events it publishes, its security roles and its observability. Components are interoperable, designed around end-to-end use cases, and portable: they can run on any Canvas that follows the standard.

### Slide 8: What is the ODA Canvas?
- **Visual:** [3B1B] A base plate appears under the component symbol, carrying service tiles: API Management, Identity, Observability, Secrets, Events and more. (Deck slide 1, right half.)
- **Speaker notes:**
> The ODA Canvas is the cloud-native execution environment for those components. It reads each component's declared requirements and provides the shared operational services it needs, including API management, identity, observability and secrets. Component developers can focus on business functionality while the Canvas takes care of security, monitoring and scaling.

### Slide 9: Composable IT with ODA
- **Visual:** [3B1B] The capability map from deck slide 2, built layer by layer: Use cases at the top, then ODA Components, then the ODA Canvas operators, then the IT foundations and platform services.
- **Speaker notes:**
> Put the two together and you get composable IT. Use cases are assembled from standard components. Components are deployed onto a Canvas. Canvas operators configure the underlying platform services, such as API gateways, service meshes, identity and observability, whether those are open-source reference modules or commercial cloud services. When a new business need appears, you assemble existing building blocks instead of starting a new integration project.

### Slide 10: Composable AI with Agentic ODA
- **Visual:** [3B1B] The same diagram morphs into deck slide 3. "ODA Canvas" relabels to "AI-Native Canvas", agentic components appear beside the standard ones, and a new AI and Data foundations layer slides in (AI Gateway, LLMs, Data Products). The interface labels change to "Open APIs, MCP, A2A".
- **Speaker notes:**
> The same model now extends to AI. In the AI-Native Canvas, AI agents can be packaged as agentic components that follow the same component standard. Standard components can expose their APIs as tools for agents using the Model Context Protocol. Agents can describe themselves to other agents through agent-to-agent standards. The Canvas adds AI and data services, such as an AI gateway in front of the approved language models, so that agents from many vendors can be governed, observed and cost-managed in one consistent way.

### Slide 11: Example: identity is declared, not implemented
- **Visual:** [3B1B] Three components, each with its own small identity box. The boxes collapse into a single Canvas identity service, and each component now sends only a short "roles" list into it.
- **Speaker notes:**
> Identity is a good example of why this matters. Traditionally, each application ships with its own identity management, which operations teams then have to integrate. In the ODA model, a component only declares the roles it supports. The Canvas configures those roles in one shared identity platform, such as Keycloak or Microsoft Entra ID. Identities are managed once, consistently, across every application.

### Slide 12: Example: secrets without bootstrap credentials
- **Visual:** [3B1B] A component pod shows its Kubernetes identity token to a Vault icon, and a lock opens. A "password in config" icon is crossed out.
- **Speaker notes:**
> Secrets work the same way. A component declares that it needs a secrets store, and the Canvas sets up a private vault for it. In the reference implementation that's HashiCorp Vault. The component authenticates with its own Kubernetes workload identity, so it never needs a bootstrap password just to reach the vault.

## Segment 4: Benefits

### Slide 13: Six benefits
- **Visual:** [NATIVE] Deck slide 4. Six pillars rise one at a time: Customer Experience, Simplicity, Innovation, Operational Efficiency, Security, Technical Debt.
- **Speaker notes:**
> Why do this? The benefits are shared by service providers, software vendors, integrators and cloud providers. Seamless integration supports zero-touch, zero-wait and zero-trouble customer experiences. Operations get simpler, moving from hundreds of teams running vertically integrated applications towards a single site reliability team running a Canvas. Agility drives innovation, including faster adoption of AI-native capabilities. Integration becomes automated instead of a manual project. Security is built in, with a zero-trust architecture and security as code. And modular contracts let every component be upgraded continuously, reducing technical debt.

### Slide 14: An order-of-magnitude goal
- **Visual:** [NATIVE] A "+30%" bar is overtaken by a "10x" bar.
- **Speaker notes:**
> The ambition isn't an incremental gain. The goal is a step change, aiming for an order-of-magnitude improvement in efficiency and agility, and a faster transformation to an AI-native telco.

## Segment 5: A tour of the Canvas

### Slide 15: The component standard in two layers
- **Visual:** [NATIVE] Deck slide 21. The bottom layer is design patterns (self-describing, security as code, management as code). The top layer is standard golden components, with a link to the ODA Component Directory.
- **Speaker notes:**
> The component standard has two layers. The lower layer is a set of design patterns for self-describing, modular software, with security and management defined as code. The upper layer is a set of standard golden components that represent industry best practice for breaking telecom IT into building blocks. You can browse them in the TM Forum ODA Component Directory.

### Slide 16: Live demo: the ODA Component Directory
- **Visual:** [DEMO] Real browser recording of tmforum.org/oda/directory/components-map (`demos/directory/directory-tour.mjs` → `videos/public/captures/directory-tour.webm`): the components map with the Canvas operators and the business domains → click Product Catalog Management (TMFC001) → its metadata, component resources (YAML specification, conformance profile, CTK, reference implementation), exposed and dependent Open APIs, certified products → back to the map → Product Inventory (TMFC005). Lower-third labels name each section.
- **Speaker notes:**
> The standard components are published in the ODA Component Directory on the TM Forum website. Its components map groups them by business domain, alongside the Canvas operators. Opening Product Catalog Management shows its specification: the version and status, its YAML definition, conformance profile, test kit and reference implementation, the Open APIs it must expose and those it may depend on, and the products certified against it. Every standard component, such as Product Inventory, follows the same structure.

### Slide 17: The component YAML
- **Visual:** [3B1B] A YAML file scrolls, and the sections highlight in turn: componentMetadata, coreFunction, managementFunction, securityFunction, eventNotification. (Use `feature-definition-and-test-kit/testData/productcatalog-v1`.)
- **Speaker notes:**
> Each component carries a YAML definition. Think of it as a Swagger file for a whole component. It describes the component's metadata and functional scope, and then, in its core, management and security functions, the APIs it exposes and depends on, the events it uses, and the roles it needs. The specification reached version one, its generally available release, at the end of 2024.

### Slide 18: The Canvas as a set of operators
- **Visual:** [3B1B] One Component resource splits into sub-resources (ExposedAPI, DependentAPI, IdentityConfig, SecretsManagement, PublishedNotification and others), and each one flows to its own operator. Closing cutaway (from about 22 s): the real Canvas Portal Platform › Operators page (`portal-operators` capture), then a terminal running `kubectl get deployments -n canvas` with the real output (`cli-operators`).
- **Speaker notes:**
> The Canvas itself is modular. It is a set of software operators, following the Kubernetes operator pattern. The component management operator takes the component definition and breaks it into sub-resources, such as exposed APIs, dependent APIs, identity configuration and secrets management. Each sub-resource is handled by its own specialised operator. Each operator is a piece of software that holds the operational knowledge a human administrator would otherwise apply by hand.

### Slide 19: Worked example: API exposure
- **Visual:** [3B1B] An ExposedAPI YAML block flows into an "API operator" gear, which fans out to six gateway logos: Istio, Kong, Apache APISIX, Azure API Management, Google Apigee and Whale Cloud. Policy tags (rate limit, API key, CORS, OpenAPI validation) attach to the route.
- **Speaker notes:**
> API exposure shows the pattern. The component declares which APIs it wants to expose, and optionally policies such as rate limiting, API-key checks, cross-origin rules or request validation. An API operator reads that declaration and automatically configures whichever gateway or service mesh the Canvas uses. There are six options in the reference implementation: the Istio service mesh, which is the default, the Kong and Apache APISIX gateways, and operators for Azure API Management, Google Apigee and Whale Cloud. The component stays the same, and only the operator changes.

### Slide 20: Live demo: the component inventory
- **Visual:** [DEMO] Real recording of the local Canvas Portal (`portal-inventory` capture): Dashboard → Components › Inventory → scroll the domains → hover the installed Product Catalog Management card ("1 installed instance"). Fallback: [STATIC] `images/Canvas 2.png` via `lib/PortalShot.tsx`.
- **Speaker notes:**
> All of this is visible in the Canvas Portal. Here is the component inventory. It lists standard components grouped by business domain and shows which ones are installed on this Canvas.

### Slide 21: Live demo: deploying a component
- **Visual:** [DEMO] Real recording (`portal-deploy` capture): Components › Deploy → Install Component → repository reference-example-components → chart productcatalog → release name r1 → hover "Next" (nothing is installed). Then a terminal replays real output for release r1 (`cli-deploy`): `helm list -n components`, `kubectl get components -n components`, `kubectl get exposedapis -n components`, with operator chips (API operator → ExposedAPIs, Identity operator → roles, metrics → monitoring).
- **Speaker notes:**
> Components are packaged as Helm charts. Deploying one is just a matter of choosing the chart and giving the release a name. From there, the operators take over: they expose its APIs, register its roles and configure its monitoring. Later videos follow that process end to end.

### Slide 22: Identity configuration
- **Visual:** [3B1B] IdentityConfig YAML (canvasSystemRole plus componentRole entries) flows into an identity operator gear, which branches to Keycloak and Microsoft Entra ID. Two smaller gears appear beside it: Credentials Management and Dependency Management.
- **Speaker notes:**
> Identity follows the same pattern. A component declares its roles, either statically in its YAML or dynamically through a standard roles-and-permissions API. An identity config operator registers them in Keycloak or Microsoft Entra ID. Companion operators then create the component's client credentials and connect its API dependencies once access has been granted.

### Slide 23: Observability
- **Visual:** [3B1B] A component's metrics endpoint (OpenMetrics) and traces (OpenTelemetry) flow into the reference stack (Prometheus, Grafana, Jaeger, OpenTelemetry Collector). Side labels show alternative targets: managed Prometheus and Datadog.
- **Speaker notes:**
> For observability, components publish metrics using OpenMetrics and traces using OpenTelemetry, rather than shipping their own monitoring tools. When the API operator exposes a component's metrics endpoint, it also sets up scraping. In the reference implementation that means Prometheus, Grafana, Jaeger and an OpenTelemetry collector. The same declaration can target managed Prometheus services or Datadog instead. Metrics can be business metrics as well as technical ones, for example a new product being added to a catalog.

### Slide 24: Available today, experimental, planned
- **Visual:** [NATIVE] Operator tiles sort into three columns.
  - *Available today:* Component, API, Identity Config, Credentials, Dependency, Secrets, OAuth2 Config (prototype), Disruption Budget, Carbon Management.
  - *Experimental:* AI-Native (Model Gateway, MCP, agentic components).
  - *Planned:* Event Management, Model-as-a-Service operator, Cost Control, Database Management.
- **Speaker notes:**
> Here's where things stand. Available in the reference implementation today are operators for component management, API management, identity, credentials, dependencies, secrets, availability during maintenance, and carbon-aware scaling. An OAuth2 configuration operator for authentication between components is available as a prototype. The AI-Native capabilities are experimental. Event management, a model-as-a-service operator, cost control and database services are planned. The Canvas is generally available, with regular releases, and every change is checked by an automated behaviour-driven test suite that runs against a real Kubernetes cluster.

### Slide 25: Measuring Canvas adoption
- **Visual:** [NATIVE] Deck slide 20. A row of lights turns green one by one: API Gateway, Observability, Identity, Secrets, Responsible AI, Cost and Carbon automation.
- **Speaker notes:**
> How do you measure adoption? The outcome that matters is automated component deployment and lifecycle management. A service provider can turn on each light in turn as it automates API exposure, observability, identity, secrets and, increasingly, responsible AI, cost and carbon management.

## Segment 6: Conclusion

### Slide 26: Built together
- **Visual:** [NATIVE] Logos or role icons for operators, hyperscalers, software vendors and integrators converge on the Canvas. Text fades in: "ODA Manifesto: a standard execution environment for ODA Components".
- **Speaker notes:**
> The Canvas is the result of collaboration between communication service providers, cloud providers, software vendors and systems integrators, delivering what the ODA Manifesto set out: a standard execution environment for ODA Components. That shared foundation is what lets the industry adopt new capabilities, including AI, faster together than any one company could alone.

### Slide 27: What's next
- **Visual:** [NATIVE] Series roadmap tiles (Buy or build a Canvas; Authentication and Authorization; AI-Native Canvas; Carbon-Aware Software) and links: github.com/tmforum-oda/oda-canvas and tmforum.org/oda/directory.
- **Speaker notes:**
> This video was an overview. The next videos in the series go deeper into how to buy or build a Canvas, authentication and authorization, the AI-Native Canvas and carbon-aware software. The reference implementation, its documentation and its use-case library are all on GitHub at tmforum-oda slash oda-canvas, and contributions are welcome.

---

## Source check

| Claim | Source in oda-canvas @ c39da63 |
|---|---|
| GA, v1 spec Dec 2024, releases to 1.2.5 | `README.md` release table; `release-notes/ReleaseNotes.md` |
| Six API operators, Istio default | `source/operators/TMFOP002-API-Management/README.md`; `installation/README.md` |
| API policies | `TMFOP002…/README.md` ExposedAPI data model |
| Keycloak and Entra ID; TMF672 dynamic roles | `TMFOP003-Identity-Config/README.md` |
| Credentials and dependency operators | `TMFOP004`, `TMFOP005` READMEs |
| Vault, JWT-based, no bootstrap credentials | `usecase-library/UC014-Secrets-Management-JWT-based.md` |
| Observability via `openMetricsImplementation`; reference stack | `TMFOP002…/istio/README.md`; `charts/observability-stack/README.md` |
| Operator status columns | `source/operators/README.md` (TMFOP006/009 "Implementation Planned") |
| BDD suite on kind in CI | `installation/README.md`; `feature-definition-and-test-kit/README.md` |
| Portal screens | `canvas-portal-v2/frontend/src/layout/Sidebar.tsx`; live recordings of the local Canvas Portal (canvas-oda 1.2.6-rc4, release r1 from `testData/productcatalog-v1`), 2026-10-17 |
| Component Directory content | Live recording of tmforum.org/oda/directory/components-map, TMFC001 and TMFC005 pages, 2026-10-17 |
| helm/kubectl output | Captured from the docker-desktop demo cluster by `demos/cli/capture-cli.mjs`, 2026-10-17 |
