---
layout: post
title: "Self-Protecting Projects"
date: 2020-01-17
tags: ci-cd oop
author: amihaiemil
comments: true
shareable: true
preview: In order for a software product to be strong and of high quality,
 we should rely less on conventions and instead automate as many Quality Gates
 as possible.
image: https://amihaiemil.github.io/images/designs_on_jerry2.PNG
---

I was once attenting a presentation on the topic "Front-End Development". The talk was held by a senior developer who, at some point, started bragging about the cool conventions he and his team were using in their projects, particularly naming and structure of their CSS files. Then, he also mentioned something about their JavaScript conventions.

At the end of the talk, I asked the guy what their CI/CD pipeline was, how did the build command look like and whether they actually automated any of those rules. The whole room laughed, including him. Afterwards, he said something like: "we rely on our engineers and our ability to review our code". I was taken by surprise -- I was expecting a lame answer, but I did not understand why everyone laughed.

What's really sad is that, to this day, I get [similar reactions](https://twitter.com/januszesser/status/1217333400958312448) when I suggest automation of Quality Gates. In this post, let me ellaborate the idea, maybe it will be clearer afterwards.

<figure class="articleimg">
 <img src="{{page.image}}" alt="Designs on Jerry">
 <figcaption>
 Tom & Jerry - Designs on Jerry, by  William Hanna and Joseph Barbera
 </figcaption>
</figure>

Automating quality gates means having some sort of automated checks for the rules and conventions that your team is using in a project. When it comes to CI/CD pipelines, the sky is the limit, but I've learned that the most efficient way to achieve this automation is through your build tool.

**Building** a project usually means fetching dependencies, compiling, running the tests and packaging. Yet, we can add one more step right at the beginning: **code analysis**. In Java there are a few popular code analysers: [Checkstyle](https://checkstyle.sourceforge.io/), [PMD](https://pmd.github.io/) or, if you really want to suffer, [qulice](https://www.qulice.com/). I use Checkstyle in all my pojects.

The key is to configure your code analyser to check all your conventions and even architectural rules. When a rule is broken, the build should fail, period. You won't have a backlog of old tasks to fix "those red Jenkins jobs" -- there will be no backlog simply because you will be forced to fix the errors before you even merge your changes into the master branch.

For instance, in my projects, I have rules ranging from cosmetic matters like naming or indentation to architectural rules such as "Classes are either abstract or final" or "All variables, of any kind, should be final".

The most common complaint I hear about this scenario is frustration. Can it be frustrating? Of course it can, but only until you learn some discipline. Believe me when I say, you get used to it sooner than you think and you learn to appreciate it. At some point, it even becomes annoying to have to learn other conventions than what you got used to.

Remember, these checks must be blocking! You can also analize your code via an external tool such as [SonarQube](https://www.sonarqube.org/) but such pipelines are usually not blocking so the team just has a backlog of tasks which are never really fixed. When is the last time you went and fixed some complaints in Sonar? My guess is: never.

---

Now, since we're talking about self-protecting projects, here is another thing that I like to do: I let the project open its own bug reports. Usually, when you catch an exception, you just log it and hope someone in your company has a Log Analyzer which is smart enough to handle every logged error. Then, hope that someone actually bothers to verify the logs.

Why not open a ticket right away? As soon as you catch an exception, you can use the RESTful API of your Issue Tracker to open a ticket. Github, GitLab or Jira all offer such APIs. Of course, this is a matter of architecture, you can't just make HTTP calls anywhere throughout your application. But if your is code object-oriented, you should be able to achieve this goal elegantly.***

In my case, the project was a chatbot where the highest abstraction was the "Action". Whatever the chatbot did, we called an Action. Now, [Action](https://github.com/amihaiemil/comdor/blob/master/src/main/java/co/comdor/Action.java) is a Java interface with a main implementation and a **decorator** called [VigilantAction](https://github.com/amihaiemil/comdor/blob/3e7b2e2a9bfdc8d1414a22324d3556457ec0d94a/src/main/java/co/comdor/VigilantAction.java). The "vigilant" action simply calls the original Action in a ``try/catch`` block and opens a Github ticket with the caught exception. For interacting with Github, I used [this](https://github.com/jcabi/jcabi-github) library.

Writing about this now, I got an idea: we should have some sort of plugin for ``Log4J`` or ``slf4J``: a plugin that would automatically open tickets on Github or other trackers, when the ``.error(...)`` method is called. Or, even more elegantly, this kind of functionality could be implemented in our application servers or runtimes: if any exception breaks the application and reaches the server log, we should have an Issue opened automatically.

To conclude, I hope I made my point clear enough and I hope you won't rely on conventions so much anymore. It's better if we let the project protect itself. By the way, that's not to say that Code Review is useless! Code Review is still very important, it just becomes easier.

**P.S.**

\*\*\* A lot of readers freaked out about this idea, their main argument being in the lines of "**What if your program enters an infinite loop and you have 1M ticket opened?**". It's a fair concern. However, I must say:

1. If your program passes QA with infinite loops in it, consider it a Divine Punishment for the QA team, to have to clean the Issue Tracker. I'm not even going to mention unit and integration tests. Also, let's not forget that infinite loops are quite hard to get to, unless you are a really unexperienced developer.
2. Checking for duplicates is really a basic functionality which should be provided by the tracker or it could be implemented as a simple proxy rule.
3. Checking for duplicates could be implemented via a simple cache in the library used to make the calls (as I said, some architecture is required, nobody will go around making requests from every ``catch`` block).
4. Finally, it's just an idea I played around with in my pet projects. Of course, in bigger projects the situation may be more complex and I'm not saying that it is applicable everywhere.
