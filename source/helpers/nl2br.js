/* eslint-env node -- webpack is node env */
/* eslint "compat/compat": "off" -- webpack is node env */

const nunjucksRuntime = require('nunjucks/src/runtime');

module.exports = (str) => {
    if (str === null || str === undefined) {
        return '';
    }
    return nunjucksRuntime.copySafeness(str, str.replace(/\r\n|\n/g, '<br>\n'));
};
