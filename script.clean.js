/* eslint-env node -- webpack is node env */
/* eslint max-len: "off", "compat/compat": "off" -- webpack is node env */

const fs = require('fs');
const path = require('path');
const weblog = require('webpack-log');

const logger = weblog({ name: 'clean' });

const ENV = require('./app.env');
const UTILS = require('./webpack.utils');

UTILS.glob(`${ENV.OUTPUT_PATH}/**/*`, {
    nodir: true,
    dot: true,
}).then((files) => {
    files.forEach((filepath) => {
        if (path.basename(filepath) === '.gitkeep') return;

        fs.unlink(filepath, (unlinkError) => {
            if (unlinkError) {
                logger.error(unlinkError);
            }
        });
    });
});
