/* eslint-env node -- webpack is node env */
/* eslint "compat/compat": "off" -- webpack is node env */

module.exports = function helper(params) {
    return new URLSearchParams(params).toString();
};
