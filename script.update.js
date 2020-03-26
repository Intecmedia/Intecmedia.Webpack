/* eslint-env node */
/* eslint "compat/compat": "off" */
const childProcess = require('child_process');

const weblog = require('webpack-log');

const logger = weblog({ name: 'update' });

logger.info('npm outdate');
childProcess.exec('npm outdate --json', (err, stdout, stderr) => {
    if (stderr) throw stderr;

    const outdated = Object.entries(JSON.parse(stdout));

    const missing = outdated.filter(([, pkgVersion]) => pkgVersion.location === '');
    logger.info(`${missing.length} missing packages`);

    const installed = [];
    missing.forEach(([pkgName, pkgVersion], pkgIndex) => {
        const installCommand = `npm install ${pkgName}@${pkgVersion.wanted}`;
        logger.info(`\n#${pkgIndex + 1} ${installCommand}`);
        childProcess.execSync(installCommand, { stdio: 'inherit' });
        installed.push([pkgName, pkgVersion]);
    });

    logger.info(`${installed.length} installed packages`);
});
