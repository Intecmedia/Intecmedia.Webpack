const loaderUtils = require('loader-utils');
const imageCache = {};

module.exports = function cssurlLoader(content) {
    this.cacheable && this.cacheable();

    const options = loaderUtils.getOptions(this);
    const limit = parseInt(options.limit, 10);
    const pattern = /(url\s*\("\s*\+\s*require\(")([^"]+)("\)\s*\+\s*"\))/g;

    return content.toString().replace(pattern, (match, before, url, after) => {
        if (match in imageCache) {
            return imageCache[match];
        }
        const [filename, query = ''] = url.split('?', 2);
        if (
            options.test && options.test.test(filename)
            && (!options.exclude || !options.exclude.test(filename))
        ) {
            let name = options.name(filename);
            let img = `!url-loader?name=${name}&limit=${limit}!imagemin-loader!${filename}?${query}`;
            return (imageCache[match] = before + img + after);
        }
        return (imageCache[match] = match);
    });
};

module.exports.raw = true;
module.exports.imageCache = imageCache;
