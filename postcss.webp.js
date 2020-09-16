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

        const [request, search = ''] = originUrl.split('?', 2);
        const params = new URLSearchParams(search);
        if (params.has('resize')) return originUrl;

        params.set('resize', '');
        params.set('format', 'webp');
        params.set('name', path.basename(request, path.extname(request)));
        const webpUrl = [request, params].join('?');

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
