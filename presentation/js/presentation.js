function Presentation() {
    var previousStep = -1;
    var knownFragments = ['plan', 'create', 'build', 'package', 'release', 'configure', 'monitor'];

    var getNavigation = function(event) {
        var currentSlide = Reveal.getCurrentSlide();

        var nav = {
            id: currentSlide.id,
            step: Reveal.getIndices().f,
        };

        if (event.fragment && typeof event.fragment.className === "string") {
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
    };

    this.fragmentShown = function(event) {
        var nav = getNavigation(event);

        if (nav.id != 'pipeline' ||!event.fragment || !event.fragment.className) {
            return;
        }

        var dimPartsExcept = function(visiblePart) {
            var parts = document.getElementsByClassName('part');
            for (var part of parts) {
                if (part.className.baseVal.indexOf(visiblePart) > -1) {
                    part.className.baseVal = 'part ' + visiblePart;
                } else {
                    part.className.baseVal += ' dim';
                }
            }
        }

        switch (nav.fragment) {
            case 'monitor':
            case 'plan':
                var part = document.getElementsByClassName(nav.fragment)[0];
                part.className.baseVal += ' off';
                break;

            case 'build':
            case 'create':
                dimPartsExcept(nav.fragment);
                break;

            case 'package':
                dimPartsExcept(nav.fragment);
        
                for (var f of nav.fragments) {
                    var el = document.getElementsByClassName(f)[0];
                    el.className.baseVal = el.className.baseVal.replace('dim', 'on');                                
                }
                break;
        }
    };

    this.fragmentHidden = function(event) {        
        var nav = getNavigation(event);

        if (nav.id != 'pipeline') {
            return;
        }

        var monitor = document.getElementsByClassName('monitor-dim')[0];
        var monitorText = document.getElementsByClassName('text-dim')[0];
        monitor.className.baseVal = 'monitor';
        monitorText.className.baseVal = 'monitor-text';
    };
}