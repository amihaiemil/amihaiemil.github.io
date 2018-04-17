---
layout: post
title: "Dolls and Maquettes"
date: 2018-04-17
tags: oop
author: amihaiemil
comments: true
shareable: true
preview: Yet another metaphor about the harm that JavaBeans are causing
 in object oriented software.
image: https://amihaiemil.github.io/images/designs_on_jerry.PNG
---

I've already written quite a few posts about why I don't consider JavaBeans real objects. For instance, I think we agreed [here](/2017/09/01/data-should-be-animated-not-represented.html) and [here](/2017/11/04/but-how-do-you-work-without-a-model.html) that model objects are mere
syntax sugar and we might as well not have them at all, they are useless abstractions that do
not offer any functionality.

Nevertheless, let's try one more time, this time through a little metaphor
and some imagination. Yes, I believe that, in order to be good OOP programmers, we need imagination and the ability to visualise how objects are working together, something a little more than UML diagrams.

<figure class="articleimg">
 <img src="{{page.image}}" alt="Designs On Jerry">
 <figcaption>
 Tom & Jerry - Designs On Jerry, by  William Hanna and Joseph Barbera
 </figcaption>
</figure>

One more way we can look at model objects is the following: they are either **dolls** (``User``, ``Student``, ``Partner`` etc) or **maquettes** (``Car``, ``Phone``, ``Book`` etc). Question is, how can we work with them, how do they help us solve any problem? The answer is simple: we can do nothing with them and they don't help us in any way other than offering some readability! They just sit around, waiting for some helper method or WhateverService class to do something with them, our job being to design that method and that service, procedural code that hopefully will manage to do something with them. We are the ones working to accommodate the models.

But why can't *they* work for us? Why can't we design them so they *move*, thus liberating us from the burden of having to cater for them, having to write all those procedures *for* them? With this mindset, we won't sit around trying to fix a 500 LoC method, or trying to figure out how to test that Service class. Instead, our work will be much more like the one of an engineer: we will have to design, implement, test and fix objects, not procedures, not spaghetti code.

Here is how I see it: a software developer and an engineer are given the same task, they each have to build a ``Car``. The engineer will build a real ``Car`` which will actually move, accelerate etc. On the other hand, the software developer will just look at the requirement, cast a model of a ``Car`` and then proceed to build all sorts of tools *around* that model, that would make it move and gain some speed... I personally imagine a room filled with beams and strings attached to the lifeless model. Also, there would probably be a lever that would have to be operated by someone in order for the "car" to do something -- all those beams, strings and the lever are the helper methods and service classes from an application's code.

The comparison may sound crazy but that's what it is: mainstream OOP just gave people the tools necessary to put a label on their data while letting them maintain their procedural way of thinking. Instead, real object orientation is a complete switch of mindset: you go from the position of the manual worker to the position of the engineer who makes objects that actually solve issues, automate something.

So how can we begin writing such code? Well, the first step is to understand that any proper object must have an interface. I've written about that as well, but let me reiterate a few reasons:

  * The interface is *what* the object is and can do. If it has no interface then it has no rules, no identity, no capabilities, it is just a bag of procedures;
  * With an interface, we can decorate the object;
  * We can have multiple implementations of it. It is easier to see that, instead of struggling (i.e. having some procedures) to convert X to Y, we should add a new implementation of Y based on X;
  * We can mock an interface, or have Fake implementations;
  etc.

Furthermore we should think about the **behaviour** more than anything else. If we have a ``Student`` and we give them a grade, that grade should instantly be visible everywhere it needs to be. We should be able to trust that the object will do its job as expected, no need to design a puppet that we would modify and then pass around for everyone to look at and do their job with:

{% highlight java %}
  //This is it, grade is given and it already made its effect everywhere
  this.student.grade(10);

  //as opposed to this:
  this.student.setGrade(10);
  this.service.updateRegistry(student);

{% endhighlight %}

It is a complex process and, unfortunately, it is not easy to implement applications entirely in this fashion (certainly not big ones) simply because all the frameworks out there are based on the concept of "model". We would probably have to reimplement everything from scratch. However, I believe it is still a big improvement if we implement at least the core of the application in an object oriented manner and let only the boundaries be procedural.
