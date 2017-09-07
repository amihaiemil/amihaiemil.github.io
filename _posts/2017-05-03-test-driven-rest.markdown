---
layout: post
title: "Test Driven Rest"
date: 2017-05-03
tags: design rest testing
author: amihaiemil
comments: true
shareable: true
preview: Using tests to make sure that your REST api is navigable
image: http://www.amihaiemil.com/images/jerry_and_the_lion.png
---

First of all, let's agree that not any set of HTTP endpoints can be called RESTful.
There are many webapps which expose a few endpoints for rudimentary integrations
and claim to have "RESTful web services".

A set of HTTP methods is said to respect the REST paradigm only if they are [navigable](http://roy.gbiv.com/untangled/2008/rest-apis-must-be-hypertext-driven).
I think that such a programatic interface should expose more or less the entire functionality that the user sees on the UI.
It should be, if you like, the "backdoor" of your application, used by other apps in the same way a normal user
would navigate from one page to another.

I also said [here](http://www.amihaiemil.com/2016/05/07/what-is-hateoas.html) that,
when surfing through your API from the browser, you should get the feeling that the page did not load properly and the styling
is missing.

<figure class="articleimg">
 <img src="{{page.image}}" alt="Jerry And The Lion">
 <figcaption>
 Tom & Jerry - Jerry And The Lion, by  William Hanna and Joseph Barbera
 </figcaption>
</figure>

Since we want to make sure that both the front-end and the REST-end work fine and
offer the same functionality, it only makes sense to **use the same test code for both of them**.
It sounds strange, right? The code that tests the UI should also test the API. It is achievable,
provided that the architect pays as much attention on the tests as he does on the app's code (which, sadly, is not always the case).

I explained [here](http://www.amihaiemil.com/2017/01/24/selenium-and-junit-the-right-way.html)
how to encapsulate the WebDriver instance in order to have clear and maintainable UI tests.
In short, a good Selenium test should look like this:

{% highlight java %}
@Test
public void usernameIsDisplayed(){
    Github github = new SeleniumGithub(); //Github called with WebDriver
    UserProfile profile = github.user("amihaiemil");
    assertTrue("amihaiemil".equals(profile.username()));
}
{% endhighlight %}

Notice that the _test code_ does not care where the username comes from. It could come from the UI,
from a file or from an HTTP endpoint.

We only have to change the ``Github`` implementation in order to test its API:

{% highlight java %}
@Test
public void usernameIsDisplayed(){
    Github github = new RestfulGithub(); //Github called with an HTTP client
    UserProfile profile = github.user("amihaiemil");
    assertTrue("amihaiemil".equals(profile.username()));
}
{% endhighlight %}

Now, of course, you shouldn't see two sets of tests just for that line of code. In a real scenario,
I would dictate it via a system property, or a Maven build profile.

``Github`` and all the other interfaces (e.g. ``UserProfile``, ``MainDashboard`` etc)
are fluently coupled, so tests using these abstractions will gurantee that the endpoints are
navigable. Needless to say, same as in the Selenium case, _the only public class should be_ ``RestfulGithub``.

Here is how ``RestfulGithub`` could look:

{% highlight java %}
public final class RestfulGithub implements Github {
  private static final Request DEFAULT = new JdkRequest(
      "https://api.github.com"
  ).header("Accept", "application/json");
  private Request request;

  public RestfulGithub() {
      this(RestfulGithub.DEFAULT);
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
    this.request = req.uri().path("/users/").path(username).back();
  }
  @Override
  public String username() {
    return this.request.fetch()
      .as(JsonResponse.class)
      .json()
      .readObject()
      .getString("login");
  }
}
{% endhighlight %}

In this example, the [/users/{username}](https://api.github.com/users/amihaiemil) endpoint has been called with my Github username.
I used the [jcabi-http](https://github.com/jcabi/jcabi-http) client because it is much simpler and productive than,
for instance, Apache HttpClient.

Finally, if you follow this approach you will have to invest some time in designing the testing framework, but you will earn
the following:

  * A truly surfable API, which respects the HATEOAS principle
  * A single, maintainable, suite of tests for both the UI and the API
  * By the time the tests are written you have a client library which you can deliver
  to any third party that wants to integrate with your services

What do you think? How do you make sure your API respects the right paradigm?
