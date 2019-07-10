const SVGO = require('svgo');
const loaderUtils = require('loader-utils');

module.exports = function SvgLoader(content) {
    const loaderContext = this;
    if (loaderContext.cacheable) loaderContext.cacheable();
    const loaderCallback = this.async();

    const options = loaderUtils.getOptions(loaderContext);
    const svgoInstance = new SVGO(options);

    svgoInstance.optimize(content).then((result) => {
        const exportString = `module.exports = ${JSON.stringify(result.data)}`;
        loaderCallback(null, exportString);
    }).catch((error) => {
        loaderCallback(error);
    });
};
module.exports.raw = true;
