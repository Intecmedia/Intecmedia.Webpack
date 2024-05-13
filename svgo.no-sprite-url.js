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

const isSpriteFile = (info) => {
    if (!info.path) return false;
    const filepath = UTILS.slash(info.path);
    if (filepath.startsWith(SPRITE_DIR) || filepath.startsWith(SPRITE_FILE)) {
        return true;
    }
    return false;
};

exports.fn = (root, options, info) => {
    if (!isSpriteFile(info)) return {};
    return {
        element: {
            enter: (node) => {
                Object.values(node.attributes).forEach((attr) => {
                    if (URL_PATTERN.test(attr)) {
                        console.error(`[svgo.no-sprite-url] error in ${JSON.stringify(info.path)}`, node);
                        throw new Error(`In ${JSON.stringify(info.path)} -- ${exports.description}`);
                    }
                });
            },
        },
    };
};
