/* eslint 'compat/compat': 'off' */

// for polyfill use only require
if (!window.matchMedia) {
    // eslint-disable-next-line global-require
    require('matchmedia-polyfill');
    // eslint-disable-next-line global-require
    require('matchmedia-polyfill/matchMedia.addListener');
}
