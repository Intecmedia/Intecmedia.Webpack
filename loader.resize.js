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
    const anyOfMagick = gm.subClass({ imageMagick: options.imageMagick });

    logger.info(`processing '${loaderContext.resourcePath}${loaderContext.resourceQuery}'`);
    anyOfMagick(content).size(function sizeCallback(error, size) {
        if (error) { loaderCallback(error); return; }

        let [width, height, resize] = query.resize.split('x', 3);
        width = parseInt(width || size.width, 10);
        height = parseInt(height || size.height, 10);
        resize = String(resize).trim();

        this.resize(width, height, resize);
        const quality = query.quality ? parseInt(query.quality, 10) : 0;
        if (quality > 0) {
            this.quality(quality);
        }

        const format = (query.format || pathinfo.ext.substr(1)).toLowerCase();
        const name = (query.name || (
            `@${width === size.width ? '' : width}x${height === size.height ? '' : height}`
        )) + (query.suffix || '');

        this.toBuffer(format.toUpperCase(), (exception, buffer) => {
            if (exception) { loaderCallback(exception); return; }

            loaderContext.resourcePath = path.join(pathinfo.dir, `${name}.${format}`);
            logger.info(`save '${loaderContext.resourcePath}'`);

            loaderCallback(null, fileLoader.call(loaderContext, buffer));
        });
    });
};

module.exports.raw = true;
