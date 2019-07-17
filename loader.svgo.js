const path = require('path');
const slash = require('slash');
const SVGO = require('svgo');
const weblog = require('webpack-log');
const { SvgoIdPrefix, SvgoPrefixConfig } = require('./svgo.config.js');

const logger = weblog({ name: 'loader-svgo' });

module.exports = function SvgLoader(content) {
    const loaderContext = this;
    if (loaderContext.cacheable) loaderContext.cacheable();
    const loaderCallback = loaderContext.async();

    const name = path.basename(loaderContext.resourcePath, '.svg');
    const options = SvgoPrefixConfig(new SvgoIdPrefix(`svgo-${name.toLowerCase()}-`));
    const svgoInstance = new SVGO(options);

    const relativePath = slash(path.relative(__dirname, loaderContext.resourcePath));
    logger.info(`optimize(${JSON.stringify(relativePath)})`);

    svgoInstance.optimize(content).then((result) => {
        logger.info(result.info);

        const exportString = `module.exports = ${JSON.stringify(result.data)}`;
        loaderCallback(null, exportString);
    }).catch((error) => {
        loaderCallback(error);
    });
};
module.exports.raw = true;
