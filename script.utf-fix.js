/* eslint-env node */
/* eslint max-len: "off", "compat/compat": "off" */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const slash = require('slash');
const weblog = require('webpack-log');

const logger = weblog({ name: 'utf-fix' });
const ENV = require('./app.env.js');

glob(`${ENV.SOURCE_PATH}/**/*.{html,svg,js,json,css,scss}`, {
    ignore: [],
}, (error, files) => {
    if (error) throw error;

    files.forEach((filename) => {
        const html = fs.readFileSync(filename, 'utf8').toString();

        const newHtml = html.normalize('NFC');
        fs.writeFileSync(filename, newHtml);

        const relative = slash(path.relative(__dirname, filename));

        if (newHtml === html) {
            logger.info(`skiped ${relative}`);
        } else {
            logger.info(`fixed ${relative}`);
        }
    });
});
