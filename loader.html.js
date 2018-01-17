const path = require('path');
const slash = require('slash');
const loaderUtils = require('loader-utils');
const nunjucks = require('nunjucks');
const frontMatter = require('front-matter');
const deepAssign = require('deep-assign');
const weblog = require('webpack-log');
const posthtml = require('posthtml');
const posthtmlRender = require('posthtml-render');
const SVGO = require('svgo');
const svgoConfig = require('./svgo.config.js');
const deasync = require('deasync');

const logger = weblog({ name: 'loader-html' });

const DEFAULT_OPTIONS = {
    context: {},
    environment: {
        autoescape: true,
        trimBlocks: true,
        lstripBlocks: false,
        watch: false,
    },
    noCache: true,
    linkTags: {
        img: ['src', 'data-src', 'lowsrc', 'srcset', 'data-srcset'],
        source: ['srcset', 'data-srcset'],
    },
    linkIgnore: /^(https?:\/\/|ftp:\/\/|mailto:|\/\/)/i,
    searchPath: './source',
    svgo: svgoConfig,
};

const SRC_SEPARATOR = /\s+/;
const SRCSET_SEPARATOR = /\s*,\s*/;
const IDENT_PATTERN = /xxxHTMLLINKxxx[0-9\\.]+xxx/g;
const randomIdent = () => `xxxHTMLLINKxxx${Math.random()}${Math.random()}xxx`;

function processHtml(html, options, loaderCallback) {
    const linksReplace = {};
    const parser = posthtml();
    if (options.linkTags && Object.keys(options.linkTags).length) {
        parser.use((tree) => {
            tree.match(Object.keys(options.linkTags).map(tag => ({ tag })), (node) => {
                options.linkTags[node.tag].forEach((attr) => {
                    if (!(attr in node.attrs) || ('data-link-ignore' in node.attrs)) return;

                    if (attr === 'srcset' || attr === 'data-srcset') {
                        const srcset = node.attrs[attr].split(SRCSET_SEPARATOR).map((src) => {
                            if (options.linkIgnore.test(src)) return src;

                            const [url, size] = src.split(SRC_SEPARATOR, 2);
                            let ident;
                            do {
                                ident = randomIdent();
                            } while (linksReplace[ident]);

                            linksReplace[ident] = url;
                            return `${ident} ${size}`;
                        });
                        node.attrs[attr] = srcset.join(', ');
                    } else if (!options.linkIgnore.test(node.attrs[attr])) {
                        let ident;
                        do {
                            ident = randomIdent();
                        } while (linksReplace[ident]);

                        linksReplace[ident] = node.attrs[attr];
                        node.attrs[attr] = ident;
                    }
                });
                return node;
            });
            return tree;
        });
    }
    if (options.svgo && Object.keys(options.svgo).length) {
        const svgoInstance = new SVGO(options.svgo);
        parser.use((tree) => {
            tree.match({ tag: 'svg' }, (node) => {
                if ('data-svgo-ignore' in node.attrs) return node;

                let minifiedSvg;
                const originalSvg = posthtmlRender(node);
                svgoInstance.optimize(originalSvg).then((result) => {
                    minifiedSvg = result;
                }).catch((error) => {
                    minifiedSvg = { data: originalSvg };
                    return loaderCallback(error);
                });
                deasync.loopWhile(() => minifiedSvg === undefined);

                node.attrs = {};
                node.content = minifiedSvg.data;
                node.tag = false;

                return node;
            });
            return tree;
        });
    }
    parser.process(html).then((result) => {
        let exportString = `export default ${JSON.stringify(result.html)};`;
        if (linksReplace && Object.keys(linksReplace).length) {
            exportString = exportString.replace(IDENT_PATTERN, (match) => {
                if (!linksReplace[match]) return match;
                const url = loaderUtils.urlToRequest(linksReplace[match], options.searchPath);
                return `"+require(${JSON.stringify(url)})+"`;
            });
        }
        loaderCallback(null, exportString);
    }).catch(loaderCallback);
}

module.exports = function HtmlLoader(source) {
    const loaderContext = this;
    const loaderCallback = loaderContext.async();
    const options = deepAssign({}, DEFAULT_OPTIONS, loaderUtils.getOptions(loaderContext));

    const loader = new nunjucks.FileSystemLoader(options.searchPath, { noCache: options.noCache });
    const environment = new nunjucks.Environment(loader, options.environment);

    const publicPath = ((options.context.APP || {}).PUBLIC_PATH || path.sep);
    const resourcePath = path.sep + path.relative(options.searchPath, loaderContext.resourcePath);

    const template = frontMatter(source);
    const templateContext = {
        APP: options.context,
        PAGE: {
            ...template.attributes,
            PUBLIC_PATH: slash(path.normalize(publicPath + resourcePath)),
            RESOURCE_PATH: slash(path.normalize(resourcePath)),
        },
    };

    logger.info(`processing '${loaderContext.resourcePath}'`);
    environment.renderString(template.body, templateContext, (error, result) => {
        if (error) {
            if (error.message) {
                error.message = error.message.replace(/^\(unknown path\)/, `(${loaderContext.resourcePath})`);
            }
            loaderCallback(error);
        } else {
            processHtml.call(loaderContext, result, options, loaderCallback);
        }
    });
};
