/* eslint max-len: "off" */
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const slash = require('slash');
const validator = require('html-validator');
const weblog = require('webpack-log');

const logger = weblog({ name: 'html-validator' });

const ENV = require('./app.env.js');

const ignoreLines = fs.readFileSync('./.htmlvalidatorignore')
    .toString().trim().split('\n')
    .map(i => i.toLowerCase().trim());

const errorsLogger = {
    error: logger.error,
    'non-document-error': logger.error,
    info: logger.info,
    warning: logger.warn,
};

glob(`${ENV.OUTPUT_PATH}/**/*.html`, {
    ignore: [],
}, (error, files) => {
    if (error) throw error;

    files.forEach(async (filename) => {
        const relative = slash(path.relative(__dirname, filename));
        const html = fs.readFileSync(filename, 'utf8').toString();
        const result = await validator({ format: 'json', data: html });

        let skipped = false;
        if (result.messages && result.messages.length) {
            result.messages.forEach((message) => {
                if (message.message && ignoreLines.includes(message.message.toLowerCase().trim())) {
                    skipped = true;
                    return;
                }
                if (message.type === 'error') {
                    process.exitCode = 1;
                }
                const log = errorsLogger[message.type] || logger.error;
                log(`${relative}: line ${message.lastLine || 0} col [${message.firstColumn || 0}-${message.lastColumn || 0}]`);
                log(`${message.type}: ${JSON.stringify(message.message)}.`);
                log(`${JSON.stringify(message.extract)}.`);
                console.log('');
            });
        } else {
            skipped = true;
        }

        if (skipped) {
            logger.info(`skipped ${relative}`);
        }
    });
});
