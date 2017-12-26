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

module.exports = function HtmlLoader(template) {
    const loaderThis = this;
    const options = deepAssign({}, DEFAULT_OPTIONS, loaderUtils.getOptions(loaderThis));

    const nunjucksSearchPaths = options.searchPaths;
    const nunjucksContext = options.context;

    const nunjucksLoader = new FileSystemLoader(nunjucksSearchPaths, { noCache: options.noCache });

    const originalGetSource = nunjucksLoader.getSource;
    nunjucksLoader.getSource = function getSource(...args) {
        const source = originalGetSource.apply(this, args);
        if (!source.path) return source;

        const extension = path.extname(source.path);
        if (extension === '.svg') {
            source.src = optimizeSvg(source.src, source.path);
        }

        loaderThis.addDependency(source.path);

        return source;
    };

    const nunjucksEnvironment = new nunjucks.Environment(nunjucksLoader);
    nunjucks.configure(null, options.configure);

    const templateData = frontMatter(template);

    const pageContext = {
        PAGE: templateData.attributes,
    };
    const relativePath = path.relative('./source', loaderThis.resourcePath);
    pageContext.PAGE.RESOURCE_PATH = slash(path.sep + relativePath);

    console.log(`[loader-html] processing '${loaderThis.resourcePath}'`);

    const nunjucksTemplate = nunjucks.compile(templateData.body, nunjucksEnvironment);
    const nunjucksHtml = nunjucksTemplate.render(deepAssign({}, nunjucksContext, pageContext));

    return `export default ${JSON.stringify(nunjucksHtml)}`;
};
