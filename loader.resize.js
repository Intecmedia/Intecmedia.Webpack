/* eslint-env node -- webpack is node env */
/* eslint "compat/compat": "off" -- webpack is node env */
/* eslint "no-invalid-this": "off" -- its ok for 3d-party */

const os = require('os');
const fs = require('fs');
const sharp = require('sharp');
const path = require('path');
const md5File = require('md5-file');
const loaderUtils = require('loader-utils');
const urlLoader = require('url-loader');
const fileLoader = require('file-loader');
const deepMerge = require('lodash.merge');
const weblog = require('webpack-log');
const slash = require('slash');
const pLimit = require('p-limit');

const logger = weblog({ name: 'loader-resize' });
const imageminConfig = require('./imagemin.config');

const imageminConfigModule = require.resolve('./imagemin.config');

const DEFAULT_OPTIONS = {
    cacheDirectory: false,
    verbose: false,
};
const DEFAULT_FIT = 'inside';

const resizeLimit = pLimit(os.cpus().length - 1);

module.exports = async function ResizeLoader(content) {
    const thisLoader = this;

    if (thisLoader.cacheable) thisLoader.cacheable();
    const loaderCallback = thisLoader.async();

    thisLoader.addDependency(thisLoader.resourcePath);
    thisLoader.addDependency(imageminConfigModule);

    const query = thisLoader.resourceQuery ? loaderUtils.parseQuery(thisLoader.resourceQuery) : {};
    const options = deepMerge(
        {},
        DEFAULT_OPTIONS,
        loaderUtils.getOptions(thisLoader),
    );
    const context = options.context || thisLoader.rootContext;

    const { cacheDirectory } = options;
    delete options.cacheDirectory;
    if (cacheDirectory) {
        if (!fs.existsSync(cacheDirectory)) {
            fs.mkdirSync(cacheDirectory, { recursive: true });
        }
    }

    const nextLoader = (query.inline === 'inline' ? urlLoader : fileLoader);
    if (!('resize' in query)) {
        return loaderCallback(null, nextLoader.call(thisLoader, content));
    }
    if ('inline' in query) {
        delete query.inline;
    }

    const resourceInfo = path.parse(thisLoader.resourcePath);
    const resourceFormat = resourceInfo.ext.slice(1).toLowerCase();
    const relativePath = slash(path.relative(__dirname, thisLoader.resourcePath));

    let [, resizeWidth,, resizeHeight, resizeFit] = (String(query.resize).trim().match(/^(\d*)(x(\d*))?(\w+)?$/)) || [];
    resizeWidth = parseInt(resizeWidth, 10);
    resizeHeight = parseInt(resizeHeight, 10);
    resizeFit = (resizeFit || DEFAULT_FIT).trim();

    const format = (query.format || resourceFormat).toLowerCase();
    const name = ((query.name ? loaderUtils.interpolateName(thisLoader, query.name, {
        context,
        content,
    }) : null) || (
        `${resourceInfo.name}@resize-${resizeWidth || ''}x${resizeHeight || ''}${resizeFit && resizeFit !== DEFAULT_FIT ? `-${resizeFit}` : ''}`
    )) + (query.suffix ? `-${query.suffix}` : '');

    const resourceHash = md5File.sync(thisLoader.resourcePath);
    const formatConfig = imageminConfig[format] || {};
    const cacheFilename = `${encodeURIComponent(`${relativePath}?${JSON.stringify(query)}`)}.json`;
    const cacheFilepath = cacheDirectory ? path.join(cacheDirectory, cacheFilename) : undefined;

    let cacheData;
    if (cacheFilepath && fs.existsSync(cacheFilepath)) {
        try {
            cacheData = JSON.parse(fs.readFileSync(cacheFilepath));
        } catch (cacheError) {
            logger.error(`error cache '${relativePath}${thisLoader.resourceQuery}'`, cacheError);
            cacheData = undefined;
        }
    }

    if (cacheData !== undefined
        && cacheData.type === 'Buffer'
        && cacheData.data
        && cacheData.hash === resourceHash
        && cacheData.config === JSON.stringify(formatConfig)
    ) {
        if (options.verbose) {
            logger.info(`load cache '${relativePath}${thisLoader.resourceQuery}'`);
        }
        thisLoader.resourcePath = path.join(resourceInfo.dir, `${name}.${format}`);
        return loaderCallback(null, nextLoader.call(thisLoader, Buffer.from(cacheData.data, 'base64')));
    }

    const resourceImage = sharp(content);
    const resourceMeta = await resourceImage.metadata();
    const formatOptions = {};
    if (resizeWidth || resizeHeight) {
        resourceImage.resize(resizeWidth || resourceMeta.width, resizeHeight || resourceMeta.height, {
            fit: resizeFit,
            withoutEnlargement: true,
        });
    }

    const quality = query.quality ? parseInt(query.quality, 10) : 0;
    if (quality > 0) {
        formatOptions.quality = quality;
    }

    const lossless = (typeof (query.lossless) !== 'undefined' ? !!query.lossless : resourceFormat === 'png');

    if (format === 'webp') {
        if (lossless || quality === 100) {
            formatOptions.lossless = true;
        } else if (!quality) {
            formatOptions.quality = imageminConfig.webp.quality;
        }
        Object.entries(query.options || imageminConfig.webp.options).forEach(([k, v]) => {
            formatOptions[k] = v;
        });
    }

    if (format === 'avif') {
        if (lossless) {
            formatOptions.lossless = true;
        } else if (!quality) {
            formatOptions.quality = imageminConfig.avif.quality;
        }
        Object.entries(query.options || imageminConfig.avif.options).forEach(([k, v]) => {
            formatOptions[k] = v;
        });
    }

    await resizeLimit(async () => {
        const resizePromise = await new Promise((resizeResolve, resizeReject) => {
            resourceImage.toFormat(format.toLowerCase(), formatOptions).toBuffer().then((buffer) => {
                if (cacheFilepath) {
                    fs.writeFileSync(cacheFilepath, JSON.stringify({
                        type: 'Buffer',
                        data: buffer.toString('base64'),
                        hash: resourceHash,
                        config: JSON.stringify(formatConfig),
                    }));
                }
                if (options.verbose) {
                    logger.info(`save cache '${relativePath}${thisLoader.resourceQuery}'`);
                }
                resizeResolve(buffer);
                thisLoader.resourcePath = path.join(resourceInfo.dir, `${name}.${format}`);
                loaderCallback(null, nextLoader.call(thisLoader, buffer));
            }).catch((bufferError) => {
                loaderCallback(bufferError);
                resizeReject(bufferError);
            });
        });
        return resizePromise;
    });
};

module.exports.raw = true;
