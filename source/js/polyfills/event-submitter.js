/* eslint 'compat/compat': 'off' -- useless for polyfill */

// eslint-disable-next-line no-eval -- conditinal polyfill
const polyfillRequire = (moduleId) => eval('require')(moduleId);

// for polyfill use only require
polyfillRequire('event-submitter-polyfill');
