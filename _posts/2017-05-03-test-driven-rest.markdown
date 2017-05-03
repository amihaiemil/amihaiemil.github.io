---
layout: post
title: "Test Driven Rest"
date: 2017-05-03
tags: design rest testing
author: <a href="https://www.github.com/amihaiemil" target="_blank">amihaiemil</a>
comments: true
shareable: true
preview: Using tests to make sure that your REST api is navigable
---

First of all, let's agree that not any set of HTTP endpoints can be called RESTful.
There are many webapps which expose a few endpoints for rudimentary integrations
and claim to have "RESTful web services".

A set of HTTP methods is said to respect the REST paradigm only if they are [navigable](http://roy.gbiv.com/untangled/2008/rest-apis-must-be-hypertext-driven)).
I think that such a programatic interface should expose more or less the entire functionality that the user sees on the UI.
It should be, if you like, the "backdoor" of your application, used by other apps in the same way a normal user
would navigate from one page to another.

I also said [here](http://www.amihaiemil.com/2016/05/07/what-is-hateoas.html) that,
when surfing through your API from the browser, you should get the feeling that the page did not load properly and the styling
is missing.

<figure class="articleimg">
 <img src="/images/trap_happy.PNG" alt="Trap Happy">
 <figcaption>
 Tom & Jerry - Trap Happy, by  William Hanna and Joseph Barbera
 </figcaption>
</figure>

Since we want to make sure that both the front-end and the REST-end work fine and
offer the same functionality, it only makes sense to **use the same test code for both of them**.
It sounds strange, right? The code that tests the UI should also test the APi. It is achievable,
provided that the architect pays as much attention on the tests as he does on the app's code (which, sadly, is not always the case).

I explained [here](http://www.amihaiemil.com/2017/01/24/selenium-and-junit-the-right-way.html)
how to encapsulate the WebDriver instance in order to have clear and maintainable UI tests.
In short, a good Selenium test should look like this:

{% highlight java %}
@Test
public void usernameIsDisplayed(){
    Github github = new SeleniumGithub(); //Github called with WebDriver
    String username = github.user("amihaiemil").username();
    assertTrue("amihaiemil".equals(username));
}
{% endhighlight %}

Notice that the _test code_ does not care where the username comes from. It could come from the UI,
from a file or from an HTTP endpoint.

We only have to change the ``Github`` implementation in order to test its API:

{% highlight java %}
@Test
public void usernameIsDisplayed(){
    Github github = new RestfulGithub(); //Github called with an HTTP client
    String username = github.user("amihaiemil").username();
    assertTrue("amihaiemil".equals(username));
}
{% endhighlight %}

Now, of course, you shouldn't see two sets of tests just for that line of code. In a real scenarion,
I would dictate it via a system property, or a Maven build profile.

``Github`` and all the other interfaces (e.g. ``UserProfile``, ``MainDashboard`` etc)
are fluently coupled, so tests done using these abstractions will gurantee that the endpoints are
navigable and give the feeling of an HTML page without styling. Needless to say, same as in
the Selenium case, the only public class should be ``RestfulGithub``.

Here is how ``RestfulGithub`` could look:

{% highlight java %}
public final class RestfulGithub implements Github {
  private static final Request DEFAULT = new JdkRequest(
      "https://api.github.com"
  ).header("Accept", "application/json");
  private Request request;

  public RestfulGithub() {
      this(RtVersionEye.DEFAULT);
  }
  public RestfulGithub(final String token) {
      this(
        RestfulGithub.DEFAULT.header(
          "Authorization",
          String.format("token %s", token)
        )
      );
  }
  public RestfulGithub(final Request req) {
     this.request = req;
  }
  ...
  public UserProfile user(String username) {
    return new RsUserProfile(this.request, username);
  }
  ...
}
{% endhighlight %}

And here is ``RsUserProfile``:

{% highlight java %}
final class RsUserProfile implements UserProfile {
  private Request request;
  RtUserProfile(final Request req, final String username) {
    this.req = req.uri().path("/users/").path(username).back();
  }
  @Override
  public String username() {
    this.req.fetch()
      .as(JsonResponse.class)
      .json()
      .readObject()
      .getString("login");
  }
}
{% endhighlight %}

I used the [jcabi-http](https://github.com/jcabi/jcabi-http) client because it is much simpler and productive than
Apache HTTP client for instance. You can find the whole code from above [here](/#github), as well.

Finally, if you follow this approach you will have to invest some time in designing the testing framework, but you will earn
the following:

1) A truly surfable API, which respects the HATEOAS principle
2) A single, maintainable, suite of tests for both the UI and the API
3) By the time the tests are written you have a client library which you can deliver
to any third party that wants to integrate with your services

What do you think? How do you make sure your APi respects the right paradigm?
