/* eslint 'compat/compat': 'off' -- useless for polyfill */

// for polyfill use only require
if (!window.matchMedia) {
    // eslint-disable-next-line global-require -- conditinal polyfill
    require('matchmedia-polyfill');
    // eslint-disable-next-line global-require -- conditinal polyfill
    require('matchmedia-polyfill/matchMedia.addListener');
}
