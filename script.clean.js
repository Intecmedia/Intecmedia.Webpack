/* eslint-env node -- webpack is node env */
/* eslint max-len: "off", "compat/compat": "off" -- webpack is node env */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const weblog = require('webpack-log');

const logger = weblog({ name: 'clean' });

const ENV = require('./app.env');

glob(`${ENV.OUTPUT_PATH}/**/*`, {
    nodir: true,
    dot: true,
}, (globError, files) => {
    if (globError) {
        logger.error(globError);
    }

    files.forEach((file) => {
        if (path.basename(file) === '.gitkeep') return;

        fs.unlink(file, (unlinkError) => {
            if (unlinkError) {
                logger.error(unlinkError);
            }
        });
    });
});
