---
layout: post
title: "Always Use a CMS For The Client Side"
date: 2017-03-13
tags: devops architecture
author: amihaiemil
comments: true
shareable: true
preview: For any webapp, no matter its technology, all the client-side content has to
 be managed using a CMS (down to line-of-code level)
image: https://amihaiemil.github.io/images/mouse_cleaning.PNG
---

What is (or should be) considered client-side? Everything that is displayed/loads
in the browser and any static resources that the user could download:
HTML files, css stylesheets, javascript files, pdf files etc. All of these
represent the front-end and should be as decoupled from the back-end as possible.

Any changes to the UI should be done using a CMS (Content Management System)
and should go live without requiring a deployment. This is important especially
in enterprise environments where there are strict rules and timelines
regarding production releases.

Of course, you may not care about this if you're a single developer who deploys
an app to [Amazon EC2](https://aws.amazon.com/ec2/) anytime, with a few clicks.

<figure class="articleimg">
 <img src="{{page.image}}" alt="Mouse Cleaning">
 <figcaption>
 Tom & Jerry - Mouse Cleaning, by  William Hanna and Joseph Barbera
 </figcaption>
</figure>

Let's see how can this decoupling be achieved. How can an arbitrary CMS provide the content,
dinamically, to some webapp? One possible solution lies with the OS: [symbolic links](https://en.wikipedia.org/wiki/Symbolic_link).
You will need one or two such links, it depends.

First, the CMS should be able to export the content to a file system. All the work
done in the CMS takes the form of a folder which could go directly on the
application server or somewhere else, as long as it is *on the same network*.

Second, if the content is exported outside the application server, you have to
create a *symbolic link* between the application server and the file system where
the contents folder resides.

Third, once the application-server "sees" the contents, the webapp deployed on
it needs access to them at runtime. To obtain the access, at start-up, the app
should create a *symbolic link* between its root folder and the folder with
the contents. When it comes to URLs, this means that the path to a file will
come right after the context-root:

```
www.example.com/appContextRoot/contents/2017/03/11/Page.html
```

Now the web application will always deliver the files found under
the folder *contents*, which in turn can be edited and exported from the CMS.

These days, when the "JavaScript client + backend web-services" architecture is
rather common, this setup is perfect in order to avoid having to perform a build
and a deployment for changes in the front-end.

It should work fine with other architectures as well (where components
are rendered on the server), but it will require a little more implementation effort.
For instance I once had this setup for a [JSF](https://en.wikipedia.org/wiki/JavaServer_Faces)
app and all the server-side UI components had to be designed as custom XHTML tags.
Someone would make the HTML page in the CMS, I would give them the tag ``<app:component/>``
and they would simply add it in the source wherever the component had to appear.

Finally, I'm aware that this might be quite a trivial topic. However, I decided
to write about it because I know quite a few developers who make deployments with
changes to error messages.

How do you separate the front-end from the back-end?
