/* eslint-env node -- webpack is node env */
/* eslint max-len: "off", "compat/compat": "off" -- webpack is node env */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const slash = require('slash');
const weblog = require('webpack-log');
const ignore = require('ignore');

const SVGO = require('svgo');
const { SvgoCreateConfig } = require('./svgo.config.js');

const logger = weblog({ name: 'svgo' });
const ENV = require('./app.env.js');

const ImageminIgnore = ignore().add(fs.readFileSync('./.imageminignore').toString());

const statMessages = { fixed: 0, skipped: 0 };

function globPromise(pattern, options) {
    return new Promise((resolve, reject) => {
        glob(pattern, options, (err, files) => (err === null ? resolve(files) : reject(err)));
    });
}

const promises = [
    `${ENV.SOURCE_PATH}/**/*.svg`,
    '../include/template/**/*.svg',
].map((i) => globPromise(i, {
    ignore: [],
}).then((files) => {
    files.forEach((resourcePath) => {
        const svg = fs.readFileSync(resourcePath, 'utf8').toString();
        const relativePath = slash(path.relative(ENV.SOURCE_PATH, path.normalize(resourcePath)));

        const ignores = ImageminIgnore.ignores(relativePath);
        if (ignores) {
            logger.info(`ignored ${relativePath}`);
            return;
        }

        const name = path.basename(resourcePath, '.svg');
        const options = SvgoCreateConfig({ prefix: `svgo-${name.toLowerCase()}-`, pretty: true });
        options.path = relativePath;

        const result = SVGO.optimize(svg, options);
        if (result.error) {
            throw new Error(`${JSON.stringify(relativePath)} -- ${result.error}`);
        } else if (svg !== result.data) {
            fs.writeFileSync(resourcePath, result.data);
            statMessages.fixed += 1;
            logger.info(`fixed ${relativePath}`);
        } else {
            statMessages.skipped += 1;
            logger.info(`skipped ${relativePath}`);
        }
    });
}));

Promise.all(promises).then(() => {
    console.log('');
    logger.info('stats:', statMessages);
});
