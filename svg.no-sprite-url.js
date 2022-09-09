const fs = require('fs');
const path = require('path');
const slash = require('slash');
const { parseSvg } = require('svgo/lib/parser');

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

const walkAttributes = (root, callback) => {
    if (root.attributes) {
        Object.entries(root.attributes).forEach(([name, value]) => {
            callback(root, name, value);
        });
    }
    walkNodes(root, (node) => {
        walkAttributes(node, callback);
    });
};

module.exports = function noSpriteURL(filepath) {
    const relpath = slash(path.relative(__dirname, path.normalize(filepath)));
    const content = fs.readFileSync(filepath).toString();
    const root = parseSvg(content);

    walkAttributes(root, (node, name, value) => {
        if (URL_PATTERN.test(value)) {
            throw new Error(
                [
                    `[svg-sprite] external content <${node.name} ${name}="${value}"> not allowed in: ${relpath}.`,
                    'Chrome issue: https://code.google.com/p/chromium/issues/detail?id=109212',
                    'Safari issue: https://bugs.webkit.org/show_bug.cgi?id=105904',
                ].join('\n')
            );
        }
    });
};
