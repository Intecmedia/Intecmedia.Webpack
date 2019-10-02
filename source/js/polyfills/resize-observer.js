// for polyfill use only require

if (!window.ResizeObserver) {
    // eslint-disable-next-line global-require
    const ResizeObserver = require('resize-observer-polyfill');
    window.ResizeObserver = ResizeObserver;
}
