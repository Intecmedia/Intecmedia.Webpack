/* eslint global-require: "off" */
const path = require('path');
const { URLSearchParams } = require('url');

const INLINE_FILES = ['png', 'jpeg', 'jpg', 'gif', 'svg'];

module.exports = () => require('postcss-url')({
    filter(asset) {
        if (!asset.pathname) return false;
        if (/[&?]inline=/.test(asset.search)) return false;
        const format = path.extname(asset.pathname).substr(1);
        return INLINE_FILES.includes(format.toLowerCase());
    },
    url(asset) {
        const params = new URLSearchParams(asset.search);
        const format = params.get('format') || path.extname(asset.pathname).substr(1);
        if (INLINE_FILES.includes(format.toLowerCase())) {
            params.set('inline', 'inline');
        }
        return `${asset.pathname}?${params.toString()}`;
    },
});
