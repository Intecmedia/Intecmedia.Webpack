const UTILS = require('./webpack.utils');

const SPRITE_DIR = 'img/svg-sprite/';
const SPRITE_FILE = 'img/svg-sprite.svg';
const URL_PATTERN = /^url\([^)]+\)$/i;

exports.name = 'noSpriteURL';
exports.description = [
    'SVG sprite not support external content.',
    'Chromium issue: https://code.google.com/p/chromium/issues/detail?id=109212',
    'Safari issue: https://bugs.webkit.org/show_bug.cgi?id=105904',
].join('\n');

exports.fn = (root, options, info) => ({
    element: {
        enter: (node) => {
            if (!info.path) {
                return;
            }
            const filepath = info.path ? UTILS.slash(info.path) : false;
            if (!(filepath.indexOf(SPRITE_DIR) === 0 || filepath.indexOf(SPRITE_FILE) === 0)) {
                return;
            }
            Object.values(node.attributes).forEach((attr) => {
                if (URL_PATTERN.test(attr)) {
                    console.error(`[svgo.no-sprite-url] error in ${JSON.stringify(info.path)}`, node);
                    throw new Error(`In ${JSON.stringify(info.path)} -- ${exports.description}`);
                }
            });
        },
    },
});
