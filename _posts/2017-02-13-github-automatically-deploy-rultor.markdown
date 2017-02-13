---
layout: post
title:  "Github: Automatically Deploy Files From One Repo to Another"
date:   2017-02-13
tags: junit selenium java
author: <a href="https://www.github.com/amihaiemil" target="_blank">amihaiemil</a>
comments: true
preview: A simple guide to help you with automatically moving files from one Repo
to another, using [Rultor](http://rultor.com/).
---

Due to its rich and well designed API, Github has hundreds of integrations. There is
a lot of software out there that integrates and runs on top of Github. One such software is
[Rultor](http://doc.rultor.com/). You can read more details in the dozen articles written
by its creator [here](http://www.yegor256.com/tag/rultor).

In this post I'm going to show you how to achieve one particular goal: moving files
from one repo to another. This is something that I did recently, found it tricky
and figured I'd write about it since it might help others as well.

<figure>
 <img src="/images/cousin_muscles.png" alt="Cousin Muscles">
 <figcaption>
 Tom & Jerry - Jerry's Cousin, by  William Hanna and Joseph Barbera
 </figcaption>
</figure>

Here's the scenario: you have a repo where some javascript developers are building
something awesome which ultimately be turned into a ``awesome.min.js`` file.
Then, when you say ``@rultor deploy`` you want this file to be moved to a ``company.github.io`` repo,
since this repo is a website hosted by [Github pages](https://pages.github.com/). Finally,
your clients, who have a link to the file, will always get the newest version, automatically.

Sounds easy and since you already have a ``deploy.sh`` file in de devs' repo, you
add these lines to it:

{% highlight bash %}
//...build instructions here...
git clone git@github.com:company/company.github.io.git
rm ./company.github.io/js/awesome.min.js
cp ./src/build/awesome.min.js ./company.github.io/js
cd company.github.io
git commit -am "deploy js build"
git push
cd ..
{% endhighlight %}

This should work just fine, except the server doesn't trust Github's host, and
you will see in rultor's logs something like this:

```
The authenticity of host 'github.com (192.30.252.1)' can't be established.
RSA key fingerprint is 16:27:ac:a5:76:28:2d:36:63:1b:56:4d:eb:df:a6:48.
Are you sure you want to continue connecting (yes/no)?
```

If you use HTTPS, you will be prompted for the username and password.

You could of course find some way to automatically answer to the prompts,
maybe answer "Yes" to all the prompts that could occur,
or involve the actual credentials if you're going with HTTPS.
None of the options are good and besides, if you're going with SSH, rultor
will need write access to the ``company.github.io`` repo, in order to ``push`` the changes.
