---
layout: post
title: "Puzzles And Open Source"
date: 2017-03-22
tags: pdd oop opensource
author: amihaiemil
comments: true
shareable: true
preview: An overview of how we developed an opensource Java library using PDD
image: https://amihaiemil.github.io/images/tee_for_two.PNG
---

After working with [Teamed](http://www.teamed.io/) and practicing [PDD](http://www.yegor256.com/2009/03/04/pdd.html)
for more than a year, I was wondering how the methodology would work with a fresh project. I had never worked on
a new project in this way and, honestly, I was having some doubts.

I decided to look for [contributors](https://amihaiemil.github.io/2016/12/22/contributors-wanted.html) and
start a new project. Two programmers responded rather quickly: one from Russia, the other from Egypt.
We started working on an object-oriented java library for [Yaml](http://yaml.org/).

In this post, I'll give you a brief overview on how long it took us to [release](https://github.com/decorators-squad/camel/issues/94)
the first version.

<figure class="articleimg">
 <img src="{{page.image}}" alt="Tee for Two">
 <figcaption>
 Tom & Jerry - Tee for Two, by  William Hanna and Joseph Barbera (from <a target="_blank" href="http://tomandjerrycaps.blogspot.co.at/2012/08/tee-for-two.html">here</a>)
 </figcaption>
</figure>

First, I set up the [repository](https://github.com/decorators-squad/camel) with all
its boilerplate stuff: Travis, Coveralls and Rultor for CI and DevOps, [0pdd](http://www.0pdd.com/) for
managing puzzles -- all free of charge. And, or course, the Maven project layout with [checkstyle](http://checkstyle.sourceforge.net/)
for build-time code analysis. I spent about **2 hours** doing all this.

Second, I spent a total of about **8 hours** writing the skeleton project with its
core architecture.

Third, actual puzzles started showing up and being resolved by the contributors. I think [this](https://github.com/decorators-squad/camel/issues/11)
was the first one (all the previous issues were opened by me to track the scaffolding work).

How long did it take to release v. ``1.0.0``? The first commit ([c9b1a5e](https://github.com/decorators-squad/camel/commit/c9b1a5efcb476f9c24f0eb2350ffdfda5a13ec71))
was done on ``28.12.2016`` and the first version reached Maven Central on ``20.03.2017``: 3 months.
The actual time worked (man-hours spent) is ``41 x 30min = 20.5 hours``:  you see, there are [41 pull requests](https://github.com/decorators-squad/camel/pulls?utf8=%E2%9C%93&q=is%3Apr%20is%3Aclosed%20updated%3A%3C2017-03-20)
before ``20.03.2017``, each representing a solved task (puzzle) with average estimation of ``30min``.
However, there are a few tasks with estimation of ``1 hour``, plus a few more commits done without a PR, so let's round that up to
**25 hours**. And also, let's add **7 hours** (41 x 10min), time spent on code review.

Draw the line, add the bolded numbers and you get **42 hours**. In this time, a stable version of the project
was released with code quality and test coverage guaranteed by two layers of CI and build-time static analysis check, all run for each
PR, as well as code review. None of that time was spent on calls, meetings or chats.
Actually, I have never seen or heard the developers I was working with (well, apart from their Github avatars).

Just think about it: 42 man-hours for a component reusable in any Java project.
And all is enabled by PDD and the fact that the project is open source. Give this project in the hands of a traditional,
"agile", outsourcing company and I bet the effort would come up at least double because:

  + there are meetings to be held, so that everyone understands the full scope of this outstanding project
  + there is time to be spent on making opaque estimations
  + there is time to be spent on sessions of training for new programmers because, in order to implement a method
  and a unit test, one must absolutely know every detail of the project
  + finally, somwhere in-between, there's also some coding to be done
  + probably no proper CI, because Joe forgot to set up a Jenkins job for the project
  and now this stays in a feared backlog of tasks.

I hope the advantages are clear, even though I did not mention all of them directly.
Now, of course, this might not be so straightforward for a big enterprise project and besides,
such a project could never be open-sourced.
But keep in mind that you can always pull out components which you could develop in this manner.
If your team tells you otherwise, they clearly haven't given enough thought on the architecture.

So, I urge you to consider applying this methodology. I truly believe this should be the next step if we want
to stop wasting our time and start delivering software of higher quality.
