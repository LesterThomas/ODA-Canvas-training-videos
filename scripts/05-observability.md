---
deck-id: 05-observability
replaces: none (new topic. Observability-design.md has no video, and deck 01 promises one)
linked-from: to add to oda-canvas Observability-design.md and charts/observability-stack/README.md once published
use-cases: UC006, UC011, UC012
oda-canvas-commit: 4387390f667851df1174335b124c051c899b8c1f  (canvas-oda 1.2.6-rc7 on the demo cluster, Kong API operator patched with the fix in PR 651)
target-length: ~9–10 min (concept + live Prometheus, Grafana and Jaeger)
status: draft script
---

# Observability in the ODA Canvas

A new video. The upstream design doc (`Observability-design.md`) lists three use cases and no video,
and deck 01 promises one. It shows how a component **declares** its metrics API in its YAML, how the
Canvas turns that into scrape configuration for the observability platform, and then the reference
stack (`charts/observability-stack`) live: Prometheus, Grafana and Jaeger, fed by the OpenTelemetry
Collector.

**Demo environment (2026-10-23, changes approved by the user):**
- `observability` release (observability-stack 0.1.0) in `monitoring`: Prometheus, Grafana, Jaeger
  all-in-one, OpenTelemetry Collector, kube-state-metrics, Alertmanager.
- Canvas `canvas-oda 1.2.6-rc7` with the **Kong** API operator. That operator never created
  ServiceMonitors (`"apitype"` instead of `"apiType"`, issue 650). The cluster runs the fixed image
  `tmforumodacanvas/api-operator-kong:1.1.2-issue650`, built locally from the fix in PR 651. A
  `helm upgrade` of `canvas` would put back 1.1.1, so redo `kubectl set image` after any upgrade.
- Component: release **obs** from `feature-definition-and-test-kit/testData/productcatalog-v1`
  (images `tmforumodacanvas/*:1.0.0`, published 2026-10-19), traces sent to
  `observability-opentelemetry-collector.monitoring…:4318/v1/traces`.
- Traffic: `skills/canvas-ops-tutorial/scripts/exercise_catalog_api.py`, one round every 20–45 s.
- The business metric is **`obs_productcatalogmanagement_api_counter`**: this image prefixes it with the
  component instance name. The upstream chart README still says `product_catalog_api_counter`.
- Grafana: an **ODA Component** dashboard, added for this video (`demos/observability/oda-component-dashboard.json`).
- Canvas Portal → Observability shows Prometheus found and Grafana "Not configured" (it looks for other
  Grafana service names) and has no Jaeger card. The user chose to show it as it is.

---

## Opening

### Slide 1: Observability in the ODA Canvas (presenter introduction)
- **Visual:** [CLIP Obs-01-Presenter] The presenter's recording (`decks/05-observability/Intro-video.mp4`, 54.6 s),
  muted, with overlays timed to its Whisper segments: title lower third, "Traditionally", the component's
  metrics declaration, open standards, then the running agenda. Its own sound is the narration
  (`presgen.py use-recording … --sync`).
- **Speaker notes:** (as spoken in the recording)
> Welcome to the fifth video in the ODA Canvas training series, on observability.
> Traditionally, every application arrives with its own monitoring agents and its own dashboards.
> Operations teams then spend weeks wiring each into their own tools.
> An ODA Component is different. It declares its metrics APIs in its specification.
> The Canvas reads that declaration and configures the observability platform for it automatically.
> It uses open standards, OpenMetrics for metrics and OpenTelemetry for traces.
> So any compliant platform can be used.
> In this video, we look at the three kinds of observability the Canvas supports.
> We see how a component's metrics are wired up when it is deployed.
> Then we explore the reference stack live, with Prometheus, Grafana and Jaeger.

---

## Concept

### Slide 2: One view across many components
- **Visual:** [NATIVE] Several ODA Component symbols from different vendors (labelled Vendor A, B, C)
  on the Canvas picture, each with its own small dashboard icon that fades out. One shared
  observability panel fades in above the Canvas, with lines from each component into it. Then a dashed
  trace runs from component to component and down into the Canvas services (review 2026-10-23).
