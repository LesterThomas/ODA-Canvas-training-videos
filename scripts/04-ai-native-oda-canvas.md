---
deck-id: 04-ai-native-oda-canvas  (two decks: 04a and 04b)
replaces: https://www.youtube.com/watch?v=MICzwN8VB_o  (AI Native ODA Canvas, 30:32)
linked-from: oda-canvas AI-Native-Canvas-design.md:7 and the chapter list at :314–326
original-transcript: presentations/transcripts/04-ai-native-oda-canvas.md
source-diagrams: oda-canvas images/AI-Native Canvas/*.PNG; presentations/About ODA Canvas.pptx slide 3
oda-canvas-commit: c39da6340dbc971981bcb1eea5da5d718fac11d2
target-length: 04a ~9 min, 04b ~9 min
status: draft script
---

# AI-Native ODA Canvas: updated script (two parts)

The original is accurate and recent, but at 30 minutes it is far longer than the series' 3–12 minute
format, so this script splits it in two.

**Main changes from the original:**
- Neutral narration: company-specific first-person references are generalised.
- Shows what now exists in the reference implementation and Portal: `apiType: mcp` in the
  `productcatalog-dynamic-roles-v1` test component; the Portal's **Model Gateway**
  (`ModelGatewayService`, `oda.tmforum.org/v1alpha1`) and **TMF AI Agents** pages; and the TMF639 MCP
  server, which now has Helm tools.
- Labels experimental and planned pieces clearly. TMFOP009 Model-as-a-Service is "Implementation
  Planned".

**Naming decision:** the design doc says "AI Gateway", while the Portal and CRD say "Model Gateway".
This script uses **"AI gateway"** for the concept and **"Model Gateway"** when showing the Portal page.
**[VERIFY]** that this matches the work-stream's preferred terms.

**Chapter map for the upstream doc** (replaces the 9 deep-links in `AI-Native-Canvas-design.md`):
- 04a: Introduction · Lessons learned · MCP support · Agentic components · AI gateway
- 04b: Canvas services for AI at scale · End-to-end data and AI architecture · Resource inventory ·
  Classical ML · Evaluation

---

# Part 1 (04a): Agents and the ODA Component model

### Slide 1: Title
- **Visual:** [STATIC] "AI-Native ODA Canvas, Part 1: Agents and the ODA Component model"
- **Speaker notes:**
> AI agents are fast becoming the main way to deliver intelligent, autonomous services in telecoms. This two-part series explains how the ODA Canvas is being extended to deploy and run them at enterprise scale.

### Slide 2: Three questions
- **Visual:** [3B1B] Three question cards: Components as tools? Agents as components? Operating multi-vendor agents at scale?
- **Speaker notes:**
> The AI-Native Canvas work sets out to answer three questions. How do we expose ODA Components as tools for AI agents? How do we deploy agents themselves as components? And how do we operate an architecture with many agents from many vendors at scale, while keeping governance, security and responsible AI practices in place?

### Slide 3: Always on the roadmap
- **Visual:** [3B1B] The ODA evolution staircase: common Open API model, then shared data foundation, then reusable components on a standard Canvas, then AI-ready components. A telecom ontology and intent layer slides in under the last step.
- **Speaker notes:**
> AI was always part of the Open Digital Architecture roadmap. It started with a common Open API model and a shared data foundation, moved to reusable components on a standard Canvas, and planned for AI-ready components even before generative AI arrived. The industry is adopting the best cross-industry AI technology, and the telecom-specific value comes from shared data models, a common ontology and intent-based interfaces.

### Slide 4: Lessons from the Catalysts
- **Visual:** [3B1B] Three Catalyst badges (Agent Fabric, Agentic ODA for Personalized Customer Experiences, Growing B2B with Autonomous Agents) feed four lesson cards: agents as the paradigm; MCP as the tool standard; multi-agent beats one big agent; agents at every layer.
- **Speaker notes:**
> Three Catalyst projects from 2025 shaped this work, and they agreed on four lessons. First, AI agents are emerging as the next architectural pattern: modular, task-focused and context-aware, acting autonomously within guardrails. Second, the Model Context Protocol has become the standard way for agents to use APIs as tools. Third, several tightly scoped agents working together beat one general-purpose agent. And fourth, agents are relevant at every layer of the architecture and every stage of the technology lifecycle.

### Slide 5: MCP is just another exposed API type
- **Visual:** [3B1B] A component's `exposedAPIs` list. Beside `openapi` and `openmetrics`, a new entry appears: `apiType: mcp`. (Use the real snippet from `testData/productcatalog-dynamic-roles-v1`: `name: productcatalogmcp`, `apiType: mcp`, `path: …/mcp`.)
- **Speaker notes:**
> The first question turned out to have a simple answer. Components already declare the APIs they expose, including cross-industry ones like OpenMetrics. Adding MCP was a matter of adding one more API type. The product catalog test component in the reference implementation does exactly that, exposing an MCP server alongside its standard Open API.

### Slide 6: Why MCP needs gateway support
- **Visual:** [3B1B] A short REST request and response, contrasted with a long-lived MCP connection held open through the gateway. The API operator gear adjusts a "long-lived connection" setting on the gateway.
- **Speaker notes:**
> MCP does need special handling. Instead of short request-and-response calls, it keeps long-running, event-style connections open, so gateways have to be configured for that. Because the component declares the MCP type, the API operator knows to apply the right settings automatically.

### Slide 7: Descriptions are written for agents
- **Visual:** [3B1B] A terse Swagger parameter description, then an MCP tool description with a plain-English explanation and a worked filter example. The "filter" argument lights up when the example is added.
- **Speaker notes:**
> The most important part of an MCP server is its plain-language description of each tool and argument. Swagger files were written for API experts. Agents need more. Experiments showed that detailed explanations and especially concrete examples made the difference: an agent only used the filtering argument correctly once an example was added. The API work stream is now looking at enriching the Open API specifications so MCP servers can be generated automatically.

### Slide 8: Assumptions for agentic components
- **Visual:** [3B1B] Four assumption tiles: models are services reached by API; CSPs keep approved model catalogs; agents are non-deterministic, so they need evaluation; agents need extra services (vector databases, anonymization, chunking).
- **Speaker notes:**
> The second question is about packaging agents as components. Four assumptions shape the design. Foundation models and machine-learning models run as services on the cloud platform, and agents reach them through APIs instead of embedding them. Service providers keep approved catalogs of models, with their own approval process. Agents are non-deterministic, so they need continuous evaluation, not just fixed tests. And agents need additional services, such as vector databases and anonymization, which the Canvas should provide.

### Slide 9: Dependent models
- **Visual:** [3B1B] The component YAML gains a `dependentModels` block, styled like `dependentAPIs`: a prioritised list of models, a use-case description and guardrail thresholds. An approved-model catalog filters it down to the models actually granted.
- **Speaker notes:**
> With those assumptions, the component model extends naturally. Just as a component lists the APIs it depends on, it can list the models it depends on, in priority order, with a description of the use case and the guardrail thresholds it needs. The Canvas then grants access to whichever of those models are on the approved list.

### Slide 10: The AI gateway
- **Visual:** [3B1B] Four numbered steps animate: (1) the operator reads the declared requirements; (2) it configures the AI gateway; (3) the component gets credentials and an endpoint; (4) every call passes through guardrails and is logged for audit, observability and token cost.
- **Speaker notes:**
> Access goes through an AI gateway. An operator reads the component's requirements, configures the gateway, and gives the component the credentials and endpoint it needs. From then on, every interaction with a model passes through the gateway. Guardrails are enforced, and each interaction is recorded for auditing, observability and cost tracking, including how many tokens of which model each component uses.

### Slide 11: Live demo: Model Gateway in the Canvas Portal
- **Visual:** [DEMO] Canvas Portal → AI → Model Gateway: the list of ModelGatewayService resources (Name, Models, Strategy, Endpoint). Open one to show its dependent AI models with provider and priority, the guardrails and JWT authentication. Click "Test connection". **[VERIFY that this environment can be installed; if not, use a [3B1B] of the same YAML instead.]**
- **Speaker notes:**
> Here's how this looks in the Canvas Portal today. Each model gateway service lists the models a component depends on, their providers and priorities, how traffic is split between them, and the guardrails and authentication applied. The Canvas Portal can also test the connection through the gateway. This capability is experimental and is the basis for a planned model-as-a-service operator.

### Slide 12: Example: an AI assistant packaged as a component
- **Visual:** [3B1B] The TM Forum AI assistant (AIVA) is drawn as a component on the Canvas. Instantly it gets API exposure, identity and observability badges. An external enterprise-architecture agent calls it agent-to-agent over its API.
- **Speaker notes:**
> To prove the approach, the TM Forum AI assistant was packaged as a component and deployed on the Canvas. Because it was deployed as a component, it immediately gained API exposure, identity management and observability, which every agent deployment needs. It was tested API-first: another organisation's internal agent called it directly, agent to agent, to answer questions about TM Forum standards.

### Slide 13: End of Part 1
- **Visual:** [STATIC] Recap of three ticks (MCP as an exposed API type; agents as components with dependent models; governed access through an AI gateway) and "Next: Part 2, Operating AI agents at scale".
- **Speaker notes:**
> So, components can become tools for agents through MCP, agents can be packaged as components, and their access to models is governed by the Canvas. In part two, we look at the Canvas services needed to run many agents, from many vendors, at scale.

---

# Part 2 (04b): Operating AI agents at scale

### Slide 1: Title
- **Visual:** [STATIC] "AI-Native ODA Canvas, Part 2: Operating AI agents at scale"
- **Speaker notes:**
> In part one we saw how agents and tools fit the ODA Component model. This part looks at what the Canvas needs to provide to run them at scale.

### Slide 2: Canvas services for AI
- **Visual:** [3B1B] "Canvas AI Capabilities" diagram, built tile by tile: language models; embedding and multimodal models; classical ML with MLOps; vector databases, anonymization and chunking; AI observability (LangSmith, OpenLLMetry); AI gateway; evaluation; use-case registry.
- **Speaker notes:**
> To support agents from many vendors across every business domain, the Canvas needs a broader set of services. It needs access to language, embedding and multimodal models, and to classical machine-learning models with proper MLOps processes. It needs supporting services such as vector databases, anonymization and chunking. Observability has to extend to model interactions, with tools like LangSmith or OpenLLMetry, an OpenTelemetry extension. And it needs the AI gateway, an evaluation framework, and a registry of agents, tools and use cases, with high-risk use cases tagged as the EU AI Act requires.

### Slide 3: The Canvas before AI
- **Visual:** [3B1B] "Canvas pre AI" diagram: standard components on top, Canvas operators in the middle, foundation services (gateways, mesh, observability, identity) underneath.
- **Speaker notes:**
> Here's how composable IT looked before AI: standard components, a Canvas whose operators read each component's requirements, and the underlying cloud services those operators configure.

### Slide 4: The Canvas with AI and data
- **Visual:** [3B1B] The same diagram builds into "Canvas with AI and Data". White agentic components join the coloured standard ones. MCP sockets appear on the systems-of-record components, and agent-card (A2A) badges appear on the agents. Model and data operators, and the AI gateway, are added to the platform. A dashed "data products as a service" layer is labelled "planned".
- **Speaker notes:**
> The AI-Native Canvas adds to this picture. Agentic components sit alongside the standard components. Systems of record expose MCP so agents can use them as tools, and agents publish agent cards, using agent-to-agent standards, so other agents can discover what they offer. New operators, such as a model operator, configure the AI gateway. Agentic components are shown in white on purpose. Like engagement systems, agents are expected to be differentiating rather than standardised, but they still follow the component model and work with standard systems of record. Data products as a service are the next planned extension.

### Slide 5: The Canvas as a registry
- **Visual:** [3B1B] Deployed components, APIs, agents and tools flow into a TMF639 Resource Inventory box, which exposes both an Open API and an MCP server.
- **Speaker notes:**
> Because everything on the Canvas is declared, the Canvas can describe itself. The reference implementation includes a resource inventory, based on the TMF639 Open API, that acts as a registry of components, their APIs, agents, tools and use cases. Like any TM Forum API, it is also offered as an MCP server.

### Slide 6: Live demo: asking the Canvas questions
- **Visual:** [DEMO] An MCP client (Claude Desktop or VS Code) connected to the Canvas resource-inventory MCP server. Prompt: "What resources are available in this ODA Canvas?", and the tool call plus answer list the product catalog component and its APIs, including MCP. Second prompt: "Draw a diagram of the product catalog component and its APIs." Optional third prompt: "Search the ODA component repository for a product inventory component and install it", which shows the `helm_install_tmforum_component` tool being proposed. **Do not approve the install on camera unless the environment is disposable.**
- **Speaker notes:**
> Here an AI assistant is connected to the Canvas through that MCP server. We ask, in plain language, what is deployed on this Canvas. The agent calls the inventory tool and answers with the product catalog component and every API it exposes, including its own MCP server. It can go deeper on any API, or draw a diagram of the component and its related resources. The MCP server now also includes Helm tools, so an agent can search the TM Forum component repository and propose installing a component, under the same Canvas controls as a human would be.

### Slide 7: Classical machine-learning models
- **Visual:** [3B1B] A component YAML references a model URL (like a container image). A Model Manager operator downloads it, sends it through an MLOps pipeline (review, test, deploy), then exposes an inference API back to the component. Badge: "proposal".
- **Speaker notes:**
> Agents aren't the only kind of AI. For custom machine-learning models, the proposal is that a component refers to its model by URL, much as it refers to a container image. A model manager operator fetches the model, runs it through the organisation's MLOps pipeline for review, testing and deployment, and then gives the component access to an inference endpoint.

### Slide 8: Evaluation: why it matters
- **Visual:** [3B1B] "Evaluation 1" and "Evaluation 2" diagrams. A golden set of 87 questions establishes a baseline before deployment. In production, real questions and answers are logged and continuously scored.
- **Speaker notes:**
> Because agents are non-deterministic, they should ship with evaluation data and tests. Before deployment, a golden set of questions sets a performance baseline. For the AI assistant example, that set has eighty-seven questions. In production, real questions and answers are logged and evaluated continuously, so that changes such as switching the underlying model are checked against the baseline before they go live.

### Slide 9: Human and AI evaluators
- **Visual:** [3B1B] Side by side: a human scoring form (relevance, accuracy, completeness, comment) and an AI evaluator prompt ("You are an expert evaluator…") producing the same scores. Both feed a dashboard trend line.
- **Speaker notes:**
> Evaluation combines people and models. A human evaluator scores answers for relevance, accuracy and completeness, with a comment. An AI evaluator, built with an open-source evaluation framework, scores the same dimensions automatically, so production volumes can be covered. A dashboard tracks the agent's performance over time, by question type and by evaluation method.

### Slide 10: Summary
- **Visual:** [3B1B] Six achievement tiles: MCP integration; agentic components; multi-agent support; AI gateway; evaluation; self-describing registry. Below them: "Governance · Responsible AI · EU AI Act readiness".
- **Speaker notes:**
> To summarise, the AI-Native Canvas lets components act as tools through MCP, lets agents be deployed as components, governs their access to models through an AI gateway, evaluates them continuously, and keeps a registry of everything that runs. Together these give service providers the governance and control they need to run agents from many vendors at scale, responsibly, and in line with regulation.

### Slide 11: Status and how to get involved
- **Visual:** [STATIC] A status table (MCP exposed API type: available in test components; Model Gateway: experimental, in the Portal; Model-as-a-Service operator TMFOP009: planned; Model Manager for classical ML: proposal) and links: `AI-Native-Canvas-design.md`, the TM Forum Innovation Hub.
- **Speaker notes:**
> Some of this is available today, some is experimental and some is still a proposal, and it is all developed in the open. The design is documented in the AI-Native Canvas design page of the oda-canvas repository, and the work happens in the TM Forum Innovation Hub, which welcomes new contributors.

---

## Source check

| Claim | Source |
|---|---|
| Three questions, Catalysts, four lessons | `AI-Native-Canvas-design.md` Overview and Lessons Learned |
| `apiType: mcp` example | `feature-definition-and-test-kit/testData/productcatalog-dynamic-roles-v1/templates/component-productcatalog.yaml` |
| `dependentModels`, AI gateway four steps | `AI-Native-Canvas-design.md` |
| ModelGatewayService CRD and Portal page | `canvas-portal-v2/backend/k8s/resources/model_gateway_services.py`; `frontend/src/api/modelGateway.ts`; `layout/Sidebar.tsx` |
| TMFOP009 planned | `source/operators/TMFOP009-Model-as-a-Service/README.md` |
| TMF639 MCP server with Helm tools | `source/tmf-services/MCP_Resource_Inventory/README.md` |
| 87 golden questions, evaluation | `AI-Native-Canvas-design.md` Evaluation and Testing |
