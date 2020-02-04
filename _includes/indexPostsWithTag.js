<!--
    ElasticLunr logic for indexing the posts by tag.

    This Index should be used for search on a given Tag page.
    The search will be performed only through the posts which are marked with said tag.
    
    HINT: include this script at the end of the page so that, if the indexing takes
    longer, it won't affect the displaying of the page.
-->

<script src="js/elasticlunr.min.js"></script>
<script>
    var index = elasticlunr(
        function () {
            this.addField('title');
            this.addField('preview');
            this.addField('date');
            this.setRef('id');
        }
    );
    var id = 0;
    {% for post in site.tags[page.tag] %}
        var postToIndex = {
          "id": id++,
          "title": {{ post.title }},
          "preview": {{ post.preview }}
          "date": {{ post.date }}
        }
        index.addDoc(postToIndex);
    {% endfor %}
</script>
