# ODA Canvas Authentication and Authorization deep-dive — original transcript

- YouTube: https://youtu.be/w0iQv9FtuiM
- Referenced from oda-canvas: `Authentication-design.md`
- Source: YouTube auto-generated captions, fetched 2026-10-16. Timestamps are [m:ss]. Unedited — expect caption errors.

[0:01] hello and welcome to the next video in
[0:03] the series about the open Digital
[0:05] architecture
[0:07] canvas in this video I'm going to share
[0:09] a deep dive on how the authentication
[0:12] and authorization works with the Oda
[0:16] canvas I'm going to answer three
[0:18] questions so the first is what is the
[0:21] scope of an Oda component versus the Oda
[0:24] canvas with respect to authentication
[0:27] and
[0:28] authorization how does the canvas get
[0:30] permission to call management and
[0:32] security apis on a component and also
[0:35] how does a component Define the roles
[0:37] that it supports for external systems as
[0:40] well as other components to access its
[0:46] services now with the Oda canvas each
[0:49] Oda component includes a declarative
[0:52] definition of its requirements for roles
[0:55] and permissions the component does not
[0:58] Implement any identity management
[0:59] solution solution but instead relies on
[1:02] an identity service to be available in
[1:04] the canvas now this is a big change from
[1:08] our traditional application architecture
[1:09] so in our current environment many
[1:12] applications will include identity
[1:14] management as part of their
[1:16] implementation because they have to
[1:17] because they're built as Standalone
[1:20] applications but we're setting to get
[1:21] away from that in the canvas we're
[1:23] setting to have a single identity
[1:25] management solution and have components
[1:28] that can be lightweight because they are
[1:30] just declaring their requirements for
[1:31] identity management and not having to
[1:34] actually Implement their own identity
[1:36] management solution as part of their
[1:40] implementation now a canvas platform can
[1:42] use any identity management solution
[1:44] that can support the oo 2 standard
[1:46] services and identity config operators
[1:50] automate the configuration of the
[1:52] identity management systems using roles
[1:54] and permissions that are mastered in the
[1:57] component and in our reference canvas we
[2:00] have identity config operators for
[2:03] keycloak and also for uh Microsoft as
[2:06] your enter ID now in this video I'm
[2:09] going to use the the keycloak opsource
[2:12] uh identity management solution but it's
[2:15] just a demonstration and the same
[2:17] concept should apply for whatever
[2:19] identity management solution you're
[2:24] using so the first thing is when I
[2:27] install the base canvas
[2:30] and I have keycloak as part of my uh
[2:34] installation what happens is the
[2:37] installation will include a canvas
[2:40] system user which is called a client in
[2:43] keycloak and the idea is when the canvas
[2:45] is calling any Services it does it as
[2:48] this canvas system user so the if the
[2:50] canvas is calling management or Security
[2:53] apis on a component it will use this
[2:56] canvas system user
[3:01] and when I deploy a component it
[3:03] declares the role to be applied to this
[3:06] canvas system user to give it
[3:08] authorization to call its apis so the
[3:11] canvas system user needs to be given
[3:13] permission to call the apis on a given
[3:15] component and that's done because the
[3:18] component actually declares it as part
[3:20] of its its component specification and
[3:23] there's an identity config operator that
[3:26] takes that uh definition or that
[3:28] declaration and it'll configure it and
[3:32] go into keycloak and Grant that role to
[3:34] the canvas system user and the component
[3:38] can also declare other roles that can be
[3:41] granted to other clients so this could
[3:43] be external systems or other internal
[3:46] components and these roles can be static
[3:49] as part of the component specification
[3:51] or they could be dynamic and exposed by
[3:54] the component using an API so I'm going
[3:57] to demonstrate this while I'm going to
[3:59] going to a local canvas which I've have
[4:02] I've installed on my machine here and
[4:05] you see at the moment it's got no
[4:06] components running in it and I'm going
[4:08] to do a Helm install of a component
[4:11] which is using static roles as part of
[4:14] its definition and I'm just going to go
[4:16] and show the yaml definition for this uh
[4:23] component and if I look at the yaml
[4:27] definition here within the security
[4:29] function function you can see it's
[4:31] defined some component roles these are
[4:33] roles you could apply to external
[4:36] systems or to other components to grant
[4:38] them permission to call the apis and
[4:42] this is the role that's given to the
[4:44] canvas system user so the canvas system
[4:47] user has permission to call the apis
[4:50] it'll take just a few minutes for this
[4:52] component to be deployed in fact it's
[4:54] just completed so if I go and have a
[4:56] look in keycloak we can see what's
[5:00] happened so I log into key
[5:04] cck the first thing I'm going to do is
[5:06] just to show there was this canvas
[5:08] system user installed and this was
[5:11] installed as part of the uh installation
[5:14] of the canvas and then if I look in my
[5:17] clients you can see it's created a
[5:19] client for the component that I just
[5:22] installed it's R1 product calog
[5:23] management
[5:25] component and within that client you
[5:28] should see there should be a set of
[5:31] roles that it's created in keycloak and
[5:33] so these are the roles so these were the
[5:36] roles I designed to be shared with other
[5:40] external systems or other
[5:42] components and this is the role which
[5:44] should be applied to that canvas system
[5:47] user and I can just go and check whether
[5:49] that's happened so if I go to the canvas
[5:51] system user I should be able to see that
[5:55] if that canvas system user has been
[5:58] granted that admin
[6:00] roll on top of this R1 product catalog
[6:03] management
[6:04] component so it's all good now as well
[6:07] as being able to Grant roles into to the
[6:09] canvas I can also Grant some of these
[6:11] roles to external clients so I have an
[6:15] external client I can grant it a role
[6:17] onto this component and I can also Grant
[6:20] it to internal which would be granting
[6:22] it to other components to call so I'm
[6:24] going to deploy in a second component
[6:27] and give it a release name FC and I can
[6:29] GR that second component permission to
[6:32] call um apis by granting it one of the
[6:35] roles from this
[6:37] component so let me go and do
[6:40] that so first I'm going to
[6:42] install that FC
[6:47] component uh I'm just going to show this
[6:50] component it's using the
[6:54] dynamic uh Declaration of its roles I'm
[6:57] just going to quickly show
[7:01] that so here within the security
[7:04] function the role to add to the canvas
[7:08] system user has to be statically defined
[7:10] because it doesn't have permission to
[7:11] call apis until it has that first role
[7:14] but then other roles that this component
[7:16] is offering it's making available by
[7:20] implementing a TM form open API and
[7:23] effectively the canvas will call this
[7:25] API and it will listen for any updates
[7:30] so you can
[7:31] dynamically uh and continuously through
[7:33] the life cycle of that component you can
[7:36] dynamically add all remove or update the
[7:38] roles and they'll automatically be
[7:41] configured in keycloak and this would be
[7:43] the typical thing you'd have with
[7:44] something like a product catalog where
[7:46] during the lifetime of the catalog you
[7:48] might want to add for example an
[7:49] mvn user which would only have
[7:52] authorization to view a subset of the
[7:56] products and offers within a product
[8:00] management
[8:04] component and that's also complete and
[8:07] I'm going to go into keycloak and show
[8:10] how I would Grant firstly an external
[8:13] system a role on that component and then
[8:16] secondly how grant that second component
[8:20] role on the first
[8:21] component now in key clo if I want to
[8:25] create an external system using the
[8:28] client Authentication flow I have to
[8:30] create that as a client so I'm going to
[8:32] go here and I say create client and I'm
[8:35] going to give it a name of external
[8:36] system and I'm going to switch on this
[8:40] client authentication
[8:43] flow now in keycloak to Grant it a role
[8:49] is actually a two-step process firstly I
[8:52] create a client scope this is almost
[8:54] like a grouping of roles and then I
[8:57] attach that client scope to this
[8:59] external system user and this is
[9:01] something specific to keycloak other
[9:03] identity Management Solutions might have
[9:04] something similar it's and you can
[9:07] consider a client scope
[9:09] being a business role which you can
[9:13] assign technical roles into and it makes
[9:15] it easier to then assign that same
[9:16] business role to multiple clients so I'm
[9:19] going to go and create a client
[9:21] scope and I'm going to call it
[9:24] catalog one
[9:28] scope and
[9:31] and I can in this in this client scope I
[9:34] can then assign the role and these roles
[9:38] I'm going to look by
[9:40] clients and I'm just going to and I'm
[9:42] look for r on this R1 product catalog
[9:44] management component and I want to Grant
[9:47] it this cat one owner role so it's a
[9:50] role which been defined by the R1
[9:52] product Catal management component and
[9:54] I'm going to assign that into this
[9:57] catalog one scope
[10:00] and then now that I've done that I can
[10:02] go into my external system user and I
[10:06] can basically attach that client scope
[10:10] so that client scope now which includes
[10:12] the role I'm going to add to my external
[10:16] system so that's it so I've now granted
[10:18] that external system a roll and what I
[10:21] would do with an external system I'd
[10:23] have to then look at the client ID in
[10:25] secret and somehow pass the client ID in
[10:28] secret on onto the operations team for
[10:30] the external system and they could then
[10:32] call they' call through the oor um
[10:35] client authentication flow and they' get
[10:38] a token and they'd be able to call the
[10:40] apis on my component and the component
[10:42] would say yes I'm being called by a user
[10:46] which has a role which I defined and
[10:48] that role was called cat one role and so
[10:51] I know what they' have authorization to
[10:55] to do and what data they're authorized
[10:57] to see within my component
[11:00] so that's me doing for an external
[11:01] system doing it for another component is
[11:04] actually a little bit simpler because
[11:07] the canvas automatically creates the
[11:09] client for that other component so when
[11:11] I have this FC component and I want to
[11:14] granted a roll on my R1 component it's
[11:17] already created my client for this other
[11:20] component and so I just go into here and
[11:23] the same thing I need to give it a
[11:24] client scope so I could create a
[11:26] separate client scope for this component
[11:28] or I could just go and say I'm going to
[11:30] grant that component that same scope
[11:35] almost like the same business role to
[11:37] call those
[11:41] apis so that's how I grant access to
[11:45] external systems or to other components
[11:48] to call apis on my original component
[11:51] and and we're putting the right things
[11:53] in the right place so for every
[11:55] component it creates a system user for
[11:57] the component the canvas has as a system
[11:59] user if I want to have external clients
[12:02] you create like a system user for that
[12:05] external client the roles all originated
[12:09] in the components the components Define
[12:10] the roles and so they know when they
[12:12] receive calls they know what the roles
[12:15] mean and you can then go into whatever
[12:18] identity management solution you're
[12:19] using and key clug is just an example
[12:22] and you can then assign those roles to
[12:24] those to those clients
[12:29] so let's just revisit the three
[12:30] questions and recap so what's the scope
[12:34] of an Oda component versus the Oda
[12:35] canvas with respect to authentication
[12:38] and authorization so components do not
[12:40] include their own identity management
[12:43] but instead declare their roles to be
[12:45] configured by canvas into a common
[12:47] identity management
[12:49] solution how does a canvas get
[12:51] permission to call management and
[12:53] security apis on a component so it's
[12:56] mandatory for each component to declare
[12:58] roles
[12:59] and those rules are applied to the
[13:01] canvas system user so they give that
[13:03] canvas system the permission to call
[13:05] those management and security
[13:07] apis and how does the component Define
[13:09] the roles it supports for external
[13:10] systems as well as other components to
[13:12] access so components can either
[13:14] statically or dynamically create roles
[13:18] and those roles are to be granted to
[13:19] external or internal clients or other
[13:24] components so in this video I haven't
[13:27] covered how how you use this
[13:29] authorization model within a component
[13:32] implementation and the team are working
[13:34] on some reference implementation that
[13:36] will show how to do this and help
[13:38] accelerate the adoption of this Oda
[13:40] model I also haven't shown how the
[13:43] canvas conf can configure API gateways
[13:46] to enforce and protect the component
[13:49] Services both of these are topics for
[13:52] future videos
[13:59] finally here are some links for further
[14:01] information on the UDA components and
[14:04] canvas if you have any comments or you'd
[14:06] like to contribute to this project then
[14:09] please get in touch with us okay thank
[14:11] you for your time