- **On-screen text:** "Many vendors · one operations view", "One trace across components and Canvas services"
- **Speaker notes:**
> A service provider may run dozens of components from many different vendors.
> The operations team needs one consistent view across all of them.
> They should not need a different tool for each vendor.
> The Canvas provides that view, by connecting every component to the same observability platform.
> It can even trace a single request across components, and into the Canvas services they use.

### Slide 3: Three kinds of observability
- **Visual:** [NATIVE] Three cards build left to right in the observability sky colour:
  "Technical metrics" (CPU, memory, requests · UC011), "Business metrics" (orders, catalog changes ·
  UC012), "Traces" (one request, across components and Canvas services).
- **Speaker notes:**
> The Canvas supports three kinds of observability.
> Technical metrics show how a component is running, such as its CPU, memory and request rates.
> Business metrics are specific to each component, for example the number of orders it has captured.
> Traces follow a single request step by step, even across components and the Canvas services they use.
> Together, they show whether a component is healthy, and give insights into its business performance metrics.
> They also help troubleshoot issues, for example to track where time is spent for a request.

### Slide 4: Built on open standards
- **Visual:** [NATIVE] Two standards, each a large label with a short line. OpenMetrics → "metrics
  endpoint, scraped" and OpenTelemetry → "traces, pushed over OTLP". Below, a row of platform pills:
  Prometheus, Grafana, Jaeger, "or another observability platform".
- **Speaker notes:**
> The Canvas builds on two open standards.
> OpenMetrics defines how a component exposes its metrics for a platform to collect.
> OpenTelemetry defines how a component sends traces and other telemetry.
> The reference implementation uses Prometheus, Grafana and Jaeger.
> But the Canvas mandates no product. A managed cloud service, or another observability platform, can be used instead.

### Slide 5: The reference observability stack
- **Visual:** [DEMO] Terminal replay of real output: `helm list -n monitoring` (the `observability`
  release, chart observability-stack-0.1.0) then `kubectl get pods -n monitoring`. Labels pop beside the
  Prometheus, Grafana, Jaeger and OpenTelemetry Collector pods.
- **Speaker notes:**
> The Canvas repository includes a Helm chart for a complete reference stack.
> It installs into its own monitoring namespace.
> Prometheus collects and stores metrics, and Grafana turns them into dashboards.
> Jaeger stores and displays traces.
> The OpenTelemetry Collector receives telemetry from components and forwards traces to Jaeger.

### Slide 6: A component declares its metrics API
- **Visual:** [NATIVE] The ODA Component symbol with its Management segment highlighted. Beside it, the
  YAML from the test chart builds line by line: `managementFunction:` → `exposedAPIs:` → `- name: metrics`
  → `apiType: openmetrics` → `path: /obs-productcatalogmanagement/metrics` → `port: 4000`. The CRD also
  accepts `prometheus` (the test chart uses it), but `openmetrics` is the preferred value, and the video shows only `openmetrics` (user, 2026-10-23).
- **Speaker notes:**
> Metrics start with the component specification.
> In the management function, the component lists a metrics API alongside its other exposed APIs.
> Its API type is openmetrics, the open standard for metrics.
> It also gives the path and port where its metrics can be read.
> The component does not say which observability platform will read them. That is the Canvas's job.

### Slide 7: How the Canvas wires it up
- **Visual:** [3B1B] Flow that builds with the narration (house motifs, operator gears in teal):
  Component → Component operator gear → ExposedAPI "metrics" → API operator gear → ServiceMonitor →
  Prometheus, with a dashed "scrape every 15 s" arrow from Prometheus back to the component's metrics
  endpoint. On uninstall, the ServiceMonitor fades away.
- **Speaker notes:**
> When the component is deployed, the component operator creates an ExposedAPI resource for each API.
> The API operator handles each one.
> For an API of type openmetrics, it also configures the observability platform.
> In the reference Canvas, it creates a ServiceMonitor resource.
> Prometheus finds the ServiceMonitor and starts scraping the metrics endpoint every fifteen seconds.
> When the component is removed, the ServiceMonitor is removed with it.

