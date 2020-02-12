<!--
    ElasticLunr logic for indexing the posts.

    Only the title and preview (short text) of each post will be intexed, for now.

    HINT: include this script at the end of the page so that, if the indexing takes
    longer, it won't affect the displaying of the page.
-->

<script src="/js/elasticlunr.min.js"></script> <!--Include ElasticLunr on the page-->
<script> <!-- Index all posts. -->
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
          "content": "";                       <!--Firgure out how to index the Markdown content (before Jekyll renders it to HTML)-->
          "date": "{{ post.date }}"
        }
        index.addDoc(postToIndex);
    {% endfor %}
</script>
