const UTILS = require('./webpack.utils');

const URL_PATTERN = /^url\([^)]+\)$/i;
const SPRITE_DIR = 'img/svg-sprite/';

exports.name = 'noSpriteURL';
exports.description = [
    'SVG sprite not support external content.',
    'Chromium issue: https://code.google.com/p/chromium/issues/detail?id=109212',
    'Safari issue: https://bugs.webkit.org/show_bug.cgi?id=105904',
].join('\n');

exports.fn = (root, options, extra) => ({
    element: {
        enter: (node) => {
            if (!extra.path || UTILS.slash(extra.path).indexOf(SPRITE_DIR) !== 0) {
                return;
            }
            Object.values(node.attributes).forEach((attr) => {
                if (URL_PATTERN.test(attr)) {
                    console.error(`[svgo.no-sprite-url] error in ${JSON.stringify(extra.path)}`, node);
                    throw new Error(`In ${JSON.stringify(extra.path)} -- ${exports.description}`);
                }
            });
        },
    },
});
