const loaderUtils = require('loader-utils');

module.exports = function cssurlLoader(content) {
    this.cacheable && this.cacheable();

    const options = loaderUtils.getOptions(this);
    const limit = parseInt(options.limit, 10);

    return content.toString().replace(/(url\(" \+ require\(")([^"]+)("\) \+ "\))/g, (match, before, url, after) => {
        const [filename, query = ''] = url.split('?', 2);
        if (
            options.test && options.test.test(filename)
            && (!options.exclude || !options.exclude.test(filename))
        ) {
            let name = options.name(filename);
            let img = `!url-loader?name=${name}&limit=${limit}!intecmedia-imagemin-loader!${filename}?${query}`;
            return before + img + after;
        }
        return match;
    });
};

module.exports.raw = true;
