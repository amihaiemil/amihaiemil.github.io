---
layout: post
title:  "Calculate time using javascript"
date:   2016-05-24
categories: javascript
comments: true
---

I recently had a task that sounded like this: "If the user is younger than 70.5 this logic should happen, else that logic". 
Sounds quite straight forward but implementing it was pretty fun. I thought to share the solution since it's vanilla javascript (no jquery or other libs used)
and might be useful to others as well.

After substracting the 2 years and months from the given dates (resulting in something like a 5 line js function), they told me "No, it has to be day-specific, 
also taking into account leap years!".

As it turns out, 70.5 actually meant 70 years, 6 months and 0 days. 70 years, 6 months and 1 day was already too old. 
Luckily, javascript's ``Date`` can tell how many days are in a month (with regards to leap years and 30/31 days). 
{% highlight javascript %}
nww Date(year, month, 0).getDate();
{% endhighlight %}
So ``new Date(2016, 2, 0).getDate();`` outputs 29, while ``new Date(2015, 2, 0).getDate();`` outputs 28.

With the precision requirement in mind, I started thinking of a date as of a json object of format: 
{% highlight json %}
{
    "years":2016,
    "months":05,
    "days":24
}
{% endhighlight %}
and that's how I implemented a function 
{% highlight javascript %}
function getAge(birthdate) {
      //...
}
{% endhighlight %}
which takes the ``birthdate`` date object, calculates and returns the age as a json object of the above format.

After that they said "Ok, looks nice, but we forgot to mention the reference date is the first of next month, not the present date".
Following this, I refactored the code and came up with ``function timePassed(date, refdate)`` from bellow. 

I also wrote ``function compareDates(date1, date2)`` which compares 2 json dates. I used it like this: 
{% highlight javascript %}
    var age = timePassed(bday, firstOfNextMonth);
    var seventyhalf = new Object();
    seventyhalf.years = 70;
    seventyhalf.monghts = 6;
    seventyhalf.days = 0;
    var diff = compareDates(age, seventyhalf);
    if (diff==0 || diff == -1) {
	//...
    } else {
	//...
    }
{% endhighlight %}

Bellow are the 3 functions: timePassed, compareDates and daysInMonth.
I used Windows' Calculator (View -> Date calculation) to test this and found no issues so far. Let me know if you find any bugs and I will correct them. 
<script src="https://gist.github.com/amihaiemil/2fc5b7f30c3de9eb299ce74e0f62453d.js"></script>
