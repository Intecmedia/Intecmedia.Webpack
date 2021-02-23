/* eslint-env node -- webpack is node env */
/* eslint "compat/compat": "off" -- webpack is node env */
const childProcess = require('child_process');

const weblog = require('webpack-log');

const logger = weblog({ name: 'update' });

logger.info('npm outdate');
const outdated = Object.entries(JSON.parse(childProcess.execSync('npm outdate --json' || '{}')));

const missing = outdated.filter(([, version]) => !version.location || version.current !== version.wanted);
logger.info(`missing ${missing.length} packages`);

const installed = [];
missing.forEach(([pkg, version], index) => {
    logger.info(`#${index + 1} ${pkg}`, version);

    const command = (version.location ? `npm update ${pkg}` : `npm install ${pkg}@${version.wanted}`);
    logger.info(`#${index + 1} ${command}`);
    childProcess.execSync(command, { stdio: 'inherit' });

    installed.push([pkg, version]);
    console.log('');
});

logger.info(`installed ${installed.length} packages`);
