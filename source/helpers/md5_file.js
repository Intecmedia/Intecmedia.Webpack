const fs = require('fs');
const MD5 = require('md5.js');

module.exports = function md5file(filename) {
    const hash = new MD5();
    if (fs.existsSync(filename)) {
        hash.update(fs.readFileSync(filename));
        return hash.digest('hex');
    }
    return '';
};
