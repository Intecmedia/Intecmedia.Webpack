/* eslint 'compat/compat': 'off' */

// for polyfill use only require
if (!window.ResizeObserver) {
    // eslint-disable-next-line global-require
    const { default: ResizeObserver } = require('resize-observer-polyfill');
    window.ResizeObserver = ResizeObserver;
}
