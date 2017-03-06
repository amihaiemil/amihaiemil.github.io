---
layout: post
title: "Each System Property Should Have Its Own Class"
date: 2017-02-24
tags: java oop unit-testing
author: <a href="https://www.github.com/amihaiemil" target="_blank">amihaiemil</a>
comments: true
shareable: true
preview: Each System.getProperty("...") should be in its own class. Otherwise, the
 code containing it is not testable.
---

A lot of Java applications use [System properties](https://docs.oracle.com/javase/tutorial/essential/environment/sysprop.html)
to hold their configuration. It's very convenient especially for webapps,
because you can set these properties from the server's admin console.

Naturally, somewhere in the code, the properties are checked and a decision is made
based on them. The question is: how can that code be well unit-tested?

<figure class="articleimg">
 <img src="/images/egg_and_jerry.png" alt="The Egg and Jerry">
 <figcaption>
 Tom & Jerry - The Egg and Jerry, by  William Hanna and Joseph Barbera
 </figcaption>
</figure>

Take the following class:

{% highlight java %}
public class Foo {
  public boolean act() {
    if("blue".equals(System.getProperty("color")) {
      return true;
    } else {
      return false;
    }
  }
}
{% endhighlight %}

And its corresponding test class:

{% highlight java %}
public class FooTest {
  @Test
  public void actsWithBlue() {
    System.setProperty("color", "blue");
    assertTrue(new Foo().act());
  }

  @Test
  public void actsWithoutBlue() {
    System.setProperty("color", "green");
    assertFalse(new Foo().act());
  }

  @After
  public void clean(){
    System.clearProperty("color");
  }
}
{% endhighlight %}

Do these tests run fine? Yes. Do they leave the property wrongly initialized?
No, the ``@After`` method runs even if a test throws an exception.
So where's the problem?

The problem occurs when you enable multi-threaded test runs. In that scenario the tests
are run in parallel, not sequentially, which means that ``actsWithBlue()`` could
initialize the "color" property before ``actsWithoutBlue()`` finishes execution, or
vice-versa. Also, if other tests (for other classes) happen to work with real ``Foo``
objects instead of mocks, they will be in trouble as well.

I hope it's clear that **no test should set system properties**, under any circumstances.
Let's introduce interface Color:

{% highlight java %}
public interface Color {
  public String read();

  static class Fake implements Color {
    private String color;
    public Fake(String color) {
      this.color = color;
    }
    public String read() {
      return this.color;
    }
  }
}
{% endhighlight %}

and the real implementation:

{% highlight java %}
public class SystemColor implements Color {
  public String read() {
    return System.getProperty("color");
  }
}
{% endhighlight %}

The ``Foo`` class becomes:

{% highlight java %}
public class Foo {
  private Color color;
  public Foo(Color clr) {
    this.color = clr;
  }
  public boolean act() {
    if("blue".equals(this.color.read()) {
      return true;
    } else {
      return false;
    }
  }
}
{% endhighlight %}

It can now be properly tested using ``Color.Fake``:
{% highlight java %}
public class FooTest {
  @Test
  public void actsWithBlue() {
    assertTrue(
      new Foo(
        new Color.Fake("blue")
      ).act()
    );
  }

  @Test
  public void actsWithoutBlue() {
    assertFalse(
      new Foo(
        new Color.Fake("green")
      ).act()
    );
  }
}
{% endhighlight %}

Done. Now the tests don't have to set any system property and can run in parallel without
affecting one another. By the way, I used  a "fake" implementation of Color instead of Mockito or other frameworks. I like to do that, if the interfaces are small - then it really makes no sense to bring in all the weight of an entire mocking framework.

Finally, if you're wondering how to unit test ``SystemColor.read()``, I can only tell you that
that's the kind of code due to which coverage is never 100%. And, after all, I think we can safely
assume that ``System.getProperty(...)`` (being a part of the jdk) runs ok.

How does your app read system properties?
