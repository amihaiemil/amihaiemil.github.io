---
layout: page
title: Mihai's Projects
header: Projects
permalink: /projects.html
---

I am the architect and main developer of a number of opensource projects. They are
written in Java 7/8 and Java EE 7, with strong OOP principles in mind. These projects are usually the basis of
the articles on this blog, meaning that I tried most of the ideas that I write about and saw that they are indeed applicable.

You can find them under my [Github profile](https://github.com/amihaiemil) or in one of these two organizations: [opencharles](https://github.com/opencharles) and [decorators-squad](https://github.com/decorators-squad).

Some worth mentioning are:

  * Automated Project Management for repositories hosted on GitHub or GitLab ([Self XDSD](https://self-xdsd.com))
  * ReactJS search widget for ElasticLunr.Js ([elasticlunr-search-widget](https://github.com/amihaiemil/elasticlunr-search-widget))
  * Java OOP web crawler (see [Project Charles](https://amihaiemil.github.io/2016/12/05/project-charles.html))
  * Github chatbot for indexing and searching [Github Pages](https://pages.github.com/) websites ([charles-rest](https://github.com/opencharles/charles-rest))
  * Java OOP YAML parser ([eo-yaml](https://github.com/decorators-squad/eo-yaml))
  * Java 8 Wrapper of Docker's API ([docker-java-api](https://github.com/amihaiemil/docker-java-api))
  * Github chatbot for DevOps/CI/CD automations ([comdor](https://github.com/amihaiemil/comdor))

If you find one of these projects interesting, feel free to contribute
either by filing Issues or by providing a Pull Request (ideally no more than 5 changed files, including tests).

<a href="https://www.github.com/amihaiemil" target="_blank"><img src="https://ghchart.rshah.org/amihaiemil" title="My Github contributions chart" alt="amihaiemil's Github chart" /></a>

<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/octicons/2.0.2/octicons.min.css">
<link rel="stylesheet" href="/css/github-activity-0.1.5.min.css">

<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/mustache.js/0.7.2/mustache.min.js"></script>
<script type="text/javascript" src="/js/github-activity-0.1.5.min.js"></script>

<div id="feed">
</div>

<br>
If you like my work and want to support me, consider making a small donation via PayPal.
Or maybe sponsor me on Github for as little as $3/month! :)
<br>

<table>
  <tr>
    <td>
      <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
         <input type="hidden" name="cmd" value="_s-xclick" />
         <input type="hidden" name="hosted_button_id" value="U8MANV6YYNVWL"/>
         <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
        <img alt="" border="0" src="https://www.paypal.com/en_RO/i/scr/pixel.gif" width="1" height="1" />
      </form>
    </td>
    <td>
      <iframe src="https://github.com/sponsors/amihaiemil/button" title="Sponsor amihaiemil" height="35" width="107" style="border: 0;"></iframe>
    </td>
  <tr>

<script>
$(document).ready(
  function() {
    GitHubActivity.feed({
    	username: "amihaiemil",
    	selector: "#feed",
    	limit: 10
    });
  }
);
</script>
