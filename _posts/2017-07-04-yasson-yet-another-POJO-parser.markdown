---
layout: post
title: "Yasson: Yet Another POJO Parser"
date: 2017-07-04
tags: java oop design
author: <a href="https://www.github.com/amihaiemil" target="_blank">amihaiemil</a>
comments: true
shareable: true
preview: Yasson is the reference implementation of JSON-B and, unfortunately, version 1.0
 relies on POJOs' get/set design
---

These days, [Yasson](https://github.com/eclipse/yasson), which is the reference
implementation of Json binding ([JSR-367](https://jcp.org/en/jsr/detail?id=367)) for JavaEE 8,
has been [released](https://twitter.com/java/status/879716701461401605).

This is great news, JSR-367 means that we will now have a standard API for marshalling/unmarshalling
Json objects in java (if you're confused with regards to JavaEE 7's ``javax.json`` API, like I was, check [this](https://github.com/javaee/jsonb-spec/issues/51) out).
Something similar to JAXB api for XML marshaling/unmarshalling.

<figure class="articleimg">
 <img src="/images/matinee_mouse.PNG" alt="Matinee Mouse">
 <figcaption>
 Tom & Jerry - Matinee Mouse, by  William Hanna and Joseph Barbera
 </figcaption>
</figure>

I like the idea of JSON-B quite a lot. What I don't like is how Yasson implements it.
Apparently, like many other parsers, it relises on POJOs' getters and setters. This is how it works:

{% highlight java %}
class Student {

  private firstName;
  private lastName;

  public Student() {
    super();
  }

  //getters and setters
}
public class Main {
  public static void main(String[] args) {
    Student student = new Student();
    student.setFirstName("Mihai");
    student.setLastName("Andronache");

    Jsonb jsonb = JsonbBuilder.create();

    String json = jsonb.toJson(student);
    Student fromJson = jsonb.fromJson(json, Student.class);
  }
}
{% endhighlight %}

It gets the job done, but POJOs are the reason why Java "enterprise" applications turn into
mammoths with classes of 1k+ lines (I'm sure 1k lines is few for many). Because that Student will have
many more attributes, and these attributes will be read from somewhere and then set. Somewhere, there will be
about 50 lines of code calling setters; later, when we need to sanitize the Student, another 50 lines of code. You get the point.
POJOs turn a well designed OOP application into an unmaintainable pile of garbage.

I'm not going to go in-depth about interfaces, but here's how our student could look:

{% highlight java %}
public class StudentFromFile implements Student {

  private File file;

  public StudentFromFile(File f) {
    this.file = f
  }

  public String firstName() {
    return this.file.read("firstName");//pseudocode
  }

  public String lastName() {
    return this.file.read("lastName");
  }
}
{% endhighlight %}

We have a Student instance and we would like it to be marshallable by Yasson, so we write JsonStudent:

{% highlight java %}
public class JsonStudent implements Student {

  //Marshalled student
  private Student student;

  public JsonStudent(Student s) {
    this.student = s
  }

  @JsonbProperty("firstName")
  public String firstName() {
    return this.student.firstName();
  }

  @JsonbProperty("lastName")
  public String lastName() {
    return this.student.firstName();
  }
}
{% endhighlight %}

Then, we turn a Student to Json like this:

{% highlight java %}
Student student = new JsonStudent(
  new StudentFromFile(
    new File("student.txt")
  )
);
String json = JsonbBuilder.create().toJson(student);
{% endhighlight %}

Unfortunately, this does not work (at least in version 1.0). That ``@JsonbProperty`` only
dictates the name (key) of the value in the final Json and the class still requires getters for marshalling.
Hopefully, it will work in the next versions, as [Jackson](https://github.com/FasterXML/jackson) offers this
functionality.

For unmarshalling, you need setters and a default constructor. I honestly don't see the purpose, since you can
have a ``StudentFromJson`` work elegantly with a ``javax.json.JsonObject``:

{% highlight java %}
public class StudentFromJson implements Student {

  JsonObject student;

  public StudentFromJson(JsonObject s) {
    this.student = s
  }

  public String firstName() {
    return this.student.getString("firstName");
  }

  public String lastName() {
    return this.student.getString("lastName");
  }
}
{% endhighlight %}

A ``JsonObject`` can be obtained easily from a ``Reader`` or an ``InputStream``:

{% highlight java %}
InputStream content = ...;
JsonObject json = Json.createReader(content).readObject();
Student student = new StudentFromJson(json);
{% endhighlight %}

To summarize:
  * I don't like the fact that we have another Java library which encourages developers to use POJOs.
  * I don't see the purpose of marshalling, especially with POJOs; we can already do that with JSON-P.
  * I do like the fact that we have a standard API for turning objects into Json. Maybe other implementations
    or future versions of Yasson will drop support for getters/setters and work with annotations or some other, OOP design.

So please, make every effort necessary to avoid dumb, stale, baskets of data.
Make your objects work with something, implement interfaces; they shouldn't just hold
data. Please, let's see JavaEE8 as an opportunity to stop the POJO maddness.
