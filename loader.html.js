const fs = require('fs');
const path = require('path');
const slash = require('slash');

const loaderUtils = require('loader-utils');
const { validate: validateOptions } = require('schema-utils');
const weblog = require('webpack-log');

const nunjucks = require('nunjucks');
const frontMatter = require('front-matter');
const deepMerge = require('lodash.merge');
const lodashTemplate = require('lodash.template');

const attributeParser = require('./attr.parser');

const helpers = require('./source/helpers');
const IncludeWithExtension = require('./plugin.nunjucks-include-with');

const logger = weblog({ name: 'loader-html' });

const helpersDir = path.join(__dirname, './source/helpers/');
const htmlDataModule = require.resolve('./source/html.data');

const DEFAULT_OPTIONS = {
    context: {},
    environment: {
        autoescape: true,
        trimBlocks: true,
        lstripBlocks: false,
        watch: false,
    },
    requireTags: {
        img: ['src', 'data-src', 'lowsrc', 'data-lowsrc', 'srcset', 'data-srcset'],
        video: ['src', 'data-src', 'poster', 'data-poster'],
        source: ['src', 'srcset', 'data-srcset', 'data-src'],
        image: ['href', 'xlink:href', 'data-href'],
        object: ['data', 'data-data'],
    },
    requireIgnore: /^(\w+:|\/\/)/i,
    requireReplace: {},
    searchPath: './source',
    verbose: false,
    macrosWhitelist: {
        'partials/macros/img.html': ['lazy', 'picture'],
        'partials/macros/resize.html': ['sources', 'breakpoints', 'picture'],
        'partials/macros/sprite.html': ['svg'],
    },
};

const SRC_SEPARATOR = /\s+/;
const SRCSET_SEPARATOR = /\s*,\s*/;
const SRCSET_ATTRS = ['srcset', 'data-srcset'];
const IGNORE_PATTERN = /^{{.*}}$/;
const REQUIRE_PATTERN = /{{ require\([\d.\\]+\) }}/g;
const REQUIRE_IDENT = () => `{{ require(${Math.random()}${Math.random()}) }}`;
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
        verbose: { type: 'boolean' },
        macrosWhitelist: {
            anyOf: [{ type: 'boolean' }, { type: 'object' }],
        },
    },
};

const ABSOLUTE_PATTERN = /^\/([^/])/;
const ABSOLUTE_REPLACE = '../$1';
const MACROS_PATTERN = /\{%\s+macro\s+([\w_]+).+%\}/gi;

function resolveAbsolute(originUrl) {
    const url = slash(originUrl);
    if (!ABSOLUTE_PATTERN.test(url)) return url;
    return url.replace(ABSOLUTE_PATTERN, ABSOLUTE_REPLACE);
}

function processHtml(html, options, loaderCallback) {
    const links = attributeParser(html, (tag, attribute) => {
        if (!(tag in options.requireTags)) return false;
        if (options.requireTags[tag].includes(attribute)) return true;
        return false;
    });

    let content = [html];
    links.reverse().forEach((link) => {
        let value;
        if (IGNORE_PATTERN.test(link.value) || options.requireIgnore.test(link.value)) return;
        if (SRCSET_ATTRS.includes(link.attr)) {
            value = link.value
                .split(SRCSET_SEPARATOR)
                .map((source) => {
                    const [url, size = ''] = source.split(SRC_SEPARATOR, 2);
                    if (IGNORE_PATTERN.test(url) || options.requireIgnore.test(url)) return source;
                    if (!loaderUtils.isUrlRequest(link.value, options.searchPath)) return source;
                    return options.requireIdent(url) + (size ? ` ${size}` : '');
                })
                .join(', ');
        } else {
            if (!loaderUtils.isUrlRequest(link.value, options.searchPath)) return;
            value = options.requireIdent(link.value);
        }
        const last = content.pop();
        content.push(last.slice(link.start + link.length));
        content.push(value);
        content.push(last.slice(0, link.start));
    });
    content = content.reverse().join('');

    const template = options.requireExport(
        lodashTemplate(content, {
            interpolate: /<%=([\s\S]+?)%>/g,
            variable: 'data',
        }).source
    );

    const exportString = `module.exports = function (params) { with (params) { return (${template})(); }; };`;

    loaderCallback(null, exportString);
}

nunjucks.installJinjaCompat();

