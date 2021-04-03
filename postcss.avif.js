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
                if (i.text === 'postcss.avif: ignore') {
                    ignored = true;
                }
            });

            if (ignored) return originUrl;
            originRule.append(postcss.comment({ text: 'postcss.avif: ignore' }));

            originParams.set('resize', '');
            originParams.set('format', 'avif');

            const originName = path.basename(originRequest, path.extname(originRequest));
            originParams.set('name', `${originName}@postcss`);

            const avifUrl = [originRequest, originParams].join('?');
            const avifRule = originRule.__postcssAvifRule__ || originRule.cloneAfter();

            if (!originRule.__postcssAvifRule__) {
                originRule.__postcssAvifRule__ = avifRule;

                avifRule.selectors = avifRule.selectors.map((i) => `html.avif ${i}`);
                avifRule.each((i) => {
                    if (i.prop !== decl.prop && i.value !== decl.value) {
                        i.remove();
                    }
                });
                avifRule.raws.semicolon = true;
                avifRule.raws.before = '\n';
            }

            avifRule.each((i) => {
                i.value = i.value.replace(originUrl, avifUrl);
            });

            return originUrl;
        },
    });
    plugin.postcssPlugin = 'postcss.avif.js';
    return plugin;
};
