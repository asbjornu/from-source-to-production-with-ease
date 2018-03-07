Reveal.initialize({
    width: 1920,
    height: 1080,
    margin: 0.1,
    controls: false,
    center: false,
    dependencies: [
        {
            src: './node_modules/reveal.js/plugin/notes/notes.js',
            async: true
        },
        {
            src: './bower_components/reveal.js/plugin/highlight/highlight.js',
            async: true,
            callback: function() {
                hljs.initHighlightingOnLoad();
            }
        }
    ]
});