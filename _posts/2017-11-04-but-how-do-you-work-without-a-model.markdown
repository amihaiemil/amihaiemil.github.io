---
layout: post
title: "\"But how do you work without a model?\""
date: 2017-11-04
tags: oop
author: amihaiemil
comments: true
shareable: true
preview: This is the question that I get most of the times, when I tell people how
 I design my code and that I hate the concept of getter/setter model POJO.
image: https://amihaiemil.github.io/images/zoot_cat.png
---

Almost everytime I discuss OOP and code design with someone, right after I tell them
that I do not like the concept of get/set "model objects", I see wide eyes accompanied
by the question: "But how do you work without a model?"

A fair question. We must have a "model" in our code, we must represent objects and their data
somehow, right? If you read my previous articles the answer should be more or less obvious:
**the object's interface is the model!**

<figure class="articleimg">
 <img src="{{page.image}}" alt="The Zoot Cat">
 <figcaption>
 Tom & Jerry - The Zoot Cat, by  William Hanna and Joseph Barbera
 </figcaption>
</figure>

 I already wrote about how I [animate](https://amihaiemil.github.io/2017/09/01/data-should-be-animated-not-represented.html) standard DTOs rather than parsing them and shoving the data into a dead POJO. Now let's see a more
 elaborated example.

Check the following class:

{% highlight java %}
/**
 * The average price of a Car according to the market.
 */
public final class MarketPrice implements Price {

    /**
     * Currency of the price.
     */
    private String currency;

    /**
     * Car which has this price.
     */
    private Car car;

    /**
     * Ctor. Default currency is Euro.
     * @param car Car which has this price.
     */
    public MarketPrice(final Car car) {
       this(car, "EUR");
    }

    /**
     * Ctor.
     * @param car Car which has this price.
     * @param currency Currency of the price.
     */
    public MarketPrice(final Car car, final String currency) {
       this.currency = currency;
       this.car = car;
    }

    @Override
    public BigDecimal value() throws IOException {
       //Make an HTTP call to some web service.
    }

    @Override
    public String currency() {
      return this.currency;
    }
}
{% endhighlight %}

It looks strange, doesn't it? We don't have the prices of the Cars that our app is working with, neither do we want to hardcode them somewhere. So, there is class MarketPrice which fetches a Car's price from a 3rd-party webservice... the Price fetches itself.

It doesn't look natural because we were taught that the objects in our code must respect the real-life entities they represent. Since the price is a lifeless, abstract concept, we were taught to represent it as a get/set bag of data -- that HTTP call is not its job, it's the job of a "controller". As you know already, I think that this way of thinking leads to huge, unmaintainable software, where refactoring becomes impossible and code quality drops significantly with each new functionality.

The ``MarketPrice`` class would be used as follows:

{% highlight java %}
/**
 * Car storred in MongoDB.
 */
public final class MongoCar implements Car {

    ...

    @Override
    public Price price() {
      return new MarketPrice(this);
    }

    ...
}
{% endhighlight %}

You see? The "business logic", which uses this Car does not care where the Price comes from, it only works with the model, the interface. However, we automatically got rid of a static method somewhere, which would make the HTTP call and parse the output; that logic is encapsulated and easily tested with class MarketPrice.

But wait, we have at least 2 issues with this design:

  * Efficiency; MarketPrice.value() will make an HTTP call everytime it is called.
  * Consistency; The price may change, so everytime you call MarketPrice.value(), you may get a different number.

Efficiency, if needed, can be easily fixed with a "caching decorator":

{% highlight java %}
public final class CachedPrice implements Price {

  /**
   * Decorated Price; we cache its value.
   */
  private Price decorated;

  /**
   * Cached value;
   */
  private BigDecimal value;

  @Override
  public BigDecimal value() throws IOException {
    if(this.value == null){
      this.value = this.decorated.value();
    }
    return this.value;
  }

  @Override
  public String currency() {
    return this.decorated.currency();
  }
}
{% endhighlight %}

Done; any implementation of Price, if wrapped inside this decorator, will fetch the value exactly once and cache it.
This also fixes the consistency problem, we can be sure that a filter, once applied, will remain valid (the values won't change at the next call).

Still, in our scenario, maybe we shouldn't cache the prices. Again, our app doesn't hold any information about them,
so it makes sense to always have them updated, to respect the market. How do we filter the cars then? Without a caching mechanism, the following code may introduce bugs:

{% highlight java %}
List<Car> cars = ...;//a list of cars;
List<Car> cheaper = cars.filter(
  car -> car.price().value().compareTo(BigDecimal.valueOf(10.000)) > 0
);
{% endhighlight %}

You see, after the creation of the ``cheaper`` cars List, the price of a Car may change and become > 10.000. Yet it is still in the list. How do we fix this?

An elegant solution, I believe, is to let an object of type Cars handle more instances of Car. Yet another strange thing. Why can't we simply use a List? Because lists are also dumb containers of data, as you see above. They know nothing and we cannot always rely on them to hold valid values. Instead, if we implement our own plural, we can tune up the Iterator and make the filtering dynamic (interface Cars extends Iterable):

{% highlight java %}
/**
 * Cars in MongoDB.
 */
public final class MongoCars implements Cars {
  ...

  @Override
  public Iterator<Car> iterator() {
    //return a simple iterator; Maybe read the Car objects into a List and return its iterator.
  }

  /**
   * Filter these cars according to a constant Price.
   */
  @Override
  public Cars filter(final Constant price) {//Constant implements Price and always returns the same value.
    new FilteredCars(this, price);
  }

  ...
}
{% endhighlight %}

The cool iterator is the one returned by ``FilteredCars.iterator()``. It runs over the encapsulated
Cars and makes sure it jumps over (or even removes) the cars which do not respect the given Price.
Now we have the guarantee that, at iteration time, a Car respects our filter.

{% highlight java %}
final Cars cars = ...;//some cars;
for(final Cars cheaper : cars.filter(new Constant(10.000))) {

}
{% endhighlight %}

What do you think? Is it harder to design? Definetly, the architect has a tough job. But once the design is in place, implementation & testing are easy and decoration is a piece of cake -- each of the above classes are easily tested and extended through decoration (which would not be possible without interfaces). Besides, we have no stale, untested code, no static methods and no spaghetti code anywhere.

To summarize, keep in mind the following: traditional get/set models are mere syntactic sugar. They are dead and cannot do anything for us. There is no difference between ``car.getPrice()`` and ``xml.getElement("price")`` -- any logic related to the price is still scattered around somewhere. Why shouldn't this logic be inside a live, smart object, which has an interface?
