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

if (process.platform === 'win32') {
    childProcess.execSync('chcp 65001');
}

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

const npmVersion = JSON.parse(childProcess.execSync('npm version --json').toString() || '{}');

if (!semver.satisfies(npmVersion.npm, PACKAGE.engines.npm)) {
    lintErrors.push(`required node@${PACKAGE.engines.npm} version (current is node@${npmVersion.node})`);
}

if (!semver.satisfies(npmVersion.node, PACKAGE.engines.node)) {
    lintErrors.push(`required npm@${PACKAGE.engines.npm} version (current is npm@${npmVersion.npm})`);
}

let imagemagickVersion = null;
try {
    [, imagemagickVersion] = childProcess.execSync('magick -version').toString().match(/Version: ImageMagick ([\d.-]+)/);
} catch (imagemagickError) {
    imagemagickVersion = null;
}

if (!semver.satisfies(imagemagickVersion, PACKAGE.engines.imagemagick)) {
    lintErrors.push(`required ImageMagick@${PACKAGE.engines.imagemagick} version (current is ImageMagick@${imagemagickVersion})`);
}

let fonttoolsVersion = null;
try {
    [, fonttoolsVersion] = childProcess.execSync('pip show fonttools').toString().match(/Version: ([\d.-]+)/);
} catch (fonttoolsError) {
    fonttoolsVersion = null;
}

if (!semver.satisfies(fonttoolsVersion, PACKAGE.engines.fonttools)) {
    lintErrors.push(`required fonttools@${PACKAGE.engines.fonttools} version (current is fonttools@${fonttoolsVersion})`);
}

lintWarns.forEach((i) => logger.warn(i));
lintErrors.forEach((i) => logger.error(i));

console.log('');
logger.info(`errors: ${lintErrors.length} warnings: ${lintWarns.length}\n`);

if (lintErrors.length > 0) {
    // process.exit(1);
}
