---
layout: post
title: "\"You mustn't be afraid to dream a little bigger, darling\""
date: 2018-06-12
tags: oop design
author: amihaiemil
comments: true
shareable: true
preview: It seems to me that some developers are simply afraid of abstractions
 They must know everything that's going on and that's why their code becomes
 unmaintainable.
image: https://amihaiemil.github.io/images/zoot_cat.png
---

This year, the 9th of April marked two years since I started writing this blog. Since I
missed the occasion, I want to celebrate it a little late and write about three interesting reactions that I saw some of my readers have (a FAQ post, if you wish). The comments/questions were more diverse, but these are basically what it boils down to.

By the way, the title is a quote from [a brilliant movie](https://www.imdb.com/title/tt1375666/) and is what I usually think about when I hear programmers complaining about object orientation, about abstraction!

<figure class="articleimg">
 <img src="{{page.image}}" alt="Designs On Jerry">
 <figcaption>
 Tom & Jerry - Designs On Jerry, by  William Hanna and Joseph Barbera
 </figcaption>
</figure>

I used to call the first reaction "arrogance", but maybe it's not that; maybe it's simply habit
or laziness. They usually say **"that's not how it's done"**. To them, I say simply: there is no way of doing it, there is no cook book for OOP. When it comes to object oriented programming we only have a few guidelines, some design patterns and some pathetic interview questions.

When I hear the above complaint, I always hope they mean to say that you cannot [incorporate](/2018/04/17/dolls-and-maquettes.html) the presented ideas into existing frameworks very easily. Indeed, the challenge is big, but who says you can't design a better alternative, a more object-oriented one? Never be easily impressed, always question the big players (especially them) and their solutions! Don't forget that the coolest platforms that you are [using](/2018/01/24/teach-them-the-language-first.html) every day are written by developers who are just as bored as you are and not necessarily smarter or more experienced.

The second reaction is they start yelling about design principles, most commonly **SRP**, as if their life depended on it. Understandable, design principles are good(but only if it doesn't keep you awake at night).

Joke aside, they seem to forget that SRP applies to classes, not to objects. That is, a class can very well respect it, while an object which is composed/decorated of many classes can behave in many ways. Just because there is [an interface](/2017/08/12/how-interfaces-are-refactoring-our-code.html), it doesn't mean that you will find everything behind it -- not at all, the abstraction should go further, becoming concrete only gradually.

Furthermore, I understand the Single Responsibility Principle by the definition: "A class should have only one reason to change". Taking it literally as "only one responsibility" only leads to more chaos: what is *one* responsibility? Any action/concern, no matter how big or small, can be broken down. This means that I think of it more as "Single Domain Principle" -- that is, if the class doesn't go out of its domain of expertise, it's fine. As an example, I would expect <strike>class</strike> interface ``Students`` to have methods ``best()``, ``worst()`` and others related to a class of students, and I would also expect it to be an ``Iterable<Student>``, so I can see exactly who are the pupils in my class (pay attention: the iteration logic wouldn't be in the ``Students`` implementation(s), but in some ``Iterator`` returned by the ``iterator()`` method).

Nevertheless, what I find funny is that everybody seems to throw design principles at you, but nobody seems to complain about the fact that JDK interfaces/classes such as ``List``, ``String`` and ``File`` are offering dozens of methods.

The third reaction seems to be simply fear of abstraction. "You cannot hide that", "what if this, or that"? Especially when it comes to network access: quite a few complained about hiding stuff such as HTTP calls inside Iterators. These days I also came accross a [good post](https://www.joelonsoftware.com/2002/11/11/the-law-of-leaky-abstractions/) about the dangers of abstraction.
