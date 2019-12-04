/* eslint-env node */
/* eslint "compat/compat": "off" */

const path = require('path');
const slash = require('slash');

const loaderUtils = require('loader-utils');
const validateOptions = require('schema-utils');
const weblog = require('webpack-log');

const nunjucks = require('nunjucks');
const frontMatter = require('front-matter');
const deepMerge = require('lodash.merge');

const attrParser = require('./attr.parser.js');

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
const SRCSET_ATTRS = ['srcset', 'data-srcset'];
const IGNORE_PATTERN = /^\{\{.*\}\}$/;
const REQUIRE_PATTERN = /\{\{ require\([0-9\\.]+\) \}\}/g;
const RANDOM_REQUIRE = () => `{{ require(${Math.random()}${Math.random()}) }}`;
const SVG_PATTERN = /\.(svg)(\?.*)?$/i;

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

const ABSOLUTE_PATTERN = /^\/([^/])/;
const ABSOLUTE_REPLACE = '../$1';

function resolveAbsolute(originUrl) {
    const url = slash(originUrl);
    if (!ABSOLUTE_PATTERN.test(url)) return url;
    return url.replace(ABSOLUTE_PATTERN, ABSOLUTE_REPLACE);
}

function processHtml(html, options, loaderCallback) {
    const links = attrParser(html, (tag, attr) => {
        if (!(tag in options.requireTags)) return false;
        if (options.requireTags[tag].includes(attr)) return true;
        return false;
    });

    let content = [html];
    links.reverse().forEach((link) => {
        let value;
        if (SRCSET_ATTRS.includes(link.attr)) {
            value = link.value.split(SRCSET_SEPARATOR).map((src) => {
                const [url, size = ''] = src.split(SRC_SEPARATOR, 2);
                if (IGNORE_PATTERN.test(url) || options.requireIgnore.test(url)) return src;
                if (!loaderUtils.isUrlRequest(link.value, options.searchPath)) return src;
                return options.requireIdent(url) + (size ? ` ${size}` : '');
            }).join(', ');
        } else {
            if (IGNORE_PATTERN.test(link.value) || options.requireIgnore.test(link.value)) return;
            if (!loaderUtils.isUrlRequest(link.value, options.searchPath)) return;
            value = options.requireIdent(link.value);
        }
        const last = content.pop();
        content.push(last.substr(link.start + link.length));
        content.push(value);
        content.push(last.substr(0, link.start));
    });
    content = content.reverse().join('');

    let exportString = `export default ${JSON.stringify(content)};`;
    exportString = options.requireExport(exportString);

    loaderCallback(null, exportString);
}

module.exports = function HtmlLoader() {
    const loaderContext = this;
    if (loaderContext.cacheable) loaderContext.cacheable();
    const loaderCallback = loaderContext.async();

    const htmlDataModule = require.resolve('./source/html.data.js');
    loaderContext.addDependency(htmlDataModule);
    delete require.cache[htmlDataModule];

    const options = deepMerge({}, DEFAULT_OPTIONS, loaderUtils.getOptions(loaderContext), {
        /* eslint-disable-next-line global-require, import/no-dynamic-require */
        context: require(htmlDataModule),
    });
    validateOptions(OPTIONS_SCHEMA, options, 'loader-html');

    const nunjucksLoader = new nunjucks.FileSystemLoader(options.searchPath, { noCache: true });
    const nunjucksEnvironment = new nunjucks.Environment(nunjucksLoader, options.environment);
    const relativePath = slash(path.relative(__dirname, loaderContext.resourcePath));

    options.requireIdent = (url) => {
        let ident;
        do ident = RANDOM_REQUIRE();
        while (options.requireReplace[ident]);
        options.requireReplace[ident] = resolveAbsolute(url);
        return ident;
    };
    options.requireExport = (exportString) => exportString.replace(REQUIRE_PATTERN, (match) => {
        if (!options.requireReplace[match]) return match;
        const url = options.requireReplace[match];

        const relativeUrl = slash(path.relative(__dirname, url));
        logger.info(`require(${JSON.stringify(relativeUrl)}) from ${JSON.stringify(relativePath)}`);

        const resourceDir = path.dirname(loaderContext.resourcePath);
        const urlPrefix = path.relative(resourceDir, options.searchPath);

        const request = loaderUtils.urlToRequest(slash(path.join(urlPrefix, url)), resourceDir);
        return `" + require(${JSON.stringify(request)}) + "`;
    });

    nunjucksEnvironment.addFilter('require', options.requireIdent);
    nunjucksEnvironment.addGlobal('require', options.requireIdent);

    helpers.forEach((helper, name) => {
        nunjucksEnvironment.addFilter(name, helper);
        nunjucksEnvironment.addGlobal(name, helper);
    });

    const publicPath = ((options.context.APP || {}).PUBLIC_PATH || path.sep);
    const resourcePath = path.posix.sep + path.relative(options.searchPath, loaderContext.resourcePath);
    const baseName = path.basename(loaderContext.resourcePath, '.html');

    const resourceUrl = path.dirname(resourcePath) + (
        baseName === 'index' ? '' : path.posix.sep + baseName
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
        if (SVG_PATTERN.test(filename)) {
            return { ...templateSource, src: `{{ require(${JSON.stringify(slash(filename))}) }}` };
        }
        if (!frontMatter.test(templateSource.src)) {
            return templateSource;
        }
        const templateData = frontMatter(templateSource.src);
        nunjucksEnvironment.addGlobal('PAGE', deepMerge(
            nunjucksEnvironment.getGlobal('PAGE') || {},
            templateData.attributes,
            PAGE,
        ));
        return {
            ...templateSource,
            src: [
                '{#---',
                templateData.frontmatter
                    .replace('#}', escape('#}'))
                    .replace('{#', escape('{#')),
                '---#}',
                templateData.body,
            ].join('\n'),
        };
    };

    logger.info(`render(${JSON.stringify(relativePath)})`);

    nunjucksEnvironment.render(loaderContext.resourcePath, {}, (error, result) => {
        if (error) {
            loaderCallback(error);
        } else {
            processHtml(result, options, loaderCallback);
        }
    });
};
