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

[
    `${ENV.SOURCE_PATH}/**/*.svg`,
    '../include/template/**/*.svg',
].map((i) => glob(i, {
    ignore: [],
}, (error, files) => {
    if (error) throw error;

    files.forEach((filename) => {
        const svg = fs.readFileSync(filename, 'utf8').toString();
        const relative = slash(path.relative(ENV.SOURCE_PATH, path.normalize(filename)));

        const ignores = ImageminIgnore.ignores(relative);
        if (ignores) {
            logger.info(`ignored ${relative}`);
            return;
        }

        const name = path.basename(filename, '.svg');
        const options = SvgoCreateConfig({ prefix: `svgo-${name.toLowerCase()}-`, pretty: true });
        options.path = filename;

        const result = SVGO.optimize(svg, options);
        if (result.error) {
            throw new Error(`${JSON.stringify(relative)} -- ${result.error}`);
        } else {
            logger.info(result.info);
            if (svg !== result.data) {
                fs.writeFileSync(filename, result.data);
                logger.info(`fixed ${relative}`);
            } else {
                logger.info(`skipped ${relative}`);
            }
        }
    });
}));
