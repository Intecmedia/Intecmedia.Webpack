const fs = require('node:fs');
const path = require('node:path');
const weblog = require('webpack-log');

const logger = weblog({ name: 'utf-fix' });
const ENV = require('./app.env');
const UTILS = require('./webpack.utils');

const VERBOSE = ENV.ARGV.verbose;

const statMessages = { fixed: 0, skipped: 0 };

const stripWhitespaces = (string) => {
    let result = string;

    if (result.charCodeAt(0) === 0xfeff) {
        result = result.slice(1);
    }

    result = result
        .replace(/\r\n/g, '\n')
        .replace(/\t/g, '    ')
        .replace(/[ \t]+\n/g, '\n');

    return result;
};

const files = UTILS.globArraySync(
    [
        path.join(__dirname, '.husky/**/*'),
        path.join(__dirname, '**/*.htaccess'),
        path.join(__dirname, '.fonts-subsets'),
        path.join(__dirname, '.*ignore'),
        path.join(__dirname, '*.{js,json}'),
        `${ENV.SOURCE_PATH}/**/*.{html,svg,js,json,css,scss,njk}`,
    ],
    {
        ignore: [`${ENV.OUTPUT_PATH}/**/*`],
        dot: true,
        nodir: true,
    },
);

logger.info(`${files.length} files\n`);

files.forEach((resourcePath) => {
    const resourceStat = fs.lstatSync(resourcePath);
    if (!resourceStat.isFile()) return;

    const relativePath = UTILS.slash(path.relative(__dirname, resourcePath));
    const source = fs.readFileSync(resourcePath, 'utf8').toString();
    const fixedSource = stripWhitespaces(source.normalize('NFC'));

    if (fixedSource === source) {
        statMessages.skipped += 1;
        if (VERBOSE) {
            logger.info(`skiped ${relativePath}`);
        }
    } else {
        statMessages.fixed += 1;
        fs.writeFileSync(resourcePath, fixedSource);
        logger.info(`fixed ${relativePath}`);
    }
});

console.log('');
logger.info('stats:', statMessages);