### Slide 8: Choose how metrics are collected
- **Visual:** [NATIVE] Setting `openMetricsImplementation` with three cards. ServiceMonitor (default,
  Prometheus operator). PrometheusAnnotation (pod annotations, for managed Prometheus services).
  DataDogAnnotation (pod annotations in Datadog's format). Footer: "or another observability platform".
- **Speaker notes:**
> Not every platform uses ServiceMonitors.
> So the API operator has a setting called open metrics implementation.
> ServiceMonitor is the default, for platforms that use the Prometheus operator.
> Prometheus annotation adds pod annotations instead, which some managed Prometheus services read.
> Datadog annotation uses Datadog's own annotation format.
> The component specification stays the same in every case.

### Slide 9: Live: the Canvas created the ServiceMonitor
- **Visual:** [DEMO] Terminal replay of real output: `kubectl get exposedapis -n components` (the metrics
  API highlighted), then `kubectl get servicemonitors -n components` showing
  `obs-productcatalogmanagement-metrics`, then its endpoint (`path`, `interval: 15s`, `targetPort: 4000`).
- **Speaker notes:**
> Here is a product catalog component, deployed as release obs.
> It has three exposed APIs, and one of them is the metrics API.
> The Canvas has created a ServiceMonitor for it automatically.
> It points at the component's metrics path on port four thousand, every fifteen seconds.
> Nobody had to configure Prometheus by hand.

---

## Prometheus

### Slide 10: Live: Prometheus finds the component
- **Visual:** [DEMO] Prometheus UI → Status → Target health. Filter "obs". The target
  `obs-productcatalogmanagement-sm` shows **UP**, with its scrape URL and last scrape time highlighted.
- **Speaker notes:**
> In Prometheus, the target health page lists everything it scrapes.
> The product catalog's metrics endpoint is here, and its state is up.
> Prometheus picked it up from the ServiceMonitor within seconds of the component being deployed.

### Slide 11: Live: business metrics in Prometheus
- **Visual:** [DEMO] Prometheus → Query. Type
  `sum by (NotificationEvent) (rate(obs_productcatalogmanagement_api_counter[5m]))`, switch to Graph,
  15 minute range. Lines per event type. Highlight CategoryCreationNotification in the legend.
- **Speaker notes:**
> This component counts its business events.
> Every time a catalog, category, product specification or product offering is created or removed, a counter goes up.
> This query shows the rate of each kind of event over the last fifteen minutes.
> These are business metrics, defined by the component itself, and collected by the Canvas.

### Slide 12: Technical metrics come with the platform
- **Visual:** [DEMO] Prometheus → Query. `sum by (pod) (rate(container_cpu_usage_seconds_total{namespace="components"}[5m]))`,
  Graph. One line per component pod.
- **Speaker notes:**
> Technical metrics need nothing from the component at all.
> The platform already reports the CPU and memory of every container.
> Here is the CPU use of each pod in the product catalog component.
> The service mesh can add request rates and latencies in the same way.

---

## Grafana

### Slide 13: Live: a Grafana dashboard for the component
- **Visual:** [DEMO] Grafana (logged in off camera) → Dashboards → ODA Component. Panels: "Business
  events per minute" by type, "Events by type" (bar gauge), "CPU by pod", "Memory by pod". Hover a point
  on the business-events panel to show the tooltip.
- **Speaker notes:**
> Grafana turns these metrics into dashboards, using Prometheus as its data source.
> This dashboard puts one component's business and technical metrics side by side.
> At the top are business events per minute, by type.
> Below are the CPU and memory of each of the component's pods.
> An operations team can build one dashboard like this and reuse it for every component.

### Slide 14: Live: the platform dashboards
- **Visual:** [DEMO] Grafana → Kubernetes / Compute Resources / Namespace (Pods), namespace `components`.
  Scroll from CPU to memory.
- **Speaker notes:**
> The reference stack also comes with standard Kubernetes dashboards.
> Choosing the components namespace shows the CPU and memory of every deployed component together.
> So the same tool covers both the platform and the business view.

---

## Traces

### Slide 15: How traces reach Jaeger
- **Visual:** [3B1B] A request arrives at the component. Spans light up inside it (HTTP request,
  validation, database calls). They travel as OTLP over HTTP on port 4318 to the OpenTelemetry Collector,
  which batches them and forwards them to Jaeger. Label the collector "or another OpenTelemetry backend".
- **Speaker notes:**
> Traces work the other way round.
> Instead of being scraped, the component pushes its traces as they happen.
> It sends them using the OpenTelemetry protocol to the OpenTelemetry Collector.
> The collector batches them and forwards them to Jaeger.
> Because the protocol is standard, the collector could forward them to another tracing platform instead.

### Slide 16: Pointing a component at the collector
- **Visual:** [NATIVE] The values snippet from the test chart, highlighted line by line:
  `otlp:` → `protobuffCollector:` → `enabled: true` → `url: http://observability-opentelemetry-collector.monitoring…:4318/v1/traces`.
  Note: "Set at install time, not in the Component specification".
- **Speaker notes:**
> The collector address is set when the component is installed, in its Helm values.
> It is part of the environment, not of the component specification.
> Here, tracing is enabled and the component sends its traces to the collector in the monitoring namespace.

### Slide 17: Live: finding traces in Jaeger
- **Visual:** [DEMO] Jaeger UI → Search. Service `obs-productcatalogmanagement`, Find Traces. The scatter
  chart and the list of traces (POST, DELETE…) with span counts and durations.
- **Speaker notes:**
> In Jaeger, the product catalog appears as its own service.
> Searching it lists recent traces, one for each API request.
> The chart at the top shows how long each request took.
> So a slow or failing request stands out straight away.

### Slide 18: Live: inside one request
- **Visual:** [DEMO] Click one POST trace. The timeline: the HTTP request, the Swagger middleware
  (metadata, validator, router), then the MongoDB calls. Expand the slowest span to show its tags.
- **Speaker notes:**
> Opening a trace shows one request from end to end.
> It starts with the incoming HTTP call.
> Then come the middleware steps that validate the request against the TMF API definition.
> Last come the calls to the database.
> Each step shows exactly how long it took, so it is clear where the time goes.

---

## Portal, testing and wrap-up

### Slide 19: Observability in the Canvas Portal
- **Visual:** [3B1B] The Canvas Portal's Observability page as designed, recreated in its own layout (user,
  2026-10-23): Prometheus, Grafana and Jaeger "Found in cluster" with their real in-cluster addresses, and
  Langfuse greyed out as "Not configured". The live page in the demo cluster finds only Prometheus (it
  looks for other Grafana service names and has no Jaeger card). Closing caption: "The Canvas is still under
  development · LLM observability is in the backlog".
