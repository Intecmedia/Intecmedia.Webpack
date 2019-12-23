/* eslint-env node */
/* eslint max-len: "off", "compat/compat": "off" */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const slash = require('slash');
const weblog = require('webpack-log');
const { HtmlValidate } = require('html-validate');
const { argv } = require('yargs');

const ENV = require('./app.env.js');

const logger = weblog({ name: 'html-validate' });

const ignoreLines = fs.readFileSync('./.htmlignore')
    .toString().trim().split('\n')
    .map((i) => i.toLowerCase().trim());

const ignoreTest = (message) => {
    const lowerMessage = message.toLowerCase().trim();
    return ignoreLines.some((i) => i.includes(lowerMessage));
};

const lineEllipsis = 80;
const htmlvalidate = new HtmlValidate();
const pathSuffix = argv.pathSuffix && typeof (argv.pathSuffix) === 'string' ? argv.pathSuffix : '';

glob(ENV.OUTPUT_PATH + (pathSuffix ? `/${pathSuffix.trim('/')}` : '/**/*.html'), {
    ignore: [],
}, (error, files) => {
    if (error) throw error;

    logger.info(`${files.length} files\n`);

    const statMessages = {};
    const increaseStat = (type) => {
        if (type in statMessages) statMessages[type] += 1;
        else statMessages[type] = 1;
    };

    let processed = 0;
    files.forEach((filename) => {
        const relative = slash(path.relative(__dirname, filename));

        if (path.basename(filename).startsWith('_')) {
            logger.info(`ignored ${relative}`);
            return;
        }

        const html = fs.readFileSync(filename).toString('utf-8');
        const report = htmlvalidate.validateFile(filename);

        if (!report.results.length) {
            logger.info(`skipped ${relative}`);
            return;
        }

        report.results.forEach((result) => {
            result.messages.forEach((message) => {
                if (message.message && ignoreTest(message.message)) {
                    increaseStat('ignore');
                    return;
                }

                const messageType = (message.severity === 2 ? 'error' : 'warning');
                if (messageType === 'error') {
                    process.exitCode = 1;
                }
                increaseStat(messageType);

                logger.error(`${relative}: line ${message.line || 0} col [${message.column || 0}]`);
                logger.warn(`${messageType}[${message.ruleId}]: ${JSON.stringify(message.message)}`);

                const ellipsis = html.substring(message.offset - lineEllipsis, message.offset + lineEllipsis).trim();
                console.log(ellipsis);
                console.log('');
            });
        });

        processed += 1;
        if (processed === files.length) {
            logger.info(statMessages);
        }
    });
});
