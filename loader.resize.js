const gm = require('gm');
const path = require('path');
const loaderUtils = require('loader-utils');
const fileLoader = require('file-loader');
const deepAssign = require('deep-assign');

const DEFAULT_OPTIONS = {
    resize: null,
    imageMagick: true,
};

module.exports = function ResizeLoader(content) {
    const loaderContext = this;
    if (loaderContext.cacheable) loaderContext.cacheable();

    const options = deepAssign(
        {},
        DEFAULT_OPTIONS,
        loaderUtils.getOptions(loaderContext),
        loaderContext.resourceQuery ? loaderUtils.parseQuery(loaderContext.resourceQuery) : {},
    );
    if (!options.resize) return fileLoader.call(loaderContext, content);

    const loaderCallback = this.async();

    const magick = gm.subClass({ imageMagick: options.imageMagick });
    magick(content).size(function sizeCallback(error, size) {
        if (error) { loaderCallback(error); return; }

        let [width, height] = options.resize.split('x', 2);
        width = parseInt(width || size.width, 10);
        height = parseInt(height || size.height, 10);

        this.resize(width, height);
        this.toBuffer((exception, buffer) => {
            if (exception) { loaderCallback(exception); return; }

            const resource = path.parse(loaderContext.resourcePath);
            const resourcePath = path.join(resource.dir, `${resource.name}@${width}x${height}${resource.ext}`);
            loaderContext.resourcePath = resourcePath;
            loaderContext.addDependency(resourcePath);

            loaderCallback(null, fileLoader.call(loaderContext, buffer));
        });
    });
};

module.exports.raw = true;
