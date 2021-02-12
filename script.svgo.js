/* eslint-env node -- webpack is node env */
/* eslint max-len: "off", "compat/compat": "off" -- webpack is node env */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const slash = require('slash');
const weblog = require('webpack-log');

const SVGO = require('svgo');
const { SvgoCreateConfig } = require('./svgo.config.js');

const logger = weblog({ name: 'svgo' });
const ENV = require('./app.env.js');

[
    `${ENV.SOURCE_PATH}/**/*.svg`,
    '../include/template/**/*.svg',
].map((i) => glob(i, {
    ignore: [],
}, (error, files) => {
    if (error) throw error;

    files.forEach((filename) => {
        const svg = fs.readFileSync(filename, 'utf8').toString();
        const relative = slash(path.relative(__dirname, filename));

        const name = path.basename(filename, '.svg');
        const options = SvgoCreateConfig({ prefix: `svgo-${name.toLowerCase()}-`, pretty: true });
        const svgoInstance = new SVGO(options);

        svgoInstance.optimize(svg).then((result) => {
            fs.writeFileSync(filename, result.data);
            if (svg !== result.data) {
                logger.info(`fixed ${relative}`);
            } else {
                logger.info(`skipped ${relative}`);
            }
        }).catch((svgoError) => {
            throw new Error(`error in ${relative}: ${svgoError}`);
        });
    });
}));
