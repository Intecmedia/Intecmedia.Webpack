/* eslint-env node */
/* eslint max-len: "off", "compat/compat": "off" */

const path = require('path');
const glob = require('glob');
const slash = require('slash');
const weblog = require('webpack-log');
const { HtmlValidate } = require('html-validate');

const ENV = require('./app.env.js');

const htmlvalidate = new HtmlValidate();
const logger = weblog({ name: 'html-validate' });

glob(`${ENV.OUTPUT_PATH}/**/*.html`, {
    ignore: [],
}, (error, files) => {
    if (error) throw error;

    files.forEach((filename) => {
        const relative = slash(path.relative(__dirname, filename));

        if (path.basename(filename).indexOf('_') === 0) {
            logger.info(`ignored ${relative}`);
            return;
        }

        const report = htmlvalidate.validateFile(filename);

        if (!report.results.length) {
            logger.info(`skipped ${relative}`);
            return;
        }

        report.results.forEach((result) => {
            result.messages.forEach((message) => {
                const messageType = (message.severity === 2 ? 'error' : 'warning');
                logger.error(`${relative}: line ${message.line || 0} col [${message.column || 0}]`);
                logger.warn(`${messageType} [${message.ruleId}] ${message.message}`);
            });
        });

        if (report.errorCount > 0) {
            process.exitCode = 1;
        }
    });
});
