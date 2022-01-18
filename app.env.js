/* eslint-env node -- webpack is node env */
/* eslint "compat/compat": "off" -- webpack is node env */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const slash = require('slash');

const argv = require('yargs/yargs')(process.argv.slice(2))
    .option('env', { default: [], type: 'array' }).parse();

const ARGV = Object.fromEntries(argv.env.map((i) => {
    const [k, v = true] = i.split('=', 2);
    return [k, v];
}));

const DEBUG = ('DEBUG' in process.env && parseInt(process.env.DEBUG, 10) > 0);
const DEV_SERVER = ('WEBPACK_DEV_SERVER' in process.env && process.env.WEBPACK_DEV_SERVER === 'true');
const STANDALONE = ['webpack', 'webpack-dev-server'].includes(path.basename(require.main.filename, '.js'));
const WATCH = (process.argv.includes('--watch')) || (process.argv.includes('-w'));
const PROD = (process.env.NODE_ENV === 'production');
const NODE_ENV = PROD ? 'production' : 'development';

const VERBOSE = (NODE_ENV === 'development' || DEBUG);
const SOURCE_MAP = DEBUG || !PROD || DEV_SERVER;

const { name: PACKAGE_NAME, browserslist } = require('./package.json');

const SOURCE_PATH = path.resolve(__dirname, 'source');
const OUTPUT_PATH = path.resolve(__dirname, 'build');

process.env.DEBUG = DEBUG;
process.env.NODE_ENV = NODE_ENV;

if (!['production', 'development'].includes(NODE_ENV)) {
    throw new Error(`Unknow NODE_ENV=${JSON.stringify(NODE_ENV)}`);
}

const IGNORE_PATTERN = /\/_/;
const SITEMAP = glob.sync(`${slash(SOURCE_PATH)}/**/*.html`, {
    ignore: [
        `${slash(SOURCE_PATH)}/partials/**/*.html`,
        `${slash(SOURCE_PATH)}/upload/**/*.html`,
    ],
}).map((i) => {
    const basename = path.basename(i, '.html');
    const template = slash(path.relative(__dirname, i));
    const underscored = basename.startsWith('_') || IGNORE_PATTERN.test(template);
    const filename = slash(basename === 'index' ? path.join(
        path.relative(SOURCE_PATH, i),
    ) : path.join(
        path.relative(SOURCE_PATH, path.dirname(i)),
        ...(underscored ? [`${basename}.html`] : [basename, 'index.html']),
    ));
    const url = slash(path.dirname(filename)) + (underscored ? '' : path.posix.sep);
    return {
        template,
        filename,
        url: (url === './' ? '' : url),
    };
});

const BANNER_STRING = [
    `[${PACKAGE_NAME}]: ENV.NODE_ENV=${NODE_ENV} | ENV.DEBUG=${DEBUG}`,
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
    PACKAGE_NAME,
    BROWSERSLIST: browserslist,
    BROWSERS: DEBUG ? browserslist.production : browserslist[NODE_ENV],
    SITEMAP,
    VERBOSE,
    BANNER_STRING,
};
