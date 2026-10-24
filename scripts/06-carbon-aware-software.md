---
deck-id: 06-carbon-aware-software
replaces: https://youtu.be/I78MSow6RQg  (Carbon Aware Software, 13:25)
linked-from: oda-canvas source/operators/TMFOP011-Carbon-Management/README.md:6
original-transcript: presentations/transcripts/06-carbon-aware-software.md
oda-canvas-commit: c39da6340dbc971981bcb1eea5da5d718fac11d2
demo-scenario: source/operators/TMFOP011-Carbon-Management/carbon-management/carbon-aware-scaling-scenario.md
target-length: ~7 min
status: draft script
---

# Carbon-Aware Software with the ODA Canvas: updated script

The original is accurate, so this update tightens it rather than rewriting it.

**Main changes from the original:**
- Ties the content to the published names: TMFOP011, the `CarbonManagement` CRD
  (`oda.tmforum.org/v1alpha1`), Helm charts `carbon-management-operator` and `carbon-intensity-service`,
  the deployment label `carbon-aware: enabled`, a 5-minute reconcile, and the TMF628 data source.
- Replaces the conference-talk framing ("showcased at DTW Copenhagen") with neutral narration.
- Adds a short live demo built on the reproducible scenario in the repo.
- Keeps the roadmap items (location shifting, AI workloads, marketplace) clearly labelled as planned.
- Credits the developer (Adarsh) on screen.

**Demo environment:** reference Canvas plus the `observability-stack` (Prometheus and Grafana), KEDA,
`carbon-intensity-service`, `carbon-management-operator`, and the `ProductOrderCaptureAndValidation`
component (release `ocv1`), set up as in `carbon-aware-scaling-scenario.md`.

---

### Slide 1: Title
- **Visual:** [STATIC] "Carbon-Aware Software with the ODA Canvas"
- **Speaker notes:**
> This video introduces carbon-aware software, and the ODA Canvas operator that makes ordinary components carbon-aware without changing their code.

### Slide 2: The problem
- **Visual:** [3B1B] A data centre icon running at constant load, against a grid-intensity curve swinging between green and red. On-screen text: "ICT ≈ 2–4% of global emissions".
- **Speaker notes:**
> Information and communication technology accounts for roughly two to four percent of global emissions, and that share is growing. Data centres run all the time, but the electricity grid doesn't stay equally clean. Depending on when and where it runs, exactly the same computation can produce very different amounts of carbon.

### Slide 3: What carbon-aware software is
- **Visual:** [3B1B] A definition card. A gauge shows "45–99% reduction" with a citation chip for the IEEE study.
- **Speaker notes:**
> Carbon-aware software measures the carbon intensity of the electricity it uses and changes its own behaviour to reduce emissions: when, where and how much it runs. Published research suggests reductions of between forty-five and ninety-nine percent are possible, depending on how much renewable energy is in the mix.

### Slide 4: Three ways to do it
- **Visual:** [3B1B] Three pillars build in turn. Time shifting (a batch job slides along a timeline to a green slot). Location shifting (a workload hops from Frankfurt to the Nordics). Demand shaping (a replica bar shrinks on red and grows on green). Badges: shaping "Implemented", time and location shifting "Planned".
- **Speaker notes:**
> There are three main techniques. Time shifting runs flexible work, such as model training, software updates or batch processing, when the grid has plenty of renewable energy. Location shifting moves work to regions with cleaner grids, as long as it isn't latency-sensitive. Demand shaping scales capacity up and down with the grid's carbon intensity in real time, slowing down when it's carbon-intensive and catching up when it's green. The Canvas operator implements demand shaping today, and time and location shifting are planned.

### Slide 5: Where it fits in the Canvas
- **Visual:** [3B1B] The operator catalogue from deck 01 with the TMFOP011 Carbon Management tile highlighted. A component's deployments get a `carbon-aware: enabled` tag. A TMF628 performance API supplies a carbon-intensity feed.
- **Speaker notes:**
> Carbon management is one of the Canvas operators, number eleven in the catalogue. A component's developers mark which of its workloads can be carbon-aware. The operator then reads carbon-intensity data from the Canvas, served through the TM Forum TMF628 performance management API with current and forecast values, and controls how far those workloads may scale.

### Slide 6: How the operator works
- **Visual:** [3B1B] The architecture flow from the operator README, animated as a loop every 5 minutes: fetch intensity from TMF628, look up max replicas from the thresholds, find labelled deployments, create or update the KEDA ScaledObject, then KEDA scales the deployment within the cap.
- **Speaker notes:**
> Every five minutes, the operator fetches the latest carbon intensity, looks up the replica limit that matches it, finds every deployment labelled as carbon-aware, and creates or updates a KEDA scaled object for each. KEDA, the Kubernetes event-driven autoscaler, keeps scaling on normal workload signals, but never above the carbon-adjusted limit.

