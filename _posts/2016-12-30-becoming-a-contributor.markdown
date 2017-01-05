---
layout: post
title:  "Becoming a contributor"
date:   2016-12-30
tags: contributors java oop github
author: <a href="https://www.github.com/amihaiemil" target="_blank">amihaiemil</a>
comments: true
preview: How we should work together using PDD, plus other details
---

I anounced in the previous [post](http://www.amihaiemil.com/2016/12/22/contributors-wanted.html) that I am looking for contributors to my open source projects.

I described the big picture, how I expect us to be working together  but still, more details are needed. That's why I wrote this post. It will cover three topics: communication, tasks size and some guidelines regarding coding style.

# Communication
It is important to note that 99% of our chatting should take place inside Github issues. No meetings, skype calls or long email threads - I consider them (and I think most people agree) a waste of time. Besides, it's easier and more practical to have all the information related to a ticket inside the ticket itself.

# Size of tasks and workload
In the previous post I also mentioned [PDD](http://www.yegor256.com/2009/03/04/pdd.html). **This concept will stand at the core of our collaboration**, because it allows for small tasks (**30min to 1h estimation**) that should find their place easily in most people's schedule.

I expect a contributor to **spend under 8h/week** writing code for these projects and in no case should someone be stressed about this. It should be something rather relaxing from which everyone should learn new stuff.

As you can read in the [article](http://www.yegor256.com/2009/03/04/pdd.html), PDD has a number of advantages that you should **keep in mind:**

  - **Small tasks**: don't spend more than 30m to 1h on something. Puzzle stuff out, create other tasks.
  - **Small pull requests**: don't make a PR with 15 changed files. I would say if you narrowed-down your task well enough, your PR shouldn't contain more than 5 changed files (5 changed files already means a big task, from my point of view). This also makes the life of the **code reviewer** easier!
  - **Tracking** down of changes and bugs becomes much easier
  - **Bugs are reduced** since everyone is working on small and clear topics

# Code style and rules

The projects use [checkstyle](http://checkstyle.sourceforge.net/) to control
code quality. The build will **fail** if any of the style rules is violated. You will
see it in action, but here are some firsthand tips:

  - No TABs (this is mostly for readability and navigation) - for instance, lines containing
  tabs are poorly aligned in the Github view.
  - 4-space indentation.
  - Lines should contain maximum 80 characters.
  - Classes are either **final** or **abstract**.
  - Local variables and parameters should be **final**
  - **Avoid null** at all costs. Do not ever return null! The first argument to this is
  that no one wants their users' code to be polluted with checks for null or create NPEs
  out of nowhere.
  - **Avoid get/set prefixes** in method names. Read [this](http://www.yegor256.com/2014/09/16/getters-and-setters-are-evil.html). Of course,
  we will never choose that over the power of JAXB for instance, but in most cases we will
  not need to use such frameworks.

Also, keep in mind that the **master branch is read-only**. You should solve the ticket you are assigned on **a separate branch named after the ticket number** (e.g. ticket number 123 should be solved on a branch named 123).

**Every PR will be reviewed by a code reviewer** and you will probably
be asked to make adjustments to your solution. At first, it will be
only me, but in time, if we manage to build a solid team, others will have this role as well.

Sounds interesting? Got any questions? Just ask, I'll be happy to answer.
