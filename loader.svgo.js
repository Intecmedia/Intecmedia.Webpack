const path = require('path');
const slash = require('slash');
const weblog = require('webpack-log');

const SVGO = require('svgo');
const { SvgoCreateConfig } = require('./svgo.config');

const logger = weblog({ name: 'loader-svgo' });

module.exports = function SvgLoader(content) {
    const loaderContext = this;
    if (loaderContext.cacheable) loaderContext.cacheable();
    const loaderCallback = loaderContext.async();

    const name = path.basename(loaderContext.resourcePath, '.svg');
    const options = SvgoCreateConfig({ prefix: `svgo-${name.toLowerCase()}` });

    const relativePath = slash(path.relative(__dirname, loaderContext.resourcePath));
    options.path = relativePath;

    if (options.verbose) {
        logger.info(`optimize(${JSON.stringify(relativePath)})`);
    }

    const result = SVGO.optimize(content, options);
    if (result.error) {
        loaderCallback(`In ${JSON.stringify(relativePath)} -- ${result.error}`);
    } else {
        const prefix = `<!-- ${JSON.stringify(relativePath)} -->\n`;
        const suffix = `\n<!-- /${JSON.stringify(relativePath)} -->\n`;
        loaderCallback(null, `module.exports = ${JSON.stringify(prefix + result.data.trim() + suffix)}`);
    }
};
module.exports.raw = true;
