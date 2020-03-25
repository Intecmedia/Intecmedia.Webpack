/* eslint-env node */
/* eslint max-len: "off", "compat/compat": "off" */
const childProcess = require('child_process');

console.log('npm outdate\n');
childProcess.exec('npm outdate --json', (err, stdout, stderr) => {
    if (stderr) throw stderr;

    const outdated = Object.entries(JSON.parse(stdout));

    const missing = outdated.filter(([, pkgVersion]) => pkgVersion.location === '');
    console.log(`missing: ${missing.length} packages\n`);

    // install missing package
    missing.forEach(([pkgName, pkgVersion]) => {
        if (pkgVersion.location === '') { // missing package
            const command = `npm install ${pkgName}@${pkgVersion.wanted}\n`;
            childProcess.exec(command);
            console.log(command);
        }
    });
});
