function Presentation() {
    var previousStep = -1;
    var knownFragments = ['plan', 'create', 'build', 'package', 'release', 'configure', 'monitor'];

    var getNavigation = function(event) {
        var currentSlide = Reveal.getCurrentSlide();

        var nav = {
            id: currentSlide.id,
            step: Reveal.getIndices().f,
        };

        if (event.fragment && event.fragment.className) {
            var classNames = event.fragment.className.split(' ');
            nav.fragments = classNames.filter(f => knownFragments.indexOf(f.trim()) > -1);
            nav.fragment = nav.fragments[0];
        }

        nav.forward = nav.step >= previousStep;
        nav.backward = nav.step < previousStep;

        return nav;
    }

    this.slideChanged = function(event) {
        var nav = getNavigation(event);

        if (nav.id != 'pipeline') {
            return;
        }

        console.log('slideChanged', nav);
    };

    this.fragmentShown = function(event) {
        var nav = getNavigation(event);

        console.log('fragmentShown', nav);

        if (nav.id != 'pipeline' ||!event.fragment || !event.fragment.className) {
            return;
        }

        switch (nav.fragment) {
            case 'monitor':
            case 'plan':
                var el = document.getElementsByClassName(nav.fragment)[0];
                el.className.baseVal += ' off';
                break;

            case 'create':
                var els = document.getElementsByClassName('part');
                for (var el of els) {
                    if (el.className.baseVal.indexOf(nav.fragment) > -1) {
                        continue;
                    }

                    el.className.baseVal += ' dim';
                }
                break;

            case 'build':
                var el = document.getElementsByClassName(nav.fragment)[0];
                el.className.baseVal = el.className.baseVal.replace('dim', 'on');                                
                break;

            case 'package':
                for (var f of nav.fragments) {
                    var el = document.getElementsByClassName(f)[0];
                    el.className.baseVal = el.className.baseVal.replace('dim', 'on');                                
                }
                break;
        }
    };

    this.fragmentHidden = function(event) {        
        var nav = getNavigation(event);

        console.log('fragmentHidden', nav);

        if (nav.id != 'pipeline') {
            return;
        }

        var monitor = document.getElementsByClassName('monitor-dim')[0];
        var monitorText = document.getElementsByClassName('text-dim')[0];
        monitor.className.baseVal = 'monitor';
        monitorText.className.baseVal = 'monitor-text';
    };
}