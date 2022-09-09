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
            originRule.walkComments((item) => {
                if (item.text === ignoreText) {
                    ignoreRule = true;
                }
            });
            if (ignoreRule) return originUrl;

            originParams.set('resize', '');
            originParams.set('format', extension);

            const newUrl = [originRequest, originParams].join('?');

            let newRule = originRule[`postcss.resize.${extension}`];
            if (!newRule) {
                newRule = originRule.cloneAfter();
                originRule[`postcss.resize.${extension}`] = newRule;

                newRule.selectors = newRule.selectors.map((item) => `html.${extension} ${item}`);
                newRule.each((item) => {
                    if (item.prop !== decl.prop && item.value !== decl.value) {
                        item.remove();
                    }
                });
                newRule.raws.semicolon = true;
                newRule.raws.before = '\n';

                newRule.prepend(postcss.comment({ text: ignoreText }));
            }

            newRule.each((item) => {
                if (item.value) {
                    item.value = item.value.replace(originUrl, newUrl);
                }
            });

            return originUrl;
        },
    });
    plugin.postcssPlugin = `postcss.resize.${extension}.js`;
    return plugin;
};
