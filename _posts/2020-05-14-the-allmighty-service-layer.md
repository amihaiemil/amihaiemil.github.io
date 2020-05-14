---
layout: post
title: "The Almighty Service Layer"
date: 2020-05-14
tags: oop architecture
author: amihaiemil
comments: true
shareable: true
preview: A short overview of the common 3-tier architecture and why it goes against
 the principles of OOP.
image: https://amihaiemil.github.io/images/the_missing_mouse.PNG
---

Some time ago, I wrote a [post](https://amihaiemil.com/2018/04/17/dolls-and-maquettes.html) in which I basically said that MVC and other similar programming patterns are more the work of a puppet master rather than the one of an engineer.

I also said many times throughout this blog that using get/set and "Service" classes causes your application to grow uncontrollably until it becomes such a mess that the only excuse for the absurd complexity is to simply call it an "enterprise solution".

In order for you to get a better picture of what I'm trying to say, let's take
a common example and work on it.

<figure class="articleimg">
 <img src="{{page.image}}" alt="The Missing Mouse">
 <figcaption>
 Tom & Jerry - The Missing Mouse, by  William Hanna and Joseph Barbera
 </figcaption>
</figure>

Take a common CRUD on ``Books``, for instance. You have 3 main parts:

* The (hopefully) RESTful API layer with the four HTTP endpoints.
* The Service layer which basically maps the input from the API layer to the DB entities and vice-versa.
* The Repository or Persistence layer which talks to the DB and handles the entities for us.

The problem now is the following: we all agree that the API layer should be clean of any logic and that it should only take care of marshalling/unmarshalling data and links; maybe some annotations for input validation and that's it. We also agree that the persistence/repository layer should only handle entities and the CRUD database operations.

This means, our ``BooksService`` which started with 4 straight-forward methods and some mapping logic is the only place where our application can actually grow. Here's how it looks initially:

{% highlight java %}
public class BooksService {

    @Inject
    private final BooksRepository repo;

    public boolean createBook(Book book) {
        BookEntity entity = BookMapper.mapToEntity(book);
        return this.repo.save(entity);
    }

    public Book getBookByISBN(String isbn) {
        BookEntity entity = this.repo.getBookById(isbn);
        return BookMapper.mapToModel(entity);
    }

    //delete and update methods here
}
{% endhighlight %}

If you ask me, the above class is already ugly, but let's get back to the problem: where and how will your codebase grow? Where will you add any other ``Book`` logic aside these CRUD operations?

Let's say, before you create a Book, you should call some web service in order to check that the Book's ISBN is actually correct and matches the author and the title. Where will this code go? I see a few options:

1. Right in the method ``BooksService.createBook(Book)``, before anything else.
2. In some private method of ``BookService``, which will be the first thing called by the ``createBook`` method.
3. Create a public method ``checkISBN(String)`` in a class called ``ISBNService``, that you will inject in this ``BooksService`` and call inside ``createBook``.
4. You could define an annotation to put on top of method ``createBook`` (the web-service call will be in the annotation's processor).

The first two are naive solutions, obviously. The third and fourth seem ok but they are still procedural. All you did was put a procedure (the web-service call) inside a class that you called a Service or a Processor and then used the framework's DI mechanisms to bring your procedure where you needed it: inside the ``BooksService``, when the ``createBook`` method is called.

So, you have just one tiny requirement besides the basic CRUD and you already injected methods here and there. There is also only one entity so far. Is this really clean and scalable? What will you do when more logic will be needed about these poor books? Same thing: add a method or a processor somewhere, until you won't know what's being used and by whom. Not to mention, how those procedures will be modified over time (``if/else`` blocks based on dubious flags, maybe?) to satisfy each client's edge cases.

But pay attention: there are also quite a few developers who will see no problem with the first two options. Your ``BooksService`` will grow beautifully with private methods calling each other with all sorts of  different flags and null values for missing parameters.

What's worse, you also lack the tools necessary to come up with an elegant solution: you have no interface to decorate, no constructors for composition (because we use DI annotations), nothing. The ``new`` operator, which is the father of any proper object, is nowhere to be seen.

On top of all this, where are the unit tests? Or at least some shady integration tests? They are missing because, when the project started, there was very little code to be tested:

* We don't test the API Layer - it's just a few HTTP-related annotations from the framework;
* We also don't test the persistence layer because it's just a few annotations from the ORM, which we trust;
* Then, nobody tested the ``BooksService`` because it was just a bunch of mapping logic which **"isn't worth testing"** or **"who tests getters and setters?"**. Now, of course, it's too late for testing. You have no idea how to mock your DI Container into your unit tests anyway. Besides that, new feature requests are flooding in at the same time;

Please, be honest: does the above sound familiar or not?

To summarize, I hope the above example shed more light on why this type of architecture is actually procedural and so damaging to code quality on the long run.

If you have other ideas on how to stick in that ISBN verification please, leave a comment bellow!
