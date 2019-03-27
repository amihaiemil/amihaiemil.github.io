---
layout: post
title: "Polymorphic Input/Output Data"
date: 2019-03-27
tags: java oop
author: amihaiemil
comments: true
shareable: true
preview: Using polymorphism for input/output data, as an alternative to
 model classes
image: https://amihaiemil.github.io/images/push-button-kitty.png
---

<figure class="articleimg">
 <img src="{{page.image}}" alt="Push-Button Kitty">
 <figcaption>
 Tom & Jerry - Push-Button Kitty, by  William Hanna and Joseph Barbera
 </figcaption>
</figure>

{% highlight java %}
import javax.json.JsonObject;

/**
 * Docker Container represented in JSON.
 */
public interface Container extends JsonObject {
   String id();
   String name();
   //...
}
{% endhighlight %}
