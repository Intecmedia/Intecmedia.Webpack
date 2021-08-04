/* eslint-env node -- webpack is node env */
/* eslint "compat/compat": "off" -- webpack is node env */
const childProcess = require('child_process');

const weblog = require('webpack-log');

const logger = weblog({ name: 'update' });

logger.info('npm outdate');
const outdated = Object.entries(JSON.parse(childProcess.execSync('npm outdate --json').toString() || '{}'));

const missing = outdated.filter(([, version]) => !version.location || version.current !== version.wanted);
logger.info(`missing ${missing.length} packages`);

const installed = [];
missing.forEach(([pkg, version], index) => {
    logger.info(`#${index + 1}/${missing.length} ${pkg}`, version);

    const command = (version.location ? `npm update ${pkg}` : `npm install ${pkg}@${version.wanted}`);
    logger.info(`#${index + 1}/${missing.length} ${command}`);
    childProcess.execSync(command, { stdio: 'inherit' });

    installed.push([pkg, version]);
    console.log('');
});

childProcess.execSync('npm update', { stdio: 'inherit' });

logger.info(`installed ${installed.length} packages`);
