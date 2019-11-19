/* eslint-env node */
/* eslint global-require: "off", "compat/compat": "off" */

const ABSOLUTE_PATTERN = /^\/([^/])/;
const ABSOLUTE_REPLACE = '../$1';

module.exports = () => require('postcss-url')({
    url: (asset) => asset.url.replace(ABSOLUTE_PATTERN, ABSOLUTE_REPLACE), // resolve absolute urls
});
