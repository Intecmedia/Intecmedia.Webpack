const path = require('path');
const slash = require('slash');

const loaderUtils = require('loader-utils');
const validateOptions = require('schema-utils');
const weblog = require('webpack-log');

const nunjucks = require('nunjucks');
const frontMatter = require('front-matter');
const deepAssign = require('deep-assign');

const posthtml = require('posthtml');
const posthtmlCommentAfter = require('posthtml-comment-after');

const helpers = require('./source/helpers/index.js');

const logger = weblog({ name: 'loader-html' });

const DEFAULT_OPTIONS = {
    context: {},
    environment: {
        autoescape: true,
        trimBlocks: true,
        lstripBlocks: false,
        watch: false,
    },
    requireTags: {
        img: ['src', 'data-src', 'lowsrc', 'srcset', 'data-srcset'],
        source: ['srcset', 'data-srcset'],
        image: ['href', 'xlink:href'],
    },
    requireIgnore: /^(\w+[:]|\/\/)/i,
    requireReplace: {},
    searchPath: './source',
};

const SRC_SEPARATOR = /\s+/;
const SRCSET_SEPARATOR = /\s*,\s*/;
const IGNORE_PATTERN = /^\{\{.*\}\}$/;
const REQUIRE_PATTERN = /\{\{ require\([0-9\\.]+\) \}\}/g;
const RANDOM_REQUIRE = () => `{{ require(${Math.random()}${Math.random()}) }}`;

const OPTIONS_SCHEMA = {
    type: 'object',
    additionalProperties: false,
    properties: {
        context: { type: 'object' },
        environment: { type: 'object' },
        requireTags: { type: 'object' },
        requireIgnore: { instanceof: 'RegExp' },
        requireReplace: { type: 'object' },
        searchPath: { type: 'string' },
    },
};

function processHtml(html, options, loaderCallback) {
    const parser = posthtml();
    if (options.requireTags && Object.keys(options.requireTags).length) {
        parser.use((tree) => {
            const expression = Object.keys(options.requireTags).map(tag => ({
                tag,
                attrs: options.requireTags[tag].reduce((attrs, attr) => ({
                    ...attrs,
                    [attr]: true,
                }), {}),
            }));
            tree.match(expression, (node) => {
                options.requireTags[node.tag].forEach((attr) => {
                    if (!(attr in node.attrs) || ('data-require-ignore' in node.attrs)) return;

                    const val = node.attrs[attr];
                    if (attr in ['srcset', 'data-srcset']) {
                        node.attrs[attr] = val.split(SRCSET_SEPARATOR).map((src) => {
                            const [url, size] = src.split(SRC_SEPARATOR, 2);
                            if (IGNORE_PATTERN.test(url) || options.requireIgnore.test(url)) return src;
                            return `${options.requireIdent(url)} ${size}`;
                        }).join(', ');
                    } else if (!IGNORE_PATTERN.test(val) && !options.requireIgnore.test(val)) {
                        node.attrs[attr] = options.requireIdent(val);
                    }
                });
                return node;
            });
            return tree;
        });
    }
    parser.use(posthtmlCommentAfter());
    parser.process(html).then((result) => {
        let exportString = `export default ${JSON.stringify(result.html)};`;
        exportString = options.requireExport(exportString);
        loaderCallback(null, exportString);
    }).catch(loaderCallback);
}

module.exports = function HtmlLoader() {
    const loaderContext = this;
    const loaderCallback = loaderContext.async();

    loaderContext.addDependency(path.join(__dirname, 'app.config.js'));
    loaderContext.addDependency(path.join(__dirname, 'source', 'html.data.js'));

    const options = deepAssign({}, DEFAULT_OPTIONS, loaderUtils.getOptions(loaderContext));
    validateOptions(OPTIONS_SCHEMA, options, 'loader-html');

    const nunjucksLoader = new nunjucks.FileSystemLoader(options.searchPath, { noCache: true });
    const nunjucksEnvironment = new nunjucks.Environment(nunjucksLoader, options.environment);

    options.requireIdent = (url) => {
        let ident;
        do ident = RANDOM_REQUIRE();
        while (options.requireReplace[ident]);
        options.requireReplace[ident] = url;
        return ident;
    };
    options.requireExport = exportString => exportString.replace(REQUIRE_PATTERN, (match) => {
        if (!options.requireReplace[match]) return match;
        const url = options.requireReplace[match];
        logger.info(`require('${url}')`);
        const request = loaderUtils.urlToRequest(url, options.searchPath);
        return `"+require(${JSON.stringify(request)})+"`;
    });

    nunjucksEnvironment.addFilter('require', options.requireIdent);
    nunjucksEnvironment.addGlobal('require', options.requireIdent);

    helpers.forEach((helper, name) => {
        nunjucksEnvironment.addGlobal(name, helper);
    });

    const publicPath = ((options.context.APP || {}).PUBLIC_PATH || path.sep);
    const resourcePath = path.sep + path.relative(options.searchPath, loaderContext.resourcePath);
    const baseName = path.basename(resourcePath, '.html');
    const resourceUrl = (
        baseName === 'index'
            ? path.dirname(resourcePath)
            : path.dirname(resourcePath) + path.posix.sep + baseName
    ) + path.posix.sep;

    nunjucksEnvironment.addGlobal('APP', options.context);
    const PAGE = {
        URL: slash(path.normalize(path.join(publicPath, resourceUrl))),
        PATH: slash(path.normalize(resourcePath)),
    };

    nunjucksEnvironment.addGlobal('PAGE', PAGE);

    const nunjucksGetSource = nunjucksLoader.getSource;
    nunjucksLoader.getSource = function getSource(filename) {
        loaderContext.addDependency(filename);
        const templateSource = nunjucksGetSource.call(this, filename);
        if (!(templateSource && templateSource.src)) {
            return templateSource;
        }
        if (!frontMatter.test(templateSource.src)) {
            return templateSource;
        }
        const templateData = frontMatter(templateSource.src);
        nunjucksEnvironment.addGlobal('PAGE', deepAssign(
            nunjucksEnvironment.getGlobal('PAGE') || {},
            templateData.attributes,
            PAGE,
        ));
        return Object.assign({}, templateSource, {
            src: [
                '{#---',
                templateData.frontmatter
                    .replace('#}', escape('#}'))
                    .replace('{#', escape('{#')),
                '---#}',
                templateData.body,
            ].join('\n'),
        });
    };

    logger.info(`processing '${path.relative(__dirname, loaderContext.resourcePath)}'`);
    nunjucksEnvironment.render(loaderContext.resourcePath, {}, (error, result) => {
        if (error) {
            loaderCallback(error);
        } else {
            processHtml(result, options, loaderCallback);
        }
    });
};
