---
layout: post
title: "Class JavaDocs Should Be Mandatory in OOP"
date: 2020-03-27
tags: oop
author: amihaiemil
comments: true
shareable: true
preview: In proper object-oriented software, where each class is supposed to be a component used in a certain place,
  class JavaDocs are crucial for maintenance and proper usage of the objects.
image: https://amihaiemil.github.io/images/the_truce_hurts3.PNG
---

I'll admit, the title is a bit of a lie. I actually believe JavaDocs are necessary everywhere: methods, attributes and classes.
But let's focus on classes for now. I should also mention that this idea applies to all object-oriented programming languages.
I am talking about JavaDocs becuase I'm a Java guy.

There are many different opinions about the importance of JavaDocs. Some find them rather useless, some use them only in libraries,
and some might even not have an idea what they are. I believe they are useful and should be mandatory in all object-oriented software. 
They are important in order for objects to be used correctly and they are also an indicator of the architecture's quality.

<figure class="articleimg">
 <img src="{{page.image}}" alt="The Truce Hurts">
 <figcaption>
 Tom & Jerry - The Truce Hurts, by  William Hanna and Joseph Barbera
 </figcaption>
</figure>

First of all, how should a class JavaDoc look? I suggest the following pattern: what the class is, where it should be used and how. Here is an example:

{% highlight java %}
/**
 * This is an abstract JsonObject you can extend if you want
 * to make your object Json-Polymorphic. Just give it the original
 * JsonObject body and you won't have to implement all the methods yourself
 * everywhere. E.g.
 * <pre>
 *  public final class CarFromJson extends AbstractJsonObject imlements Car {
 *      public CarFromJson(final JsonObject carRepresentation) {
 *          super(carRepresentation);
 *      }
 *      
 *      //...
 *  }
 * </pre>
 */
abstract AbstractJsonObject implement JsonObject{
    
    private final JsonObject delegate;
    
    AbstractJsonObject(final JsonObject delegate) {
        this.delegate = delegate;
    }
    
    //all methods of JsonObject implemented
    //to simply delegate calls to this.delegate
}
{% endhighlight %}

How can it be an indicator of code quality? Well, I believe if you cannot write a JavaDoc like the one above; if it's hard to find your words or clearly explain the purpose of a class in a few lines of text, then clearly the design is not ok: the class has a too big scope, it may not be specialized enough etc. Not to mention, if you can't write a simple snippet of code in ``<pre></pre>`` tags, that's a read big smell.

Still, none of what I said above really makes them "mandatory". There's one more very good reason to have them: naming of the classes. Classes should be components with a clear purpose and usability guideline in mind. Therefore, the name may not be trivial. Take a look at the following class:

{% highlight java %}
final class AssertRequest implement HttpClient{
    //...
    
    AssertRequest(
        final HttpResponse response,
        final Condition... conditions
    ) {
        this.response = response;
        this.conditions = Arrays.asList(conditions);
    }
    
    //...
}
{% endhighlight %}

Do you have any idea what it is? Or why is it named ``AssertRequest``? My guess is: no. So you try to open "Call Hierarchy" in your IDE to find where it's used. But you find nothing. This is a class which has been written by another developer and it's up to you to make use of it. Here is the JavaDoc that should be on top of it:

{% highlight java %}
/*
      Implementation of Apache's HttpClient which we can use in our tests
      to catch the sent requests, make assertions on them and send back a mock
      HTTP Response if everything is alright. Use it like this:
      <pre>
          @Test
          public void pingTrueIfResponseIsOk() throws Exception {
            MatcherAssert.assertThat(
              new LocalDocker(
                new AssertRequest(
                  new Response(HttpStatus.SC_OK, ""),
                  new Condition(
                    "Method should be a GET",
                    req -> req.getRequestLine().getMethod().equals("GET")
                  ),
                ),
                "v1.35"
              ).ping(),
            Matchers.is(true)
          );
      </pre>
 */
{% endhighlight %}

Now also the name ``AssertRequest`` makes sense. It was named like that in order to fit in the tests. Looking at the test above,
it is clear that the mock HttpClient is actually making some asserts on the real HTTP Request that our Docker library is sending.

Again, this argument depends very much on naming conventions. My take on naming is that we should name classes for what they are, but we should **also** think where will they be used, in what context -- depending on this, we might decide to choose a name that fits best in the context of usage and, as you saw above, the name might not make much sense by just looking at the class. More about naming, [here](https://amihaiemil.com/2018/01/07/my-take-on-object-naming.html). 

