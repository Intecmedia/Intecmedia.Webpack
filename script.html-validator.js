/* eslint-env node -- webpack is node env */
/* eslint max-len: "off", "compat/compat": "off" -- webpack is node env */

const fs = require('fs');
const path = require('path');
const slash = require('slash');
const validator = require('html-validator');
const weblog = require('webpack-log');
const { argv } = require('yargs');

const ENV = require('./app.env');
const UTILS = require('./webpack.utils');

const logger = weblog({ name: 'html-validator' });

const ignoreLines = fs.readFileSync('./.htmlignore')
    .toString().trim().split('\n')
    .map((line) => line.toLowerCase().trim());

const ignoreTest = (message) => {
    const lowerMessage = message.toLowerCase().trim();
    return ignoreLines.some((line) => line.includes(lowerMessage));
};

const errorsLogger = {
    error: logger.error,
    'non-document-error': logger.error,
    info: logger.info,
    warning: logger.warn,
};

async function validatorAsync(options) {
    const result = await validator(options);
    return result;
}

const verbose = 'verbose' in argv && argv.verbose;
const pathSuffix = argv.pathSuffix && typeof (argv.pathSuffix) === 'string' ? argv.pathSuffix : '';

UTILS.glob(ENV.OUTPUT_PATH + (pathSuffix ? `/${pathSuffix.trim('/')}` : '/**/*.html'), {
    ignore: [],
    nodir: true,
}).then(async (files) => {
    logger.info(`${files.length} files\n`);

    const statMessages = { skipped: 0 };
    const increaseStat = (type) => {
        if (type in statMessages) statMessages[type] += 1;
        else statMessages[type] = 1;
    };

    const promises = files.map(async (resourcePath) => {
        const relativePath = slash(path.relative(__dirname, resourcePath));
        const html = fs.readFileSync(resourcePath, 'utf8').toString();
        const result = await validatorAsync({ format: 'json', data: html });

        let skipped = false;

        if (path.basename(resourcePath).startsWith('_')) {
            if (verbose) logger.info(`skipped ${relativePath}`);
            increaseStat('skipped');
            skipped = true;
        } else if (result.messages && result.messages.length > 0) {
            skipped = false;
            result.messages.forEach((message) => {
                if (message.message && ignoreTest(message.message)) {
                    increaseStat(`${message.type}-ignored`);
                    return;
                }
                if (message.type === 'error') {
                    process.exitCode = 1;
                }
                increaseStat(message.type);

                const log = errorsLogger[message.type] || logger.error;
                log(`${relativePath}: line ${message.lastLine || 0} col [${message.firstColumn || 0}-${message.lastColumn || 0}]`);
                log(`${message.type}: ${message.message}`);

                const ellipsis = message.extract.trim();
                console.log(`...${ellipsis}...`);
                console.log('');
            });
        } else {
            skipped = true;
        }

        if (skipped) {
            increaseStat('skipped');
            if (verbose) logger.info(`skipped ${relativePath}`);
        }
        return result;
    });
    await Promise.all(promises);

    console.log('');
    logger.info('stats:', statMessages);
});
