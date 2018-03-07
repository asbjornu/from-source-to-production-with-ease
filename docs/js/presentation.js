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

        if (nav.forward) {
            
        }
    };

    this.fragmentHidden = function() {        
        var nav = getNavigation();

        console.log('fragmentHidden', nav);

        if (nav.id != 'pipeline') {
            return;
        }
    };
}