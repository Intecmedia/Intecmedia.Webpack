const gm = require('gm');
const path = require('path');
const deasync = require('deasync');

const imageMagick = gm.subClass({ imageMagick: true });

module.exports = (filename) => {
    let result;
    imageMagick(path.join(process.cwd(), 'source', filename)).size((error, size) => {
        if (error) { throw error; }
        result = size;
    });
    deasync.loopWhile(() => result === undefined);
    return result;
};
