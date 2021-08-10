/* global VERBOSE BANNER_STRING */

// import '~/components/aquilon-validator';
import '~/components/bootstrap';
import '~/components/viewport-height';
import '~/components/scrollbar-width';

import components from '~/components/';
import AbstractApp from '~/components/app';

class App extends AbstractApp {
    init() {
        document.documentElement.classList.add('ready-js');
        super.init();

        /* !!! your code here !!! */
    }
}

const app = new App({ components });
if (VERBOSE) {
    window.$app = app;
    console.log('[app]', app);
}

const domReady = () => {
    document.removeEventListener('DOMContentLoaded', domReady);
    app.init();
};
document.addEventListener('DOMContentLoaded', domReady);

console.log(`%c${BANNER_STRING}`, 'font-size:140%;font-weight:700;');

export default app;
