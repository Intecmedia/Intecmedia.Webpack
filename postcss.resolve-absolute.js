const weblog = require('webpack-log');
const postcssUrl = require('postcss-url');

const logger = weblog({ name: 'resolve-absolute' });

const ABSOLUTE_PATTERN = /^\/([^/])/;
const ABSOLUTE_REPLACE = '../$1';

module.exports = ({ silent }) => {
    const plugin = postcssUrl({
        url(asset, dir, options, decl, warn) {
            const { originUrl } = asset;

            if (!ABSOLUTE_PATTERN.test(originUrl)) return originUrl;

            const resolvedUrl = originUrl.replace(ABSOLUTE_PATTERN, ABSOLUTE_REPLACE); // resolve absolute urls
            const message = [
                `Absolute url(${JSON.stringify(originUrl)}) resolved as url(${JSON.stringify(resolvedUrl)}).`,
                'Please fix to relative.',
            ].join(' ');

            warn(message);
            logger.error(message);
            if (!silent) throw new Error(message);

            return resolvedUrl;
        },
    });
    plugin.postcssPlugin = 'postcss.resolve-absolute.js';
    return plugin;
};
