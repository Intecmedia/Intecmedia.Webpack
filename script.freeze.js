/* eslint-env node -- webpack is node env */
/* eslint "compat/compat": "off" -- webpack is node env */
const semver = require('semver');
const childProcess = require('child_process');

const weblog = require('webpack-log');
const { dependencies } = require('./package.json');

const logger = weblog({ name: 'freeze' });

logger.info('npm ls');
const silent = (process.platform === 'win32' ? '|| exit 0' : '|| true');
const packages = Object.entries(JSON.parse(
    childProcess.execSync(`npm ls --json ${silent}`).toString() || '{}',
).dependencies || {}).filter(([pkg, meta]) => (
    dependencies[pkg] && 
    !dependencies[pkg].startsWith('file:') &&
    semver.minVersion(dependencies[pkg]).version !== meta.version
));

logger.info(`${packages.length} packages`);

const freezed = [];
packages.forEach(([pkg, meta], index) => {
    logger.info(`#${index + 1}/${packages.length} ${pkg}`, meta.version);

    const command = `npm install ${pkg}@${meta.version}`;
    logger.info(`#${index + 1}/${packages.length} ${command}`);
    childProcess.execSync(command, { stdio: 'inherit' });

    freezed.push([pkg, meta.version]);
    console.log('');
});

logger.info(`freezed ${freezed.length} packages`);
