/* eslint-env node -- webpack is node env */
/* eslint "compat/compat": "off" -- webpack is node env */

module.exports = function helper(url) {
    return new URL(url);
};
