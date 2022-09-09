const fs = require('fs');
const weblog = require('webpack-log');

const logger = weblog({ name: 'clean' });

const ENV = require('./app.env');
const UTILS = require('./webpack.utils');

const KEEP_PATTERN = /(\.gitkeep|thumbs)/;

UTILS.glob(`${ENV.OUTPUT_PATH}/**/*`, {
    nodir: true,
    dot: true,
}).then((files) => {
    files.forEach((filepath) => {
        if (KEEP_PATTERN.test(filepath)) return;

        fs.unlink(filepath, (unlinkError) => {
            if (unlinkError) {
                logger.error(unlinkError);
            }
        });
    });
});
