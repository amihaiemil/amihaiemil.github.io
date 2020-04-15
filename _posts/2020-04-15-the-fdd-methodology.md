---
layout: post
title: "The FDD Methodology"
date: 2020-04-15
tags: thoughts architecture
author: amihaiemil
comments: true
shareable: true
preview: The most efficient, battle-tested, software development methodology
 that very few people actually talk about.
image: https://amihaiemil.github.io/images/hic-cup-pup.PNG
---

When it comes to software development, there are a number of well-known ways of
building a product. For some reason, all of their names follow the pattern "X Driven Development".
There is Test DD, there is Domain DD and there is Behaviour DD, to name a few.

However, nobody ever talks about the best one of them, the one that is used every day,
is battle-tested and known for producing the best-of-breed software: **Fuck It Driven Development**, also known as **FDD**.

Let's illustrate this methodology by following the key steps of building a piece of <strike>garbage</strike> software with it. We're going to use Java but, rest assured, this model works flawlessly with any language or ecosystem.

<figure class="articleimg">
 <img src="{{page.image}}" alt="Hic cup Pup">
 <figcaption>
 Tom & Jerry - Hic cup Pup, by  William Hanna and Joseph Barbera
 </figcaption>
</figure>

# Project Setup And Configuration

Java is a world of specifications and interfaces, which means your project should run on any
platform which is implementing the specs that you are using. But **fuck it**: right off the bat,
you should start by adding proprietary configuration files so your project will
not even deploy (let alone run) on a different platform than the one your company is paying a licence for.

Moreover, said configuration files should be as cryptic as possible so nobody can mess with them and ruin your application. Ideally, you also have no idea what those files are doing, you just copied them from an older project.

# Dependencies

Maven has no restrictions when it comes to the number or the compatibility of the declared dependencies. With that out of the way, **fuck it**: bring in everything that you can remember
off the top of your head, you never know when it's going to come in handy.

Your project still doesn't have a single Java class of its own, yet it already has half of Apache's Java libraries as dependencies. Out of all those dependencies, you're only going to use ``StringUtils.isBlank(...)`` but who cares? **Fuck it.**

# First API Endpoint

Now that the project is set up and only working on your machine, it's time to start writing that
elegant RESTful API. Your first endpoint is ``POST User /createOrUpdate`` -- there is no such thing in REST but **fuck it**, it'll be easier for the clients.

Validating the Input proves to be a bit difficult since Java's Bean Validation API is pretty limited. You could implement your own ConstraintValidators and add your custom annotations but why bother? **Fuck it**, just add a private boolean method with a few ``if/else`` or ``switch`` cases -- did you know ``switch`` is an [expression](https://blog.codefx.org/java/switch-expressions/) now? All the better.

# Services Integration

You need to call a third-party HTTP endpoint to read some data about your ``User``. Naturally,
you should encapsulate this part in a mockable module and only expose the necessary interfaces to your own code. You decide to **fuck it**: just pull in [Jersey Web Client](https://eclipse-ee4j.github.io/jersey.github.io/documentation/latest/client.html) and start making HTTP Requests right there, right away. Of course, you didn't really need Jersey because there are already a few other HTTP Client libraries in your classpath (see "Dependencies") -- again, **fuck it**. Don't forget to catch and silently swallow any annoying ``IOException``.

# DI and Persistence

Finally, it's time to persist your work somewhere. The persistence layer should be very well thought and implemented but, don't worry, you can **fuck it** as well. Just inject the ``javax.persistence.EntityManager`` wherever it is convenient and store your objects. Good news is, you can also work with ``org.hibernate.Session``. See which one your IDE recommends first.

To conclude, this was a short overview of the widely used FDD. One last important aspect of FDD
is that it requires **almost no tests**. Since the code is straight forward and self-documenting, tests only become a burdain to maintain.
