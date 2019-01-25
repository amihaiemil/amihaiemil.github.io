---
layout: post
title: "Apache. Payara. Let's Encrypt."
date: 2019-01-23
tags: devops ssl javaee
author: amihaiemil
comments: true
shareable: true
preview: Using Apache and Let's Encrypt to automatically generate and renew SSL certificates
 for your Java EE platform.
image: https://amihaiemil.github.io/images/push-button-kitty.png
---

Some time ago, I wrote a small [tutorial](https://www.amihaiemil.com/2017/10/03/letsencrypt-glassfish-ec2.html) on how you can generate Let's Encrypt SSL certificates and install them on your Glassfish Java EE Platform. That trick worked wonders for me but having to manually renew and reinstall the certificates every three months became quite annoying.

I did a little research and, same as the first tutorial, this one is basically a summary of my findings. Before anything, I should mention [Mr. Daschner](https://twitter.com/DaschnerS) who explained to me how HTTPS is usually handled in the Java EE world -- many thanks!

<figure class="articleimg">
 <img src="{{page.image}}" alt="Push-Button Kitty">
 <figcaption>
 Tom & Jerry - Push-Button Kitty, by  William Hanna and Joseph Barbera
 </figcaption>
</figure>

Long story short: Payara, Glassfish, JBoss and others all have some differences in the way they handle HTTPS so, Mr. Dachner said, the sane way to do it is to let them work via HTTP behind the scenes and let an Apache HTTP Server actually communicate with the users, acting as a Reverse Proxy, forwarding all requests to/from the hidden Java EE Platform.

First things first, download Payara or other server of your choice, install and run it with the default configuration. By default, it should listen on port ``8080``. No need to do anything further.

Then, install Apache as explained [here](https://www.digitalocean.com/community/tutorials/how-to-install-the-apache-web-server-on-ubuntu-18-04-quickstart) and in the file ``/etc/apache2/sites-available/example.com.conf``, specify the following (the file is ``example.com.conf`` as in the linked article):

{% highlight xml %}
<VirtualHost *:80>
    ...
    ProxyPass / https://0.0.0.0:8080/
    ProxyPassReverse / https://0.0.0.0:8080/

    ProxyPass /myapp http://0.0.0.0:8080/myapp
    ProxyPassReverse /myapp http://0.0.0.0:8080/myapp
</VirtualHost>
{% endhighlight %}

After saving the changes, don't forget to reload ``Apache``, so it reads the new config:

``sudo systemctl reload apache2``

Now instruct your firewall to expose ports ``80`` and ``443`` for incoming connections (this is probably already configured) and you are half done. So far, you have a running Apache server which will forward all requests made to ``www.example.com`` and ``www.example.com/myapp`` to the internal Payara.

To enable SSL via Let's Encrypt, just follow the steps described [here](https://www.digitalocean.com/community/tutorials/how-to-secure-apache-with-let-s-encrypt-on-ubuntu-18-04) and don't forget to press ``2`` when the following message appears from ``certbot``:

{% highlight xml %}
Please choose whether or not to redirect HTTP traffic to HTTPS, removing HTTP access.
-------------------------------------------------------------------------------
1: No redirect - Make no further changes to the webserver configuration.
2: Redirect - Make all requests redirect to secure HTTPS access. Choose this for
new sites, or if you're confident your site works on HTTPS. You can undo this
change by editing your web server's configuration.
-------------------------------------------------------------------------------
Select the appropriate number [1-2] then [enter] (press 'c' to cancel):
{% endhighlight %}

Pressing ``2`` will instruct certbot to automatically configure Apache so it redirects all HTTP traffic to HTTPS. This is very convenient since ``http://`` links are still widely spread so it only makes sense to redirect the user to the secure alternative.

This is it, now everything should work via HTTPS and you should always see the green lock in your browser when accessing your Java EE apps via ``www.example.com``. The only thing that I do not like is the fact that, apparently, we have to specify each context root (i.e. ``/myapp``) in Apache's config file. This seems very inconvenient, so I [asked](https://stackoverflow.com/questions/54315377/apache-payara-reverse-proxy) StackOverflow how we can avoid having to do this -- if you happen to know please, go ahead and post an answer!
