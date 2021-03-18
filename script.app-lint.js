/* eslint-env node -- webpack is node env */
/* eslint "compat/compat": "off" -- webpack is node env */

const semver = require('semver');
const childProcess = require('child_process');
const weblog = require('webpack-log');

const logger = weblog({ name: 'app-lint' });
const APP = require('./app.config.js');
const PACKAGE = require('./package.json');

const lintWarns = [];
const lintErrors = [];

if (PACKAGE.name === 'Intecmedia.Webpack') {
    lintErrors.push('rename `name` in `package.json`');
}

if (APP.TITLE === '$APP.TITLE$' || APP.TITLE.trim() === '') {
    lintErrors.push('rename `TITLE` in `app.config.js`');
} else if (APP.TITLE.trim() === '') {
    lintErrors.push('empty `TITLE` in `app.config.js`');
}

if (APP.SHORT_NAME === '$APP.SHORT_NAME$' || APP.SHORT_NAME.trim() === '') {
    lintErrors.push('rename `SHORT_NAME` in `app.config.js`');
} else if (APP.SHORT_NAME.trim() === '') {
    lintErrors.push('empty `SHORT_NAME` in `app.config.js`');
}

if (APP.DESCRIPTION === '$APP.DESCRIPTION$') {
    lintErrors.push('rename `DESCRIPTION in `app.config.js`');
} else if (APP.DESCRIPTION.trim() === '') {
    lintErrors.push('empty `DESCRIPTION` in `app.config.js`');
}

if (APP.TITLE === APP.SHORT_NAME || APP.TITLE === APP.DESCRIPTION) {
    lintErrors.push('`TITLE` is equal `SHORT_NAME` or `DESCRIPTION`');
}
if (APP.SHORT_NAME === APP.TITLE || APP.SHORT_NAME === APP.DESCRIPTION) {
    lintErrors.push('`SHORT_NAME` is equal `TITLE` or `DESCRIPTION`');
}
if (APP.DESCRIPTION === APP.TITLE || APP.DESCRIPTION === APP.SHORT_NAME) {
    lintErrors.push('`DESCRIPTION` is equal `TITLE` or `SHORT_NAME`');
}

const version = JSON.parse(childProcess.execSync('npm version --json') || '{}');

if (!semver.satisfies(version.npm, PACKAGE.engines.npm)) {
    lintErrors.push(`required node@${PACKAGE.engines.npm} version (current is node@${version.node})`);
}

if (!semver.satisfies(version.node, PACKAGE.engines.node)) {
    lintErrors.push(`required npm@${PACKAGE.engines.npm} version (current is npm@${version.npm})`);
}

lintWarns.forEach((i) => logger.warn(i));
lintErrors.forEach((i) => logger.error(i));

console.log('');
logger.info(`errors: ${lintErrors.length} warnings: ${lintWarns.length}\n`);

if (lintErrors.length > 0) {
    // process.exit(1);
}
