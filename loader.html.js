const path = require('path');
const SVGO = require('svgo');
const slash = require('slash');
const loaderUtils = require('loader-utils');
const nunjucks = require('nunjucks');
const frontMatter = require('front-matter');
const deepAssign = require('deep-assign');
const { FileSystemLoader } = require('nunjucks/src/loaders');

const svgo = new SVGO({
    plugins: [
        { cleanupIDs: false },
        { convertShapeToPath: false },
        { removeViewBox: false },
        { removeAttrs: { attrs: 'data\\-.*' } },
    ],
});

const optimizeSvg = (svgstr, svgpath) => {
    let optimized;
    let done = false;
    svgo.optimize(svgstr, { path: svgpath }).then((result) => {
        done = true;
        optimized = result.data;
    });
    // eslint-disable-next-line no-underscore-dangle
    while (!done) { process._tickCallback(); }
    return optimized;
};

const DEFAULT_OPTIONS = {
    context: {},
    noCache: true,
    searchPaths: ['.'],
    configure: {
        autoescape: true,
        trimBlocks: true,
        lstripBlocks: false,
        watch: false,
        noCache: true,
    },
};

module.exports = function HtmlLoader(source) {
    const loaderThis = this;
    const callback = loaderThis.async();
    const options = deepAssign({}, DEFAULT_OPTIONS, loaderUtils.getOptions(loaderThis));

    const loader = new FileSystemLoader(options.searchPaths, { noCache: options.noCache });
    const originalGetSource = loader.getSource;
    loader.getSource = function getSource(...args) {
        const result = originalGetSource.apply(this, args);
        if (!result.path) return source;

        const extension = path.extname(result.path);
        if (extension === '.svg') {
            result.src = optimizeSvg(result.src, result.path);
        }

        loaderThis.addDependency(result.path);

        return result;
    };

    const environment = new nunjucks.Environment(loader);
    nunjucks.configure(null, options.configure);

    const content = frontMatter(source);

    const context = deepAssign({}, options.context, { PAGE: content.attributes });
    const relativePath = path.relative('./source', loaderThis.resourcePath);
    context.PAGE.RESOURCE_PATH = slash(path.sep + relativePath);

    const template = nunjucks.compile(content.body, environment);
    console.log(`[loader-html] processing '${loaderThis.resourcePath}'`);
    template.render(context, (error, result) => {
        if (error) throw error;
        callback(null, `export default ${JSON.stringify(result)};`);
    });
};
