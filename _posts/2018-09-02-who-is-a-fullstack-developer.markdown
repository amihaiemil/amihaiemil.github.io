---
layout: post
title: "Who Is a Fullstack Developer?"
date: 2018-09-02
tags: mood
author: amihaiemil
comments: true
shareable: true
preview: My thoughts on being a "Fullstack Developer".
image: https://amihaiemil.github.io/images/jerrys_cousin_call.png
---

These days it is very common to see the job title "Fullstack Developer" on LinkedIn.
Job adverts, developers or even wannabe developers are using this term quite a lot. Recruiters are looking for that jack of all trades while programmers are bragging about mastering the whole palette of technologies that usually goes into an application.

Knowing I am a little against the current, you've probably guessed that I don't like
this "position". I believe that such a person will be at best mediocre in what they do. I am surely not the only one who thinks this way, but let me just explain my reasoning.

<figure class="articleimg">
 <img src="{{page.image}}" alt="Jerry's Cousin">
 <figcaption>
 Tom & Jerry - Jerry's Cousin, by  William Hanna and Joseph Barbera
 </figcaption>
</figure>

**Disclaimer:** I am not criticising multi-faceted developers: as an experienced back-end developer you should also know how the JS client calls your API or be able to change a datepicker on the UI. However, being able to understand and maybe maintain all the parts of an application is completely different than writing an entire application start-to-finish. This post is about the developers that say they can do the latter and do it well.

To start, I assume that a Fullstack Developer will claim they are proficient (senior level) in both the front and the back-end. They won't admit that they [burned some steps], since that would prove the very point of this article. Now, let me tell you what I understand by "Senior Developer" and then it should be clear why I believe a single person cannot master everything.

I would expect a senior front-end developer to:

* Understand the in and outs of Javascript (not just frameworks);
* Understand everything about the framework they use and this includes:
    - Development and release process;
    - Known bugs;
    - They should have, at least once, made a PR with a bug fix to that repo;
    - Awareness and basic understanding of competitors;
* Understand everything about the build & release process of a JS application;
* Understand how a backend REST api works.
* Understand everything about CSS, including newer stuff such as fonts, glyphs, icons etc. By the way,
I consider CSS to be a very powerful programming language; I would expect a high-quality styling, modularied and design
in such a way that components can be easily added/removed/overlapped/composed etc. I think CSS styling should be at least a part-time job for a specialized developer.
* Decent understanding of SEO principles and also security issues such as CORS or iframe loading.
* Depending on the application, they should be able to design a CI/CD pipeline that wouldn't require a
rebuild + redeployment for changes of static stuff (images, pdfs, fonts etc).

As you know, frontend development is not just a ``main.css`` file, a few ajax calls and maybe some show/hide magic anymore. It is a fully-fledged domain of expertise. I've seen ReactJS applications with much better OOP principles and patterns than the Java backend it was calling.

From a senior back-end developer, I would expect the same as the above, with a few additions:

* Understanding of the in and outs of their programming language.
* Solid understanding of OOP (true OOP) principles.
* A unit/integration test code-coverage of over 80%
* Databases understanding, at least understand how an ORM works and know the most common DB concerns (I believe the DB should be the job of a specialized person as well, devs should understand enough to integrate with it, same as any other service).
* Doing code review and writing code every day.

The lists above are non-exhaustive, of course, there are probably topics I forgot. Bottom line is, to me, "senior" is the topmost level a person can reach in a certain technology. There may be one more level: "architect, but that's close to it, I don't see a signifiant difference between the two.

Now, back to the "fullstack developer" - do you think a single person can master all these topics, on two programming languages (JS and the backend one)? Know every single bit of the ecosystem of the two? I don't. But, nevertheless, let's give them a chance, assume they can indeed know it all and I still see a few problems:

* Their hourly rate should be $250+, meaning it would simply be cheaper to hire more specialized devs.
* If they get hired, the amount of time they'd spend to do all the work (and do it well!) would most likely be the same, if not higher, than what two or more (cheaper!) devs would spend.
* The person becomes that project's God. One-man team means bad business for the client in any imaginable scenario.
