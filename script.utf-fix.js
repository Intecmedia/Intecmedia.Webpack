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

    files.forEach((filename) => {
        const html = fs.readFileSync(filename, 'utf8').toString();

        const newHtml = html.normalize('NFC').replace(/\r\n/g, '\n');
        fs.writeFileSync(filename, newHtml);

        const relative = slash(path.relative(__dirname, filename));

        if (newHtml === html) {
            logger.info(`skiped ${relative}`);
        } else {
            logger.info(`fixed ${relative}`);
        }
    });
}));
