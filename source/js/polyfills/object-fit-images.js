/* global VERBOSE */
/* eslint 'compat/compat': 'off' -- useless for polyfill */

// for polyfill use only require
const objectFitImages = require('object-fit-images');

const init = () => objectFitImages(null, { watchMQ: true });

const eventCallback = () => {
    if (VERBOSE) {
        console.log('[object-fit-images.js] init');
    }
    // wait side effects changes
    setTimeout(() => init, 0);
};

// SPA events
window.addEventListener('pushstate', eventCallback);
window.addEventListener('popstate', eventCallback);

init();

export default init;