### Slide 7: The declaration
- **Visual:** [3B1B or DEMO] The `CarbonManagement` YAML, with the sections highlighting in turn: `deploymentSelector`, `scaledObjectTemplate` (Prometheus trigger on `pending_orders`), `maxReplicasByCarbonIntensity` (400 → 9, 500 → 5, 550 → 1), `defaultMaxReplicas: 10`, `carbonIntensityForecastDataSource`.
- **Speaker notes:**
> Developers express all of this declaratively in a carbon management resource. It selects the deployments by label. It defines the normal scaling trigger, here the number of pending orders reported as a business metric. And it sets a ladder of limits: up to nine replicas when the grid is below four hundred grams of carbon dioxide per kilowatt-hour, five when it's higher, and just one above five hundred and fifty. If carbon data isn't available, a default limit applies.

### Slide 8: Choosing which workloads
- **Visual:** [3B1B] A component with three microservices. The real-time API service stays untagged. The back-end order processor gets the carbon-aware tag.
- **Speaker notes:**
> Not everything should be carbon-aware. Microservices that serve real-time APIs need to stay available. Back-end processing that can tolerate some delay, such as near-real-time order processing, is ideal. In this example, only the product order processor is marked.

### Slide 9: Live demo: high-carbon grid
- **Visual:** [DEMO] `kubectl get carbonmanagement productorder -n components -o yaml` (status shows the current intensity of about 545 and maxReplicas 1). Then `kubectl get scaledobject` shows the maxReplicaCount of 1. Grafana shows pending orders rising to around 35 with 1 running pod.
- **Speaker notes:**
> Here's the effect on a live Canvas. Carbon intensity is high, so the operator has capped the order processor at one replica. Orders are still being processed, but more slowly, and the pending-order queue grows. That's an acceptable trade-off for this workload.

### Slide 10: Live demo: low-carbon grid
- **Visual:** [DEMO] The intensity drops to about 380. The status shows maxReplicas 9. Grafana shows pods stepping up to 9 and the queue draining, then scaling back down when it's empty.
- **Speaker notes:**
> When the grid gets greener, the limit is lifted. KEDA sees the backlog and scales the processor up, step by step, to nine replicas, works through the queue, and scales back down once it's clear. With no backlog, it wouldn't scale up at all. Carbon intensity sets the ceiling, and real demand still decides the actual scale.

### Slide 11: The results
- **Visual:** [3B1B] Three Grafana panels redrawn from the scenario (the original talk used 80 simulated orders per run; the repo scenario only says "identical backlog". **[VERIFY]** the count before putting a number on screen): running pods; order completion rate; energy consumption. The high-carbon run is flat and slow, and the low-carbon run bursts.
- **Speaker notes:**
> Running the same backlog of orders once in a high-carbon period and once in a low-carbon period shows the pattern clearly. In the high-carbon run, energy use and throughput are held down and orders queue. In the low-carbon run, the system bursts, using more energy, but energy that comes mostly from renewables. Demand moves to the cleanest hours.

### Slide 12: Takeaways and roadmap
- **Visual:** [3B1B] Three ticks: demand shaping works; no code changes; declarative policy. Then three roadmap cards marked "Planned": location shifting across regions, carbon-aware AI workloads through the AI gateway, and carbon data in the component marketplace.
- **Speaker notes:**
> The takeaways: carbon-aware demand shaping works, and it needs no code changes. An existing component was made carbon-aware just by adding a declaration and labelling the right workloads. Next on the roadmap are location shifting across multi-region deployments, applying the same approach to AI workloads through the AI gateway, and publishing carbon data in the component marketplace to help teams choose greener components.

### Slide 13: Credits and get involved
- **Visual:** [STATIC] "Carbon Management Operator developed by Adarsh, TM Forum Innovation Hub" **[VERIFY credit wording and surname with the developer]**. Links: github.com/tmforum-oda/oda-canvas → `source/operators/TMFOP011-Carbon-Management`, and the TM Forum Innovation Hub.
- **Speaker notes:**
> The carbon management operator was developed in the TM Forum Innovation Hub. All of the code is open source in the oda-canvas repository on GitHub, and new contributors are welcome.

---

## Source check

| Claim | Source |
|---|---|
| 2–4% ICT emissions; 45–99% | Original talk; `TMFOP011…/README.md` cites the IEEE study for 45–99% |
| Shaping implemented; scheduling planned | `TMFOP011-Carbon-Management/README.md` "Status" lines |
| CRD, 5-minute reconcile, thresholds, labels | `TMFOP011…/carbon-management/README.md` |
| TMF628 carbon-intensity service | `source/tmf-services/TMF628_Performance_Management/README.md` (the half-hour forecast interval is only in the original talk, so it was left out of the narration) |
| Same-backlog experiment, Grafana panels | `carbon-management/carbon-aware-scaling-scenario.md` |
