/* eslint-env node -- webpack is node env */
/* eslint "compat/compat": "off" -- webpack is node env */

const path = require('path');
const { URLSearchParams } = require('url');
const postcss = require('postcss');
const postcssUrl = require('postcss-url');

const IMAGE_PATTERN = /.(png|jpg|jpeg)(\?.*)?$/i;

module.exports = () => {
    const plugin = postcssUrl({
        url(asset, dir, options, decl) {
            const { originUrl } = asset;

            if (!IMAGE_PATTERN.test(originUrl)) return originUrl;

            const [originRequest, originSearch = ''] = originUrl.split('?', 2);
            const originParams = new URLSearchParams(originSearch);
            if (originParams.get('format') === 'webp') return originUrl;
            if (originParams.get('format') === 'avif') return originUrl;

            const originRule = decl.parent;

            let ignored = false;
            originRule.walkComments((i) => {
                if (i.text === 'postcss.webp: ignore') {
                    ignored = true;
                }
            });
            if (ignored) return originUrl;
            originRule.append(postcss.comment({ text: 'postcss.webp: ignore' }));

            originParams.set('resize', '');
            originParams.set('format', 'webp');

            const originName = path.basename(originRequest, path.extname(originRequest));
            originParams.set('name', `${originName}@postcss`);

            const webpUrl = [originRequest, originParams].join('?');
            const webpRule = originRule.__postcssWebpRule__ || originRule.cloneAfter();

            if (!originRule.__postcssWebpRule__) {
                originRule.__postcssWebpRule__ = webpRule;

                webpRule.selectors = webpRule.selectors.map((i) => `html.webp ${i}`);
                webpRule.each((i) => {
                    if (i.prop !== decl.prop && i.value !== decl.value) {
                        i.remove();
                    }
                });
                webpRule.raws.semicolon = true;
                webpRule.raws.before = '\n';
            }

            webpRule.each((i) => {
                i.value = i.value.replace(originUrl, webpUrl);
            });

            return originUrl;
        },
    });
    plugin.postcssPlugin = 'postcss.webp.js';
    return plugin;
};
