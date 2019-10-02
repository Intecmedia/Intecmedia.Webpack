/* eslint-env node */
/* eslint "compat/compat": "off" */

const path = require('path');
const { default: webpcss } = require('webpcss');
const { URLSearchParams } = require('url');

const IMAGE_PATTERN = /.(png|jpg|jpeg)(\?.*)?$/i;

module.exports = () => webpcss({
    noWebpClass: '',
    replace_from: IMAGE_PATTERN,
    webpClass: 'html.webp',
    replace_to(input) {
        if (!IMAGE_PATTERN.test(input.url)) return input.url;
        const [request, search = ''] = input.url.split('?', 2);
        const params = new URLSearchParams(search);
        if (params.has('resize')) return input.url;
        params.set('resize', '');
        params.set('format', 'webp');
        params.set('name', path.basename(request, path.extname(request)));
        return [request, params].join('?');
    },
});
