---
layout: post
title: "Java API For Docker"
buttons: <a class="github-button" href="https://github.com/amihaiemil/docker-java-api" data-icon="octicon-star" data-count-href="/amihaiemil/docker-java-api/stargazers" data-count-api="/repos/amihaiemil/docker-java-api#stargazers_count" data-count-aria-label="# stargazers on GitHub" aria-label="Star amihaiemil/docker-java-api on GitHub">Star</a> <a class="github-button" href="https://github.com/amihaiemil/docker-java-api/fork" data-icon="octicon-repo-forked" data-count-href="/opencharles/charles/network" data-count-api="/repos//amihaiemil/docker-java-api#forks_count" data-count-aria-label="# forks on GitHub" aria-label="Fork amihaiemil/docker-java-api on GitHub">Fork</a>
date: 2018-03-10
tags: oop java design
author: amihaiemil
comments: true
shareable: true
preview: A proper, object oriented, Java library that encapsulates the calls
 to Docker's API.
<<<<<<< HEAD
image: https://amihaiemil.github.io/images/triplet_trouble.png
=======
image: https://amihaiemil.github.io/images/old_rockin_chair_tom.png
>>>>>>> master
---

If you use [Docker](https://docs.docker.com/engine/docker-overview/), you should know that it has a client-server architecture. There is the ``docker`` command line tool, which sends all the commands (``build``, ``pull``, ``run`` etc) to the Docker Host's API; the command line tool is just an elegant wrapper so you don't have to make raw HTTP calls yourself.

<<<<<<< HEAD
This architecture gives a very convenient decoupling. For instance, you can instruct the ``docker`` client to send commands to a remote Docker Daemon, not the one from localhost. Even more, thanks to this architecture, all softs of software can integrate with Docker, which is exactly what [comdor](http://www.comdor.co), one of my projects, is doing. However, I hit a show stopper and its development is currently on-hold, waiting for [docker-java-api](https://github.com/amihaiemil/docker-java-api)'s first version to be released.

<figure class="articleimg">
 <img src="{{page.image}}" alt="Triplet Trouble">
 <figcaption>
 Tom & Jerry - Triplet Trouble, by  William Hanna and Joseph Barbera
=======
This architecture gives a very convenient decoupling. For instance, you can instruct the ``docker`` client to send commands to a remote Docker Daemon, not the one from localhost. Even more, thanks to this architecture, all sorts of software can integrate with Docker, which is exactly what [comdor](http://www.comdor.co), one of my projects, is doing. However, I hit a show stopper and its development is currently on-hold, waiting for [docker-java-api](https://github.com/amihaiemil/docker-java-api)'s first version to be released.

<figure class="articleimg">
 <img src="{{page.image}}" alt="Old Rockin Chair Tom">
 <figcaption>
 Tom & Jerry - Old Rockin Chair Tom, by  William Hanna and Joseph Barbera
>>>>>>> master
 </figcaption>
</figure>

There are already two Java implementations of the ``docker`` client: [docker-java/docker-java](https://github.com/docker-java/docker-java) and [spotify/docker-client](https://github.com/spotify/docker-client), so why another one?

**First reason** is that none of them is object oriented. They are not actually APIs, they are SDKs. From my point of view, the difference between an SDK and an API is the following: an SDK is a set of classes/tools which the user has to put together to create something; an API, on the other hand, is supposed to be a set of interfaces over an already built system which should be fluent and intuitive -- ideally, I should be able to learn Docker by using a Java wrapper just as easily as I can learn Docker by playing with the command-line client.

<<<<<<< HEAD
The two libraries above are SDKs because they have almost zero encapsulation, the user has to know how to put those tools together in order to implement ``docker`` in Java. For instance, in those libraries, I have no idea where a ``Port`` and ``ExposedPort`` object are supposed to go, or what is even the difference between them. There are also classes such as ``HostConfig`` and ``PortBinding``.

Let me ask you a question: when you first started using Docker (or any application out there, for that matter), did it ask you to provide any ports, bindings, contexts etc? No, you just pressed a button, or ran a command, you used an **interface**. Of course, depending on the complexity of the system, you may have the option to tune it up, change some configs etc, but these are supposed to be advanced options, not stuff that you would have to do in most of the use cases.

So, bottom line is that they are not very usable. I want to access Docker from Java, not to build/assemble Docker in Java -- I hope you feel the difference.

**The second reason** (and this was actually the show-stopper) that made me decide to write a new one, is that both of them seem to be a mess of dependencies. They even warn you that they may cause classpath issues (they both bring in Jersey 2.x implementation which apparently is incompatible with Jersey 1.x) -- this caused problems in my project, since it's Java EE, I couldn't even deploy the application on Glassfish, it caused some very strange exceptions. I tried all sorts of workarounds, including [shading of dependencies](https://maven.apache.org/plugins/maven-shade-plugin/), nothing seemed to work.
=======
The two libraries above are SDKs because they have almost zero encapsulation, the user has to know how to put those tools together in order to implement ``docker`` in Java. For instance, in those libraries, I have no idea where objects of type ``Port`` or ``ExposedPort`` are supposed to go, or what is the difference between them. There are also classes such as ``HostConfig`` and ``PortBinding``.

Let me ask you a question: when you first started using Docker (or any application out there, for that matter), did it ask you to provide any ports, bindings or service contexts? No, you just pressed a button, or ran a command, you used an **interface**. Of course, depending on the complexity of the system, you may have the option to tune it up, change some configs etc, but these are supposed to be advanced options, not stuff that you have to do in most of the use cases.

Bottom line is that they are not very usable. I want to access Docker from Java, not to build/assemble Docker in Java -- I hope you feel the difference.

**The second reason** (and this was actually the show-stopper) that made me decide to write a new one, is that both of them seem to be very "fat". They even warn you that they may cause classpath issues (they both bring in Jersey 2.x implementation which apparently is incompatible with Jersey 1.x) -- this caused problems in my project, since it's Java EE, I couldn't even deploy the application on Glassfish, it caused some very strange exceptions. I tried all sorts of workarounds, including [shading of dependencies](https://maven.apache.org/plugins/maven-shade-plugin/), nothing seemed to work.
>>>>>>> master

So, I made the decision to build my own Java wrapper one which should be:

  * as fluent and intuitive as possible
  * encapsulated -- ideally, only two public classes, everything else is hidden behind Java interfaces
  * as few Builders as possible
  * clean, its dependencies should be clear and cause no conflicts with other Java platforms or frameworks

It is still in its early stage so I can only give some hints about how it should work:

{% highlight java %}
<<<<<<< HEAD
  Docker docker = new LocalDocker("unix:///var/run/docker.sock");
  docker.containers().create(
=======
  final Docker docker = new LocalDocker("unix:///var/run/docker.sock");
  final Container created = docker.containers().create(
>>>>>>> master
    Json.createObjectBuilder()//JSON payload for creating a Container.
        .add(..., ...)
        .build()
  );
  final Container container = docker.containers().get("containerId");
  //...
{% endhighlight %}

Above is how you would communicate with the local Docker Daemon. What is interesting is that we
have to implement HTTP calls over a unix socket. For Unix sockets in Java, [this](https://github.com/jnr/jnr-unixsocket) project is used, and the created ``Socket`` is passed on to Apache HttpClient.

Here is how you would do it with a remote Docker Host:

{% highlight java %}
  final Docker docker = new RemoteDocker(
    "tcp://123.34.65.232:1234",
    "/path/to/ssl/certs"
  );
  final Container created = docker.containers().create(
    Json.createObjectBuilder()
        .add(..., ...)
        .build()
  );
  final Container existing = docker.containers().get("containerId");
  //...
{% endhighlight %}

This one has simple HttpClient behind, no Unix Sockets, however, we have to make sure it uses those certificates properly in order to encrypt the communication entirely.

You see, the user works only with interfaces. It is fluent and no dubious config objects or ports are required -- at least not for first usage, maybe we could decorate these implementations somehow, to give more tune-up power to the user.

Furthermore, it should be integrated with the language as much as possible. For instance, this is
how I would like to iterate over all the containers:

{% highlight java %}
  final Docker docker = new RemoteDocker(
    "tcp://123.34.65.232:1234",
    "/path/to/ssl/certs"
  );
  final Containers containers = docker.containers();
  for(final Container container : containers) {
    //Containers is the entry point of the Containers API
    //and also implements Iterable<Container>
  }
{% endhighlight %}


What do you think? Does this seem like a better alternative? If yes, feel free to contribute. The
project is also managed via [Zerocracy](http://www.zerocracy.com) so it's a good way of earning reputation points on the platform.
