---
layout: post
title: "Each System Property Should Have Its Own Class"
date: 2017-02-23
tags: java oop unit-testing
author: <a href="https://www.github.com/amihaiemil" target="_blank">amihaiemil</a>
comments: true
shareable: true
preview: Each System.getProperty("...") should be in its own class. Otherwise, the
 code containing it is not testable
---

A lot of Java application use [System properties](https://docs.oracle.com/javase/tutorial/essential/environment/sysprop.html)
to hold their configuration. It's very convenient especially for webapps, because you can set these properties from
the server's admin console.

Naturally, somewhere in the code, the properties are checked and a decision is made
based on them. The question is: how can this code be well tested?

<figure>
 <img src="/images/jerry_and_jumbo.png" alt="Jerry and Jumbo">
 <figcaption>
 Tom & Jerry - Jerry and Jumbo, by  William Hanna and Joseph Barbera
 </figcaption>
</figure>

Take the following class, for example:

{% highlight java %}
public class Foo {
  public boolean act() {
    if("test".equals(System.getProperty("environment")) {
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
  public void worksInTest() {
    System.setProperty("environment", "test");
    assertTrue(new Foo().act());
  }

  @Test
  public void worksInProd() {
    System.setProperty("environment", "prod");
    assertFalse(new Foo().act());
  }

  @After
  public void clean(){
    System.clearProperty("enviromnemnt");
  }
}
{% endhighlight %}

Are the tests correct and will they run fine? Yes. Do they leave any properties
wrongly initialized? No, the After method runs even if a test throws an exception.
So what's the problem?

The problem occurs if you enable multi-threaded test runs. In that scenario tests
are run in parallel, not sequencially. Two obvious advantages of this are:
  + the build speeds up since the test phase takes a shorter Time
  + it is guaranteed that the tests are 100% decoupled and do not depend on one another
