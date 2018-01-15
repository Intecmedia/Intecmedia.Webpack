const path = require('path');
const slash = require('slash');
const loaderUtils = require('loader-utils');
const nunjucks = require('nunjucks');
const frontMatter = require('front-matter');
const deepAssign = require('deep-assign');
const weblog = require('webpack-log');
const posthtml = require('posthtml');

const logger = weblog({ name: 'loader-html' });

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
    interpolate: {
        img: ['src', 'data-src', 'lowsrc', 'srcset', 'data-srcset'],
        source: ['srcset', 'data-srcset'],
    },
};

function interpolateHtml(html, options, callback) {
    const urls = {};
    const parser = posthtml();
    parser.use((tree) => {
        tree.walk((node) => {
            if (node.tag in options) {
                options[node.tag].forEach((attr) => {
                    if (attr in node.attrs) {
                        let ident;
                        if (attr === 'srcset' || attr === 'data-srcset') {
                            const srcset = node.attrs[attr].split(/\s*,\s*/).map((src) => {
                                const [ url, size ] = src.split(/\s+/, 2);
                                do {
                                    ident = `xxxREQUIRE-INTERPOLATExxx${Math.random()}${Math.random()}xxx`;
                                } while (urls[ident]);
                                urls[ident] = url;
                                return `${url} ${size}`;
                            });
                            node.attrs[attr] = srcset.join(', ');
                        } else {
                            do {
                                ident = `xxxREQUIRE-INTERPOLATExxx${Math.random()}${Math.random()}xxx`;
                            } while (urls[ident]);
                            urls[ident] = node.attrs[attr];
                            node.attrs[attr] = ident;
                        }
                    }
                });
            }
            return node;
        });
        return tree;
    });
    parser.process(html).then((result) => {
        let exportString = `export default ${JSON.stringify(result.html)};`;
        exportString = exportString.replace(/xxxREQUIRE-INTERPOLATExxx[0-9\\.]+xxx/g, (match) => {
            if (!urls[match]) return match;
            const url = loaderUtils.urlToRequest(urls[match], options.searchPath);
            return `"+require(${JSON.stringify(url)})+"`;
        });
        callback(null, exportString);
    }).catch(callback);
}

module.exports = function HtmlLoader(source) {
    const loaderContext = this;
    const callback = loaderContext.async();
    const options = deepAssign({}, DEFAULT_OPTIONS, loaderUtils.getOptions(loaderContext));

    const loader = new nunjucks.FileSystemLoader(options.searchPath, { noCache: options.noCache });
    const environment = new nunjucks.Environment(loader, options.environment);

    const publicPath = ((options.context.APP || {}).PUBLIC_PATH || path.sep);
    const resourcePath = path.sep + path.relative(options.searchPath, loaderContext.resourcePath);

    const template = frontMatter(source);
    const templateContext = deepAssign({}, options.context, {
        PAGE: {
            ...template.attributes,
            PUBLIC_PATH: slash(path.normalize(publicPath + resourcePath)),
            RESOURCE_PATH: slash(path.normalize(resourcePath)),
        },
    });

    logger.info(`processing '${loaderContext.resourcePath}'`);
    environment.renderString(template.body, templateContext, (error, result) => {
        if (error) {
            if (error.message) {
                error.message = error.message.replace(/^\(unknown path\)/, `(${loaderContext.resourcePath})`);
            }
            callback(error);
        } else {
            interpolateHtml.call(loaderContext, result, options.interpolate, callback);
        }
    });
};
