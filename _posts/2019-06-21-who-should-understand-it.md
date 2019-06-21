---
layout: post
title: "Who Should Understand It?"
date: 2019-06-21
tags: oop
author: amihaiemil
comments: true
shareable: true
preview: I often hear complaints that an object-oriented codebase will be harder to learn, since
 it's hard to see through "all that object graph and abstractions". I think it's true, but I don't
 necessarily see it a problem.
image: https://amihaiemil.github.io/images/two_little_indians2.PNG
---

Most developers can agree that clean code means, among others, easy understanding of the architecture and the business logic of the application in general.
The easier it is to read the code and quickly understand what's going on, the better. I've even heard people say that, ideally, even your grandmother (who presumably has no clue about programming)
should be able to read your code and tell what's going on.

While the above sounds more or less logical, I don't agree with it. As you would expect, the most common complaint I hear about OOP is that it's hard "see through 
all those abstractions and visualize the graph of objects" -- it's a fair argument and, in this post, I'll try to explain why I don't think that is a problem. 

<figure class="articleimg">
 <img src="{{page.image}}" alt="Two Little Indians">
 <figcaption>
 Tom & Jerry - Two Little Indians, by  William Hanna and Joseph Barbera
 </figcaption>
</figure>

First of all, let's agree on who should understand what. I think almost anybody should understand the "finite product" (I'm talking about code here): that is,
almost anyone who has experience in coding should understand the central point of your application, the place where you put [all the components together](https://amihaiemil.github.io/2019/06/12/hide-it-all.html).
In that place, a high-level overview of your app's functionality and logic should be visible.

However, on the ther hand, not everyone should understand what is "under the hood" at the first glance. Not your grandmother, not the new intern or freshly graduate developer, maybe not even
your senior colleagues working on other products. The ones who should understand the deeper abstractions and details, how everything works together, are only you, your team-mates and, of course, the architect who designed it all.
Furthermore, even if one spends more time studying it, they should still have good OOP knowledge in order to see the details -- I'd dare to say they should be **engineers**.

Pay attention: I'm not saying you should deliberately make your code hard to understand. What I am trying to say is that, **by default**, abstraction and encapsulation mean a bigger effort in understanding the details and that this is both
a **natural** and a **good** thing.

Why is it a natural thing? Well, I guess it's obvious: more layers of abstraction means logic is more hidden. Let's look at it from a different perspective: it's the work of a team of **engineers**,
who struggled to create puzzles and components that, in the end, make up the product. Do we claim that everyone should understand how a car works in detail? Or does anyone claim that you should
immediately understand how a highway or a house was built? Of course not. Best case scenario, you just look at it and understand the big picture -- the rest is up to engineers to understand and fix when broken.
It's the way it should be: you want your car properly fixed or enhanced? Take it to service or, depending on complexity, to its original producer. Is there a serious problem with a highway or a building? Call the construction company to fix it.

How much trust would we have in the products or the infrastructure we use if we knew they were designed so that any junior or new hire can get into it and start making big changes? Not so much. So, why do we treat Software any differently?
Good software is, again, the product of engineers and therefore, it should be up to them to work with its "insides", make the best design decisions in the interest of the Product and not in the interest of whoever may want to work on it.

Why is it all a good thing? In a word: **safety**. Such a product will easily be extendable: the design will tell you if what you want to do fits or not. It will be testable, having each and every component (object)
decoupled and replaceable. Bugs will be visible much quicker: break the implementation of an interface and immediately its unit tests and also other integration tests should fail (I'd expect a test coverage of at least 80%!) etc.

What about new people? No matter what, employee turnover is a thing and there will be new developers working on the application. And we just agreed that not even experienced programmers should be required to figure out everything immediately.
Does it mean a decrease in productivity? Well, the way I see it, you do not need to know the whole picture in order to work with an Object.
They can be productive since the first day, starting with smaller tasks such as fixing a method or implementing a new interface (again, they don't really need to know who will use it, it's their standalone piece of work).
On the other hand, if the code is not OOP but rather a procedural [puppet-show](https://amihaiemil.github.io/2018/04/17/dolls-and-maquettes.html), the productivity is clearly decreased: first, spend some time in meetings and don't even think about touching the code, because who knows
what that public static method is doing, or why that same method was protected in the previous git commit. Later, start working on it and simply add functionality wherever it seems better, until you get to the conclusion that the algorithm
is too big and start extracting private methods to create more semantic -- I think what I mean is quite clear: it shouldn't be up to the developer's taste what and where should fit; it should be up to the Product itself.

To conclude, let me give you another idea: the only difference I see between a real-world engineer and a software one is the **environment** in which they work: the former works with real, palpable stuff, while the latter works in a virtual Universe --
I think it's safe to say that the "best preactices" (decoupling, abstraction, reusability, testability etc) stay exactly the same even though they are probably expressed in different terms. What is sad in nowadays mainstream OOP, is that
we, programmers, treat these best practices with in shallow manner: we just cast some models and then proceed to literally translate the business requirements into Java controllers and services which are nothing more than bags of algorithms -- we take very little time to do
any actual engineering work.