/* global VERBOSE */
/* eslint 'compat/compat': 'off' */

// for polyfill use only require
const picturefill = require('picturefill');

const init = (reevaluate = false) => picturefill({ reevaluate });

// SPA events
const eventCallback = () => {
    if (VERBOSE) {
        console.log('[picturefill.js] init');
    }
    // wait side effects changes
    setTimeout(() => init(true), 0);
};

// SPA events
window.addEventListener('pushstate', eventCallback);
window.addEventListener('popstate', eventCallback);

init();

export default init;
