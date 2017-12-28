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
    js2svg: { useShortTags: false },
});

const DEFAULT_OPTIONS = {
    context: {},
    noCache: true,
    searchPath: './source',
    environment: {
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
        self.addDependency(result.path);

        const extension = path.extname(result.path);
        if (extension === '.svg') {
            result.src = `{% filter svgo %}${result.src}{% endfilter %}`;
        }

        return result;
    };

    const environment = new nunjucks.Environment(loader, options.environment);
    environment.addFilter('svgo', (input, filter) => {
        svgo.optimize(input).then((optimized) => {
            filter(null, new nunjucks.runtime.SafeString(optimized.data));
        }).catch((error) => {
            filter(error);
        });
    }, true);

    const publicPath = ((options.context.APP || {}).PUBLIC_PATH || path.sep);
    const resourcePath = path.sep + path.relative(options.searchPath, self.resourcePath);

    const template = frontMatter(source);
    const context = deepAssign({}, options.context, {
        PAGE: {
            ...template.attributes,
            PUBLIC_PATH: slash(path.normalize(publicPath + resourcePath)),
            RESOURCE_PATH: slash(path.normalize(resourcePath)),
        },
    });

    console.log(`[loader-html] processing '${self.resourcePath}'`);
    environment.renderString(template.body, context, (error, result) => {
        if (error) {
            if (error.message) {
                error.message = error.message.replace(/^\(unknown path\)/, `(${self.resourcePath})`);
            }
            callback(error);
        } else {
            callback(null, `export default ${JSON.stringify(result)};`);
        }
    });
};
