/* eslint-env node -- webpack is node env */
/* eslint "compat/compat": "off" -- webpack is node env */

module.exports = function helper(array) {
    return array.sort(() => Math.random() - 0.5);
};
