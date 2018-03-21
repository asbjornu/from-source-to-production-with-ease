Reveal.initialize({
    width: 1920,
    height: 1080,
    margin: 0.1,
    controls: false,
    center: true,
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

var link = document.createElement('link');
link.rel = 'stylesheet';
link.type = 'text/css';
link.href = window.location.search.match(/print-pdf/gi)
          ? 'node_modules/reveal.js/css/print/pdf.css'
          : 'node_modules/reveal.js/css/print/paper.css';
document.getElementsByTagName('head')[0].appendChild(link);
