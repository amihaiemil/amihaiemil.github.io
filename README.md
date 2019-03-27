# amihaiemil.github.io

My blog about programming at https://www.amihaiemil.com

I'm trying to write a new article once a month on topics concerning mostly Object Oriented Programming (heavily influenced by the [EO Paradigm](https://www.elegantobjects.org/)), but also RESTful Web Services, Unit/Integration/UI Testing and DevOps. Here are the articles most interesting to read:

* [Selenium and JUnit, the right way!](https://www.amihaiemil.com/2017/01/24/selenium-and-junit-the-right-way.html)
  * UI automation tests should be agnostic of the used automation tool.
    The Selenium part should be completely encapsulated into fluent objects.
    It is a form of [POM](https://www.toptal.com/selenium/test-automation-in-selenium-using-page-object-model-and-page-factory) pattern, but much more object oriented.

* [Test Driven Rest](https://www.amihaiemil.com/2017/05/03/test-driven-rest.html)
  * Using tests and the same principle of abstraction and encapsulation as in the Selenium article, we can make sure that our RESTful API is truly
    navigable. In the end, ideally, we should have a *single set of tests* for both the UI Automation and the RESTful API, and also a Java client library which could
    be delivered to any 3rd party who wants to integrate with our web services.

* [Jakarta EE 8: JsonCollectors And The OOP Alternative](https://www.amihaiemil.com/2017/10/16/javaee8-jsoncollectors-oop-alternative.html)
  * This is a very specific article about JSON-P 1.1. However, it reveals the most important principle I've learned about OOP:
  never try to transform object A into B, but rather add a new implementation of B based on A.

* [Logic Should Hide In Plain Sight](https://www.amihaiemil.com/2018/07/22/logic-should-hide-in-plain-sight.html)
  * An article in which I explained where should the "business logic" find its place in an object-oriented codebase.

* [Java API For Docker](https://www.amihaiemil.com/2018/03/10/java-api-for-docker.html)
  * Another targeted article, but which explains the difference between an SDK and an API.

Most of the ideas I write about are also put in practice in my opensource projects so, no matter how crazy some of them may sound, you can see for yourself that they are indeed working.

If you like some of my ideas and would like me to review your project, consider [hiring me](https://www.amihaiemil.com/hireme/hire.html).
