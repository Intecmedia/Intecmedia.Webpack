const path = require('path');
const glob = require('glob');
const slash = require('slash');

module.exports = new Map(
    glob
        .sync(slash(path.join(__dirname, '*.js')), {
            ignore: slash(__filename),
        })
        .map((filename) => [path.basename(filename, '.js'), require(filename)])
);
