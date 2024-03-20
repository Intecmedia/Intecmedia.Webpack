const path = require('node:path');
const glob = require('glob');
const UTILS = require('../../webpack.utils');

module.exports = new Map(
    glob
        .sync(UTILS.slash(path.join(__dirname, '*.js')), {
            ignore: UTILS.slash(__filename),
        })
        .map((filename) => [path.basename(filename, '.js'), require(filename)])
);
