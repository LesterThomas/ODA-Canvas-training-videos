---
deck-id: 02-how-do-i-buy-or-build-an-oda-canvas
replaces: https://youtu.be/dYyyCDPlVHY  ("How do I buy or build an OCA Canvas?", 7:14; fix the title typo on republish)
linked-from: oda-canvas source/operators/README.md:9 (README.md:25 also uses its thumbnail by mistake)
original-transcript: presentations/transcripts/02-how-do-i-buy-or-build-an-oda-canvas.md
source-slides: presentations/About ODA Canvas.pptx slides 30–37
oda-canvas-commit: c39da6340dbc971981bcb1eea5da5d718fac11d2
target-length: ~5–6 min
status: draft script
---

# How do I buy or build an ODA Canvas? Updated script

**Main changes from the original:**
- Operator types now use the official TMFOP catalogue.
- Carbon management moves from "planned" to "available".
- The AI operator becomes the experimental AI-Native Canvas.
- Observability is described as configured through the API operator, not by a separate set of
  observability operators.
- Adds the DTW Copenhagen public-cloud PoCs, credentials and dependency operators, and the test kit as
  the way to check any Canvas you buy or build.

The visuals reuse the operator-catalogue and "Lego block" assets from deck 01.

---

### Slide 1: Title
- **Visual:** [STATIC] "How do I buy or build an ODA Canvas?"
- **Speaker notes:**
> One question we're often asked is: how do I buy or build an ODA Canvas?

### Slide 2: Three ways to get a Canvas
- **Visual:** [3B1B] Deck slide 30. Three routes converge on one Canvas: public cloud offerings, roll your own from the reference implementation, and infrastructure software vendors' operators. A banner reads "Canvas is modular: mix and match".
- **Speaker notes:**
> There are three routes. The first is a managed Canvas from a public cloud provider: at DTW Copenhagen there were proof-of-concept demonstrations from AWS, Microsoft Azure, China Mobile, Google Cloud and Oracle Cloud. The second is to build your own, starting from the open-source reference implementation, which the community publishes under the Apache 2.0 licence. The third is to use operators from infrastructure software vendors and open-source projects, many of which already manage their products on Kubernetes this way. These aren't exclusive choices. The Canvas is modular, so you can mix and match.

### Slide 3: How you know it's a Canvas
- **Visual:** [3B1B] Any Canvas, whether cloud, home-grown or mixed, passes through a test-kit gate of green BDD scenario ticks.
- **Speaker notes:**
> Whichever route you take, there's an objective way to check the result. The Canvas is defined by a use-case library and a set of behaviour-driven test scenarios, and the test kit can validate any Canvas implementation. The reference implementation is also the platform used to certify ODA Components.

### Slide 4: Operators are the modules
- **Visual:** [3B1B] The Canvas base plate splits into operator tiles labelled TMFOP001 to TMFOP011.
- **Speaker notes:**
> The modules of a Canvas are called Canvas operators. They follow the standard Kubernetes operator pattern: software that holds the operational knowledge for one job and applies it automatically. There are several types of operator, and each type can have several technical implementations.

### Slide 5: The operator catalogue
- **Visual:** [3B1B] Deck slide 31, updated. Tiles in three groups:
  - *Available:* TMFOP001 Component Management, 002 API Management, 003 Identity Config, 004 Credentials Management, 005 Dependency Management, 007 Secrets Management, 008 OAuth2 Config (prototype), 010 Disruption Budget Management, 011 Carbon Management.
  - *Planned:* 006 Event Management, 009 Model-as-a-Service, Cost Control, Database Management.
- **Speaker notes:**
> These are the operator types in the reference implementation today. Component management handles the overall lifecycle. Then there are operators for API management, identity configuration, credentials, API dependencies, secrets, authentication between components, availability during maintenance, and carbon management. Event management, model-as-a-service, cost control and database services are planned. The list isn't exhaustive, and new operator types will be added as the Canvas matures. Let's look at a few examples.

