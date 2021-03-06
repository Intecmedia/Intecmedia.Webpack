/* eslint-env node -- webpack is node env */
/* eslint max-len: "off", "compat/compat": "off" -- webpack is node env */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const slash = require('slash');
const weblog = require('webpack-log');
const { HtmlValidate } = require('html-validate');
const { argv } = require('yargs');

const ENV = require('./app.env');

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

const verbose = 'verbose' in argv && argv.verbose;
const pathSuffix = argv.pathSuffix && typeof (argv.pathSuffix) === 'string' ? argv.pathSuffix : '';

glob(ENV.OUTPUT_PATH + (pathSuffix ? `/${pathSuffix.trim('/')}` : '/**/*.html'), {
    ignore: [],
    nodir: true,
}, (error, files) => {
    if (error) throw error;

    logger.info(`${files.length} files\n`);

    const statMessages = { ignored: 0, skipped: 0 };
    const increaseStat = (type) => {
        if (type in statMessages) statMessages[type] += 1;
        else statMessages[type] = 1;
    };

    files.forEach((resourcePath) => {
        const relativePath = slash(path.relative(__dirname, resourcePath));

        if (path.basename(resourcePath).startsWith('_')) {
            if (verbose) logger.info(`skipped ${relativePath}`);
            increaseStat('skipped');
            return;
        }

        const html = fs.readFileSync(resourcePath).toString('utf-8');
        const report = htmlvalidate.validateFile(resourcePath);

        if (report.results.length === 0) {
            if (verbose) logger.info(`skipped ${relativePath}`);
            increaseStat('skipped');
            return;
        }

        report.results.forEach((result) => {
            result.messages.forEach((message) => {
                if (message.message && ignoreTest(message.message)) {
                    increaseStat('ignored');
                    return;
                }

                const messageType = (message.severity === 2 ? 'error' : 'warning');
                if (messageType === 'error') {
                    process.exitCode = 1;
                }
                increaseStat(messageType);

                logger.error(`${relativePath}: line ${message.line || 0} col [${message.column || 0}]`);
                logger.warn(`${messageType}[${message.ruleId}]: ${JSON.stringify(message.message)}`);

                const ellipsis = html.substring(message.offset - lineEllipsis, message.offset + lineEllipsis).trim();
                console.log(`...${ellipsis}...`);
                console.log('');
            });
        });
    });

    console.log('');
    logger.info('stats:', statMessages);
});
