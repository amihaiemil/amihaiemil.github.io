---
---
var index = elasticlunr(
    function () {
        this.addField('title');
        this.addField('preview');
        this.addField('content');
        this.addField('link');
        this.addField('date');
        this.setRef('id');
    }
);
var id = 0;
{% for post in site.posts %}
    var postToIndex = {
      "id": id++,
      "title": "{{ post.title | replace: '"', '\"' }}",
      "link": "{{ post.url | prepend: site.url }}",
      "preview": "{{ post.preview | replace: '"', '\"' }}",
      "content": "",                       <!--Firgure out how to index the Markdown content (before Jekyll renders it to HTML)-->
      "date": "{{ post.date }}"
    }
    index.addDoc(postToIndex);
{% endfor %}
