# How do I buy or build an ODA Canvas? — original transcript

- YouTube: https://youtu.be/dYyyCDPlVHY
- Referenced from oda-canvas: `source/operators/README.md`
- Source: YouTube auto-generated captions, fetched 2026-10-16. Timestamps are [m:ss]. Unedited — expect caption errors.

[0:01] one question that we often get asked is
[0:04] how do I buy or build a
[0:06] canvas the reference implementation of
[0:09] the Oda canvas is designed to have a set
[0:12] of services that are freely available
[0:14] for organizations to use extend or to
[0:18] build into their own
[0:20] implementations all of these
[0:22] capabilities have been built by the
[0:24] community and published as Apache 2
[0:27] licensed
[0:28] assets we also expect hyperscale public
[0:31] Cloud companies to build canvas services
[0:34] on their own native cloud services as
[0:36] well as infrastructure software vendors
[0:39] building operators for their own
[0:40] particular software
[0:43] applications so the choice for a CSP
[0:46] wanting to buy or build their own canvas
[0:49] is to use one of the multiple public
[0:51] Cloud
[0:52] offerings to roll their own based on the
[0:55] reference
[0:57] implementation or to use canvas services
[1:00] from infrastructure software
[1:02] vendors and this isn't an either or
[1:05] decision the canvas itself is modular
[1:08] and you can mix and match these
[1:10] approaches to build your own
[1:13] canvas the individual modules of a
[1:16] canvas are called canvas operators and
[1:19] they follow a standard pattern used in
[1:22] many kubernetes
[1:25] applications so what types of canvas
[1:28] operator are available
[1:30] now there are several types of operator
[1:32] in the Oda canvas for each type of
[1:35] operator there may be multiple technical
[1:39] implementations the list below shows the
[1:42] types of operator available in the Oda
[1:44] canvas reference implementation this
[1:46] list is not exhaustive and we foresee
[1:49] new operator types becoming available as
[1:52] the Oda canvas
[1:54] matures now let's go through a few
[1:58] examples so the first is API
[2:02] operators each Oda component includes a
[2:06] declarative definition of its
[2:08] requirements for exposing its
[2:10] apis the apis could be for the core
[2:13] function of the component or for
[2:15] managing and securing the component
[2:18] itself and a canvas platform can use any
[2:21] API Gateway or service mesh to expose
[2:25] these apis in a secure and controlled
[2:27] way and API operate
[2:30] automate the configuration of the API
[2:33] gateways and service
[2:36] meses now we have reference canvas
[2:40] operators for the Kong API Gateway for
[2:44] Apache
[2:46] api6 for just managing the iso service
[2:49] mesh
[2:50] itself and Google Microsoft and whale
[2:54] Cloud have created API operators for
[2:56] their own native services
[3:01] another example is for observability
[3:04] management and each Oda component
[3:07] includes a declarative definitions of
[3:09] its requirements for
[3:12] observability now the component doesn't
[3:14] Implement any observability solution but
[3:17] relies on an observability capability to
[3:20] be available as part of the
[3:22] canvas and the canvas can use any
[3:25] observability solution that supports the
[3:28] open metrics and open Telemetry
[3:32] standards and we have an observability
[3:34] config operator to automate the
[3:37] configuration of the observability using
[3:40] requirements declared in the
[3:46] component and as a third example for
[3:49] identity management the key concept with
[3:52] the Oda components and canas model is
[3:55] that each component doesn't need to
[3:56] implement its own identity management
[3:58] solution and this is a change from
[4:01] today's application architecture where
[4:04] most of our vendor Solutions come with
[4:06] their own identity management built in
[4:09] and this causes considerable friction
[4:12] for our operations teams as we need to
[4:15] integrate these separate IDM Solutions
[4:18] into our company standard IDM solution
[4:21] where we Master our employee data and
[4:23] our employee system
[4:24] access the Oda component and canvas
[4:27] model simplifies this by getting the
[4:30] components to master only the role and
[4:33] and permission information that they
[4:35] require to be linked to identities and
[4:38] to enable each component to integrate to
[4:40] a single IDM solution made available in
[4:43] the
[4:44] canvas so each Oda component includes a
[4:47] declarative definition of its
[4:49] requirements for roles and
[4:52] permissions a canas platform can use any
[4:55] identi management solution that can
[4:57] support the O2 standard
[5:00] and identity config operators automate
[5:04] the configuration of the identity
[5:05] management solution using roles and
[5:07] permissions that are mastered in the
[5:10] component and our reference canvas now
[5:12] has identity config operators for
[5:15] keycloak and for Microsoft as your intra
[5:21] ID finally I want to talk about our
[5:23] future planned operators So within the
[5:27] Oda canvas community
[5:30] we're experimenting with operators We
[5:32] Believe will be of value into the future
[5:35] the first of these is the AI management
[5:38] operator so we believe that within a
[5:40] short period of time most software
[5:42] components will embed AI as part of
[5:44] their core
[5:45] functionality this could be using custom
[5:48] AI models or accessing foundational gen
[5:51] AI
[5:52] models the AI operator will allow a
[5:55] component to include a declarative
[5:57] definition of its requirements for AI
[6:00] and the canvas makes these AI Services
[6:03] discoverable from the underlying Cloud
[6:05] platform the goal is to enable all
[6:08] software components to be able to use AI
[6:10] or gen services but have strong control
[6:13] and governance of the AI Services being
[6:16] used the canvas will include all the
[6:18] required capabilities to control and
[6:20] monitor the use of AI services and to
[6:23] ensure we're using AI in a responsible
[6:25] way aligned with the regulatory
[6:28] requirements like the EU AI
[6:30] act we also have other operators planned
[6:34] for things like carbon management to
[6:37] ensure the the sustainability of
[6:40] component software and also for cost
[6:45] management and as I said at the
[6:47] beginning this list of types of canvas
[6:49] operator isn't exhaustive as the canvas
[6:52] matures we expect other operators to
[6:55] become
[6:56] available and finally for further
[6:59] information
[7:00] please look at one of the links shown on
[7:02] the slide to look at the open Digital
[7:04] architecture itself or at the Oda
[7:08] component accelerated documentation site
[7:11] or the Oda canvas GitHub repository okay
[7:14] thanks very much