- **Speaker notes:**
> The Canvas Portal has an observability page that finds the telemetry tools in the cluster.
> It shows Prometheus, Grafana and Jaeger, each with its address inside the cluster.
> Langfuse, a tool for LLM observability, is shown in grey.
> The Canvas is still under development, and LLM observability is in the backlog.

### Slide 20: Tested with BDD features
- **Visual:** [NATIVE] Two feature cards. UC012-F002 "Configure Open-Metrics collection": install → a
  ServiceMonitor exists → uninstall → it is removed. UC012-F001 "OpenTelemetry Collector configuration":
  add catalog data → new events in the collector. Tags `@ServiceMonitor` and `@OpenTelemetryCollector`.
- **Speaker notes:**
> These behaviours are tested automatically.
> One BDD feature installs a component and checks that a ServiceMonitor is created, then removed on uninstall.
> Another adds catalog data and checks that new events reach the OpenTelemetry Collector.
> Both are tagged, so a Canvas without these tools simply skips them.

### Slide 21: Summary
- **Visual:** [NATIVE] Recap list with icons, then links: `github.com/tmforum-oda/oda-canvas`,
  `Observability-design.md`, `charts/observability-stack`.
- **Speaker notes:**
> To recap.
> A component declares its metrics API in its specification, and sends its traces using OpenTelemetry.
> The Canvas configures the observability platform for it automatically, and removes the configuration when the component is uninstalled.
> The reference stack uses Prometheus, Grafana and Jaeger, but any platform that supports the open standards can be used.
> To find out more, see the observability design and the observability stack chart in the ODA Canvas repository.

---

## YouTube

Used by `youtube_package.py` to build the upload: title, description (with the chapter list added at the
end), and captions from the speaker notes.

