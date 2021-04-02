/* eslint-env node -- webpack is node env */
/* eslint max-len: "off", "compat/compat": "off" -- webpack is node env */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const slash = require('slash');
const weblog = require('webpack-log');

const logger = weblog({ name: 'utf-fix' });
const ENV = require('./app.env.js');

[
    path.join(__dirname, '*.*'),
    `${ENV.SOURCE_PATH}/**/*.{html,svg,js,json,css,scss}`,
].map((i) => glob(i, {
    ignore: [],
}, (error, files) => {
    if (error) throw error;

    files.forEach((resourcePath) => {
        const source = fs.readFileSync(resourcePath, 'utf8').toString();
        const fixedSource = source.normalize('NFC').replace(/\r\n/g, '\n');
        const relativePath = slash(path.relative(__dirname, resourcePath));

        if (fixedSource === source) {
            logger.info(`skiped ${relativePath}`);
        } else {
            fs.writeFileSync(resourcePath, fixedSource);
            logger.info(`fixed ${relativePath}`);
        }
    });
}));
