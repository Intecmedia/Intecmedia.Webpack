/* eslint-env node -- webpack is node env */
/* eslint "compat/compat": "off" -- webpack is node env */

const fs = require('fs');
const path = require('path');
const slash = require('slash');

const glob = require('glob');
const frontMatter = require('front-matter');

module.exports = function helper(dirname, orderKey = null, orderAsc = true) {
    const fullpath = path.join(process.cwd(), 'source', dirname);
    this.loaderContext.addContextDependency(fullpath);
    return glob.sync(slash(path.join(fullpath, '*.html')), {
        ignore: 'index.html',
    }).map((filename) => {
        const template = fs.readFileSync(filename, 'utf8').toString();
        const { attributes } = frontMatter(template);

        const resourcePath = path.posix.sep + path.relative(this.loaderOptions.searchPath, filename);
        const baseName = path.basename(filename, '.html');

        const resourceUrl = path.dirname(resourcePath) + (
            baseName === 'index' ? '' : path.posix.sep + baseName
        ) + path.posix.sep;

        const URL = slash(path.normalize(path.join(this.APP.PUBLIC_PATH, resourceUrl)));
        const PATH = slash(path.normalize(resourcePath));

        return {
            URL, PATH, BASENAME: baseName, ...attributes,
        };
    }).sort((a, b) => {
        if (!orderKey) return 0;
        if (!Object.prototype.hasOwnProperty.call(a, orderKey)) return 0;
        if (!Object.prototype.hasOwnProperty.call(b, orderKey)) return 0;
        const comparison = a[orderKey].localeCompare(b[orderKey]);
        return (orderAsc ? comparison : (comparison * -1));
    });
};
