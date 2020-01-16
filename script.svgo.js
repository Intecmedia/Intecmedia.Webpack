/* eslint-env node */
/* eslint max-len: "off", "compat/compat": "off" */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const slash = require('slash');
const weblog = require('webpack-log');

const SVGO = require('svgo');
const { SvgoCreateConfig } = require('./svgo.config.js');

const logger = weblog({ name: 'svgo' });
const ENV = require('./app.env.js');

glob(`${ENV.SOURCE_PATH}/**/*.svg`, {
    ignore: [],
}, (error, files) => {
    if (error) throw error;

    files.forEach((filename) => {
        const svg = fs.readFileSync(filename, 'utf8').toString();
        const relative = slash(path.relative(__dirname, filename));

        const name = path.basename(filename, '.svg');
        const options = SvgoCreateConfig({ prefix: `svgo-${name.toLowerCase()}-` });
        const svgoInstance = new SVGO(options);

        svgoInstance.optimize(svg).then((result) => {
            fs.writeFileSync(filename, result.data);
            logger.info(`fixed ${relative}`);
        }).catch((exception) => {
            throw new Error(`error in ${relative}: ${exception}`);
        });
    });
});
