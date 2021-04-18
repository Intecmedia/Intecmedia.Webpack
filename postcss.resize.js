/* eslint-env node -- webpack is node env */
/* eslint "compat/compat": "off" -- webpack is node env */

const path = require('path');
const { URLSearchParams } = require('url');
const postcss = require('postcss');
const postcssUrl = require('postcss-url');

const IMAGE_PATTERN = /.(png|jpg|jpeg)(\?.*)?$/i;
const FORMAT_IGNORE = /^(webp|avif)$/i;

module.exports = (extension) => {
    const plugin = postcssUrl({
        url(asset, dir, options, decl) {
            const { originUrl } = asset;

            if (!IMAGE_PATTERN.test(originUrl)) return originUrl;

            const [originRequest, originSearch = ''] = originUrl.split('?', 2);
            const originParams = new URLSearchParams(originSearch);
            const originFormat = originParams.get('format');
            if (originFormat && FORMAT_IGNORE.test(originFormat)) return originUrl;

            const originRule = decl.parent;

            let ignoreRule = false;
            const ignoreText = `postcss.resize.${extension}: ignore`;
            originRule.walkComments((i) => {
                if (i.text === ignoreText) {
                    ignoreRule = true;
                }
            });
            if (ignoreRule) return originUrl;
            originRule.append(postcss.comment({ text: ignoreText }));

            originParams.set('resize', '');
            originParams.set('format', extension);

            const originName = path.basename(originRequest, path.extname(originRequest));
            originParams.set('name', `${originName}@postcss`);

            const newUrl = [originRequest, originParams].join('?');
            const newRule = originRule.cloneAfter();

            newRule.selectors = newRule.selectors.map((i) => `html.${extension} ${i}`);
            newRule.each((i) => {
                if (i.prop !== decl.prop && i.value !== decl.value) {
                    i.remove();
                }
            });
            newRule.raws.semicolon = true;
            newRule.raws.before = '\n';

            newRule.each((i) => {
                i.value = i.value.replace(originUrl, newUrl);
            });

            return originUrl;
        },
    });
    plugin.postcssPlugin = `postcss.resize.${extension}.js`;
    return plugin;
};
