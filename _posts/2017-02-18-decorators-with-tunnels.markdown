---
layout: post
title: "Tunnel Decorators"
date: 2017-02-18
tags: java oop design
author: <a href="https://www.github.com/amihaiemil" target="_blank">amihaiemil</a>
comments: true
shareable: true
preview: Using decorators to encapsulate the work with a badly designed library.
---

Sometimes, you are forced to use libraries written by other developers. Needless to say, these libraries often have annoying flaws such as:

 + bad encapsulation
 + poorly designed interfaces and classes
 + missing or poorly written (even idiotic) javadocs

In other words, you have no idea how to [use](http://www.baeldung.com/design-a-user-friendly-java-library) them properly
and if you somehow manage to get them running, there's a big risk that, gradually,
your own code will turn into an unmaintainable pile of garbage.

I was working recently with AWS and, to my surprise, [aws-java-sdk-core](https://github.com/aws/aws-sdk-java/tree/master/aws-java-sdk-core) is
quite a mess. I solved the issue using a flavor of decorators.
Read on.

<figure class="articleimg">
 <img src="/images/jerry_and_jumbo.png" alt="Jerry and Jumbo">
 <figcaption>
 Tom & Jerry - Jerry and Jumbo, by  William Hanna and Joseph Barbera
 </figcaption>
</figure>

Here is the code necessary to make a [signed](http://docs.aws.amazon.com/general/latest/gr/signing_aws_api_requests.html)
HTTP request to an AWS web service. Do you like it? I don't:

{% highlight java %}
    //Instantiate the request
    Request<Void> request = new DefaultRequest<Void>("es"); //?!?
    request.setHttpMethod(HttpMethodName.GET);
    request.setEndpoint(URI.create("http://..."));

    //Sign it...
    AWS4Signer signer = new AWS4Signer(); //?!?
    signer.setRegionName("...");
    signer.setServiceName(request.getServiceName());
    signer.sign(request, new AwsCredentialsFromSystem());

    //Execute it and get the response...?!?
    Response<String> rsp = new AmazonHttpClient(new ClientConfiguration())
        .requestExecutionBuilder()
        .executionContext(new ExecutionContext(true)) //?!?
        .request(request)
        .errorResponseHandler(new SimpleAwsErrorHandler())
        .execute(new SimpleResponseHandler<String>());
{% endhighlight %}

Marked with ``//?!?`` above is what's wrong with the API:

 + setters over setters
 + why is the ``Request`` parameterized?
 + lack of default ctors (why do you have to specify ``new ClientConfiguration()``?)
 + encapsulation flaws (why do you have to even see the class ``ExecutionContext``?
   What is it and what does it do? Its javadoc reads the following:
   ``"For testing purposes."`` - I'm not joking)

After I figured out the code above, at some point, I woke up with quite a few
methods in my code, which were all doing pretty much the same thing: building
and executing different requests. The above mess was duplicated
through-out my application. Time for refactoring!

I wanted the different types of HTTP requests to be decoupled, composable and easy
to unit test, so I wrote the following abstract class:

{% highlight java %}
public abstract class AwsHttpRequest<T> {

    public abstract T perform();

    abstract Request<Void> request();
}
{% endhighlight %}

There is a base implementation, which actually builds that ugly HTTP client and
executes the request, while other implementations (decorators) use that
``request()`` method to get the base request and configure it
(call setters on it or sign it).

This is one example of how I used those decorators (makes a signed search request
to the ElasticSearch AWS service):

{% highlight java %}
AwsHttpRequest<SearchResultsPage> search =
    new SignedRequest<>( //it is signed
        new AwsHttpHeaders<>( //it has some headers
            new AwsPost<>( //it is a POST
                new EsHttpRequest<>( //base request
                    "http://.../_search",
                    new SearchResponseHandler(),
                    new SimpleAwsErrorHandler(false)
                ),
                new ByteArrayInputStream(query.getBytes())
            ),
            headers
        )
    );
SearchResultsPage results = search.perform();
{% endhighlight %}


You can find all those classes [here](https://github.com/opencharles/charles-rest/tree/master/src/main/java/com/amihaiemil/charles/aws/requests).

Let me explain why I called them **"tunnel decorators"**. It's because the main method is
``perform()``, but we do not touch its result - that's not what we decorate. Instead, before calling ``base.perform()``, we call ``base.request()`` to get the underlying ``com.amazonaws.Request``, which is the object that we want to decorate. I personally see this ``request()`` method as a tunnel *beneath* all those decorators.

Furthermore, ``AwsHttpRequest`` is an abstract class, not an interface, because method ``request()`` has to have the ``default`` access modifier. It should be visible only to
these decorators, in their own package. Otherwise, there would be a "leak" in the tunnel, clients could do something like:

{% highlight java %}
    Request<Void> req = search.request()
    //...
{% endhighlight %}

and, of course, we do not want that.

If you study the classes, you'll notice most of the decorators perform the decoration
within the constructors, not inside ``perform()``, as it would be the most correct. See
[package-info.java](https://github.com/opencharles/charles-rest/blob/master/src/main/java/com/amihaiemil/charles/aws/requests/package-info.java#L27) for the explanation.

In the end, I found this approach to be an elegant way of isolating ugly and configurable
code, while keeping the decoupling, maintainability and testability of my classes.
What do you think? How would you have done it?
