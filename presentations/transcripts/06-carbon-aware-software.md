# Carbon Aware Software — original transcript

- YouTube: https://youtu.be/I78MSow6RQg
- Referenced from oda-canvas: `source/operators/TMFOP011-Carbon-Management/README.md`
- Source: YouTube auto-generated captions, fetched 2026-10-16. Timestamps are [m:ss]. Unedited — expect caption errors.

[0:01] I'd like to share some work from the TM
[0:03] Forum Innovation Hub that was showcased
[0:05] at the recent DTW conference in
[0:08] Copenhagen.
[0:10] This work is on something called
[0:12] carbon-aware software.
[0:15] And this is the concept
[0:17] that software itself can be aware about
[0:21] how carbon intensive the electricity
[0:24] grid is and adjust its own behavior to
[0:27] maximize the use of renewable energy.
[0:30] And this is part of the TM Forum ODA
[0:34] canvas. We have a carbon management
[0:37] operator which can automate
[0:40] normal software becoming carbon-aware
[0:42] and therefore helping reduce the impact
[0:45] or the carbon impact of that software
[0:46] when it's running.
[0:49] I'm going to take you through how this
[0:50] operator works and the impact it can
[0:52] have.
[0:56] So firstly, this is the problem.
[0:58] Emissions from ICT constitute between 2
[1:02] and 4% of global emissions.
[1:04] And this figure is growing so it's a
[1:06] critical area that we need to address.
[1:10] The data centers that causing this,
[1:13] they're always on but actually the grids
[1:15] fluctuate between clean and dirty
[1:18] energy.
[1:19] And so the same computation at different
[1:22] times or in different places in the
[1:23] world if you can swap workloads to
[1:25] different regions, [clears throat]
[1:26] the same computation can actually cause
[1:29] different amounts of carbon to be
[1:30] released into the atmosphere.
[1:33] And this is where the carbon-aware
[1:35] software comes in. So carbon-aware
[1:36] software is software that measures the
[1:39] carbon footprint of computing operations
[1:41] and dynamically alters its own behavior
[1:44] to reduce emissions. So it's optimizing
[1:47] when, where and how applications
[1:50] execute.
[1:51] And
[1:52] from an IEEE publication, it shows that
[1:56] you can actually reduce
[1:58] to adopting these techniques, you can
[2:00] reduce the carbon
[2:01] emissions from between 45 and 99%.
[2:06] And there's three pillars of how you can
[2:08] do this.
[2:10] So, the first one is time shifting. So,
[2:11] if it's possible to schedule workloads,
[2:15] then scheduling it for when the grid has
[2:17] abundant renewable energy automatically
[2:20] reduces the carbon intensity. Clearly,
[2:22] that requires workloads that can be
[2:24] shifted. So, things like machine
[2:26] learning training or doing software
[2:28] updates or like batch or non-real-time
[2:31] event processing. So, you need to have
[2:32] workloads that can be shifted.
[2:35] The second one is actually location
[2:37] shifting. So, it's deploying workloads
[2:39] to data centers in regions with clean
[2:41] energy grids.
[2:42] Here's an example. So, one moment in
[2:44] time, you might find that the Nordic
[2:46] region has a much greener grid than, for
[2:50] example, Frankfurt. And therefore, if
[2:52] you've got workloads that can be shifted
[2:54] in location,
[2:56] i.e., they're not latency sensitive to
[2:58] customers in this case in Germany,
[3:00] then you shift those workloads to reduce
[3:03] the carbon intensity.
[3:05] And the third one is, and this is the
[3:06] one we're going to focus on today, is
[3:09] shaping your demand. So, it's actually
[3:11] dynamically scaling your own capacity
[3:14] based on real-time carbon intensity.
[3:16] So, in periods where the electricity
[3:19] grid where you're operating has high
[3:20] carbon, then we you reduce your task,
[3:23] you go into actually an eco mode.
[3:25] And at times when the grid where you're
[3:27] operating is green, is low carbon, then
[3:30] you scale up and you process any backlog
[3:32] that you may have.
[3:34] And the idea of this carbon operator, it
[3:36] provides a service to do this
[3:38] automatically without people having to
[3:39] rewrite existing software.
[3:44] And this is just to put in a bit of
[3:45] context of where this is. So, this work
[3:47] is part of this TM Forum ODA Canvas.
[3:51] And this software operator is actually a
[3:53] Kubernetes operator for dynamically
[3:56] scaling control.
[3:58] And the way in which it works is when
[4:00] you have an ODA component, you can
[4:02] declare or the developer of that
[4:03] component can declare certain
[4:06] microservices to be carbon aware.
[4:09] And the concept is microservices can be
[4:12] dynamically adjusted, their operations
[4:15] can be adjusted. You declare them as
[4:17] being carbon aware. You don't actually
[4:18] have to make any code changes in those
[4:20] microservices.
[4:22] And the way in which this works is a
[4:23] component declares its requirements for
[4:25] carbon aware processing.
[4:27] And then in the canvas, you have this
[4:29] carbon management operator.
[4:31] And what this does is it periodically
[4:33] queries real-time carbon intensity data
[4:37] from the zone where it's operating. And
[4:40] it uses that then to dynamically
[4:42] schedule the workloads of that
[4:43] component. Now, it's actually built on
[4:45] something called KEDA on a KEDA scaled
[4:47] object.
[4:48] And so the concept is this carbon
[4:50] management operator, it does the hard
[4:52] work of actually querying and getting
[4:54] the carbon intensity data and then using
[4:57] that to dynamically scale
[4:59] your component based on the requirements
[5:02] that you've set as part as the developer
[5:04] of that component.
[5:08] And this graph, it just shows an example
[5:11] of the carbon intensity of a grid and
[5:14] it's showing some sample data from the
[5:16] EU Frankfurt region.
[5:18] And what this does is it shows that over
[5:21] a period of 24 hours,
[5:23] the carbon intensity does vary. So, for
[5:25] example, in the middle of the night,
[5:27] typically when there's there's renewable
[5:29] energy on the grid but not many
[5:31] consumers, then you'll find the carbon
[5:33] intensity goes right down. And also in
[5:35] the middle of the day when there's lots
[5:36] of solar energy on the grid, the carbon
[5:39] intensity goes down. But like you see
[5:40] here, like the worst time is normally
[5:43] evening times where you have people at
[5:45] home doing their cooking and other
[5:47] activities. And this of course has
[5:49] actually lead carbon intensity to go up.
[5:52] And the way in which this work operates
[5:54] is there's a TM Forum performance API
[5:57] that provides this carbon intensity data
[6:00] towards the operator. So, in the ODA
[6:03] Canvas there's an API exposed that
[6:06] offers this TM Forum 628, which is a
[6:08] general purpose performance API. And
[6:11] we've created within that a performance
[6:13] showing the carbon performance for the
[6:16] electricity. What it actually does it it
[6:18] retrieves the current and for half hour
[6:21] intervals it shows the projected carbon
[6:24] intensity for the electricity where the
[6:26] that API is hosted.
[6:32] And the way in which the development
[6:33] team declare their requirements, so
[6:36] we've created a custom resource of
[6:38] carbon management custom resource
[6:40] where basically you can set some rules
[6:42] using a declarative method.
[6:44] And so, there's a YAML file you include
[6:46] as part of your component and you set
[6:48] some rules. And your setting rules
[6:50] basically saying based on the business
[6:52] activities that your software does
[6:55] in different levels of carbon intensity,
[6:59] you can then declare how that should
[7:01] impact the scaling of your software.
[7:04] And this a declarative configuration
[7:07] actually then creates a trigger into
[7:10] this KEDA, which is a standard
[7:11] Kubernetes resource.
[7:13] And the KEDA triggers actually the the
[7:15] thing that scales your deployments.
[7:17] And this is just showing then what it
[7:19] looks like. So, when you do that you
[7:20] provide a declarative requirement. And
[7:22] then what you do, your deployments where
[7:24] you want this to be applied. So, you
[7:26] don't have to apply it to every single
[7:27] microservice in your component. So,
[7:29] typically real-time microservices may be
[7:32] offering a real-time API you wouldn't
[7:35] use this because they need to be there
[7:36] the whole time. But some back-end
[7:38] processing microservices you would then
[7:42] label them to say
[7:44] for this a deployment if carbon aware is
[7:46] enabled. So, you're declaring that you
[7:49] want to apply whatever policy you've
[7:52] described to certain microservices
[7:55] within your component. And this example
[7:57] is a product order processor. So,
[7:59] something which is doing not real time,
[8:01] but near real time order processing
[8:04] where there can be some acceptance of
[8:06] delaying some of this processing, you
[8:08] can label it to say this is carbon
[8:10] aware.
[8:13] And then this is what happens. So, in a
[8:15] period where the grid is very red, so
[8:17] there's high carbon intensity, then this
[8:20] operator will constrain
[8:22] the number of replicas of the those
[8:24] microservices that have been declared to
[8:26] be carbon aware. And so, you will see in
[8:29] this example, when the carbon intensity
[8:31] is more than 550 g per kilowatt hour,
[8:36] then it's constraining a particular
[8:38] microservice to only have a maximum of
[8:41] one pod.
[8:42] And then what will happen is if this is
[8:45] a back-end processing, you might find
[8:46] the order queue building up, but that's
[8:49] deemed to be acceptable. And so, as part
[8:51] of this implementation, in that
[8:53] component, we are offering business
[8:55] metrics. And for example, one business
[8:58] metric is how long is the pending order
[9:00] queue? And so, you can see this the
[9:02] component is offering this business
[9:04] metric, and then that's what's then
[9:05] driving this auto scaling including
[9:08] considering the carbon intensity. And
[9:11] it's considered that acceptable to allow
[9:12] the order queue to grow. In this case,
[9:15] they show me order queue of 35. And then
[9:18] what happens is as the grid becomes
[9:19] greener,
[9:20] and now the carbon intensity has gone
[9:21] down, the operator then allows this
[9:25] deployment to scale up in order to
[9:27] process that backlog. And so, you can
[9:29] see in this case that pod has scaled up
[9:31] to nine instances, and it incrementally
[9:34] scaled it. And it's basically saying cuz
[9:37] the grid is much greener,
[9:38] you can now it's still using this
[9:39] business metric of the order queue
[9:41] backlog, and it'll scale up temporarily
[9:45] while it processes that backlog. And if
[9:46] there's no backlog to process, it
[9:47] wouldn't scale up. So, it's using a
[9:48] business metric as well as this carbon
[9:50] intensity data.
[9:54] And this shows a graph of this in
[9:55] action. So, for this thing, we simulated
[9:58] 80 orders being placed, and we did it
[10:01] twice. Once during a high-carbon
[10:04] electricity grid, and once during a
[10:06] low-carbon electricity grid.
[10:08] And then,
[10:09] these three graphs show different views
[10:11] of that. But in both cases, it was the
[10:12] same number of orders. And in the most
[10:14] this first one is showing how many
[10:16] back-end microservices, how many running
[10:18] pods do we allow to scale for those the
[10:20] order processor. And you're saying we In
[10:22] this case, we restricted it to one
[10:25] to allow a backlog to build and to not
[10:26] use electricity during this high-carbon
[10:28] period.
[10:30] And when the energy grid was low-carbon,
[10:32] actually you let it scale right up.
[10:34] And this also then shows the energy
[10:36] consumption. And you can see, when we
[10:38] let it scale up, it's consuming far more
[10:41] energy. But of course, this isn't a
[10:42] problem because this is consuming energy
[10:44] when the grid is green. So, you're
[10:46] actually consuming a lot of renewable
[10:47] energy.
[10:49] And then, this also shows the order
[10:51] completion rate. And you see, when we
[10:53] were constraining it, clearly you were
[10:54] then having much fewer orders being
[10:56] completed.
[10:57] But then, the second scenario with the
[10:59] low-carbon grid, you actually you're
[11:01] going to burst through at those orders.
[11:07] So, this is the the key part of this is
[11:10] what happens is orders queue up during
[11:12] high-carbon periods, and the backlog is
[11:14] then processed in bursts when the grid
[11:16] becomes green.
[11:18] And energy will increase during that
[11:20] processing, but it's using green energy.
[11:23] And the benefit is we have this
[11:24] demand-side control to maximize the use
[11:27] of low-carbon electricity.
[11:33] So, this is the summary. So,
[11:35] this is the first operator the first
[11:37] carbon aware operator that we've managed
[11:38] to develop. And our takeaways are carbon
[11:41] aware demand shaping actually works.
[11:44] We're able to do this with no code
[11:45] changes to the microservices software
[11:47] components. We took an existing
[11:48] component. We didn't have to make any
[11:50] code changes. It's all done by adding
[11:53] these additional YAML declarative
[11:55] declarations to set the policy and to
[11:58] determine which microservices you wanted
[12:01] to be carbon aware.
[12:03] We are going to extend this further. So,
[12:06] as I mentioned earlier, there's multiple
[12:07] ways in which you can make software
[12:09] carbon aware. So, we can look at how we
[12:10] do location shifting across a
[12:12] multi-region deployment. So, you can
[12:14] actually dynamically use energy in a
[12:17] greener or low-carbon region and do that
[12:20] dynamically based on real-time data.
[12:23] We're going to integrate this into the
[12:24] models as a service AI operator. So,
[12:27] we're not just shaping the carbon
[12:29] intensity of the workloads that you're
[12:30] actually using, but actually shaping our
[12:32] consumption of AI workloads cuz clearly
[12:34] those have a big carbon impact.
[12:37] And then the third one is our plan is
[12:38] also to publish this carbon intensity
[12:41] data as part of our software
[12:42] marketplace. So, it's almost like to
[12:44] encourage teams building components
[12:47] to make them carbon aware and you'll
[12:49] actually be able to see this as part of
[12:51] our component selection process.
[12:55] I'll say if you want to contribute this
[12:56] is part of this TM Forum Innovation Hub.
[12:59] All code is at github.com {slash} TM
[13:02] Forum {dash} ODA and it's in the ODA
[13:06] canvas repository.
[13:08] And then finally, I'll give a big
[13:09] shout-out to Adarsh who actually
[13:12] developed this work. Adarsh is one of
[13:14] our developers working on this TM Forum
[13:16] Innovation Hub. So, well done to Adarsh.
[13:19] And if other people want to join, do a
[13:21] Google search for the TM Forum
[13:22] Innovation Hub and all the details will
[13:24] appear there.
[13:25] Okay, thank you very much.
