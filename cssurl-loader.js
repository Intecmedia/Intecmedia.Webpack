/* eslint global-require: "off" */
const loaderUtils = require('loader-utils');

const cssurlCache = {};

module.exports = function cssurlLoader(content) {
    if (this.cacheable) {
        this.cacheable();
    }

    const options = loaderUtils.getOptions(this);
    const limit = parseInt(options.limit, 10);
    const pattern = /(url \(" \+ require\(")([^"]+)("\) \+ "\))/g;

    return Buffer.from(content.toString().replace(pattern, (match, before, url, after) => {
        if (match in cssurlCache) {
            return cssurlCache[match];
        }
        const [filename, query = ''] = url.split('?', 2);
        if (
            options.test && options.test.test(filename)
            && (!options.exclude || !options.exclude.test(filename))
        ) {
            const name = options.name(filename);
            const img = `!url-loader?name=${name}&limit=${limit}!imagemin-loader!${filename}?${query}`;
            return (cssurlCache[match] = before + img + after);
        }
        return (cssurlCache[match] = match);
    }));
};

module.exports.raw = true;
module.exports.cssurlCache = cssurlCache;
