const os = require('os');
const fs = require('fs');
const sharp = require('sharp');
const path = require('path');
const loaderUtils = require('loader-utils');
const urlLoader = require('url-loader');
const fileLoader = require('file-loader');
const deepMerge = require('lodash.merge');
const weblog = require('webpack-log');
const slash = require('slash');
const pLimit = require('p-limit');
const createHash = require('webpack/lib/util/createHash');

const logger = weblog({ name: 'loader-resize' });
const imageminConfig = require('./imagemin.config');
const { version: sharpVersion } = require('sharp/package.json');
const ENV = require('./app.env');

const imageminConfigModule = require.resolve('./imagemin.config');

const DEFAULT_OPTIONS = {
    cacheDirectory: false,
    verbose: false,
};
const DEFAULT_FIT = 'inside';
const ALLOWED_PATTERN = /\.(jpeg|jpg|png|gif)(\?.*)?$/i;

const resizeLimit = ENV.PROD && !ENV.DEBUG ? pLimit(os.cpus().length - 1) : (callback) => callback();

module.exports = async function ResizeLoader(content) {
    const loaderContext = this;

    if (loaderContext.cacheable) loaderContext.cacheable();
    const loaderCallback = loaderContext.async();

    loaderContext.addDependency(loaderContext.resourcePath);
    loaderContext.addDependency(imageminConfigModule);

    const query = loaderContext.resourceQuery
        ? Object.fromEntries(new URLSearchParams(loaderContext.resourceQuery.slice(1)).entries())
        : {};
    const options = deepMerge({}, DEFAULT_OPTIONS, loaderContext.getOptions());
    const context = options.context || loaderContext.rootContext;

    const { cacheDirectory } = options;
    delete options.cacheDirectory;
    if (cacheDirectory) {
        if (!fs.existsSync(cacheDirectory)) {
            fs.mkdirSync(cacheDirectory, { recursive: true });
        }
    }

    const nextLoader = query.inline === 'inline' ? urlLoader : fileLoader;
    if (!('resize' in query)) {
        return loaderCallback(null, nextLoader.call(loaderContext, content));
    }

    if (!ALLOWED_PATTERN.test(loaderContext.resourcePath)) {
        const errorMessage = `Resize not allowed for: ${JSON.stringify(loaderContext.resourcePath)}.`;
        loaderContext.emitError(errorMessage);
        loaderCallback(errorMessage);
        throw new Error(errorMessage);
    }

    if ('inline' in query) {
        delete query.inline;
    }

    const resourceInfo = path.parse(loaderContext.resourcePath);
    const resourceFormat = resourceInfo.ext.slice(1).toLowerCase();
    const relativePath = slash(path.relative(__dirname, loaderContext.resourcePath));

    const resizeMatch = query.resize.trim().match(/^(\d*)(x(\d*))?(\w+)?$/) || [];
    const resizeWidth = parseInt(resizeMatch[1], 10);
    const resizeHeight = parseInt(resizeMatch[2], 10);
    const resizeFit = (resizeMatch[4] || DEFAULT_FIT).trim();

    if (!query.resize && !query.name) {
        query.name = path.basename(loaderContext.resourcePath, path.extname(loaderContext.resourcePath));
    }

    const format = (query.format || resourceFormat).toLowerCase();
    const name =
        ((query.name
            ? loaderUtils.interpolateName(loaderContext, query.name, {
                  context,
                  content,
              })
            : null) ||
            `${resourceInfo.name}@resize-${resizeWidth || ''}x${resizeHeight || ''}${
                resizeFit && resizeFit !== DEFAULT_FIT ? `-${resizeFit}` : ''
            }`) + (query.suffix ? `-${query.suffix}` : '');

    const resourceHash = createHash('xxhash64')
        .update(sharpVersion + content)
        .digest('hex');
    const formatConfig = imageminConfig[format] || {};
    const cacheFilename = `${encodeURIComponent(`${relativePath}?${JSON.stringify(query)}`)}.json`;
    const cacheFilepath = cacheDirectory ? path.join(cacheDirectory, cacheFilename) : undefined;

    let cacheData;
    if (cacheFilepath && fs.existsSync(cacheFilepath)) {
        try {
            cacheData = JSON.parse(fs.readFileSync(cacheFilepath).toString());
        } catch (cacheError) {
            logger.error(`error cache '${relativePath}${loaderContext.resourceQuery}'`, cacheError);
            cacheData = undefined;
        }
    }

    if (
        cacheData !== undefined &&
        cacheData.type === 'Buffer' &&
        cacheData.data &&
        cacheData.hash === resourceHash &&
        cacheData.config === JSON.stringify(formatConfig)
    ) {
        if (options.verbose) {
            logger.info(`load cache '${relativePath}${loaderContext.resourceQuery}'`);
        }
        loaderContext.resourcePath = path.join(resourceInfo.dir, `${name}.${format}`);
        return loaderCallback(null, nextLoader.call(loaderContext, Buffer.from(cacheData.data, 'base64')));
    }

    const resourceImage = sharp(content);
    const resourceMeta = await resourceImage.metadata();
    const resizeOptions = {
        fit: resizeFit,
        withoutEnlargement: true,
    };
    if (query.resizeOptions) {
        Object.assign(resizeOptions, query.resizeOptions);
    }

    const formatOptions = {};
    const quality = query.quality ? parseInt(query.quality, 10) : 0;
    if (quality > 0) {
        formatOptions.quality = quality;
    }

    const lossless = typeof query.lossless !== 'undefined' ? !!query.lossless : resourceFormat === 'png';

    if (format === 'webp') {
        if (lossless || quality === 100) {
            formatOptions.lossless = true;
        } else if (!quality) {
            formatOptions.quality = imageminConfig.webp.quality;
        }
        if (imageminConfig.webp.options) {
            Object.assign(formatOptions, imageminConfig.webp.options);
        }
        if (query.options) {
            Object.assign(formatOptions, query.options);
        }
    }

    if (format === 'avif') {
        if (lossless) {
            formatOptions.lossless = true;
        } else if (!quality) {
            formatOptions.quality = imageminConfig.avif.quality;
        }
        if (imageminConfig.avif.options) {
            Object.assign(formatOptions, imageminConfig.avif.options);
        }
        if (query.options) {
            Object.assign(formatOptions, query.options);
        }
    }

    if (format === 'jpg' || format === 'jpeg') {
        if (!quality) {
            formatOptions.quality = imageminConfig.jpeg.quality;
        }
        if (imageminConfig.jpeg.options) {
            Object.assign(formatOptions, imageminConfig.jpeg.options);
        }
        if (query.options) {
            Object.assign(formatOptions, query.options);
        }
    }

    if (format === 'png') {
        if (!quality) {
            formatOptions.quality = imageminConfig.png.quality;
        }
        if (imageminConfig.png.options) {
            Object.assign(formatOptions, imageminConfig.png.options);
        }
        if (query.options) {
            Object.assign(formatOptions, query.options);
        }
    }

    if (resizeWidth || resizeHeight) {
        resourceImage.resize(resizeWidth || resourceMeta.width, resizeHeight || resourceMeta.height, resizeOptions);
    }

    resourceImage.toFormat(format.toLowerCase(), formatOptions);

    await resizeLimit(async () => {
        const resizePromise = await new Promise((resizeResolve, resizeReject) => {
            resourceImage
                .toBuffer()
                .then((buffer) => {
                    if (cacheFilepath) {
                        fs.writeFileSync(
                            cacheFilepath,
                            JSON.stringify({
                                type: 'Buffer',
                                data: buffer.toString('base64'),
                                hash: resourceHash,
                                config: JSON.stringify(formatConfig),
                            })
                        );
                    }
                    if (options.verbose) {
                        logger.info(`save cache '${relativePath}${loaderContext.resourceQuery}'`);
                    }
                    resizeResolve(buffer);
                    loaderContext.resourcePath = path.join(resourceInfo.dir, `${name}.${format}`);
                    loaderCallback(null, nextLoader.call(loaderContext, buffer));
                })
                .catch((bufferError) => {
                    loaderContext.emitError(bufferError);
                    loaderCallback(bufferError);
                    resizeReject(bufferError);
                });
        }).catch((promiseError) => {
            loaderContext.emitError(promiseError);
            loaderCallback(promiseError);
        });
        return resizePromise;
    });
};

module.exports.raw = true;
