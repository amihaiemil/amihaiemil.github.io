---
layout: post
title: "Logic Should Hide In Plain Sight"
date: 2018-07-22
tags: oop design
author: amihaiemil
comments: true
shareable: true
preview: If your objects are supposed to be alive and at the same time
 respect design principles and best practices, then the question
 "Where is the business logic?" arrises.
image: https://amihaiemil.github.io/images/jerrys_cousin_call.png
---

I'm sure you've heard the words "dig in the code" before. It's the <strike>
<a href="/2017/03/22/puzzles-and-open-source.html">first</a></strike>
second thing a developer does when they are new on a project. They open the IDE, look for the app's
entry point and start ctrl+clicking until they find the "business logic". Then, they start reading the code in order to understand how the [puppets](/2018/04/17/dolls-and-maquettes.html) in the codebase are brought to life.

It's a common practice, it's also what I usually do, there's no way around it in today's mainstream practices. However, I realised that there should be no such place in an object-oriented application or package. Let's see where that business logic is actually gone.

<figure class="articleimg">
 <img src="{{page.image}}" alt="Jerry's Cousin">
 <figcaption>
 Tom & Jerry - Jerry's Cousin, by  William Hanna and Joseph Barbera
 </figcaption>
</figure>

Everything you read on this blog so far is incompatible with the idea of a "service layer" or "business classes". Once objects are [alive](/2017/11/04/but-how-do-you-work-without-a-model.html) and taking care of their own business, there is simply no point in having 3rd parties trying to tear them apart. All your classes should be small, represent something and do a little piece of work for you, while your code overall should look like a tree of objects and you should see the ``new`` operator much more often than in a traditional application.

The difference in this approach is that, when you ctrl+click from one method to the other, the business logic does not become clearer; to the contrary, you should find yet another abstraction and so on, until you find the lowest abstraction (e.g. opening of a ``File``) which may have nothing to do with the big picture.

So if all the digging only yields further abstractions, how can we understand how everything works together? The answer is: by taking a step back and observing how objects are instantiated. In object-oriented programming, business logic should not be visible in a method of a Service. Instead, it should be visible in how some objects are being composed/decorated together with other objects! The code in a method should never be enough to understand too much of the business. I believe, if that is the case, then some refactoring is needed: new implementations should be added, some of that object's work should be delegated etc.

Take a look at the following class (ctor omitted):

{% highlight java %}
public final class Hello implements Knowledge {

    private Knowledge notHello;

    @Override
    public Steps start(final Command com, final Log log) {
        final Steps resolved;
        if("hello".equalsIgnoreCase(com.type())) {
            resolved =  new GithubSteps(
                new SendReply(
                    String.format(
                        com.language().response("hello.comment"),
                        com.author()
                    )
                ),
                com
            );
        } else {
            resolved = this.notHello.start(com, log);
        }
        return resolved;
    }
}
{% endhighlight %}

It's one of the knowledges of a chatbot, at some point it will say "hello". But what are the overall steps, what does it do further, or what happens if the command is not "hello"? Going deeper into the ``this.notHello.start(...)`` will just lead you to the ``Knowledge`` interface. Even more, why is the method's name ``start``? Frustrating. However, if you go back a little, you should see how this object is used:

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

It is very much a matter of [naming](/2018/01/07/my-take-on-object-naming.html), but not only that: in other to achieve this effect we, as programmers, need to shift our way of thinking from methods to classes and objects. The first thing we should think about is how an object will be used, what is its place in the scheme: an object should be a component which integrates seamlessly with other objects, not a service to which other objects come and [ask](https://www.martinfowler.com/bliki/TellDontAsk.html) for something.

From the above idea we can conclude that each and every object should have a clear purpose. Furthermore, there should never be any object that "isn't worth testing" (like a ``get/set`` model, for instance): if a piece of code isn't worth testing, then it means it has no real place in the architecture and should not exist.

If I would have designed the bot in a traditional way, the construct above would probably be replaced by the following:

{% highlight java %}
/**
 * Fetch the steps for different situations.
 \*/
public class StepsService {

    public Steps getHello(final Command com) {
      //...
    }

    public Steps getRunScript(final Command com) {
      //...
    }

    public Steps getConfused(final Command com) {
      //...
    }

}
{% endhighlight %}

Aside the procedural code that this class is creating (now it's up to the client to figure out what steps they need and when), we have another issue: we don't know who is using the above "logic" in the application -- any client could inject it somewhere and if we change any line of code in any of the 4 ``get*`` methods, some clients might have problems.

So, you see, it's better to keep our objects small and cohesive while letting them build up the business logic for us, in the way they work on top of each other. All those objects will be covered by tests so there is no way (or it's certainly harder) to change a bit of something and to not realise that something is broken.
