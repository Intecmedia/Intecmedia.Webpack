const fs = require('fs');
const path = require('path');
const slash = require('slash');
const weblog = require('webpack-log');
const htmlValidate = require('html-validate');

const ENV = require('./app.env');
const UTILS = require('./webpack.utils');

const logger = weblog({ name: 'html-validate' });

const ignoreLines = fs
    .readFileSync('./.htmlignore')
    .toString()
    .trim()
    .split('\n')
    .map((line) => line.toLowerCase().trim());

const ignoreTest = (message) => {
    const lowerMessage = message.toLowerCase().trim();
    return ignoreLines.some((line) => line.includes(lowerMessage));
};

const lineEllipsis = 80;
const options = require('./.htmlvalidaterc');

const resolvers = [htmlValidate.nodejsResolver({ rootDir: __dirname })];
const loader = new htmlValidate.StaticConfigLoader(resolvers, { ...options });
const htmlvalidate = new htmlValidate.HtmlValidate(loader);

const patterns = [...UTILS.processArgs._];

UTILS.globArray(patterns.length > 0 ? patterns : [`${ENV.OUTPUT_PATH}/**/*.html`], {
    ignore: [`${ENV.SOURCE_PATH}/**/*.html`],
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

        if (path.basename(resourcePath).startsWith('_')) {
            logger.info(`skipped ${relativePath}`);
            increaseStat('skipped');
            return;
        }

        const html = fs.readFileSync(resourcePath).toString('utf-8');
        const report = await htmlvalidate.validateFile(resourcePath);

        if (report.results.length === 0) {
            logger.info(`skipped ${relativePath}`);
            increaseStat('skipped');
            return;
        }

        report.results.forEach((result) => {
            result.messages.forEach((message) => {
                const messageType = message.severity === 2 ? 'error' : 'warning';
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
    await Promise.all(promises);

    console.log('');
    logger.info('stats:', statMessages);
});
