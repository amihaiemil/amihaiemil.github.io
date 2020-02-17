---
layout: post
title: "Clientside Search With ElasticLunr.js"
date: 2020-02-17
tags: opensource
author: amihaiemil
comments: true
shareable: true
preview: If you have a static blog built with Jekyll or Hugo,
 ElasticLunr.js might be the perfect options for implementing Search.
image: https://amihaiemil.github.io/images/a_mouse_in_the_house2.png
---

Any blog or documentation website needs Search functionality. You can achieve this in many ways, and most likely a server-side solution will be chosen. However, if you don't want to deal with any backend, you can implement it all on the clientside, thanks to [lunr.js](https://github.com/olivernn/lunr.js). 

I first discovered Lunr.js a few years ago, but I didn't use it since I decided to go with a server-side option (I needed the dynamic content to be intexed as well). A few weeks ago, however, I've decided to go with the client-side approach and I found [ElasticLunr.JS](http://elasticlunr.com/) which is basically a wrapper over Lunr.js, to make things easier.

<figure class="articleimg">
 <img src="{{page.image}}" alt="A Mouse In The House">
 <figcaption>
 Tom & Jerry - A Mouse In The House, by  William Hanna and Joseph Barbera
 </figcaption>
</figure>

Creating the Index, is as easy as (courtesy of ElasticLunr.com):

{% highlight javascript %}
//declare the index and its format
var index = elasticlunr(function () {
    this.addField('title');
    this.addField('body');
    this.setRef('id');
});

//add content to the index
var documentToIndex = {
    "id": 1,
    "title": "Oracle released its latest database Oracle 12g",
    "body": "Yestaday Oracle has released its new database Oracle 12g, this would make more money for this company and lead to a nice profit report of annual year."
}
index.addDoc(documentToIndex);
{% endhighlight %}

Searching is as easy as follows:

{% highlight javascript %}
var resultsJsonArray = index.search("test");
//this will return a JsonArray with the following format:

[
  0: {
      ref: "4"
      score: 3.4764451146882474
      doc: {
          id: 4
          title: "Polymorphic Input/Output Data"
          link: "https://www.amihaiemil.com/2019/03/31/polymorphic-input-output-data.html"
          preview: "Using polymorphism for input/output data, as an alternative to model classes"
          content: "Lorem Ipsum Content"
          date: "2019-03-31 00:00:00 +0000"
          }
     }
]
{% endhighlight %}

If you have a Jekyll blog, like this one, you can use Liquid syntax to index all your posts. [Here](https://github.com/amihaiemil/amihaiemil.github.io/blob/master/js/indexPosts.js) is how I created the Index for this blog.

Now, for the actual Search, I needed a "front-end", a search widget. Since ElasticLunr.js doesn't provide such a tool, I [wrote my own](https://github.com/amihaiemil/elasticlunr-search-widget). Well, actually I didn't create it from scratch, I've refactored the existing Search Widget I had for server-side searching. And, in the process of this refactoring, I've learned what **"Aging Software"** actually means. It's a simple ReactJS widget, with about 5 components and only a few dependencies: after 3 years of not working on it at all, running ``npm install`` suddenly showed about 400 (!) warnings and erros. I had left the project with a green build badge and when I came back to it, without doing anything, it suddenly exploded.

Why did I dismiss server-side searching? It used to work fine for me, I even [wrote my own Github chatbot](https://amihaiemil.com/2017/05/23/meet-charles-michael.html) for indexing and searching Github Pages content. I dismissed it because it became expensive to keep it up (I think I've run out of Free Tiers on all Cloud providers) and, besides that, the product didn't manage to attract users.

To conclude, if you have a similar use-case, I strongly suggest you look into lunr.js and/or elasticlunr.js. Also, you can reuse my Search Widget!
