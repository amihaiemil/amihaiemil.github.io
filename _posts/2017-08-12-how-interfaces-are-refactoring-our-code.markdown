---
layout: post
title: "How Interfaces Are Refactoring Our Code"
date: 2017-08-12
tags: oop java design
author: amihaiemil
comments: true
shareable: true
preview: An example of why any object, in any application, should implement all its public methods
 from interfaces.
image: http://www.amihaiemil.com/images/mouse_in_the_house.png
---

I'm sure you've heard this idea before: all the public methods of an object should come from interfaces. I very much agree with it and, if you ask me, I'll tell you that all objects, without exception,
should implement at least one interface. This is of paramount importance, especially when developing libraries and reusable components. You want to provide
extensibility and testability, you want to let your users [decorate or reimplement objects](http://www.amihaiemil.com/2017/06/14/non-flushable-jsonobjectbuilder.html) etc.

But what about standalone applications, where you have objects that represent things which can have only one implementation? Even those? Yes. Let's see why, through an example.

<figure class="articleimg">
 <img src="{{page.image}}" alt="A Mouse In The House">
 <figcaption>
 Tom & Jerry - A Mouse In The House, by  William Hanna and Joseph Barbera
 </figcaption>
</figure>

Assume your application reads some configs from a ``.yml`` file. You introduce the following
object immediately:

{% highlight java %}
/**
 * Configuration in YAML format.
 */
public class ConfigYml {

  /**
   * Config in YAML format.
   */
  private final Yaml config;

  /**
   * Should the bot tweet its actions?
   */
  public Boolean tweet() {
    return Boolean.valueOf(this.config.scalar("tweet"));
  }

  /**
   * Who can give commands to the bot?
   */
  public List<String> commanders() {
    return this.config.sequence("commanders");
  }
}
{% endhighlight %}

One argument for interface ``Config`` would be the following: what if, later, you decide to read the config from XML? Then you would have another implementation called ``ConfigXml``. It's a good reason but you won't do it because, when the time for change comes, you will simply modify the ``ConfigYml`` class above -- it's *very* unlikely that you will ever have both XML and YAML configs. I would think the same.

Still, I would introduce it for another reason: the case when the file ``.config.yml`` is missing. Here's how your code would look without an interface:

{% highlight java %}
public void handleCommand(final Command com) {
  final ConfigYml config = com.config();
  if(config != null) {
    if(config.tweet()) {
      //tweet
    }
    for(String commander : config.commanders()) {
      //do something about commanders.
    }
  } else {
    //handle missing config sitiuation, probably duplicate the logic in the if()
  }
}

{% endhighlight %}

Method ``Command.config()`` returns ``null`` if there is no config, thus complicating method ``handleCommand`` a lot. It is inevitable. What else to return besides ``null``? And you have to check for it and cover the exceptional case.

However, if you had interface ``Config``, you would realize that it should have a ``Missing`` implementation:

{% highlight java %}
public class Missing implements Config {
  @Override
  public List<String> commanders() {
    return new ArrayList<>();
  }

  @Override
  public boolean tweet() {
    return false;
  }
}
{% endhighlight %}

With this approach, an object of type ``Missing`` represents the case when the config file is not there. We won't have to return ``null`` or do any other type of ``if/else`` forking in our code.
We just call ``command.config()`` to fetch the configuration, and we know that all the cases are covered. The ``handleCommand`` method becomes much smaller (it's still far from a perfect design, though)

{% highlight java %}

public void handleCommand(final Command com) {
  final Config config = com.config();
  if(config.tweet()) {
    //tweet
  }
  for(String commander : config.commanders()) {
    //do something about commanders.
  }
}

{% endhighlight %}


The ``Missing`` configuration in the above example returns false for ``tweeting`` and an empty list of
commanders. Maybe you would like your application to throw an exception if the config is missing, so you should have the implementation ``Mandatory``, which throws an exception when either of the methods is called.

You see? This is why interfaces are important. If it wasn't for the ``Config`` interface, the code would be polluted with if/else forks for ``null`` checking and/or for exception throwing. Also, you can easily use the decorator pattern to add more functionality: maybe you only want to use the commanders which are admins -- there are dozens of possiblities which you wouldn't see if there was no interface there.

Another way of putting it is the following: objects must do as much work for you as possible. You should ask an object to do something, rather than ask for data and manipulate it yourself. This is a [core principle in OOP](https://martinfowler.com/bliki/TellDontAsk.html), which is very hard to apply when you don't use interfaces. Objects ``Missing`` and ``Mandatory`` handle very important things for us, relieving us of useless logic and making the code more maintainable and testable.

To conclude, just keep in mind: declare interfaces for any object, even if you don't see a real
use for it at first. You will surely see it later, when trying to use that object. Any questions?
