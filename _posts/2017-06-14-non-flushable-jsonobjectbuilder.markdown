---
layout: post
title: "Non flushable javax.json.JsonObjectBuilder"
date: 2017-06-14
tags: java oop design
author: <a href="https://www.github.com/amihaiemil" target="_blank">amihaiemil</a>
comments: true
shareable: true
preview: Working around flushable javax.json.JsonObjectBuilder
---

You do know how to handle Json objects in Java, right? If you don't, just pretend you do and
check out the [javax.json API](https://docs.oracle.com/javaee/7/api/javax/json/package-frame.html) introduced
in JavaEE 7.

Since JavaEE 7 this is the official, standardized way of dealing with Json in Java. Even if you develop a desktop
application or a library, you can use the API by pulling in the implementation with "runtime" dependency scope.

In this post I'm going to ilustrate the importance of <b>interfaces</b>, by showing you how I solved an annoying problem
with this specitifaction.

<figure class="articleimg">
 <img src="/images/mouse_trouble.PNG" alt="Mouse Trouble">
 <figcaption>
 Tom & Jerry - Mouse Trouble, by  William Hanna and Joseph Barbera (from <a target="\_blank" href="http://tomandjerrycaps.blogspot.co.at/">here</a>)
 </figcaption>
</figure>

You've probably used this API too, most likely for parsing responses from a REST endpoint. There, you simply built a JsonObject
from the response's InputStream and used it later ony to <b>read</b> data from it, since JsonObject is immutable. Something like this:

{% highlight java %}
InputStream content = response.getContent();
JsonObject result = Json.createReader(content).readObject();
{% endhighlight %}

or, you simply built a JsonObject, to send to a server with a POST request:

{% highlight java %}
JsonObject car = Json.createObjectBuilder()
                     .add("mark", "BMW")
                     .add("price","$30.000")
                     .build();
{% endhighlight %}

In neither of these occasions, the flaw I'm talking about is not visible: ``JsonObjectBuilder.build()`` flushes the builder.
So, in the ``car`` example above, if you would call ``build()`` multiple times, only the first would output the desired JsonObject; the following calls
would result in an empty object. See [this](https://stackoverflow.com/questions/35187129/javax-json-strange-behavior) SO question about this "strange behaviour".

Why is it a flaw? Because otherwise, you could elegantly use JsonObjectBuilder to back any "mutable" implementation you want. For instance,
I'm using a JsonObjectBuilder to back a mock HTTP server. This basically means I have a [bunch of classes](https://github.com/decorators-squad/versioneye-api/blob/master/src/main/java/com/amihaiemil/versioneye/MkVersionEye.java) which mimic the real
HTTP API without actually making calls to any server. Instead, all the data is read/written from/into a JsonObjectBuilder. The build() method is called at every
read operation and thus it is very inconvenient to have the builder flushed afterwards.

So how do you solve this issue? The first thing you do is start looking into different implementations. You try both [Glassfish's](https://mvnrepository.com/artifact/org.glassfish/javax.json)
and [Redhat's](https://mvnrepository.com/artifact/org.jboss.resteasy/resteasy-json-p-provider/3.1.3.Final) implementations to see that they behave the same. Bummer.
Since there is no other way, the obvious solution is to write a global static method somewhere in your code, which takes the JsonObjectBuilder, builds the JsonObject and then, iterating over the JsonObject, adds the attributes back in the builder; something like this:

{% highlight java %}
public static JsonObject buildObject(JsonObjectBuilder builder) {
    JsonObject built = builder.build();
    for(Entry<String, JsonValue> entry : built.entrySet()) {
      builder.add(entry.getKey(), entry.getValue());
    };
    return built;
}
{% endhighlight %}

This should work fine, except you will soon realize that all your code is poluted with calls to this static function. Wherever the builder is built, you absolutely need a call
to this function. Good luck debugging if you forget to do use it somewhere; and you (or one of your new colleagues) will, for sure.

Then, maybe, you realize that ``javax.json.JsonObjectBuilder`` is an interface and you can implement it yourself to have any behaviour you want.
So what? Now you're going to reimplement everything those smart guys from Oracle or Redhard already implemented? No, of course not. Check this out:

{% highlight java %}
public final class NfJsonObjectBuider implements JsonObjectBuilder {

    private Map<String, Object> values = new LinkedHashMap<>();

    @Override
    public Storage add(final String name, final JsonValue value) {
        this.values.put(name, value);
        return this;
    }

    @Override
    public Storage add(final String name, final String value) {
        this.values.put(name, value);
        return this;
    }

    @Override
    public Storage add(final String name, final BigInteger value) {
        this.values.put(name, value);
        return this;
    }
    //other add(...) methods with the same implementation

    @Override
    public JsonObject build() {
        final JsonObjectBuilder builder = Json.createObjectBuilder();//HERE: reuse their building logic.
        for(final Entry<String, Object> pair : this.values.entrySet()) {
            this.addToBuilder(pair, builder);
        }
        //if you wanted to flush the builder, here you would empty the values map
        return builder.build();
    }

    private void addToBuilder(
        final Entry<String, Object> pair, final JsonObjectBuilder builder
    ) {
        if(pair.getValue() instanceof JsonValue) {
            builder.add(pair.getKey(), (JsonValue) pair.getValue());
        }
        if(pair.getValue() instanceof String) {
            builder.add(pair.getKey(), (String) pair.getValue());
        }
        if(pair.getValue() instanceof Boolean) {
            builder.add(pair.getKey(), (Boolean) pair.getValue());
        }
        //A couuple more ifs to cover all the add(...) methods.
    }
}
{% endhighlight %}

So, you see the advantages of having a standardized API with clear interfaces?
Now, the only difference in your code will be that, instead of instantiating your builder like this

{% highlight java %}
JsonObjectBuilder builder = Json.createObjectBuilder();
{% endhighlight %}

you will do it like this:

{% highlight java %}
JsonObjectBuilder builder = new NfJsonObjectBuider();
{% endhighlight %}

And it will work like a charm.

Finally, I am aware this is really basic OOP, but I am ready to bet quite a fair amount that most developers would come up
with the second solution or maybe even think of switcing the API to some library from Google or what not. A lot of developers simply
do not take advantage of such simple concepts as interfaces.