### Slide 6: Example 1: API management
- **Visual:** [3B1B] Deck slide 32. The ExposedAPI declaration flows into the API Management tile, which fans out to Istio, Kong, Apache APISIX, Azure API Management, Google Apigee and Whale Cloud.
- **Speaker notes:**
> First, API management. Every component declares the APIs it wants to expose, whether for its core function or for managing and securing the component, along with policies such as rate limits or API-key checks. A Canvas can use any API gateway or service mesh, and an API operator configures it automatically. The reference implementation has operators for the Istio service mesh, which is the default, the Kong and Apache APISIX gateways, and Azure API Management, Google Apigee and Whale Cloud API management.

### Slide 7: Example 2: observability
- **Visual:** [3B1B] Deck slide 34, redrawn. The component exposes an OpenMetrics endpoint. The API operator's "metrics" output can point at a Prometheus ServiceMonitor, Prometheus annotations for a managed service, or Datadog annotations. The reference stack (Prometheus, Grafana, Jaeger, OpenTelemetry) sits underneath.
- **Speaker notes:**
> Second, observability. A component doesn't ship its own monitoring tools. It publishes metrics and traces using the OpenMetrics and OpenTelemetry standards, and relies on the Canvas to collect them. When the API operator exposes a component's metrics endpoint, it also configures how it is scraped: for a Prometheus operator, for a managed Prometheus service, or for Datadog. The reference implementation provides a ready-made stack of Prometheus, Grafana, Jaeger and an OpenTelemetry collector.

### Slide 8: Example 3: identity
- **Visual:** [3B1B] Deck slide 36. Many applications, each with its own identity box, become one Canvas identity service that each component sends only a list of roles to. Logos: Keycloak and Microsoft Entra ID. Small tiles: Credentials Management, Dependency Management.
- **Speaker notes:**
> Third, identity. Today, most vendor applications bring their own identity management, and every one has to be integrated with the company's central identity system. In the ODA model, a component holds only the roles and permissions it needs, and declares them. A Canvas can use any identity platform that supports OAuth 2.0, and identity config operators configure it automatically. There are operators for Keycloak and Microsoft Entra ID. Companion operators then manage each component's client credentials and connect its API dependencies once access has been granted.

### Slide 9: Example 4: carbon management, now available
- **Visual:** [3B1B] A grid-intensity curve. The replica count of a "carbon-aware" deployment drops when the curve is red and rises when it is green.
- **Speaker notes:**
> Carbon management has moved from plan to reality. Components can mark some of their workloads as carbon-aware. The Carbon Management operator then reads real-time grid carbon intensity and limits how far those workloads scale when electricity is carbon-intensive, letting them catch up when the grid is greener, with no code changes. There's a dedicated video on this.

### Slide 10: What's next: AI-Native operators
- **Visual:** [3B1B] Deck slide 37, updated. An "Experimental" ribbon over: Model Gateway, MCP tools, agentic components. A second ribbon, "Planned": Model-as-a-Service operator, Cost, Database, Events.
- **Speaker notes:**
> Looking ahead, the biggest area of work is the AI-Native Canvas. Most software will soon use AI as part of its core function. Components will declare which AI models they need, and the Canvas will grant governed access through a model gateway that enforces guardrails and records usage for auditing, observability and cost. This is experimental today, and the model-as-a-service operator is planned. It's covered in its own video. Cost control, database services and event management operators are also on the roadmap.

### Slide 11: Find out more
- **Visual:** [STATIC] Links: tmforum.org/oda, tmforum.org/oda/directory, github.com/tmforum-oda/oda-canvas, and the oda-ca-docs Component Design Guidelines.
- **Speaker notes:**
> To learn more, see the Open Digital Architecture pages on the TM Forum website, browse the ODA Component Directory, and explore the reference implementation on GitHub at tmforum-oda slash oda-canvas.

---

## Source check

| Claim | Source |
|---|---|
| Three routes, DTW Copenhagen PoCs (AWS, Azure, China Mobile, Google, Oracle) | `Canvas-design.md` "How do I buy or build a Canvas?" |
| Test kit and certification | `Canvas-design.md`; `README.md` intro paragraph |
| Operator catalogue and status | `source/operators/README.md`; TMFOP006 and 009 READMEs ("Implementation Planned"); TMFOP008 ("should not be used directly", prototype) |
| Observability options | `source/operators/TMFOP002-API-Management/istio/README.md` (`openMetricsImplementation`) |
| Carbon implemented | `source/operators/TMFOP011-Carbon-Management/README.md` ("Status: Implemented") |
