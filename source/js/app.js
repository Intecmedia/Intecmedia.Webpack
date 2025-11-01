/**
 * --------------------------------------------------------------------------
 * App webpack-entry
 * --------------------------------------------------------------------------
 */

/* global NODE_ENV VERBOSE BANNER_STRING */

import '~/components/bootstrap';

import components from '~/components/';
import AbstractApp from '~/components/app';

/**
 * Main application.
 */
class App extends AbstractApp {
    /**
     * Init application.
     */
    init() {
        document.documentElement.classList.add('ready-js');
        document.documentElement.classList.add('is-page-transition-ready');
        super.init();
    }
}

if (NODE_ENV === 'production') {
    console.log(`%c${BANNER_STRING}`, 'font-size:140%;font-weight:700;');
}

const app = new App({ components });
if (VERBOSE) {
    window.$app = app;
    console.log('[app] new', app);
}

const domReady = () => {
    document.removeEventListener('DOMContentLoaded', domReady);
    app.init();
};
document.addEventListener('DOMContentLoaded', domReady);

export default app;
