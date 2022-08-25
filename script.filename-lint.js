/* eslint-env node -- webpack is node env */
/* eslint max-len: "off", "compat/compat": "off" -- webpack is node env */

const path = require('path');
const slash = require('slash');
const weblog = require('webpack-log');

const UTILS = require('./webpack.utils');
const config = require('./.filenamelintrc.json');

const logger = weblog({ name: 'filename-lint' });
const statMessages = { skipped: 0, failed: 0 };

config.rules.forEach((rule) => {
    const files = UTILS.globSync(rule.pattern, {
        ignore: rule.ignore,
        nodir: true,
    });
    const pattern = new RegExp(rule.test);

    files.forEach((resourcePath) => {
        const relativePath = slash(path.relative(__dirname, resourcePath));
        const filename = path.basename(resourcePath);

        if (pattern.test(filename)) {
            statMessages.skipped += 1;
        } else {
            logger.error(`Expected file name "${relativePath}" to match pattern "${rule.test}"`);
            statMessages.failed += 1;
            process.exitCode = 1;
        }
    });
});

console.log('');
logger.info('stats:', statMessages);
