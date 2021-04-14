/* eslint-env node -- webpack is node env */
/* eslint "compat/compat": "off" -- webpack is node env */
/* eslint "no-invalid-this": "off" -- its ok for 3d-party */

const os = require('os');
const gm = require('gm');
const path = require('path');
const md5File = require('md5-file');
const flatCache = require('flat-cache');
const loaderUtils = require('loader-utils');
const urlLoader = require('url-loader');
const fileLoader = require('file-loader');
const deepMerge = require('lodash.merge');
const weblog = require('webpack-log');
const slash = require('slash');
const pLimit = require('p-limit');

const logger = weblog({ name: 'loader-resize' });
const imageminConfig = require('./imagemin.config.js');

const imageminConfigModule = require.resolve('./imagemin.config.js');

const DEFAULT_OPTIONS = {
    imageMagick: true,
    cacheDirectory: false,
    verbose: false,
};

const resizeLimit = pLimit(os.cpus().length - 1);
const resizeCacheMap = new Map();

function getResizeCache(cacheDirectory) {
    if (!resizeCacheMap.has(cacheDirectory)) {
        resizeCacheMap.set(cacheDirectory, cacheDirectory ? flatCache.load('loader-resize.json', cacheDirectory) : false);
    }
    return resizeCacheMap.get(cacheDirectory);
}

module.exports = async function ResizeLoader(content) {
    const thisLoader = this;

    if (thisLoader.cacheable) thisLoader.cacheable();
    const loaderCallback = thisLoader.async();

    thisLoader.addDependency(imageminConfigModule);

    const query = thisLoader.resourceQuery ? loaderUtils.parseQuery(thisLoader.resourceQuery) : {};
    const options = deepMerge(
        {},
        DEFAULT_OPTIONS,
        loaderUtils.getOptions(thisLoader),
    );
    const context = options.context || thisLoader.rootContext;
    const resizeCache = getResizeCache(options.cacheDirectory);
    delete options.cacheDirectory;

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
    const imageMagick = gm.subClass({ imageMagick: options.imageMagick });
    delete options.imageMagick;

    let [, resizeWidth,, resizeHeight, resizeFlag] = query.resize.trim().match(/^(\d*)(x(\d*))?([!<>^])?$/);
    resizeWidth = parseInt(resizeWidth, 10);
    resizeHeight = parseInt(resizeHeight, 10);
    resizeFlag = (resizeFlag || '').trim();
    const resizeFlagNames = {
        '': '', '!': '-ignore-aspect', '>': '-shrink-larger', '<': '-enlarge-smaller', '^': '-fill-area',
    };
    if (!(resizeFlag in resizeFlagNames)) {
        return loaderCallback(`Unknow resize flag: '${query.resize}'`);
    }

    const format = (query.format || resourceFormat).toLowerCase();
    const name = ((query.name ? loaderUtils.interpolateName(thisLoader, query.name, {
        context,
        content,
    }) : null) || (
        `${resourceInfo.name}@resize-${resizeWidth || ''}x${resizeHeight || ''}${resizeFlagNames[resizeFlag]}`
    )) + (query.suffix ? `-${query.suffix}` : '');

    const resourceHash = md5File.sync(thisLoader.resourcePath);
    const formatConfig = imageminConfig[format] || {};
    const cacheKey = `${relativePath}?${JSON.stringify(query)}`;
    const cacheData = resizeCache ? resizeCache.getKey(cacheKey) : undefined;

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
        loaderCallback(null, nextLoader.call(thisLoader, Buffer.from(cacheData.data, 'base64')));
    } else {
        const resourceImage = imageMagick(content);

        const resourceSize = await resourceImage.size();
        if (resizeWidth || resizeHeight || resizeFlag) {
            resourceImage.resize(resizeWidth || resourceSize.width, resizeHeight || resourceSize.height, resizeFlag);
        }

        const quality = query.quality ? parseInt(query.quality, 10) : 0;
        if (quality > 0) {
            resourceImage.quality(quality);
        }

        const lossless = (typeof (query.lossless) !== 'undefined' ? !!query.lossless : resourceFormat === 'png');

        if (format === 'webp') {
            if (lossless || quality === 100) {
                resourceImage.define('webp:lossless=true');
            } else if (!quality) {
                resourceImage.quality(imageminConfig.webp.quality);
            }
            const define = query.define || imageminConfig.webp.define;
            if (define && define.length > 0) {
                define.forEach((i) => resourceImage.define(i));
            }
        }

        if (format === 'avif') {
            if (lossless) {
                resourceImage.quality(100);
            } else if (!quality) {
                resourceImage.quality(imageminConfig.avif.quality);
            }
            const define = query.define || imageminConfig.avif.define;
            if (define && define.length > 0) {
                define.forEach((i) => resourceImage.define(i));
            }
        }

        await resizeLimit(async () => {
            const resizePromise = await new Promise((resizeResolve, resizeReject) => {
                resourceImage.toBuffer(format.toUpperCase(), (bufferError, buffer) => {
                    if (bufferError) {
                        loaderCallback(bufferError);
                        resizeReject(bufferError);
                        return;
                    }
                    if (resizeCache) {
                        resizeCache.setKey(cacheKey, {
                            type: 'Buffer',
                            data: buffer.toString('base64'),
                            hash: resourceHash,
                            config: JSON.stringify(formatConfig),
                        });
                    }
                    if (options.verbose) {
                        logger.info(`save cache '${relativePath}${thisLoader.resourceQuery}'`);
                    }
                    resizeResolve(buffer);
                    thisLoader.resourcePath = path.join(resourceInfo.dir, `${name}.${format}`);
                    loaderCallback(null, nextLoader.call(thisLoader, buffer));
                    if (resizeCache) {
                        resizeCache.save(true);
                    }
                });
            });
            return resizePromise;
        });
    }
};

module.exports.raw = true;
