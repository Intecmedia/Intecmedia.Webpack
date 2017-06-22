/* eslint global-require: "off" */
const UglifyJS = require('uglify-js');
const loaderUtils = require('loader-utils');

const cssurlCache = {};

module.exports = function cssurlLoader(content) {
    if (this.cacheable) {
        this.cacheable();
    }

    const defaultOptions = {
        test: /\.(jpe?g|png|gif|svg)$/i,
        exclude: null,
        limit: 0,
        name: () => '[path]/[name].[ext]',
    };
    const options = Object.assign({}, defaultOptions, loaderUtils.getOptions(this));
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
            const [filename] = url.split('?', 2);
            if (
                options.test && options.test.test(filename)
                && (!options.exclude || !options.exclude.test(filename))
            ) {
                const name = options.name(filename);
                const loader = /\.svg$/i.test(filename) ? 'svg-url-loader' : 'url-loader';
                cssurlCache[url] = `!${loader}?name=${name}&limit=${limit}!imagemin-loader!${url}`;

                const newNode = node.clone();
                newNode.args[0].value = cssurlCache[url];
                return newNode;
            }
        }
        return node;
    });

    const requireTree = UglifyJS.parse(content.toString());
    const tranformedTree = requireTree.transform(requireTransformer);

    return Buffer.from(tranformedTree.print_to_string({
        beautify: true,
        comments: true,
        preserve_line: true,
    }));
};

module.exports.raw = true;
