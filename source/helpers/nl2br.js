/* eslint-env node */
/* eslint "compat/compat": "off" */

const nunjucksRuntime = require('nunjucks/src/runtime');

module.exports = (str) => {
    if (str === null || str === undefined) {
        return '';
    }
    return nunjucksRuntime.copySafeness(str, str.replace(/\r\n|\n/g, '<br>\n'));
};
