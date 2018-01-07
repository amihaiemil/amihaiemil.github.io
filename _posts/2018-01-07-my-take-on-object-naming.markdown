---
layout: post
title: "My Take On Object Naming"
date: 2018-01-07
tags: oop
author: amihaiemil
comments: true
shareable: true
preview: My ideas about how an object should be named.
image: https://amihaiemil.github.io/images/jerry_and_the_goldfish.PNG
---

This is one of the most common debates out there. Most people have their opinion about
this topic and nobody can actually tell which one is correct. Neither can I, of course,
but nevertheless, I decided that I might just share with you my ideas on the matter,
throw in my two cents, maybe it will help someone.

<figure class="articleimg">
 <img src="{{page.image}}" alt="Jerry And The Goldfish">
 <figcaption>
 Tom & Jerry - Jerry And The Goldfish, by  William Hanna and Joseph Barbera
 </figcaption>
</figure>

When I create a new class, the first thing I do is design its interface
(as you should know by now, I believe that any object must implement at least one interface).
The name of the interface reflects, usually, what the object **is**, not what it **does** or what
other obejcts should do with it. There are very few cases where I find adjectives suitable, one of them
being ``Iterable``.

Then comes the implementation of that interface. Since there may be more implementations in the future, I mostly
name the object based on the encapsulated details. So, assuming the interface is ``HttpRequest``, if the first object
which obeys this interface uses ApacheHttpClient, its name could be ``ApacheRequest``. Then, other objects may come, working with a different http client, maybe jcabi-http, in which case the name would be ``JcabiRequest``.

So far, so good, probably nothing new, but here's the catch: depending on the pattern, the name of my classes won't necessarily make sense by themselves. For instance, somewhere in one of my projects, you'll see the following class:

{% highlight java %}
/**
 * Decorator HttpRequest which adds some HTTP headers on the decorated request.
 \*/
public final class HttpHeaders implements HttpRequest {
    //...
}
{% endhighlight %}

It doesn't make sense by itself, right? An http request named "HttpHeaders"? Yes, because this type of request
is not supposed to be used alone, ever! It's constructor won't even allow it. It is, in fact, a *decorator* which adds some headers to the decorated request. Can you think of a better name? I cannot, because when using a design pattern, the name of the classes must make sense and look good when those classes are actually put together.

HttpHeaders would be used as follows:

{% highlight java %}
    Map<String, String> headers = ...;
    HttpRequest request = new HttpHeaders (
        new HttpPost(URI.create(...)),
        headers
    );
{% endhighlight %}

Furthermore, I hate useless suffixes -- and sadly, the habit of using suffixes seems printed deep in the
brain of most developers. Let's take the most glorious example: "Factory". Have you noticed that, when a poor object
is tasked with creating other objects, nothing matters anymore? The context, the business, the domain -- nothing! That poor object's name must have the suffix "Factory", otherwise the code just won't work.

I am currently working on a bot, written in Java.
One of the top-most abstractions is the "Knowledge", something that the bot *knows*
how to do. Each implementation of Knowledge creates a tree of Steps which represent it -- the bot needs to take one or more steps in order to fulfill any command. In other words, what I called "Knowledge", in my code, is actually a factory object, because it creates other obejcts, those steps. But I never used the word "factory" anywhere. Here is how the assembled code looks like:

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

``Conversation``, ``Hello``, ``RunScript`` and ``Confused`` are all implementing ``Knowledge`` and they work together,
in a cascade mechanism, in order to find the proper steps to be executed. The snippet above translates to the following words: "The bot starts a conversation, it can say 'hello', run some scripts for you or it may be confused if it does not understand [the command]".

Now, here is the same snippet of code, with a more common naming:

{% highlight java %}
    final StepsFactory talk = new ConversationFactory(
        new HelloFactory(
            new RunScriptFactory(
                new ConfusedFactory()
            )
        )
    );
    talk.start(command);
{% endhighlight %}

Which one is better? They will both work the same, of course, it's just about readability.
To me, it's like a finished building vs a building which still has the construction scaffolding around it -- nobody
wants to know how the house has been built, from the outside, that is not important. Instead, everyone is eager to see the final construct and they should understand everything from it alone.
