---
layout: post
title: "Polymorphic Input/Output Data"
date: 2019-03-31
tags: oop
author: amihaiemil
comments: true
shareable: true
preview: Using polymorphism for input/output data, as an alternative to
 model classes
image: https://amihaiemil.github.io/images/solid_serenade.PNG
---

When developing any kind of code interface, whether it is an elegant object oriented package or one of
those ugly "Service" classes that we are so accustomed to, it is obvious that it should be as
extensible as possible and require as little maintenance as possible. This applies, of course,
to the input and output parameters (returned types), especially if the code in question cannot be modified
by its clients.

Question is, how can we have flexible parameters if they consist of dumb get/set [models](https://www.amihaiemil.com/2018/04/17/dolls-and-maquettes.html)? Each time a new field/attribute is required, someone will knock on your door to update your interface because otherwise they won't be able to send or receive all the data they need.

<figure class="articleimg">
 <img src="{{page.image}}" alt="Solid Serenade">
 <figcaption>
 Tom & Jerry - Solid Serenade, by  William Hanna and Joseph Barbera
 </figcaption>
</figure>

Take the bellow example:

{% highlight java %}
public interface People extends Iterable<Person> {
  Person fetch (int id);
  boolean insert (Person person);

  //...
}
{% endhighlight %}

Assume our ``Person`` is a get/set class, having a ``firstName``, ``lastName`` and an ``id``. When the user of this interface will need to receive or send more attributes they won't be able to, so they'll ask you to first alter the ``Person`` model and then add logic in your code to handle those attributes.

The solution to this problem is Polymorphism, one of the most common OOP principles -- it will make our parameters "transparent" and more maintainable. Assuming that our data is represented in JSON, here is how I would redesign the ``People`` interface:

{% highlight java %}
public interface People extends Iterable<Person> {
  Person fetch (int id);
  boolean insert (JsonObject person);
  //...
}
{% endhighlight %}

There are two big changes: ``Person`` is actually an interface, extending ``javax.json.JsonObject`` and at the same time [animating](https://www.amihaiemil.com/2017/09/01/data-should-be-animated-not-represented.html) some parts of the underlying json or maybe all of it -- this way, if ``People.fetch(...)`` changes and returns a bigger ``JsonObject``, the new values will be accessible automatically via ``JsonObject.getString(...)`` method, until we may add more reading method to the ``Person`` interface.

The second change is the input that ``insert(...)`` method expects. It now requires a raw ``JsonObject`` for the same reason: if the encapsulated service decides to expect more values, the user will simply add them to the ``JsonObject``. This may sound like an ugly solution since they might use it like this:

{% highlight java %}
People people = ...
people.insert(
  Json.createObjectBuilder()
      .add("id", 1)
      .add("firstName", "John")
      .add("lastName", "Doe")
      .build()
);
{% endhighlight %}

The above is quite ugly, the building of the JsonObject means duplicated logic. However, the user should realise that they can implement the interface ``PersonInput extends JsonObject`` -- all that building logic would be in the constructor of the ``PersonInput`` implementation, while calls to ``people.insert(...)`` will look like this:

{% highlight java %}
People people = ...
people.insert(
  new PersonInput(1, "John", "Doe")
);
{% endhighlight %}

Regarding the ``JsonObject`` input parameter there is still one more question: how should the client know what values to provide? This is the part where JavaDocs come in the play: it should all be thoroughly documented in the method's JavaDoc. I guess you can call it a good trade-off: the user has to do a little study before using your method but, on the other hand, the decoupling is very convenient for both of you.

The exact approach described above I used in the development of [docker-java-api](https://github.com/amihaiemil/docker-java-api). Most methods which are creating something on the server are expecting ``JsonObject`` as input and are returning interfaces which extend ``JsonObject`` (see, for instance, [Containers.create(...)](https://github.com/amihaiemil/docker-java-api/blob/master/src/main/java/com/amihaiemil/docker/Containers.java#L75) and [Container](https://github.com/amihaiemil/docker-java-api/blob/master/src/main/java/com/amihaiemil/docker/Container.java#L37)) -- thus, if Docker's API will evolve to require different Json inputs or return different Jsons, I won't necessarily have to change any models any time soon.

<b>P.S.</b> I hope you noticed the keyword in this article is "interface". It's yet another example of why interfaces are very important tools that any object should make use of.
