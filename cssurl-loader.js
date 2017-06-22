/* eslint global-require: "off" */
const UglifyJS = require('uglify-js');
const loaderUtils = require('loader-utils');

const cssurlCache = {};

module.exports = function cssurlLoader(content) {
    if (this.cacheable) {
        this.cacheable();
    }

    const options = loaderUtils.getOptions(this);
    const limit = parseInt(options.limit, 10);

    const requireTransformer = new UglifyJS.TreeTransformer(null, (node) => {
        if (
            node instanceof UglifyJS.AST_Call
            && node.expression instanceof UglifyJS.AST_SymbolRef
            && node.expression.name === 'require'
            && node.args.length === 1
        ) {
            const url = node.args[0].value;
            if (url in cssurlCache) {
                const newNode = node.clone();
                newNode.args[0].value = cssurlCache[url];
                return newNode;
            }
            const [filename, query = ''] = url.split('?', 2);
            if (
                options.test && options.test.test(filename)
                && (!options.exclude || !options.exclude.test(filename))
            ) {
                const newNode = node.clone();
                const name = options.name(filename);
                cssurlCache[url] = `!url-loader?name=${name}&limit=${limit}!imagemin-loader!${filename}?${query}`;
                newNode.args[0].value = cssurlCache[url];
                return newNode;
            }
        }
        return node;
    });

    const requireTree = UglifyJS.parse(content.toString());

    return Buffer.from(requireTree.transform(requireTransformer).print_to_string({
        beautify: true,
        comments: true,
        preserve_line: true,
    }));
};

module.exports.raw = true;
