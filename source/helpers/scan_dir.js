const fs = require('node:fs');
const path = require('node:path');
const UTILS = require('../../webpack.utils');

const glob = require('glob');
const frontMatter = require('front-matter');

/**
 * Scan templates directory, read front-matter data and ordering.
 * @param {string} dirname - directory path
 * @param {string} orderKey - order key
 * @param {string} orderAsc - order direction
 * @returns {Array.object} - array of front-matter data
 */
function helperScanDir(dirname, orderKey = null, orderAsc = true) {
    const fullpath = path.join(process.cwd(), 'source', dirname);
    this.loaderContext.addContextDependency(fullpath);
    return glob
        .sync(UTILS.slash(path.join(fullpath, '*.html')), {
            ignore: ['_*.html', 'index.html'],
        })
        .map((filename) => {
            const template = fs.readFileSync(filename, 'utf8').toString();
            const templateData = frontMatter(template);

            const resourcePath = path.posix.sep + path.relative(this.loaderOptions.searchPath, filename);
            const baseName = path.basename(filename, '.html');

            const resourceUrl = path.dirname(resourcePath) + (baseName === 'index' ? '' : path.posix.sep + baseName) + path.posix.sep;

            const stat = fs.statSync(filename);
            const URL = UTILS.slash(path.normalize(path.join(this.APP.PUBLIC_PATH, resourceUrl)));
            const PATH = UTILS.slash(path.normalize(resourcePath));

            return {
                ...templateData.attributes,
                URL,
                PATH,
                BASENAME: baseName,
                STAT: stat,
            };
        })
        .sort((a, b) => {
            if (!orderKey) return 0;
            if (!Object.prototype.hasOwnProperty.call(a, orderKey)) return 0;
            if (!Object.prototype.hasOwnProperty.call(b, orderKey)) return 0;
            const comparison = a[orderKey].localeCompare(b[orderKey]);
            return orderAsc ? comparison : comparison * -1;
        });
}
module.exports = helperScanDir;
