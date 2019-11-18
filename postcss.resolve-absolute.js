/* eslint-env node */
/* eslint "compat/compat": "off" */

module.exports = () => require('postcss-url')({
     url: (asset) => asset.url.replace(/^\//, '../'), // resolve absolute urls
});

