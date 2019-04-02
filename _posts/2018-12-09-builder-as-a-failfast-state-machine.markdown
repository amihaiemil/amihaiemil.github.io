---
layout: post
title: "Builder As A (Fail-Fast) State Machine"
date: 2018-12-09
tags: oop
author: amihaiemil
comments: true
shareable: true
preview: An elegant and "fail-fast" way of designing more complex Builder
 patterns.
image: https://amihaiemil.github.io/images/mouse_trouble2.png
---

This is an idea that came to me a few weeks ago while designing a "Generator" class that had
to send the input to an encapsulated ``Writer``. It was, in fact, the Builder pattern. However,
the rules were a bit more complex, the user had to call the ``add...()`` methods in a certain way, for the output to be generated correctly.

Needless to say, I didn't like the option of having one single ``BuilderImpl`` class that would set and verify all sorts of flags internally, in order to know what and when it was allowed to do. The solution was to build a [Finite State Machine](https://en.wikipedia.org/wiki/Finite-state_machine), since the builder's interface was fluent. As usual, in this post I'll illustrate it all with an example.

<figure class="articleimg">
 <img src="{{page.image}}" alt="Mouse Trouble">
 <figcaption>
 Tom & Jerry - Mouse Trouble, by  William Hanna and Joseph Barbera
 </figcaption>
</figure>

Let's assume we want to implement a ``DateBuilder`` that would generate a ``String`` in the classic ``dd.mm.yyyy`` format (maybe with other types of separators as well, not only ``.``). For the sake of simplicity, we'll focus only on format and forget cases such as number of days in a month, leap years etc. First comes the interface:

{% highlight java %}
public interface DateBuilder {

    DateBuilder addDay(final Integer day);
    DateBuilder addMonth(final Integer month);
    DateBuilder addYear(final Integer year);
    DateBuilder addSeparator(final String sep);

    String build();

}
{% endhighlight %}

The interface above will have five implementations: ``StringDateBuilder`` (the public entry point), ``ExpectSeparator``, ``ExpectMonth``, ``ExpectYear`` and ``ExpectBuild`` (these four are package protected, invisible to the user). ``StringDataBuilder`` looks like this:

{% highlight java %}
public final class StringDateBuilder implements DateBuilder {

    private final StringBuilder date = new StringBuilder();

    @Override
    public DateBuilder addDay(final Integer day) {
      this.date.append(String.valueOf(day));
      return new ExpectSeparator(this.date);
    }

    @Override
    public DateBuilder addMonth(final Integer month) {
      throw new UnsupportedOperationException(
        "A day is expected first! Use #addDay!"
      );
    }

    @Override
    public DateBuilder addYear(final Integer year) {
      throw new UnsupportedOperationException(
        "A day is expected first! Use #addDay!"
      );      
    }

    @Override
    public DateBuilder addSeparator(final String sep) {
      throw new UnsupportedOperationException(
        "A day is expected first! Use #addDay!"
      );
    }

    @Override
    public String build() {
      throw new UnsupportedOperationException(
        "Nothing to build yet! Use #addDay!"
      );
    }

}
{% endhighlight %}

I'm sure you get the point already: the other four implementations will handle their own situations. For instance, ``ExpectSeparator`` will throw an exception from all methods except ``addSeparator(...)``, where it will append the separator to the ``StringBuilder`` and return an instance of ``ExpectMonth``. Finally, the last node of this machine will be ``ExpectBuild`` (returned by ``ExpectYear`` after adding the year), which will throw exceptions from all methods besides ``build()``.

This design helped me keep my <strike>code</strike> objects small, free of flags and ``if/else`` forks. As usual, each of the classes above are easily tested and the builder's behaviour is easily changeable by switching the returned implementations.

Of course, I am not the only one with these thoughts: mr. Nicolas Fränkel wrote about this very idea just last month [here](https://blog.frankel.ch/builder-pattern-finite-state-machine/). However, I felt the need to bring my two cents because I did not like his example entirely: he used different interfaces for the builder's nodes in an attempt to keep the builder safe and idiot-proof (e.g. don't even allow the user to see an ``addMonth`` or ``build`` method if they shouldn't use it). This is something I don't agree with because it means even more code for me to manage and besides, the client will be more coupled with the builder's logic. I'd rather just force the user into learning how to use the builder (it shouldn't be a big effort for them, since they're supposed to catch any exceptions with the simplest of unit tests, right? [right...](https://www.yegor256.com/2015/07/16/fools-dont-write-unit-tests.html))

I found [this article](https://sourcemaking.com/design_patterns/state) too, which offers a broader, more theoretical explanation, not necessarily tied to the Builder pattern -- if you think about it, this approach could be used with any kind of object that has to change its behaviour based on its internal state.
