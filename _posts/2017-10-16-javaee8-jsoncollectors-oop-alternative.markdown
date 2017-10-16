---
layout: post
title: "JavaEE 8: JsonCollectors And The OOP Alternative"
date: 2017-10-16
tags: java oop javaee design
author: amihaiemil
comments: true
shareable: true
preview: A short overview of JavaEE 8's JsonCollectors and an OOP alternative for
 JavaEE 7 and below.
image: https://amihaiemil.github.io/images/mouse_in_the_house2.png
---

With JavaEE 8 there comes a new version of the JSON-P (JSON Processing) specification, namely version
1.1. One of the new things this version brings is the utility class [JsonCollectors](https://javaee.github.io/javaee-spec/javadocs/javax/json/stream/JsonCollectors.html).

This class is OK, it provides some useful collectors to manipulate collections of JsonValues and turn them into JsonObjects or JsonArrays. Let's see how it works and dive into a more OOP alternative (I'm going to examine JsonArray, but this applies to JsonObject as well and probably to the others too).

<figure class="articleimg">
 <img src="{{page.image}}" alt="A Mouse in the House">
 <figcaption>
 Tom & Jerry - A Mouse in the House, by  William Hanna and Joseph Barbera
 </figcaption>
</figure>

Straight to the point, in JavaEE 8, you can turn a collection of JsonValue into a JsonArray like this:

{% highlight java %}
List<JsonValue> values = ...;
JsonArray array = values.stream().collect(
  JsonCollectors.toJsonArray()
);
{% endhighlight %}

If you work work with JavaEE 7 and maybe Java 7 instead of Java 8, you would have to do the following:

{% highlight java %}
List<JsonValue> values = ...;
JsonArrayBuilder builder = Json.createArrayBuilder();
for(JsonValue value : values) {
    builder = builder.add(value);
}
JsonArray array = builder.build();
{% endhighlight %}

Very beautiful and handy. Actually, I'm not the only one writing these examples, you can already
find a few at a first Google search.

What I didn't see, however, is an OOP approach. The snippets above answer the question "How do we *put* these values *into* an array?", instead of answering the question "How do we *make* these values *act as* an array?".

It's a very important difference. In the current approach, you have a few issues:

  * Code duplication: everywhere you need an array, you will see those few lines of code/chain of method calls;
  * Static methods: if you don't want to duplicate those lines of code, you have to put them in a static method somewhere, which probably won't be unit-tested;
  * Coupling: if Java EE 9 comes and changes the JsonCollectors API, or any of the methods ``stream()`` or ``collect(...)`` changes in the future, you will have to find all the usages and edit your code;

You'll say that this is a trivial example and it's nothing to worry about, because there's
very little chance for something to break in the future. And you are right, but this is a classic case of "let's turn X into Y", rather than "let's add a new implementation of Y, based on X", which would be the correct object-oriented way!

So, I ask myself, why didn't the JSON-P guys think of this? Why did they struggle to implement Collectors and other rocket stuff, instead of simply providing the following implementation of JsonArray?

{% highlight java %}
package javax.json;

/**
 * JsonArray from a collection of JsonValues.
 * This is an alternative to having a static method somewhere, which calls the builder
 * and returns a JsonArray.
 *
 * Instead of having the following in your code:
 *
 * JsonArray arr = buildArray(value1, value2, value3);
 *
 * you will have the following
 *
 * JsonArray arr = new CollectedJsonArray(value1, value2, value3);
 */
public final class CollectedJsonArray implements JsonArray {

    /**
     * Collected array.
     */
    private final JsonArray collected;

    public CollectedJsonArray(JsonValue... values) {
        JsonArrayBuilder builder = Json.createArrayBuilder();
        for(JsonValue value : values) {
            builder = builder.add(value);
        }
        this.collected = builder.build();
    }

    @Override
    public JsonObject getJsonObject(int i) {
        return this.collected.getJsonObject(i);
    }

    @Override
    public JsonArray getJsonArray(int i) {
        return this.collected.getJsonArray(i);
    }

    //the other methods of JsonArray, delegated to this.collected.

}
{% endhighlight %}

I wrote this class myself. It is simple, API compliant and doesn't care who is the JSON-P provider. Yet it is painful to write, because you have to implement all those methods and delegate the work to ``this.collected``. Then, there should be some unit tests for it. I believe that this class should have been shipped with JavaEE8. It is a mere wrapper, it has just a few lines in the ctor, but it spares our application of coupling, static methods and untested code.

What do you think? How would you have implemented it?
