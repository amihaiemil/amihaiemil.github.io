---
layout: post
title: "Github: Automatically Deploy Files From One Repo to Another"
date: 2017-02-13
tags: rultor github
author: <a href="https://www.github.com/amihaiemil" target="_blank">amihaiemil</a>
comments: true
shareable: true
preview: A simple guide to help you with automatically moving files from one repo
 to another, using Rultor
---

Due to its rich and well designed API, Github has a vast number of integrations that run on top of it. [Rultor](http://doc.rultor.com/) is one of the many pieces of
software that integrate with Github. If you're not familiar with it, you can read more  in several articles written by its creator [here](http://www.yegor256.com/tag/rultor).

In this post I'm going to show you how to achieve one particular goal: moving files
from one repo to another with Rultor. This is something that I did recently and
figured I'd write about it, since I found it rather tricky.

<figure class="articleimg">
 <img src="/images/jerrys_cousin.png" alt="Jerry's Cousin">
 <figcaption>
 Tom & Jerry - Jerry's Cousin, by  William Hanna and Joseph Barbera
 </figcaption>
</figure>

Here's a scenario: you have a repo where some javascript developers are building
something which will ultimately be turned into an ``awesome.min.js`` file.
When you say ``"@rultor deploy"``, the file should be moved to the ``company.github.io`` repo, because that repo is a website hosted by [Github pages](https://pages.github.com/). This way, any page which includes that ``.js`` file from the company's website will always receive the latest version.

Sounds easy, so you write a ``deploy.sh`` file for rultor to run on a ``deploy`` command:

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

Inside ``.rultor.yml`` you have:

{% highlight yaml %}
deploy:
  script: |-
    chmod +x ./deploy.sh
    ./deploy.sh
{% endhighlight %}

This should work just fine, except the server doesn't trust Github's host, and
you will see in rultor's logs something like this:

{% highlight bash %}
The authenticity of host 'github.com (192.30.252.1)' cannot be established.
RSA key fingerprint is 16:27:ac:a5:76:28:2d:36:63:1b:56:4d:eb:df:a6:48.
Are you sure you want to continue connecting (yes/no)?
{% endhighlight %}

If you use HTTPS, you will be prompted for the username and password.

You could, of course, find some way to automatically answer to the prompts. Maybe answer "Yes" to all the prompts that could occur,
or, if you choose HTTPS, involve the credentials of someone with write access on that repo.
None of the options is good, obviously.

The solution is Github's ``Contents`` API. Rultor will ``PUT``
the file through the [update](https://developer.github.com/v3/repos/contents/#update-a-file)
endpoint, using ``cURL``.

The steps are as follows:

1. Get the API token
2. Make a cURL ``GET`` to obtain the old file's SHA
3. Encode the file to deploy using ``openssl``
4. Make a cURL ``PUT`` with the message, the contents and the SHA

Let's examine the steps more closely:

### 1. The API token

You don't want the API token visible to everyone so, before uploading it
to Github, you encrypt it using the ``rultor`` command-line tool:

{% highlight bash %}
gem install rultor #install the tool
rultor encrypt -p company/developmentRepo token.txt
{% endhighlight %}

Where ``company/developmentRepo`` is the full name of the repo where the deployable is built. This is important, because it's how rultor knows not to decrypt the files if they are found in another repository.

Then, inside ``.rultor.yml`` you have

{% highlight yaml %}
decrypt:
  token.txt: "token.txt.asc"
{% endhighlight %}

Getting the token in your script is the following line (rultor puts the resources under ``/home/r``)

{% highlight bash %}
TOKEN=$(cat /home/r/deployment.txt)
{% endhighlight %}

### 2. Getting the old file's SHA

Here you just make a cURL get, but you need to parse the JSON object that the Github API
returns - I used [jq](https://github.com/stedolan/jq) for that.

{% highlight bash %}
BUILD_SHA=$(curl 'https://api.github.com/repos/company/company.github.io/contents/js/awesome.min.js' | jq '.sha')
{% endhighlight %}

Now the variable ``BUILD_SHA`` will contain the required SHA. Needless to say, the first deployment will have to be
done manually in order for this script to work.

### 3. Encoding the content using openssl

The content of the deployed files has to be base64 encoded, as required by the Github API.

{% highlight bash %}
NEW_BUILD=$(openssl enc -base64 <<< $(cat src/build/awesome.min.js) | awk 'BEGIN{ORS="\\n";} {print}')
{% endhighlight %}

Note that I used awk here to remove newlines (otherwise the built JSON is not well formatted).

### 4. Make the cURL PUT request

This is a 2-step process:
 + first, dump the json body in a file (becuase of the base64 content, which might
 be too large, cURL might complain if you specify it as an argument directly)
 + make the request

{% highlight bash %}
echo \
  "{\"message\": \"deploy new build\", \"sha\": ${SHA_BUILD}, \"content\": \"${NEW_BUILD}\"}" > \
  build.txt;

curl \
  -H "Authorization: token ${TOKEN}" \
  -X PUT -d @build.txt \
  https://api.github.com/repos/company/company.github.io/contents/js/awesome.min.js
{% endhighlight %}

See exactly how I did it all [here](https://github.com/opencharles/charles-search-box/blob/master/deploy.sh). Also, see it in action [here](https://github.com/opencharles/charles-search-box/pull/19#issuecomment-285387469).

This is it. You can follow these steps to avoid blindly answering prompts, as well
as involving actual user credentials. Any questions?
