const path = require('path');
const SVGO = require('svgo');
const loaderUtils = require('loader-utils');
const nunjucks = require('nunjucks');
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
        loaderThis.addDependency(source.path);

        const extension = path.extname(source.path);
        if (extension === '.svg') {
            let optimizeDone = false;
            svgo.optimize(source.src, { path: source.path }).then((result) => {
                optimizeDone = true;
                source.src = result.data;
            });
            /* eslint no-underscore-dangle: "off" */
            while (!optimizeDone) { process._tickCallback(); }
        }

        return source;
    };

    const nunjucksEnvironment = new nunjucks.Environment(nunjucksLoader);
    nunjucks.configure(null, { watch: false });

    const nunjucksTemplate = nunjucks.compile(template, nunjucksEnvironment);
    const nunjucksHtml = nunjucksTemplate.render(nunjucksContext);

    return `export default ${JSON.stringify(nunjucksHtml)}`;
};
