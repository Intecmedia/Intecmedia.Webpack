const fs = require('fs');
const semver = require('semver');
const childProcess = require('child_process');
const weblog = require('webpack-log');

const logger = weblog({ name: 'app-lint' });
const APP = require('./app.config');
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
}
if (APP.TITLE.trim() === '') {
    lintErrors.push('empty `TITLE` in `app.config.js`');
}

if (APP.SHORT_NAME === '$APP.SHORT_NAME$' || APP.SHORT_NAME.trim() === '') {
    lintErrors.push('rename `SHORT_NAME` in `app.config.js`');
}
if (APP.SHORT_NAME.trim() === '') {
    lintErrors.push('empty `SHORT_NAME` in `app.config.js`');
}

if (APP.DESCRIPTION === '$APP.DESCRIPTION$') {
    lintErrors.push('rename `DESCRIPTION in `app.config.js`');
}
if (APP.DESCRIPTION.trim() === '') {
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
    lintErrors.push(`required \`npm@${PACKAGE.engines.npm}\` version (current is \`npm@${npmVersion.npm}\`)`);
}

if (!semver.satisfies(process.version, PACKAGE.engines.node)) {
    lintErrors.push(`required \`node@${PACKAGE.engines.node}\` version (current is \`node@${process.version}\`)`);
}

let fonttoolsVersion = null;
try {
    [, fonttoolsVersion] = childProcess
        .execSync('pip show fonttools')
        .toString()
        .match(/Version: (.+)/);
    childProcess.execSync('pyftsubset --help');
} catch (fonttoolsError) {
    fonttoolsVersion = null;
}

if (!fonttoolsVersion) {
    lintErrors.push(
        `required python fonttools@${PACKAGE.engines['@pip/fonttools']} version (please run \`pip install fonttools\`)`
    );
} else if (!semver.satisfies(fonttoolsVersion, PACKAGE.engines['@pip/fonttools'])) {
    lintErrors.push(
        `required python fonttools@${PACKAGE.engines['@pip/fonttools']} version (current is \`${fonttoolsVersion}\`)`
    );
}

let bashVersion = null;
try {
    bashVersion = childProcess.execSync('bash --version').toString();
} catch (fonttoolsError) {
    bashVersion = null;
}

if (!bashVersion) {
    if (process.platform === 'win32') {
        lintErrors.push('required bash (please install: `Git Bash` or `MinGW` or `Cygwin`)');
    } else {
        lintErrors.push('required bash');
    }
}

const yarnLock = fs.existsSync('./yarn.lock');
if (yarnLock) {
    lintErrors.push(
        [
            '`yarn.lock` found.',
            'Your project contains lock files generated by tools other than NPM.',
            'It is advised not to mix package managers in order to avoid resolution inconsistencies caused by unsynchronized lock files.',
            'To clear this error, remove `yarn.lock`.',
        ].join('\n')
    );
}

const pnpmLock = fs.existsSync('./pnpm-lock.yaml');
if (pnpmLock) {
    lintErrors.push(
        [
            '`pnpm-lock.yaml` found.',
            'Your project contains lock files generated by tools other than NPM.',
            'It is advised not to mix package managers in order to avoid resolution inconsistencies caused by unsynchronized lock files.',
            'To clear this error, remove `pnpm-lock.yaml`.',
        ].join('\n')
    );
}

lintWarns.forEach((i) => logger.warn(i));
lintErrors.forEach((i) => logger.error(i));

console.log('');
logger.info(`errors: ${lintErrors.length} warnings: ${lintWarns.length}\n`);

if (lintErrors.length > 0) {
    throw new Error('Something wrong...');
}
