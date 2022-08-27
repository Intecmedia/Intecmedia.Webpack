/* eslint-env node -- webpack is node env */
/* eslint max-len: "off", "compat/compat": "off" -- webpack is node env */

const fs = require('fs');
const path = require('path');
const slash = require('slash');
const minimatch = require('minimatch');
const ignore = require('ignore');
const weblog = require('webpack-log');

const UTILS = require('./webpack.utils');
const config = require('./.filenamelintrc.json');

const logger = weblog({ name: 'filename-lint' });
const lintIgnore = ignore().add(fs.readFileSync('./.filenamelintignore').toString());
const statMessages = { skipped: 0, errors: 0, ignored: 0 };

const patterns = process.argv.slice(2).map((i) => i.trim()).filter((i) => i.length > 0);

config.rules.filter((rule) => (
    (patterns.length > 0 ? patterns.some((i) => minimatch(i, rule.pattern)) : true)
)).forEach((rule) => {
    const files = UTILS.globSync(rule.pattern, {
        ignore: rule.ignore,
        nodir: true,
    });
    const ruleTest = new RegExp(rule.test);

    files.forEach((resourcePath) => {
        const relativePath = slash(path.relative(__dirname, resourcePath));
        if (lintIgnore.ignores(relativePath)) {
            statMessages.ignored += 1;
            logger.info(`${relativePath}: ignored`);
            return;
        }

        const filename = path.basename(resourcePath);

        if (patterns.length > 0 && !patterns.some((i) => minimatch(i, relativePath))) {
            return;
        }

        if (ruleTest.test(filename)) {
            statMessages.skipped += 1;
        } else {
            logger.error(`${relativePath}: expected to match ${rule.convention} convention`, ruleTest);
            statMessages.errors += 1;
            process.exitCode = 1;
        }
    });
});

console.log('');
logger.info('stats:', statMessages);
