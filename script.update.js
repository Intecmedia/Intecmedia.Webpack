/* eslint-env node */
/* eslint "compat/compat": "off" */
const childProcess = require('child_process');

console.log('npm outdate');
childProcess.exec('npm outdate --json', (err, stdout, stderr) => {
    if (stderr) throw stderr;

    const outdated = Object.entries(JSON.parse(stdout));

    const missing = outdated.filter(([, pkgVersion]) => pkgVersion.location === '');
    console.log(`missing: ${missing.length} packages`);

    // install missing package
    missing.forEach(([pkgName, pkgVersion]) => {
        const installCommand = `npm install ${pkgName}@${pkgVersion.wanted}`;
        console.log(installCommand);
        childProcess.execSync(installCommand, { stdio: 'inherit' });
    });
});