module.exports = function HtmlLoader() {
    const loaderContext = this;
    if (loaderContext.cacheable) loaderContext.cacheable();
    const loaderCallback = loaderContext.async();

    loaderContext.addDependency(htmlDataModule);
    delete require.cache[htmlDataModule];

    loaderContext.addContextDependency(helpersDir);

    const options = deepMerge({}, DEFAULT_OPTIONS, loaderContext.getOptions(), {
        context: require(htmlDataModule),
    });
    validateOptions(OPTIONS_SCHEMA, options, 'loader-html');

    const nunjucksLoader = new nunjucks.FileSystemLoader(options.searchPath, { noCache: true });
    const nunjucksEnv = new nunjucks.Environment(nunjucksLoader, options.environment);
    const relativePath = slash(path.relative(__dirname, loaderContext.resourcePath));

    nunjucksEnv.addExtension(
        'includeWith',
        new IncludeWithExtension({
            nunjucksEnv,
        })
    );

    options.requireIdent = (url) => {
        let ident;
        do ident = REQUIRE_IDENT();
        while (options.requireReplace[ident]);
        options.requireReplace[ident] = resolveAbsolute(url);
        return ident;
    };
    options.requireExport = (exportString) =>
        exportString.replace(REQUIRE_PATTERN, (match) => {
            if (!options.requireReplace[match]) return match;
            const url = options.requireReplace[match];

            if (options.verbose) {
                const relativeUrl = slash(path.relative(__dirname, url));
                logger.info(`require(${JSON.stringify(relativeUrl)}) from ${JSON.stringify(relativePath)}`);
            }

            const resourceDirectory = path.dirname(loaderContext.resourcePath);
            const urlPrefix = path.relative(resourceDirectory, options.searchPath);

            const request = loaderUtils.urlToRequest(slash(path.join(urlPrefix, url)), resourceDirectory);
            return `' + require(${JSON.stringify(request)}) + '`;
        });

    nunjucksEnv.addFilter('require', options.requireIdent);
    nunjucksEnv.addGlobal('require', options.requireIdent);

    const publicPath = (options.context.APP || {}).PUBLIC_PATH || path.sep;
    const resourcePath = path.posix.sep + path.relative(options.searchPath, loaderContext.resourcePath);
    const baseName = path.basename(loaderContext.resourcePath, '.html');

    const resourceUrl =
        path.dirname(resourcePath) + (baseName === 'index' ? '' : path.posix.sep + baseName) + path.posix.sep;
    const resourceStat = fs.statSync(loaderContext.resourcePath);

    nunjucksEnv.addGlobal('APP', options.context);
    const PAGE = {
        URL: slash(path.normalize(path.join(publicPath, resourceUrl))),
        PATH: slash(path.normalize(resourcePath)),
        STAT: resourceStat,
    };
    nunjucksEnv.addGlobal('PAGE', PAGE);

    nunjucksEnv.addGlobal('LOADER', loaderContext);
    nunjucksEnv.addGlobal('COMPILER', loaderContext._compiler);
    nunjucksEnv.addGlobal('COMPILATION', loaderContext._compilation);

    const helperContext = {
        loaderContext,
        loaderOptions: options,
        APP: options.context,
        PAGE,
    };
    helpers.forEach((helper, name) => {
        const filterFn = helper.bind(helperContext);
        filterFn.helperType = 'filter';
        nunjucksEnv.addFilter(name, filterFn);

        const globalFn = helper.bind(helperContext);
        globalFn.helperType = 'global';
        nunjucksEnv.addGlobal(name, globalFn);
    });

    const nunjucksGetSource = nunjucksLoader.getSource;
    nunjucksLoader.getSource = function getSource(templateFilename) {
        const templateFilepath = path.isAbsolute(templateFilename)
            ? templateFilename
            : path.join(options.searchPath, templateFilename);
        const templateRelative = slash(path.relative(__dirname, templateFilename));
        loaderContext.addDependency(templateFilepath);

        const templateSource = nunjucksGetSource.call(this, templateFilename);
        if (!(templateSource && templateSource.src)) {
            return templateSource;
        }
        if (SVG_PATTERN.test(templateFilename)) {
            return { ...templateSource, src: `{{ require(${JSON.stringify(slash(templateFilename))}) }}` };
        }

        [...templateSource.src.matchAll(MACROS_PATTERN)].forEach(([macrosDef, macrosName]) => {
            if (
                !(
                    templateRelative in options.macrosWhitelist &&
                    options.macrosWhitelist[templateRelative].includes(macrosName)
                ) ||
                !options.macrosWhitelist
            ) {
                const macrosError = [
                    `Macros: ${JSON.stringify(macrosDef)} not allowed in ${JSON.stringify(templateRelative)}.`,
                    'Please replace to {% includeWith "partials/example.html", { varname: \'value\' } %} instead.',
                ].join('\n');
                loaderContext.emitError(macrosError);
                throw new Error(macrosError);
            }
        });

        if (!frontMatter.test(templateSource.src)) {
            return templateSource;
        }
        const templateData = frontMatter(templateSource.src);
        nunjucksEnv.addGlobal('PAGE', deepMerge(nunjucksEnv.getGlobal('PAGE') || {}, templateData.attributes, PAGE));
        return {
            ...templateSource,
            src: [
                '{#---',
                templateData.frontmatter.replace('#}', escape('#}')).replace('{#', escape('{#')),
                '---#}',
                templateData.body,
            ].join('\n'),
        };
    };

    if (options.verbose) {
        logger.info(`render(${JSON.stringify(relativePath)})`);
    }

    nunjucksEnv.render(loaderContext.resourcePath, {}, (error, result) => {
        if (error) {
            loaderCallback(error);
        } else {
            processHtml(result, options, loaderCallback);
        }
    });
};
