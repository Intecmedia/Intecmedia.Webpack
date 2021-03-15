/* eslint-env node -- webpack is node env */
/* eslint "compat/compat": "off" -- webpack is node env */

const path = require('path');
const slash = require('slash');
const weblog = require('webpack-log');

const SVGO = require('svgo');
const { SvgoCreateConfig } = require('./svgo.config.js');

const logger = weblog({ name: 'loader-svgo' });

module.exports = function SvgLoader(content) {
    const loaderContext = this;
    if (loaderContext.cacheable) loaderContext.cacheable();
    const loaderCallback = loaderContext.async();

    const name = path.basename(loaderContext.resourcePath, '.svg');
    const options = SvgoCreateConfig({ prefix: `svgo-${name.toLowerCase()}-` });
    options.path = loaderContext.resourcePath;

    const relativePath = slash(path.relative(__dirname, loaderContext.resourcePath));
    logger.info(`optimize(${JSON.stringify(relativePath)})`);

    const prefix = `<!-- ${JSON.stringify(relativePath)} -->\n`;
    const suffix = `\n<!-- /${JSON.stringify(relativePath)} -->\n`;

    const result = SVGO.optimize(content, options);
    if (result.error) {
        loaderCallback(`${JSON.stringify(relativePath)} -- ${result.error}`);
    } else {
        logger.info(result.info);
        loaderCallback(null, `module.exports = ${JSON.stringify(prefix + result.data.trim() + suffix)}`);
    }
};
module.exports.raw = true;