- **Title:** Observability in the ODA Canvas | ODA Canvas training, part 5
- **Chapters:** 1=Introduction; 19=Observability in the Canvas Portal
- **Description:**
> Traditionally, every application arrives with its own monitoring agents and dashboards, and operations teams spend weeks wiring each one into their tools. An ODA Component is different: it declares its metrics API in its specification, and the ODA Canvas configures the observability platform for it automatically, using open standards (OpenMetrics for metrics, OpenTelemetry for traces), so any compliant platform can be used. This fifth video in the ODA Canvas training series explains how.
>
> It covers the three kinds of observability (technical metrics, business metrics and traces), how the Canvas wires a component's metrics API to the platform with a ServiceMonitor, and the choices for managed services. It then explores the reference observability stack live: business and technical metrics in Prometheus, a component dashboard in Grafana, and traces in Jaeger, sent through the OpenTelemetry Collector. It finishes with the Canvas Portal and the BDD features that test it all.
>
> Part 1, Introduction to the ODA Canvas: https://youtu.be/RD6XJUPc5hw
> Part 2, How do I buy or build an ODA Canvas?: https://youtu.be/fMXEmWalRFc
> Part 3, Authentication and Authorization in the ODA Canvas: https://youtu.be/a6j6tUDTS80
> Part 4, The AI-Native ODA Canvas: https://youtu.be/0QtnMJDblvE
- **Links:**
> Observability design: https://github.com/tmforum-oda/oda-canvas/blob/main/Observability-design.md
> Observability stack chart: https://github.com/tmforum-oda/oda-canvas/tree/main/charts/observability-stack
> ODA Canvas reference implementation: https://github.com/tmforum-oda/oda-canvas

---

## Decisions

- 2026-10-23: Install `productcatalog-v1` as release `obs` and drive it with `exercise_catalog_api.py` (user).
- 2026-10-23: Add an "ODA Component" Grafana dashboard for the video, kept in `demos/observability/` (user).
- 2026-10-23: Show the Portal's Observability page as it is (user). Changed on review: show the page as designed, with Prometheus, Grafana and Jaeger, Langfuse in grey, and LLM observability in the backlog.
- 2026-10-23: Fix the Kong operator bug upstream (issue 650, PR 651) and run the fixed image locally (user).

## Source check

| Claim | Source in oda-canvas @ 4387390 |
|---|---|
| Use cases UC006, UC011, UC012 | `Observability-design.md`, `usecase-library/UC006…`, `UC011…`, `UC012…` |
| Reference stack = Prometheus, Grafana, Jaeger, OpenTelemetry Collector, namespace `monitoring` | `charts/observability-stack/README.md`, `values.yaml` |
| Metrics API declared in `managementFunction.exposedAPIs` with `apiType` `openmetrics` (preferred) or `prometheus`, path and port; enum in `charts/oda-crds/templates/oda-exposedapi-crd.yaml` | `feature-definition-and-test-kit/testData/productcatalog-v1/templates/component-productcatalog.yaml` |
| API operator creates a ServiceMonitor for `prometheus`/`openmetrics` APIs, interval 15 s | `source/operators/TMFOP002-API-Management/istio/apiOperatorIstio.py:187–223, 571–620` (Kong: same, after PR 651) |
| ServiceMonitor removed with the component | owner reference via `kopf.adopt` in `createOrPatchServiceMonitor`; `UC012-F002` uninstall scenario |
| `OPENMETRICS_IMPLEMENTATION` = ServiceMonitor (default), PrometheusAnnotation, DataDogAnnotation | `source/operators/TMFOP002-API-Management/istio/README.md:35–40` |
| Traces: OTLP HTTP :4318 → collector → Jaeger | `charts/observability-stack/values.yaml` (opentelemetry-collector pipelines), `skills/canvas-ops-tutorial/references/07-view-observability.md` |
| Collector URL set in Helm values (`otlp.protobuffCollector`) | `feature-definition-and-test-kit/testData/productcatalog-v1/values.yaml:55–60` |
| Technical metrics from the platform (cAdvisor) and service mesh | `usecase-library/UC011-View-Technical-Observability.md`, `pumlFiles/technical-observability.puml` |
| Portal Observability page discovers Langfuse, Grafana, Prometheus by service name | `canvas-portal-v2/backend/k8s/resources/observability.py` |
| BDD features UC012-F001, UC012-F002 and their tags | `feature-definition-and-test-kit/features/UC012-F00{1,2}-…feature` |
