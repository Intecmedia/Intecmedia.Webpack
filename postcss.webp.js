const path = require('path');
const { default: webpcss } = require('webpcss');
const { URLSearchParams } = require('url');

module.exports = () => webpcss({
    webpClass: 'html.webp',
    noWebpClass: '',
    replace_from: /.(png|jpg|jpeg)(\?.*)?$/i,
    replace_to: (input) => {
        const [request, search = ''] = input.url.split('?', 2);
        const params = new URLSearchParams(search);
        if (params.has('resize')) return input.url;
        params.set('name', path.basename(request, path.extname(request)));
        params.set('resize', '');
        params.set('format', 'webp');
        return [request, params].join('?');
    },
});
