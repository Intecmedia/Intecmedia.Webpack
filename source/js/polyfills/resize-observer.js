/* eslint 'compat/compat': 'off' -- useless for polyfill */

// for polyfill use only require
if (!window.ResizeObserver) {
    // eslint-disable-next-line global-require -- conditinal polyfill
    const { default: ResizeObserver } = require('resize-observer-polyfill');
    window.ResizeObserver = ResizeObserver;
}
