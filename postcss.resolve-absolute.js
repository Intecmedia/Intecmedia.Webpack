/* eslint-env node */
/* eslint global-require: "off", "compat/compat": "off" */

const weblog = require('webpack-log');
const postcssUrl = require('postcss-url');

const logger = weblog({ name: 'resolve-absolute' });

const ABSOLUTE_PATTERN = /^\/([^/])/;
const ABSOLUTE_REPLACE = '../$1';

module.exports = (options) => postcssUrl({
    url(asset) {
        if (!ABSOLUTE_PATTERN.test(asset.url)) return asset.url;

        const url = asset.url.replace(ABSOLUTE_PATTERN, ABSOLUTE_REPLACE);
        const message = [
            `Absolute url(${JSON.stringify(asset.url)}) resolved as url(${JSON.stringify(url)}).`,
            'Please fix to relative.',
        ].join(' ');

        logger.warn(message);
        if (!options.silent) throw new Error(message);

        return url; // resolve absolute urls
    },
});
