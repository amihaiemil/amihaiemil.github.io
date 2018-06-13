---
layout: post
title:  "Using Google Recaptcha 2 with JAX-RS"
date:   2016-06-03
tags: rest anti-spam
author: amihaiemil
comments: true
shareable: true
preview: How to secure a form post with Google ReCaptcha 2
---

Nowadays the simplest way to secure your formular against robots and automated tools is to add a captcha to it.
I found Google's <a title="Recaptcha developer guide" href="https://developers.google.com/recaptcha/intro">Recaptcha 2.0</a> to be an elegant solution. It looks good and it's easy to
implement. The general mechanism is thoroughly documented in the developer's guide so it makes no sense to just repeat it here. Instead I
want to show you how I would implement it together with a Java EE ``@POST`` method.

<img alt="Google ReCaptcha 2.0" src="/images/recaptcha.PNG"/>

Assume you have a contact form which has the following 3 fields: **name**, **email** and **message** . The class that maps the form
looks like this:

{% highlight java %}
public class ContactForm {
    @FormParam("name")
    @DefaultValue("")
    private String name;

    @FormParam("email")
    @DefaultValue("")
    private String email;

    @FormParam("message")
    @DefaultValue("")
    private String message;
    //...getters and setters...
}
{% endhighlight %}

And the JAX-RS resource with the post method that handles the form:

{% highlight java %}
@Path("/")
public class ContactResource {
    @POST
    @Path("/contact")
    public Response postContactForm(@Form ContactForm form) {
        //form post logic here
        return Response.ok().build();
    }
}
{% endhighlight %}

Now, when the user resolves the captcha, a hidden field is added in the html ``<form>`` element, with the name ``g-recaptcha-response`` .
You can use this name to map the field on the ``ContactForm``, together with the other 3. The ``ContactForm`` class now has one more
field (+ getters and setters):

{% highlight java %}
    @FormParam("g-recaptcha-response")
    @DefaultValue("")
    private String recaptchaResponse;
{% endhighlight %}

**Note:** I always add ``@DefaultValue("")`` when dealing with strings, to avoid **null** values in case the parameter isn't supplied.

Let's add the class ``GoogleRecaptchaCheck`` which will encapsulate the call to Google's web service. I'm going to keep it simple here and
only use the user's captcha response. As the documentation states, you can, optionally, send the user's IP as well.

**Note:** this class uses Apache's HttpClient to make the POST to Google's web service.

{% highlight java %}
    public class GoogleRecaptchaCheck {
        private static final String GOOGLE_SECRET_KEY = "<<your key here>>";
        private static final String GOOGLE_API_ENDPOINT = "https://www.google.com/recaptcha/api/siteverify";
        private String userResponse;
        public GoogleRecaptchaCheck(String userResponse) {
            this.userResponse = userResponse;
        }
        public boolean isRobot() throws IOException {
            CloseableHttpClient httpClient = HttpClientBuilder.create().build();
	    HttpPost postRequest = new HttpPost(GOOGLE_API_ENDPOINT);
	    List<NameValuePair> postParameters = new ArrayList<NameValuePair>();
	    postParameters.add(new BasicNameValuePair("secret", GOOGLE_SECRET_KEY));
	    postParameters.add(new BasicNameValuePair("response", this.userResponse));
	    postRequest.setEntity(new UrlEncodedFormEntity(postParameters));
	    CloseableHttpResponse response = null;
	    try {
	        response = httpClient.execute(postRequest);
                if(response.getStatusLine().getStatusCode() == HttpStatus.SC_OK) {
		    InputStream body = response.getEntity().getContent();
		    JsonObject json = Json.createReader(body).readObject();
	            if(json.getBoolean("success")) {
	                return false;
	            }
	            return true;
	        }
	        //here you might want to log the error-codes element of the json response and/or the status code.
		return true;
	    } finally {
		IOUtils.closeQuietly(httpClient);
		IOUtils.closeQuietly(response);
	    }
	}
    }
{% endhighlight %}

Your REST post method now looks like this:

{% highlight java %}
@Path("/")
public class ContactResource {
    @POST
    @Path("/contact")
    public Response postContactForm(@Form ContactForm form) {
        GoogleRecaptchaCheck recaptcha = new GoogleRecaptchaCheck(form.getRecaptchaResponse());
        try {
            if(recaptcha.isRobot()) {
                return Response.status(HttpStatus.SC_FORBIDDEN).build();
            } else {
                //form post logic here...
                return Response.ok().build();
            }
        } catch (IOException ex) {
            //log exception maybe?
            return Response.serverError().build();
        }
    }
}
{% endhighlight %}

Done. Now no bots will be able to send your formular. I hope this article was useful - feel free to ask any questions in the Disqus thread below.
