/* global VERBOSE BANNER_STRING */

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
        console.log(BANNER_STRING);
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
