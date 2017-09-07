---
layout: post
title:  "Selenium and JUnit, the right way!"
date:   2017-01-24
tags: junit selenium java
author: amihaiemil
comments: true
shareable: true
preview: Are you writing Selenium tests with JUnit? If you are not
 a good OOP programmer, you're probably doing it wrong.
image: http://www.amihaiemil.com/images/truce_hurts.png
---

There are many tutorials out there about how to use Selenium with JUnit to write automated tests for the UI. However, most (if not all of them) only show you how to play around with a ``WebDriver`` instance, fetch a web-page, call a ``findBy*`` method and make some assertions.

Take [this](http://toolsqa.com/java/junit-framework/junit-test-selenium-webdriver/) article, for example. It's currently the first on Google, when you search for "selenium and junit". If you write your tests in that manner you will eventually end up in a lot of trouble. This post tries to explain why and offer a much better alternative.

<figure class="articleimg">
 <img src="{{page.image}}" alt="The Truce Hurts">
 <figcaption>
 Tom & Jerry - The Truce Hurts, by  William Hanna and Joseph Barbera
 </figcaption>
</figure>

The truth is, you must have strong OOP knowledge in order to use Selenium properly. Simply put, if your tests "know" anything about Selenium or WebDriver, you are making a mistake. This is wrong:

{% highlight java %}
@Test
public void usernameIsDisplayed(){
    WebDriver firefox = new FirefoxDriver();
    driver.get("https://www.github.com/amihaiemil");
    String username = driver
        .findElement(By.className("vcard-username")
        .getText();
    assertTrue("amihaiemil".equals(username));
}
{% endhighlight %}

Why is it wrong? Well, imagine you have 1000 tests written like this and someone comes and says one of the following:

* Let's test on different browsers. Also, how do we set it up on Travis CI? We don't
have Firefox or other graphical browser on that server
* Something doesn't work right, some pages don't load
fast enough and most of the tests fail. We should fix this
* It is mandatory that, in some cases,
a login is performed before doing any other action
* Why are there so many different flows?
 All the tests should have a common framework.

My point is that such tests are **unstable and unmaintainable**. For one, Selenium always tends to break because of some timing issues and other reasons that have nothing to do with your test code (still, you'll have to fix it somehow; worst case scenario, by using ``Thread.sleep()``). Second, you have 1000 tests all written differently and performing different flows. Lastly, your UI tests are 100% coupled with Selenium - tomorrow you might decide to change the technology, why should you rewrite your tests?

What is the answer to this? Surely, it is none of the tricks that JUnit offers - things such as parameterized runners or setup/destroy methods.

The answer is **abstraction and encapsulation**. Before writing any actual tests, you should
encapsulate the ``WebDriver`` instance in some objects. You should abstract your application
in a set of interfaces and methods that wrap and hide the actual implementation.

Done right, the test above should look something like this:

{% highlight java %}
@Test
public void usernameIsDisplayed(){
    Github github = new SeleniumGithub();
    String username = github.user("amihaiemil").username();
    assertTrue("amihaiemil".equals(username));
}
{% endhighlight %}

First advantage that comes to mind is that everything is in one place. If tomorrow
the UI guys decide that the username element shouldn't have the ``vcard-username``
class anymore, no problem, we have to change it in only one place, not in all our
tests that happen to have something to do with that element.

Also, if we stumble upon classic Selenium issues, like problems with page loading time,
we fix them in one place as well. The used driver is not a problem either - if someone comes and says we should change it, we simply switch it from inside our abstraction. You might not even have to change code, it could all be driven by a system property, for instance.

What about flow restrictions? Is it possible, with such a design, to make sure
that all the tests perform all the mandatory steps? Of course it is: by using
interfaces and access modifiers wisely (these two are very powerful tools that
many developers seem to not take seriously).

Let's say you want to make sure that before checking anything related
to the profile settings page, the test has gone through the login page and
successfully authenticated the user. Here is how your abstraction would look like:

{% highlight java %}
public final class SeleniumGithub implements Github {
    private final WebDriver driver;
    private final String username;
    private final String pwd;
    public SeleniumGithub() {
      this ("", "");
    }
    public SeleniumGithub (String username, String pwd) {
      this.username = username;
      this.pwd = pwd;
      this.driver = new FirefoxDriver();
    }
    public MainDashboard login() {
      this.driver.get("https://github.com/login");
      //find and fill the username and pwd fields
      //press login
      return new SlMainDashboard(this.driver);
    }
    public UserProfile user(String username) {
      this.driver.get("https://www.github.com/" + username)
      return new SlUserProfile(driver);
    }
    ...
}
{% endhighlight %}

The class above is a gist of what your design should look like. If you look closely, you'll notice it exposes only interfaces, not actual implementations. All the implementations (e.g. ``SlMainDashboard`` and ``SlUserProfile``) are **hidden** (package protected), except the entry class.

This not only provides encapsulation, it also gives us control. Since no class can be instantiated, other than the entry point, it means that we fully guide the client through the framework; we know exactly where he is at any given time and what actions have been performed in order to get him there.

In other words, you will never see something like this:

{% highlight java %}
@Test
public void settingsPageIsDisplayed() {
  MainDashboard dashboard = new SlMainDashboard(new FirefoxDriver());
  //...
}
{% endhighlight %}

That would be wrong, it would end up with the same issues that I described at the beginning.
Instead, the test should look like this:

{% highlight java %}
@Test
public void settingsPageIsDisplayed() {
  Github github = new SeleniumGithub("username", "password");
  MainDashboard dashboard = github.login();
  Settings settings = dashboard.settings();
  //...
}
{% endhighlight %}

The code where the driver looks for the 'Settings' button and clicks it,
is inside that ``settings()`` method's implementation.

Now that we have everything in place, we have both easy maintainability and
control over the tests. Again, notice the reusability: you could pass this library
to different people writing tests and be sure that all of them are using the same framework.

To end this article, keep in mind that Selenium is a complex and volatile tool. Because of that, we
must have a real, proper architecture behind our UI tests. If you simply start writing
procedural code to fetch elements and make some assertions, then your tests will most likely end up always being skipped because nobody will have the nerves to fix and/or stabilize them.

What do you think? Do you see other solutions?

**P.S.** At some point after I wrote this article, someone asked for the code. [Here](https://github.com/amihaiemil/selenium-github-example) it is.

**P.S. 2** You can use the same approach (actually, reuse this test code), to make sure that your REST api respects the
HATEOAS principle. See [here](http://www.amihaiemil.com/2017/05/03/test-driven-rest.html).
