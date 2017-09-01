---
layout: post
title: "Data Should Be Animated, Not Mapped"
date: 2017-08-12
tags: oop java design
author: <a href="https://www.github.com/amihaiemil" target="_blank">amihaiemil</a>
comments: true
shareable: true
preview: In practical OOP, it is impossible to get rid of DTOs. However, we can improve
 the way we work with data - instead of mapping it to stale, dead object, we should animate it
 with live, smart objects.
---

I sort of wrote about this topic already [here](http://www.amihaiemil.com/2017/07/04/yasson-yet-another-POJO-parser.html),
but it was more of a rant, so maybe it's better to put those same lines in a clearer and more focused format, accompanied by one more example.

I first discovered the idea of "live objects" in ["Elegant Objects", by Yegor Bugayenko](https://www.amazon.com/Elegant-Objects-1-Yegor-Bugayenko/dp/1519166915).
Even though other ideas presented in the book are quite debatable, I think this one is clear and there might not be a single, proper argument against it.

So, let's see what's it about and how I apply it in order to refactor and make my code more maintainable.

<figure class="articleimg">
 <img src="/images/part_time_pal.PNG" alt="Part Time Pal">
 <figcaption>
 Tom & Jerry - Part Time Pal, by  William Hanna and Joseph Barbera
 </figcaption>
</figure>

Assume you're developing a webapp for a car showroom. When the user adds a new car in the app, your ``add`` endpoint receives
the following JsonObject:

{% highlight json %}
{
  "mark": "BMW",
  "hp": 200,
  "model": "X5",
  "price": 30.000,
  "currency": "USD"
}
{% endhighlight %}

Your code works with objects of type ``Car``, so the question comes: How do you turn the incoming json into a Car instance?
The issue here is that, most developers will have the following "model object" in their code:

{% highlight java %}
public class Car {
  private String mark;
  private int hp;
  private String model;
  private int price;
  private String currency;

  //getters and setters
}
{% endhighlight %}

The model object above is just a burdain to our codebase. Why so? Do not think it's about boilerplate code, it's not that simple. The object above is a dumb bag of data.
It doesn't know anything, it just sits there, waiting to be injected with data, waiting to have the data extracted from it and dealt with. Our car has 5 attributes, which mean
at least 5 setters called somewhere, to build it. Either that, or you fatten your deployable with some parsing library.

Furthermore, after you build it, such a Car will do nothing for you, you will always call a ``get`` on it, and do something yourself.
For instance, you may want to be sure that the mark is always in capital letters. With the Car above, whenever you call ``car.getMark()``, you have to specify ``.toUpperCase()``. The pollution is obvious. Any logic about a Car is outside of it, it cannot do anything for you. Actually, you might as well use a JsonObject instead of a Car. It's the same thing, the Car model's role so far is merely syntax sugar.

Instead, here's a better object, which is "alive". An object which hides the original data and animates it for you:

{% highlight java %}
public class JsonCar implements Car {
  private JsonObject car;

  public String mark() {
    return this.car.getString("mark");
  }
  //other accessor methods
}
{% endhighlight %}

Of course, this simple JsonCar doesn't do more than the previous one. But it is a proper object, [with an interface](http://www.amihaiemil.com/2017/08/12/how-interfaces-are-refactoring-our-code.html),
which means you can decorate it, compose the Car of your dreams, which will do a lot for you. To make sure the car always prints with CapsLock you have this class:

{% highlight java %}
/**
 * Car with CapsLock.
 */
public class ClCar implements Car {
  private Car car;

  public String mark() {
    return this.car.mark().toUpperCase();
  }
  //other accessor methods
}
{% endhighlight %}

You would use the above classes like this:

{% highlight java %}
  Car car = new ClCar(
    new JsonCar(...)
  );
{% endhighlight %}

You see? It's not about boilerplate code. We actually wrote a little more code, but our "business logic" will never be polluted. It will never have
to deal with marshaling/unmarshalling or other issues related to the car's data. It will just receive a Car object which will do most of the stuff for itself, for its own data.

An even more important advantage is testability and maintainability. You can easily test those Car implementations. On the other hand, it really makes no sense
to test a DTO with getters and setters. Same as there is no sense in trying to unit test that private static method, with 200 lines, which turns the DTO in and out. Everyone can understand
what that method does, it's simple. Nobody will ever forget to call a setter there, ruining the logic in 3 other "business methods".

So, I strongly believe that data should be animated. It should be the skeleton of some smarter object, which in turn should implement interfaces and be composable. Here is another, more concrete, example of the same principle:

We implemented [camel](https://github.com/decorators-squad/camel), an OOP YAML api for Java. There is the [YamlMapping](https://github.com/decorators-squad/camel/blob/master/src/main/java/com/amihaiemil/camel/YamlMapping.java) interface and you get an instance of it by using a builder, very similar to the ``javax.json`` API:

{% highlight java %}
  YamlMapping yaml = Yaml.createYamlMappingBuilder()
    .add("architect", "amihaiemil")
    .add(
        "devops",
        Yaml.createYamlSequenceBuilder()
            .add("rultor")
            .add("0pdd")
            .build()
    ).add(
        "developers",
        Yaml.createYamlSequenceBuilder()
            .add("amihaiemil")
            .add("salikjan")
            .add("SherifWally")
            .build()
    ).build();
{% endhighlight %}

The implementation is [RtYamlMapping](https://github.com/decorators-squad/camel/blob/master/src/main/java/com/amihaiemil/camel/RtYamlMapping.java), which works with a ``Map``, behind the scenes. This was the *building* of a Yaml, which is very easy. But what about the *reading*? How do we read from a file, turn all the contents into a ``Map``, and wrap it inside ``RtYamlMapping``?

We struggled to find a proper solution, for parsing the ``File`` and putting the contents into a ``Map``. It meant a lot of stuff: read the file, get each element, see whether it is a sequence or a mapping etc. Plus, all this would be scattered around, in some static methods. The idea simply didn't fit in the architecture of an OOP library. Then, we realised the aproach was wrong: we did not have to struggle and parse the ``File`` into a ``Map``. Instead, we just needed a new implementation of YamlMapping, which came out to be [ReadYamlMapping](https://github.com/decorators-squad/camel/blob/master/src/main/java/com/amihaiemil/camel/ReadYamlMapping.java).

That ``ReadYamlMapping`` takes the data and *animates it* for us. We ask for the value of a key and it just searches through what data it has. There is no actual "parsing logic" anywhere. No data is split apart and morphed into an equally dumb and stale data object. Well, if you look inside its implementation, there is a layer of abstraction, which simplifies the stuff a little. It works with lines, rather than the really raw input. I see no problem with that, since ``YamlLines`` is also an object which *does* something with the data, rather than *being* the data.

To conclude, I hope I managed to convince you of the harm that DTOs do in our code. I am aware that we cannot possibly get rid of DTOs, I'm just saying we should use standard formats like XML, Json etc, and wrap these formats in intelligent objects which can actually do something for us, can easily be tested, extended and mainteined. There are probably many questions about
the code above, feel free to shoot them in the Disqus thread below.
