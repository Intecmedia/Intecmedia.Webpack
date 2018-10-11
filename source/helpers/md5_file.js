const path = require('path');
const md5File = require('md5-file');

module.exports = (filename) => {
    const fullpath = path.join(process.cwd(), 'source', filename);
    return md5File.sync(fullpath);
};
