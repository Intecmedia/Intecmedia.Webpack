const fs = require('node:fs');
const path = require('node:path');
const { parse: parseSvg } = require('svg-parser');
const UTILS = require('./webpack.utils');

/*
SVG sprite not support external content.

Chromium issue: https://code.google.com/p/chromium/issues/detail?id=109212
Safari issue: https://bugs.webkit.org/show_bug.cgi?id=105904
*/

const URL_PATTERN = /url\((.+)\)/i;

const walkNodes = (root, callback) => {
    if (!root.children) return;
    root.children.forEach((node) => {
        callback(node);
        walkNodes(node, callback);
    });
};

const walkProperties = (root, callback) => {
    if (root.properties) {
        Object.entries(root.properties).forEach(([name, value]) => {
            callback(root, name, value);
        });
    }
    walkNodes(root, (node) => {
        walkProperties(node, callback);
    });
};

module.exports = function noSpriteURL(filepath) {
    const relpath = UTILS.slash(path.relative(__dirname, path.normalize(filepath)));
    const content = fs.readFileSync(filepath).toString();
    const root = parseSvg(content);

    walkProperties(root, (node, name, value) => {
        if (URL_PATTERN.test(value)) {
            throw new Error(
                [
                    `[svg-sprite] external content <${node.tagName} ${name}="${value}"> not allowed in: ${relpath}.`,
                    'Chrome issue: https://code.google.com/p/chromium/issues/detail?id=109212',
                    'Safari issue: https://bugs.webkit.org/show_bug.cgi?id=105904',
                ].join('\n')
            );
        }
    });
};
