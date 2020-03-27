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
image: https://amihaiemil.github.io/images/the_two_mouseketeers.PNG
---

I'll admit, the title is a bit of a lie. I actually believe JavaDocs are necessary everywhere: methods, attributes and classes. But let's focus on classes for now. I should also mention that this idea applies to all object-oriented programming languages. I suppose there must be an equivalent to JavaDocs in most languages.

There are many different opinions about the importance of JavaDocs. Some find them rather useless, some use them only in libraries and some might have no idea what they are. I believe they are useful and should be mandatory in all object-oriented software.
They are important in order for objects to be used correctly and they are also an indicator of the code's quality.

<figure class="articleimg">
 <img src="{{page.image}}" alt="The Two Mouseketeers">
 <figcaption>
 Tom & Jerry - The Two Mouseketeers, by  William Hanna and Joseph Barbera
 </figcaption>
</figure>

First of all, how should a class JavaDoc look? I suggest the following three points:
  - explain what the class is;
  - explain why/where it should be used;
  - offer a small code snippet exemplifying its usage;

It should also mention at least the author and the ``@since`` annotation,
indicating the version of the software with which the class has been introduced.

Here is an example:

{% highlight java %}
/**
 * This is an abstract JsonObject you can extend if you want
 * to make your object Json-Polymorphic. Just give it the original
 * JsonObject body and you won't have to implement all of JsonObject's
 * methods anymore. E.g.
 * <pre>
 *  public final class CarFromJson
 *      extends AbstractJsonObject implements Car {
 *   
 *      public CarFromJson(final JsonObject car) {
 *          super(car);
 *      }
 *      //only methods of Car here
 *  }
 * </pre>
 * @author amihaiemil
 * @since 0.0.1
 */
abstract AbstractJsonObject implements JsonObject {

    private final JsonObject delegate;

    AbstractJsonObject(final JsonObject delegate) {
        this.delegate = delegate;
    }
    //...
}
{% endhighlight %}

How can it be an indicator of code quality? Well, I believe if you cannot write a JavaDoc like the one above; if it's hard to find your words or clearly explain the purpose of a class in a few lines of text, then clearly the design is not ok: the scope of the class is too big, or it may do too many things, or it may be very hard to instantiate etc. Furthermore, if you cannot write a simple code example in ``<pre></pre>`` tags, that's a read flag as well.

By the way, the ``<pre>`` tag is the HTML tag which preserves encapsulated text exactly as it is, it doesn't change its indentation or anything. It's perfect for snippets of code. More about it [here](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/pre).

Still, none of what I said above really makes them "mandatory". There's one more very good reason to have them: naming of the classes. Classes should be components with a clear purpose and usability guideline in mind. Therefore, the name may not be trivial. Take a look at the following class:

{% highlight java %}
final class AssertRequest implements HttpClient {
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

Do you have any idea what it is? Or why is it named ``AssertRequest``? Heck, it doesn't even accept a Request as constructor parameter! My guess is: you've no idea what it is. So you try to open **"Call Hierarchy"** in your IDE to find where it is being used. But you find nothing, this is a class which has been written by another developer and it's never been used so far. Of course, the developer also forgot to push the unit tests for it.

Here is the JavaDoc that should be on top of it:

{% highlight java %}
/*    
 * Implementation of Apache's HttpClient which we can
 * use in our tests to intercept HTTP Requests, make assertions
 * on them and send back a mock HTTP Response.
 *
 * It is an alternative to having to use a real HttpClient and
 * starting an in-memory mock server.
 *
 * Use it like this:
 * <pre>
 *   @Test
 *   public void pingTrueIfResponseIsOk() throws Exception {
 *     MatcherAssert.assertThat(
 *       new LocalDocker(
 *         new AssertRequest(
 *           new Response(HttpStatus.SC_OK),
 *           new Condition(
 *             "HTTP Method should be GET!",
 *             req -> req.getRequestLine().getMethod().equals("GET")
 *           ),
 *         )
 *       ).ping(),
 *       Matchers.is(true)
 *     );
 *   }
 * </pre>
 * @author george
 * @since 0.0.1
 */
{% endhighlight %}

Now you know what it is and how to use it. Also, the name ``AssertRequest`` makes sense now: it was named like that in order to fit  elegantly in test cases. Looking at the test above,
it is clear that the mock HttpClient is actually making some assertions on the real HTTP Request that our Docker library is sending. Then, it returns the expected HTTP Response so we
can see that our library is handling responses properly.

Again, this depends very much on naming conventions. My take on naming is that we should name classes for what they are, but we should **also** consider where they will be used and by whom. Depending on this, we might decide to choose a name that fits best in the context of usage and, as you saw above, the name might not make much sense by just looking at the class itself. More about naming, [here](https://amihaiemil.com/2018/01/07/my-take-on-object-naming.html).

To summarise, I hope I gave you a few good arguments for the importance of class docs. In case
you don't know, the difference between a JavaDoc and a normal multi-line comment is that
there are CI/CD plugins which are generating documentation websites based on these docs.
Very useful for when you want to deliver a minimal technical documentation together with your
code artifacts.
