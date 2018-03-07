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
        }
    ]
});

var presentation = new Presentation();

Reveal.addEventListener('slidechanged', presentation.slideChanged);
Reveal.addEventListener('fragmentshown', presentation.fragmentShown);
Reveal.addEventListener('fragmenthidden', presentation.fragmentHidden);