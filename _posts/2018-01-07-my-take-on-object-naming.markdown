---
layout: post
title: "My Take On Object Naming"
date: 2018-01-07
tags: oop
author: amihaiemil
comments: true
shareable: true
preview: My two cents on object naming.
image: https://amihaiemil.github.io/images/jerrys_cousin_dw.png
---

This is one of the most common debates out there. Most people have their opinion about
this topic and nobody can actually tell which one is correct. Neither can I, of course,
but nevertheless, I decided that I might just share with you my ideas on the matter,
throw in my two cents, maybe it will help someone.

<figure class="articleimg">
 <img src="{{page.image}}" alt="Jerry's Cousin">
 <figcaption>
 Tom & Jerry - Jerry's Cousin, by  William Hanna and Joseph Barbera
 </figcaption>
</figure>

When I create a new class, the first thing I do is design its interface
(as you know, I believe that any object [must](http://www.amihaiemil.com/2017/08/12/how-interfaces-are-refactoring-our-code.html) implement at least one interface).
The name of the interface reflects, usually, what the object **is**, not what it **does** or what
other obejcts should do with it. There are very few cases where I find adjectives suitable, one of them
being ``Iterable``.

Then comes the implementation of that interface. Since there may be more implementations in the future, I mostly
name the object based on the encapsulated details. So, assuming the interface is ``HttpRequest``, if the first object
which obeys this interface uses ApacheHttpClient, its name could be ``ApacheRequest``. Then, another implementation may come, working with a different http client, maybe [jcabi-http](https://github.com/jcabi/jcabi-http), in which case the name would be ``JcabiRequest``.

So far, so good, probably nothing new, but here's the catch: depending on the pattern, the name of my classes won't necessarily make sense by themselves. For instance, somewhere in one of my projects, you'll see the following class:

{% highlight java %}
/**
 * Decorator which adds some HTTP headers on the decorated request.
 */
public final class HttpHeaders implements HttpRequest {
    //...
}
{% endhighlight %}

It doesn't look natural by itself, right? Well, it should be clear that this type of request
is not supposed to be used "alone", ever. Its constructor won't even allow it,
since it is supposed to wrap another ``HttpRequest``, maybe another decorator or maybe
a concrete request. Can you think of a better name? I believe that, when naming a class, we must also
take into account how it is going to be used, in what context or pattern -- if the names make sense when all
of them are put together, then you are fine. Adding useless nouns will only end up making noise.

HttpHeaders would be used as follows:

{% highlight java %}
    Map<String, String> headers = ...;
    HttpRequest request = new HttpHeaders (
        new Get(URI.create(...)),
        headers
    );
{% endhighlight %}

Furthermore, I hate useless suffixes. Let's take the most glorious example: "Factory". Have you noticed that, when an object is tasked with creating other objects nothing matters anymore? The context, the business, the domain, nothing! That poor object's name must have the suffix "Factory", otherwise the code just won't work.

I do have factory objects in my code, but the word "factory" is not present anywhere.
The project is a chatbot and one of the top-most abstractions is the "Knowledge", something that the bot *knows*
how to do. Each implementation of Knowledge creates a tree of Steps which represent it -- the bot needs to take one or more steps in order to fulfill any command. What I called "Knowledge" is actually a factory object, because it creates other obejcts, those Steps. Here is how the assembled code looks like:

{% highlight java %}
    final Conversation talk = new Conversation(
        new Hello(
            new RunScript(
                new Confused()
            )
        )
    );
    talk.start(command);
{% endhighlight %}

``Conversation``, ``Hello``, ``RunScript`` and ``Confused`` are all implementing ``Knowledge`` and they work together in a cascade mechanism, in order to find the proper steps to be executed. The snippet above translates to the following words: "A conversation is started, the bot can say 'hello', run some scripts for you or it may be confused if it does not understand the command".

Now here is the same snippet of code, with a more common naming:

{% highlight java %}
    final StepsFactory factory = new ConversationFactory(
        new HelloFactory(
            new RunScriptFactory(
                new ConfusedFactory()
            )
        )
    );
    factory.getSteps(command);
{% endhighlight %}

Which one is better? They will both work the same, it's just about readability.
To me, it's like a finished building vs a building which still has the construction scaffolding around it -- nobody
wants to know how the house has been built, all the scaffolding and instruments used, that is not important. Instead, everyone is eager to see the final construct and they should understand what it does without being clear what's been used to achieve it.

Another example of naming:

{% highlight java %}
Log log = new WebLog(
    new LogFile("/comdor/ActionLogs", this.id),
    "https://webapps.amihaiemil.com"
);
{% endhighlight %}

Why ``WebLog``? Because the encapsulated Log will ultimately be presented
to the user on the web UI. When calling ``log.address()``, the String "https://webapps.amihaiemil.com" will be
concatenated with the file's name to form a valid URL. Here is the [WebLog](https://github.com/amihaiemil/comdor/blob/master/src/main/java/co/comdor/WebLog.java) class, you can also see that the encapsulated variable of type ``Log``, the one which will be displayed to the user, is named "onServer" - because it is the log file which, in the end, will be fetched from the server.

This is pretty much the idea of how I handle naming. And, of course, I always write JavaDocs (Maven central won't even allow you to publish anything without them) so, if a name is not good enough, the JavaDoc on top of it will always shed light for you. What do you think? What naming conventions do you use?
