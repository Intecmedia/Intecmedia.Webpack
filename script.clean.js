const fs = require('node:fs');
const path = require('node:path');
const weblog = require('webpack-log');

const logger = weblog({ name: 'clean' });

const ENV = require('./app.env');
const UTILS = require('./webpack.utils');

const cleanIgnore = UTILS.readIgnoreFile('./.cleanignore');

UTILS.glob(`${ENV.OUTPUT_PATH}/**/*`, {
    nodir: true,
    dot: true,
})
    .then((files) => {
        files.forEach((filepath) => {
            const relativePath = UTILS.slash(path.relative(ENV.OUTPUT_PATH, filepath));

            if (cleanIgnore.ignores(relativePath)) {
                return;
            }

            fs.unlink(filepath, (unlinkError) => {
                if (unlinkError) {
                    logger.error(unlinkError);
                }
            });
        });
        return files;
    })
    .catch((error) => {
        logger.error(error);
    });
