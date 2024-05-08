const fs = require('node:fs');
const path = require('node:path');
const UTILS = require('./webpack.utils');

/*
SVG sprite not support external content.

Chromium issue: https://code.google.com/p/chromium/issues/detail?id=109212
Safari issue: https://bugs.webkit.org/show_bug.cgi?id=105904
*/

const URL_PATTERN = /<[^>]+="url\([^)]+\)"[^>]*>/gi;

module.exports = function noSpriteURL(filepath) {
    const relpath = UTILS.slash(path.relative(__dirname, path.normalize(filepath)));
    const content = fs.readFileSync(filepath).toString();

    if (URL_PATTERN.test(content)) {
        const matches = [...content.match(URL_PATTERN)];

        throw new Error(
            [
                `[svg-sprite] external content \`${matches.join('\`, \`')}\` not allowed in: ${relpath}`,
                'Chrome issue: https://code.google.com/p/chromium/issues/detail?id=109212',
                'Safari issue: https://bugs.webkit.org/show_bug.cgi?id=105904',
            ].join('\n')
        );
    }
};
