---
layout: post
title: "New Project Checklist"
date: 2019-05-12
tags: opensource devops
author: amihaiemil
comments: true
shareable: true
preview: A brief description of how I kick-start all my opensource
 projects.
image: https://amihaiemil.github.io/images/truce_hurts2.PNG
---

After a few years of contributing to opensource and developing [a few](https://amihaiemil.github.io/projects.html) projects myself, I think I found a pretty good recipe for starting a new project. This post illustrates the first steps that I always take when opening
a new repository and also a bit of how I usually work on it. I hope it will be helpful to anyone who doesn't know how or is a little afraid to start their own project.

<figure class="articleimg">
 <img src="{{page.image}}" alt="The Truce Hurts">
 <figcaption>
 Tom & Jerry - The Truce Hurts, by  William Hanna and Joseph Barbera
 </figcaption>
</figure>

### Repo Creation

First, I create a repository. Nothing fancy here, I do it all from the Github UI. However, there's 3 points I'm always paying attention to:

* Licence! Depending on your goals, you might need a different type of [licence](https://opensource.org/licenses). At the moment, I am only interested in the "author recognition" and "no liability" clauses. For that, I use the [BSD-3 Clause](https://opensource.org/licenses/BSD-3-Clause) licence everywhere. Be sure to also copy the licence text at the beginning of all the source code files.

* .gitignore: Be sure to ignore all the project's meta-files like IDE-specific settings, build directories and so on. My projects are all Java so I specify there everything that has to do with Eclipse, Netbeans, IntelliJ, Maven etc.

* README: Write an elegant "readme" from the start. It will help you see the goals more clearly and give you a boost of confidence even if the project is still just in your head!

### CI/CD

The very next thing I do is set up the CI/CD pipeline. This consists of two products:

* Travis CI: [Travis](https://travis-ci.org/) is a well-known product, you probably know about it. After linking the repo via Travis' UI, I always create the ``.travis.yml`` file, specifying exactly what the build commands will look like (example [here](https://github.com/amihaiemil/docker-java-api/blob/master/.travis.yml)). Then, Travis will just trigger a build with any new Pull Request (and subsequent commits) always telling me if the new changes are breaking the project or not.

* Rultor: I use [rultor](http://www.rultor.com/) in all my projects. Nobody writes in the master  branch, ever, and nobody merges any PR manually. Rultor will merge it for us when we tell it to. Before merging it, it will also build the project inside a dedicated Docker container -- it acts as a second layer of CI, if you will.

  It also helps me [automate](https://amihaiemil.github.io/2018/09/30/project-versioning-with-rultor.html) the releasing and versioning of all my projects. All my deliverables are published to Maven Central (which is quite a complex process) and this great product makes sure that weight is not on my shoulders! [Here](https://www.yegor256.com/tag/rultor) are more posts about it, if you are curious.

### Quality Gates

Besides the manual code-review made for each Pull Request, there are 2 instruments I use for automated quality check:

* Checkstyle: [Checkstyle](http://checkstyle.sourceforge.net/) is a static code analyzer. It runs as part of each build via a Maven Plugin (see [here](https://github.com/amihaiemil/docker-java-api/blob/master/pom.xml#L134)) and enforces some rules in the code. They can go from stuff as simple as line length to stuff such as class coupling. All the rules are specified in the [checkstyle.xml](https://github.com/amihaiemil/docker-java-api/blob/master/checkstyle.xml) file present in all my projects.

* Code Coverage: I always check to see if the PR doesn't decrease the code coverage. Usually, I don't accept PR's that are decreasing the coverage. I use [Jacoco](https://www.eclemma.org/jacoco/) for generating the coverage report and [Coveralls](https://coveralls.io/) for reading and displaying it as a repo badge. The Coveralls bot will usually comment right in the PR indicating the latest status. It all happens via a Maven plugins as well (see [here](https://github.com/amihaiemil/docker-java-api/blob/master/pom.xml#L110)).

### Turn TODOs Into Actual Tasks

As you probably know, I like to break my tasks into small chunks (30min each). This is a methodology called [Puzzle-Driven-Development](https://www.yegor256.com/2010/03/04/pdd.html) of which I made a short analysis [a while back](https://www.amihaiemil.com/2017/03/22/puzzles-and-open-source.html). Basically, after I finish part of the task and make sure the codebase works fine, I will leave a ``TODO`` in the code, which we call a "puzzle". This ``TODO`` is actually the next task in the project and we should have a new Github Issue opened as soon as it reaches the ``master`` branch.

For this automation, I use [0pdd](http://www.0pdd.com), a bot that will scan my codebase at each push to ``master`` and open/close Github Issue when it finds that a puzzle has been added or removed from the code. See an example [here](https://github.com/amihaiemil/docker-java-api/issues/184).
<br>

---

<br>

This is pretty much it, I would say. I do these steps so often that I've actually considered automating everything somehow (although the husstle is not that big). I'll make sure to keep this list updated if I come up with something new. What do you think? Would you add something to it?
