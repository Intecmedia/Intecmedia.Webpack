const path = require('path');
const slash = require('slash');
const micromatch = require('micromatch');
const weblog = require('webpack-log');

const ENV = require('./app.env');
const UTILS = require('./webpack.utils');
const config = require('./.filenamelintrc.json');

const logger = weblog({ name: 'filename-lint' });
const lintIgnore = UTILS.readIgnoreFile('./.filenamelintignore');
const statMessages = { skipped: 0, errors: 0, ignored: 0 };

const patterns = [...UTILS.processArgs._];

config.rules
    .filter((rule) => (patterns.length > 0 ? patterns.some((i) => micromatch.isMatch(i, rule.pattern)) : true))
    .forEach((rule) => {
        const files = UTILS.globSync(rule.pattern, {
            ignore: [...rule.ignore, `${ENV.OUTPUT_PATH}/**/*`],
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

            if (patterns.length > 0 && !patterns.some((i) => micromatch.isMatch(i, relativePath))) {
                return;
            }

            if (ruleTest.test(filename)) {
                statMessages.skipped += 1;
            } else {
                logger.error(`${relativePath}: expected to match "${rule.convention}" convention.`, ruleTest);
                statMessages.errors += 1;
                process.exitCode = 1;
            }
        });
    });

console.log('');
logger.info('stats:', statMessages);
