---
layout: post
title: "Windows or Ubuntu?"
date: 2020-07-29
tags: thoughts
author: amihaiemil
comments: true
shareable: true
preview: Just a few thoughts on why a linux OS is better for developers.
image: https://amihaiemil.github.io/images/texas-tom.PNG
---

A few days ago, a friend who wants to become a Java Developer asked me whether he should
use Windows or Ubuntu.

Being a long-time linux user myself (3 years Ubuntu + 3 years MacOS), I clearly
recommended Ubuntu. However, I couldn't tell exactly why. After reviewing
my past years' work, I finally put together a few points. Here's my take on it.

<figure class="articleimg">
 <img src="{{page.image}}" alt="Texas Tom">
 <figcaption>
 Tom & Jerry - Texas Tom, by  William Hanna and Joseph Barbera
 </figcaption>
</figure>

**Simpler ecosystem.** I'm not sure if this is generally the case, but I somehow always
found it easier to setup my workspace (tools, kits, package managers, you name it) on
Ubuntu than I did on Windows. Just download the ZIP, unpack it and edit the ``$PATH``
variable to point to the binary. That's it. Somehow, on Windows, I always encountered
all sorts of annoying issues: installer that requires restart, missing admin rights and so on.
Not to mention, packages that don't work out of the box because they're made primarily for linux and
you may be forced install add-ins in order for it to work.

**It's more "manual"**. As I said above, you usually have to edit system variables and do things that a Windows Installer usually does on your behalf. I found this tricky at first, but I ended up understanding how it works and now it comes very natural to me. I know where everything is installed and how stuff is linked together, I know how to update my tools properly and how to clean up what I don't need anymore. I truly feel that I am in total control of my machine -- I never had this feeling on Windows.

**The command line**. If you ever used Ubuntu for more than 15 minutes, you've probably realised that using the Terminal is inevitable. Many people are afraid of that black window, not understanding that it's just another type of interface to the system -- anything you can do from the UI with a mouse, you can also do from the terminal by playing with no more than a few commands.

As a developer, the command line should be your best friend: you know exactly which tool you're using and when, there's no IDE or plugin doing tricks behind your back. For instance, I never really understood how [Maven](https://maven.apache.org/) works until I started using it from the terminal -- an IDE offers you tons of options (clean, refresh, update project and so on), but it's never obvious where the Maven build starts/stops and where the IDE comes into play to refresh your project and show you all sorts of information that has nothing to do with Maven.

The same discussion when it comes to ``git``. I never really understood how it works, what it means to be "distributed" etc, until I learned to use it from the Command Line. I simply have no idea what Eclipse does when I click "Synchronize Repository" -- does it do a ``fetch`` or a ``pull``? Which ``git remote`` is it using? etc.

Now, I'm not saying we should write code in <strike>Notepad</strike> [Vim](https://www.vim.org/). All I am saying is that it's nice to clearly know where your project stops and where the IDE's tricks begin. This way, you will have a complete understanding of your tools and it also won't be hard to switch IDEs.

**You are closer to Production**. Virtually all software, written in any language besides C#, runs on Linux. Using Linux on your work machine means you are much closer to the Production environment. Your product will be of higher quality because you will know almost exactly how it will behave once released. Also, you will inevitably get to set up an HTTP Server (e.g. Apache), a MySql server, a Docker Engine etc. And, as I said a few paragraph above, it will be a more "manual" work. You will essentially learn the skills necessary for a (junior) DevOps or Sys Admin role without even realising it. You won't be scared of terms such as "exposed ports" or "SSL certificates" anymore.


To conclude, these are pretty much the reasons I never used Windows since about 2014. Out of everything, the **learning** point seems to be the most important. So, I believe if you want to be in complete understanding and control of your work, you have to drop Windows and dive into the Linux world.
