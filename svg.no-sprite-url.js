const fs = require('node:fs');
const path = require('node:path');
const UTILS = require('./webpack.utils');

/*
SVG sprite not support external content.

Chromium issue: https://code.google.com/p/chromium/issues/detail?id=109212
Safari issue: https://bugs.webkit.org/show_bug.cgi?id=105904
*/

const URL_TAGS_PATTERN = /<[^>]+="url\([^)]+\)"[^>]*>/gi;

module.exports = function noSpriteURL(filepath) {
    const relpath = UTILS.slash(path.relative(__dirname, path.normalize(filepath)));
    const content = fs.readFileSync(filepath).toString();

    if (URL_TAGS_PATTERN.test(content)) {
        const tags = content.match(URL_TAGS_PATTERN);

        throw new Error(
            [
                `[svg-sprite] external content \`${tags.join('\`, \`')}\` not allowed in: ${relpath}`,
                'Chrome issue: https://code.google.com/p/chromium/issues/detail?id=109212',
                'Safari issue: https://bugs.webkit.org/show_bug.cgi?id=105904',
            ].join('\n')
        );
    }
};
