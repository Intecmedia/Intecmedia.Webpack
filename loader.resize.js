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

    const queryOptions = loaderContext.resourceQuery ? loaderUtils.parseQuery(loaderContext.resourceQuery) : {};
    const options = deepAssign(
        {},
        DEFAULT_OPTIONS,
        loaderUtils.getOptions(loaderContext),
    );
    if (!('resize' in queryOptions)) return fileLoader.call(loaderContext, content);

    const loaderCallback = this.async();
    const resourceInfo = path.parse(loaderContext.resourcePath);
    const anyOfMagick = gm.subClass({ imageMagick: options.imageMagick });

    logger.info(`processing '${loaderContext.resourcePath}${loaderContext.resourceQuery}'`);
    anyOfMagick(content).size(function sizeCallback(error, size) {
        if (error) { loaderCallback(error); return; }

        let [width, height] = queryOptions.resize.split('x', 2);
        width = parseInt(width || size.width, 10);
        height = parseInt(height || size.height, 10);

        this.resize(width, height);
        const quality = queryOptions.quality ? parseInt(queryOptions.quality, 10) : 0;
        if (quality > 0) {
            this.quality(quality);
        }

        const format = (queryOptions.format || resourceInfo.ext.substr(1));
        this.toBuffer(format.toUpperCase(), (exception, buffer) => {
            if (exception) { loaderCallback(exception); return; }

            const resourcePath = path.join(resourceInfo.dir, [
                ...(queryOptions.name ? [
                    queryOptions.name,
                ] : [
                    resourceInfo.name,
                    (
                        width !== size.width || height !== size.height
                            ? `@${width === size.width ? '' : width}x${height === size.height ? '' : height}`
                            : ''
                    ),
                ]),
                (queryOptions.suffix || ''),
                '.',
                format.toLowerCase(),
            ].join(''));
            logger.info(`save '${resourcePath}'`);
            loaderContext.resourcePath = resourcePath;

            loaderCallback(null, fileLoader.call(loaderContext, buffer));
        });
    });
};

module.exports.raw = true;
