/* eslint-env node -- webpack is node env */
/* eslint max-len: "off", "compat/compat": "off" -- webpack is node env */

const fs = require('fs');
const path = require('path');
const slash = require('slash');
const weblog = require('webpack-log');

const logger = weblog({ name: 'utf-fix' });
const ENV = require('./app.env');
const UTILS = require('./webpack.utils');

const statMessages = { fixed: 0, skipped: 0 };

function stripBom(string) {
    if (string.charCodeAt(0) === 0xFEFF) {
        return string.slice(1);
    }
    return string;
}

UTILS.globArray([
    path.join(__dirname, '*.{js,json}'),
    `${ENV.SOURCE_PATH}/**/*.{html,svg,js,json,css,scss,njk}`,
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
        const fixedSource = stripBom(source.normalize('NFC'))
            .replace(/\r\n/g, '\n')
            .replace(/\t/g, '    ')
            .replace(/[ \t]+\n/g, '\n');

        if (fixedSource === source) {
            statMessages.skipped += 1;
            logger.info(`skiped ${relativePath}`);
        } else {
            statMessages.fixed += 1;
            fs.writeFileSync(resourcePath, fixedSource);
            logger.info(`fixed ${relativePath}`);
        }
    });

    console.log('');
    logger.info('stats:', JSON.stringify(statMessages));
});
