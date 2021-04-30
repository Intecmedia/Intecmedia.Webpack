/* eslint-env node -- webpack is node env */
/* eslint "compat/compat": "off" -- webpack is node env */

module.exports = function helper(date) {
    return (date ? new Date(date) : new Date());
};
