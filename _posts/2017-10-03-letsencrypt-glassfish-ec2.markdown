---
layout: post
title: "Let's Encrypt. Glassfish. AWS EC2."
date: 2017-10-03
tags: devops ssl javaee aws
author: amihaiemil
comments: true
shareable: true
preview: A guide on how to manually create a Let's Encrypt SSL certificate and
 install it on the Glassfish JavaEE platform, hosted on AWS EC2.
image: https://amihaiemil.github.io/images/sleepy_time.png
---

I'll say it right off the bat: I'm rather novice when it comes to cyber security.
I would say "noob", but it's not entirely true: I do know that XSS
and CSRF are bad things (and how to avoid them), as well as the fact that tremendous efforts are being done constantly, to spread the use of HTTPS.

Naturally, I realized that if I want to expose a [search service](https://amihaiemil.github.io/2017/05/23/meet-charles-michael.html), I ought to do it
over HTTPS. Besides, if some web-page is loaded over HTTPS, no HTTP endpoint can be called
from it, the browser just won't allow it.

I wanted a quick and, if possible, free solution for my
JavaEE application which is running on AWS EC2 up there, somewhere. If you find yourself in the same sitiuation, this guide might help you (needless to say, do not rely on this guide if you have no clue what you're doing or you're trying to set up some important stuff for your company).

<figure class="articleimg">
 <img src="{{page.image}}" alt="Sleepy Time">
 <figcaption>
 Tom & Jerry - Sleepy Time, by  William Hanna and Joseph Barbera
 </figcaption>
</figure>

As the title says, I chose [Let's Encrypt](https://letsencrypt.org/) as my CA, because they are
already quite big, trusted by the community and are offering free certificates.

Even though Let's Encrypt offers an automatic renewal process, note that this guide is for the **manual flow**, meaning that the certificate won't be automatically renewed, you'll have to do it
yourself when it expires. <strike>I promise to write about the automatic renewal process too, as soon as I figure it out</strike> [Here](https://www.amihaiemil.com/2019/01/23/apache-payara-lets-encrypt.html) is how to automate everything.

### 1) Register a domain and point to EC2

First of all, you cannot issue a certificate based on EC2 ephemeral domains (i.e. "http://ec2-us-west..."). Why? Because they will change when you restart your instance; only the IP remains the same.

So, go to any domain registrar you want and get a domain, then set an [A record](https://uk.godaddy.com/help/add-an-a-record-19238) for it, which will point to your EC2 instance's IP address. If you don't know any domain registrars, I would suggest [GoDaddy](https://uk.godaddy.com/) -- even though their UI looks terrible, they are the most popular in the field.

### 2) Getting the SSL certificate

Log into your EC2 instance via SSH and install **certbot** (LetEncrypt's certificates agent):

{% highlight bash %}
sudo apt-get update
sudo apt-get install software-properties-common
sudo add-apt-repository ppa:certbot/certbot
sudo apt-get update
sudo apt-get install certbot
{% endhighlight %}

This is for Ubuntu systems. Check [https://certbot.eff.org/](https://certbot.eff.org/ ) for more options.

Once installed, you create your certificate by running the following command:

{% highlight bash %}
certbot certonly --manual -d example.com
{% endhighlight %}

You can specify multiple domains and/or subdomains by listing more "-d value" pairs.
After it's finished, you should get 2 files: ``fullchain.pem`` and ``privkey.pem`` -- the first contains
the certificate, while the second is the private key.

### 3) Installing the certificate on Glassfish

Glassfish has a file called ``keystore.jks``, where you need to add the certificate and key which were previously created. The file should be located at:

``<AS_HOME>/domains/domain1/config/keystore.jks``

and the default password for it is ``changeit``

Adding the two files to the keystore is a 2-step process:

  * **Create a keystore from the 2 files**

    * Create a .pkcs12 file containing full chain and private key
      <pre>openssl pkcs12 -export -in fullchain.pem -inkey privkey.pem -out pkcs.p12 -name letsencryptcrt</pre>

      You will set a password for this file, which you will need to specify at the next step (STORE_PASS).

    * Convert PKCS12 to Keystore
      <pre>keytool -importkeystore -deststorepass PASSWORD_STORE -destkeypass PASSWORD_KEYPASS -destkeystore letsencrypt.jks -srckeystore pkcs.p12 -srcstoretype PKCS12 -srcstorepass STORE_PASS -alias letsencryptcrt</pre>

      I would recommend setting all these passwords (PASSWORD_STORE, PASSWORD_KEYPASS and STORE_PASS) the same as the original ``keystore.jks``'s password since, at the next point, the passwords of the source and destination keystores' have to be the same.

  * **Import the created keystore into Glassfish's keystore**
  <pre>keytool -importkeystore -srckeystore letsencrypt.jks -destkeystore keystore.jks</pre>

Of course, make sure the paths to all the referenced files are correct, taking into account the current directory, when you are running all these commands.

### 4) Configuring the Glassfish HTTPS listener

Now that everything is setup, all you need to do is log into the Glassfish Admin Console and set the
appropriate HTTP Listener.

Glassfish has 3 HTTP listeners predefined, under ``Configuration > server-config > HTTP Service > HTTP Listeners``. <b>http-listener-2</b> is the one for HTTPS. The following 2 settings need to be done:

  * Set the port to 443 (HTTPS port)
  * In the SSL tab, set the Certificate NickName to ``letsencryptcrt`` and the Key Store to ``keystore.jks``

Click "Save", **restart the Glassfish instance** and you're done. You should now be able to access any deployed application via ``https://example.com/...``
<br><br>

---

<br>
If you have any questions, don't hesitate to ask. Also, here are some of the resources I've
used while setting all this up:

 * [SSL on AWS EC2 instance](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/SSL-on-an-instance.html#ssl_certificate)
 * [How do I generate the lets encrypt certificate ...?](https://community.letsencrypt.org/t/how-do-i-generate-the-lets-encrypt-certificate-and-key-on-my-own-device-more-info-inside/27510)
 * [Create a Java Keystore (.JKS) from Let's Encrypt Certificates](https://maximilian-boehm.com/hp2121/Create-a-Java-Keystore-JKS-from-Let-s-Encrypt-Certificates.htm)
 * [CSR Generation and Certificate Installation: Glassfish 4.x
](https://support.comodo.com/index.php?/Knowledgebase/Article/View/1123/37/csr-generation-and-certificate-installation-glassfish-4x)

and some digging through StackOverflow.
