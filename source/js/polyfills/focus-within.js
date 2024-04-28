/**
 * --------------------------------------------------------------------------
 * Focus-within polyfill
 * https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-within
 * --------------------------------------------------------------------------
 */

// for polyfill use only require
const { default: focusWithin } = require('focus-within');

focusWithin(document);
