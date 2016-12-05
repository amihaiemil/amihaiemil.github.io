---
layout: post
title:  "Project Charles"
date:   2016-05-24
categories: web
comments: true
preview: A simple and smart Java webcrawler.
---

This library came to my mind while designing other project of mine which I will hopefully be able to launch soon.
I needed a **simple-to-use** webcrawling library which, most importantly, had to be able to **render dynamic content**
of a page (i.e. Ajax; content that is loaded on the page via javascript)

Having these requirements, I came up with Charles (if you wonder about the name, well, I have no explanation for it; it's just a name I like).

1) Simple in design and use: all you have to do is instantiate a [WebCrawl](https://github.com/opencharles/charles/blob/master/src/main/java/com/amihaiemil/charles/WebCrawl.java) and
call method ``crawl()``. When instantiating the WebCrawl, you have to give it an implementation of [Repository](https://github.com/opencharles/charles/blob/master/src/main/java/com/amihaiemil/charles/Repository.java) - what
do you want to happen with the crawled ``WebPage``s? Where should they go? This is your part of the deal, you will have to implement this interface, since I cannot know what everyone wants to do with the crawled content.
Until you figure out your own Repository implementation, and just to get you playing with this lib (or unit test code), you can use [InMemoryRepository](https://github.com/opencharles/charles/blob/master/src/main/java/com/amihaiemil/charles/InMemoryRepository.java)
or [JsonFilesRepository] (https://github.com/opencharles/charles/blob/master/src/main/java/com/amihaiemil/charles/JsonFilesRepository.java)

<b>E.g.</b>
{% highlight java %}
WebDriver driver = ...; //Selenium WebDriver
Repository repo = ...; //Awesome repository implementation here. Maybe send the pages to a DB, or to an ElasticSearch instance up in AWS? You decide.
WebCrawl graph = new GraphCrawl("http://www.amihaiemil.com", this.driver, new IgnoredPatterns(), repo);
graph.crawl();
{% endhighlight %}

Above is a simple example of how your crawling code should look when using this lib. Please, take a little time to study the [unit tests](https://github.com/opencharles/charles/tree/master/src/test/java/com/amihaiemil/charles)
and completely understand all the clases involved.

For now, 2 implementations of [SitemapXmlCrawl](https://github.com/opencharles/charles/blob/master/src/main/java/com/amihaiemil/charles/SitemapXmlCrawl.java) and
[GraphCrawl](https://github.com/opencharles/charles/blob/master/src/main/java/com/amihaiemil/charles/GraphCrawl.java). There are also some decorators provided, to help you retry the crawl in case of a 
RuntimeException (which happen every now and then with Selenium... some miscomunication with the browser, too slowly loading content etc)

2) Rendering of dynamic content. For this purpose exactly, the lib is implemented using [Selenium WebDriver API] (http://www.seleniumhq.org/projects/webdriver/). You can pass to a
WebCrawl any implementation of WebDriver: FirefoxDriver, ChromeDriver etc. Personally, I use [PhantomJSDriver](https://github.com/detro/ghostdriver) both in other and integration tests, in order
to avoid having to open a browser.

Check the [README.md](https://github.com/opencharles/charles/blob/master/README.md) for the maven dependency and info on how to contribute.
If you find any bugs or have any questions about this project, please, open an issue [here](https://github.com/opencharles/charles/issues/new).
