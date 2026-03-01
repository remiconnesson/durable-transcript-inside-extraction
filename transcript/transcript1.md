0:00
[Music]
0:14
[Music]
0:20
We're talking today about identity for AI agents and how we authorize uh
0:25
agents, MCP servers and uh the Um, we launched a new product uh
0:32
actually this week. So, uh, that made this presentation fun. Uh, had a major
0:38
release just a few days ago um, for several of these features and ging these. Um, um, additionally, I should
0:46
probably preface by saying a lot of this workshop material has been repurposed and um, our our architect uh, Abbyek, he
0:54
goes by nicknames Shrek. um kind of prepared a lot of this and
1:00
we've kind of massaged it into this presentation. Um yeah, so we're going to cover each of
1:08
these in depth. um some of the core features of this new release whether
1:15
it's token vault um async off we're not going deep on FGA but uh just know that
1:22
there is another kind of subproduct if you will that's all around role based
1:27
access control um there's an open- source project around fine grain do off
1:34
um which really extends this feature set but that's really kind of another talk Um,
1:40
so yeah, that's some of the things we'll be talking. Uh, quick intros. Uh, uh,
1:46
it's my first time at AIE, so thank you guys. It's been awesome week already. Learned so much. Um, um, yeah, I'm I'm
1:54
from Raleigh, not not actually a Shire, but uh, this is a little bit about me.
1:59
Um, and, uh, yeah, it's been great. I came over from Duasio from Red Hat and
2:06
I've learned a lot about the identity space in the last four years. Um I'm going to roll over to Carlos.
2:13
Yeah. Hi. Um yeah, I'm I'm Carlos. I'm co-host with uh Patrick for this
2:20
workshop today. Um first time in New York, first time in the US. So great so
2:26
far. Uh thank you for the welcoming. Um I'm best in Spain in Mayor if you know
2:32
the place it's a beautiful island. Um I joined Al and Octa. Um I did a bit more
2:40
two years father of two and well yeah it's a
2:45
little bit of about myself. So I'm going to I want to start this
2:52
with a vision that I'll zero share. uh this is uh to free everyone to safely
2:59
use any technology and the fun fact about this is is a vision that precedes the AI Asian era uh
3:09
and still stands uh because at the end of the day is what what we do uh we deal
3:18
with identity for past, present and future technology and yeah um
3:27
just to give a little bit of what's the challenge. Um so I said that
3:35
our vision is just to to free uh anyone to use any technology but it doesn't
3:40
mean that all the technologies are the same and all the technologies has the same uh challenges. It's obvious that
3:49
agents bring new challenges, new threats. And just to illustrate, this is
3:55
an updated list of the OASP uh LFO top 10. Um
4:02
so you can see new things that they didn't exist before. So yeah, obviously
4:07
we need to to solve new problems. Um
4:15
so how how we modeled or how we think of agents in our data. So
4:22
we think yeah so far we've seen interactive agents chat box code editors
4:29
but this is unlikely the the future.
4:34
we start to see other uh modalities where the agents doesn't run anymore in
4:43
a in interactive way. Um dash runners or autonomous agents is something that is
4:50
very popular these days. But beyond that
4:56
we see a feature where fully autonomous agents can do things uh either on behalf
5:04
of the users or maybe just because agents will start talk to other agents.
5:14
So this is how these are four pillars that we believe will cover all these new
5:21
modalities. The first one is AI needs to know who I am. So this is
5:29
this is key. Uh if the agent doesn't know who I am, it can never apply any
5:35
security or any restriction or any authoration authentication because
5:40
I'm just an anonymous source or actor in this and this is
5:46
important. The second is obviously the agents will be autonomous
5:53
enough but it doesn't mean that we'll be alone. It will be just doing things on its own. Eventually they will need to
6:00
access other services to consume other resources. So AI needs to call APIs on
6:06
on my behalf as a user. But sooner or later the agent will try
6:14
to do something riskier or something that I don't I don't think as a user the
6:20
agent should do on its own uh without any supervision uh from my side. So AI
6:28
can request my confirmation and lastly um AI access
6:36
should be fine grain. So I need to to give the agent control to access my
6:41
resources but not any resource, not any collection or document or anything. It's just it has to be on my hands to what
6:49
the agent can access and what not.
6:54
And just to to also introduce where octa and alto can play or
7:03
complement each other. So we talked about a user and it could
7:08
be me, it could be you but eventually will be an employee within an enterprise
7:13
or a company and in this case the employee is not only acting on his own
7:19
behalf is also representing the company and in in those cases the company needs
7:25
also control what exactly those agents that are acting on behalf those employees are doing. So that's where uh
7:33
Opta also plays a uh important part and
7:38
in the other end Alzero is what we uh the the capabilities and features that
7:44
we've implemented I think is where they connect. Yeah. Just trying to understand you said the
7:49
agents need to know who you are. Yes. Who you are is what as the user and the coder and the one with the permissions.
7:57
uh is the subject of the the the operation that you're doing. Like it could be anything. It could be you as an
8:03
employee. It could be you as an owner or something as an administrator or something. But at the end is a person a
8:09
human. Yeah. Yeah. In in the scenario I was talking about.
8:14
Is is this what what permission the agent have access to
8:21
or who has access to the Asian capabilities? I'm not like I don't understand
8:28
both. Yeah. What does that two here? We're sorry.
8:34
We are definitely touching on both. So yes, let's Yes. And time for your questions at the end. Absolutely. Let's
8:41
make sure. Thank you. Thank you. Thank you. All right. So let's get deep on exactly
8:48
what we are going to present today. Uh we talk about four pillars. um not in a
8:54
particular order but we are I'm going to introduce uh one of the three which is
8:59
or how we made possible one of the three which is um AI can request my approval.
9:06
Um for that we implemented a sync O as part of the O for uh AI us offering and
9:15
basically this feature what it does is creates a mechanism and and a protocol
9:21
for the agent to reach out the user when an operation needs to be approved by the
9:26
human in in in this flow. It's seems simple. Um
9:33
it it is in in essence but well it's security but uh on it's built on top of uh client
9:41
initiated authentication uh sorry client initiated back channel authentication protocol. It's an ITC uh specification
9:49
and it's yeah so in this scenario is the agent that it's initiating the
9:55
authentication and authorization. So the agent is running maybe it could
10:01
be a long run autonomous thing and at some point needs to make a purchase or
10:07
make something that is flagged as risk. Uh so with with a sync uh with a simple
10:14
SDK call it can initiate um an authorization request that
10:21
materializes a notification to the user. The user receives the details of that
10:27
transaction well structured. The user acknowledges that, approves that and
10:32
then that approval gets back to the to the agent in form of an access token. And that access token contains the exact
10:40
details that the user approved. And yeah, I'm going to hand over to
10:47
Patrick for this one. Awesome. Yeah, thank you Carlos. And yeah, good question. Thank you both
10:52
questions. the the token vault as the other kind of like you know major
10:58
feature we're introducing with this AI more AI targeted AIO release um token
11:04
vault is a new mechanism for persisting your upstream uh resource refresh tokens
11:13
so I'm sorry refresh tokens and you may have used oor before right for social
11:18
providers um or in tangent with like other identity providers Um this makes use cases with agents much
11:27
much easier. Um so we we we have a really fine grained now flow which
11:33
allows you to exchange tokens. So on on behalf of users so I can you know I can send my access token or my application's
11:41
refresh token um whether it's for an API whether it's for my application um and I
11:47
can then request scopes for an upstream uh you know service. So whether that's
11:52
accessing Slack API or Facebook API or um any any other identity you know uh
12:00
scoped API and so yeah and we we actually persist scopes we manage lifetimes of tokens um we do a lot of
12:07
handling there to ensure that your SDK life is very easy um and that your agent
12:13
stays online and it's it's it's available and it's secure u um yeah
12:19
we've been testing this flow really extensively. Um, but you can kind of get a picture of what is going on under the
12:26
hood and um, yeah, we'll talk more about token vault in the in the shop. It'll
12:31
make a lot more sense when we get in there. Um, I do want to kind of highlight a few flows though. Um, where
12:39
you know I mentioned refresh token and access token. um as we are digesting
12:44
each of the agentic frameworks you can kind of see that well it may differ if you're using a single page app right and
12:51
uh you know you're you don't have a backend which is as you know uh as secure you're or you're wanting to
12:57
access an external API um in these cases especially like with langraph uh we we
13:03
use an access token it's shortlived access token um that's simply because langraph stands up an external API um
13:11
there's a langraph protocol around the langraph CLI. So yeah, in this case like we kind of model that flow whereas like
13:18
other flows you may just have a native app or a simple Nex.js regular web app
13:24
um traditional web app with your agent running embedded. Um then yeah in this
13:30
case like a refresh token may fits your use case perfectly fine. Um, and then I think as we're going to talk later,
13:36
there's also cases where, you know, maybe you have an asynchronous agent
13:42
accessing other data. Um, we have a new mechanism now called a custom API client. Um, which can allow an MCP
13:50
server for example to access remote data. Um, so that's kind of the conceptually what we've done at Ozero.
13:56
We've taken agent, we've kind of modeled it as a client and we've taken your APIs and kind of modeled them as traditional
14:03
OOTH resource servers or APIs in our platform. Um, so yeah, that's a little
14:08
bit what's going on here. I've kind of listed some details about token exchange on the slide. Um, yes, that just know
14:16
that the subject token type is kind of type of exchange whether access or refresh. The subject token is your your
14:23
token. um the user token be in exchange for the third party token. Um
14:30
let's see. This is a really quick GIF of um our interrupt flow with Lingraph. Uh
14:38
recently wrote this. Um so it just shows kind of you know what the what the
14:43
mechanism looks like. If the the prompt says uh you know I need access to my calendar, we have a a Google social
14:50
provider. um we have an interrupt you know as part of our SDK it will feed you
14:56
back the the mention that you need to request additional scopes we then do the token exchange from token vault get you
15:02
a new access token and then you can up access your upstream provider um really
15:08
quite simple in our in our framework now um quickly about MCP and then we'll dive
15:14
into the workshop um MCP is very new for us we just launched a preview Um but
15:21
we've been avidly working on this for quite some time. Um but yeah, you can
15:26
kind of see where we've modeled the MCP server also as a client. Um and yes,
15:32
there are cases where agent is a client talking to MCP server which is also a client talking to upstream APIs. So um
15:40
and that's that's actually what I'm going to show today. Um but yes, the the flow is quite similar and we'll talk
15:46
more about MCP semantics and um you know how we've implemented dynamic client
15:51
registration and um kind of what we have here. Uh these are totally from our
15:58
teammates. So just trying to pick our favorite slides. Um and yeah um as far as the workshop uh
16:06
I think we're planning to just kind of highle high note each section. Um, if
16:12
you don't want to work through it, that's okay. You can follow along. If you want to work through it and you're more hands-on, um, that's fine, too. Um,
16:20
and yeah, we really truly appreciate all your feedback. We do have time at the end for questions and all kinds of
16:26
feedback. So, um, we would love that. And, um, yeah, this is what we are building, um, today. Um,
16:33
basically, we are building an agent Nex.js app. Um what's nice about Vcel's
16:39
platform, right, is we can build MCP tools alongside our agent in the same
16:44
infrastructure quickly. We can then use the agent client to communicate with the
16:50
MCP server and then leverage the MCP server to talk to third parties. So um
16:55
that's really powerful and you know it's secure and it's easy to build. um you
17:01
know we we feel quite good about several areas of this the security stack there
17:06
but yeah I think this is kind of the the rough idea like a lot of typical flows
17:12
you might see um you know in the industry um yeah so uh I'm going to yeah
17:20
so we can pull it up and get going uh so let's see uh yeah hopefully everybody is
17:26
able to capture the link Um and
17:32
all right. Uh so yeah. Yeah. Well, while while Patrick is um showing and kind of doing the workshop,
17:39
um I'll be available for anyone has a question or uh a problem with with the
17:45
workshop itself. Just raise your hand. I will approach you. Awesome. Awesome.
17:53
Yeah. and then I'll do like a quick intro then kind of showcase what it does and we'll kind of step through this
17:58
journey of building that topology. Um so
18:05
yeah uh but welcome is really just around getting your dependencies and getting um a a client. Um so I guess the
18:15
first step here we we have a a root tenant an upstream IDP for you. So this
18:20
is kind of a little more of an enterprise use case. So let's say you have a a core IDP provider um that you
18:29
know you you tap into for like upstream API management or upstream identity. Um
18:35
so we have this like fictitious uh stock trade application uh which looks like
18:41
this. Um and this application basically the idea is is that you know consumers
18:48
can come here they can access a stock API they can establish identity here but
18:54
this this application also exposes a stock an API for downstream consumers and
19:00
downstream agent clients and and additional consumers. So we have a
19:05
basically a link a federated a linked access uh with our ODC connection um to
19:11
this to this tenant. Um so yeah uh so
19:17
the first part is really just um getting your um your client. Um, I already have
19:22
a client, but where you would start here is basically just um going through
19:28
Ozer's stack and getting um uh a tenant and starting to get your
19:35
client developer keys. Um so we'll add O as the as a subsequent
19:41
step, but I'll show the like the first step where we just have a really simple agent and then we're we're adding on um
19:48
identity and then authorization. Uh so so yeah these are some prerequisites
19:55
node PNP standard toys um OS CLI so we use a CLI
20:02
for a lot of CLI management of our stack it makes some things easier we use a
20:08
combination of Terraform and CLIs um in this demo um
20:14
um yeah so that's kind of the conceptual overview and some of the like major
20:19
dependencies Um, after you've created your your client and kind of signed up here, um, we've got a link to it here.
20:27
Um, you should be ready to go for spinning up your tenant. Um, but yeah, I'll talk more about that in step two.
20:34
Um, so yeah, let's start with the very beginnings here. Um, so we're in this
20:40
step, we're just we're we're building our downstream chatbot. Um, this is a
20:46
downstream application that we're just spinning up. hasn't connected to anything yet and we're adding we're
20:51
adding on this upstream provider and adding on access um with agents and with
20:57
tools. Um and so yeah uh I used OpenAI with my
21:03
agent but yeah you'll need uh an open API access key. Um this is the repo
21:10
which has the base um the base template. I'll give you a branch at the end which
21:16
has all of the changes we make in this workshop. Um
21:21
and um yeah, so let's take a look at what that looks like. Go for
21:34
agent. [Music]
21:41
Okay. Oops.
21:48
Okay. Go for it. One, two. Sure.
21:55
So, well, yes, standard uh chat box. Um so at this point when when when you
22:03
start if you try to do anything other than just regular gen AI questions you
22:11
will get just the model nothing else but um the important part is if we try to to
22:19
ask the model who who I am that's when the model then says okay I
22:24
don't know who you are I don't know what they is so I don't I know nothing.
22:31
The same for in this case this is a downstream of a trade uh app. If you try
22:38
to consume data from that trading service like again the chatbot will tell
22:43
you I know nothing. Uh so let's let's fix that. uh let's give uh the chat box
22:51
awareness uh first of the service uh and tools and then also
22:57
authentication. So let's let's authenticate and let the the agent know who who I am.
23:04
Okay. Uh so that's okay. Yeah, keep going. I'm going to apply this. So well
23:11
I will try to sing with Patrick here. Yeah. Um yeah, this is pretty standard. I
23:17
think you saw this in several workshops already just today and imagine several times in the last weeks but yeah we are
23:25
uh in the basel uh AI SDKs we will introduce the uh get stock price tool
23:32
um and later the uh authentication part.
23:38
So, let's go for the simple thing. Um, in this case, Patrick is cheating
23:43
because he has all everything stashed. Won't be that easy for you guys, but
23:50
um rest assured that uh let's run it again. Um I
23:56
was going to say rest assured all of the code that's here is is in this stash. So, you don't have to worry about that.
24:03
So, um, let's go back to the chat box and let's ask again about prices.
24:10
You guys want us to try to follow along? You're going to do an overview.
24:15
Okay. Like, am I supposed to try to keep up with what you're doing? Yeah, that's hard, right?
24:21
Yeah. Let's let's let's complete everything, right? Yeah. Okay. Yeah. Good. Good call.
24:26
You can tell it's the first time we run inspection. Great.
24:32
Pretty awesome. All right. So, let let's let's let's make an actual or let's start uh with a
24:43
um trading questions or at least get info questions about it. Okay, cool. So,
24:51
now we've got the chat box um connected to the upstream API.
24:58
Yeah, exactly. Uh in this case it's a public service. It's a public endpoint. So no authentication association was
25:03
required right let's try so let's move along.
25:08
Um there are more info in that page but
25:14
sorry. Yeah no no no it's okay. I was going to say that let's go back to the kind of important stuff.
25:19
Okay. Um all right. What happens if we want to read not
25:27
public uh data from the upstream service but personalized data so data that I as
25:33
a resource owner own in this case is we are going to use uh token board so
25:39
basically when when we logged in can you go back uh the chat box yeah yeah yeah
25:45
so so far we didn't go through any login process so there is no who I am or
25:50
anything like so it's just um anonymous uh session so far but at some point we
25:57
will log in we will log in in the uh Asian IDE
26:03
right and but that will give us a relation a trust relationship between us
26:08
and the Asian alone we need to go beyond that we need to
26:13
establish a relationship also it's kind of a a three-way thing it's us is the
26:19
upstream service and the agent so we need to establish this triangle relationship, right? And we do that we
26:26
will do that through token bot. We will uh first authenticate the agent that in
26:32
exchange well issue an ID token and an access token u an access token that
26:38
basically authorize us to use the agent alone. But we can with token bowl we can use uh once we establish the third
26:45
relationship we can use that access token to exchange to exchange it by an
26:52
upstream access token. Yeah. And that's what token does. What it does is once we
26:58
connect our upstream app, in this case the demo trade app, Alzero will start storing the refresh
27:06
token and dealing with the issuance that of
27:12
the access tokens. So we store the refresh token, we store the the access token for as long as it it until it
27:19
expires. And every time the agent needs to access this data, it runs the refresh
27:25
token uh grant to obtain a new access token and that is issued back to the
27:31
agent. So can you Yeah, that's that's more or less the the graph. Can I yeah jump to uh
27:39
so yes um you know it's also going to show just adding the basic off for your
27:45
user and and built and then adding on these these token vault requests. Um the
27:54
so SDK code here kind of walks you through like the sign up the terraform
28:00
all of the tenant setup um so that you can start to use these services, right?
28:06
so that you can access token mold so you can start using identity with providers.
28:11
Um this is a very new feature set with
28:16
some of these features. So you'll you'll notice like in some of our configuration you're enabling a connected accounts
28:23
feature with our new my account API. Um you're you know setting up grant types
28:30
for your client application, your agent application. Um, and you're configuring
28:35
your OIDC connection. Um, um, so yeah.
28:40
Um, I don't know if we want to. Let's keep moving and then we can kind of show the
28:46
tenant. Um, um, but these are kind of the steps, um,
28:51
we can apply to just add a basic identity. And yeah, I'll turn to you while I'm doing that.
28:57
Yeah, TDR, all the steps are there. uh references, links, and everything you need in case you want this to want to do
29:03
this later or at home. Uh all right. So, let's try. So, the
29:10
So, at this point, what we're going to do is bring the login button to the agent basically.
29:16
Um just kind of show what that looks like. Yeah.
29:22
So, uh route. Yeah. So, so we use ALJ SDK for Nex that provides
29:30
a middleware um not the right one. One second and a wrapper uh for our routes.
29:38
You will see. Sorry. One second. Yeah, I think it's that. Oh, it's complaining.
29:44
Sorry. Conflicts. There we go. Okay, there we go.
29:52
Yeah, a huge change. It's intimidating but it's because um it's dealing with
29:58
the connected account. I think uh we are in the process of simplifying that in the SDK
30:03
way more. Uh but yeah uh what is this? Uh so this is the next uh route for the
30:11
chat. Yeah. So we've taken the page uh that yeah has the the chat um client. Uh so
30:19
it's yeah it's just your your standard NexJS page and um yeah this is our
30:26
wrapper um which then basically forces login um or gives you a redirect.
30:33
Um yeah let's step back a yes and I'm going to add authentication to
30:39
this agent. Yes. Okay. Where does this fit in? This is an embedded agent within the
30:45
next app. So yes, this chatbot is an embedded agent. Um we'll show other
30:51
I'll tell you what I'm agent do is I have a existing deployment what additional components you're sharing
30:57
with me right now. What's my existing deployment? Yeah. And what's out of the box? Yeah. So it's really these wrappers u
31:04
from the SDK which wrap an endpoint um you know whether it's a page route or um
31:10
something else. Um so yeah and then this is pretty standard with like our next.js
31:15
JS SDK now um we established a session um so yeah I'll show login but that's
31:22
there's there's really not a lot of magic here um we are however requesting this new connected accounts to see if
31:30
you have a federated connection so that's kind of the confusing part here because like you know the old school
31:36
zero flows would not have that like you know we we wouldn't be requesting upstream providers in many cases or
31:43
other APIs Um but in this case yes we are using a federated provider and um so
31:49
yeah it's it's a little more contrived I guess um and yeah we're creating a
31:55
client there you can kind of see the OIDC options we're providing which are
32:00
you know are specific for OIDC and then um this connect account endpoint um is
32:07
is new that's going to enable our new connected accounts API um for managing all of your accounts Um
32:14
I think that's Yeah. So let me show that and kind of Yeah, go for it. Yeah.
32:20
Okay. Um so that was code. Um
32:27
I think let me restart. All right. Okay. Let's try it again.
32:32
Yeah. Run it. No, it didn't. It's it's it's there.
32:38
Awesome. So I'm gonna sign out and sign in. Yeah. So we sign out. Um so at this
32:43
point is up to you want to place a login button or whatever login UX is suits
32:50
best with with you in this case just to simplify if you try to access the URL it
32:56
will just prompt you with the login screen right away. Um so we log in now um at this point we
33:03
are well we it doesn't show but we are logging to the upstream ID. Yes. So
33:09
using just one credentials and then uh well at least uh now
33:16
uh it knows that I've got a session uh and who I am.
33:22
Let's see. Yeah. Awesome. So it got the profile from the
33:28
IDP. It load that to the context. Yeah. So now it knows who we are.
33:34
Yeah. And in this fictitious application like this is also the same identity
33:39
that's uh I'm sorry that's linked with the the stock trader uh sorry
33:47
yeah this dashboard. So so yeah your identities are now linked between you
33:52
know these applications you're using an upstream provider and you'll also see shortly that they'll be linked with your
33:59
MCP tools as well. So, okay.
34:04
So, we've got identity for we've got login. Um, we've got an embedded agent running locally. Um,
34:12
um, what else do we want to talk about in this step? Are we ready to go on? Okay. So, it knows who I am, but it
34:19
doesn't know what I own. What What is that? It doesn't have access to the
34:25
trading service resources that I own in. So if you go back to the
34:31
uh demonstrated app one sec. Uh yeah this one. Yes. So my balance is 10k.
34:39
I've got these recent orders. Yeah. Uh so on so forth. So how can we give
34:45
the agent access to all this data? Yeah. So all right. So the first step is as we said earlier
34:53
we need to connect the two accounts. So even if we are using the same credentials, we still
35:00
didn't say explicitly or the a user didn't set the explicitly to the agent,
35:06
hey I I know I I want you to know who I am, but I didn't give you permissions to
35:12
access my account yet. So that's the step you are doing. We are connected the account. So that's when we prompt the
35:18
user with these extra permissions that the agent needs, these extra scopes, right? And that's when the relationships
35:26
is established. Uh so now the agent knows that uh I have access to this
35:32
account with that exact permissions. Nothing more, nothing else.
35:37
Yeah. Yep. And yeah. Yeah. So next I think it's just adding
35:43
some tools which can now leverage this account. Um so I'm going to jump into
35:50
portfolio tools. Um, and this is getting into that token exchange and um, yeah, now we can start
35:58
to ask more pertinent queries, right? We can say, can you view my portfolio? Um,
36:04
and uh, yeah, we're not going to give you access yet to create orders. That'll be uh, the next pieces. Um but yes uh
36:13
this kind of shows how our SDK kind of models getting an access token for
36:19
another connection upstream. Um how to how to leverage shared tools and
36:26
TypeScript. Um I think what's really nice here is that these tools can be versatile. They can be shared between
36:32
whether it's an agent tool or an MCP tool. Um hopefully your framework has you know TypeScript support. Um that's
36:40
also a really nice uh capability tool organization. Um so yeah let yeah
36:48
if you want to keep going I'm going to add the the tools. Awesome. So the same as the same the
36:54
first step we did we are going to load a uh well to give the agent a new tool. So
37:01
far local tools we will get to we will get to into the MCP part later but uh it
37:09
is a native tool that it does a simple um HTTP request to the service but uh
37:16
the tool will have a
37:22
so we can show yeah sorry so one of the other things that we provide in our SDKs is how we connect
37:30
this tool uh with the authentication part and the authentication part. Yeah.
37:36
Use the the tools basically again. Yeah. So So can you show
37:42
the code tool? Yeah. Yeah. No, the tool again the code tool.
37:47
Uh you show the this one tools or the the get portfolio tool.
37:53
Oh yeah. Go in uh Yeah.
38:01
Sorry. Yeah. So at some point we have we create uh
38:09
with with a client and in the handler.
38:14
Yeah. What is that call? So yeah it's just a a get with a include
38:21
history you know query pram option optional uh addition there. um pretty
38:28
straightforward API call once you have a client and a token. Um but yeah, this the sweet sauce
38:35
is the you know we can now leverage this get access token for connection really
38:40
easily on our SDK. Um so yeah let me show that if you want to
38:45
yeah it's everything is summarized on this slide that's what I wanted to show. Uh so our SDK provides this you provide
38:53
the connection in this case that's the upstream name that is represented in in
38:58
your tenant uh and that's what does all the dance with the top
39:04
there I'll say can you show my portfolio sorry
39:12
so yeah um all right so we've got an agent with access to our
39:18
data now so he knows who I am but also has access to what I am
39:24
has digital access. Well, it's up to you obviously that the tool implemented but
39:30
at least yeah I already know exactly what we have. Okay. Okay.
39:36
So, so we have portfolio tools uh which is great. Um
39:44
I didn't show the scopes but uh yeah rest assured that like I must
39:49
show the MCP server really quickly. So kind of what we've scaffolded and modeled. Um and this may help with some
39:56
of the questions but the um yeah here's the MCP server which we've we've modeled
40:02
as an API. Um and we have you know scopes around accessing the MCP server.
40:09
um we've kind of modeled those the same way as our as our upstream um API. So
40:15
let's see permissions. Um we've got scopes around reading trades, reading
40:21
our portfolio. Um and yeah, those are referenced in in those tools in the meta. Um that wasn't abundantly clear,
40:29
but um yes, we are representing those as like scoped permissions. Um how do you create these permissions?
40:36
Yes. The keyword trade and portfolio these are very application specific.
40:41
Yes. Yes. Yes. So how would it know what they are mean in the context of the application?
40:48
You want to take that one? What do you mean? So this app is a stock trading app. So
40:55
the word trade and portfolio will have very specific meaning here. Yes. Yes. But I could have another app where the
41:01
word trade or the word portfolio maybe it's like a project management app. Portfolio would mean something else.
41:08
Yeah. But so so how does it identify the meaning of the permission?
41:14
That's taking it. Yeah, I can. So uh yes, I think I understand but at the end of
41:20
the day is the upstream service that sets the rules, right? So if you want to access my my my resources, I need an
41:28
access token with this scope. Otherwise, I would reject your request. And it doesn't it doesn't matter if
41:34
you're an agent or even a just traditional REST API client. And that rel that you as an implementer of the
41:41
agent, you know that in advance. You know if you are connected to an upstream, you know what's the shape of
41:47
the request and what's the authorization layer that I need to implement. You can model your scopes as you want in your
41:54
local tenant but at the end of the day the translation the scopes to the upstream should be done. So you can you
42:02
can tell where do I do that? It's in the connection. Yeah. When you define the connection.
42:09
Yeah. Yeah. So the the enterprise connection here to our upstream is here. And yeah,
42:17
you can kind of see we're requesting those scopes from the upstream tenant and it also in this case like has those
42:25
scopes modeled around the stock API. So exactly. Yeah. So these scopes I'm getting from that
42:31
from the from the service. Yes. So this comes out most likely publicly available or it's something
42:36
that is part of the contract between you and the upstream and that's exactly what the user will
42:42
see on on the prom that you saw at the moment that they connect the account. Exactly. So we are here for to simplify we use
42:50
the same names but it could be different it could be different scopes have it's
42:55
the translation happens on top of both. Yeah. Yeah. And um yeah, I should also
43:01
worth mentioning like we model roles differently, right? like around you know personas or other identities scopes are
43:09
really around API access right so if you're looking to kind of model more around a role um yeah definitely check
43:16
out FDA um we have role based access controls which you can apply around tools as well or around pages but this
43:23
is more just you know fine grained uh access around an API um so all right
43:30
let's keep going and this is new yes Yeah, a lot of this is very new.
43:36
Connections has been around for forever, but the purpose and actually that's the
43:42
name we chose. Uh the purpose of a connection uh we create a new one which is talking
43:48
mode. All right, we're still doing pretty good on time, but yeah, it's okay. Ready to jump in MCP. So
43:54
yes, um any questions so far? Kind of switching topics here. I I wanted to ask
44:00
similar to your question the scopes will be available you get them from the well-known oids like a
44:07
hard common way to get these right and you can publicly fetch them and then
44:13
yes yes yes yes exactly um so yeah that's you've jumped right into the next flow and
44:20
uh yeah so we are trying to implement the current spec with MCP now and that's
44:25
kind of the next part of this exercise is adding the well-known protected resource metadata endpoint. Um and um
44:34
yeah, so we've been testing this with a lot of providers uh recently and recently we just EA our DCR uh feature
44:41
like this week. So um but yeah, that this flow is a little more involved,
44:47
right? Because the the MCP server becomes um you know a client of the
44:53
agent. Um and we're kind of we're going to show kind of how we modeled that in the Verscell code. Um um and you can see
45:00
like you know all of the steps there's you know obviously more involved but
45:05
it's you know it's important because we're actually securing MCP resources
45:11
and tools and kind of doing it in a granular way but also enabling dynamic
45:17
registration um with many providers. Um so yeah we'll
45:23
showcase that towards the end here. Um yeah, I can probably fire this up if you
45:29
want. Um kind of see if there's So this kind of show maybe I'll talk through a little bit of this. This kind of shows some of the middleware
45:36
um and how we apply like scope verification on the MCP server itself
45:42
and how we expose metadata. So yeah, that's exactly what you're alluding to is like we we advertise the supported
45:50
scopes um when you go to register um in that part of the flow and then
45:57
um yeah further down I think it's in the transport when we actually construct
46:03
uh so yeah this is just more helpers so it's like you know creating middleware
46:08
to verify a JWT we're still you know still a beer token um public private key
46:15
encryption. Um but yeah, we we reference those libraries. We have a lot of shared
46:21
libraries for doing these things now. Um and then um yeah, it another important
46:28
mention here is this is where we introduced this custom API client. Um maybe I can show so this is a separate
46:35
client that we've modeled in this uh demonstration. You could really create
46:40
any number of API clients if you want to model them, you know, more independently
46:46
or how you want to build your stack. But, um, yeah, we've modeled this as a a linked client, which is also a new
46:52
feature, not zero. Um, so now we can actually link APIs to clients and model
46:58
them as basically you can think of them as, you know, an agent client or an MCP
47:04
server client. So, um, so that's a really nice new feature. um those are
47:09
now linked and um we have API support for those as well. Um so yeah you can
47:16
see like constructing an API client with the MCP server client ID and secret. Um
47:24
and yeah I'll run that in just a second. I want to see if this so this is again
47:30
like monitoring these shared tools. So we've we've taken this like stock tool portfolio tool from the agent over to
47:38
the MCP server now. So we can expose it from there as well. Um and then you know
47:44
the registration of the tools. Um and then yeah this is where we create
47:49
the transport right. So this is where we create this MCP's endpoint and
47:54
construct the server and um yeah that that's where we invoke our middleware
47:59
and so yeah let me show that and um yeah if you want to add anything else feel
48:05
free yeah so in in this case to an attempt to to show the whole journey we decided to
48:12
create the NCP as part of this workshop but it could also be that you
48:18
get your upstream NCP not that you are building an NCP but you still need to
48:24
authorize to that right so in in in both cases association works
48:30
so it's not that we wanted to show both ends uh so that's why there's so many so
48:35
so much code in in that page it's just because uh part of it is is the actual
48:40
MCP server so I've unstashed all the changes in
48:46
this that I just showed and Um yes like this is basically uh what's going to
48:53
give us the MCP tools. Um so um yeah I will start this.
49:01
All right. Um [Applause]
49:06
so yeah we made the changes to the client. So in this case in this the same
49:11
nextGS server that the agent is running is where the MCP is served. But it's up
49:17
to you which as your architecture but same same concept apply.
49:22
Yeah. So I'm gonna say yes go. Yeah.
49:28
So if you go back to the chat UI, can you can you do a prompt injection to
49:33
tell that now my connection have a different scope and
49:40
so you can try that but it will take a no effect because the fact that you are
49:46
asking scopes that are not part of the connection would be either ignored or rejected.
49:52
So so basically just ignore that. Yeah, it depends on the the upstream, but
49:57
yeah. Yeah. So, the scopes that are not part, correct me if I'm wrong, Patrick, but
50:03
scopes that are not part of the connection can never end up in the access token.
50:09
That's correct. That's right. Right. So, I think our policy most of the times is just ignore what we don't
50:15
recognize. So, you just you will get an access token with valid scopes, but not the one
50:20
you try to inject.
50:25
Okay. And also I don't think now that you mentioned I don't think we expose
50:34
the out part to the LM meaning we expose the tool and we grab the tool but the
50:41
authorization happened before the tool execution. So I don't think the LM will have any
50:46
influence in what exactly. But I'm not saying it's not possible because there are many ways to do many things.
50:56
But either way, even in our end, anything that we don't recognize
51:02
shouldn't end up in an access token. Because you mean that the OP will
51:08
actually recognize what connections you have before it pass your instruction
51:14
over to LM to execute. Is that right? Yes. So you when you go Jio try to
51:20
execute the tool. So the tool will say okay I need an access token because I need to do an API call. So it's our
51:26
grapper or our SDK tools that provide this access token to the tool. It's not
51:32
the tool on command to the end the to from the LLM that runs the authorization
51:38
request. It's it's let me say it's just oldfashioned code. It's not LLM code.
51:46
Okay. So uh now I'm going to show kind of step for step the DCR. Um so yeah
51:52
it's our I'm using MCP inspector and common tool. Um and we'll show some
51:58
others but um yeah this will kind of just show now we can actually target
52:03
that MCP server directly you know running on the same server under /mcp
52:09
now. Um so yeah and this will show our o flow and DCR happening. So I'm going to
52:14
hit continue. disclaimer, open DCR is a thing. Yeah.
52:21
But in as in early access and I don't think we will Yeah.
52:27
There are some concerns about how this will scale. Yes.
52:32
Um but there are other aspects coming uh that I think fit better in
52:38
in this scenario. Absolutely. I agree. Uh but yeah, you can see the protected
52:45
resource metadata coming back. So we have the well-known endpoint. Um you can see the scope supported and then we make
52:52
a request to the authorization server. Um that returns more information about our tenant. Um and you know additional
53:01
scopes how to authorize. Um so yeah, I'm going to jump through that. And then we
53:06
get a registration call. Um, so now we're going to get a new client just for
53:12
testing purposes with the MCP server. Um, so yeah, now we're going to get um
53:19
believe this is PKCE. It's our authorization code flow with proof key code exchange. Um, so yeah, it's
53:25
standard on zero flow, but it's also works well with with MCP. Um, so I'm
53:31
going to copy this.
53:36
Uh, okay. So, yeah, now it's going to prompt
53:42
me and give me an authorization code.
53:55
And at the end of the line here, we should get an access token. So, which is
54:00
great. So now we can access the MCP server with these scopes from from anywhere, right? That's the great thing.
54:07
So uh so now I'm going to hit connect and let's see if we can get some tools.
54:13
Uh yeah. So yes, so now we have access to our
54:19
portfolio and um you know our our identity tools kind of accessing um the
54:25
same upstream stock API. Um, so yeah. Um,
54:31
you want to add anything here, Carlos, before we go further? Oh, any question?
54:38
Yeah. Sorry, I'll ask at the end. Yeah.
54:45
Sure. All right. Okay. So, um, yeah, this is really the
54:51
most involved part of this flow. Um I'm going to show the claude. Uh so I've
54:58
actually deployed it if you want to play around. Uh and um yeah, so um that's that's really
55:07
the most involved part with MCPA rather. Um um yeah, I think we're hitting time.
55:14
So let's go into the async goth. That's all right. All right. Okay. Um go for it.
55:20
Do you mind still um driving the the coding so I can
55:28
All right. So we said that earlier the fact that the agent has access to our
55:34
resources it doesn't mean that you should do anything in any time without
55:39
my supervision. Right? I said this all the time. We don't want an hallucinating agent buying a stock in
55:47
the middle of the night without my permission. What's wrong with that?
55:53
Yeah. So that's where part of our uh the bundle is provide a
56:02
simple way and a seamless way to the agent to reach out the user and get
56:08
their approval for risky operation. In this case, we consider place an order
56:15
either buy or sell a risky operation. It's something that we as a developers of the agent define. It's up to us. Um
56:25
so in this case what we are going to do is we are we will bring um the create
56:32
order tool but with some conditions. Yes. So D conditions would be that
56:38
before running the create order tool we will call uh back channel O that's the
56:44
the SDK name for for the O uh sync
56:49
we will obtain an access token that contains exactly what the user is so let
56:55
me let me go step uh backward so we will create this request to back channel with
57:01
the detail with the details of the transaction in this case it will be exactly
57:06
the symbol I'm I'm buying or selling quantity and the price for the user to
57:13
see that in their screen most likely out of plan device see that and approve that
57:20
and only when that is approved we will place the order. Yeah.
57:26
Yeah. for that in this in this case in this sample we will use guardian is our
57:32
uh mfa uh application is is out of the box application you can use you can
57:37
install and use um but also we support guardian SDK in case you want to
57:42
implement your own um I'll show the user
57:47
yeah so to for the agent to be able to reach out
57:54
the user in for this channel in particular, the user needs to be enrolled on MFA.
58:00
There are several mechanisms to do that uh just for for for the workshop. We show you kind of the back door of it,
58:07
but it depends on the UIX how you it could be in sign up. It could be like a
58:12
step up kind of thing. I don't know. It's up to uh to you. But we need to to
58:18
enroll. So you will find this is in the docs but you will find a way to send an email that contains all the instructions
58:24
to enroll. So once we enroll we will we can we can
58:30
add this uh little helper here uh that just basically forwards the uh
58:36
off to the to our SDK. All right, let me undo and reapply here. Yeah. Am I going faster than you?
58:43
No, it's Yeah, it's perfect. Sorry. Catching up. All right. Um
58:48
uh one sec. Okay. So in a second I will show you exactly what we are going to send in
58:55
this authorization. Um so we can see
59:02
so I think it was in a zero we add the yeah so here is the uh this
59:09
is the helper. It's just a wrapper just for wrap the errors and I'll test it. But basically it's again this this line
59:17
of code in our SDK is what we sent and what will run all these steps
59:22
internally. Show the tool. It will keep um it will wait for the user response. So it's basically an an
59:31
sync uh operation and when the user responds the agent can resume. Oh,
59:36
sorry. It's in uh it's in tools. This one. Uh yeah, this one.
59:43
So, yeah. So, here we we're creating a new client with uh you
59:50
know, so we're specifying like what we need in the authorization details. So, we can provide that rich authorization
59:57
request detail when the authorization request comes in. um we're you know
1:00:04
we're using this custom API client in this case that we've already created you could create others but yes we're
1:00:10
creating a custom API client to then perform the back channel request um and
1:00:16
then uh yeah it in this case it waits you could do a number of things you could pull you could
1:00:23
there's other mechanisms here but yes in this case for simplicity sake we wait for the verification so let me give this
1:00:30
a All right. Yeah. So, okay. So, we run the client again. Uh,
1:00:37
sorry, the chat box agent. So, we'll go back to here.
1:00:43
All right. And so, now we can ask to I don't know place an order
1:00:51
of what is it? Wayne. Wayne. Yeah. For example,
1:00:58
fictitious stocks. Yeah. So in this case, yeah, go ahead. I have this question about the code. I
1:01:03
don't know if all this code is checked in. I'm not sure. Do you have branches? Uh yes. Yes. Yes. Uh yes, I'm happy to
1:01:10
share that towards uh towards the Do you want me to share it now or later? I just follow Yes, we do have a
1:01:17
final state branch. Yes. Um in this case, the agent is instructed
1:01:22
to inform the user that this is going to happen. So this is not yet the
1:01:27
authorization request. is just heads up that hey you're going to receive a push notification
1:01:34
is is okay it's just a really silly system
1:01:39
um so you can proceed then yeah waiting hang on
1:01:45
um one minute here should be connected
1:01:50
let's see one a minute you run this like
1:01:58
Uh, turn that off. Oh, because you're hot. And
1:02:05
let's see. Let me try again. Let's see. Yeah. Refresh and try again. Refresh.
1:02:17
Apart from push notifications, we also support email as a random note. Um, and
1:02:23
more channels. We we will be implementing more channels to reach out there.
1:02:29
Yeah, maybe I need to restart the application server is if I have
1:02:37
can I just pre-authorize certain users in in your engine like
1:02:45
yeah I I mean I guess it's up to you how you manage this session with your agent this no yeah I want to make sure no one else
1:02:52
can engage like with the same agent You mean? Yeah. Or like can I can I get can I can
1:02:59
I be able to pre-authorize the agent for certain access but also for preauthorize
1:03:04
who can use the agent for access. Just trying to understand what are the different use cases around that.
1:03:11
Um yeah but this is kind of up to you how you kind of the how you manage your
1:03:17
sessions and permissions to access the app as a resource. Okay. Uh but once you establish that
1:03:23
it's just you can you can establish any policy that you want at the end. I don't
1:03:29
I don't know if I'm following the we can we can chat later but I approved it. So yeah I had to
1:03:36
reconnect here on this network. So okay uh let me try one more time.
1:03:44
It did come in in this example for this agent. It's saying okay basically the we the agent
1:03:50
is asking if if it's allowed to go to that website. So I just want to make sure that the the agent is filled with
1:03:58
that website but no other websites. That's what I meant about pre authentication authorization. But when
1:04:05
you say website, you say the the service or certain APIs or certain tools
1:04:11
just trying to see what if anything can be done as it because right now the application is happening as interactive.
1:04:19
Yes. So I'm just saying can it be enough? Okay. I see. Yeah. Yeah. So
1:04:24
this is how I I see I not access person. No no I understand I understand now. I
1:04:31
understand now. So yeah, I I had similar concerns. I'm I'm not in product, sorry.
1:04:36
But um yeah, so imagine that your interface is not a chat box. It's like a task runner kind of thing.
1:04:43
Exactly. So I guess in what I would implement as an engineer is I would attach my
1:04:48
identity or at least an identifier of the user, the subject to that task in my database. So I I enter the agent, I set
1:04:56
up a task and I say, "Okay, I want to I don't know, find me a good deal or or
1:05:03
advise me or buy Wayne stocks when it's below 70." It could be a task, right? I think that
1:05:09
task is modeled in your system, right? It has to be modeled somehow. I don't know if it's prompt and ID of the user
1:05:17
and that thing that's when you establish that. And we use the user that is the
1:05:22
subject is what we use to identify if the user has a connection to that account
1:05:28
you know so I need this account this user to have this connected this
1:05:34
I understand and then I will only create a sensitive identity for the agent because I want to
1:05:40
differentiate if the connection is coming from an agent or coming from the user but that's that's the thing you are in
1:05:46
in our uh because the event is an agent performing the the the request to the
1:05:54
service behalf is in my behalf. what I need but I want to know but but I want to differentiate though
1:06:00
because if an agent goes wrong I want to know the agent goes wrong right so I want to know yeah you can you can
1:06:07
yes so in that case because the agent is the client your access token will have an author authorizing party that's a
1:06:14
claim identify not not the user but who is
1:06:21
who the user is delegating the access to and that's where you can say okay This
1:06:26
is my ID as an agent. This is my subject. So I can know exactly okay this
1:06:31
agent is acting on behalf of this user and you can ruin any policy on that that you need.
1:06:36
Yeah. That's all that's nothing new. It's been it's been around forever.
1:06:42
No, but now I understand. I understand. Yes. So um yeah I wanted to show kind of logs
1:06:48
and also just uh we did show the exchange in the last example for
1:06:54
accessing the portfolio but this is the actual async siba exchange uh which is
1:06:59
slightly different in our logs but I think it also kind of ties it together really well. Um and it shows you know
1:07:06
I'm going to show like what an actual token payloaded looks like. again fictitious and these tokens are
1:07:14
not going to give you much. So this is the details I was talking about. Um we use an extension of it's
1:07:21
reach authorization request is a it's in a specification and basically we can
1:07:26
describe exactly what the user is giving consent to. Yeah. uh and that gets recorded in the
1:07:33
accessory. In a real scenario, most likely the
1:07:38
resource server will want to verify that. Uh but yeah, that that's up to the the
1:07:45
stack that out of our but yeah, I'll show the uh notification to so
1:07:51
yeah, it looks like so yeah, that's what it looked like on my phone actually when I actually connected it to the network and I got a slew of notifications.
1:08:00
One of the challenges with uh rich associations request is that the object is reported. You can put anything you
1:08:07
want. Um and that complicates thing in terms of rendering that request. To
1:08:14
solve that, we created an schema. Uh so we we support an on schema. is flexible
1:08:21
enough to give you any opportunity to display anything but is known and we can
1:08:30
it helps for our app in our case but also in your apps if you are developing yours to to render this dynamically. So
1:08:37
our garden app is able to render any details um and yeah we provide this
1:08:43
schema for you. All right, cool. We're good. All right.
1:08:48
Awesome. So, that's a little bit about our new asynchronous authorization
1:08:55
features. Um, last piece and then kind of open up more for discussion and yeah, I know we'll
1:09:02
have a little bit of time, but um I just want to quickly show and kind of preface with like some of the integrations which
1:09:07
we are testing. This is very beta and shipped very recently. But um yeah, this
1:09:14
is using that DCR flow. Um I'm kind of showing how again how we did it with um
1:09:21
with the inspector, but also with cloud code or with uh the chat uh I'm sorry,
1:09:27
the open API app SDK. Um so this just kind of I'm not going to do this now. We're short on time, but obviously like
1:09:33
we can you know we can deploy this to Burcell. Um I'm using an upstach database uh varus database for handling
1:09:41
the state um on on the MCP server side. Um
1:09:47
and yeah you you can get running pretty quickly on on versell. So you can you know you can take this agent and this
1:09:52
MCP server and start sharing you know these tools. Uh bring your tools right
1:09:58
anywhere. So um um yeah. So, I'm going to show um I
1:10:05
guess just I've got a deployment that I mentioned earlier. I'll target that and
1:10:10
uh I'll I'll DCR with my deployment. Ironically, it's also linked to the same
1:10:15
identity provider. So, I'll get back my same information. Um which is nice. Uh
1:10:21
and then um I'll show kind of how um in cloud code this works. Um I'm going to
1:10:28
skip over chat uh GPT app SDK. There is there is an integration that is starting
1:10:34
to work here. Um there's some configurations needed. So reach out and let's talk uh if you
1:10:41
need this today. Um but yeah, it'll be pretty much readily available in you
1:10:47
know the very near future. So we we do have some integrations today um that we've we've tested. Um but yes, there's
1:10:54
this kind of gives you a rough overview of like how you could quickly bring those tools to J GPT. Um um
1:11:04
so yeah, I'm gonna gloss through that. This is just me showing like oh yes, I've connected it in GPT and I can
1:11:10
access my tools there. Um um yeah, let me go ahead and while if
1:11:16
you want to talk a little bit more of that, I will show kind of uh getting a new a new client with the with my
1:11:23
deployed instance and then integrating it in cloud code.
1:11:28
So yeah, just this is just to showcase that the the client the MCP client
1:11:36
should also run the same policies all policies that so all clients should run
1:11:41
the same uh so should identify authenticate me and author and the
1:11:47
authorization the same authorization policy should happen. So in this case um we embedded the MCP as part of the
1:11:53
server but um well in this case Patrick deployed that
1:12:00
for us. Uh so yeah disconnect same same thing we did before
1:12:07
um in this case this is an production issue.
1:12:12
Yeah same as you can see it's asking for my authentication.
1:12:18
Okay. and it got an access token with the scopes that we requested.
1:12:24
All right. So now we're going to pull up claude and uh
1:12:30
and yeah, we can just jump into uh cloud cut uh give it the MCP.
1:12:37
So yep, I got a command in the read me here that's in the final.
1:12:42
All right. So uh and then yeah, I need to replace the token. I'll save. So in this case, I
1:12:49
am going to use my inspectors token and claude does support authentication.
1:12:56
However, there is an open issue right now about specifying scopes. Uh so yeah,
1:13:01
I'm just going to use my inspector's access token. Um but yeah, you'll see
1:13:07
you'll see that with Claude and then Claude will still initiate. Let me show that. Unfortunately, the spec is pretty
1:13:14
new and not all the clients implemented the same way. Um,
1:13:20
yeah. So, yeah, that's um I expect that to stabilize advantages.
1:13:26
There's no like copy in this tool, is there? No. Okay.
1:13:32
Okay. Once again, my my token is not going to do you much. These are fictitious uh
1:13:41
trains. All right. Okay. So, yeah, same same thing as before. We can start asking about
1:13:47
what we got in the in the app service. Uh what happened?
1:13:54
It's connected. Is it connected? Okay. Oh, okay. So, let me res sometimes I have to restart it. I
1:14:01
don't know why. Okay. Now, let's see. No. Huh.
1:14:08
Yeah. Let me try once more here. That did not work. I'm sure. Yeah, I'm
1:14:16
not seeing it. Okay. Clawed ad.
1:14:22
Yeah, it looked like it was there.
1:14:29
Let's see.
1:14:39
[Applause] In the meantime, more questions.
1:14:44
Yeah, you had a question before. Uh, yeah, I I think I get the perview
1:14:50
when you're a zero customer. Maybe the context here if you're building an app for let's say your consumers or
1:14:57
something, then maybe this whole flow will be applicable. I'm thinking but if you are an octa uh
1:15:04
tenant you're using octa in your workspace how do the two work together
1:15:10
or do is this thing also going to be available on the opta side no I think the idea that got me I'm
1:15:18
going to I don't know exactly so 100% but what I think it is is we are going
1:15:24
to create some sort of bridge um that you can apply the the the same policies
1:15:30
as octa as an employee to agents and restrict those accesses to those
1:15:36
services as you would do with that employee that's where I is that your question more or less
1:15:43
kind of yeah but also how how the two systems are going to work together because
1:15:48
this seems like a feature of zero which is my understand
1:15:54
yeah it is it is a separate part but um as far as I know
1:16:01
work together on on protests. Um, but yeah, we can we can connect
1:16:07
later if you want. I can dig into dogs. Yeah, most likely us.
1:16:13
[Music] [Applause] Yeah. Not sure what I'm doing wrong
1:16:20
here. Uh, do you need to do the
1:16:27
uh let's see this this cloud command you don't you have to run it outside cloud session
1:16:33
maybe in the terminal. Oh, in the terminal. Okay. Yeah, let's try that.
1:16:39
Anything else? Yeah. Uh so it seems like if I were deploying an agent, one way I can start
1:16:45
is just to use the user's token on behalf of who the agent is acting as the
1:16:50
token for the agent themselves. So what do you feel like is the advantage of existing agent identity? What are the
1:16:56
the features that have? So when you say I can just pass so you authenticate the user and just forward
1:17:03
the access token to the agent somehow or that's that don't do that please. So the
1:17:09
access tokens are meant to first it will be in terms of operability it will be
1:17:15
cumbersome because access tokens will expire eventually. So at some point you will need to reach out the user again
1:17:21
okay login and do all the dance again. So how autonomous your agent will be in
1:17:27
that scenario. Um so that's kind of what we try to solve. So we establish that connection,
1:17:34
that relationship and we take care of this nasty complex part of refreshing
1:17:39
tokens, storing tokens um and and yeah all the scope step up
1:17:45
things like that. Okay, so finally got it working here. Some of the interactions I might make
1:17:51
with the agent are through say the the chat assistant and so whenever the agent is taking action, I'm
1:17:59
initiating an action, right? Or Not necessarily as as for example the example we were talking about before.
1:18:05
Imagine like a taskr runner kind of thing. You log in, you have the identity, you have a like a kind of
1:18:12
traditional dashboard where you list your connectable apps, Slack, Gmail, uh
1:18:19
Google calendar, whatever. And the user does that once, just once. So once the these are
1:18:26
connected you can you give the Asian client well not not double quot is the
1:18:33
Asian client access to those apps. So every time so the user next time that connects to the
1:18:38
chat that's it. You don't need to run all this thing again. It's it's already done. It's it's the
1:18:45
relationship has been established already. So the user will open the chat
1:18:50
again. You don't need to do all this connecting scopes, prompts, consent screens. That's it. That's done.
1:18:59
Eventually, it can die. It depends on the policy of your upstream. The refresh tokens may expire. In that case, yes,
1:19:06
you will need to deal with, oh, you need to reload again. You do that once and that's it.
1:19:15
Yeah. So, just an update. Was they finally able to have syntax or my version of cloud, I guess. But um yeah
1:19:21
was able to off and kind of show went through the authenticate screen and um
1:19:27
yeah now I can access my same tools in a deployed instance. Um you can do this
1:19:32
with several providers now, right? Um all of which
1:19:38
any which support uh D as as Carlos was saying like any which support DCR static
1:19:44
client or preconfigured clients um and then yeah soon to be client ID metadata
1:19:49
is the next uh spec I believe that's going to be implemented. Um, so yeah,
1:19:56
you'll have a lot of options to to register new clients, new agents, um,
1:20:02
and access your tools. Um, uh, yeah, I don't know if there's anything else we turn back to.
1:20:09
Questions? Okay, I think that's it. Um, questions and
1:20:14
feedback, whatever. Um, please reach out or Yeah. I know I the guy I showed in your
1:20:22
workshop, but to his question, is there a a later branch?
1:20:28
Yes. Yes, absolutely. And let me push that to his repository and let me show my final
1:20:35
state now. And yeah, I'll pull that up and link it here. Also,
1:20:42
the live demo and build a lot for the first time. Yeah, for the first
1:20:48
time with a major release this week was like we just shipped this like two days ago. So, but yeah.
1:20:57
All right. Okay. Uh but yeah, the final state is in my branch here. Finish
1:21:05
finish state. Uh that should have all the applied changes and I think I've like tweaked uh one of the like order
1:21:12
history tools, but it's it's pretty straightforward. Um there's some other tools that are implemented there, but
1:21:18
yeah, it's it's up to you what you want to implement there. Um but yeah, can I
1:21:24
let's see I don't know if I can I can link this in the notes after and um we'll make sure that you have this uh
1:21:30
I'll probably actually push it to our our upstream workshop branch. So, and yeah,
1:21:36
just little disclaimer, the workshop app, well, it can suffer some
1:21:42
disruptions uh as we uh develop more things. So, yeah, take that into
1:21:47
consideration. All right. All right. Awesome. Thank you.
1:21:55
[Music]
1:22:11
Heat.
