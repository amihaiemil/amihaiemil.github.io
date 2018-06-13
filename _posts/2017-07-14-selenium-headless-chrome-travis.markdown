---
layout: post
title: "Selenium With Headless Chrome On Travis CI"
date: 2017-07-14
tags: selenium headless travisCi
author: amihaiemil
comments: true
shareable: true
preview: How to run Selenium tests with Google Chrome Headless on Travis CI.
image: https://amihaiemil.github.io/images/the_truce_hurts_apple.png
---

How do you run any browser automation tool in a CI environment, like [Travis](https://travis-ci.org/), where there is no graphical browser? How can
your Selenium tests run in such conditions?

The answer is: you need a headless browser; that is, a browser which can work
without a GUI. Luckily, we don't have to use [phantomJS](http://phantomjs.org/) or [xvfb](https://docs.travis-ci.com/user/gui-and-headless-browsers/#Using-xvfb-to-Run-Tests-That-Require-a-GUI) anymore, since Google Chrome now supports [headless mode](https://developers.google.com/web/updates/2017/04/headless-chrome).

<figure class="articleimg">
 <img src="{{page.image}}" alt="The Truce Hurts">
 <figcaption>
 Tom & Jerry - The Truce Hurts, by  William Hanna and Joseph Barbera
 </figcaption>
</figure>

I found many posts about running chrome headlessly, but none that would describe exactly what I needed: <b>Selenium + Chrome + Travis</b>. It took me a while to set it up, so I decided to write this short post (even [Travis'](https://docs.travis-ci.com/user/gui-and-headless-browsers/#Using-the-Chrome-addon-in-the-headless-mode) documentation on the topic is rather confusing).

You have to do 3 things:

  * Get the Google Chrome stable addon
  * Get chromedriver
  * Pass the path to the Google Chrome executable to the WebDriver.

The first 2 points mean a few lines of code in your ``.travis.yml``:

{% highlight yaml %}
addons: # get google-chrome-stable
  chrome: stable
install: # Install ChromeDriver (64bits; replace 64 with 32 for 32bits).
  - wget -N http://chromedriver.storage.googleapis.com/2.30/chromedriver_linux64.zip -P ~/
  - unzip ~/chromedriver_linux64.zip -d ~/
  - rm ~/chromedriver_linux64.zip
  - sudo mv -f ~/chromedriver /usr/local/share/
  - sudo chmod +x /usr/local/share/chromedriver
  - sudo ln -s /usr/local/share/chromedriver /usr/local/bin/chromedriver
{% endhighlight %}

Now, in the ``script`` section you will be able to see both google chrome and chromedriver, like this

{% highlight yaml %}
script:
  - whereis google-chrome-stable
  - whereis chromedriver
{% endhighlight %}

The 3rd step is building your WebDriver (Java, Selenium 2.41.0):

{% highlight java %}
    final ChromeOptions chromeOptions = new ChromeOptions();
    chromeOptions.setBinary("/path/to/google-chrome-stable");
    chromeOptions.addArguments("--headless");
    chromeOptions.addArguments("--disable-gpu");

    final DesiredCapabilities dc = new DesiredCapabilities();
    dc.setJavascriptEnabled(true);
    dc.setCapability(
        ChromeOptions.CAPABILITY, chromeOptions
    );

    WebDriver chrome = new ChromeDriver(dc);
{% endhighlight %}

You see, the ``--headless`` and ``--disable-gpu`` options are needed. As I read in the
documentation, ``--disable-gpu`` won't be needed in future versions. Note that I didn't have to set the ``webdriver.chrome.driver`` system property, as the ``ChromeDriver`` object searches for it automatically. Don't forget to [set it](https://stackoverflow.com/questions/13724778/how-to-run-selenium-webdriver-test-cases-in-chrome) if you encounter any issues.

This is it. It seems to [work flawlessly](https://github.com/opencharles/charles#integration-tests) for me. It is a perfect replacement for phantomJS. I was previously using PhantomJsDriver (which implements WebDriver) from
[this](https://github.com/detro/ghostdriver) project, but I had some problems with phantomJs and I also read that its maintainer is [stepping down](https://groups.google.com/forum/#!msg/phantomjs/9aI5d-LDuNE/5Z3SMZrqAQAJ).
