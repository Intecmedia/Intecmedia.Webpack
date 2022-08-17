/* eslint-env node -- webpack is node env */
/* eslint max-len: "off", "compat/compat": "off" -- webpack is node env */

const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const createHash = require('webpack/lib/util/createHash');
const weblog = require('webpack-log');

const logger = weblog({ name: 'update-package' });
const hashFilepath = path.resolve('./package-lock.hash');
const lockFilepath = path.resolve('./package-lock.json');

const currentFilehash = fs.existsSync(hashFilepath) ? fs.readFileSync(hashFilepath).toString() : null;
const lockFilehash = () => createHash('xxhash64').update(fs.readFileSync(lockFilepath).toString()).digest('hex');
const hashOnly = process.argv.slice(2).includes('--hash-only');

if (!currentFilehash || currentFilehash !== lockFilehash()) {
    if (!hashOnly) {
        logger.info('npm install...');
        childProcess.execSync('npm install', { stdio: 'inherit' });
    }
    fs.writeFileSync(hashFilepath, lockFilehash());
    logger.info('updated package-lock.hash');
    console.log('');
}