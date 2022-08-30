/* eslint-env node -- webpack is node env */
/* eslint max-len: "off", "compat/compat": "off" -- webpack is node env */

const fs = require('fs');
const path = require('path');
const slash = require('slash');
const weblog = require('webpack-log');
const { HtmlValidate } = require('html-validate');

const ENV = require('./app.env');
const UTILS = require('./webpack.utils');

const logger = weblog({ name: 'html-validate' });

const ignoreLines = fs.readFileSync('./.htmlignore')
    .toString().trim().split('\n')
    .map((line) => line.toLowerCase().trim());

const ignoreTest = (message) => {
    const lowerMessage = message.toLowerCase().trim();
    return ignoreLines.some((line) => line.includes(lowerMessage));
};

const lineEllipsis = 80;
const config = require('./.htmlvalidaterc');

const htmlvalidate = new HtmlValidate({ ...config });
const patterns = [...UTILS.processArgs.argv._];

UTILS.globArray(patterns.length > 0 ? patterns : [
    `${ENV.OUTPUT_PATH}/**/*.html`,
], {
    ignore: [],
    nodir: true,
}).then((files) => {
    logger.info(`${files.length} files\n`);

    const statMessages = { skipped: 0 };
    const increaseStat = (type) => {
        if (type in statMessages) statMessages[type] += 1;
        else statMessages[type] = 1;
    };

    files.forEach((resourcePath) => {
        const relativePath = slash(path.relative(__dirname, resourcePath));

        if (path.basename(resourcePath).startsWith('_')) {
            logger.info(`skipped ${relativePath}`);
            increaseStat('skipped');
            return;
        }

        const html = fs.readFileSync(resourcePath).toString('utf-8');
        const report = htmlvalidate.validateFile(resourcePath);

        if (report.results.length === 0) {
            logger.info(`skipped ${relativePath}`);
            increaseStat('skipped');
            return;
        }

        report.results.forEach((result) => {
            result.messages.forEach((message) => {
                const messageType = (message.severity === 2 ? 'error' : 'warning');
                if (message.message && ignoreTest(message.message)) {
                    increaseStat(`${messageType}s-ignored`);
                    return;
                }
                if (messageType === 'error') {
                    process.exitCode = 1;
                }
                increaseStat(`${messageType}s`);

                logger.error(`${relativePath}: line ${message.line || 0} col [${message.column || 0}]`);
                logger.warn(`${messageType}[${message.ruleId}]: ${message.message}`);

                const ellipsis = html.substring(message.offset - lineEllipsis, message.offset + lineEllipsis).trim();
                console.log(`...${ellipsis}...`);
                console.log('');
            });
        });
    });

    console.log('');
    logger.info('stats:', statMessages);
});
