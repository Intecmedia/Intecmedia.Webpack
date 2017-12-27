const path = require('path');
const SVGO = require('svgo');
const slash = require('slash');
const loaderUtils = require('loader-utils');
const nunjucks = require('nunjucks');
const frontMatter = require('front-matter');
const deepAssign = require('deep-assign');

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
    searchPath: './source',
    configure: {
        autoescape: true,
        trimBlocks: true,
        lstripBlocks: false,
        watch: false,
    },
};

module.exports = function HtmlLoader(source) {
    const self = this;
    const callback = self.async();
    const options = deepAssign({}, DEFAULT_OPTIONS, loaderUtils.getOptions(self));

    const loader = new nunjucks.FileSystemLoader(options.searchPath, { noCache: options.noCache });
    const originalGetSource = loader.getSource;
    loader.getSource = function getSource(...args) {
        const result = originalGetSource.apply(this, args);
        if (!result.path) return source;

        const extension = path.extname(result.path);
        if (extension === '.svg') {
            result.src = optimizeSvg(result.src, result.path);
        }

        self.addDependency(result.path);

        return result;
    };
    const environment = new nunjucks.Environment(loader, options.configure);

    const content = frontMatter(source);
    const context = deepAssign({}, options.context, {
        PAGE: {
            ...content.attributes,
            RESOURCE_PATH: slash(path.sep + path.relative(options.searchPath, self.resourcePath)),
        },
    });

    console.log(`[loader-html] processing '${self.resourcePath}'`);
    environment.renderString(content.body, context, (error, result) => {
        if (error) {
            if (error.message) {
                error.message = error.message.replace(/^\(unknown path\)/, `(${self.resourcePath})`);
            }
            throw error;
        }
        callback(null, `export default ${JSON.stringify(result)};`);
    });
};
