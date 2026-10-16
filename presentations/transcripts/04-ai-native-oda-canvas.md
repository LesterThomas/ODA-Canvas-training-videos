# AI Native ODA Canvas — original transcript

- YouTube: https://youtu.be/MICzwN8VB_o
- Referenced from oda-canvas: `AI-Native-Canvas-design.md`
- Source: YouTube auto-generated captions, fetched 2026-10-16. Timestamps are [m:ss]. Unedited — expect caption errors.

[0:03] The telecommunications industry
is at a pivotal moment.
[0:06] AI agents are emerging as the dominant
architectural pattern for delivering
[0:11] intelligent autonomous services.
[0:14] But how do we deploy and operate
these agents at enterprise scale?
[0:19] In this video, I'll share the Innovations
Hub work on building an AI native canvas
[0:25] that addresses three critical questions.
[0:28] How do we expose ODA components
as tools for AI agents?
[0:32] How can we deploy agents
themselves as components?
[0:36] And perhaps most importantly,
how do we operate a multi-vendor,
[0:40] multi-agent architecture at scale
while maintaining governance,
[0:44] security, and responsible AI practices?
[0:50] This work has always been part of the
open digital architecture roadmap.
[0:55] The slide I'm showing is several years old
and illustrates our strategic evolution,
[0:59] starting with the foundations of a
common open API model, building a shared
[1:05] data foundation and creating consistent
API integrations across IT services.
[1:10] We then progressed to reusable components
running on a standard canvas platform.
[1:15] The next phase, AI ready Reasonable
components was planned before
[1:20] the emergence of generative AI.
[1:23] While we're adopting excellent
cross-industry work on artificial
[1:26] intelligence and leveraging
powerful foundational GenAI models,
[1:30] telecommunications bring unique
value through domain specific
[1:34] foundations like intent-based systems.
[1:37] We now have a robust ontology
defining the language for interactions
[1:42] between telecom components.
[1:44] By combining best in class cross
industry technologies with telco
[1:49] specific data models, ontologies and
intent languages, we maximize business
[1:54] value for telecommunications operators.
[1:59] The work I'm sharing builds
on the Catalyst program and
[2:02] innovation hub experiments.
[2:05] Three key catalysts from 2025
significantly influenced our approach.
[2:11] These are the agent fabric catalyst, the
Agentic ODA for personalized customer
[2:16] experiences catalysts and growing
B2B with autonomous agents catalysts.
[2:22] These catalysts reveal
several critical patterns.
[2:26] First, AI agents are clearly
emerging as the next architectural
[2:31] paradigm, modular, task-oriented,
context aware systems that operate
[2:37] autonomously within defined guardrails.
[2:40] Second model context protocol or
MCP has become the defacto standard
[2:45] for how agents use APIs as tools.
[2:49] The strong data models and consistent
patterns in TM Forum open APIs make it
[2:55] relatively straightforward to create MCP
wrappers, enabling agents to interact
[3:00] with these APIs using natural language.
[3:04] Third, all these catalysts converge
on multi-agent architectures
[3:09] with modular agents collaborating
to deliver target use cases.
[3:14] A consistent finding across industries
is that agents work most effectively
[3:19] when tightly scoped and for broader
problems, multiple tightly scoped
[3:23] agents collaborating, outperforms
single general purpose agents.
[3:29] Finally, agents have applicability
across every architectural layer.
[3:35] The agent Fabric Catalyst operates at the
resource and service management layers of
[3:39] the ODA while the other Catalysts focus
on customer facing and commercial domains.
[3:45] And agents aren't relevant just on
functional domains, but throughout the
[3:48] technology lifecycle from architecture and
design through delivery and operations,
[3:55] this raises important questions.
[3:58] About how the component and canvas
model supports AI agent development.
[4:06] How can we enable MCP as a standard
for exposing open APIs as tools
[4:11] within multi-agent architectures?
[4:13] Can we extend the component model
to support agentic components?
[4:18] And if so, what Additional canvas services
are needed to govern and control a
[4:23] multi-vendor, multi-agent architecture?
[4:27] We must also consider how components
and canvas fits within the
[4:31] overall data and AI architecture.
[4:36] So this is my plan for this
video is to consider the MCP.
[4:42] How do we enable MCP as a standard
for exposing open APIs as tools?
[4:45] It is look at multi-agent architecture
with many agents, and the question
[4:50] of could we extend the component
model to enable agentic components?
[4:54] And then it's looking at the
additional canvas services that we
[4:56] could build to govern and control this
multi-vendor, multi-agent architecture.
[5:01] And then we're going to ask this
question about how does this fit within
[5:04] the overall data and AI architecture?
[5:08] And then they've got three smaller topics
at the end, which is looking at building
[5:12] a Canvas resource inventory as a registry
of components, agents, tools, and use
[5:16] cases about how we support classical
machine learning, as well as GenAI models.
[5:22] And finally, about establishing
evaluation data and testing
[5:25] frameworks for agentic systems.
[5:30] So the first question is how to build
MCP support into ODA components to make
[5:36] them available as tools for AI agents.
[5:39] So this actually has quite
a straightforward answer.
[5:43] Our existing component patterns already
include declarative model for exposing API
[5:49] services and components already exposed.
[5:52] Multiple APIs beyond the TM form,
functional APIs supporting cross industry
[5:57] standard, like open metrics and open
telemetry and extending components to
[6:02] expose MCP APIs was as simple as expanding
the enumeration to include MCP, which
[6:11] is then consumed by the API operators.
[6:14] Now MCP requires special handling because
it uses an event-based architecture with
[6:20] long running HTTP connections rather
than standard rest style integration.
[6:26] This means API gateways need
special configuration to support
[6:30] these persistent connections.
[6:32] So we've extended the component
model to allow the declarative
[6:36] specifications of MCP interface
types, and we built MCP operators to
[6:42] automatically configure the API gateways
for these long running connections.
[6:47] And we built several MCP servers including
one for the product catalog component.
[6:54] And this slide shows a snippet from
that product catalog, MCP server
[6:58] implementation, and I'm contrasting
this MCP server implementation with
[7:03] the underlying open API specification.
[7:08] MCP is fundamentally about describing
APIs in natural language, so
[7:13] agents understand how to use them.
[7:16] And agents need to be able to
construct appropriate payloads
[7:20] and interpret the responses.
[7:22] And we built this using Anthropics open
source MCP software development kit.
[7:28] Now, the most important
part of this is actually the
[7:30] English description of the API.
[7:33] So we provided detailed
descriptions of both the API
[7:36] function and all the arguments.
[7:38] And this contrasts sharply with the
swagger descriptions, which were really
[7:43] designed for API experts, not AI agents.
[7:47] And as part of our work, we conducted
extensive experimentation to
[7:51] drive, like how do I make sure this
language is effective for the agent?
[7:57] One of the things is the arguments
do require detailed explanation.
[8:01] And also that the language
models work better with examples.
[8:05] We discovered, for example, with the
filtering argument, the agent didn't,
[8:11] understand how to use filtering when
we just had the description on its own.
[8:15] And only when we added specific
examples with the agent able to
[8:19] actually follow this and effectively
use this filter attribute.
[8:25] So currently we've created custom MCP
wrappers for some TM Form open APIs.
[8:31] However, the API work stream has
recognized that we could generate these
[8:35] automatically from swagger files by
upgrading the descriptions in swagger
[8:41] with more detail and with examples, and
for them to assume that these swaggers
[8:46] might be consumed by language models.
[8:49] And ideally, we'll get to a
situation where we can automatically
[8:53] generate the MCP services for
all open APIs in the future.
[8:57] But as I said, this requires enhancements
to the open API swagger documentation.
[9:03] But the answer to this first question of
how to include MCP as part of this ODA
[9:08] is encouraging because we've been able
to extend the component model to expose
[9:11] MCP servers following all the existing
patterns, and it works seamlessly.
[9:19] The second question concerns embedding
agent capabilities inside ODA components.
[9:25] Now most catalysts deliver
multi-agent architectures.
[9:29] So we need the same characteristics
we have with composable IT.
[9:34] We need modular composable AR
agents that are easy to deploy,
[9:39] maintain, manage, and upgrade.
[9:42] So let me first outline the
assumptions we made when extending
[9:45] the component model to support agents.
[9:48] First, we assume the foundational Gen
A models and classical machine learning
[9:53] models execute as services access through
APIs on the underlying cloud platform.
[10:00] We're not embedding
language models in agents.
[10:02] Instead, agent software accesses
language models through APIs consistent
[10:07] with most agent frameworks today.
[10:10] Second, CSPs will maintain approved
catalogs of foundational gen AI
[10:15] models, and this is standard practice.
[10:17] At Vodafone, we have a common platform
where any language model must first be on
[10:21] our approved list, and there's a process
for adding new models, but we maintain
[10:26] rigorous privacy and security standards.
[10:28] Similarly, we have ML ops
processes for proving in deploying
[10:33] classical machine learning models.
[10:35] This falls outside the
component scopes components.
[10:37] Access these models through
these underlying platforms.
[10:41] The third point is that the agentic
components are non-deterministic,
[10:46] requiring significantly more testing.
[10:48] I prefer the term evaluation beyond
predefined tests you need comprehensive,
[10:53] comprehensive evaluation data sets
and metrics to continuously evaluate
[10:59] agent performance against expectations.
[11:03] And then finally, agent components
typically require additional cloud
[11:07] services like vector databases,
anonymization services, chunking services,
[11:11] and we need to make these available
in the canvas to support AI agents.
[11:18] And so the question is, could we extend
the component model to support this?
[11:23] To sport and to enable agent components.
[11:26] And the answer is yes.
[11:28] And at the extension we've been
developing, actually originated from one
[11:32] of the catalysts from the Agentic ODA for
proactive customer experiences catalyst.
[11:37] And they propose a essential approach
where components declare which
[11:42] language models they want to access.
[11:44] Providing a prioritized list and the
Canvas platform, then grants access to
[11:50] whichever subset of those are actually
available in the approved language models.
[11:56] And similar to how we previously had
exposed APIs and dependent APIs, they
[12:00] proposed calling this dependent models,
and you described the models and their
[12:04] priority and provide details about the use
case since we need the use case inventory.
[12:10] And you can also define guardrails.
[12:12] So we don't want unfettered access
to these language models with
[12:16] potentially security vulnerabilities.
[12:19] We need guardrails to
ensure responsible AI usage.
[12:22] And the data model for declarative
requirements allows the components to
[12:26] define their guardrails as well, or their
thresholds against guardrails as well.
[12:33] And we've implemented this experimentally
and we showcased DTW earlier this year.
[12:38] And our example used AIVA, so
that's the TM form AI assistant.
[12:43] And we used AIVA packaged as a
component and deployed on the canvas.
[12:48] And because Ava is now an API first
component, we tested integration with
[12:54] this, not through the AIVA portal,
but by having like a Vodafone, an
[12:57] internal agent, directly communication
with AIVA through this API.
[13:03] And, and just a bit of a
context like our internal.
[13:07] We're using is something which we
developed for enterprise architects.
[13:10] So we have something called AI for
EA, so AI for enterprise architects.
[13:16] And this provides a suite of subagents
for enterprise architects to use
[13:20] to do, to perform their role and.
[13:24] AI three was able to directly integrate
with AIVA through an API and when, so
[13:30] when the Vodafone enterprise architecture
asked the question that might relate
[13:34] to t inform standards, the Vodafone
agent interacts with the TM Forum
[13:38] agent over the internet using these
new standards and, and this mechanism,
[13:43] this integration worked really well
[13:47] and deploying Ava on the Canvas provided.
[13:50] Like immediately use of all
the existing canvas services.
[13:53] So we had this modular deployment, we
had API exposure to the API gateway.
[13:59] We had observability, we
had the identity management.
[14:02] And all these capabilities come standard
when you deploy agents as software
[14:06] components and they are essential
require for any agent deployment.
[14:11] But we've extended this with definitions
for these declarative requirements for gen
[14:15] AI models, and this shows how this works.
[14:20] And using AIVA as the example component.
[14:21] So the component includes a specification
and we created a new AI operator that
[14:30] reads these declarative requirements.
[14:33] And our reference implementation
shows the source code for this
[14:36] example reference operator.
[14:38] And this operator configures
a new architectural element.
[14:41] So to grant access to foundational GenAI
models, we've introduced an AI gateway,
[14:48] and when granting access to under
unknown models, it's providing through
[14:52] this gateway or could call it a proxy.
[14:55] And this enables auditing of all
the interactions which is essential
[15:00] for responsible AI practice.
[15:02] It provides observability to exactly
what's being discussed between
[15:06] the components, the agents, and
the underlying language models.
[15:09] And it also enables us
to understand the cost.
[15:11] So how many tokens of which model
a component is consuming, feeding
[15:15] into our cost management operator.
[15:18] And the process follows four steps.
[15:20] So an operator reads the declarative
requirements, configures the AI
[15:24] gateway grants, the component access
with authentication and input details
[15:29] for accessing the language models
and enforces the guardrails while
[15:33] providing this data for auditing,
observability and cost management.
[15:38] And this forms a foundation for
what the canvas must provide to
[15:42] support multi-vendor AI agents across
every functional domain enabling
[15:47] the governance and control and
responsible AI adoption at scale.
[15:55] So now looking at from the other
perspective, so from Canvas services,
[16:00] what Canvas services do I need
for this multi-vendor AI agents
[16:04] across every functional domain?
[16:08] So what we need is, so clearly we
need the language models, we need
[16:13] other AI models like embedding models,
multimodal models, and even sporting
[16:19] classical machine learning models with
like a correspondent ML ops processes.
[16:24] We need the canvas to have these
additional capabilities like
[16:28] vector databases, anonymization,
chunking, and other cloud services.
[16:33] The observability extends beyond the
technical monitoring and performance
[16:38] of standard software to include AI
specific observability for language
[16:43] models, supporting tools like Lang Smith
or open LLMemetry, which is an open
[16:49] telemetry extension we're proposing.
[16:52] This AI gateway is a standard
architectural component
[16:55] enabling automated guard.
[17:00] We're also addressing how to support
evaluation, so pre-production
[17:05] and post-production evaluation of
ongoing AI performance, and I'll
[17:08] come onto that a little later.
[17:11] Finally, the canvas includes a use case
registry with tagging of all agents
[17:15] tools and high risk use cases, which
is a requirement for this EU AI Act.
[17:23] So how does this fit into the
end-to-end AI and data architecture?
[17:28] We've been collaborating between
the composable IT mission, where
[17:33] the canvas and component work
resides, and the AI and data mission.
[17:38] So we need one end-to-end open digital
architecture supporting everything.
[17:43] And the, the good news is the data
and AI architecture is embracing
[17:48] this canvas concept as well.
[17:49] So the canvas operating like an operating
system for running software, including AI.
[17:56] And I've got two slides which illustrate
this evolution to support AI services.
[18:02] So historically we worked on
composable it within ODA, so
[18:05] modular standard components.
[18:08] Extensive work building these components
with use cases, understanding high
[18:12] value scenarios and catalyst programs,
experimenting with different case studies.
[18:18] The standard components are consumed by
the ODA Canvas and Operators in the ODA
[18:24] Canvas read the component requirements
and configure underlying foundational
[18:29] cloud platform services like API
Gateways, service meshes, observability,
[18:34] identity, and access management systems.
[18:37] Now the second slide is a
build, which then shows the
[18:40] AI native canvas extensions.
[18:43] Now alongside standard ODA components,
we have agentic components.
[18:48] Embedding AI agents components can
offer MCP so that available to as tools
[18:55] towards other agents, and this supports
emerging standards like A2A or agent.
[19:01] Agent from Google, where an agent
component exposes the equivalent of a
[19:06] business card or an agent card explaining
their capabilities as part of a YAML
[19:12] contract, which we're including as
part of the component specification.
[19:16] So I can have systems of record ODA
component exposing MCP interface, so
[19:23] it's available towards an agent and
I can have an agent deployed as a
[19:28] component and as agent will expose an A2A
interface so other agent can discover its
[19:35] capabilities and the services it offers.
[19:40] These agentic components
have corresponding operators.
[19:43] For example, there's a model operator,
which takes the declarative requirements
[19:48] and configures the AI gateway to
grant access to the underlying
[19:52] language models for ENT components.
[19:55] So the patterns we've already established
fit naturally with these AI services.
[20:00] And we've, in the experimentation,
we've successfully extended the ODA
[20:04] component model for agentic components.
[20:08] We've intentionally colored
the ODA components white.
[20:13] This contrasts with the systems of
record components, these are the
[20:17] components maintaining the fundamental
data that you need to drive telco
[20:23] architecture for engagement management,
we decided at the outset not to
[20:28] build standardized components.
[20:29] Most telcos build custom software.
[20:33] Deployable as components in Canada
environments, but we don't standardize
[20:36] the engagement management because we
want unique, innovative experiences
[20:40] like a Vodafone specific experience
that we're building internally.
[20:46] For the underlying systems of
record we do want standardization
[20:50] but with agents, at least in 2025.
[20:53] We decided at this moment in time, we
don't want to standardize our agents,
[20:58] and that's why we call it it in white.
[21:00] We're saying we want to deploy agents
as components following the component
[21:03] model . We're not just positioning
them to be standardized agents.
[21:08] And this is similar to
the engagement management.
[21:10] We have non-standard agents that can
seamlessly interact and interrogate
[21:14] all the systems of record components,
leveraging the foundational data
[21:18] within the team informed standards.
[21:22] And so this represents the end-to-end
architectures, including composable
[21:25] components and extended to composable
agent components with corresponding
[21:30] AI native canvas services.
[21:33] And this allows AI and the data
foundations while extending  the standards
[21:38] we've been building as part of this ODA.
[21:40] And we plan to extend this with
data products as a service enabling
[21:46] organizations to offer data products.
[21:49] Components, will declare requirements
for data products with data operators
[21:53] integrating and granting access
through these underlying data services.
[21:57] So this is the end-to-end
architecture including agentic ODA.
[22:03] Now I'm going to come
on to  three subtopics.
[22:05] Like this is the main
scope of the presentation.
[22:08] I've got three subtopics.
[22:09] The first one is this notion of having a
canvas resource inventory as a registry
[22:15] of components, agents tools, use cases.
[22:20] And this is a practical
example of what, what it means.
[22:22] So on top of the canvas, we've
built a resource inventory . We've
[22:27] built components and exposed APIs
and other services into the canvas.
[22:31] And it makes it straightforward to put
these into a TM Forum compliant resource
[22:36] inventory, serving as a registry of
components, agents, tools, and use cases.
[22:41] And as with all the Tfor APIs, these can
be also exposed as an MCP server to make
[22:47] it available to AI agents, so the canvas.
[22:51] Itself includes ODA with this
resource imagery components and
[22:55] corresponding elements like APIs,
dependent APIs, and similar resources.
[22:59] And we've used this TMF 69 resource
inventory as a standard interface.
[23:06] And I've got a practical example
of using this using Claude
[23:09] Desktop as a n external AI agent.
[23:11] So this cloud desktop can integrate to
the canvas using the MCP server as a
[23:16] tool so the canvas can appear as a tool.
[23:18] And then you can ask
questions in natural language.
[23:21] So I can ask questions like, what
resources are available in the ODA Canvas?
[23:25] So this query is a live canvas
implementation where I've really deployed
[23:29] these components and, and you can see
that when I ask this question, it's
[23:34] calling this MCP resource_get service
to get details of resources, and then
[23:40] it's answering in natural language.
[23:41] You can see I've deployed this R one
product catalog management, ODA component,
[23:48] and it's exposing certain APIs, including
my metric service, some product catalog
[23:53] management, and the MCP service and I can
ask more detailed question, so I asked.
[24:01] Describe the product catalog
management, API in detail, and
[24:04] she's doing another call into the
MCP server to get even more detail.
[24:09] And then you get a detailed description.
[24:11] And finally, because these agents
can actually also create diagrams,
[24:16] so I've asked it to create a
diagram of the product catalog
[24:18] component and all related resources.
[24:20] And you see it's done a really
nice job of  this is the product
[24:23] cattle management component.
[24:25] And it's exposing all
these underlying APIs.
[24:30] It's even linking to say, this is
the TMF specification that API uses.
[24:37] And it has other details like
who maintains this components
[24:40] and, and other things.
[24:42] And this was automatically generated
just by using an AI agent with
[24:46] the ability to create diagrams by
interrogating the canvas using MCP.
[24:55] My next subpoint is this notion of
supporting classical machine learning
[24:59] models as well as Gen AI models.
[25:02] We had a proposal and actually we had this
very similar proposal from VO in Greece
[25:07] and from Huawei for an AI model manager
for custom machine learning models.
[25:14] For custom machine learning
models, the component needs to
[25:17] include that custom model as part
of that component definition.
[25:20] So in a similar way to how we have
container images in a Kubernetes manifest,
[25:26] we're adopting the same approach.
[25:28] So the component would include a url to
a, to a machine learning model in some
[25:32] accessible model repository, and the model
manager operator would download this model
[25:39] and submit it into an ML Ops pipeline
for review, testing and deployment.
[25:44] And then once it's being reviewed
and approved and deployed, the
[25:49] canvas then provides API access to
the info engine so the component
[25:53] can access that custom model.
[25:57] And then the very final point is the
importance of evaluation data and tests.
[26:02] Because these AI services are
non-deterministic, components
[26:05] should come packaged with complete
evaluation data sets and tests.
[26:10] And pre-deployment, we conduct a
comprehensive evaluation, establish
[26:14] baseline performance for the agent.
[26:16] And then even in production, we want
to continuously evaluate and monitor
[26:20] agent behavior and characteristics.
[26:22] And this is something we've
implemented with our AIVA agent.
[26:26] Example agent component.
[26:28] So for AIVA, we started
the project project.
[26:33] Our aspiration was to
have a hundred questions.
[26:35] I think we ran out after something
like 87 questions representing the
[26:40] types of questions someone might
ask the TM form AI assistant.
[26:44] So this forms like our golden
set of evaluation questions.
[26:49] And during real usage, we log user
questions, gathering the information
[26:53] about what people are actually asking
AIVA, and we also log the AIVA responding.
[27:00] Responses.
[27:00] So we're creating evaluation
questions with AIVA responses
[27:05] which allows us to do automatic
and human-based manual evaluation.
[27:12] So in production at scale, you
wouldn't be able to use AI-based
[27:16] evaluators to evaluate AIVA's
performance and the responses.
[27:21] And alongside that, we provide
the ability for humans to evaluate
[27:24] the capability, and we've built
an interface for human evaluation.
[27:29] And that's used for feedback to refine
AIVA and to test, for example, when
[27:33] we change the underlying foundation
model under-pinning, Ava would repeat
[27:37] the evaluation before deploying
that new model into production.
[27:42] So this is showing the human
evaluation user interface.
[27:46] So you can see this is
the evaluation question.
[27:48] It's one of our golden questions.
[27:51] It's asking about Eton business
activities, and this is showing the.
[27:56] A logged answer from AIVA.
[27:58] So as the human evaluator, you get
to score it for relevance, accuracy,
[28:03] completeness, and give some commentary on
why you've given it a particular score.
[28:08] We have something very similar, so we
have, for agent evaluation, we are using
[28:13] the LangGraph, open sourced evaluation
framework, and then this uses like
[28:18] a prompt template for evaluating it.
[28:21] You're saying you are an expert evaluator.
[28:24] And it gives the question and the
answer and is asking the AI, so separate
[28:29] AI model, to evaluate the answer to
the question for relevant accuracy,
[28:35] completeness, and given overall
assessments, you get a very similar
[28:40] evaluation from the, from the AI agent.
[28:44] And that allows us to then have good
metrics about the evaluation where we
[28:49] can see, was this like a evaluation, like
a golden question, or was this a user
[28:54] question or was this manually evaluated
or using the automatic AI evaluation?
[29:06] And, and finally that gives us this
ability to have like a dashboard where
[29:11] I can monitor the performance of this
agent over time and ensure that we are
[29:17] constantly evaluating the performance.
[29:19] And then whenever we're making a
change,  we're ensuring that that
[29:22] change improves the overall performance.
[29:28] So that's the introduction
to the AI native canvas.
[29:32] And the concept of supporting agentic
components, components that embed
[29:36] AI agents while exposing their
capabilities as tools towards other
[29:40] agents, enabling this multi-agent
architecture operating at scale.
[29:45] And what makes this approach
powerful is that it provides the
[29:49] governance and control CSP needs.
[29:51] We can operate these systems at
scale while absolutely implementing
[29:55] responsible AI practices with the
auditing, observability, cost control,
[30:01] and continuous evaluation required
for production enterprise systems.
[30:04] And this work demonstrates that
the open digital architecture
[30:07] isn't just ready for AI, it's
architected to make AI operationally
[30:13] viable at telecommunication scale.
[30:16] The canvas provides the foundation
for CSPs to confidently deploy
[30:20] and operate multi-vendor agent
architectures across every functional
[30:25] domain with the governance frameworks
demanded by both regulators and
[30:29] responsible enterprise practices.
[30:32] Thank you for your time.
