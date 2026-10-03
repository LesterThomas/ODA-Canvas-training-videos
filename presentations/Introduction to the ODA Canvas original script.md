0:02
hello and welcome to the first video in
0:04
our series about the open Digital
0:07
architecture
0:08
canvas in this series you'll hear from
0:11
me and other members of the Oda team as
0:14
we explore the work being done to build
0:16
an Oda canvas and a reference
0:19
implementation this video is targeted at
0:22
two groups firstly it's targeted at
0:25
Architects or software Engineers
0:27
building functional software components
0:30
will explore what it means to develop
0:31
software components that meet the Oda
0:34
standards and how to use the Oda canvas
0:37
as an execution
0:39
environment the video is also designed
0:42
for Architects soft engineers and site
0:44
reliability Engineers who are building
0:47
or operating a canvas platform whether
0:50
you're working for a Communication
0:51
Service providing building your own OD
0:54
Canvas OR for a hyperscale cloud company
0:57
delivering a managed platform for others
1:00
this video is for
1:01
you I'll start by giving a high level
1:05
overview of where we are today starting
1:07
with a bit of a history about how we got
1:09
here then we'll cover what exactly an
1:13
Oda component is and what the Oda canvas
1:16
represents and we'll also dive into the
1:19
business benefits of adopting the
1:20
component approach why it matters and
1:23
how it compares to traditional methods
1:25
of deploying and operating
1:27
software finally I'll provide provide an
1:30
overview of some of the modules of the
1:32
Oda canvas that we've already
1:35
developed think of this as a preview in
1:37
upcoming videos we'll take a deep dive
1:40
into each one of these modules alongside
1:42
the contributors who help bring them to
1:45
life thanks for joining us on this
1:47
journey we hope you find these insights
1:49
valuable so so let's get
History
1:55
started over the past 25 years the TM
1:58
form has been hub for cl collaboration
2:00
driving Frameworks and standards that
2:03
accelerate the evolution of Telcom it
2:06
capabilities in the early days we
2:08
started with foundational Frameworks
2:11
that provided a Common Language covering
2:14
process information and functional
2:16
areas these Frameworks were very
2:18
valuable offering insights for tasks
2:21
like product selection or defining
2:23
change scope or Supply
2:26
evaluation but there were human readable
2:29
artifacts
2:30
open to interpretation and
2:32
implementation
2:34
variation so this led to each operator
2:37
including vop phone developing custom
2:39
variants of these standards resulting in
2:42
inconsistencies across the
2:45
industry the next significant step was
2:48
the launch of TM form's open API
2:51
initiative around 2013 we began
2:54
experimental work with apis conducting
2:57
hackathons and other events and in
2:59
January 2017 17 we officially launched
3:01
the open API
3:03
initiative these detailed prescriptive
3:06
machine readable
3:08
specifications Define standard Based
3:10
Services that could be used on top of it
3:13
systems this initiative gained wide
3:16
adoption across the industry with over
3:18
900,000 downloads to date by over 50,000
3:23
individual
3:24
developers and every it capability we
3:27
build in vone starts with the question
3:30
what apis do we need and how can we
3:33
Leverage The Standard apis we already
3:35
have and since then the open API
3:38
standards have continually evolved with
3:40
a strong Community constantly improving
3:42
the standards and helping
3:45
adoption however even with these
3:47
standard apis there are still
3:50
considerable challenges when it comes to
3:52
deploying and managing it software Telco
3:56
it environments are diverse and very
3:59
complex with hard to maintain systems
4:02
and we find it very difficult to upgrade
4:04
and continuously improve our systems
4:07
often upgrades require complex
4:09
transformation project upgrading
4:11
multiple different systems at the same
4:13
time and to tackle this we created the
4:16
idea of Oda
4:18
components so Oda components are
4:21
independently Deployable units of
4:23
functionality modules that clearly
4:25
Define not only their functional
4:27
capabilities but also their nonfunction
4:29
functional requirements such as security
4:32
observability and
4:34
management the Oda component standards
4:37
ensure these components are
4:39
interoperable designed for endtoend use
4:42
cases and importantly they're portable
4:45
meaning they can be deployed on any
4:47
standard canvas platform and that's
4:49
where the Oda canvas comes in the Oda
4:53
canvas is a softwar defined blueprint
4:55
for a cloud native operating environment
4:57
that serves as the execution platform
4:59
for Oda components it provides the
5:02
underlying services to these components
5:05
covering everything from API management
5:07
to
5:08
observability which means the component
5:10
developers can focus on functionality
5:13
while the canvas takes care of
5:15
operational concerns like security
5:17
monitoring and
5:20
scaling and in today's discussion we'll
5:22
go deeper into these two parts of the
5:24
story The modular Oda components and the
5:27
Oda canvas
Components and Canvas
5:31
so the components represent the modular
5:33
building blocks that form our it
5:36
architecture teams have worked tireless
5:39
to break down the endtoend Telecom
5:41
processes into these modular components
5:44
identifying data functional capabilities
5:48
and how each components fits into the
5:50
overall value
5:52
chain and this brings to us the idea of
5:54
composable it as new business challenges
5:58
emerge we should should be able to
6:00
rapidly assemble existing components to
6:03
meet those
6:04
challenges these components are
6:06
intentionally designed to work together
6:09
promoting a composable approach that is
6:11
essential in today's ecosystem driven
6:13
business environment where integration
6:16
across ecosystems is the
6:19
norm the Oda canvas addresses the
6:22
nonfunctional needs of components
6:25
whether it's security via standardized
6:27
identity management systems observe
6:29
ability through metrics or traceability
6:32
or event-based API management the canvas
6:35
standardizes and simplifies these
6:37
aspects so components don't need to
6:39
reinvent the wheel each time for example
6:42
with identity management instead of each
6:45
software component have its own system
6:47
for identity management the canvas
6:50
provides a unified identity management
6:52
service and the components can describe
6:55
their requirements so it can describe
6:57
what roles or permissions they need to
6:59
be created in that identity management
7:03
platform and this is crucial for for
7:06
Telos like vone where consistent
7:08
approach to managing user identities
7:10
across multiple applications will
7:12
dramatically reduce complexity and
7:15
cost the security part of the canvas
7:17
also provides a Secrets fault that
7:19
components can use to store passwords
7:21
tokens or other sensitive data in a
7:23
secure
7:24
way and we're also working on some
7:27
emerging services within the canvas such
7:30
as AI management or cost management for
7:34
AI we envisage components can declare
7:36
their requirement for AI Services
7:39
whether it's access to foundational AI
7:41
models or hosting custom AI
7:44
capabilities and this opens up the
7:47
possibilities for smarter more
7:49
intelligent components and we imagine
7:51
most components over time will be using
7:54
AI systems as part of their core
7:58
capability similarly cost management
8:01
will enable transparency and automation
8:03
around software usage and Licensing and
8:06
the carbon management is about our
8:09
sustainability so how do we embed the
8:12
ability for components to be able to
8:14
make smart decisions about how they
8:16
using T compute for example allowing
8:19
components to intelligently shift
8:22
workloads in time or in location to
8:25
optimize for green energy usage
Benefits
8:29
so what are the benefits of these proo
8:31
why are we doing this work so there's
8:33
lots of benefits and we believe this is
8:35
a win-win situation for csps for
8:39
software vendors for syst integrators
8:42
for cloud providers we think there's a
8:44
win-win and this could benefit the whole
8:47
industry in terms of our agility and an
8:50
ability to build Cloud native software
8:53
Solutions so there's customer experience
8:56
benefits through seamless integration
8:58
and zero touch
9:00
zero weight and zero trouble
9:02
operations I've already talked about the
9:04
Simplicity benefits so we going to move
9:06
from hundreds of operations teams
9:09
managing vertically integrated
9:11
applications to our Target is to have a
9:13
single site reliability engineering team
9:16
managing the canvas platform with
9:19
components and a huge amount of
9:20
Automation in terms of how those
9:22
components are deployed and
9:25
managed we believe this will unlock
9:28
innovation through agility and the
9:30
accelerated adoption of new technology
9:32
opportunities for example around the AI
9:35
native services that I mentioned early
9:37
and our goal is for this to help Drive
9:40
Industry
9:41
growth we believe this will give us
9:44
operational efficiency and Agility
9:46
through
9:47
automation uh so our goal is that
9:50
integration of Telco software moves from
9:53
being a manual project to being a fully
9:56
automated uh implementation
10:00
we pull security at the heart of this so
10:02
the core architecture implements zero
10:04
trust and we've adopted this concept of
10:07
security as code and also the reduced
10:11
variance and greater collaboration on
10:13
risk management will improve the
10:15
security footprint
10:18
overall and finally for technical debt
10:21
so we believe this will help us move
10:23
from today where we have lots of systems
10:25
which aren't continuously upgraded to a
10:27
position where we will Contin ly upgrade
10:30
every single software component in our
10:32
software systems because we have these
10:34
decoupled and modular uh interface
10:38
contracts overall we believe this could
10:41
give us a 10 times efficiency and
10:44
Agility Improvement so we're not doing
10:45
this for a 30% improvement in our
10:48
agility and efficiency we believe this
10:51
can give us a a step change an order of
10:54
magnitude Improvement in efficiency and
10:56
Agility and also to accelerate the
11:00
transformation to an AI native
ODA Canvas modules
11:06
Telco so what is in the Oda canvas so
11:10
the canvas itself is a modular platform
11:15
and the team developing the canvas we
11:17
work on these three different Horizons
11:21
so the Horizon one is focused on here
11:23
and now what can we do to improve the
11:26
experience of people deploy and adopting
11:30
the reference implementation of the
11:31
canvas so we've done a lot of work to
11:34
improve how easy it is to install the
11:36
canvas the canvas at the moment is just
11:38
a set of Helm charts that you can go and
11:40
Deploy on any uh kubernetes platform and
11:44
we've tested across all the Maj
11:46
kubernetes Cloud
11:48
platforms there's been a lot of work on
11:51
how do we improve the security and
11:53
automation on how we're building the
11:55
images in the canvas so now if you're
11:58
part of the team contributing to the to
12:00
the canvas in the G repository all the
12:03
images are built automatically and
12:06
they're put into a TM form Docker
12:09
repository and and we're improving the
12:12
the security hardening of those
12:15
images similarly we've done a lot of
12:18
work on test and release automation so
12:22
when you contributing a change into the
12:24
canvas the canvas is defined through
12:27
tests we're using something called bdd
12:30
or behavior driven design to actually
12:33
Define what the canvas is in a way which
12:36
is testable and then supporting that we
12:39
then have a full Suite of tests and
12:42
whenever anyone does a contribution to
12:44
the canvas as part of the pull request
12:47
process we run this full Suite so we
12:49
actually deploy their proposed canvas
12:51
onto a kubernetes cluster and run a full
12:54
Suite of automated tests so that we know
12:57
before we accept any contributions we
12:59
know that it doesn't break anything and
13:01
also anything new has to be defined or
13:03
described using these
13:05
tests and finally we have an Innovation
13:07
Hub dashboard so the team contributing
13:09
to this a very nice but dashboard
13:11
showing all the work we're doing and
13:14
tracking our progress at delivering
13:16
against the different ideas and issues
13:18
that we have those two this is all about
13:20
the actual features of the canvas or
13:22
developing new features so I mentioned
13:25
that when you have a canvas it manages
13:27
API management for you so I'm just going
13:29
to dip into this a little bit so the
13:32
concept is a component can describe its
13:35
requirements for what apis it wants to
13:38
expose um to outside of the component
13:41
and these could be part of this core
13:42
function or they could be part of its
13:44
own security and management when you
13:46
describe your requirements for uh apis
13:50
what happens is the component has this
13:52
declarative definition of its
13:54
requirements so there a it's a machine
13:55
readable description of its requirements
13:59
and the canvas platform can use any API
14:02
Gateway or service mesh to expose these
14:05
apis in a secure and controlled way so
14:07
we're not choosing a particular set of
14:09
Technologies we're just describing a a
14:12
standard way in which you can articulate
14:14
your requirements in a declarative model
14:17
and then API operators in the canvas
14:21
automate the configuration of those API
14:23
gateways and service meshes so you can
14:25
think about uh this API operator it's
14:27
bit like having a human operator could
14:29
take a requirements document from my
14:31
component and then go and manually
14:33
configure an API Gateway so returning
14:35
that and adopting a pattern of actually
14:37
having software operators so these are
14:39
software operators bits of software that
14:41
run as part of the canvas when you
14:43
deploy a component they will look at the
14:46
requirements for in this case API
14:48
management and then they will go and
14:50
automatically configure whichever API
14:54
Gateway you've chosen to use in your
14:56
canas implementation and to date we we
14:59
have six different options for API
15:01
management so the core team we developed
15:05
API management using two open- Source
15:08
gateways so Apache API 6 and the Kong
15:12
API Gateway and also fusing just sto
15:15
service mes so ISO service mes without
15:17
an API Gateway and then Google Microsoft
15:22
and well Cloud each independently
15:25
developed um API operators for their own
15:28
cloud platform forms and this is just
15:29
showing like the model we've got it's a
15:31
modular model but it's also extensible
15:34
so any API Gateway that can be
15:39
automatically configured through apis
15:41
you could build an operator for that API
15:44
Gateway and our goal is to have
15:47
operators available for every common API
15:52
uh Gateway platform that any CSP would
15:54
want to use as part of their operations
15:57
and this is a model for how the C works
15:59
so a declarative description of your
16:02
requirements and then these operators
16:04
which can actually take those
16:05
requirements and automate the deployment
16:07
and ongoing management of that piece of
16:13
software so in the Horizon 2 we've
16:16
worked on API management we have secrets
16:19
management which is about how do you
16:20
have like a Secrets Vault where
16:22
component can ask to store passwords or
16:25
other sensitive data that they want to
16:28
be stored in this sec Q away there is a
16:31
uh canvas portal and a set of Tools
16:34
around how to interact with the canvas
16:37
there's work on identity management and
16:40
in a in a similar model when you look at
16:42
the identity management the component
16:44
describes its requirements for roles and
16:46
permissions so component doesn't Master
16:48
identities we're moving that to master
16:51
identities in a canvas identity
16:54
management platform well you could use
16:55
any identity management platform the
16:58
component describes its requirements
16:59
which is basically saying these are the
17:01
roles and permissions I know about and I
17:03
want these to be available for you to
17:05
attach to identities in your identity
17:08
management platform and then when you
17:11
actually have a an implementation of a
17:13
canvas you have an identity management
17:16
operator or identity config operator
17:18
we've called it that can automate the
17:21
configuration of that identity
17:22
management system and at the moment we
17:24
have two we have one based on keycloak
17:26
which is an open source identity
17:28
management solution
17:29
and Microsoft have built one for their
17:31
entra ID identity management
17:38
system and then in our new features the
17:42
final one is we have uh features around
17:44
observability management so again we
17:46
have different options for a component
17:49
will
17:50
expose metrics and Telemetry data using
17:53
open metrics and open Telemetry and then
17:56
you can choose what
17:59
um service you have in your canvas to
18:02
actually get access to that
18:04
observability data and uh and we've
18:07
developed in the the core team we
18:10
developed some ones using open source
18:12
using Prometheus graffan and Kali and
18:16
then both Google and Microsoft have
18:18
developed versions onto their managed
18:20
observability services in their Cloud
18:22
platform and we've also developed one on
18:25
top of data dog to actually show that
18:27
you could use data dog for obs ability
18:29
and getting uh observability data from
18:31
the components and it's interesting to
18:34
note that when we're showing this
18:36
observability data it's not just the
18:38
technical observability for my component
18:41
you can also include business
18:42
observability you can actually create
18:44
business events so for example if you've
18:46
got a product catalog every time someone
18:48
creates a new product or a new category
18:51
you can have that as a business event
18:53
going into your
18:57
observability and that's what we're
18:59
working on in terms of the Horizon 2
19:01
which is like the new features we
19:03
believe we need to have for launch of
19:05
the Oda canvas but the team is also
19:07
working on experimental services so so
19:11
we believe that in a a short period of
19:14
time virtually every software component
19:16
will be using AI services and we're
19:20
setting out to have a standard way that
19:22
they can describe the requirements for
19:24
AI services and this could be for custom
19:26
AI models or could be to to access
19:30
foundational gen models and it could be
19:32
the associated Vector databases or
19:35
retrieval augmented generation
19:37
Frameworks which will help a component
19:40
actually Implement some AI service and
19:43
we've been experimenting with what do we
19:45
need to do in a canvas to make those
19:47
Services of the cloud platform available
19:50
in a standard way and also from a
19:52
component how you how you describe your
19:54
requirements for AI Services as part of
19:57
the component
19:59
definition in the experimental space
20:01
we've also got work on the developer
20:03
experience so how do we actually improve
20:06
the experience of developers developing
20:09
components into the canvas or of
20:12
developers developing new operators into
20:14
the canvas and we think it's really
20:16
important that we actually focus on
20:18
their experience and how do we attract
20:20
them to develop components in this
20:22
standard way and as I mentioned earlier
20:25
there are some other operators focused
20:27
on things like carb management we've
20:29
done a little bit of work in this space
20:31
around how do we Monitor and get data
20:34
about the the the carbon usage of
20:37
components but what Our intention is
20:39
there will be a suite of services in the
20:42
canvas to make components able to make
20:46
smart decisions around carbon usage
20:48
around cost management and we're also
20:51
going to do some work around having
20:53
access to standard databases as part of
20:55
a a canvas service
Conclusion
20:59
so this is the the set of services that
21:01
we're having as part of the canvas it
21:04
has been the result of extensive
21:07
collaboration across Communication
21:09
service providers hyperscalers software
21:11
vendors systems
21:12
integrators it represents a collective
21:16
contribution uh to what we originally
21:18
set out in our Oda Manifesto for
21:21
standard execution environment for Oda
21:24
components we believe the Oda cameras
21:27
will accelerate the of this Oda
21:29
component model and it'll also provide
21:32
the foundation for how Telco software
21:36
can evolve at a greater speed going
21:38
forward I mentioned the AI management
21:41
operator so we believe that by
21:43
collaborating in this way we can make AI
21:47
services available to every piece of
21:49
software in a much faster way and we can
21:53
accelerate the adoption of AI Services
21:56
across all of our software components
21:59
in a much quicker way through having
22:01
this forc multiplier of
22:04
collaboration um this video is just a
22:07
teaser as I said we're going to create
22:09
future videos and we're going to get
22:11
each of the collaborators that
22:13
contributed to this initiative to
22:15
develop videos into their own areas
22:18
where they built their collaboration so
22:20
please look out for future videos and
22:22
these will go in depth into each of the
22:24
areas I've touched on
22:26
today also if you have any comments or
22:30
you'd like to contribute to the project
22:32
then please engage with us I'll will put
22:35
links in the footnotes of the video okay
22:40
thank you very much