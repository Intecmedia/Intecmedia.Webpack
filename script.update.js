/* eslint-env node */
/* eslint "compat/compat": "off" */
const childProcess = require('child_process');

const weblog = require('webpack-log');

const logger = weblog({ name: 'update' });

logger.info('npm update');
childProcess.execSync('npm update', { stdio: 'inherit' });
console.log('');

logger.info('npm outdate');
childProcess.exec('npm outdate --json', (err, stdout, stderr) => {
    if (stderr) throw stderr;

    const outdated = Object.entries(JSON.parse(stdout));

    const missing = outdated.filter(([, pkgVersion]) => !pkgVersion.location);
    logger.info(`missing ${missing.length} packages`);

    const installed = [];
    missing.forEach(([pkgName, pkgVersion], pkgIndex) => {
        logger.info(`#${pkgIndex + 1} ${pkgName}`, pkgVersion);

        const installCommand = `npm install ${pkgName}@${pkgVersion.wanted}`;
        logger.info(`#${pkgIndex + 1} ${installCommand}`);
        childProcess.execSync(installCommand, { stdio: 'inherit' });

        installed.push([pkgName, pkgVersion]);
        console.log('');
    });

    logger.info(`installed ${installed.length} packages`);

    logger.info('npm audit fix');
    childProcess.execSync('npm audit fix', { stdio: 'inherit' });
});
