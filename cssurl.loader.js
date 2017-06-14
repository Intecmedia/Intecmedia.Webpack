const loaderUtils = require('loader-utils');

module.exports = function cssurl(content) {
    this.cacheable && this.cacheable();

    const options = loaderUtils.getOptions(this);
    const limit = parseInt(options.limit, 10);

    return content.toString().replace(/(url\(" \+ require\(")([^"]+)("\) \+ "\))/g, (match, before, url, after) => {
        const [filename, query = ''] = url.split('?', 2);
        if (
            options.test && options.test.test(filename)
            && (!options.exclude || !options.exclude.test(filename))
        ) {
            return `${before}!!url-loader?limit=${limit}!${filename}?${query}${after}`;
        }
        return match;
    });
};

module.exports.raw = true;
