---
deck-id: 04-ai-native-oda-canvas
replaces: https://youtu.be/MICzwN8VB_o  (AI Native ODA Canvas, 30:32)
linked-from: oda-canvas AI-Native-Canvas-design.md:7, and the chapter list at the end of that file
original-transcript: presentations/transcripts/04-ai-native-oda-canvas.md
source-diagrams: oda-canvas images/AI-Native Canvas/*.PNG
other-sources: TM Forum GB1085 Model-as-a-Service (MODaaS) v1.0.0 (Introductory Guide, Alpha, 14-Jan-2026); DORA 2025 State of AI-assisted Software Development
oda-canvas-commit: c39da6340dbc971981bcb1eea5da5d718fac11d2  (unchanged at origin/main on 2026-10-19)
target-length: ~12 min (one video, confirmed by the user 2026-10-19)
status: facts confirmed 2026-10-19; deck at decks/04-ai-native-oda-canvas.pptx
---

# AI-Native ODA Canvas: updated script

The original (30:32) is accurate, but it is two and a half times the series' longest format. The
earlier plan split it in two. The user chose one video of about 12 minutes instead, with two new
threads: **Model-as-a-Service** (from TM Forum GB1085) as the way the Canvas gives agents governed
access to models, and **how AI is used to build the Canvas itself** (AGENTS.md, agent skills, and why
a modular architecture matters, from the DORA 2025 report). Classical ML and the detail of the
evaluation dashboards are trimmed to a line each.

**Main changes from the original:**
- Opens with the presenter on camera (slide 1), as every deck now does.
- Four parts: AI-native components (MCP, agentic components, dependent AI models); Model-as-a-Service
  and the model gateway; running AI at scale (Canvas AI services, the Canvas as a registry,
  evaluation); and AI building the Canvas.
- Slide 3 uses trends across the 59 DTW 2026 Catalysts (counts, no project names) in place of the three 2025 Catalysts.
- Neutral narration. "At Vodafone…" becomes "service providers…".
- Naming follows deck 02. The concept is the **model gateway** (the design doc's "AI gateway"), provided
  by the experimental **Model-as-a-Service operator** (TMFOP009). GB1085 calls the wider capability
  **MODaaS**, a control plane between agents and model providers.
- **Simulated demo (slide 12):** the real Canvas Portal *Model Gateway* page, with its API responses
  supplied by the recorder, because the Model-as-a-Service operator and the
  `modelgatewayservices.oda.tmforum.org` CRD aren't installed on the demo cluster. The slide says
  "Simulated" on screen and in the narration.
- **Live (slides 20 and 22):** recordings of the public oda-canvas repository on GitHub, showing
  `AGENTS.md` and the `create-oda-operator` skill.

**Demo environment** (2026-10-19): the canvas from deck 02 (canvas-oda 1.2.6-rc4) with no components
installed, and no Model Gateway CRD. Portal at `http://localhost:8090` (login in `demos/.env`). The
Portal's AI → Model Gateway page reads `/api/model-gateway-services`. When the CRD is missing it shows
"CRD is not installed in this cluster", so the simulated recording answers that route (and
`/availability` and `/proxy/*` for the test dialog) from a fixture in `demos/ai/`.

---

## Introduction

### Slide 1: The AI-Native ODA Canvas (presenter introduction)
- **Visual:** [NATIVE for now, then CLIP AI-01-Presenter] Title-card placeholder, "The AI-Native ODA
  Canvas", with the ODA Canvas picture and its AI module lit. The presenter records a
  head-and-shoulders introduction to camera, reading these notes.
- **Speaker notes:**
> AI agents are quickly becoming the way service providers deliver intelligent, autonomous services.
>
> Most organisations started with a few pilots. Each team wired its agents directly to its favourite model provider. That works for a demo. At enterprise scale it brings lock-in, hidden costs and inconsistent guardrails. The AI-Native Canvas takes a different approach. Agents are packaged as ODA Components. They declare the tools and models they need, and the Canvas grants governed access.
>
> In this video, we look at how components become tools for agents, and how agents become components. We cover model as a service and the model gateway. We look at the services needed to run AI at scale. And we finish with how AI is helping us build the Canvas itself.

### Slide 2: Four questions
- **Visual:** [NATIVE] Four question cards build in turn, each with an icon: "Components as tools for
  agents?" (MCP), "Agents as components?" (agent symbol, white), "Operating many agents at scale?"
  (gateway), "AI building the Canvas?" (code). The first three carry a small "AI-Native Canvas design"
  tag, the fourth "AI-assisted development".
- **Speaker notes:**
> The AI-Native Canvas work started from three questions. How do we expose ODA Components as tools for AI agents? How do we deploy the agents themselves as components? And how do we operate many agents, from many vendors, with proper governance? This video adds a fourth question. How can AI help us build the Canvas?

---

## Part 1: AI-native components

### Slide 3: What the 2026 Catalysts show
- **Visual:** [NATIVE] No project names. A large "59" with "Catalysts at DTW 2026" beside it. Below,
  horizontal bars build in narration order, each with its count and a share of 59: "Use AI · 53",
  "Built from AI agents · 29", "Autonomous networks · 37", "Trust, security and governance · 13",
  "Agent platform: registry, runtime, lifecycle, model gateway · 5". Bars in AI pink, with
  autonomous networks in Canvas blue. Footer: "Source: tmforum.org/catalysts, October 2026".
  See "DTW 2026 Catalyst tally" below for the method and lists. Last, a banner: "Much of the
  AI-Native Canvas is lessons learned from these Catalysts".
- **Speaker notes:**
> TM Forum's Catalyst projects show where the industry is heading. At DTW twenty twenty-six, there were fifty-nine Catalysts. Nine in ten used AI. About half were built from AI agents, often several agents working together. More than half targeted autonomous networks. About one in five tackled trust, security and governance for agents. And several built the platform that agents need, such as registries, runtimes and a model gateway. Much of the work in the AI-Native Canvas is lessons learned from these Catalyst projects.

### Slide 4: MCP is one more exposed API
- **Visual:** [3B1B] The ODA Component symbol with its exposed-API lollipops on the right. A YAML panel
  shows the real `exposedAPIs` snippet from the product catalog test component: `productcatalog`
  (`apiType: openapi`), `metrics` (`openmetrics`), then `productcatalogmcp` (`apiType: mcp`,
  `path: …/mcp`) slides in and a new violet lollipop labelled "MCP" appears. Then the API operator gear
  turns, and the gateway between the component and an agent icon changes from short request arrows to
  one long-lived connection, labelled "long-lived connection".
- **Speaker notes:**
> Components already declare the APIs they expose. That includes cross-industry APIs such as OpenMetrics. So adding MCP was simple. MCP became one more API type. The product catalog test component exposes an MCP server beside its Open APIs. MCP keeps long-lived connections open, unlike short REST calls. Because the component declares the type, the API operator configures the gateway for it automatically.

### Slide 5: Descriptions are written for agents
- **Visual:** [3B1B] Left, a terse Swagger parameter: `filter · string · "Filter expression"`. Right,
  the same tool described for MCP: a plain-English description of what the tool does, and an argument
  description with a worked example, `lifecycleStatus=Active&name=Gold*`. An agent icon tries the
  terse version (red cross), then the described one (green tick) when the example lights up.
- **Speaker notes:**
> The heart of an MCP server is its plain-language description of each tool and argument. Swagger files were written for API experts. Agents need more. In testing, detailed explanations and concrete examples made the difference. One agent only used the filter argument correctly once an example was added. Version five of the TM Forum Open APIs includes JSON examples. They cover request and response payloads, embedded directly in the Open API specifications. That lets us generate MCP servers automatically.

### Slide 6: Agents as components
- **Visual:** [NATIVE] A white agentic ODA Component symbol on the left (the `mono` variant). Four
  assumption tiles build on the right: "Models are services, reached by API", "Approved model
  catalogues", "Non-deterministic, so evaluate continuously", "Extra services: vector DB, anonymisation,
  chunking".
- **Speaker notes:**
> The second question is about packaging agents as components. Four assumptions shape the design. Models run as services on the platform, and agents reach them through APIs. Service providers keep approved catalogues of models. Agents are non-deterministic, so they need continuous evaluation, not just fixed tests. And agents need extra services, such as vector databases and anonymisation, which the Canvas should provide.

### Slide 7: Dependent AI models
- **Visual:** [3B1B] The component splits into its sub-resources, as in deck 02: ExposedAPI and
  DependentAPI tiles, then a new AI-pink **DependentAIModel** tile with an "experimental" pill. Its YAML
  panel builds: two models with priorities 1 and 2, a use-case description, and guardrail thresholds.
  To the right an "Approved models" list filters it, and a tick marks the model the Canvas grants. A
  dashed arrow labelled "later" points from the DependentAIModel tile back into the Component.
- **Speaker notes:**
> With those assumptions, the component model extends naturally. A component already lists the APIs it depends on. Now it can list the AI models it depends on, in priority order. It describes its use case, and the guardrail thresholds it needs. The Canvas grants access to whichever models are on the approved list. This starts as an experimental resource of its own, called dependent AI model. Later it will join the main component specification.

---

## Part 2: Model as a service

### Slide 8: Training builds intelligence, inference builds cost
- **Visual:** [3B1B] Left, five agent icons, each wired straight to one or more model providers
  (generic cloud, open model, internal), forming a tangle of lines, labelled "Direct integration".
  Red tags appear on the tangle: "Lock-in", "Hidden cost", "Duplicate plumbing". The lines
  then straighten into one pink "Model as a Service" control plane between the agents (demand) and
  the providers (supply). The quote "Training builds intelligence. Inference builds cost." sits at the
  bottom. Source: GB1085 Problem Statement.
- **On-screen text:** "Demand", "Supply", "Model as a Service"
- **Speaker notes:**
> TM Forum's Model as a Service guide starts with a simple observation. Training builds intelligence, but inference builds cost. Today, many teams wire their agents directly to model providers. That creates lock-in, hidden costs and inconsistent guardrails. Every team rebuilds the same plumbing. Model as a service puts a control plane between agents and models. It separates the demand for intelligence from its supply.

### Slide 9: Three options
- **Visual:** [NATIVE] Three cards build left to right. "One hyperscaler's AI service": verdict
  "Rejected: model lock-in becomes platform lock-in". "Wait for an industry standard": verdict
  "Premature: the market is moving too fast". "Model as a Service": verdict "Selected: an internal
  standard, today" (highlighted in AI pink).
- **Speaker notes:**
> The guide weighed three options. Standardising on one hyperscaler's AI service was rejected. It just trades model lock-in for platform lock-in. Waiting for an industry-wide standard was judged premature, because the market moves too fast. Model as a service was selected. It gives a service provider its own standard layer today, without waiting for the market to settle.

### Slide 10: What the control plane provides
- **Visual:** [NATIVE] A central "Model as a Service" plate with seven service tiles building around
  it: "One API to every model", "Model catalogue", "Routing and failover", "Continuous quality checks",
  "End-to-end tracing", "Guardrails and PII redaction", "Cost and budgets". Small caption: "TM Forum
  GB1085, alpha".
- **Speaker notes:**
> The control plane offers a consistent set of services. One standard API reaches every model, internal or external. A catalogue helps developers pick the most efficient model that does the job. Routing fails over when a provider goes down. Golden datasets catch silent quality drift. Tracing follows every request end to end. Guardrails block prompt attacks and redact personal data. And cost tracking stops a runaway agent from blowing the budget.

### Slide 11: The model gateway in the Canvas
- **Visual:** [3B1B] Uses the ODA Canvas picture with the model module lit. Four numbered steps
  animate: (1) the Model-as-a-Service operator gear reads the component's DependentAIModel resource; (2) it
  configures the model gateway; (3) the component receives a credential and an endpoint (a key and a
  URL fly to it); (4) calls pass through the gateway, with guardrail, audit, metrics and token-cost
  badges ticking on. An "experimental" pill sits by the operator.
- **Speaker notes:**
> On the Canvas, this is the job of the Model-as-a-Service operator. It's experimental today. The operator reads the models a component depends on. It configures the model gateway. Then it gives the component a credential and an endpoint. From then on, every model call goes through the gateway. Guardrails are enforced, and each call is recorded for audit, observability and cost.

### Slide 12: Simulated demo: Model Gateway in the Canvas Portal
- **Visual:** [DEMO, simulated] Canvas Portal → AI → Model Gateway, recorded from the real Portal with
  its API answered from a fixture (`demos/ai/model-gateway.fixture.json`). The list shows eight AI
  models: high, medium and fast reasoning LLMs and multimodal models, each from a primary and an open
  provider (`primary-llm-high-reasoning` … `open-multimodal`), each with its own gateway endpoint. Open
  *Test connection* on `primary-llm-medium-reasoning`: get a token, list models, ask "In one sentence,
  what does a product catalog component do?" and show the reply. No on-screen "simulated" badge, and the
  narration says "This is how the Model Gateway will appear in the Canvas Portal" (user, 2026-10-19).
- **Speaker notes:**
> This is how the Model Gateway will appear in the Canvas Portal. The list shows the AI models available through the gateway. They cover high, medium and fast reasoning, and multimodal models. Each comes from a primary or an open provider, with its own gateway endpoint. The Portal can test the connection. It gets a token, lists the models, and sends a prompt through the gateway.

### Slide 13: Six levers of inference cost
- **Visual:** [NATIVE] Six lever cards in a 3×2 grid, each with a short label and a one-line example:
  "Capability: fit for the task", "Accuracy: is the last nine percent worth it?", "Latency: time to
  first token", "Throughput: tokens per second", "Context window: memory is expensive", "Token
  efficiency: verbose models cost more". Footer: "Sufficient intelligence at optimal cost".
- **Speaker notes:**
> The guide also explains what drives the cost of each answer. It names six levers. The first three are capability, accuracy and latency. The next three are throughput, context window and token efficiency. A cheaper model is a false economy if it fails the task. But the most capable model is often more than a task needs. The aim is sufficient intelligence at the optimal cost.

---

## Part 3: Running AI at scale

### Slide 14: Canvas services for AI
- **Visual:** [NATIVE] "Canvas AI capabilities", built tile by tile (redrawn from `Canvas AI
  Capabilities.PNG`): "Language, embedding and multimodal models", "Classical ML with MLOps", "Vector
  databases, anonymisation, chunking", "AI observability (LangSmith, OpenLLMetry or another
  platform)", "Model gateway", "Evaluation", "Registry of agents, tools and use cases".
- **Speaker notes:**
> To run agents from many vendors, the Canvas needs a broader set of services. It needs access to language, embedding and multimodal models. It needs classical machine learning, with proper MLOps. It needs supporting services, such as vector databases. Observability must cover model calls, with LangSmith, OpenLLMetry or another platform. And it needs the model gateway, an evaluation framework, and a registry of agents, tools and use cases.

### Slide 15: The Canvas with AI and data
- **Visual:** [3B1B] Redraw of `Canvas pre AI.PNG` → `Canvas with AI and Data.PNG`. Coloured standard
  components sit on the ODA Canvas picture. White agentic components join them. MCP lollipops appear
  on the systems-of-record components, and small "agent card" badges (A2A) on the agents. The model
  and data modules of the Canvas picture light up (model: "experimental", data: "experimental").
- **Speaker notes:**
> Here is how it fits together. Agentic components sit beside the standard components. Systems of record expose MCP, so agents can use them as tools. Agents publish agent cards, using agent-to-agent standards, so other agents can discover them. Agentic components are shown in white on purpose. Like engagement systems, agents can differentiate a service provider. They don't have to be standard, but they still follow the component model. The model and data operators, both experimental, extend the Canvas to models and data products.

### Slide 16: The Canvas describes itself
- **Visual:** [3B1B] Deployed components, APIs and agents flow into a "Resource Inventory · TMF639"
  box, which offers both an Open API lollipop and an MCP lollipop. An agent on the right connects over
  MCP and three question bubbles appear in turn: "What is deployed on this Canvas?", "Draw the product
  catalog and its APIs", "Install a product inventory component". The third shows a Helm icon and a
  "needs approval" tag.
- **Speaker notes:**
> Because everything on the Canvas is declared, the Canvas can describe itself. The reference implementation includes a resource inventory, based on the TMF six three nine Open API. It registers every component, API and agent. Like any TM Forum API, it is also offered as an MCP server. An operations agent, if requested and given the permissions, can ask what is deployed. It can also draw a component and its APIs. The MCP server also has Helm tools, so an agent can propose installing a component.

### Slide 17: Evaluation
- **Visual:** [3B1B] A timeline. Before deployment, a "golden set · eighty-seven questions" stack
  feeds a baseline score. In production, a stream of real questions and answers flows past and is
  scored by two evaluators side by side, a person and an "AI evaluator" (relevance, accuracy,
  completeness). A trend line on a small dashboard rises. A "model change" marker is checked against
  the baseline before it goes live.
- **Speaker notes:**
> Because agents are non-deterministic, they should ship with evaluation data. Before deployment, a golden set of questions sets a baseline. The TM Forum AI assistant used eighty-seven questions. In production, real questions and answers are logged and scored. People and AI evaluators rate them for relevance, accuracy and completeness. So a change, such as a new model, is checked against the baseline before it goes live.

---

## Part 4: AI building the Canvas

### Slide 18: AI is an amplifier
- **Visual:** [3B1B] Split screen. Left, a tidy grid of components with clear interfaces (lollipops and
  sockets). Right, a tangled monolith. An "AI coding agent" pulse passes over both. On the left the
  grid grows, cleanly, into more components. On the right the tangle grows into a bigger tangle.
  Caption: "DORA 2025: AI is an amplifier".
- **On-screen text:** "Amplifies strengths", "Amplifies dysfunction"
- **Speaker notes:**
> The AI tools we use to build the Canvas follow the same rule. Google's DORA report on AI-assisted software development found that AI is an amplifier. It magnifies the strengths of high-performing teams. It also magnifies the dysfunctions of struggling ones. With a modular, loosely coupled, API-first architecture, AI amplifies that. With a tightly coupled monolith, AI amplifies the chaos.

### Slide 19: Why ODA suits AI development
- **Visual:** [NATIVE] Four cards, each pairing an ODA principle with what it gives a coding agent:
  "Modular components → small, bounded tasks", "Open APIs and data models → clear contracts",
  "Component specification → declarative, checkable", "Use cases and BDD tests → automatic verification".
- **Speaker notes:**
> The Open Digital Architecture is a good fit for AI development. Modular components give an agent small, well bounded tasks. Open APIs and shared data models give it clear contracts to code against. The component specification is declarative, so the result can be checked. And the use cases and BDD tests let an agent verify its own work.

### Slide 20: Live: AGENTS.md in the oda-canvas repository
- **Visual:** [DEMO] Playwright recording of `github.com/tmforum-oda/oda-canvas` (public, visible Chrome
  window): the root listing with `AGENTS.md` highlighted, then its rendered page scrolling through
  *Project Overview*, *Modular Architecture* and *Do / Don't*. Then `source/operators/AGENTS.md`, with
  its operator table and *Python/KOPF Operator Pattern*. Overlay: "AGENTS.md at the root and in 6 main
  folders".
- **Speaker notes:**
> The Canvas repository documents itself for AI agents. There's an AGENTS dot M D file at the root, and in each main area of the repository. AGENTS dot M D is an open format that most coding agents read. It tells an agent what the project is, how it's structured, and the do's and don'ts. The operators folder, for example, explains the operator pattern and its code conventions.

### Slide 21: Agent skills: knowledge as a reusable asset
- **Visual:** [3B1B] A skill folder opens: `SKILL.md` with its `name` and `description` lines
  highlighted, then the instructions body, then a `references/` folder. Several agent icons around it
  (labelled "Claude Code, GitHub Copilot, Codex, Google Antigravity, Cursor or another agent") each load the same skill when a matching task
  appears. Caption: "Agent Skills · open standard".
- **Speaker notes:**
> Agent skills go a step further. A skill is a folder with a SKILL dot M D file, plus any scripts and references it needs. Its description tells the agent when to load it. Agent Skills is an open standard. The same skill works with Claude Code, GitHub Copilot and Codex. It works with Google Antigravity, Cursor or another agent too. That turns expert knowledge into a reusable asset. It's written once, and every contributor's agent can use it.

### Slide 22: Live: the create-oda-operator skill
- **Visual:** [DEMO] Continue the GitHub recording: `skills/` with its seven skills (canvas-ops-tutorial,
  canvas-usecase-documentation, create-oda-operator, github-actions-debugging, helm-chart-development,
  skill-creator, write-bdd-feature), then `create-oda-operator/SKILL.md`, scrolling through its
  description, the pinned KOPF versions and the "Quick Reference: Existing Operators" table.
- **Speaker notes:**
> The Canvas repository already has a set of skills. They cover operating the Canvas, writing use cases and BDD features, Helm charts and CI. The create-oda-operator skill helps anyone build a new Canvas operator with AI. It gives the agent the framework, the pinned versions, and a map of existing operators to copy from. A contributor's agent starts with the knowledge of the core team.

---

## Close

### Slide 23: What's available today
- **Visual:** [NATIVE] Status table with available / experimental / planned pills, like deck 02
  slide 17: MCP as an exposed API type (available, in the reference test component); Resource
  inventory with MCP and Helm tools (available); Model-as-a-Service operator and model gateway
  (experimental); Data product operator (experimental); DependentAIModel resource (experimental,
  joining the Component specification later); Model manager for classical ML (proposal); AGENTS.md and
  agent skills (available).
- **Speaker notes:**
> Here's where things stand. MCP as an exposed API type, and the resource inventory MCP server, are available today. The Model-as-a-Service operator, the model gateway and the data product operator are experimental. So is the dependent AI model resource, which will later join the component specification. A model manager for classical machine learning is still a proposal. And the AGENTS dot M D files and agent skills are ready to use now.

### Slide 24: Find out more
- **Visual:** [NATIVE] Three link cards, like deck 02 slide 19: "AI-Native Canvas design"
  (`github.com/tmforum-oda/oda-canvas/blob/main/AI-Native-Canvas-design.md`), "Model-as-a-Service
  guide" (TM Forum GB1085), "Contribute with AI" (`…/oda-canvas/tree/main/skills`), "ODA agent skills marketplace"
  (`github.com/tmforum-oda/oda-agent-skills-marketplace`, added at the user's request). The ODA Canvas
  picture in the background.
- **Speaker notes:**
> To find out more, read the AI-Native Canvas design in the oda-canvas repository. Then read TM Forum's Model as a Service guide. The work happens in the open, in the TM Forum Innovation Hub. If you'd like to contribute, point your coding agent at the repository. Its AGENTS dot M D files and skills will help it get started. The repository is on GitHub, at TM Forum dash ODA slash ODA Canvas.

---

## DTW 2026 Catalyst tally (slide 3)

Read on 2026-10-19 from the project data behind `tmforum.org/catalysts/projects/previous`: the 59
projects with URN `C26.0.*` (DTW 2026). Each was classified by keyword on its name and summary,
plus its topic tags. The counts are approximate by nature, so the narration rounds them ("nine in
ten", "about half", "more than half", "about one in five", "several").

| Group | Count | Rule | URNs (C26.0.…) |
|---|---|---|---|
| All | 59 | URN `C26.0.*` | — |
| Use AI | 53 | topic "AI" or AI, agent, GenAI, AIOps, graph AI or "intelligence" in name or summary | all except 936, 972, 930, 974, 922, 988 |
| Built from AI agents | 29 | "agent", "agentic" or "A2A" in name or summary | 995, 976, 929, 910, 950, 975, 944, 924, 951, 925, 916, 938, 935, 937, 994, 973, 908, 941, 928, 943, 971, 993, 998, 996, 949, 940, 921, 970, 933 |
| …of which explicitly multi-agent | 6 | "multi-agent", A2A, "agents work together" | 995, 976, 910, 908, 998, 996 |
| Autonomous networks | 37 | topic "Autonomous networks" or "autonom…" in the text | 936, 995, 991, 978, 979, 964, 929, 910, 950, 975, 924, 951, 925, 916, 997, 918, 938, 935, 972, 965, 937, 930, 963, 973, 968, 952, 919, 971, 913, 998, 996, 911, 949, 980, 940, 969, 933 |
| Trust, security and governance | 13 | trust, governance, zero-trust, security or compliance in the text, or the Governance or Privacy topic | 979, 910, 972, 973, 953, 954, 993, 949, 980, 969, 921, 970, 933 |
| Agent platform | 5 | read by hand: registry and runtime (910), agent lifecycle (929, 941), zero-trust agent runtime (933), model gateway (993, the "MODaaS" Moonshot) | 910, 929, 933, 941, 993 |
| ODA or composable IT | 6 | ODA topic, or ODA, composable or component-based in the text | 976, 925, 994, 957, 917, 980 |
| Customer experience | 19 | for reference, not narrated | — |
| Moonshot Catalysts | 15 | "Moonshot Catalyst" in the summary, for reference | — |

---

## Decisions (confirmed by the user, 2026-10-19)

1. One video of about 12 minutes. AGENTS.md is described as "at the root and in each main area of the
   repository" (root plus 6 folders at c39da63).
2. Slide 12 uses generic model names (`primary-chat-model`, `fallback-open-model`), so no vendor is implied.
3. Slide 18: DORA is credited only with "AI is an amplifier" of strengths and dysfunctions. The point
   about modular versus monolithic architectures is said in our own voice.
4. Slide 21 names Claude Code, GitHub Copilot, Codex, Google Antigravity and Cursor, "or another agent".
5. Dependent models are the experimental **DependentAIModel** sub-resource (`dependentAIModels`). It is
   being built as its own resource first, before it is added to the main Component CRD.

6. Slide 3's DTW 2026 Catalyst counts and rounding are confirmed. Citing Catalyst trends instead of
   named projects is specific to this video, not a general rule.

---

## Source check

| Claim | Source |
|---|---|
| Three questions | `AI-Native-Canvas-design.md` Overview |
| DTW 2026 Catalyst trends (59 projects) | tmforum.org/catalysts/projects/previous, URNs `C26.0.*`, read 2026-10-19 (tally above) |
| `apiType: mcp`, `productcatalogmcp` | `feature-definition-and-test-kit/testData/productcatalog-dynamic-roles-v1/templates/component-productcatalog.yaml:40–44` |
| MCP needs long-lived connections; API operator configures the gateway | `AI-Native-Canvas-design.md` MCP Requirements |
| Descriptions and examples; API team enriching Swagger | `AI-Native-Canvas-design.md` MCP Implementation Details |
| Four assumptions; dependent models; approved list | `AI-Native-Canvas-design.md` Agents Packaged as Composable ODA Components |
| "Training builds intelligence; inference builds cost", problems, three options | GB1085 Executive Summary, Problem Statement, Architecture Strategy Evaluation (pp. 6–10) |
| Seven control-plane services | GB1085 §2.1 Service Overview (pp. 14–15) and §2.2 |
| Six levers | GB1085 §2.5.1 (pp. 43–45) |
| DependentAIModel sub-resource (experimental, before the Component CRD) | User, 2026-10-19 (experimental code not yet on GitHub); `dependentAIModels` in `canvas-portal-v2/frontend/src/api/modelGateway.ts` |
| Canvas operator requirements | GB1085 §4 (p. 70) |
| Model gateway four steps; audit, observability, cost | `AI-Native-Canvas-design.md` AI Gateway |
| TMFOP009 (experimental, per deck 02 decision) | `source/operators/TMFOP009-Model-as-a-Service/README.md` ("Implementation Planned"); user, 2026-10-18 |
| Portal Model Gateway page, CRD `v1alpha1`, test connection | `canvas-portal-v2/frontend/src/pages/ModelGateway/index.tsx`; `backend/k8s/resources/model_gateway_services.py` |
| Canvas AI capabilities | `AI-Native-Canvas-design.md` Canvas Services to Support AI Agents at Scale |
| Agentic components in white, MCP, A2A agent cards, model and data operators | `AI-Native-Canvas-design.md` Canvas with AI and Data Extensions |
| TMF639 resource inventory MCP server with Helm tools | `source/tmf-services/MCP_Resource_Inventory/README.md` |
| Eighty-seven golden questions; human and AI evaluators | `AI-Native-Canvas-design.md` Evaluation and Testing |
| AGENTS.md at root and 6 folders | `find -iname AGENTS.md` at c39da63: root, `canvas-portal`, `charts`, `feature-definition-and-test-kit`, `source`, `source/operators`, `usecase-library` |
| AGENTS.md is a cross-tool standard | `ai-coding-assistants.md` Shared Configuration; Linux Foundation Agentic AI Foundation (Dec 2025) |
| Seven skills; create-oda-operator content | `skills/*/SKILL.md` |
| DORA: AI is an amplifier | DORA 2025 State of AI-assisted Software Development (dora.dev/research/ai; Google Cloud blog) |
