---
layout: post
title: "Teach Them The Language First"
date: 2018-01-24
tags: thoughts jakartaee
author: amihaiemil
comments: true
shareable: true
preview: Before learning to work with a framework, a developer should first understand
 the basis of everything, the language and the ecosystem that is built around it.
image: https://amihaiemil.github.io/images/triplet_trouble.png
embeddedTweet: <blockquote class="twitter-tweet"><p lang="en" dir="ltr">Today, a developer with many years of experience told me that they are not sure what version of Glassfish they are using at work. They didn&#39;t say it, but I got the feeling they were going to ask &quot;Does it matter?&quot;. So, do you think the version is relevant? <a href="https://twitter.com/hashtag/java?src=hash&amp;ref_src=twsrc%5Etfw">#java</a> <a href="https://twitter.com/hashtag/javaEE?src=hash&amp;ref_src=twsrc%5Etfw">#javaEE</a> <a href="https://twitter.com/hashtag/JakartaEE?src=hash&amp;ref_src=twsrc%5Etfw">#JakartaEE</a></p>&mdash; Mihai 🌵 (@amihaiemil) <a href="https://twitter.com/amihaiemil/status/1222540066561691648?ref_src=twsrc%5Etfw">January 29, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
---

I wanted to write this article for some time now, but I wasn't sure if it's such a spread phenomenon or maybe just my experience. [This](https://twitter.com/olivergierke/status/953642136456630274) tweet made me decide to write it.

I think these days, frameworks and platforms have grown and have abstracted our work so much that it is very easy to spend 10 years in a company, doing Spring, Java EE, Ruby On Rails or .NET and not be able to distinguish them from the language itself. Some may argue that this is not a big deal, since nobody is going to redo all the work that these giants have already done -- it's true, nobody is going to do that, even if they have many flaws, it would simply be too expensive. Besides, it takes years to grow a community around something.

However, I still believe that any developer should understand what is behind these things and at least have an idea about how a web application would look if it were built from scratch, using vanilla Java, Ruby or C#. The point is not to avoid the frameworks, it is to understand them and not tie your entire knowledge to one in particular. To elaborate the idea, let's take a junior developer and see how his/her journey into the field might look like.

<figure class="articleimg">
 <img src="{{page.image}}" alt="Triplet Trouble">
 <figcaption>
 Tom & Jerry - Triplet Trouble, by  William Hanna and Joseph Barbera
 </figcaption>
</figure>

It all starts with the hiring. Of course, the company figures that it has to spend time teaching this person how to write Java. So, the first part of the onboarding process is spending some weeks reading OOP basics and the absolutely must-read, Bruce Eckel's ["Thinking in Java"](https://www.amazon.com/Thinking-Java-4th-Bruce-Eckel/dp/0131872486).

In a few weeks the new developer, who still doesn't have a clear picture of how to build anything valuable with Java, is given more material: usually [Java EE](http://www.oracle.com/technetwork/java/javaee/overview/index.html) or [Spring](https://spring.io/guides). Reading this does not shed much light either, now they just know that this is the "framework" ("some libraries") used in the company's projects and that it involves a few annotations.

Having read everything, they're ready to go, they start working on a project with small tasks, one tiny step at a time. After a year or two, they are confident in their knowledge and they might even participate in new projects with the same tech stack.

So where's the problem in all this? The problem is that the company only taught the developer the things used in-house and just enough so he/she can start "learning by doing". Nobody stood near them to **talk**, clearly explain the concepts; they were left with what they understood in those many hours of reading. Then, they skipped quite some steps: they worked on web applications without even learning the basics of HTTP; they worked with a database without even understanding what JDBC is -- "you know, just use this annotation and it will work, this is Java". To a developer with this kind of training (I was trained like this and I believe that a lot of developers go through a similar process) this is how Java exposes an HTTP endpoint:

{% highlight java %}

@Path("/books")
public class Books {

   @GET
   @Path("/{id}")
   public Response getBook(@PathParam("id") String id) {
     //...
   }
}
{% endhighlight %}

Instead, before learning about all these abstractions built by Java EE (or those built by Spring), they should have seen how bare-bones Java actually exposes HTTP endpoints -- first the theory, then see how a socket is built in Java, then servlets, then understand what problems (and how) does the framework solve.

If the tools used are not distinguished from the language, then chances are very big that said tools won't be used correctly: Java EE deployables of 100 MB, because they did not understand that most libraries are provided by the platform; Spring applications deployed on a Java EE platform because they do not know the difference between a simple servlet container like Tomcat and JBoss or Glassfish etc. Not to mention they won't have a clue about known bugs or really understand new, more complex, features.

Anyway, some years fly, somehow everything comes together and they now <strike>understand</strike> know the current version in and out and are productive for the company. On the other hand, it is not clear how come there is Java 9, but Java EE 8 just came out this year, shouldn't it be the same version? Take the platform away, or ask them to look into alternatives and I think it will be very hard (yet, by most standards, they are far from the Junior level).

This is basically what is happening in the Java world. The others have exactly the same problem: Ruby On Rails is everywhere, how many actually know how to develop an application with Ruby? .NET is the dictator of the C# world, take it away (maybe it is  enough to take Visual Studio away) and ask them to sketch a webapp with C#; PHP is hidden with Symphony or Laravel; Python with Django etc.

Don't get me wrong, I am not saying anyone will ever have to write something from scratch, nobody will, it is just theory. All I am saying is that a clear understanding of the whole ecosystem is necessary. Knowing which is the basis and which is just a  layer on top (and **how** it could be changed) is one of the keys for quality software.
