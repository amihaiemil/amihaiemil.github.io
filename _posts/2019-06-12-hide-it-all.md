---
layout: post
title: "Hide It All!"
date: 2019-06-12
tags: oop
author: amihaiemil
comments: true
shareable: true
preview: Object orientation is not only about decoupling views and datasources
 from "business logic". It is about hiding every detail of implementation, including
 the JDK.
image: https://amihaiemil.github.io/images/two_little_indians2.PNG
---

In an earlier [post](https://amihaiemil.github.io/2018/11/10/an-extension-to-telldontask.html), I wrote the following words:
*in an object-oriented codebase the kit should be as discrete as possible. The more you use the development kit, the less object-oriented your code really is or your abstractions are not the best they can be.*.

I feel the need to elaborate this point, since it is quite strong and that article
didn't make it enough justice.

<figure class="articleimg">
 <img src="{{page.image}}" alt="Two Little Indians">
 <figcaption>
 Tom & Jerry - Two Little Indians, by  William Hanna and Joseph Barbera
 </figcaption>
</figure>

The idea is quite simple even though, I'll admit, maybe idealistic: when looking over your codebase, I should be able to understand the application's functionalities and business logic just by looking at **your objects'** instantiations, observing how they compose and decorate each other. As I said in another post, you should hide the business logic [in plain sight](https://amihaiemil.github.io/2018/07/22/logic-should-hide-in-plain-sight.html).

This means, basically, that I should not be required to see any algorithm, Collection handling, data manipulations of any kind or calls to utility methods in order to understand what your program is supposed to be doing **and when**. All these details should be broken down into the tiniest of pieces and hidden behind interface implementations. In other words, your code should be as declarative as possible -- remember, [naming](https://amihaiemil.github.io/2018/01/07/my-take-on-object-naming.html) is one of the most important aspects.

Needless to say, this approach requires a lot of design effort, especially from the architect's side: I believe the first thing the architect should do is design the objects' **interfaces**. Ideally, he/she should deliver a skeleton project containing only Java interfaces accompanied by detailed JavaDocs explaining how the resulting objects should work together plus, maybe, a few alternative ideas for implementation. Then, it's the developers' job to provide implementations and put everything together just like a puzzle -- I'm not even going to mention that every single object should be entirely covered by tests.

The downside is, of course, that mistakes might cost much more effort, probably spent on redesigning stuff. On the other hand, such an application will be much smaller and won't ever turn into a mammoth. It will simply be easier to see what fits where, you will never have to ask yourself "where should I put this method?" or "should we just add one more method to this Service? It's already quite big". New stuff should either fit seamlessly or not at all, in which case you might consider writing a new application (yes, why not?).

Furthermore, adding a functionality should mean simply implementing an interface, and only behind this interface should you be thinking to use your development tools -- or maybe not yet, it depends how deep your abstraction is going. Coming the other way around, removing a functionality or a piece of logic should mean simply removing an object's instantiation  or decoration from somewhere and, pay attention, this should not leave any uncalled methods in your project; worst case scenario, you should have an unused **class**!

To summarise, all the above might sound strange but think of it this way: you always make sure to abstract your View and your Persistence layer from the business logic; why not go a step further and also hide the JDK away? I know, you will never have to change it but, as it is obvious, using it without full abstraction and encapsulation turns the code into a semi-OOP thing that will only continue to grow and get out of shape. And, ultimately, yes, let's assume the JDK (actually, Java SE, to be more precise) will disappear: your constructed objects and tests will remain identical, you will merely have to provide new implementations using the new kit at hand; that's what OOP is all about!
