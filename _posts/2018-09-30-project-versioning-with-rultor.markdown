---
layout: post
title: "Project Versioning With Rultor"
date: 2018-09-30
tags: devops ci/cd
author: amihaiemil
comments: true
shareable: true
preview: A brief explanation about how my projects are versioned.
image: https://amihaiemil.github.io/images/mouse_cleaning2.png
---

All of my projects, libraries or applications, are published on Maven Central. In case you
don't know how that works, I'll tell you in short: it's [a nightmare](https://maven.apache.org/repository/guide-central-repository-upload.html).

Of course, I had to go through those steps one or two times but then I realised I might as well let [Rultor](http://www.rultor.com/) do all that work for me since I was already using it in order to keep
the master branch read-only and automate the merging of Pull Requests. [Here](https://www.yegor256.com/2014/08/19/how-to-release-to-maven-central.html) is how the release process can be automated elegantly -- I followed pretty much the same steps.

<figure class="articleimg">
 <img src="{{page.image}}" alt="Mouse Cleaning">
 <figcaption>
 Tom & Jerry - Mouse Cleaning, by  William Hanna and Joseph Barbera
 </figcaption>
</figure>

Now, when it comes to versioning, I use the classic ``x.y.z`` scheme: incrementing ``z`` means the release is containing mostly bugfixes and small features, incrementing ``y`` means that it's containing some big features and incrementing ``x`` means that the release is not backwards compatible with the previous ones. Naturally, I want the coordinates in my repo to be automatically updated (for instance, if the new version is ``0.0.3``, the version in ``pom.xml`` should become ``0.0.4-SNAPSHOT``, the next development iteration).

While Rultor can build and send the artifact to Maven Central, as well as create a tag ("release") in the Github repo, it has absolutely no idea about the actual versioning rules. This means that the version in  ``pom.xml`` and any other links or coordinates to your artifacts are not updated.

After a few hours of work and successfully crashing Rultor once (sorry about that), I came up with the [following](https://github.com/amihaiemil/docker-java-api/blob/master/rcfg.sh) script which I use in all of my projects. It does a few essential things:

* It performs the actual mvn build, specifically with the ``release`` profile. This is actually the step when the artifacts are sent to Maven Central.
* It sets the next development version in ``pom.xml``
* It updates the ``<dependency>`` specified in the README.md
* It updates the link to the fat jar, which is usually specified just bellow it.

This way, I can be sure that the latest release is referenced automatically wherever it's needed and there are no stale/old links. What took the most work in writing this script was figuring out how exactly rultor builds my release (on which branch) and how/when does it commit and push the changes to Github. Afterwards, I just specified the ``rcfg.sh`` file as a "release script" in [.rultor.yml](https://github.com/amihaiemil/docker-java-api/blob/master/.rultor.yml#L18) and it worked like a charm.
