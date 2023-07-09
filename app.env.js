const fs = require('fs');
const path = require('path');
const glob = require('glob');
const slash = require('slash');
const frontMatter = require('front-matter');

const APP = require('./app.config');
const UTILS = require('./webpack.utils');
const PACKAGE = require('./package.json');

const realcwd = fs.realpathSync(process.cwd());
if (process.cwd() !== realcwd) {
    throw new Error(`Use real path ${JSON.stringify(realcwd)} instead symlink ${JSON.stringify(process.cwd())}.`);
}

const ARGV = { ...UTILS.processArgs.env };
const DEBUG = 'DEBUG' in process.env && parseInt(process.env.DEBUG, 10) > 0;
const DEV_SERVER = 'WEBPACK_DEV_SERVER' in process.env && process.env.WEBPACK_DEV_SERVER === 'true';
const STANDALONE =
    require.main && ['webpack', 'webpack-dev-server'].includes(path.basename(require.main.filename, '.js'));
const WATCH = process.argv.includes('--watch') || process.argv.includes('-w');
const PROD = process.env.NODE_ENV !== 'development';
const NODE_ENV = PROD ? 'production' : 'development';

const VERBOSE = NODE_ENV === 'development' || DEBUG;
const SOURCE_MAP = DEBUG || !PROD || DEV_SERVER;

const SOURCE_PATH = path.resolve(__dirname, 'source');
const OUTPUT_PATH = path.resolve(__dirname, APP.OUTPUT_PATH ? APP.OUTPUT_PATH : 'build');

process.env.DEBUG = DEBUG;
process.env.NODE_ENV = NODE_ENV;

if (!['production', 'development'].includes(NODE_ENV)) {
    throw new Error(`Unknow NODE_ENV=${JSON.stringify(NODE_ENV)}`);
}

const IGNORE_PATTERN = /\/_/;
const SITEMAP = glob
    .sync(`${slash(SOURCE_PATH)}/**/*.{html,njk}`, {
        ignore: [`${slash(SOURCE_PATH)}/partials/**/*.html`, `${slash(SOURCE_PATH)}/upload/**/*.html`],
    })
    .map((item) => {
        const basename = path.basename(item, path.extname(item));
        const template = slash(path.relative(__dirname, item));
        const ignored = basename.startsWith('_') || IGNORE_PATTERN.test(template);
        const extension = (path.extname(basename) || path.extname(item)).substring(1);
        const noindex = ignored || extension !== 'html';

        const filename = slash(
            basename === 'index'
                ? path.join(path.relative(SOURCE_PATH, item))
                : path.join(
                      path.relative(SOURCE_PATH, path.dirname(item)),
                      ...(noindex
                          ? [extension !== 'html' ? basename : `${basename}.${extension}`]
                          : [basename, 'index.html'])
                  )
        );
        const url = slash(
            filename.endsWith('index.html') ? filename.substring(0, filename.length - 'index.html'.length) : filename
        );

        const stat = fs.statSync(item);
        const templateSource = fs.readFileSync(item, 'utf8').toString();
        const templateData = frontMatter.test(templateSource) ? frontMatter(templateSource) : {};
        const PAGE = {
            ...templateData.attributes,
            URL: slash(path.normalize(path.join(APP.PUBLIC_PATH, url))),
            PATH: slash(path.normalize(item)),
            BASENAME: basename,
            STAT: stat,
        };

        return {
            template,
            filename,
            extension,
            ignored,
            url,
            PAGE,
        };
    });

const BANNER_STRING = [
    `[${PACKAGE.name}]: ENV.NODE_ENV=${NODE_ENV} | ENV.DEBUG=${DEBUG}`,
    fs.readFileSync(path.join(SOURCE_PATH, 'humans.txt')),
].join('\n\n');

module.exports = {
    ARGV,
    DEBUG,
    DEV_SERVER,
    STANDALONE,
    WATCH,
    PROD,
    NODE_ENV,
    SOURCE_MAP,
    SOURCE_PATH,
    OUTPUT_PATH,
    PACKAGE_NAME: PACKAGE.name,
    BROWSERSLIST: PACKAGE.browserslist,
    BROWSERS: DEBUG ? PACKAGE.browserslist.production : PACKAGE.browserslist[NODE_ENV],
    SITEMAP,
    VERBOSE,
    BANNER_STRING,
};
