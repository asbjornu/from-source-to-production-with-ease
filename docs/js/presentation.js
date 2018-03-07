function Presentation() {
    var previousStep = -1;

    var getNavigation = function() {
        var nav = {
            id: Reveal.getCurrentSlide().id,
            step: Reveal.getIndices().f,
        };
    
        nav.forward = nav.step >= previousStep;
        nav.backward = nav.step < previousStep;

        return nav;
    }

    this.slideChanged = function() {
        var nav = getNavigation();

        if (nav.id != 'pipeline') {
            return;
        }

        console.log('slideChanged', nav);
    };

    this.fragmentShown = function() {
        var nav = getNavigation();

        console.log('fragmentShown', nav);

        if (nav.id != 'pipeline') {
            return;
        }

        var monitor = document.getElementsByClassName('monitor')[0];
        var monitorText = document.getElementsByClassName('monitor-text')[0];
        monitor.className.baseVal = 'monitor-dim';
        monitorText.className.baseVal = 'text-dim';
    };

    this.fragmentHidden = function() {        
        var nav = getNavigation();

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