/* eslint-env node */
/* eslint global-require: "off", "compat/compat": "off" */

module.exports = () => require('postcss-url')({
    url: (asset) => asset.url.replace(/^\/([^/])/, '../$1'), // resolve absolute urls
});
