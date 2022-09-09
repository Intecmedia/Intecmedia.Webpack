const fs = require('fs');
const path = require('path');
const semver = require('semver');
const childProcess = require('child_process');
const createHash = require('webpack/lib/util/createHash');
const weblog = require('webpack-log');

const logger = weblog({ name: 'update' });
const silent = process.platform === 'win32' ? '|| exit 0' : '|| true';

logger.info('npm outdate...');
const outdated = Object.entries(JSON.parse(childProcess.execSync(`npm outdate --json ${silent}`).toString() || '{}'));

const missing = outdated.filter(([, version]) => !version.location || version.current !== version.wanted);
logger.info(`missing ${missing.length} packages`);

const installed = [];
missing.forEach(([pkg, version], index) => {
    logger.info(`#${index + 1}/${missing.length} ${pkg}`, version);

    const command = `npm install ${pkg}@${version.wanted}`;
    logger.info(`#${index + 1}/${missing.length} ${command}`);
    childProcess.execSync(command, { stdio: 'inherit' });

    installed.push([pkg, version]);
    console.log('');
});
logger.info(`installed ${installed.length} packages`);
console.log('');

logger.info('npm ls...');
const { dependencies } = require('./package.json');

const packages = Object.entries(
    JSON.parse(childProcess.execSync(`npm ls --json ${silent}`).toString() || '{}').dependencies || {}
).filter(
    ([pkg, meta]) =>
        dependencies[pkg] &&
        !/^\w+:/.test(dependencies[pkg]) &&
        (dependencies[pkg] === 'latest' || semver.minVersion(dependencies[pkg]).version !== meta.version)
);

const updated = [];
packages.forEach(([pkg, meta], index) => {
    logger.info(`#${index + 1}/${packages.length} ${pkg}@${meta.version} (${dependencies[pkg]})`);

    const command = `npm install ${pkg}@${meta.version}`;
    logger.info(`#${index + 1}/${packages.length} ${command}`);
    childProcess.execSync(command, { stdio: 'inherit' });

    updated.push([pkg, meta.version]);
    console.log('');
});
logger.info(`updated ${updated.length} packages`);

childProcess.execSync('npm update', { stdio: 'inherit' });
childProcess.execSync('npm dedupe', { stdio: 'inherit' });

const hashFilepath = path.resolve('./package-lock.hash');
const lockFilepath = path.resolve('./package-lock.json');

const makeFilehash = () => createHash('xxhash64').update(fs.readFileSync(lockFilepath).toString()).digest('hex');
fs.writeFileSync(hashFilepath, makeFilehash());
logger.info('updated package-lock.hash');

console.log('');
