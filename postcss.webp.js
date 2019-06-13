const path = require('path');
const { default: webpcss } = require('webpcss');
const { URLSearchParams } = require('url');

module.exports = () => webpcss({
    webpClass: '.webp',
    noWebpClass: '',
    replace_from: /.(png|jpg|jpeg)(\?.*)?$/i,
    replace_to: ({ url }) => {
        const [urlPath, searchPath = ''] = url.split('?', 2);
        const searchParams = new URLSearchParams(searchPath);
        const name = path.basename(urlPath, path.extname(urlPath));
        searchParams.set('resize', '');
        searchParams.set('format', 'webp');
        searchParams.set('name', name);
        return [urlPath, searchParams].join('?');
    },
});
