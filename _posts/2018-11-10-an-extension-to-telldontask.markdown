---
layout: post
title: "An Extension To TellDontAsk"
date: 2018-11-10
tags: oop java
author: amihaiemil
comments: true
shareable: true
preview: I think that TellDontAsk is one of the most important principles out there,
 but it seems to be incomplete.
image: https://amihaiemil.github.io/images/blue_cat_blues.png
---

More than five years go, Martin Fowler pinpointed one of the biggest problems in
Object-Oriented Programming in his famous [TellDontAsk](https://www.martinfowler.com/bliki/TellDontAsk.html) article. In his writing,
he reminded programmers that they should trust their objects with performing the work for them,
rather than asking the objects to provide the data that they would later work with themselves.

This is something that I very much agree with but, of course, this principle alone won't guarantee that our code is object-oriented. I think it is not enough to trust an object with doing the work -- some more design effort is needed in order to ensure that said object won't cause procedural code later on.

<figure class="articleimg">
 <img src="{{page.image}}" alt="Blue Cat Blues">
 <figcaption>
 Tom & Jerry - Blue Cat Blues, by  William Hanna and Joseph Barbera
 </figcaption>
</figure>

Let's see an example:

{% highlight java %}
/**
 * All employees of a company.
 * You can hire more, fire some of them, give them a raise etc.
 \*/
public final class AllEmployees implements Employees {

    //constructor
    //other methods from Employees interface (hire, fire, raise etc)

    @Override
    public List<Employee> filter(final Map<String, String> skills) {
       //return the List of those who have the specified skills.
    }

}
{% endhighlight %}

The above class will create a proper object which respects Mr. Fowler's principle:
it will take care of the employees and it will even filter them for us, no questions asked. However, it <strike>may</strike> will cause some damage around it and here why: once we perform a filtering, we are left with a ``List`` which is discriminating everyone!

Are those filtered employees never going to get a raise? Will they never be fired or we will never hire someone with the same skills (same filters)? Of course we will still want to give raises, fire or hire someone similar, but we are now out of the context, we now have just a dumb ``List`` in our hands: in order for the employees on this list to have the same rights and obligations as the rest, we will need to write procedural code (maybe a lot of code).

Here is what I think we should do: we should add a new implementation of ``Employees``, called ``FilteredEmployees``, which would take that Map in its constructor and make sure that it only handles employees who have the skills that we asked for. This way, they still work for the same company and nothing has changed aside from the fact that now we know them better, we know they have some skills that others don't. We won't have to write code to handle or [transform](https://amihaiemil.github.io/2017/10/16/javaee8-jsoncollectors-oop-alternative.html) a ``List``, we will still have an instance of ``Employees``. Now our class looks like this:

{% highlight java %}
/**
 * All employees of a company.
 * You can hire more, fire some of them, give them a raise etc.
 \*/
public final class AllEmployees implements Employees {

    //constructor
    //other methods from Employees interface (hire, fire, raise etc)

    @Override
    public Employees filter(final Map<String, String> skills) {
       return new FilteredEmployees(..., skills);
    }

}
{% endhighlight %}

I would say the idea is to try to **implement the situation itself** rather than tell an object to lead you to said situation. That is, we implemented those those filtered employees because the original object could not perform the filtering for us while maintaining the context. Simply telling the object to do it would have brought us to the same situation (of working with people that have the given skills) but these people wouldn't be **Employees** anymore, they would be just a list.

I see all this as an extension to the TellDontAsk principle. How to make sure you're heading in the right direction, I'm not really sure. However, I think the usage of the JDK (or whatever development kit you are using) is a good indicator: **in an object-oriented codebase the kit should be as discrete as possible**. The more you use the development kit, the less object-oriented your code really is or your abstractions are not the best they can be. On the other hand, the more you are able to add/modify/remove functionalities just by working with existing objects (or adding new implementations of existing interfaces), the more object-oriented your application is.

**P.S.** [Here](https://amihaiemil.github.io/2017/08/12/how-interfaces-are-refactoring-our-code.html) is another example of the same idea.
