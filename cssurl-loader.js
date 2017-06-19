const loaderUtils = require('loader-utils');
const cssurlCache = {};

module.exports = function cssurlLoader(content) {
    this.cacheable && this.cacheable();

    const options = loaderUtils.getOptions(this);
    const limit = parseInt(options.limit, 10);
    const pattern = /(url\s*\("\s*\+\s*require\(")([^"]+)("\)\s*\+\s*"\))/g;

    return new Buffer(content.toString().replace(pattern, (match, before, url, after) => {
        if (match in cssurlCache) {
            return cssurlCache[match];
        }
        const [filename, query = ''] = url.split('?', 2);
        if (
            options.test && options.test.test(filename)
            && (!options.exclude || !options.exclude.test(filename))
        ) {
            let name = options.name(filename);
            let img = `!url-loader?name=${name}&limit=${limit}!imagemin-loader!${filename}?${query}`;
            return (cssurlCache[match] = before + img + after);
        }
        return (cssurlCache[match] = match);
    }));
};

module.exports.raw = true;
module.exports.cssurlCache = cssurlCache;
