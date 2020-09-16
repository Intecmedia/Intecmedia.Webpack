/* eslint-env node */
/* eslint "compat/compat": "off" */

const path = require('path');
const { URLSearchParams } = require('url');
const postcssUrl = require('postcss-url');

const IMAGE_PATTERN = /.(png|jpg|jpeg)(\?.*)?$/i;

module.exports = () => postcssUrl({
    url(asset, dir, options, decl) {
        const { originUrl } = asset;

        if (!IMAGE_PATTERN.test(originUrl)) return originUrl;

        const [originRequest, originSearch = ''] = originUrl.split('?', 2);
        const originParams = new URLSearchParams(originSearch);
        if (originParams.has('resize')) return originUrl;

        originParams.set('resize', '');
        originParams.set('format', 'webp');
        originParams.set('name', path.basename(originRequest, path.extname(originRequest)));
        const webpUrl = [originRequest, originParams].join('?');

        const originRule = decl.parent;
        const webpRule = originRule.cloneAfter();

        webpRule.selectors = webpRule.selectors.map((i) => `html.wepb ${i}`);
        webpRule.each((i) => {
            if (i.prop !== decl.prop && i.value !== decl.value) {
                i.remove();
            } else {
                i.value = i.value.replace(originUrl, webpUrl);
            }
        });
        webpRule.raws.semicolon = true;
        webpRule.raws.before = '\n';

        return originUrl;
    },
});
