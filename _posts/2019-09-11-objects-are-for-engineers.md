---
layout: post
title: "Objects Are For Engineers"
date: 2019-09-11
tags: oop thoughts
author: amihaiemil
comments: true
shareable: true
preview: I often hear complaints that an object-oriented codebase will be harder to learn, since
 it's hard to see through "all that object graph and abstractions". I think it's true, but I don't
 necessarily see it a problem.
image: https://amihaiemil.github.io/images/designs_on_jerry2.PNG
---

Most developers can agree that clean code means, among others, easy understanding of the architecture and the business logic of the application in general.
The easier it is to read the code and quickly understand what's going on, the better. I've even heard people say that, ideally, even your grandmother (who presumably has no clue about programming)
should be able to read your code and tell what's going on.

While the above sounds more or less logical, I don't agree with it. As you would expect, the most common complaint I hear about OOP is that "it's hard to see through
all those abstractions and visualize the graph of objects" -- it's a fair argument and, in this post, I'll try to explain why I don't think that is a problem.

<figure class="articleimg">
 <img src="{{page.image}}" alt="Designs on Jerry">
 <figcaption>
 Tom & Jerry - Designs on Jerry, by  William Hanna and Joseph Barbera
 </figcaption>
</figure>

First of all, let's agree on who should understand what. I think almost anybody should understand the "finite product" (I'm talking about code here): that is,
almost anyone who has experience in coding should understand the central point of your application, the place where you put [all the components together](https://amihaiemil.github.io/2019/06/12/hide-it-all.html).
In that place, a high-level overview of your app's functionality and logic should be visible.

However, your objects' implementations, what lays "under the hood" may not be so easy to understand at a first glance -- the only people who should really know all the details are
the ones working on the Product and the architect who designed it all.

Pay attention: I'm not saying you should deliberately make your code hard to understand. What I am trying to say is that, **by default**, abstraction and encapsulation mean a bigger effort in understanding the details and that this is both
a **natural** and a **good** thing.

Why is it a natural thing? Well, I guess it's obvious: more layers of abstraction means logic is more hidden. Let's look at it from a different perspective: it's the work of a team of **engineers**, who struggled to create puzzles and components that, in the end, make up the product. Do we claim that anyone should understand how a car works in detail? Or does anyone claim that anyone should immediately understand how a highway or a house were built? Of course not. Best case scenario, one just looks at it and understands the big picture -- the rest is up to engineers to understand and fix when broken. It's the way it should be: you want your car properly fixed or enhanced? Take it to service or, depending on complexity, to its original producer. Is there a problem with a highway or a building? Call the construction company to fix it.

How much trust would we have in the products or the infrastructure we use if we knew they were designed so that any junior can get into it and start making big changes? Not so much. So, why do we treat Software any differently?
Good software is, again, the product of engineers and therefore it should be up to them to work with its "insides", make the best design decisions in the interest of the Product and not in the interest of whoever may want to work on it.

Why is it all a good thing? In a word: **safety**. Such a product will easily be extendable: the design will tell you if what you want to do fits or not. It will be testable, having each and every component (object) decoupled and replaceable. Bugs will be visible much quicker: break the implementation of an interface and immediately its unit tests and also other integration tests should fail (I'd expect a test coverage of at least 80%!) etc.

What about new people? No matter what, employee turnover is a thing and there will be new developers working on the application. I wouldn't worry about them since they'll easily be able to
start small: implement an interface, fix a method whose unit test is failing etc. As I said above, the Product itself will tell them what they can do and what not until eventually they learn it all. Again, these people should have an engineer's mindset!

To conclude, let me give you another idea: the only difference I see between a real-world engineer and a software one is the **environment** in which they work: the former works with real, palpable stuff, while the latter works in a virtual Universe --
I think it's safe to say that the "best preactices" (decoupling, abstraction, reusability, testability etc) stay exactly the same even though they are probably expressed in different terms. What is sad in nowadays mainstream OOP, is that
we, programmers, treat these best practices with in shallow manner: we just cast some models and then proceed to literally translate the business requirements into Java controllers and services which are nothing more than bags of algorithms -- we take very little time to do
any actual engineering work.
