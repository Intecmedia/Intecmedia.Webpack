/* eslint-env node -- webpack is node env */
/* eslint "compat/compat": "off" -- webpack is node env */
/* eslint "no-invalid-this": "off" -- its ok for 3d-party */

const gm = require('gm');
const path = require('path');
const md5File = require('md5-file');
const flatCache = require('flat-cache');
const loaderUtils = require('loader-utils');
const urlLoader = require('url-loader');
const fileLoader = require('file-loader');
const deepMerge = require('lodash.merge');
const weblog = require('webpack-log');

const logger = weblog({ name: 'loader-resize' });

const DEFAULT_OPTIONS = {
    imageMagick: true,
    cacheDirectory: false,
};

module.exports = function ResizeLoader(content) {
    const thisLoader = this;

    if (thisLoader.cacheable) thisLoader.cacheable();
    const loaderCallback = thisLoader.async();

    const query = thisLoader.resourceQuery ? loaderUtils.parseQuery(thisLoader.resourceQuery) : {};
    const options = deepMerge(
        {},
        DEFAULT_OPTIONS,
        loaderUtils.getOptions(thisLoader),
    );
    const context = options.context || thisLoader.rootContext;
    const resizeCache = options.cacheDirectory ? flatCache.load('loader-resize.json', options.cacheDirectory) : false;
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
    const relativePath = path.relative(__dirname, thisLoader.resourcePath);
    const imageMagick = gm.subClass({ imageMagick: options.imageMagick });
    delete options.imageMagick;

    const resourceHash = md5File.sync(thisLoader.resourcePath);
    const cacheKey = `${relativePath}?${JSON.stringify(query)}&${resourceHash}`;

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

    const cacheData = resizeCache ? resizeCache.getKey(cacheKey) : undefined;
    if (cacheData !== undefined && cacheData.type === 'Buffer' && cacheData.data) {
        logger.info(`load cache '${relativePath}${thisLoader.resourceQuery}'`);
        thisLoader.resourcePath = path.join(resourceInfo.dir, `${name}.${format}`);
        loaderCallback(null, nextLoader.call(thisLoader, Buffer.from(cacheData.data)));
    } else {
        imageMagick(content).size(function sizeCallback(sizeError, size) {
            if (sizeError) { loaderCallback(sizeError); return; }

            this.resize(resizeWidth || size.width, resizeHeight || size.height, resizeFlag);
            const quality = query.quality ? parseInt(query.quality, 10) : 0;
            if (quality > 0) {
                this.quality(quality);
            }

            if (format === 'webp') {
                const lossless = (typeof (query.lossless) !== 'undefined'
                    ? !!query.lossless : resourceFormat === 'png');
                if (lossless) {
                    this.define('webp:lossless=true');
                }
            }

            this.toBuffer(format.toUpperCase(), (bufferError, buffer) => {
                if (bufferError) { loaderCallback(bufferError); return; }
                logger.info(`save cache '${relativePath}${thisLoader.resourceQuery}'`);
                if (resizeCache) resizeCache.setKey(cacheKey, buffer.toJSON());
                thisLoader.resourcePath = path.join(resourceInfo.dir, `${name}.${format}`);
                loaderCallback(null, nextLoader.call(thisLoader, buffer));
                if (resizeCache) resizeCache.save(true);
            });
        });
    }
};

module.exports.raw = true;
