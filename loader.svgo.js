const path = require('path');
const SVGO = require('svgo');
const { SvgoIdPrefix, SvgoPrefixConfig } = require('./svgo.config.js');

module.exports = function SvgLoader(content) {
    const loaderContext = this;
    if (loaderContext.cacheable) loaderContext.cacheable();
    const loaderCallback = this.async();

    const name = path.basename(loaderContext.resourcePath, '.svg');
    const options = SvgoPrefixConfig(new SvgoIdPrefix(`svgo-${name.toLowerCase()}-`));
    const svgoInstance = new SVGO(options);

    svgoInstance.optimize(content).then((result) => {
        const exportString = `module.exports = ${JSON.stringify(result.data)}`;
        loaderCallback(null, exportString);
    }).catch((error) => {
        loaderCallback(error);
    });
};
module.exports.raw = true;
