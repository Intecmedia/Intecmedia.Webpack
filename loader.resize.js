/* eslint-env node */
/* eslint "compat/compat": "off" */

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
};

const resizeCache = flatCache.load('loader-resize.json', path.resolve('./node_modules/.cache/'));
module.exports.resizeCache = resizeCache;

module.exports = function ResizeLoader(content) {
    const loaderContext = this;
    if (loaderContext.cacheable) loaderContext.cacheable();
    const loaderCallback = loaderContext.async();

    const query = loaderContext.resourceQuery ? loaderUtils.parseQuery(loaderContext.resourceQuery) : {};
    const options = deepMerge(
        {},
        DEFAULT_OPTIONS,
        loaderUtils.getOptions(loaderContext),
    );
    const nextLoader = (query.inline === 'inline' ? urlLoader : fileLoader);
    if (!('resize' in query)) {
        return loaderCallback(null, nextLoader.call(loaderContext, content));
    }
    if ('inline' in query) {
        delete query.inline;
    }

    const resourceInfo = path.parse(loaderContext.resourcePath);
    const relativePath = path.relative(__dirname, loaderContext.resourcePath);
    const imageMagick = gm.subClass({ imageMagick: options.imageMagick });

    const resourceHash = md5File.sync(loaderContext.resourcePath);
    const cacheKey = `${relativePath}?${JSON.stringify(query)}&${resourceHash}`;

    let [, resizeWidth,, resizeHeight, resizeFlag] = query.resize.trim().match(/^(\d*)(x(\d*))?([!><^])?$/);
    resizeWidth = parseInt(resizeWidth, 10);
    resizeHeight = parseInt(resizeHeight, 10);
    resizeFlag = (resizeFlag || '').trim();
    const resizeFlagNames = {
        '': '', '!': '-ignore-aspect', '>': '-shrink-larger', '<': '-enlarge-smaller', '^': '-fill-area',
    };
    if (!(resizeFlag in resizeFlagNames)) {
        return loaderCallback(`Unknow resize flag: '${query.resize}'`);
    }

    const format = (query.format || resourceInfo.ext.substr(1)).toLowerCase();
    const name = (query.name || (
        `${resourceInfo.name}@resize-${resizeWidth || ''}x${resizeHeight || ''}${resizeFlagNames[resizeFlag]}`
    )) + (query.suffix ? `-${query.suffix}` : '');

    const cacheData = resizeCache.getKey(cacheKey);
    if (cacheData !== undefined && cacheData.type === 'Buffer' && cacheData.data) {
        logger.info(`load cache '${relativePath}${loaderContext.resourceQuery}'`);
        loaderContext.resourcePath = path.join(resourceInfo.dir, `${name}.${format}`);
        loaderCallback(null, nextLoader.call(loaderContext, Buffer.from(cacheData.data)));
    } else {
        imageMagick(content).size(function sizeCallback(sizeError, size) {
            if (sizeError) { loaderCallback(sizeError); return; }

            this.resize(resizeWidth || size.width, resizeHeight || size.height, resizeFlag);
            const quality = query.quality ? parseInt(query.quality, 10) : 0;
            if (quality > 0) {
                this.quality(quality);
            }

            this.toBuffer(format.toUpperCase(), (bufferError, buffer) => {
                if (bufferError) { loaderCallback(bufferError); return; }
                logger.info(`save cache '${relativePath}${loaderContext.resourceQuery}'`);
                resizeCache.setKey(cacheKey, buffer.toJSON());
                loaderContext.resourcePath = path.join(resourceInfo.dir, `${name}.${format}`);
                loaderCallback(null, nextLoader.call(loaderContext, buffer));
                resizeCache.save(true);
            });
        });
    }
};

module.exports.raw = true;
