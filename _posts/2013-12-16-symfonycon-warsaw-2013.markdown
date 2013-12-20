---
layout: post
title: SymfonyCon Warsaw 2013 in a nutshell
tags: [symfony]
---

The first [SymfonyCon](http://warsaw2013.symfony.com/)
in Warsaw has just finished, and I must admit that was great.
Congrats to the SensioLabs team and especially
[Anne-Sophie](https://twitter.com/ansobach) for the organization.
The [venue was incredible](http://warsaw2013.symfony.com/venue)
with a [big conference room](https://twitter.com/kriswallsmith/status/411050365753507840),
and more than 600 people were attending the main talks.
First time a Symfony conference is sold out more than two weeks before the due date.

Here is an extract of the notes I took during those two days.
As usual, talks were splitted into two tracks.
So I have nothing to say for half ones, except a link to the **slides**.

*By the way, if you find a typo, feel free to [fork and edit this post](https://github.com/MattKetmo/moquet.net/blob/gh-pages/_posts/2013-12-13-symfonycon-warsaw-2013.markdown),
or [ping me on Twitter](https://twitter.com/MattKetmo).
Thank you!*

# Opening keynote

*Fabien Potencier* — [slides](https://speakerdeck.com/fabpot/symfonycon-2013-keynote)

It's a ritual, every Symfony conference starts by [fabpot](https://twitter.com/fabpot)'s keynote.
Fabien began with some statistics about famous PHP libraries around
the Symfony ecosystem, and reminded us last features of the [symfony.com](http://symfony.com)
website like the [projects page](http://symfony.com/projects),
the easy way to edit page and the [roapmap notifications](http://symfony.com/roadmap).

Then, as the Symfony "[lead merger](https://twitter.com/fabpot/status/6619944506630144)",
he spoke about his way to process pull-requests on GitHub.
He wrote a `gh` command-line with nice features like the ability to change PRs'
destination branch — you know, bug fixes must be done on the oldest
maintained branch while new features on master —, squash git commits,
update commit message with a label and add the full issue thread.
This looks to be an amazing swiss knife and I hope it will be open-sourced shortly.

Lastly, he introduces the launch of a new tool called [ubot.io](http://ubot.io)
— *edit 2013-12-18:* it has been renamed to [fabbot.io](http://fabbot.io/).
This is mainly an automatisation tool to detect typos and CS on pull-requests.
Think of it as bot combining both [stof](https://github.com/stof)
and [pborreli](https://github.com/pborreli) super powers.

Then two others speakers did a brief talk during the keynote:
[Javier Eguiluz](https://twitter.com/javiereguiluz) and [Julien Pauli](https://twitter.com/julienPauli)
who both joined SensioLabs recently.

Javier mainly spoted five ideas to improve the Symfony community via its website:

- Improve the [Symfony download experience](http://symfony.com/download)
- Unify conversations from GoogleGroup to GitHub
- Merge all less known blogs (eg. Twig, Swiftmailer) into [symfony.com/blog](http://symfony.com/blog/)
- Create new pages for communities, with members & events
- Avoid having too much bundle for one thing — this is currently a (top-secret) project
  in progress and did not expand much on this topic

Julien, the release manager of PHP 5.5 and ex-collegue from [BlaBlaCar](http://www.blablacar.com),
talked about the performance part he's going to focus on.
He's actually working on a rewrite of the Pimple library.
Some improvements had been made on the PHP code, but he's also working
on C-extensions to handle the low level parts. This is not a total rewrite of
the PHP library into a C library, but rather a hook of the slowest parts — like
does the [C-extension of Twig](http://twig.sensiolabs.org/doc/installation.html#installing-the-c-extension).


# How to automatize your infrastructure with Chef

*Grégoire Pineau* — [slides](http://lyrixx.github.io/SFCon-Warsaw2013-Automation/)

This was an interesting talk about the existing tools you can use
to automatise your deployment workflow. There are many way to deploy
an application, whether it is done from your laptop or a dedicated server.
With such tools, you avoid human errors and better focus on business values.
The keys are to deploy small changeset, deploy often, and use [feature flags](http://marc.weistroff.net/2012/01/09/simple-feature-flags-symfony2)
to deploy partially.

Several tools were mentionned:
- [Capistrano](https://github.com/capistrano/capistrano), plus [Capifony](http://capifony.org/) to deploy easily
- [Fabric](http://fabfile.org), usefull for repetitive tasks or one-shot batch command
- [Ansible](http://www.ansibleworks.com/)
- [Chef](http://www.getchef.com/chef/) and [Puppet](http://puppetlabs.com/) two (more or less equivalent) provisioning tools
- [Vagrant](http://www.vagrantup.com/) to provision virtual machines
  (don't forget [this tip](http://www.whitewashing.de/2013/08/19/speedup_symfony2_on_vagrant_boxes.html)
  when using Symfony2)

Grégoire is currently using Chef to deploy at SensioLabs.
I would like to have more concret examples but one talk wouldn't be enough.


# Diving deep into Twig

*Matthias Noback* — [slides](http://fr.slideshare.net/matthiasnoback/diving-deep-into-twig)


# Build Awesome REST APIs With Symfony2

*William Durand*, *Lukas Kahwe Smith* — [slides](https://speakerdeck.com/willdurand/build-awesome-rest-apis-with-symfony2)

Here William and Lukas showed us how to build a REST API using
some Symfony bundles and PHP libraries:

- [JMSSerializerBundle](https://github.com/schmittjoh/JMSSerializerBundle):
  a key component for serializing data into several formats
- [FOSRestBundle](https://github.com/FriendsOfSymfony/FOSRestBundle):
  like the [SensioExtraBundle](https://github.com/sensiolabs/SensioFrameworkExtraBundle/),
  it provides some nice listeners to handle data serialization on kernel view event,
  and an automatic routing generation
- [BazingaHateoasBundle](https://github.com/willdurand/BazingaHateoasBundle):
  to handle hypermedia links in response
- [HautelookTemplatedUriBundle](https://github.com/hautelook/TemplatedUriBundle)
- [NelmioApiBundle](https://github.com/nelmio/NelmioApiDocBundle):
  to automatically generate a beautiful documentation from your code
- [LiipCacheControlBundle](https://github.com/liip/liipcacheControlBundle)
- [Negotiation](https://github.com/willdurand/Negotiation):
  a content negociation library, to handle request format while not using the URI extension

If you haven't already done it, I recomand you to read William's blog post
about [doing a REST API with Symfony](http://williamdurand.fr/2012/08/02/rest-apis-with-symfony2-the-right-way/).


# Simplify your code with annotations

*Piotr Pasich* — [slides](http://fr.slideshare.net/piotrpasich/simplify-your-code-with-annotations-symfonycon-warsaw-2013)


# Increase productivity with Doctrine2 extensions

*Gediminas Morkevicius*

Gediminas is the author of the [DoctrineExtension library](https://github.com/l3pp4rd/DoctrineExtensions).
Here he talked about some features of those extensions.
Personally, I didn't really enjoy this talk.
I don't know if he did not sleep for a week,
but the intonation in his voice was quite insupportable and made me almost sleep.
Also, as I already knew the library, I didn't learn that much.


# Pitching Symfony to your Client

*John La* — [slides](http://www.funnygarbage.com/pitchSymfony)


# How Kris Writes Symfony Apps

*Kris Wallsmith* — [slides](http://fr.slideshare.net/kriswallsmith/how-kris-writessymfonyappssymfonycon)

Kris told us how he writes a Symfony application.
From a `composer create-project` to the code in a controller,
he shows all different steps he uses to do.
What I can say is that Kris loves annotations, MongoDB, thin controllers,
simple models, event listeners, and princesses.

He usually uses [JMSDiExtraBundle](https://github.com/schmittjoh/JMSDiExtraBundle)
for DIC configuration, require.js for handling sort of DIC in JavaScript,
and prefers Voters than ACL (see also [Marie's talk](#drop_ace_use_voters) about that topic).

Kris is very pleasant to listen, and even won the best speaker award.


# Symfony2 Content Management in 40 minutes

*David Buchmann* — [slides](http://davidbu.ch/slides/20131212-symfonycon-cmf.html), [code sample](https://github.com/dbu/conference-tutorial/pulls?direction=asc)


# Cool like Frontend Developer: Grunt, RequireJS, Bower and other Tools

*Ryan Weaver* —
[slides](http://www.slideshare.net/weaverryan/cool-like-frontend-developer-grunt-requirejs-bower-and-other-tools-29177248),
[code sample](https://github.com/knpuniversity/symfonycon-frontend)

Today's tools for frontend guys are lots more evolved than 5 years ago.
Here Ryan taught us — the backend guys — how powerful they can be.
He did a great introduction to [Bower](http://bower.io/), [RequireJS](http://requirejs.org/),
and [Grunt](http://gruntjs.com/), all powered by NodeJS.

A lot of (new) information has been explained in a few time.
I think that may be a lot for people who never used it before, but even
if the speech was fast, Ryan is a good teacher.

Personally, I was looking forward this talk in order to know how other people
integrate such tools in a Symfony application. I must admit I'm getting
ride of Assetic and I will spend a bit more time configuring correctly
all the asset part in my applications.
If you're curious too, look at [Ryan's code example](https://github.com/knpuniversity/symfonycon-frontend)
or even at this [Symfony Grunt Edition](https://github.com/kbond/symfony-grunt-edition)
made in the meantime by Kevin Bond.


# Community Building with Mentoring: What makes people crazy happy to work on an open source project?

*Cathy Theys* — [slides](https://github.com/YesCT/warsaw)


# Async PHP with React

*Jeremy Mikola* — [slides](https://speakerdeck.com/jmikola/async-php-with-react)

Main purpose of this talk was to demonstrate how to build an event-driven
PHP application. You may know how NodeJS works via its "Event Loop" to get
non-blocking IO.
Here Jeremy exposed the basic architecture of such asynchronous
application and the way you can do it via processus.

PHP have the socket and stream APIs, but they're not very pleasant to use.
That's where [ReactPHP](http://reactphp.org/) comes in. Keep in mind to always avoid
blocking IO when using React — which is not the default of most operations.

This was really a nice talk about async and IO vs. CPU, but sometimes a bit hard
to follow for [a friday morning](http://www.memecenter.com/fun/144660/Alcohol-is-poison).


# Symfony2 Forms: Past, Present, Future

*Bernhard Schussek* — [slides](https://speakerdeck.com/bschussek/symfony2-forms-past-present-future)


# Drop ACE, use voters

*Marie Minasyan* — [slides](http://slid.es/marieminasyan/drop-ace-use-role-voters)

Marie did a great job on teaching the different methods to implement a
security access control in a standard Symfony app.
She first showed us how the Access Control Engine can be complicated.
Then she compared with a Voter implementation, which is much easier to code and test.

For French guys, I also recommend reading this
[blog post](http://devblog.lexik.fr/non-classe/faciliter-la-gestion-des-droits-dacces-avec-les-voters-2488) from Lexik team,
or [this one](http://kriswallsmith.net/post/15994931191/symfony2-security-voters) in English from Kris Wallsmith.


# Proxy pattern in PHP

*Marco Pivetta* — [slides](http://ocramius.github.io/presentations/proxy-pattern-in-php/#/)


# Mastering the Security component's authentication mechanism

*Joseph Rouff* — [slides](https://speakerdeck.com/rouffj/mastering-the-security-components-authentication-mechanism),
[code sample](https://github.com/rouffj/HowtoSecurityBundle)

Joseph made an excellent *live tutorial* on how to create your own security system.
This talk is very educational if you haven't looked deeply into the security
component. I strongly encourage you to view the (upcoming) video — or
[this existing one](http://www.youtube.com/watch?v=eVaz_mMuDjw) in French.


# Symfony componentmponents in the wild

*Jakub Zalas* — [slides](https://speakerdeck.com/jakzal/symfony-components-in-the-wild-symfonycon-2013)


# Application monitoring with Heka and statsd

*Jordi Boggiano* — [slides](http://slides.seld.be/?file=2013-12-13+Application+monitoring+with+Heka+and+statsd.html)

Jordi started quite recently to take an interest in application & architecture monitoring.
Monitoring becomes more and more important when building complex apps with many "moving parts".
Lead developer of Composer, he presented us the tool he chose to monitor
[packagist.org](http://packagist.org).

Actually there are many tools on the market.
Each one serving a specific goal, for instance:
- System: Collectd, Cacti, Nagios, Ganglia, Munin
- Performance: Statsd, Sentry
- Error reporting: NewRelic
- Log aggregator: Graylog, Loggly, Splunk, Logstash, Syslog

It may be overkill to keep track of several tools.
That's why he chose to look at [Heka](https://github.com/mozilla-services/heka)
in order to have only one (nice) dashboard with all metrics.

Heka is like a generic middleware which will be able to read from
many inputs (eg. syslog, nginx log, app log, etc.), apply some decoders and filters,
and then write to any datastore.
For instance all logs could be stored on elasticsearch and visualized via
the [Kibana](http://demo.kibana.org/) UI.
Note that Heka can also be put on a cluster.

This project is relativly young, but in active development by Mozilla.
It worse keeping an eye on it.


# Taming Runaway Silex Apps

*Dave Marshall* — [slides](https://speakerdeck.com/davedevelopment/taming-runaway-silex-apps-symfonycon-warsaw-2013)


# Decouple your application with (Domain-)Events

*Benjamin Eberlei* — [slides](http://qafoo.com/talks/13_12_symfonycon_domain_events.pdf)

This talk was about avoiding high coupling & legacy code.
This is quite a common subject nowaday.
Each developer try to find the best solution to write clean and decoupled code.
So did Kris in [his previous talk](#how_kris_writes_symfony_apps).
Here Benjamin explained his approach using the event dispatcher.

The main difficulty is to find the right boundaries between the different
parts of your application.
You must extract the different events that can occur.
Doing "event storming" with your team can help you a lot.

Also, avoid using services from other bundles, but prefer interfaces.
Every action of your controller should have a dedicated event.
Different approaches were suggested here, each with pros and cons.


# How to build Console Applications

*Daniel Gomes* — [slides](https://speakerdeck.com/danielcsgomes/how-to-build-console-applications-symfonycon-2013)


# Lighting Talks

Lighting talks are good way to encourage developers to present their work.
There were a dizain of short speeches — less than 7 minutes each.

First talks were made par [Sylius](https://github.com/Sylius/Sylius)
and [Payum](https://github.com/Payum/Payum) lead developers.
We also have a speech about HTTP cache in ezPublish, and [Magnus](https://twitter.com/drrotmos)
showed us a way to defer a process in your Symfony app with php-fpm using
[FervoDeferredEventBundle](https://github.com/fervo/FervoDeferredEventBundle).
Regarding fabpot, he spoiled us with futur improvements on the Console component
([slides](https://speakerdeck.com/fabpot/symfonycon-2013-lightning-talk-about-the-console-in-2-dot-5)).

Second day of lighting talks has started with
[Sophie Beaupuis](https://twitter.com/so_php_ie) who made a demo
of a Zend software to easily package and deploy any PHP application.
Then Nicolas Grekas talked about the [Patchwork-UTF8](https://github.com/nicolas-grekas/Patchwork-UTF8)
library, [Marc Morera](https://twitter.com/mmoreram) introduced
the [GearmanBundle](https://github.com/mmoreram/GearmanBundle)
([slides](http://fr.slideshare.net/MarcMorera/gearman-bundle-warsaw-2013-ed)),
and David de Boer explained his strategy to invalidate HTTP cache using
[DriebitHttpCacheBundle](https://github.com/driebit/DriebitHttpCacheBundle).
By the way, he started to work on a [new FOS bundle](https://github.com/ddeboer/FOSHttpCacheBundle)
to combine both DriebitHttpCacheBundle and LiipCacheControlBundle.

[Liuggio](https://github.com/liuggio) talked about an important topic on *avoiding the monolithic*
using a decoupled, flexible and tailored architecture ([slides](http://www.slideshare.net/liuggio/leaphly-fight-monolothic-today)).
I just looked over his [website](http://welcometothebundle.com/) and saw several interessing posts.
He's also author of [Leaphly](http://leaphly.org/), a nice shopping cart for developer.

The lighting talks session has been closed by the amazing
Jeremy Mikola who spoke about… *lights*!
I can't describe his talk but that was very fun and very well played.
I hope there will be a video.


I won't talk about the award ceremony, and the hacking days which will be
covered on Symfony website. Thanks again for this huge event,
and see you next year in Madrid.
