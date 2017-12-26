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

module.exports = function HtmlTemplateLoader(template) {
    const loaderThis = this;
    const options = loaderUtils.getOptions(loaderThis);

    const nunjucksSearchPaths = options.searchPaths;
    const nunjucksContext = options.context;

    const nunjucksLoader = new FileSystemLoader(nunjucksSearchPaths);

    const originalGetSource = nunjucksLoader.getSource;
    nunjucksLoader.getSource = function getSource(...args) {
        const source = originalGetSource.apply(this, args);
        if (!source.path) return source;

        const extension = path.extname(source.path);
        if (extension === '.svg') {
            let optimizeDone = false;
            svgo.optimize(source.src, { path: source.path }).then((result) => {
                optimizeDone = true;
                source.src = result.data;
            });
            // eslint-disable-next-line no-underscore-dangle
            while (!optimizeDone) { process._tickCallback(); }
        }

        loaderThis.addDependency(source.path);

        return source;
    };

    const nunjucksEnvironment = new nunjucks.Environment(nunjucksLoader);
    nunjucks.configure(null, { watch: false });

    const templateData = frontMatter(template);

    const pageContext = {
        PAGE: templateData.attributes,
    };
    const relativePath = path.relative('./source', loaderThis.resourcePath);
    pageContext.PAGE.RESOURCE_PATH = slash(path.sep + relativePath);

    console.log(`[html-template] processing '${loaderThis.resourcePath}'`);

    const nunjucksTemplate = nunjucks.compile(templateData.body, nunjucksEnvironment);
    const nunjucksHtml = nunjucksTemplate.render(deepAssign({}, nunjucksContext, pageContext));

    return `export default ${JSON.stringify(nunjucksHtml)}`;
};
