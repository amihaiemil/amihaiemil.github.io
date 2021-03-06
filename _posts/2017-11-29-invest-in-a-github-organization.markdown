---
layout: post
title: "Invest in a Github Organization!"
date: 2017-11-29
tags: opensource
author: amihaiemil
comments: true
shareable: true
preview: I think that any software company which wants to keep up with the world
 has to be present on Github.
image: https://amihaiemil.github.io/images/jerry_and_the_goldfish.PNG
---

To start, let me say that Github is the subject here simply because they are the biggest
in the open source industry. Github has become the Facebook of software development and that is why it makes
sense to focus on it. In the future, a better platform might show up and then this article will
apply to that one.

A few years ago, OSS software was something everyone made fun of nearby the coffee
machine. The only developers who had a Github account were the ones who were willing to spend 12h a day programming,
because their company wouldn't even hear of the concept. These days, however, the sitiuation has changed dramatically.
Some of the biggest companies rely on opensource to develop their business and also to contribute back to the community.

This being the case, I believe that any decent software firm should consider investing
time and budget in maintaining an Organization on Github, a place where it should develop apps, libraries
and any packages that could be shared with the world. In this post I'm going to cover a few reasons that make me think that.

<figure class="articleimg">
 <img src="{{page.image}}" alt="Jerry And The Goldfish">
 <figcaption>
 Tom & Jerry - Jerry And The Goldfish, by  William Hanna and Joseph Barbera
 </figcaption>
</figure>

**First** reason is the fact that everything is out there. Not just logging libraries and HTTP clients, but **entire frameworks and applications**.
[React](https://github.com/facebook/react), [Angular](https://github.com/angular/angular.js), [ElasticSearch](https://github.com/elastic/elasticsearch) and many other celebrities are all open sourced. Their code is open and since almost any developer nowadays has touched these technologies, they should at least
know where their are, how to file an Issue, make a Pull Request, find solutions for bugs etc -- they will
find everything on Github: comments, guidelines, wikis, known bugs, you name it. I keep wondering: what does a closed company do when there is a bug in an OSS product that it uses?
Does it wait indefinetely for a new release, hoping that the problem will be fixed? Wouldn't it be better if it forked the repository and provided a PR?

**Second**, any tech company wishes to be **agile**, in the sense that developers should move quickly, solve bugs fast, switch frameworks and packages without hustle, setup CI/CD pieplines in a matter of minutes etc. A developer who has only worked in a strict, closed environment does not have the habit or experience to do all that. He or she won't know that ReactJs v15 has [an ugly bug](https://github.com/facebook/react/issues/7027) which causes input fields to lose characters on IE. At some point, when they become aware of it,
they'll update to v16 and spend a ridiculous amount of time trying to figure out why the ``npm`` build doesn't work anymore (that is, if they bother to check the good old Jenkins CI which has been red for weeks anyway).

By the way, the ``npm`` community is a good example of such agility. Those Javascript people are capable of rewriting an application or framework from scratch overnight, rather than fix some shady bug or deal with the messy code of the colleagues who were fired three years ago. They are that productive! Things are moving at an insane pace, everyone collaborates in the open, while you are wasting days in meetings, trying to decide which consultant to hire in order to train your team in ReactJS. Then, in one year or two (best case) React will die and you will, yet again, be left with legacy software that nobody has a clue how to maintain.

Even old, dead and buried technologies, such as [GWT](https://github.com/gwtproject/gwt), are on Github. You've probably heard of it, since it used to be the coolest toy back in 2012.
Did you know that, starting with Chrome 61, all the popups in GWT < 2.8.2 are [misplaced](https://github.com/gwtproject/gwt/issues/9542)? It's because the Chrome guys changed something regarding the way scrolled distances are calculated. There is a ton of similar tickets, since any JS library which displays popups could be affected.

The point is, you need to be in the game, you need to know how and when certain frameworks and tools (old and new),
that you are using, are being developed. Furthermore, you have to move fast, automate as much as possible, deliver daily.
I don't think you can achieve this without an OSS culture, it is not enough to shuffle the latest Software Magazine and read the newest buzzwords.

**Third**, of course, is **Marketing**. Not necessarily for the clients, but for the developers which you are looking for.
Today, everyone struggles to hire and keep developers. Let me tell you that I would trade all the Play Stations, ping-pong tables and funny pillows for the chance
of working on OSS *in my fulltime schedule*. You, as a company, will be much more appealing to software developers simply because they will see that you are interested in new technologies and how the software world spins. They will know that you are not some clueless employer which still works with mummified technologies or uses the new ones in a shallow manner.

Don't get me wrong, I am not saying that you should make your clients' code available on the internet or that you should put your billion-dollar idea on Github (although there are billion-dollar products there). Instead, you should contribute to existing projects, or publish your own components. I think we can agree that from any big project, no matter how important and confidential,
at least one generic, reusable package can be extracted -- who knows, maybe your product interacts with AWS and your team manages to implement a Java SDK for AWS that is not such a disaster as the [official one](http://www.amihaiemil.com/2017/02/18/decorators-with-tunnels.html).

To summarize, this is the gist of why I believe that OSS is mandatory for any software company which wants to survive on the long run. It should not be a burdain, but a life line.
A company can't afford to stay ignorant anymore if it wants to remain competitive and survive on the market.
