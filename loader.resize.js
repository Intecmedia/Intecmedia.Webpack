const gm = require('gm');
const path = require('path');
const loaderUtils = require('loader-utils');
const fileLoader = require('file-loader');
const deepAssign = require('deep-assign');
const weblog = require('webpack-log');

const logger = weblog({ name: 'loader-resize' });

const DEFAULT_OPTIONS = {
    imageMagick: true,
};

module.exports = function ResizeLoader(content) {
    const loaderContext = this;
    if (loaderContext.cacheable) loaderContext.cacheable();

    const query = loaderContext.resourceQuery ? loaderUtils.parseQuery(loaderContext.resourceQuery) : {};
    const options = deepAssign(
        {},
        DEFAULT_OPTIONS,
        loaderUtils.getOptions(loaderContext),
    );
    if (!('resize' in query)) return fileLoader.call(loaderContext, content);

    const loaderCallback = this.async();
    const pathinfo = path.parse(loaderContext.resourcePath);
    const magick = gm.subClass({ imageMagick: options.imageMagick });

    logger.info(`processing '${loaderContext.resourcePath}${loaderContext.resourceQuery}'`);
    magick(content).size(function sizeCallback(sizeError, size) {
        if (sizeError) { loaderCallback(sizeError); return; }

        let [, width,, height, flag] = query.resize.trim().match(/^(\d*)(x(\d*))?([!><^])?$/);
        width = parseInt(width, 10);
        height = parseInt(height, 10);
        flag = (flag || '').trim();
        const flagNames = {
            '': '', '!': '-ignore-aspect', '>': '-shrink-larger', '<': '-enlarge-smaller', '^': '-fill-area',
        };
        if (!(flag in flagNames)) { loaderCallback(`Unknow resize flag: '${query.resize}'`); return; }

        this.resize(width || size.width, height || size.height, flag);
        const quality = query.quality ? parseInt(query.quality, 10) : 0;
        if (quality > 0) {
            this.quality(quality);
        }

        const format = (query.format || pathinfo.ext.substr(1)).toLowerCase();
        const name = (query.name || (
            `${pathinfo.name}@${[width || '', height || ''].join('x')}${flagNames[flag]}`
        )) + (query.suffix ? `-${query.suffix}` : '');

        this.toBuffer(format.toUpperCase(), (bufferError, buffer) => {
            if (bufferError) { loaderCallback(bufferError); return; }

            loaderContext.resourcePath = path.join(pathinfo.dir, `${name}.${format}`);
            logger.info(`save '${loaderContext.resourcePath}'`);

            loaderCallback(null, fileLoader.call(loaderContext, buffer));
        });
    });
};

module.exports.raw = true;

const DEFAULT_SIZES = {
    xs: 576, sm: 768, md: 992, lg: 1200, xl: 1900,
};
const DEFAULT_BREAKPOINTS = ['xs', 'sm', 'md', 'lg', 'xl'];
const breakpointsMedia = (breakpoints, sizes) => {
    const sorted = DEFAULT_BREAKPOINTS.filter(i => breakpoints.includes(i));
    const merged = Object.assign({}, sizes, DEFAULT_SIZES);

    const result = new Map();
    sorted.forEach((breakpoint, index) => {
        result[breakpoint] = [
            // not first
            ...(index >= 1 && sorted[index - 1] ? [`(min-width: ${merged[sorted[index - 1]]}px)`] : []),
            // not last
            ...(index !== sorted.length - 1 ? [`(max-width: ${merged[breakpoint] - 1}px)`] : []),
        ].join(' and ');
    });
    return result;
};

module.exports.breakpointsMedia = breakpointsMedia;
module.exports.breakpointsMedia.DEFAULT_SIZES = DEFAULT_SIZES;
module.exports.breakpointsMedia.DEFAULT_BREAKPOINTS = DEFAULT_BREAKPOINTS;
