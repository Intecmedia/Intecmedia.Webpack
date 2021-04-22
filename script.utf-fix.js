/* eslint-env node -- webpack is node env */
/* eslint max-len: "off", "compat/compat": "off" -- webpack is node env */

const fs = require('fs');
const path = require('path');
const slash = require('slash');
const weblog = require('webpack-log');

const logger = weblog({ name: 'utf-fix' });
const ENV = require('./app.env.js');
const UTILS = require('./webpack.utils.js');

UTILS.globArray([
    path.join(__dirname, '*.{js,json}'),
    `${ENV.SOURCE_PATH}/**/*.{html,svg,js,json,css,scss}`,
], {
    ignore: [],
    dot: true,
    nodir: true,
}).then((files) => {
    files.forEach((resourcePath) => {
        const resourceStat = fs.lstatSync(resourcePath);
        if (!resourceStat.isFile()) return;

        const relativePath = slash(path.relative(__dirname, resourcePath));
        const source = fs.readFileSync(resourcePath, 'utf8').toString();
        const fixedSource = source.normalize('NFC')
            .replace(/\r\n/g, '\n')
            .replace(/\t/g, '    ')
            .replace(/[ \t]+\n/g, '\n');

        if (fixedSource === source) {
            logger.info(`skiped ${relativePath}`);
        } else {
            fs.writeFileSync(resourcePath, fixedSource);
            logger.info(`fixed ${relativePath}`);
        }
    });
});
