/* eslint max-len: "off" */
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const slash = require('slash');
const validator = require('html-validator');
const weblog = require('webpack-log');

const logger = weblog({ name: 'html-validator' });

const ENV = require('./app.env.js');

const errorLoggers = {
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
        result.messages.forEach((message) => {
            if (message.type === 'error') {
                process.exitCode = 1;
            }
            const log = errorLoggers[message.type] || logger.error;
            log(`${relative}: line [${message.lastLine}] col [${message.firstColumn}-${message.lastColumn}]`);
            log(`${message.type}: ${JSON.stringify(message.message)}.`);
            log(`${JSON.stringify(message.extract)}.`);
            console.log('');
        });
    });
});
