/* global NODE_ENV DEBUG VERBOSE */

// import '~/components/aquilon-validator';
import '~/components/bootstrap';
import '~/components/viewport-height';
import '~/components/network-information';
import '~/components/scrollbar-width';

class App {
    constructor() {
        this.store = {};
    }

    init() {
        console.log(`NODE_ENV=${NODE_ENV}; DEBUG=${DEBUG}; jQuery=${$.fn && $.fn.jquery ? $.fn.jquery : 'undefined'};`);
        document.documentElement.classList.add('ready-js');

        // !!! your code here !!!
    }
}

const app = new App();
if (VERBOSE) {
    window.$app = app;
    console.log('[app]', app);
}

const domReady = () => {
    document.removeEventListener('DOMContentLoaded', domReady);
    app.init();
};
document.addEventListener('DOMContentLoaded', domReady);

export default app;
